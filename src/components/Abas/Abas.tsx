import { Children, isValidElement, useId, useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import { MenuSuspenso } from '../MenuSuspenso/MenuSuspenso';
import './Abas.css';

export interface AbaProps {
  valor: string;
  rotulo: string;
  icone?: IconeProp;
  desabilitada?: boolean;
  /** Número de pendências (chip âmbar na aba). */
  pendentes?: number;
  /** Selo livre depois do rótulo (ex.: `<Badge>`). */
  badge?: ReactNode;
  /** Abas vizinhas com o mesmo grupo viram uma aba com menu suspenso. */
  grupo?: string;
  children?: ReactNode;
}

/** Painel de uma aba. Só funciona dentro de `<Abas>`. */
export function Aba(_props: AbaProps): null {
  return null;
}

/**
 * `sublinhado` (padrão) · `classica` = aba com borda colada no painel ·
 * `pilulas` = ativa sólida · `suave` = ativa em fundo claro · `contorno` =
 * todas com borda, ativa sólida · `segmentado` = trilho cinza com a ativa
 * destacada · `passos` = círculos numerados · `cartao` = ativa e painel na
 * mesma cor · `blocos` = caixas com ícone em cima e seta para o painel.
 */
export type VarianteAbas = 'sublinhado' | 'classica' | 'pilulas' | 'suave' | 'contorno' | 'segmentado' | 'passos' | 'cartao' | 'blocos';

/** `preencher` = abas crescem conforme o rótulo · `justificado` = todas da mesma largura. */
export type AlinhamentoAbas = 'inicio' | 'centro' | 'fim' | 'preencher' | 'justificado';

export interface AbasProps {
  /** Aba ativa (controlado). Sem ele, começa na primeira. */
  ativa?: string;
  aoMudar?: (valor: string) => void;
  /** Nome acessível da lista de abas. */
  rotulo?: string;
  variante?: VarianteAbas;
  /** Padrão: `preencher` no sublinhado, `inicio` nas demais. */
  alinhamento?: AlinhamentoAbas;
  /** `responsiva` = empilha as abas abaixo de 36rem. */
  orientacao?: 'horizontal' | 'vertical' | 'responsiva';
  /** Ícone acima do rótulo. */
  iconeAcima?: boolean;
  /** `caixa` = painel com borda e respiro. */
  painel?: 'livre' | 'caixa';
  /** `base` = abas abaixo do painel (rodapé). */
  posicaoBarra?: 'topo' | 'base';
  /** Título à esquerda, na mesma linha das abas. */
  cabecalho?: ReactNode;
  /** Modo página: cabeçalho com Voltar + título acima das abas. */
  titulo?: string;
  identidade?: string;
  aoVoltar?: () => void;
  acoes?: ReactNode;
  children: ReactNode;
  className?: string;
}

type Entrada = { aba: ReactElement<AbaProps>; i: number } | { grupo: string; abas: Array<ReactElement<AbaProps>> };

export function Abas({
  ativa,
  aoMudar,
  rotulo,
  variante = 'sublinhado',
  alinhamento,
  orientacao = 'horizontal',
  iconeAcima = false,
  painel = 'livre',
  posicaoBarra = 'topo',
  cabecalho,
  titulo,
  identidade,
  aoVoltar,
  acoes,
  children,
  className,
}: AbasProps) {
  const base = useId().replace(/:/g, '');
  const barra = useRef<HTMLDivElement>(null);
  const abas = Children.toArray(children).filter(
    (c): c is ReactElement<AbaProps> => isValidElement(c) && c.type === Aba,
  );
  const [interna, setInterna] = useState(abas[0]?.props.valor);
  const atual = ativa ?? interna;
  const pagina = !!titulo;
  const vertical = orientacao === 'vertical';
  const alinha = alinhamento ?? (variante === 'sublinhado' ? 'preencher' : 'inicio');

  const selecionar = (v: string) => {
    setInterna(v);
    aoMudar?.(v);
  };

  const aoTeclar = (e: KeyboardEvent<HTMLButtonElement>) => {
    const lista = Array.from(barra.current?.querySelectorAll<HTMLButtonElement>('.lp-abas-tab') ?? []);
    const n = lista.length;
    const i = lista.indexOf(e.currentTarget);
    let j = -1;
    if (e.key === (vertical ? 'ArrowDown' : 'ArrowRight')) j = (i + 1) % n;
    else if (e.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) j = (i - 1 + n) % n;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = n - 1;
    if (j < 0) return;
    e.preventDefault();
    lista[j]?.focus();
  };

  // abas vizinhas do mesmo grupo viram uma entrada só (aba com menu)
  const entradas: Entrada[] = [];
  abas.forEach((aba, i) => {
    const g = aba.props.grupo;
    const ultima = entradas[entradas.length - 1];
    if (g && ultima && 'grupo' in ultima && ultima.grupo === g) ultima.abas.push(aba);
    else if (g) entradas.push({ grupo: g, abas: [aba] });
    else entradas.push({ aba, i });
  });

  const temPainel = (p: AbaProps) => p.children !== undefined && p.children !== null && p.children !== false;

  const conteudoTab = (p: AbaProps, i: number) => (
    <>
      {variante === 'passos' && <span className="lp-abas-num">{i + 1}</span>}
      {p.icone && (
        <span className="lp-abas-ic">
          <Icone icone={p.icone} />
        </span>
      )}
      <span className="lp-abas-rot">{p.rotulo}</span>
      {p.badge}
      {!!p.pendentes && (
        <span className="lp-abas-pend">
          {p.pendentes}
          <span className="lp-sr"> pendência(s) nesta aba</span>
        </span>
      )}
    </>
  );

  const lista = (
    <div
      className="lp-abas-barra"
      role="tablist"
      aria-label={rotulo ?? titulo}
      aria-orientation={vertical ? 'vertical' : undefined}
      ref={barra}
    >
      {entradas.map((en) => {
        if ('grupo' in en) {
          const on = en.abas.some((a) => a.props.valor === atual);
          const escolhida = en.abas.find((a) => a.props.valor === atual);
          return (
            <MenuSuspenso
              key={`grupo-${en.grupo}`}
              rotulo={en.grupo}
              itens={en.abas.map((a) => ({
                id: a.props.valor,
                rotulo: a.props.rotulo,
                icone: a.props.icone,
                desabilitado: a.props.desabilitada,
                ativo: a.props.valor === atual,
              }))}
              aoEscolher={selecionar}
              className="lp-abas-grupo"
              gatilho={(props, aberto) => (
                <button
                  {...props}
                  type="button"
                  className={cx('lp-abas-tab', on && 'is-on', aberto && 'is-aberto')}
                  onKeyDown={(e) => {
                    props.onKeyDown(e);
                    if (!e.defaultPrevented) aoTeclar(e);
                  }}
                >
                  <span className="lp-abas-rot">{escolhida ? `${en.grupo}: ${escolhida.props.rotulo}` : en.grupo}</span>
                  <Icone icone="chevron-down" className="lp-abas-seta" />
                </button>
              )}
            />
          );
        }
        const p = en.aba.props;
        const on = p.valor === atual;
        return (
          <button
            key={p.valor}
            type="button"
            role="tab"
            id={`${base}-tab-${p.valor}`}
            aria-controls={temPainel(p) ? `${base}-painel-${p.valor}` : undefined}
            aria-selected={on}
            aria-disabled={p.desabilitada || undefined}
            tabIndex={on ? 0 : -1}
            className={cx('lp-abas-tab', on && 'is-on', p.desabilitada && 'is-off')}
            onClick={() => !p.desabilitada && selecionar(p.valor)}
            onKeyDown={aoTeclar}
          >
            {conteudoTab(p, en.i)}
          </button>
        );
      })}
    </div>
  );

  const paineis = abas.filter((a) => temPainel(a.props));

  return (
    <div
      className={cx(
        'lp-abas',
        `lp-abas--${variante}`,
        `lp-abas--alinha-${alinha}`,
        orientacao !== 'horizontal' && `lp-abas--${orientacao}`,
        iconeAcima && 'lp-abas--icone-acima',
        painel === 'caixa' && 'lp-abas--painel-caixa',
        posicaoBarra === 'base' && 'lp-abas--barra-base',
        pagina && 'lp-abas--pagina',
        className,
      )}
    >
      {pagina ? (
        <div className="lp-abas-banda">
          <header className="lp-abas-cab">
            {aoVoltar && (
              <button type="button" className="lp-voltar" aria-label="Voltar" title="Voltar" onClick={aoVoltar}>
                <Icone icone="arrow-left" />
              </button>
            )}
            <div className="lp-abas-titulos">
              <h2 className="lp-abas-titulo">{titulo}</h2>
              {identidade && <span className="lp-abas-ident">{identidade}</span>}
            </div>
            {acoes && <div className="lp-abas-acoes">{acoes}</div>}
          </header>
          {lista}
        </div>
      ) : cabecalho ? (
        <div className="lp-abas-topo">
          <div className="lp-abas-cabecalho">{cabecalho}</div>
          {lista}
        </div>
      ) : (
        lista
      )}
      {paineis.length > 0 && (
        <div className="lp-abas-paineis">
          {paineis.map((a) => (
            <div
              key={a.props.valor}
              role="tabpanel"
              id={`${base}-painel-${a.props.valor}`}
              aria-labelledby={a.props.grupo ? undefined : `${base}-tab-${a.props.valor}`}
              aria-label={a.props.grupo ? a.props.rotulo : undefined}
              className="lp-abas-painel"
              hidden={a.props.valor !== atual}
            >
              {a.props.children}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
