import { useRef } from 'react'
import { scoreLevel, stageColor, type Lead, type Stage } from '../demo/leads'
import { useDialogFocus } from './useDialogFocus'

export function LeadDrawer({
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
