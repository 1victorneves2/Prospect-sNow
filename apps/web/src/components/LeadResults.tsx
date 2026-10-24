import { LeadRow } from './LeadRow'
import type { Lead } from '../demo/leads'

export function LeadResults({
  leads,
  query,
  status,
  onRetry,
  onSelect,
}: {
  leads: Lead[]
  query: string
  status: 'loading' | 'error' | 'ready' | 'empty'
  onRetry: () => void
  onSelect: (lead: Lead) => void
}) {
  if (status === 'loading') {
    return (
      <div className="lead-state" role="status" aria-busy="true">
        <span className="spinner" aria-hidden="true" />
        Carregando leads…
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="lead-state error-state" role="alert">
        <strong>Não foi possível carregar os leads.</strong>
        <span>Confira a conexão e tente novamente.</span>
        <button onClick={onRetry}>Tentar novamente</button>
      </div>
    )
  }

  if (status === 'empty' || leads.length === 0) {
    return (
      <div className="lead-state empty-state" role="status">
        <strong>
          {query ? 'Nenhum resultado para esta busca.' : 'Sua base ainda está vazia.'}
        </strong>
        <span>
          {query
            ? 'Tente buscar por outro nome, segmento ou região.'
            : 'Quando você adicionar empresas, elas aparecerão aqui.'}
        </span>
      </div>
    )
  }

  return (
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
          {leads.map((lead) => (
            <LeadRow key={lead.id} lead={lead} onClick={() => onSelect(lead)} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
