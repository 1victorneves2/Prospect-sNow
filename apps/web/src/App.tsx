import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import {
  BarChart3,
  Building2,
  ChevronDown,
  Command,
  ExternalLink,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'

type Stage =
  'Descoberto' | 'Analisado' | 'Contatado' | 'Respondeu' | 'Reunião' | 'Proposta' | 'Fechado'
type Lead = {
  id: number
  name: string
  segment: string
  region: string
  score: number
  stage: Stage
  phone: boolean
  site: 'Ausente' | 'Linktree' | 'Ativo'
  updated: string
}

const initialLeads: Lead[] = [
  {
    id: 1,
    name: 'Bella Moda Feminina',
    segment: 'Moda e vestuário',
    region: 'Adrianópolis',
    score: 92,
    stage: 'Analisado',
    phone: true,
    site: 'Linktree',
    updated: 'Hoje, 10:34',
  },
  {
    id: 2,
    name: 'Maison Lune Semijoias',
    segment: 'Semijoias',
    region: 'Vieiralves',
    score: 86,
    stage: 'Contatado',
    phone: true,
    site: 'Ausente',
    updated: 'Hoje, 09:22',
  },
  {
    id: 3,
    name: 'Ateliê Aurora',
    segment: 'Moda e vestuário',
    region: 'Ponta Negra',
    score: 78,
    stage: 'Descoberto',
    phone: false,
    site: 'Ausente',
    updated: 'Ontem',
  },
  {
    id: 4,
    name: 'Studio Vivá',
    segment: 'Clínica de estética',
    region: 'Parque Dez',
    score: 71,
    stage: 'Respondeu',
    phone: true,
    site: 'Ativo',
    updated: 'Ontem',
  },
  {
    id: 5,
    name: 'Casa Forma Planejados',
    segment: 'Móveis planejados',
    region: 'Flores',
    score: 64,
    stage: 'Reunião',
    phone: true,
    site: 'Ativo',
    updated: 'Segunda-feira',
  },
]

const nav = [
  ['Visão geral', LayoutDashboard],
  ['Descoberta', Search],
  ['Leads', Users],
  ['Mensagens', MessageSquare],
  ['Pipeline', Target],
  ['Relatórios', BarChart3],
] as const

const stageColor: Record<Stage, string> = {
  Descoberto: 'slate',
  Analisado: 'violet',
  Contatado: 'blue',
  Respondeu: 'amber',
  Reunião: 'rose',
  Proposta: 'cyan',
  Fechado: 'green',
}

export function App() {
  const [page, setPage] = useState('Visão geral')
  const [leads, setLeads] = useState(initialLeads)
  const [query, setQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [selected, setSelected] = useState<Lead | null>(null)
  const closeSearch = useCallback(() => setShowSearch(false), [])
  const closeLead = useCallback(() => setSelected(null), [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setShowSearch(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const visibleLeads = useMemo(
    () =>
      leads.filter((lead) =>
        `${lead.name} ${lead.segment} ${lead.region}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [leads, query],
  )

  function runDiscovery() {
    const newLead: Lead = {
      id: Math.max(...leads.map((lead) => lead.id)) + 1,
      name: 'Essência da Moda',
      segment: 'Moda e vestuário',
      region: 'Centro, Manaus',
      score: 68,
      stage: 'Descoberto',
      phone: true,
      site: 'Ausente',
      updated: 'Agora',
    }
    setLeads((current) => [newLead, ...current])
    setPage('Leads')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">✦</span>
          <span>snowdrop</span>
          <b>prospect</b>
        </div>
        <div className="workspace">
          <span className="workspace-icon">S</span>
          <span>Snowdrop</span>
          <ChevronDown size={15} />
        </div>
        <nav>
          <p className="nav-label">INTELIGÊNCIA COMERCIAL</p>
          {nav.map(([label, Icon]) => (
            <button
              key={label}
              className={page === label ? 'nav-item active' : 'nav-item'}
              aria-current={page === label ? 'page' : undefined}
              onClick={() => setPage(label)}
            >
              <Icon size={18} />
              {label}
              {label === 'Leads' && <em>{leads.length}</em>}
            </button>
          ))}
          <p className="nav-label lower">AMBIENTE</p>
          <p className="sidebar-note">Prévia com dados fictícios. Nenhuma alteração é salva.</p>
        </nav>
        <div className="sidebar-footer">
          <div className="avatar">VM</div>
          <div>
            <strong>Workspace demo</strong>
            <small>Ambiente de demonstração</small>
          </div>
          <MoreHorizontal size={18} />
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div className="crumb">
            <span>Snowdrop Prospect</span>
            <b>/</b>
            <strong>{page}</strong>
          </div>
          <div className="mobile-brand">
            <span className="brand-mark">✦</span> snowdrop <b>prospect</b>
          </div>
          <div className="top-actions">
            <span className="demo-pill">Prévia demonstrativa</span>
            <button className="command" onClick={() => setShowSearch(true)}>
              <Command size={15} /> Buscar <kbd>⌘/Ctrl K</kbd>
            </button>
            <button className="new-search" onClick={() => setPage('Descoberta')}>
              <Plus size={17} /> Nova pesquisa
            </button>
          </div>
        </header>
        <nav className="mobile-nav" aria-label="Navegação principal">
          {nav.map(([label, Icon]) => (
            <button
              key={label}
              className={page === label ? 'active' : ''}
              aria-current={page === label ? 'page' : undefined}
              onClick={() => setPage(label)}
            >
              <Icon size={17} /> <span>{label}</span>
            </button>
          ))}
        </nav>
        <section className="content">
          <div className="demo-banner" role="status">
            <Sparkles size={17} />
            <span>
              <strong>Interface em construção.</strong> Empresas, indicadores e diagnósticos abaixo
              são exemplos fictícios; mudanças são temporárias.
            </span>
          </div>
          {page === 'Visão geral' && (
            <Overview
              leads={leads}
              onViewPipeline={() => setPage('Pipeline')}
              onViewLeads={() => setPage('Leads')}
              onSelect={setSelected}
            />
          )}
          {page === 'Descoberta' && <Discovery onRun={runDiscovery} />}
          {page === 'Leads' && (
            <Leads leads={visibleLeads} query={query} onQuery={setQuery} onSelect={setSelected} />
          )}
          {page === 'Mensagens' && <Messages />}
          {page === 'Pipeline' && <Pipeline leads={leads} onSelect={setSelected} />}
          {page === 'Relatórios' && <Reports />}
        </section>
      </main>
      {showSearch && (
        <SearchOverlay
          onClose={closeSearch}
          onSelect={(lead) => {
            setSelected(lead)
            setShowSearch(false)
          }}
          leads={leads}
        />
      )}
      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={closeLead}
          onMove={(stage) => {
            setLeads((all) => all.map((x) => (x.id === selected.id ? { ...x, stage } : x)))
            setSelected({ ...selected, stage })
          }}
        />
      )}
    </div>
  )
}

function Overview({
  leads,
  onViewPipeline,
  onViewLeads,
  onSelect,
}: {
  leads: Lead[]
  onViewPipeline: () => void
  onViewLeads: () => void
  onSelect: (lead: Lead) => void
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PAINEL DEMONSTRATIVO</p>
          <h1>
            Sua operação em foco <span>✦</span>
          </h1>
          <p className="subtle">Explore a futura central de prospecção da Snowdrop.</p>
        </div>
      </div>
      <div className="kpi-grid">
        <Metric
          icon={<Users />}
          label="Leads descobertos"
          value={String(leads.length)}
          delta="Exemplos"
          detail="na prévia"
          tone="purple"
        />
        <Metric
          icon={<Sparkles />}
          label="Oportunidades altas"
          value={String(leads.filter((lead) => lead.score >= 80).length)}
          delta="Score ≥ 80"
          detail="ilustrativo"
          tone="orange"
        />
        <Metric
          icon={<MessageSquare />}
          label="Conversas em andamento"
          value={String(
            leads.filter((lead) => ['Contatado', 'Respondeu'].includes(lead.stage)).length,
          )}
          delta="Etapas"
          detail="de exemplo"
          tone="blue"
        />
        <Metric
          icon={<Target />}
          label="Contratos fechados"
          value={String(leads.filter((lead) => lead.stage === 'Fechado').length)}
          delta="Sem receita"
          detail="real nesta prévia"
          tone="green"
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel funnel">
          <PanelHead title="Funil de prospecção" action="Ver pipeline" onAction={onViewPipeline} />
          <div className="funnel-visual">
            <div className="funnel-chart">
              {(
                [
                  'Descoberto',
                  'Analisado',
                  'Contatado',
                  'Respondeu',
                  'Reunião',
                  'Fechado',
                ] as Stage[]
              ).map((stage) => {
                const count = leads.filter((lead) => lead.stage === stage).length
                return (
                  <div className="funnel-row" key={stage}>
                    <span>{stage}</span>
                    <div>
                      <i style={{ width: `${leads.length ? (count / leads.length) * 100 : 0}%` }} />
                    </div>
                    <b>{count}</b>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
        <section className="panel attention">
          <PanelHead title="Antes de começar" />
          <div className="attention-list">
            <Attention
              title="Definir direção visual"
              detail="Revisar a experiência antes de conectar dados reais"
              tone="orange"
            />
            <Attention
              title="Conectar dados e autenticação"
              detail="Os exemplos atuais não são persistidos"
              tone="purple"
            />
            <Attention
              title="Revisar cada contato"
              detail="Mensagens nunca serão enviadas automaticamente"
              tone="blue"
            />
          </div>
        </section>
      </div>
      <section className="panel recent">
        <PanelHead title="Leads de exemplo" action="Ver todos" onAction={onViewLeads} />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>EMPRESA</th>
                <th>SEGMENTO</th>
                <th>REGIÃO</th>
                <th>SCORE</th>
                <th>ETAPA</th>
                <th>ATUALIZADO</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 4).map((l) => (
                <LeadRow lead={l} key={l.id} onClick={() => onSelect(l)} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function Discovery({ onRun }: { onRun: () => void }) {
  const [segment, setSegment] = useState('Moda e vestuário')
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">DESCOBERTA</p>
          <h1>Encontre novas oportunidades</h1>
          <p className="subtle">
            Configure uma pesquisa para localizar empresas com potencial comercial.
          </p>
        </div>
      </div>
      <div className="discovery-layout">
        <section className="panel search-form">
          <div className="form-title">
            <div className="title-icon">
              <Search />
            </div>
            <div>
              <h2>Nova pesquisa</h2>
              <p>Os resultados serão avaliados antes de entrar na sua base.</p>
            </div>
          </div>
          <label>
            Localização <span>Obrigatório</span>
            <div className="input-icon">
              <MapPin size={17} />
              <input defaultValue="Manaus, Amazonas" aria-label="Localização" />
            </div>
          </label>
          <label>
            Segmento ou palavra-chave{' '}
            <div className="input-icon">
              <Building2 size={17} />
              <input
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                aria-label="Segmento ou palavra-chave"
              />
            </div>
          </label>
          <div className="form-cols">
            <label>
              Quantidade desejada
              <select defaultValue="20">
                <option>20 empresas</option>
                <option>40 empresas</option>
                <option>60 empresas</option>
              </select>
            </label>
            <label>
              Região{' '}
              <select defaultValue="Todas as regiões">
                <option>Todas as regiões</option>
                <option>Zona Centro-Sul</option>
                <option>Zona Oeste</option>
              </select>
            </label>
          </div>
          <div className="notice">
            <Sparkles size={17} />
            <div>
              <strong>Simulação de descoberta</strong>
              <br />A integração com Google Places ainda não está ativa. Este botão adiciona um
              exemplo temporário para explorar a interface.
            </div>
          </div>
          <button className="primary large" onClick={onRun}>
            <Search size={18} /> Simular resultado
          </button>
        </section>
        <aside className="discovery-note">
          <span className="note-chip">COMO FUNCIONA</span>
          <h2>De pesquisa a oportunidade.</h2>
          <p>
            A plataforma ajuda você a encontrar empresas e organizar sinais relevantes — sem assumir
            necessidades sem evidência.
          </p>
          <ol>
            <li>
              <b>1</b> Você define cidade, segmento e quantidade.
            </li>
            <li>
              <b>2</b> Revise os resultados encontrados.
            </li>
            <li>
              <b>3</b> Crie leads e registre evidências.
            </li>
            <li>
              <b>4</b> Priorize quem merece atenção agora.
            </li>
          </ol>
        </aside>
      </div>
    </>
  )
}

function Leads({
  leads,
  query,
  onQuery,
  onSelect,
}: {
  leads: Lead[]
  query: string
  onQuery: (s: string) => void
  onSelect: (lead: Lead) => void
}) {
  return (
    <>
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">BASE COMERCIAL</p>
          <h1>Leads</h1>
          <p className="subtle">Empresas encontradas, analisadas e acompanhadas pela Snowdrop.</p>
        </div>
        <span className="section-hint">Dados fictícios · sem salvamento</span>
      </div>
      <section className="panel leads-panel">
        <div className="lead-tools">
          <div className="input-icon search-input">
            <Search size={17} />
            <input
              placeholder="Buscar empresa, segmento ou região..."
              value={query}
              onChange={(e) => onQuery(e.target.value)}
            />
          </div>
          <span>{leads.length} leads</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>EMPRESA</th>
                <th>SEGMENTO</th>
                <th>REGIÃO</th>
                <th>SCORE</th>
                <th>ETAPA</th>
                <th>ATUALIZADO</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="table-empty">
                    Nenhum lead corresponde à busca. Tente outro nome, segmento ou região.
                  </td>
                </tr>
              )}
              {leads.map((l) => (
                <LeadRow lead={l} key={l.id} onClick={() => onSelect(l)} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function Messages() {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">ABORDAGEM</p>
          <h1>Mensagens</h1>
          <p className="subtle">Revise, personalize e aprove rascunhos antes do envio manual.</p>
        </div>
      </div>
      <section className="panel message-panel">
        <div className="message-lead">
          <div className="company-logo">BM</div>
          <div>
            <h2>Bella Moda Feminina</h2>
            <p>Vitrine digital · Alta oportunidade</p>
          </div>
          <span className="badge violet">RASCUNHO</span>
        </div>
        <div className="message-copy">
          Oi, tudo bem? Me chamo Victor! Conheci o trabalho de vocês e percebi que os produtos estão
          muito bem apresentados no Instagram.
          <br />
          <br />
          Pensei em uma vitrine digital própria, onde os clientes conseguem conhecer as peças e
          montar o pedido antes de chamar no WhatsApp. Isso pode deixar o atendimento mais
          organizado e facilitar as vendas.
          <br />
          <br />
          Trabalho com desenvolvimento e inteligência comercial. Se fizer sentido, podemos marcar
          uma conversa rápida para eu mostrar como funcionaria? 😊
        </div>
        <p className="message-disclaimer">
          Exemplo ilustrativo. A geração, edição e aprovação estarão disponíveis após a conexão com
          a API.
        </p>
      </section>
    </>
  )
}
function Pipeline({ leads, onSelect }: { leads: Lead[]; onSelect: (lead: Lead) => void }) {
  const stages: Stage[] = [
    'Descoberto',
    'Analisado',
    'Contatado',
    'Respondeu',
    'Reunião',
    'Proposta',
    'Fechado',
  ]
  return (
    <>
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">OPORTUNIDADES</p>
          <h1>Pipeline comercial</h1>
          <p className="subtle">Acompanhe cada conversa até o fechamento.</p>
        </div>
        <span className="section-hint">Visualização demonstrativa</span>
      </div>
      <div className="kanban">
        {stages.map((stage) => (
          <div className="kanban-col" key={stage}>
            <div className="kanban-head">
              <span className={`dot ${stageColor[stage]}`} />
              <b>{stage}</b>
              <em>{leads.filter((l) => l.stage === stage).length}</em>
            </div>
            {leads
              .filter((l) => l.stage === stage)
              .map((l) => (
                <button className="lead-card" key={l.id} onClick={() => onSelect(l)}>
                  <div>
                    <span className="company-logo small">{l.name.slice(0, 2).toUpperCase()}</span>
                    <strong>{l.name}</strong>
                  </div>
                  <p>{l.segment}</p>
                  <footer>
                    <span className={`score ${scoreLevel(l.score)}`}>{l.score}</span>
                    <span>{l.updated}</span>
                  </footer>
                </button>
              ))}
          </div>
        ))}
      </div>
    </>
  )
}
function Reports() {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">ANÁLISE</p>
          <h1>Relatórios</h1>
          <p className="subtle">Acompanhe a qualidade e a evolução da sua prospecção.</p>
        </div>
      </div>
      <div className="empty-state">
        <BarChart3 size={38} />
        <h2>Indicadores em preparação</h2>
        <p>Os relatórios serão calculados a partir de leads, atividades e oportunidades reais.</p>
      </div>
    </>
  )
}

function LeadRow({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  return (
    <tr>
      <td>
        <div className="company-cell">
          <span className="company-logo small">{lead.name.slice(0, 2).toUpperCase()}</span>
          <div>
            <button
              className="company-link"
              onClick={onClick}
              aria-label={`Abrir detalhes de ${lead.name}`}
            >
              {lead.name}
            </button>
            <small>{lead.phone ? 'Telefone disponível' : 'Contato a verificar'}</small>
          </div>
        </div>
      </td>
      <td>{lead.segment}</td>
      <td>{lead.region}</td>
      <td>
        <span className={`score ${scoreLevel(lead.score)}`}>{lead.score}</span>
      </td>
      <td>
        <span className={`badge ${stageColor[lead.stage]}`}>{lead.stage}</span>
      </td>
      <td>{lead.updated}</td>
      <td>
        <button
          className="row-action"
          onClick={onClick}
          aria-label={`Abrir detalhes de ${lead.name}`}
        >
          <ExternalLink size={17} />
        </button>
      </td>
    </tr>
  )
}
function Metric({
  icon,
  label,
  value,
  delta,
  detail,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  delta: string
  detail: string
  tone: string
}) {
  return (
    <article className="metric">
      <div className={`metric-icon ${tone}`}>{icon}</div>
      <p>{label}</p>
      <h2>{value}</h2>
      <small>
        <b className={tone === 'orange' ? '' : 'positive'}>{delta}</b> {detail}
      </small>
    </article>
  )
}
function PanelHead({
  title,
  action,
  onAction,
}: {
  title: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="panel-head">
      <h2>{title}</h2>
      {onAction && (
        <button onClick={onAction}>
          {action} <span>→</span>
        </button>
      )}
    </div>
  )
}
function Attention({ title, detail, tone }: { title: string; detail: string; tone: string }) {
  return (
    <div className="attention-item">
      <span className={`attention-dot ${tone}`} />
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
      <span>→</span>
    </div>
  )
}
function SearchOverlay({
  onClose,
  onSelect,
  leads,
}: {
  onClose: () => void
  onSelect: (l: Lead) => void
  leads: Lead[]
}) {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const results = leads.filter((lead) =>
    `${lead.name} ${lead.segment} ${lead.region}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  )

  useDialogFocus(dialogRef, inputRef, onClose)

  return (
    <div className="overlay" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className="quick-search"
        role="dialog"
        aria-modal="true"
        aria-label="Buscar leads de exemplo"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="input-icon">
          <Search />
          <input
            ref={inputRef}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar empresa, segmento ou região..."
            aria-label="Buscar leads"
          />
        </div>
        <p>LEADS DE EXEMPLO</p>
        {results.length === 0 && <p className="search-empty">Nenhum resultado encontrado.</p>}
        {results.map((l) => (
          <button key={l.id} onClick={() => onSelect(l)}>
            <span className="company-logo small">{l.name.slice(0, 2)}</span>
            <span>
              {l.name}
              <small>{l.segment}</small>
            </span>
            <ExternalLink size={15} />
          </button>
        ))}
        <footer>
          <kbd>ESC</kbd> para fechar <button onClick={onClose}>Fechar</button>
        </footer>
      </div>
    </div>
  )
}
function LeadDrawer({
  lead,
  onClose,
  onMove,
}: {
  lead: Lead
  onClose: () => void
  onMove: (stage: Stage) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  useDialogFocus(dialogRef, closeRef, onClose)

  return (
    <div className="drawer-layer" onMouseDown={onClose}>
      <aside
        ref={dialogRef}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-drawer-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          className="drawer-close"
          onClick={onClose}
          aria-label="Fechar detalhes do lead"
        >
          ×
        </button>
        <span className={`badge ${stageColor[lead.stage]}`}>{lead.stage}</span>
        <h1 id="lead-drawer-title">{lead.name}</h1>
        <p className="subtle">
          {lead.segment} · {lead.region}
        </p>
        <div className="drawer-score">
          <span className={`score ${scoreLevel(lead.score)}`}>{lead.score}</span>
          <div>
            <strong>Score de oportunidade</strong>
            <p>Valor ilustrativo, sem cálculo real</p>
          </div>
        </div>
        <h3>Diagnóstico</h3>
        <div className="evidence">
          <span>FATO OBSERVADO</span>
          <p>
            {lead.site === 'Ausente'
              ? 'Nenhum website foi informado na fonte consultada.'
              : lead.site === 'Linktree'
                ? 'O canal informado aponta para uma página agregadora de links.'
                : 'Há presença digital registrada; a experiência ainda precisa de verificação.'}
          </p>
          <small>Exemplo fictício · fonte não verificada</small>
        </div>
        <div className="evidence">
          <span>HIPÓTESE COMERCIAL</span>
          <p>
            Uma vitrine digital própria pode centralizar produtos e tornar o caminho até o pedido
            mais direto.
          </p>
          <small>Confiança média · requer validação humana</small>
        </div>
        <h3>Atualizar etapa</h3>
        <select
          aria-label="Etapa do lead demonstrativo"
          value={lead.stage}
          onChange={(e) => onMove(e.target.value as Stage)}
        >
          {(
            [
              'Descoberto',
              'Analisado',
              'Contatado',
              'Respondeu',
              'Reunião',
              'Proposta',
              'Fechado',
            ] as Stage[]
          ).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <p className="section-hint">
          Alteração temporária nesta prévia; geração de mensagem ainda indisponível.
        </p>
      </aside>
    </div>
  )
}
function scoreLevel(score: number) {
  return score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low'
}

function useDialogFocus(
  dialogRef: RefObject<HTMLElement | null>,
  initialFocusRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    initialFocusRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = [
        ...dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ]
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus()
    }
  }, [dialogRef, initialFocusRef, onClose])
}
