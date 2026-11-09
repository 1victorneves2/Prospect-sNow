import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { test } from 'node:test'
import worker from './index.mjs'

test('protege busca e salva somente identificador por usuário', async () => {
  const db = new DatabaseSync(':memory:')
  db.exec(readFileSync('drizzle/0000_good_iron_man.sql', 'utf8'))
  const DB = {
    prepare(sql) {
      return {
        bind(...args) {
          const s = db.prepare(sql)
          return {
            async first() {
              return s.get(...args) || null
            },
            async all() {
              return { results: s.all(...args) }
            },
            async run() {
              return { meta: { changes: Number(s.run(...args).changes) } }
            },
          }
        },
      }
    },
  }
  const env = { DB, GOOGLE_MAPS_API_KEY: 'test-secret' }
  const request = (
    path,
    { method = 'GET', user = 'owner-a', body, origin = 'https://example.test' } = {},
  ) =>
    new Request(`https://example.test${path}`, {
      method,
      headers: {
        ...(user ? { 'oai-authenticated-user-id': user } : {}),
        ...(method === 'POST' ? { origin, 'content-type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
  assert.equal((await worker.fetch(request('/api/status', { user: '' }), env)).status, 401)
  assert.equal(
    (
      await worker.fetch(
        request('/api/search', { method: 'POST', origin: 'https://other.test', body: {} }),
        env,
      )
    ).status,
    403,
  )
  assert.equal(
    (
      await worker.fetch(
        request('/api/search', { method: 'POST', body: { segment: 'moda', city: 'Manaus' } }),
        { DB },
      )
    ).status,
    503,
  )
  const originalFetch = globalThis.fetch
  try {
    globalThis.fetch = async (_url, options) => {
      assert.equal(options.headers['X-Goog-Api-Key'], 'test-secret')
      assert.equal(
        options.headers['X-Goog-FieldMask'],
        'places.id,places.displayName,places.formattedAddress',
      )
      return Response.json({
        places: [
          {
            id: 'place_123',
            displayName: { text: 'Nome retornado pelo Google' },
            formattedAddress: 'Endereço',
          },
        ],
      })
    }
    const search = await worker.fetch(
      request('/api/search', { method: 'POST', body: { segment: 'moda', city: 'Manaus' } }),
      env,
    )
    assert.equal(search.status, 200)
    assert.equal((await search.json()).places[0].id, 'place_123')
    const saved = await worker.fetch(
      request('/api/opportunities', { method: 'POST', body: { placeId: 'place_123' } }),
      env,
    )
    assert.equal(saved.status, 201)
    assert.equal(
      (
        await worker.fetch(
          request('/api/opportunities', { method: 'POST', body: { placeId: 'place_123' } }),
          env,
        )
      ).status,
      409,
    )
    const owner = await (await worker.fetch(request('/api/opportunities'), env)).json()
    const other = await (
      await worker.fetch(request('/api/opportunities', { user: 'owner-b' }), env)
    ).json()
    assert.equal(owner.opportunities.length, 1)
    assert.deepEqual(other.opportunities, [])
    assert.equal(JSON.stringify(owner).includes('Nome retornado pelo Google'), false)
    assert.equal(
      (
        await worker.fetch(
          request('/api/search', { method: 'POST', body: { segment: 'moda', city: 'Manaus' } }),
          env,
        )
      ).status,
      429,
    )
  } finally {
    globalThis.fetch = originalFetch
    db.close()
  }
})
