import { useMemo, useState } from 'react'
import {
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Command,
  ExternalLink,
  Filter,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
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

  const visibleLeads = useMemo(
    () =>
      leads.filter((lead) =>
        `${lead.name} ${lead.segment} ${lead.region}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [leads, query],
  )

  function runDiscovery() {
    const newLead: Lead = {
      id: Date.now(),
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
              onClick={() => setPage(label)}
            >
              <Icon size={18} />
              {label}
              {label === 'Leads' && <em>248</em>}
            </button>
          ))}
          <p className="nav-label lower">SISTEMA</p>
          <button className="nav-item">
            <Settings size={18} />
            Configurações
          </button>
          <button className="nav-item">
            <CircleHelp size={18} />
            Central de ajuda
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="avatar">VM</div>
          <div>
            <strong>Victor Martins</strong>
            <small>Administrador</small>
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
          <div className="top-actions">
            <button className="icon-button">
              <Bell size={18} />
              <i />
            </button>
            <button className="command" onClick={() => setShowSearch(true)}>
              <Command size={15} /> Buscar <kbd>⌘ K</kbd>
            </button>
            <button className="new-search" onClick={() => setPage('Descoberta')}>
              <Plus size={17} /> Nova pesquisa
            </button>
          </div>
        </header>
        <section className="content">
          {page === 'Visão geral' && (
            <Overview
              leads={leads}
              onViewPipeline={() => setPage('Pipeline')}
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
          onClose={() => setShowSearch(false)}
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
          onClose={() => setSelected(null)}
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
  onSelect,
}: {
  leads: Lead[]
  onViewPipeline: () => void
  onSelect: (lead: Lead) => void
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">QUARTA-FEIRA, 8 DE OUTUBRO</p>
          <h1>
            Bom dia, Victor <span>✦</span>
          </h1>
          <p className="subtle">Aqui está o resumo da sua operação comercial.</p>
        </div>
        <button className="outline-button">
          <ClipboardList size={17} /> Ver atividades
        </button>
      </div>
      <div className="kpi-grid">
        <Metric
          icon={<Users />}
          label="Leads descobertos"
          value="248"
          delta="+12%"
          detail="vs. período anterior"
          tone="purple"
        />
        <Metric
          icon={<Sparkles />}
          label="Oportunidades altas"
          value="64"
          delta="+8"
          detail="esta semana"
          tone="orange"
        />
        <Metric
          icon={<MessageSquare />}
          label="Conversas em andamento"
          value="18"
          delta="6"
          detail="aguardando resposta"
          tone="blue"
        />
        <Metric
          icon={<Target />}
          label="Contratos fechados"
          value="6"
          delta="R$ 42,8k"
          detail="em receita potencial"
          tone="green"
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel funnel">
          <PanelHead title="Funil de prospecção" action="Ver pipeline" onAction={onViewPipeline} />
          <div className="funnel-visual">
            <div className="funnel-chart">
              {[
                ['Descobertos', 248, 100],
                ['Qualificados', 126, 72],
                ['Contatados', 64, 49],
                ['Responderam', 28, 29],
                ['Reuniões', 18, 20],
                ['Fechados', 6, 9],
              ].map(([label, value, width]) => (
                <div className="funnel-row" key={String(label)}>
                  <span>{label}</span>
                  <div>
                    <i style={{ width: `${width}%` }} />
                  </div>
                  <b>{value}</b>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="panel attention">
          <PanelHead title="Precisa de atenção" action="Ver todos" />
          <div className="attention-list">
            <Attention
              title="5 leads aguardam follow-up"
              detail="Último contato há mais de 3 dias"
              tone="orange"
            />
            <Attention
              title="3 mensagens precisam de aprovação"
              detail="Rascunhos gerados pela IA"
              tone="purple"
            />
            <Attention
              title="2 reuniões esta semana"
              detail="Confira os detalhes no pipeline"
              tone="blue"
            />
          </div>
        </section>
      </div>
      <section className="panel recent">
        <PanelHead title="Leads recentes" action="Ver todos" />
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
              <input defaultValue="Manaus, Amazonas" />
            </div>
          </label>
          <label>
            Segmento ou palavra-chave{' '}
            <div className="input-icon">
              <Building2 size={17} />
              <input value={segment} onChange={(e) => setSegment(e.target.value)} />
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
              <strong>Pesquisa consciente</strong>
              <br />A busca usa a integração oficial do Google Places. Revise os resultados antes de
              criar leads.
            </div>
          </div>
          <button className="primary large" onClick={onRun}>
            <Search size={18} /> Preparar busca
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
        <button className="primary">
          <Plus size={17} /> Adicionar lead
        </button>
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
          <button className="outline-button">
            <Filter size={16} /> Filtros <span className="filter-count">2</span>
          </button>
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
        <div className="message-actions">
          <button className="outline-button">Regenerar</button>
          <button className="outline-button">Salvar rascunho</button>
          <button className="primary">
            <Send size={16} /> Aprovar mensagem
          </button>
        </div>
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
        <button className="primary">
          <Plus size={17} /> Nova oportunidade
        </button>
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
            <button className="add-card">
              <Plus size={15} /> Adicionar
            </button>
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
    <tr onClick={onClick}>
      <td>
        <div className="company-cell">
          <span className="company-logo small">{lead.name.slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{lead.name}</strong>
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
        <MoreHorizontal size={18} />
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
  action: string
  onAction?: () => void
}) {
  return (
    <div className="panel-head">
      <h2>{title}</h2>
      <button onClick={onAction}>
        {action} <span>→</span>
      </button>
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
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="quick-search" onMouseDown={(e) => e.stopPropagation()}>
        <div className="input-icon">
          <Search />
          <input autoFocus placeholder="Buscar empresa..." />
        </div>
        <p>LEADS RECENTES</p>
        {leads.slice(0, 4).map((l) => (
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
          <kbd>ESC</kbd> para fechar
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
  return (
    <div className="drawer-layer" onMouseDown={onClose}>
      <aside className="drawer" onMouseDown={(e) => e.stopPropagation()}>
        <button className="drawer-close" onClick={onClose}>
          ×
        </button>
        <span className={`badge ${stageColor[lead.stage]}`}>{lead.stage}</span>
        <h1>{lead.name}</h1>
        <p className="subtle">
          {lead.segment} · {lead.region}
        </p>
        <div className="drawer-score">
          <span className={`score ${scoreLevel(lead.score)}`}>{lead.score}</span>
          <div>
            <strong>Score de oportunidade</strong>
            <p>Baseado em evidências registradas</p>
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
          <small>Fonte: Google Places · verificado hoje</small>
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
        <select value={lead.stage} onChange={(e) => onMove(e.target.value as Stage)}>
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
        <button className="primary drawer-cta">
          <MessageSquare size={17} /> Gerar mensagem
        </button>
      </aside>
    </div>
  )
}
function scoreLevel(score: number) {
  return score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low'
}
