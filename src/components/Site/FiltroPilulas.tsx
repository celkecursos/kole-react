import { cx } from '../../utils/cx';
import './FiltroPilulas.css';

export interface OpcaoFiltroPilulas<V extends string = string> {
  valor: V;
  rotulo: string;
}

export interface FiltroPilulasProps<V extends string = string> {
  opcoes: OpcaoFiltroPilulas<V>[];
  valor: V;
  aoMudar: (valor: V) => void;
  /** Nome do filtro para leitor de tela (ex.: "Categoria"). */
  rotulo: string;
  /** `quebrar` = várias linhas (padrão) · `rolar` = uma linha só, rolando para o lado. */
  disposicao?: 'quebrar' | 'rolar';
  alinhamento?: 'inicio' | 'centro';
  className?: string;
}

/** Filtro de uma escolha só em pílulas (categorias, regiões, UFs). A escolhida fica escura. */
export function FiltroPilulas<V extends string = string>({ opcoes, valor, aoMudar, rotulo, disposicao = 'quebrar', alinhamento = 'inicio', className }: FiltroPilulasProps<V>) {
  return (
    <div className={cx('lp-pilulas', `lp-pilulas--${disposicao}`, `lp-pilulas--${alinhamento}`, className)} role="group" aria-label={rotulo}>
      {opcoes.map((o) => (
        <button key={o.valor} type="button" className="lp-pilula" aria-pressed={o.valor === valor} onClick={() => aoMudar(o.valor)}>
          {o.rotulo}
        </button>
      ))}
    </div>
  );
}
