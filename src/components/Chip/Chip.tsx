import { Icone } from '../../utils/Icone';
import { cx } from '../../utils/cx';
import './Chip.css';

export interface ChipProps {
  rotulo: string;
  /** Nome do que está etiquetado (ex.: "Protocolo" → PROTOCOLO: 123). */
  campo?: string;
  /** Mostra o "×" e dispara `aoRemover`. */
  aoRemover?: () => void;
  /** `false` tira o "×" da ordem do Tab (chips dentro de controles compostos). */
  focavel?: boolean;
  className?: string;
}

export function Chip({ rotulo, campo, aoRemover, focavel = true, className }: ChipProps) {
  return (
    <span className={cx('lp-chip', className)}>
      {campo && <span className="lp-chip-campo">{campo}:</span>}
      <span className="lp-chip-rotulo">{rotulo}</span>
      {aoRemover && (
        <button
          type="button"
          className="lp-chip-remover"
          tabIndex={focavel ? undefined : -1}
          aria-label={`Remover ${campo ? `${campo}: ` : ''}${rotulo}`}
          onClick={aoRemover}
        >
          <Icone icone="x" />
        </button>
      )}
    </span>
  );
}
