import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import { formatDataBr } from '../../utils/datas';
import { dataCurta, paraData, situacaoPrazo } from '../../utils/tempo';
import { Badge, type CorBadge } from '../Badge/Badge';
import { PRIORIDADES, type CorKanban, type Prioridade } from './tipos';
import './Pecas.css';

export interface SeloPrioridadeProps {
  prioridade: Prioridade;
  /** Só a bandeira colorida (o nome fica para o leitor de tela e a dica). */
  compacto?: boolean;
  className?: string;
}

/** Bandeira com o nível de prioridade: baixa, média, alta ou crítica. */
export function SeloPrioridade({ prioridade, compacto = false, className }: SeloPrioridadeProps) {
  const p = PRIORIDADES[prioridade];
  const texto = `Prioridade ${p.rotulo.toLowerCase()}`;
  if (compacto)
    return (
      <span className={cx('lp-prioridade-ic', className)} data-cor={p.severidade} title={texto}>
        <Icone icone="flag" />
        <span className="lp-sr">{texto}</span>
      </span>
    );
  return (
    <span title={texto} className={className}>
      <Badge cor={p.severidade} aparencia="suave" formato="pilula" icone="flag">
        <span aria-hidden="true">{p.rotulo}</span>
        <span className="lp-sr">{texto}</span>
      </Badge>
    </span>
  );
}

export interface SeloPrazoProps {
  /** Data de vencimento (`Date` ou `AAAA-MM-DD`). */
  vencimento: Date | string;
  /** Concluído: mostra a data em verde, sem "Atrasado". */
  concluido?: boolean;
  /** Dias antes do vencimento em que vira "em breve" (padrão: 2). */
  emBreve?: number;
  /** Referência de "hoje" (padrão: agora). */
  agora?: Date;
  className?: string;
}

const COR_PRAZO: Record<string, CorBadge> = { atrasado: 'err', hoje: 'warn', 'em-breve': 'warn', 'no-prazo': 'neutral' };

/** Vencimento com cor pela situação: atrasado, hoje, em breve ou no prazo. */
export function SeloPrazo({ vencimento, concluido = false, emBreve, agora = new Date(), className }: SeloPrazoProps) {
  const p = situacaoPrazo(vencimento, agora, emBreve);
  // concluído: o atraso não importa mais, fica só a data
  const rotulo = concluido ? dataCurta(vencimento, agora) : p.rotulo;
  const descricao = concluido ? `Concluído; prazo em ${formatDataBr(paraData(vencimento))}` : p.descricao;
  return (
    <span title={descricao} className={className}>
      <Badge cor={concluido ? 'ok' : COR_PRAZO[p.situacao]} aparencia="suave" formato="pilula" icone={concluido ? 'circle-check' : 'calendar'}>
        <span aria-hidden="true">{rotulo}</span>
        <span className="lp-sr">{descricao}</span>
      </Badge>
    </span>
  );
}

export interface EtiquetaProps {
  rotulo: string;
  /** Cor do ponto e do fundo (padrão: `neutro`). */
  cor?: CorKanban;
  className?: string;
}

/** Etiqueta colorida de cartão e tarefa ("Design", "Urgente"…). */
export function Etiqueta({ rotulo, cor = 'neutro', className }: EtiquetaProps) {
  return (
    <span className={cx('lp-etiqueta', `lp-kb-cor--${cor}`, className)}>
      <span className="lp-etiqueta-ponto" aria-hidden="true" />
      {rotulo}
    </span>
  );
}
