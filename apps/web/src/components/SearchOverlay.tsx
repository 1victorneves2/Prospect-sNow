import { useRef, useState } from 'react'
import { ExternalLink, Search } from 'lucide-react'
import type { Lead } from '../demo/leads'
import { useDialogFocus } from './useDialogFocus'

export function SearchOverlay({
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
