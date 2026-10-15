import { ExternalLink } from 'lucide-react'
import { scoreLevel, stageColor, type Lead } from '../demo/leads'

export function LeadRow({ lead, onClick }: { lead: Lead; onClick: () => void }) {
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
