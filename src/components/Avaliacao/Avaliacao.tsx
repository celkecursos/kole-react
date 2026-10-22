import { useId, useState, type CSSProperties, type MouseEvent } from 'react';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import './Avaliacao.css';

export interface AvaliacaoProps {
  /** Nota atual (0 = sem nota). */
  valor: number;
  /**
   * Muda a nota. Se devolver uma Promise (ex.: salvar no servidor), o
   * componente fica ocupado até ela terminar.
   */
  aoMudar?: (valor: number) => void | Promise<unknown>;
  /** Quantidade de estrelas. */
  max?: number;
  /** `1` = estrelas inteiras · `0.5` = meias estrelas. */
  passo?: 1 | 0.5;
  /** Só mostra a nota (aceita fração, ex.: 3.7). */
  somenteLeitura?: boolean;
  /** Nome para leitor de tela (ex.: "Avaliação do produto"). */
  rotulo: string;
  icone?: 'star' | 'heart';
  tamanho?: 'pequeno' | 'medio' | 'grande';
  /** Texto para cada nota inteira (índice 0 = 1 estrela), mostrado ao lado. */
  mensagens?: string[];
  /** Chamado ao passar o mouse (com a nota sob o ponteiro, ou `null` ao sair). */
  aoPassar?: (valor: number | null) => void;
  /** Botão para limpar a nota. */
  limpavel?: boolean;
  /** Texto enquanto `aoMudar` não termina. */
  textoOcupado?: string;
  className?: string;
}

const fmt = (v: number) => v.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

/** Avaliação por estrelas (ou corações): editável, com meias estrelas, ou só leitura. */
export function Avaliacao({
  valor,
  aoMudar,
  max = 5,
  passo = 1,
  somenteLeitura = false,
  rotulo,
  icone = 'star',
  tamanho = 'medio',
  mensagens,
  aoPassar,
  limpavel = false,
  textoOcupado = 'Salvando...',
  className,
}: AvaliacaoProps) {
  const nome = useId();
  const [sob, setSob] = useState<number | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const exibido = sob ?? valor;
  const bloqueado = somenteLeitura || ocupado;

  const escolher = async (v: number) => {
    if (bloqueado) return;
    const r = aoMudar?.(v);
    if (r instanceof Promise) {
      setOcupado(true);
      try {
        await r;
      } finally {
        setOcupado(false);
      }
    }
  };

  // nota sob o ponteiro: com meias estrelas, a metade esquerda vale x,5
  const notaNoPonteiro = (e: MouseEvent<HTMLSpanElement>, i: number) => {
    if (passo === 1) return i + 1;
    const r = e.currentTarget.getBoundingClientRect();
    return e.clientX - r.left < r.width / 2 ? i + 0.5 : i + 1;
  };
  const passar = (v: number | null) => {
    if (bloqueado) return;
    setSob(v);
    aoPassar?.(v);
  };

  const estrelas = Array.from({ length: max }, (_, i) => {
    const preenchido = Math.max(0, Math.min(1, exibido - i)) * 100;
    return (
      <span
        key={i}
        className="lp-aval-estrela"
        style={{ '--aval-pct': `${preenchido}%` } as CSSProperties}
        onMouseMove={bloqueado ? undefined : (e) => passar(notaNoPonteiro(e, i))}
        onClick={bloqueado ? undefined : (e) => escolher(notaNoPonteiro(e, i))}
        aria-hidden="true"
      >
        <Icone icone={icone} className="lp-aval-fundo" />
        <span className="lp-aval-cheia">
          <Icone icone={icone} />
        </span>
      </span>
    );
  });

  const mensagem = mensagens && exibido > 0 ? mensagens[Math.ceil(exibido) - 1] : undefined;
  const classes = cx('lp-aval', `lp-aval--${tamanho}`, icone === 'heart' && 'lp-aval--coracao', ocupado && 'is-ocupado', className);

  if (somenteLeitura)
    return (
      <span className={classes} role="img" aria-label={`${rotulo}: ${fmt(valor)} de ${max}`}>
        <span className="lp-aval-estrelas">{estrelas}</span>
      </span>
    );

  // rádios escondidos: setas, Tab e leitor de tela funcionam sem código extra
  const opcoes: number[] = [];
  for (let v = passo; v <= max; v += passo) opcoes.push(v);

  return (
    <span className={classes}>
      <span className="lp-aval-estrelas" role="radiogroup" aria-label={rotulo} aria-busy={ocupado || undefined} onMouseLeave={() => passar(null)}>
        {estrelas}
        <span className="lp-sr">
          {opcoes.map((v) => (
            <label key={v}>
              <input
                type="radio"
                name={nome}
                value={v}
                checked={valor === v}
                disabled={ocupado}
                onChange={() => escolher(v)}
                onFocus={() => setSob(null)}
              />
              {fmt(v)} de {max}
            </label>
          ))}
        </span>
      </span>
      {ocupado ? (
        <span className="lp-aval-msg" role="status">
          {textoOcupado}
        </span>
      ) : (
        mensagem && <span className="lp-aval-msg">{mensagem}</span>
      )}
      {limpavel && valor > 0 && !ocupado && (
        <button type="button" className="lp-aval-limpar" onClick={() => escolher(0)}>
          Limpar
        </button>
      )}
    </span>
  );
}
