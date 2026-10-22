import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import { portal } from '../../utils/portal';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import { useCliqueFora } from '../../utils/useCliqueFora';
import { Botao, type BotaoProps, type PadroesBotao, type SeveridadeBotao } from '../Botao/Botao';
import { GrupoBotoes } from '../GrupoBotoes/GrupoBotoes';
import './MenuSuspenso.css';

export interface ItemMenuSuspenso {
  /** Devolvido em `aoEscolher` (sem id, vai o rótulo). */
  id?: string;
  /** `item` (padrão) · `titulo` = cabeçalho de seção · `divisor` · `texto` = linha não clicável. */
  tipo?: 'item' | 'titulo' | 'divisor' | 'texto';
  rotulo?: string;
  icone?: IconeProp;
  /** Texto miúdo à direita (atalho, contagem). */
  extra?: string;
  /** Vira link (`<a href>`) em vez de botão. */
  href?: string;
  ativo?: boolean;
  desabilitado?: boolean;
  destrutivo?: boolean;
}

export type DirecaoMenu = 'baixo' | 'cima' | 'direita' | 'esquerda';
export type AlinhamentoMenu = 'inicio' | 'centro' | 'fim';
/**
 * Quando o menu fecha sozinho: `sempre` (escolher item ou clicar fora) ·
 * `dentro` (só ao escolher item) · `fora` (só ao clicar fora) · `manual`
 * (só pelo próprio botão ou Esc).
 */
export type FechamentoMenu = 'sempre' | 'dentro' | 'fora' | 'manual';

/** Props que um gatilho próprio (`gatilho`) deve espalhar no seu botão. */
export interface PropsGatilhoMenu {
  ref: RefObject<HTMLButtonElement | null>;
  'aria-haspopup': 'menu' | 'dialog';
  'aria-expanded': boolean;
  'aria-controls'?: string;
  disabled?: boolean;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

export interface MenuSuspensoProps extends PadroesBotao {
  rotulo?: string;
  icone?: IconeProp;
  /** Balão de dica — use em gatilhos só com ícone. */
  dica?: string;
  'aria-label'?: string;
  itens?: ItemMenuSuspenso[];
  aoEscolher?: (id: string) => void;
  /** Conteúdo livre no painel (texto, formulário). A função recebe `fechar`. */
  children?: ReactNode | ((fechar: () => void) => ReactNode);
  /** Botão dividido: ação principal + seta que abre o menu. */
  dividido?: boolean;
  aoClicarPrincipal?: () => void;
  /** Para onde o painel abre; vira para o lado oposto se não couber. */
  direcao?: DirecaoMenu;
  alinhamento?: AlinhamentoMenu;
  /** Alinhamento a partir de 64rem (o anterior vale abaixo disso). */
  alinhamentoTelaGrande?: AlinhamentoMenu;
  fechamento?: FechamentoMenu;
  /** `[ao longo, afastando]` em px (ex.: `[10, 20]`). */
  deslocamento?: [number, number];
  /** No dividido, `pai` ancora o painel no grupo inteiro em vez de só na seta. */
  referencia?: 'gatilho' | 'pai';
  /** Painel escuro. */
  escuro?: boolean;
  /** Cor do item em foco/ativo (painel colorido). */
  cor?: SeveridadeBotao;
  sombra?: BotaoProps['sombra'];
  /** Esconde a seta do gatilho. */
  semSeta?: boolean;
  /** Largura mínima do painel (ex.: `'16rem'`). */
  larguraMenu?: string;
  desabilitado?: boolean;
  /** Gatilho próprio no lugar do `Botao` (ex.: uma aba). Espalhe as props no `<button>`. */
  gatilho?: (props: PropsGatilhoMenu, aberto: boolean) => ReactNode;
  className?: string;
}

interface Pos {
  top: number;
  left: number;
  direcao: DirecaoMenu;
}

const SETA: Record<DirecaoMenu, string> = {
  baixo: 'chevron-down',
  cima: 'chevron-up',
  direita: 'chevron-right',
  esquerda: 'chevron-left',
};
const MARGEM = 8;
const SELETOR_ITEM = '[role="menuitem"]:not([aria-disabled="true"])';
const SELETOR_FOCAVEL = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

function posicionar(r: DOMRect, w: number, h: number, direcao: DirecaoMenu, alinh: AlinhamentoMenu, [ao, afasta]: [number, number]): Pos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gap = 4 + afasta;
  let dir = direcao;
  // vira para o lado oposto quando não cabe e do outro lado cabe
  if (dir === 'baixo' && r.bottom + gap + h > vh && r.top - gap - h >= 0) dir = 'cima';
  else if (dir === 'cima' && r.top - gap - h < 0 && r.bottom + gap + h <= vh) dir = 'baixo';
  else if (dir === 'direita' && r.right + gap + w > vw && r.left - gap - w >= 0) dir = 'esquerda';
  else if (dir === 'esquerda' && r.left - gap - w < 0 && r.right + gap + w <= vw) dir = 'direita';

  let top: number;
  let left: number;
  if (dir === 'baixo' || dir === 'cima') {
    top = dir === 'baixo' ? r.bottom + gap : r.top - gap - h;
    left = alinh === 'inicio' ? r.left : alinh === 'fim' ? r.right - w : r.left + r.width / 2 - w / 2;
    left += ao;
  } else {
    left = dir === 'direita' ? r.right + gap : r.left - gap - w;
    top = alinh === 'fim' ? r.bottom - h : alinh === 'centro' ? r.top + r.height / 2 - h / 2 : r.top;
    top += ao;
  }
  // nunca sai da janela
  left = Math.max(MARGEM, Math.min(left, vw - w - MARGEM));
  top = Math.max(MARGEM, Math.min(top, vh - h - MARGEM));
  return { top, left, direcao: dir };
}

/**
 * Menu suspenso (dropdown): botão que abre uma lista de ações, ou um painel
 * livre (texto, formulário). Dividido, em 4 direções, alinhável, com
 * fechamento configurável e navegação por setas.
 */
export function MenuSuspenso({
  rotulo,
  icone,
  dica,
  'aria-label': ariaLabel,
  itens,
  aoEscolher,
  children,
  dividido = false,
  aoClicarPrincipal,
  direcao = 'baixo',
  alinhamento = 'inicio',
  alinhamentoTelaGrande,
  fechamento = 'sempre',
  deslocamento = [0, 0],
  referencia = 'gatilho',
  escuro = false,
  cor,
  sombra,
  semSeta = false,
  larguraMenu,
  desabilitado,
  gatilho: gatilhoProprio,
  className,
  severidade,
  aparencia,
  formato,
  tamanho,
}: MenuSuspensoProps) {
  const id = useId();
  const raiz = useRef<HTMLSpanElement>(null);
  const gatilho = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const [aberto, setAberto] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  // foco ao abrir: primeiro ou último item (seta para cima no gatilho)
  const focoInicial = useRef<'primeiro' | 'ultimo'>('primeiro');
  const ehMenu = !!itens?.length;
  const [ao, afasta] = deslocamento;

  const fechar = useCallback((devolverFoco = true) => {
    setAberto(false);
    if (devolverFoco) gatilho.current?.focus();
  }, []);

  const medir = useCallback(() => {
    const ancora = referencia === 'pai' ? raiz.current : gatilho.current;
    const el = painel.current;
    if (!ancora || !el) return;
    const grande = alinhamentoTelaGrande && window.matchMedia('(min-width: 64rem)').matches;
    setPos(posicionar(ancora.getBoundingClientRect(), el.offsetWidth, el.offsetHeight, direcao, grande ? alinhamentoTelaGrande : alinhamento, [ao, afasta]));
  }, [referencia, direcao, alinhamento, alinhamentoTelaGrande, ao, afasta]);

  useLayoutEffect(() => {
    if (!aberto) {
      setPos(null);
      return;
    }
    medir();
    window.addEventListener('scroll', medir, true);
    window.addEventListener('resize', medir);
    return () => {
      window.removeEventListener('scroll', medir, true);
      window.removeEventListener('resize', medir);
    };
  }, [aberto, medir]);

  // depois de posicionado, leva o foco para dentro do painel
  const posicionado = !!pos;
  useEffect(() => {
    if (!posicionado || !painel.current) return;
    const lista = painel.current.querySelectorAll<HTMLElement>(ehMenu ? SELETOR_ITEM : SELETOR_FOCAVEL);
    const alvo = focoInicial.current === 'ultimo' ? lista[lista.length - 1] : lista[0];
    (alvo ?? painel.current).focus({ preventScroll: true });
  }, [posicionado, ehMenu]);

  useCliqueFora([raiz, painel], aberto && (fechamento === 'sempre' || fechamento === 'fora'), () => fechar(false));

  // Esc fecha mesmo com o foco fora do painel (ex.: fechamento manual)
  useEffect(() => {
    if (!aberto) return;
    const esc = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && fechar();
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [aberto, fechar]);

  const alternar = () => {
    focoInicial.current = 'primeiro';
    setAberto((a) => !a);
  };

  const teclaGatilho = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    focoInicial.current = e.key === 'ArrowUp' ? 'ultimo' : 'primeiro';
    setAberto(true);
  };

  const teclaPainel = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      fechar();
      return;
    }
    const el = painel.current;
    if (!el) return;
    if (e.key === 'Tab') {
      // sair do painel com Tab fecha e devolve o foco à ordem normal da página
      const focaveis = Array.from(el.querySelectorAll<HTMLElement>(ehMenu ? SELETOR_ITEM : SELETOR_FOCAVEL));
      const atual = document.activeElement;
      if (ehMenu || !focaveis.length || (e.shiftKey ? atual === focaveis[0] : atual === focaveis[focaveis.length - 1])) {
        if (e.shiftKey) e.preventDefault();
        fechar();
      }
      return;
    }
    if (!ehMenu) return;
    const lista = Array.from(el.querySelectorAll<HTMLElement>(SELETOR_ITEM));
    if (!lista.length) return;
    const i = lista.indexOf(document.activeElement as HTMLElement);
    let prox: number | null = null;
    if (e.key === 'ArrowDown') prox = (i + 1) % lista.length;
    else if (e.key === 'ArrowUp') prox = (i - 1 + lista.length) % lista.length;
    else if (e.key === 'Home') prox = 0;
    else if (e.key === 'End') prox = lista.length - 1;
    if (prox === null) return;
    e.preventDefault();
    lista[prox].focus();
  };

  const escolher = (item: ItemMenuSuspenso) => {
    if (item.desabilitado) return;
    aoEscolher?.(item.id ?? item.rotulo ?? '');
    if (fechamento === 'sempre' || fechamento === 'dentro') fechar();
  };

  const seta = !semSeta && <Icone icone={SETA[direcao]} className="lp-menu-sus-seta" />;
  const propsGatilho: PropsGatilhoMenu = {
    ref: gatilho,
    'aria-haspopup': ehMenu ? 'menu' : 'dialog',
    'aria-expanded': aberto,
    'aria-controls': aberto ? id : undefined,
    disabled: desabilitado,
    onClick: alternar,
    onKeyDown: teclaGatilho,
  };
  const padroes = { severidade, aparencia, formato, tamanho, sombra };

  let botao: ReactNode;
  if (gatilhoProprio) {
    botao = gatilhoProprio(propsGatilho, aberto);
  } else if (dividido) {
    const botaoSeta = (
      <Botao
        {...propsGatilho}
        className={cx('lp-menu-sus-divisor', aberto && 'is-aberto')}
        icone={SETA[direcao]}
        aria-label={ariaLabel ?? (rotulo ? `Mais opções de ${rotulo}` : 'Mais opções')}
      />
    );
    botao = (
      <GrupoBotoes severidade={severidade} aparencia={aparencia} formato={formato} tamanho={tamanho} rotulo={rotulo}>
        {direcao === 'esquerda' && botaoSeta}
        <Botao rotulo={rotulo} icone={icone} sombra={sombra} disabled={desabilitado} onClick={aoClicarPrincipal} />
        {direcao !== 'esquerda' && botaoSeta}
      </GrupoBotoes>
    );
  } else {
    botao = (
      <Botao {...propsGatilho} {...padroes} icone={icone} dica={dica} aria-label={ariaLabel ?? (!rotulo ? dica : undefined)} className={cx(aberto && 'is-aberto')}>
        {rotulo || seta ? (
          <>
            {direcao === 'esquerda' && seta}
            {rotulo}
            {direcao !== 'esquerda' && seta}
          </>
        ) : undefined}
      </Botao>
    );
  }

  return (
    <span ref={raiz} className={cx('lp-menu-sus', className)}>
      {botao}
      {aberto &&
        portal(
          <div
            ref={painel}
            id={id}
            role={ehMenu ? 'menu' : 'dialog'}
            aria-label={rotulo ?? ariaLabel ?? dica}
            tabIndex={-1}
            className={cx(
              'lp-menu-sus-painel',
              escuro && 'lp-menu-sus-painel--escuro',
              cor && 'lp-menu-sus-painel--colorido',
              cor && cor !== 'pri' && `lp-menu-sus-painel--${cor}`,
              pos && `lp-menu-sus-painel--${pos.direcao}`,
            )}
            style={{ top: pos?.top ?? 0, left: pos?.left ?? 0, minWidth: larguraMenu, visibility: pos ? undefined : 'hidden' }}
            onKeyDown={teclaPainel}
          >
            {itens?.map((item, i) => {
              const tipo = item.tipo ?? 'item';
              if (tipo === 'divisor') return <div key={i} role="separator" className="lp-menu-sus-ln" />;
              if (tipo === 'titulo')
                return (
                  <div key={i} role="presentation" className="lp-menu-sus-titulo">
                    {item.rotulo}
                  </div>
                );
              if (tipo === 'texto')
                return (
                  <div key={i} role="presentation" className="lp-menu-sus-texto">
                    <Icone icone={item.icone} />
                    {item.rotulo}
                  </div>
                );
              const conteudo = (
                <>
                  <Icone icone={item.icone} />
                  <span className="lp-menu-sus-rotulo">{item.rotulo}</span>
                  {item.extra && <span className="lp-menu-sus-extra">{item.extra}</span>}
                </>
              );
              const props = {
                role: 'menuitem',
                tabIndex: -1,
                className: cx('lp-menu-sus-item', item.ativo && 'is-ativo', item.destrutivo && 'is-destrutivo'),
                'aria-current': item.ativo ? ('true' as const) : undefined,
                'aria-disabled': item.desabilitado || undefined,
                onClick: () => escolher(item),
              };
              return item.href && !item.desabilitado ? (
                <a key={item.id ?? i} href={item.href} {...props}>
                  {conteudo}
                </a>
              ) : (
                <button key={item.id ?? i} type="button" {...props}>
                  {conteudo}
                </button>
              );
            })}
            {typeof children === 'function' ? children(() => fechar()) : children}
          </div>,
        )}
    </span>
  );
}
