import { useRef, useState } from 'react'
import { scoreLevel, stageColor, type Lead, type Stage } from '../demo/leads'
import { allowedTransitions, isValidTransitionReason } from '../demo/pipeline'
import { useDialogFocus } from './useDialogFocus'

export function LeadDrawer({
  lead,
  onClose,
  onMove,
  history,
}: {
  lead: Lead
  onClose: () => void
  onMove: (stage: Stage, reason: string) => void
  history: { from: Stage; to: Stage; reason: string; changedAt: string; actor: string }[]
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const [nextStage, setNextStage] = useState<Stage | ''>('')
  const [reason, setReason] = useState('')
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
          value={nextStage}
          onChange={(e) => setNextStage(e.target.value as Stage | '')}
        >
          <option value="">Selecione uma etapa permitida</option>
          {allowedTransitions(lead.stage).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <label className="transition-reason-label" htmlFor="transition-reason">
          Motivo da mudança
        </label>
        <textarea
          id="transition-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Ex.: cliente respondeu e pediu uma reunião"
          rows={3}
        />
        <button
          className="drawer-cta"
          disabled={!nextStage || !isValidTransitionReason(reason)}
          onClick={() => {
            if (nextStage && isValidTransitionReason(reason)) {
              onMove(nextStage, reason.trim())
              setNextStage('')
              setReason('')
            }
          }}
        >
          Registrar mudança
        </button>
        <h3>Histórico de mudanças</h3>
        {history.length === 0 ? (
          <p className="section-hint">Nenhuma mudança de etapa nesta sessão demonstrativa.</p>
        ) : (
          <ol className="pipeline-history">
            {history.map((event, index) => (
              <li key={`${event.changedAt}-${index}`}>
                <strong>
                  {event.from} → {event.to}
                </strong>
                <span>{event.reason}</span>
                <small>
                  {event.actor} · {new Date(event.changedAt).toLocaleString('pt-BR')}
                </small>
              </li>
            ))}
          </ol>
        )}
        <p className="section-hint">
          Histórico temporário, removido ao atualizar a página; geração de mensagem ainda
          indisponível.
        </p>
      </aside>
    </div>
  )
}
