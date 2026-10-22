import { Icone } from '../../utils/Icone';
import { useEffect, useRef, type Key, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { lerCampo } from '../../utils/texto';
import type { Severidade } from '../../utils/tipos';
import { Botao } from '../Botao/Botao';
import { Paginacao, type PaginacaoProps } from '../Paginacao/Paginacao';
import { Skeleton } from '../Skeleton/Skeleton';
import { Status } from '../Status/Status';
import { Vazio } from '../Vazio/Vazio';
import './Tabela.css';

export interface Coluna<T> {
  /** Chave do campo no registro (aceita caminho com ponto: `endereco.cidade`). */
  campo: string;
  rotulo: string;
  ordenavel?: boolean;
  alinhamento?: 'esquerda' | 'centro' | 'direita';
  /** Texto forte (coluna principal). */
  destaque?: boolean;
  maiuscula?: boolean;
  largura?: string;
  /** Formata o valor cru da célula. */
  formato?: (valor: unknown, linha: T) => ReactNode;
  /** Renderiza a célula como selo de situação. */
  severidade?: (linha: T) => Severidade;
  /** Célula totalmente customizada. */
  render?: (linha: T) => ReactNode;
}

export interface Ordenacao {
  campo: string;
  direcao: 'asc' | 'desc';
}

export interface TabelaProps<T> {
  colunas: Coluna<T>[];
  registros: T[];
  /** Chave de cada linha (padrão: `linha.id` ou o índice). */
  chave?: (linha: T, indice: number) => Key;
  /** Botões de ação por linha (use `<AcaoLinha>`), na última coluna. */
  acoes?: (linha: T) => ReactNode;
  aparencia?: 'listrada' | 'grade';
  rotulo?: string;
  /** Primeira carga: silhuetas no lugar das linhas. */
  carregando?: boolean;
  /** Recarga (paginar/ordenar): mantém a tabela esmaecida. */
  atualizando?: boolean;
  erro?: string | boolean;
  aoRecarregar?: () => void;
  vazioTitulo?: string;
  vazioDescricao?: string;
  vazioIcone?: string;
  vazioAcoes?: ReactNode;
  ordenacao?: Ordenacao | null;
  aoOrdenar?: (campo: string) => void;
  selecao?: 'unica' | 'multipla';
  selecionados?: Key[];
  aoMudarSelecao?: (chaves: Key[]) => void;
  aoClicarLinha?: (linha: T) => void;
  /** Paginação controlada (servidor). */
  paginacao?: Omit<PaginacaoProps, 'embutida' | 'className'>;
  className?: string;
}

/** Mantido por compatibilidade: é o `lerCampo` dos utilitários. */
export const valorDoCampo = lerCampo;

function CaixaSelecao({ marcado, indeterminado, rotulo, aoMudar }: { marcado: boolean; indeterminado?: boolean; rotulo: string; aoMudar: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminado;
  }, [indeterminado]);
  return (
    <label className="lp-tbl-sel" onClick={(e) => e.stopPropagation()}>
      <input ref={ref} type="checkbox" className="lp-tbl-sel-in" checked={marcado} onChange={aoMudar} aria-label={rotulo} />
      <span className="lp-tbl-sel-visual" aria-hidden="true" />
    </label>
  );
}

const LARGURAS = ['70%', '55%', '82%', '64%', '48%'];

export function Tabela<T>({
  colunas,
  registros,
  chave = (l, i) => ((l as { id?: Key }).id ?? i) as Key,
  acoes,
  aparencia = 'listrada',
  rotulo = 'Tabela de dados',
  carregando,
  atualizando,
  erro,
  aoRecarregar,
  vazioTitulo = 'Nenhum registro encontrado',
  vazioDescricao,
  vazioIcone = 'inbox',
  vazioAcoes,
  ordenacao,
  aoOrdenar,
  selecao,
  selecionados = [],
  aoMudarSelecao,
  aoClicarLinha,
  paginacao,
  className,
}: TabelaProps<T>) {
  const chaves = registros.map(chave);
  const sel = new Set(selecionados);
  const todos = chaves.length > 0 && chaves.every((k) => sel.has(k));
  const alguns = !todos && chaves.some((k) => sel.has(k));

  const alternar = (k: Key) => {
    if (selecao === 'unica') aoMudarSelecao?.(sel.has(k) ? [] : [k]);
    else aoMudarSelecao?.(sel.has(k) ? selecionados.filter((s) => s !== k) : [...selecionados, k]);
  };
  const alternarTodos = () => {
    if (todos) aoMudarSelecao?.(selecionados.filter((s) => !chaves.includes(s)));
    else aoMudarSelecao?.([...new Set([...selecionados, ...chaves])]);
  };

  const aoClicar = (linha: T, k: Key, e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input, label')) return;
    if (selecao) alternar(k);
    else aoClicarLinha?.(linha);
  };

  const alinh = (c: Coluna<T>) => (c.alinhamento === 'centro' ? 'is-centro' : c.alinhamento === 'direita' ? 'is-direita' : undefined);

  const iconeOrdem = (c: Coluna<T>) => {
    if (ordenacao?.campo !== c.campo) return <Icone icone="arrow-up-down" />;
    return <Icone icone={ordenacao.direcao === 'asc' ? 'arrow-up-narrow-wide' : 'arrow-down-wide-narrow'} className="is-on" />;
  };

  let corpo: ReactNode;
  if (carregando) {
    corpo = (
      <div className="lp-tbl-carregando" role="status" aria-busy="true" aria-label="Carregando registros">
        <div className="lp-tbl-carregando-cab" />
        {Array.from({ length: Math.min(paginacao?.tamanho ?? 5, 8) }, (_, i) => (
          <div className="lp-tbl-carregando-lin" key={i}>
            <Skeleton largura={LARGURAS[i % LARGURAS.length]} altura="0.6875rem" />
          </div>
        ))}
      </div>
    );
  } else if (erro) {
    corpo = (
      <div className="lp-tbl-vazio">
        <Vazio
          icone="triangle-alert"
          titulo="Não foi possível carregar"
          descricao={typeof erro === 'string' ? erro : 'Verifique a conexão e tente de novo.'}
        >
          {aoRecarregar && <Botao rotulo="Tentar de novo" icone="refresh-cw" severidade="secundario" onClick={aoRecarregar} />}
        </Vazio>
      </div>
    );
  } else if (!registros.length) {
    corpo = (
      <div className="lp-tbl-vazio">
        <Vazio icone={vazioIcone} titulo={vazioTitulo} descricao={vazioDescricao}>
          {vazioAcoes}
        </Vazio>
      </div>
    );
  } else {
    corpo = (
      <div className={cx('lp-tbl-scroll', atualizando && 'is-atualizando')} tabIndex={0} role="region" aria-label={rotulo} aria-busy={atualizando || undefined}>
        <table className={cx('lp-tbl', aparencia === 'grade' && 'lp-tbl--grade')}>
          <thead>
            <tr>
              {selecao && (
                <th className="lp-tbl-col-sel" scope="col">
                  {selecao === 'multipla' ? (
                    <CaixaSelecao marcado={todos} indeterminado={alguns} rotulo="Selecionar todos os visíveis" aoMudar={alternarTodos} />
                  ) : (
                    <span className="lp-sr">Seleção</span>
                  )}
                </th>
              )}
              {colunas.map((c) => (
                <th
                  key={c.campo}
                  scope="col"
                  className={alinh(c)}
                  style={c.largura ? { width: c.largura } : undefined}
                  aria-sort={
                    ordenacao?.campo === c.campo ? (ordenacao.direcao === 'asc' ? 'ascending' : 'descending') : undefined
                  }
                >
                  {c.ordenavel && aoOrdenar ? (
                    <button type="button" className="lp-tbl-ordenar" onClick={() => aoOrdenar(c.campo)}>
                      {c.rotulo}
                      {iconeOrdem(c)}
                    </button>
                  ) : (
                    c.rotulo
                  )}
                </th>
              ))}
              {acoes && (
                <th className="lp-tbl-col-acoes" scope="col">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {registros.map((linha, i) => {
              const k = chaves[i];
              const marcado = !!selecao && sel.has(k);
              return (
                <tr
                  key={k}
                  className={cx((selecao || aoClicarLinha) && 'is-clicavel', marcado && 'is-sel')}
                  onClick={(e) => aoClicar(linha, k, e)}
                >
                  {selecao && (
                    <td className="lp-tbl-col-sel">
                      <CaixaSelecao marcado={marcado} rotulo={`Selecionar linha ${i + 1}`} aoMudar={() => alternar(k)} />
                    </td>
                  )}
                  {colunas.map((c) => {
                    const v = valorDoCampo(linha, c.campo);
                    let cel: ReactNode;
                    if (c.render) cel = c.render(linha);
                    else if (c.severidade) cel = <Status rotulo={String(c.formato ? c.formato(v, linha) : v ?? '')} severidade={c.severidade(linha)} />;
                    else if (c.formato) cel = c.formato(v, linha);
                    else cel = v === null || v === undefined || v === '' ? '—' : String(v);
                    return (
                      <td key={c.campo} className={cx(alinh(c), c.destaque && 'is-destaque', c.maiuscula && 'is-maiuscula')}>
                        {cel}
                      </td>
                    );
                  })}
                  {acoes && (
                    <td className="lp-tbl-col-acoes">
                      <div className="lp-tbl-acoes">{acoes(linha)}</div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={cx('lp-tbl-card', className)}>
      {corpo}
      {paginacao && !carregando && !erro && paginacao.total > 0 && <Paginacao embutida {...paginacao} />}
    </div>
  );
}
