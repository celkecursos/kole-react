import { useState, type CSSProperties, type KeyboardEvent } from 'react';
import { cx } from '../../utils/cx';
import type { Coluna } from '../Tabela/Tabela';
import { formatarValor, larguraTexto } from './escalas';
import { MolduraGrafico } from './MolduraGrafico';
import type { DadoGrafico, GraficoBaseProps, ValorGrafico } from './tipos';
import './MapaCalor.css';

export interface CelulaMapaCalor {
  linha: string | number;
  coluna: string | number;
  valor: ValorGrafico;
}

export interface MapaCalorProps extends Omit<GraficoBaseProps, 'legenda'> {
  /** Rótulos das linhas, de cima para baixo (ex.: anos). */
  linhas: Array<string | number>;
  /** Rótulos das colunas, da esquerda para a direita (ex.: meses). */
  colunas: Array<string | number>;
  valores: CelulaMapaCalor[];
  /** Padrão: o menor valor. */
  minimo?: number;
  /** Padrão: o maior valor. */
  maximo?: number;
  formatar?: (valor: number) => string;
  unidade?: string;
  /** Padrão `true`: barra com a escala de cores abaixo da grade. */
  legendaEscala?: boolean;
  /** Cabeçalho da coluna das linhas na tabela do "Ver dados". Padrão: "Linha". */
  rotuloLinhas?: string;
}

const PASSOS = 5;
const chave = (l: string | number, c: string | number) => `${l}\u0000${c}`;

/** Grade de células coloridas pela escala sequencial (`--graf-seq-1` a `--graf-seq-5`). */
export function MapaCalor(props: MapaCalorProps) {
  const { linhas, colunas, valores, formatar, unidade, rotuloLinhas = 'Linha' } = props;
  const mapa = new Map(valores.map((v) => [chave(v.linha, v.coluna), v.valor]));
  const eixo = { formatar, unidade };

  const tabela = () => {
    const cols: Coluna<DadoGrafico>[] = [
      { campo: '__linha', rotulo: rotuloLinhas },
      ...colunas.map((c, i) => ({
        campo: `c${i}`,
        rotulo: String(c),
        alinhamento: 'direita' as const,
        formato: (v: unknown) => formatarValor(typeof v === 'number' ? v : null, { formatar }),
      })),
    ];
    const registros = linhas.map((l) => {
      const r: DadoGrafico = { __linha: String(l) };
      colunas.forEach((c, i) => (r[`c${i}`] = mapa.get(chave(l, c)) ?? null));
      return r;
    });
    return { colunas: cols, registros };
  };

  return (
    <MolduraGrafico {...props} legenda={false} semDados={!linhas.length || !colunas.length} tabela={tabela}>
      {(largura) => <GradeCalor {...props} largura={largura} mapa={mapa} eixo={eixo} />}
    </MolduraGrafico>
  );
}

function GradeCalor({
  titulo,
  descricao,
  altura = 280,
  linhas,
  colunas,
  minimo,
  maximo,
  legendaEscala = true,
  animacao,
  largura,
  mapa,
  eixo,
}: MapaCalorProps & { largura: number; mapa: Map<string, ValorGrafico>; eixo: { formatar?: (v: number) => string; unidade?: string } }) {
  const [ativo, setAtivo] = useState<[number, number] | null>(null);
  const numeros = [...mapa.values()].filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  const min = minimo ?? (numeros.length ? Math.min(...numeros) : 0);
  const max = maximo ?? (numeros.length ? Math.max(...numeros) : 1);
  const temFalha = linhas.some((l) => colunas.some((c) => {
    const v = mapa.get(chave(l, c));
    return v === null || v === undefined;
  }));
  const passo = (v: number) => (max === min ? PASSOS : Math.min(PASSOS, Math.max(1, Math.floor(((v - min) / (max - min)) * PASSOS) + 1)));
  const valorEm = (i: number, j: number): ValorGrafico => mapa.get(chave(linhas[i], colunas[j])) ?? null;
  const detalhe = ativo ? `${linhas[ativo[0]]} · ${colunas[ativo[1]]}: ${formatarValor(valorEm(ativo[0], ativo[1]), eixo)}` : '';

  const aoTeclar = (e: KeyboardEvent) => {
    const [i, j] = ativo ?? [0, 0];
    const mover: Record<string, [number, number]> = {
      ArrowUp: [i - 1, j],
      ArrowDown: [i + 1, j],
      ArrowLeft: [i, j - 1],
      ArrowRight: [i, j + 1],
      Home: [i, 0],
      End: [i, colunas.length - 1],
    };
    if (e.key === 'Escape') return setAtivo(null);
    const alvo = mover[e.key];
    if (!alvo) return;
    e.preventDefault();
    setAtivo([Math.min(linhas.length - 1, Math.max(0, alvo[0])), Math.min(colunas.length - 1, Math.max(0, alvo[1]))]);
  };

  // rótulos das colunas que não cabem: um a cada N, sem encavalar
  const larguraRotulos = Math.max(...linhas.map((l) => larguraTexto(String(l)))) + 8;
  const larguraColuna = (largura - larguraRotulos) / Math.max(1, colunas.length);
  const maiorColuna = Math.max(...colunas.map((c) => larguraTexto(String(c))));
  const cadaN = Math.max(1, Math.ceil((maiorColuna + 4) / Math.max(1, larguraColuna)));

  const estilo = { '--mapa-colunas': colunas.length, maxHeight: `${altura}px` } as CSSProperties;

  return (
    <div className="lp-graf-mapa">
      <div
        className="lp-graf-mapa-rolagem"
        style={estilo}
        role="img"
        aria-label={descricao ? `${titulo}. ${descricao}` : titulo}
        tabIndex={0}
        onKeyDown={aoTeclar}
        onFocus={() => !ativo && setAtivo([0, 0])}
        onBlur={() => setAtivo(null)}
        onPointerLeave={() => setAtivo(null)}
      >
        <div className="lp-graf-mapa-grade" aria-hidden="true">
          <div className="lp-graf-mapa-canto" />
          {colunas.map((c, j) => (
            <div key={`c${c}`} className="lp-graf-mapa-col">
              {j % cadaN === 0 ? c : ''}
            </div>
          ))}
          {linhas.map((l, i) => (
            <div key={`l${l}`} className="lp-graf-mapa-linha">
              <div className="lp-graf-mapa-rot">{l}</div>
              {colunas.map((c, j) => {
                const v = valorEm(i, j);
                const sem = v === null;
                return (
                  <div
                    key={`${l}-${c}`}
                    className={cx('lp-graf-mapa-cel', sem && 'is-sem-dado', ativo?.[0] === i && ativo?.[1] === j && 'is-ativa')}
                    style={{
                      ...(sem ? undefined : { background: `var(--graf-seq-${passo(v)})` }),
                      // na entrada animada, as linhas surgem de cima para baixo
                      ...(animacao ? { animationDelay: `${Math.min(i * 25, 450)}ms` } : undefined),
                    }}
                    onPointerEnter={() => setAtivo([i, j])}
                    onPointerDown={() => setAtivo([i, j])}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="lp-graf-mapa-rodape">
        <span className="lp-graf-mapa-detalhe" aria-live="polite">
          {detalhe}
        </span>
        {legendaEscala && (
          <span className="lp-graf-mapa-escala">
            <span>{formatarValor(min, eixo)}</span>
            <span className="lp-graf-mapa-cores" aria-hidden="true">
              {Array.from({ length: PASSOS }, (_, k) => (
                <span key={k} style={{ background: `var(--graf-seq-${k + 1})` }} />
              ))}
            </span>
            <span>{formatarValor(max, eixo)}</span>
            {temFalha && (
              <span className="lp-graf-mapa-falha">
                <span className="lp-graf-mapa-cel is-sem-dado" aria-hidden="true" />
                sem dado
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
