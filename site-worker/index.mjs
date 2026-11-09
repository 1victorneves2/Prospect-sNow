const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })

const requireUser = (request) => request.headers.get('oai-authenticated-user-id')
const validPlaceId = (value) => typeof value === 'string' && /^[A-Za-z0-9_-]{1,255}$/.test(value)

async function handleApi(request, env, url) {
  const userId = requireUser(request)
  if (!userId) return json({ error: 'Entre na sua conta para continuar.' }, 401)
  if (request.method !== 'GET' && request.headers.get('origin') !== url.origin) {
    return json({ error: 'Origem inválida.' }, 403)
  }

  if (url.pathname === '/api/status' && request.method === 'GET') {
    return json({
      placesConfigured: Boolean(env.GOOGLE_MAPS_API_KEY),
      storageConfigured: Boolean(env.DB),
    })
  }

  if (url.pathname === '/api/search' && request.method === 'POST') {
    if (!env.GOOGLE_MAPS_API_KEY)
      return json({ error: 'Configure a chave Google Places nas configurações do Site.' }, 503)
    if (!env.DB)
      return json(
        { error: 'Armazenamento indisponível; a pesquisa está temporariamente desativada.' },
        503,
      )
    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Pesquisa inválida.' }, 400)
    }
    if (!body || typeof body !== 'object' || Array.isArray(body))
      return json({ error: 'Pesquisa inválida.' }, 400)
    const segment = typeof body.segment === 'string' ? body.segment.trim() : ''
    const city = typeof body.city === 'string' ? body.city.trim() : ''
    if (segment.length < 2 || segment.length > 100 || city.length < 2 || city.length > 100) {
      return json({ error: 'Informe segmento e localidade com 2 a 100 caracteres.' }, 400)
    }
    const now = Date.now()
    const count = await env.DB.prepare(
      `INSERT INTO search_limits (owner_id, window_start, last_search, count)
      VALUES (?, ?, ?, 1)
      ON CONFLICT(owner_id) DO UPDATE SET
        count = CASE WHEN window_start <= ? THEN 1 ELSE count + 1 END,
        window_start = CASE WHEN window_start <= ? THEN ? ELSE window_start END,
        last_search = ?
      WHERE (window_start <= ? OR count < 30) AND last_search <= ?
      RETURNING count`,
    )
      .bind(userId, now, now, now - 86400000, now - 86400000, now, now, now - 86400000, now - 10000)
      .first()
    if (!count)
      return json(
        { error: 'Aguarde entre pesquisas ou tente novamente amanhã. Limite: 30 por dia.' },
        429,
      )
    let response
    try {
      response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': env.GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
        },
        body: JSON.stringify({
          textQuery: `${segment} em ${city}`,
          languageCode: 'pt-BR',
          maxResultCount: 10,
        }),
        signal: AbortSignal.timeout(15000),
      })
    } catch {
      return json({ error: 'Não foi possível conectar ao Google Places. Tente novamente.' }, 502)
    }
    if (!response.ok) {
      if (response.status === 429)
        return json(
          { error: 'Limite de consultas do Google atingido. Tente novamente mais tarde.' },
          429,
        )
      return json(
        {
          error:
            'A pesquisa não foi autorizada ou está indisponível. Verifique a chave, a API e o faturamento no Google Cloud.',
        },
        502,
      )
    }
    let data
    try {
      data = await response.json()
    } catch {
      return json({ error: 'Resposta inválida do Google Places.' }, 502)
    }
    const places = Array.isArray(data.places)
      ? data.places
          .filter((p) => validPlaceId(p.id))
          .map((p) => ({
            id: p.id,
            name: typeof p.displayName?.text === 'string' ? p.displayName.text : 'Empresa sem nome',
            address:
              typeof p.formattedAddress === 'string'
                ? p.formattedAddress
                : 'Endereço não informado',
          }))
      : []
    return json({ places })
  }

  if (url.pathname === '/api/opportunities' && request.method === 'GET') {
    if (!env.DB) return json({ error: 'Armazenamento indisponível.' }, 503)
    const result = await env.DB.prepare(
      'SELECT id, place_id AS placeId, label, created_at AS createdAt FROM opportunities WHERE owner_id = ? ORDER BY created_at DESC LIMIT 200',
    )
      .bind(userId)
      .all()
    return json({ opportunities: result.results })
  }

  if (url.pathname === '/api/opportunities' && request.method === 'POST') {
    if (!env.DB) return json({ error: 'Armazenamento indisponível.' }, 503)
    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Dados inválidos.' }, 400)
    }
    if (!body || typeof body !== 'object' || Array.isArray(body))
      return json({ error: 'Dados inválidos.' }, 400)
    const label = typeof body.label === 'string' ? body.label.trim() : ''
    if (!validPlaceId(body.placeId) || label.length > 100)
      return json({ error: 'Oportunidade inválida.' }, 400)
    const id = crypto.randomUUID()
    const createdAt = Date.now()
    const result = await env.DB.prepare(
      'INSERT OR IGNORE INTO opportunities (id, owner_id, place_id, label, created_at) VALUES (?, ?, ?, ?, ?)',
    )
      .bind(id, userId, body.placeId, label, createdAt)
      .run()
    if (!result.meta.changes) return json({ error: 'Esta empresa já foi salva.' }, 409)
    return json({ id, placeId: body.placeId, label, createdAt }, 201)
  }

  return json({ error: 'Não encontrado.' }, 404)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env, url)
      } catch {
        return json({ error: 'Não foi possível concluir a operação. Tente novamente.' }, 500)
      }
    }
    const path = url.pathname === '/' ? '/index.html' : url.pathname
    const asset = __ASSETS__[path]
    if (!asset) return new Response('Not found', { status: 404 })
    return new Response(
      Uint8Array.from(atob(asset.data), (c) => c.charCodeAt(0)),
      {
        headers: { 'Content-Type': asset.type, 'X-Content-Type-Options': 'nosniff' },
      },
    )
  },
}
