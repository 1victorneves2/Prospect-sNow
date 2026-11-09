import { useCallback, useEffect, useState } from 'react'
import { Building2, ExternalLink, MapPin, Search, ShieldCheck, Sparkles } from 'lucide-react'

type Place = { id: string; name: string; address: string }
type SavedOpportunity = { id: string; placeId: string; label: string; createdAt: number }

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, options)
  const data = await response.json()
  if (!response.ok)
    throw new Error(
      typeof data.error === 'string' ? data.error : 'Não foi possível concluir. Tente novamente.',
    )
  return data as T
}

function mapsLink(id: string) {
  return `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${encodeURIComponent(id)}`
}

export function RealProspecting({ onViewSaved }: { onViewSaved: () => void }) {
  const [city, setCity] = useState('Manaus, Amazonas')
  const [segment, setSegment] = useState('lojas de moda')
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [storageConfigured, setStorageConfigured] = useState<boolean | null>(null)
  const [results, setResults] = useState<Place[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [labels, setLabels] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    api<{ placesConfigured: boolean; storageConfigured: boolean }>('/api/status')
      .then((status) => {
        if (active) {
          setConfigured(status.placesConfigured)
          setStorageConfigured(status.storageConfigured)
        }
      })
      .catch(() => {
        if (active) setError('Não foi possível verificar a conexão. Atualize a página.')
      })
    api<{ opportunities: SavedOpportunity[] }>('/api/opportunities')
      .then((data) => {
        if (active) setSaved(new Set(data.opportunities.map((item) => item.placeId)))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  async function search(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    setResults(null)
    setLoading(true)
    try {
      const data = await api<{ places: Place[] }>('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, segment }),
      })
      setResults(data.places)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível pesquisar.')
    } finally {
      setLoading(false)
    }
  }

  async function save(place: Place) {
    setSaving(place.id)
    setError('')
    setMessage('')
    try {
      await api('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId: place.id, label: labels[place.id] || '' }),
      })
      setSaved((current) => new Set(current).add(place.id))
      setMessage('Oportunidade salva. Você pode encontrá-la em Oportunidades salvas.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar.')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="real-prospecting">
      <div className="real-heading">
        <div>
          <p className="eyebrow">PROSPECÇÃO · GOOGLE MAPS</p>
          <h1>
            Encontre sua próxima oportunidade<span> ✦</span>
          </h1>
          <p>Busque empresas, conheça o contexto e escolha quem merece sua atenção.</p>
        </div>
        <button className="real-link" onClick={onViewSaved}>
          Ver oportunidades salvas <span>→</span>
        </button>
      </div>
      <div className="real-intro">
        <div className="real-orbit">
          <Search size={25} />
        </div>
        <div>
          <strong>Comece com uma boa pergunta</strong>
          <p>Escolha um segmento e uma cidade. Você decide quais resultados salvar.</p>
        </div>
        <Sparkles size={22} />
      </div>
      {configured === false && (
        <div className="setup-callout" role="status">
          <strong>Falta conectar o Google Places</strong>
          <p>
            A pesquisa real estará disponível depois que a chave da API for configurada com
            segurança no Site. A chave nunca deve ser colocada nesta página.
          </p>
        </div>
      )}
      {storageConfigured === false && (
        <div className="setup-callout" role="status">
          <strong>Preparando o armazenamento</strong>
          <p>O salvamento de oportunidades ainda não está disponível.</p>
        </div>
      )}
      <form className="real-search" onSubmit={search}>
        <label>
          <span>O que você procura?</span>
          <div>
            <Building2 size={18} />
            <input
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              maxLength={100}
              required
              minLength={2}
              placeholder="Ex.: lojas de moda"
            />
          </div>
        </label>
        <label>
          <span>Onde?</span>
          <div>
            <MapPin size={18} />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              maxLength={100}
              required
              minLength={2}
              placeholder="Ex.: Manaus, Amazonas"
            />
          </div>
        </label>
        <button
          type="submit"
          disabled={loading || configured !== true || storageConfigured !== true}
        >
          <Search size={18} />
          {loading ? 'Pesquisando…' : 'Buscar empresas'}
        </button>
      </form>
      <p className="real-usage">
        <ShieldCheck size={15} /> Até 10 resultados por busca. As consultas ao Google podem gerar
        custos.
      </p>
      {error && (
        <p className="real-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="real-success" role="status">
          {message}
        </p>
      )}
      {results && (
        <section className="real-results" aria-label="Resultados do Google Maps">
          <div className="real-results-head">
            <div>
              <p className="eyebrow">PARA REVISAR</p>
              <h2>
                {results.length}{' '}
                {results.length === 1 ? 'empresa encontrada' : 'empresas encontradas'}
              </h2>
            </div>
            <span translate="no" className="google-attribution">
              Google Maps
            </span>
          </div>
          {results.length === 0 ? (
            <div className="real-empty">
              <strong>Nenhum resultado para esta busca.</strong>
              <p>Tente outro segmento ou uma cidade mais ampla.</p>
            </div>
          ) : (
            <div className="real-grid">
              {results.map((place) => (
                <article key={place.id} className="real-card">
                  <div className="real-card-top">
                    <span className="real-card-icon">
                      <Building2 size={20} />
                    </span>
                    <span className="source-tag">RESULTADO PARA REVISÃO</span>
                  </div>
                  <h3>{place.name}</h3>
                  <p>
                    <MapPin size={15} />
                    {place.address}
                  </p>
                  <label className="real-label">
                    Sua referência (opcional)
                    <input
                      maxLength={100}
                      value={labels[place.id] || ''}
                      onChange={(event) =>
                        setLabels((current) => ({ ...current, [place.id]: event.target.value }))
                      }
                      placeholder="Ex.: prioridade para terça"
                      disabled={saved.has(place.id)}
                    />
                  </label>
                  <div className="real-card-actions">
                    <a href={mapsLink(place.id)} target="_blank" rel="noreferrer">
                      Ver no Google Maps <ExternalLink size={14} />
                    </a>
                    <button
                      disabled={saved.has(place.id) || saving !== null}
                      onClick={() => save(place)}
                    >
                      {saved.has(place.id)
                        ? 'Salva ✓'
                        : saving === place.id
                          ? 'Salvando…'
                          : 'Salvar oportunidade'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
      {!results && !loading && (
        <div className="real-empty">
          <span>✦</span>
          <strong>Sua próxima conversa começa aqui.</strong>
          <p>Os resultados aparecem após uma busca e só são salvos quando você escolher.</p>
        </div>
      )}
    </div>
  )
}

export function SavedOpportunities({ onSearch }: { onSearch: () => void }) {
  const [items, setItems] = useState<SavedOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = useCallback(() => {
    setLoading(true)
    setError('')
    api<{ opportunities: SavedOpportunity[] }>('/api/opportunities')
      .then((data) => setItems(data.opportunities))
      .catch((err) => setError(err instanceof Error ? err.message : 'Não foi possível carregar.'))
      .finally(() => setLoading(false))
  }, [])
  useEffect(() => {
    let active = true
    api<{ opportunities: SavedOpportunity[] }>('/api/opportunities')
      .then((data) => {
        if (active) setItems(data.opportunities)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Não foi possível carregar.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])
  return (
    <div className="real-prospecting">
      <div className="real-heading">
        <div>
          <p className="eyebrow">SUA CARTEIRA</p>
          <h1>
            Oportunidades salvas<span> ✦</span>
          </h1>
          <p>Empresas escolhidas por você, disponíveis para consultar depois.</p>
        </div>
        <button className="real-link" onClick={onSearch}>
          Nova busca →
        </button>
      </div>
      <div className="saved-note">
        <ShieldCheck size={18} />
        <span>
          Guardamos apenas o identificador da empresa. Abra no Google Maps para consultar os dados
          atualizados.
        </span>
      </div>
      {error && (
        <p className="real-error" role="alert">
          {error} <button onClick={load}>Tentar novamente</button>
        </p>
      )}
      {loading ? (
        <div className="real-empty" role="status">
          Carregando oportunidades…
        </div>
      ) : items.length === 0 && !error ? (
        <div className="real-empty">
          <span>✦</span>
          <strong>Você ainda não salvou oportunidades.</strong>
          <p>Faça uma busca e escolha as empresas que deseja acompanhar.</p>
          <button className="primary" onClick={onSearch}>
            Buscar empresas
          </button>
        </div>
      ) : (
        <div className="saved-list">
          {items.map((item, i) => (
            <article key={item.id}>
              <span className="saved-number">{String(items.length - i).padStart(2, '0')}</span>
              <div>
                <strong>{item.label || 'Oportunidade salva'}</strong>
                <p>Salva em {new Date(item.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
              <a href={mapsLink(item.placeId)} target="_blank" rel="noreferrer">
                Abrir no Google Maps <ExternalLink size={14} />
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
