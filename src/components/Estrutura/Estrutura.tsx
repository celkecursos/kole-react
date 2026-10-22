import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import { useCliqueFora } from '../../utils/useCliqueFora';
import { Avatar } from '../Avatar/Avatar';
import { Busca, type ItemBusca } from '../Busca/Busca';
import { Dica } from '../Dica/Dica';
import { ProvedorTrilha, caminhoNoMenu, type ItemTrilha, type ModeloTrilha } from '../Trilha/Trilha';
import { usePreferenciasOpcional, type Densidade } from '../Preferencias/Preferencias';
import './Estrutura.css';

export interface ItemNav {
  rotulo: string;
  icone?: IconeProp;
  /** Folha: destino. Grupo: omita e use `filhos`. */
  rota?: string;
  filhos?: ItemNav[];
  desabilitado?: boolean;
}

export interface SecaoNav {
  /** Rótulo do grupo (linha em caixa alta). */
  rotulo?: string;
  itens: ItemNav[];
}

export interface Marca {
  nome: string;
  subtitulo?: string;
  /** URL da imagem do logo (sem ela, mostra um escudo). */
  logo?: string;
  href?: string;
}

export interface UsuarioEstrutura {
  nome: string;
  cargo?: string;
  foto?: string;
  iniciais?: string;
}

export interface ItemMenu {
  id: string;
  rotulo: string;
  icone?: string;
  destrutivo?: boolean;
  divisorAntes?: boolean;
}

export interface Notificacao {
  id: string;
  titulo: string;
  descricao?: string;
  tempo?: string;
  icone?: string;
  naoLida?: boolean;
}

/** Props entregues a `renderLink` (para usar o <Link> do seu roteador). */
export interface PropsLink {
  href: string;
  className: string;
  children: ReactNode;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
  'aria-current'?: 'page';
  'aria-disabled'?: boolean;
}

export interface EstruturaProps {
  marca: Marca;
  nav: SecaoNav[];
  /** Rota atual — marca o item ativo (ex.: `location.pathname`). */
  rotaAtual?: string;
  /** Navegação SPA: recebe a rota e evita o reload. */
  aoNavegar?: (rota: string) => void;
  /** Renderiza os links com o componente do seu roteador. */
  renderLink?: (props: PropsLink, item: ItemNav) => ReactNode;
  usuario?: UsuarioEstrutura;
  menuUsuario?: ItemMenu[];
  aoEscolherMenuUsuario?: (id: string) => void;
  /** Lista de notificações. Sem a prop, o sino não aparece. */
  notificacoes?: Notificacao[];
  aoEscolherNotificacao?: (id: string) => void;
  /** Menu de ferramentas de desenvolvimento (não passe em produção). */
  menuDesenvolvimento?: ItemMenu[];
  aoEscolherMenuDesenvolvimento?: (id: string) => void;
  /** Tarja de ambiente no topo da sidebar (Homologação, Treinamento…). */
  ambiente?: {
    rotulo: string;
    severidade?: 'warn' | 'err' | 'info' | 'neutral';
    /** Texto curto para a sidebar recolhida (padrão: 3 primeiras letras, ex.: "HOM"). */
    sigla?: string;
  };
  versao?: string;
  /**
   * Como os grupos do menu abrem com a sidebar expandida: `abaixo` (padrão,
   * sanfona dentro da própria sidebar) ou `lateral` (painel ao lado). Com a
   * sidebar recolhida, sempre abre o painel lateral.
   */
  submenu?: 'abaixo' | 'lateral';
  /** Modelo padrão das trilhas de navegação do sistema (separador, ícones, aparência). */
  modeloTrilha?: ModeloTrilha;
  /** Conteúdo do rodapé da sidebar (marca do ecossistema, links…). */
  rodapeSidebar?: ReactNode;
  /** Rodapé da área de conteúdo, sempre visível no pé da tela (autoria, direitos, links…). */
  rodape?: ReactNode;
  /** Substitui a busca padrão (filtro do menu). `false` remove. */
  busca?: ReactNode | false;
  placeholderBusca?: string;
  aoBuscar?: (termo: string) => void;
  /** Controles extras à direita da topbar. */
  complementosTopbar?: ReactNode;
  children?: ReactNode;
}

const DENSIDADES: Array<{ valor: Densidade; rotulo: string; icone: string }> = [
  { valor: 'compacta', rotulo: 'Compacta', icone: 'minus' },
  { valor: 'confortavel', rotulo: 'Confortável', icone: 'equal' },
  { valor: 'espacosa', rotulo: 'Espaçosa', icone: 'menu' },
];

type Menu = 'densidade' | 'dev' | 'sino' | 'usuario' | 'compacto' | null;

const CHAVE_SIDEBAR = 'lp-sidebar-expandida';

function useMedia(consulta: string) {
  const [casa, setCasa] = useState(() => typeof window !== 'undefined' && window.matchMedia(consulta).matches);
  useEffect(() => {
    const mq = window.matchMedia(consulta);
    const h = () => setCasa(mq.matches);
    h();
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [consulta]);
  return casa;
}

function lerExpandida(): boolean {
  try {
    return localStorage.getItem(CHAVE_SIDEBAR) !== '0';
  } catch {
    return true;
  }
}

function achatar(nav: SecaoNav[]): ItemBusca[] {
  const lista: ItemBusca[] = [];
  const visitar = (itens: ItemNav[], trilha: string[], icone?: IconeProp) => {
    for (const i of itens) {
      if (i.desabilitado) continue;
      if (i.filhos?.length) visitar(i.filhos, [...trilha, i.rotulo], i.icone ?? icone);
      else if (i.rota) lista.push({ rotulo: i.rotulo, rota: i.rota, icone: i.icone ?? icone, trilha: trilha.join(' › ') || undefined });
    }
  };
  nav.forEach((s) => visitar(s.itens, s.rotulo ? [s.rotulo] : []));
  return lista;
}

function ItensMenu({ itens, aoEscolher }: { itens: ItemMenu[]; aoEscolher: (id: string) => void }) {
  return (
    <>
      {itens.map((item) => (
        <Fragment key={item.id}>
          {item.divisorAntes && <div className="lp-tb-menu-ln" aria-hidden="true" />}
          <button type="button" className={cx('lp-tb-menu-item', item.destrutivo && 'lp-danger')} onClick={() => aoEscolher(item.id)}>
            {item.icone && <Icone icone={item.icone} />}
            <span>{item.rotulo}</span>
          </button>
        </Fragment>
      ))}
    </>
  );
}

/**
 * Moldura do app autenticado: sidebar recolhível (com submenu em painel
 * lateral), topbar com busca, densidade, tema, notificações e perfil.
 * Responsiva: abaixo de 64rem a sidebar vira sobreposição; abaixo de 48rem,
 * gaveta com hambúrguer.
 */
export function Estrutura({
  marca,
  nav,
  rotaAtual,
  aoNavegar,
  renderLink,
  usuario,
  menuUsuario = [],
  aoEscolherMenuUsuario,
  notificacoes,
  aoEscolherNotificacao,
  menuDesenvolvimento = [],
  aoEscolherMenuDesenvolvimento,
  ambiente,
  versao,
  rodapeSidebar,
  rodape,
  modeloTrilha,
  submenu = 'abaixo',
  busca,
  placeholderBusca = 'Buscar no sistema…',
  aoBuscar,
  complementosTopbar,
  children,
}: EstruturaProps) {
  const prefs = usePreferenciasOpcional();
  const idConteudo = `lp-conteudo-${useId().replace(/:/g, '')}`;
  const estreito = useMedia('(max-width: 64rem)');
  const movel = useMedia('(max-width: 48rem)');

  const [expandida, setExpandida] = useState(() => !estreito && lerExpandida());
  const [aside, setAside] = useState<string | null>(null);
  // altura (px) do item que abriu o cartão flutuante, com a sidebar recolhida
  const [asideTopo, setAsideTopo] = useState(0);
  const [subAbertos, setSubAbertos] = useState<Set<string>>(new Set());
  const [menu, setMenu] = useState<Menu>(null);
  const [logoOk, setLogoOk] = useState(true);

  const sidebarRef = useRef<HTMLElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);
  const direitaRef = useRef<HTMLDivElement>(null);
  const conteudoRef = useRef<HTMLElement>(null);

  // telas estreitas nascem (e voltam) recolhidas
  useEffect(() => {
    if (estreito) setExpandida(false);
    else setExpandida(lerExpandida());
  }, [estreito]);

  // página nova começa do topo (o scroll é do <main>, não da janela)
  useEffect(() => {
    conteudoRef.current?.scrollTo({ top: 0 });
  }, [rotaAtual]);

  const alternarSidebar = () => {
    setExpandida((e) => {
      const nova = !e;
      if (!estreito) {
        try {
          localStorage.setItem(CHAVE_SIDEBAR, nova ? '1' : '0');
        } catch {
          /* sem armazenamento: segue */
        }
      }
      return nova;
    });
  };

  const fecharMenus = useCallback(() => setMenu(null), []);
  const fecharAside = useCallback(() => setAside(null), []);
  useCliqueFora([direitaRef], menu !== null, fecharMenus);
  useCliqueFora([sidebarRef, asideRef], aside !== null, fecharAside);

  useEffect(() => {
    if (!menu && !aside) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenu(null);
      setAside(null);
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [menu, aside]);

  // Só UM item fica ativo: o de rota mais específica que casa com a atual.
  // Em /pedidos/novo, "Novo pedido" ganha de "Pedidos"; em /perfil/editar (fora
  // do menu), o prefixo ainda acende "Meu perfil".
  const rotaAtiva = useMemo(() => {
    if (!rotaAtual) return undefined;
    const casa = (rota: string) =>
      rota === '/' ? rotaAtual === '/' : rotaAtual === rota || rotaAtual.startsWith(rota.endsWith('/') ? rota : `${rota}/`);
    let melhor: string | undefined;
    const visitar = (itens: ItemNav[]) => {
      for (const i of itens) {
        if (i.rota && casa(i.rota) && (!melhor || i.rota.length > melhor.length)) melhor = i.rota;
        if (i.filhos) visitar(i.filhos);
      }
    };
    nav.forEach((secao) => visitar(secao.itens));
    return melhor;
  }, [nav, rotaAtual]);
  const ativo = useCallback((rota?: string) => !!rota && rota === rotaAtiva, [rotaAtiva]);
  const grupoAtivo = (item: ItemNav): boolean => !!item.filhos?.some((f) => ativo(f.rota) || grupoAtivo(f));

  // sanfona: com a sidebar expandida os grupos abrem para baixo
  const emLinha = submenu === 'abaixo' && expandida;
  const alternarGrupo = (chave: string) =>
    setSubAbertos((s) => {
      const n = new Set(s);
      if (n.has(chave)) n.delete(chave);
      else n.add(chave);
      return n;
    });
  // ao chegar numa página, o(s) grupo(s) dela abrem (e o usuário ainda pode fechar)
  useEffect(() => {
    const chaves: string[] = [];
    const visitar = (itens: ItemNav[], pai: string): boolean => {
      let achou = false;
      for (const i of itens) {
        const chave = pai ? `${pai}›${i.rotulo}` : i.rotulo;
        if (i.filhos && visitar(i.filhos, chave)) {
          chaves.push(chave);
          achou = true;
        } else if (!i.filhos && ativo(i.rota)) achou = true;
      }
      return achou;
    };
    nav.forEach((s) => visitar(s.itens, ''));
    if (chaves.length) setSubAbertos((s) => new Set([...s, ...chaves]));
  }, [nav, ativo]);
  // passou a abrir para baixo: o painel lateral sai
  useEffect(() => {
    if (emLinha) setAside(null);
  }, [emLinha]);

  const aoNavegou = () => {
    setAside(null);
    if (estreito) setExpandida(false);
  };

  const link = (item: ItemNav, className: string, conteudo: ReactNode) => {
    const on = ativo(item.rota);
    const props: PropsLink = {
      href: item.rota ?? '#',
      className: cx(className, on && 'lp-active', item.desabilitado && 'lp-is-disabled'),
      'aria-current': on ? 'page' : undefined,
      'aria-disabled': item.desabilitado || undefined,
      children: conteudo,
      onClick: (e) => {
        if (item.desabilitado) {
          e.preventDefault();
          return;
        }
        if (aoNavegar && item.rota) {
          e.preventDefault();
          aoNavegar(item.rota);
        }
        aoNavegou();
      },
    };
    return renderLink ? renderLink(props, item) : <a {...props} />;
  };

  // trilha da página atual: Início › seção › grupo(s) › item do menu
  const trilha = useMemo(() => {
    const inicio: ItemTrilha = { rotulo: 'Início', rota: marca.href ?? '/', icone: 'house' };
    const caminho = caminhoNoMenu(nav, ativo);
    const fim = caminho[caminho.length - 1];
    return {
      itens: !fim || fim.rota === inicio.rota ? [inicio] : [inicio, ...caminho],
      link: (rota: string, conteudo: ReactNode, className: string) => link({ rotulo: '', rota }, className, conteudo),
      modelo: modeloTrilha,
    };
    // `link` lê aoNavegar/renderLink do render atual
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav, ativo, marca.href, aoNavegar, renderLink, modeloTrilha]);

  /** Filhos de um grupo aberto para baixo (qualquer profundidade). */
  const renderFilhos = (itens: ItemNav[], chavePai: string): ReactNode =>
    itens.map((filho) => {
      if (!filho.filhos?.length) {
        return (
          <Fragment key={filho.rotulo}>
            {link(
              filho,
              'lp-nav-sub',
              <>
                <span className="lp-nav-sub-ic">
                  <Icone icone={filho.icone ?? 'chevron-right'} />
                </span>
                <span className="lp-nav-sub-tx">{filho.rotulo}</span>
              </>,
            )}
          </Fragment>
        );
      }
      const chave = `${chavePai}›${filho.rotulo}`;
      const aberto = subAbertos.has(chave);
      return (
        <div key={filho.rotulo} className={cx('lp-nav-sub-grp', aberto && 'lp-sub-open', grupoAtivo(filho) && 'lp-has-active')}>
          <button
            type="button"
            className={cx('lp-nav-sub lp-nav-sub-parent', filho.desabilitado && 'lp-is-disabled')}
            disabled={filho.desabilitado}
            aria-expanded={aberto}
            onClick={() => alternarGrupo(chave)}
          >
            <span className="lp-nav-sub-ic">
              <Icone icone={filho.icone ?? 'folder'} />
            </span>
            <span className="lp-nav-sub-tx">{filho.rotulo}</span>
            <Icone icone="chevron-down" className="lp-nav-ch lp-nav-ch--gira" />
          </button>
          {aberto && (
            <div className="lp-nav-sub-netos" role="group" aria-label={filho.rotulo}>
              {renderFilhos(filho.filhos, chave)}
            </div>
          )}
        </div>
      );
    });

  const itensBusca = useMemo(() => achatar(nav), [nav]);
  const itemAside = useMemo(() => {
    for (const s of nav) for (const i of s.itens) if (i.rotulo === aside && i.filhos) return i;
    return null;
  }, [nav, aside]);

  const naoLidas = notificacoes?.filter((n) => n.naoLida).length ?? 0;
  const temDev = menuDesenvolvimento.length > 0;
  const densidadeAtual = DENSIDADES.find((d) => d.valor === prefs?.densidade) ?? DENSIDADES[1];

  const alternarMenu = (m: Exclude<Menu, null>) => setMenu((atual) => (atual === m ? null : m));
  const escolher = (fn?: (id: string) => void) => (id: string) => {
    setMenu(null);
    fn?.(id);
  };

  const avatar = usuario && (
    <Avatar className="lp-avatar-topo" tom="escuro" tamanho="1.875rem" nome={usuario.nome} foto={usuario.foto} iniciais={usuario.iniciais} />
  );

  const cabecalhoUsuario = usuario && (
    <div className="lp-tb-menu-head">
      {avatar}
      <div className="lp-tb-menu-head-tx">
        <div className="lp-profile-name">{usuario.nome}</div>
        {usuario.cargo && <div className="lp-profile-role">{usuario.cargo}</div>}
      </div>
    </div>
  );

  const menuDensidade = prefs && (
    <>
      {DENSIDADES.map((d) => (
        <button
          key={d.valor}
          type="button"
          className={cx('lp-tb-menu-item', prefs.densidade === d.valor && 'lp-active')}
          aria-pressed={prefs.densidade === d.valor}
          onClick={() => prefs.definirDensidade(d.valor)}
        >
          <Icone icone={d.icone} />
          <span>{d.rotulo}</span>
          {prefs.densidade === d.valor && <Icone icone="check" className="lp-tb-menu-check" />}
        </button>
      ))}
    </>
  );

  const buscaPadrao =
    busca === undefined ? (
      <Busca placeholder={placeholderBusca} itensMenu={itensBusca} aoNavegar={aoNavegar} aoBuscar={aoBuscar} />
    ) : (
      busca || null
    );

  return (
    <div className="lp-estrutura">
      <div className={cx('lp-layout', expandida && 'lp-sidebar-expanded', estreito && 'lp-vp-narrow', movel && 'lp-vp-mobile')}>
        <a
          className="lp-skip-link"
          href={`#${idConteudo}`}
          onClick={(e) => {
            e.preventDefault();
            conteudoRef.current?.focus();
          }}
        >
          Pular para o conteúdo
        </a>
        {estreito && expandida && <div className="lp-sidebar-backdrop" aria-hidden="true" onClick={() => setExpandida(false)} />}

        {/* ===== SIDEBAR ===== */}
        <aside className="lp-sidebar" ref={sidebarRef}>
          {ambiente?.rotulo && (
            <div className="lp-amb" data-sev={ambiente.severidade ?? 'warn'} title={ambiente.rotulo}>
              <span className="lp-sr">Ambiente:</span>
              <span className="lp-amb-completo">{ambiente.rotulo}</span>
              <span className="lp-amb-sigla" aria-hidden="true">
                {ambiente.sigla ?? ambiente.rotulo.slice(0, 3)}
              </span>
            </div>
          )}
          <div className="lp-sidebar-head">
            <a
              className="lp-brand-logo"
              href={marca.href ?? '/'}
              aria-label={marca.nome}
              onClick={(e) => {
                if (aoNavegar) {
                  e.preventDefault();
                  aoNavegar(marca.href ?? '/');
                }
              }}
            >
              {marca.logo && logoOk ? (
                <img className="lp-brand-img" src={marca.logo} alt="" onError={() => setLogoOk(false)} />
              ) : (
                <Icone icone="shield" />
              )}
            </a>
            <span className="lp-brand-name">
              <b>{marca.nome}</b>
              {marca.subtitulo && <span>{marca.subtitulo}</span>}
            </span>
            <Dica texto={expandida ? 'Recolher menu' : 'Expandir menu'}>
              <button
                type="button"
                className="lp-ham"
                onClick={alternarSidebar}
                aria-label={expandida ? 'Recolher menu' : 'Expandir menu'}
                aria-expanded={expandida}
              >
                <Icone icone="chevrons-left" />
              </button>
            </Dica>
          </div>

          <div className="lp-sidebar-divline" />

          <nav className="lp-sidebar-nav" aria-label="Menu principal" onScroll={!expandida && aside ? fecharAside : undefined}>
            {nav.map((sec, si) => (
              <Fragment key={si}>
                {sec.rotulo && (
                  <div className="lp-sidebar-grp">
                    <span>{sec.rotulo}</span>
                    <span className="lp-sidebar-grp-ln" />
                  </div>
                )}
                <div className="lp-sidebar-items">
                  {sec.itens.map((item) =>
                    !item.filhos ? (
                      <Dica key={item.rotulo} texto={expandida ? undefined : item.rotulo} posicao="direita" atraso={150}>
                        {link(
                          item,
                          'lp-nav-it',
                          <>
                            <span className="lp-nav-tile">
                              <Icone icone={item.icone ?? 'circle'} />
                            </span>
                            <span className="lp-nav-tx">{item.rotulo}</span>
                          </>,
                        )}
                      </Dica>
                    ) : (
                      emLinha ? (
                        <div
                          key={item.rotulo}
                          className={cx('lp-nav-group', subAbertos.has(item.rotulo) && 'lp-grupo-aberto', grupoAtivo(item) && 'lp-has-active')}
                        >
                          <button
                            type="button"
                            className={cx('lp-nav-it lp-nav-parent', item.desabilitado && 'lp-is-disabled')}
                            disabled={item.desabilitado}
                            aria-expanded={subAbertos.has(item.rotulo)}
                            onClick={() => alternarGrupo(item.rotulo)}
                          >
                            <span className="lp-nav-tile">
                              <Icone icone={item.icone ?? 'folder'} />
                            </span>
                            <span className="lp-nav-tx">{item.rotulo}</span>
                            <Icone icone="chevron-down" className="lp-nav-ch lp-nav-ch--gira" />
                          </button>
                          {subAbertos.has(item.rotulo) && (
                            <div className="lp-nav-filhos" role="group" aria-label={item.rotulo}>
                              {renderFilhos(item.filhos, item.rotulo)}
                            </div>
                          )}
                        </div>
                      ) : (
                      <div
                        key={item.rotulo}
                        className={cx('lp-nav-group', aside === item.rotulo && 'lp-aside-on', grupoAtivo(item) && 'lp-has-active')}
                      >
                        <button
                          type="button"
                          className={cx('lp-nav-it lp-nav-parent', item.desabilitado && 'lp-is-disabled')}
                          disabled={item.desabilitado}
                          aria-expanded={aside === item.rotulo}
                          onClick={(e) => {
                            setAsideTopo(e.currentTarget.getBoundingClientRect().top);
                            setAside((a) => (a === item.rotulo ? null : item.rotulo));
                          }}
                        >
                          <span className="lp-nav-tile">
                            <Icone icone={item.icone ?? 'folder'} />
                          </span>
                          <span className="lp-nav-tx">{item.rotulo}</span>
                          <Icone icone="chevron-right" className="lp-nav-ch" />
                        </button>
                      </div>
                      )
                    ),
                  )}
                </div>
              </Fragment>
            ))}
          </nav>

          {(rodapeSidebar || versao) && (
            <div className="lp-sidebar-foot">
              <div className="lp-sidebar-divline" />
              {rodapeSidebar && <div className="lp-sidebar-rodape">{rodapeSidebar}</div>}
              {versao && (
                <span className="lp-versao">
                  <span className="lp-sr">Versão do sistema:</span>
                  {versao}
                </span>
              )}
            </div>
          )}
        </aside>

        {/* ===== PAINEL DE SUBMENU ===== */}
        {itemAside && (
          <div
            className={cx('lp-sidebar-aside', !expandida && 'lp-aside--flutuante')}
            ref={asideRef}
            role="region"
            aria-label={`Submenu ${itemAside.rotulo}`}
            style={!expandida ? ({ '--aside-topo': `${Math.max(8, Math.min(asideTopo, window.innerHeight - 320))}px` } as CSSProperties) : undefined}
          >
            <div className="lp-aside-head">
              <span className="lp-aside-ic">
                <Icone icone={itemAside.icone ?? 'folder'} />
              </span>
              <span className="lp-aside-ttl">{itemAside.rotulo}</span>
              <button type="button" className="lp-aside-x" aria-label="Fechar submenu" title="Fechar" onClick={() => setAside(null)}>
                <Icone icone="x" />
              </button>
            </div>
            <div className="lp-aside-corpo">
              {itemAside.filhos!.map((filho) => {
                if (!filho.filhos?.length) {
                  return (
                    <Fragment key={filho.rotulo}>
                      {link(
                        filho,
                        'lp-nav-sub',
                        <>
                          <span className="lp-nav-sub-ic">
                            <Icone icone={filho.icone ?? 'chevron-right'} />
                          </span>
                          <span className="lp-nav-sub-tx">{filho.rotulo}</span>
                        </>,
                      )}
                    </Fragment>
                  );
                }
                const chave = `${itemAside.rotulo}›${filho.rotulo}`;
                const aberto = subAbertos.has(chave) || grupoAtivo(filho);
                return (
                  <div key={filho.rotulo} className={cx('lp-nav-sub-grp', aberto && 'lp-sub-open', grupoAtivo(filho) && 'lp-has-active')}>
                    <button
                      type="button"
                      className={cx('lp-nav-sub lp-nav-sub-parent', filho.desabilitado && 'lp-is-disabled')}
                      disabled={filho.desabilitado}
                      aria-expanded={aberto}
                      onClick={() =>
                        setSubAbertos((s) => {
                          const n = new Set(s);
                          if (n.has(chave)) n.delete(chave);
                          else n.add(chave);
                          return n;
                        })
                      }
                    >
                      <span className="lp-nav-sub-ic">
                        <Icone icone={filho.icone ?? 'folder'} />
                      </span>
                      <span className="lp-nav-sub-tx">{filho.rotulo}</span>
                      <Icone icone={aberto ? 'chevron-up' : 'chevron-down'} className="lp-nav-ch" />
                    </button>
                    {aberto && (
                      <div className="lp-nav-sub-netos" role="group" aria-label={filho.rotulo}>
                        {filho.filhos.map((neto) => (
                          <Fragment key={neto.rotulo}>
                            {link(
                              neto,
                              'lp-nav-sub lp-nav-sub-neto',
                              <>
                                <span className="lp-nav-sub-ic">
                                  <Icone icone={neto.icone ?? 'chevron-right'} />
                                </span>
                                <span className="lp-nav-sub-tx">{neto.rotulo}</span>
                              </>,
                            )}
                          </Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== MAIN ===== */}
        <div className="lp-main">
          <header className="lp-topbar">
            {movel && (
              <button type="button" className="lp-tb-icon" onClick={alternarSidebar} aria-label="Abrir menu" aria-expanded={expandida}>
                <Icone icone="menu" />
              </button>
            )}
            {!expandida && (
              <span className="lp-tb-system">
                <b>{marca.nome}</b>
                {marca.subtitulo && <span>{marca.subtitulo}</span>}
              </span>
            )}

            {!movel && buscaPadrao}

            <div className="lp-tb-right" ref={direitaRef}>
              {!movel && (
                <>
                  {complementosTopbar}
                  {prefs && (
                    <div className="lp-tb-menu-wrap">
                      <Dica texto={`Densidade: ${densidadeAtual.rotulo}`}>
                        <button
                          type="button"
                          className={cx('lp-tb-icon', menu === 'densidade' && 'lp-menu-open')}
                          aria-expanded={menu === 'densidade'}
                          aria-label={`Densidade: ${densidadeAtual.rotulo}`}
                          onClick={() => alternarMenu('densidade')}
                        >
                          <Icone icone={densidadeAtual.icone} />
                        </button>
                      </Dica>
                      {menu === 'densidade' && (
                        <div className="lp-tb-menu" role="group" aria-label="Densidade">
                          <div className="lp-tb-menu-ttl">Densidade</div>
                          {menuDensidade}
                        </div>
                      )}
                    </div>
                  )}

                  {temDev && (
                    <div className="lp-tb-menu-wrap">
                      <Dica texto="Desenvolvimento">
                        <button
                          type="button"
                          className={cx('lp-tb-icon', menu === 'dev' && 'lp-menu-open')}
                          aria-expanded={menu === 'dev'}
                          aria-label="Desenvolvimento"
                          onClick={() => alternarMenu('dev')}
                        >
                          <Icone icone="code" />
                        </button>
                      </Dica>
                      {menu === 'dev' && (
                        <div className="lp-tb-menu" role="group" aria-label="Desenvolvimento">
                          <ItensMenu itens={menuDesenvolvimento} aoEscolher={escolher(aoEscolherMenuDesenvolvimento)} />
                        </div>
                      )}
                    </div>
                  )}

                  {prefs && (
                    <Dica texto={prefs.escuro ? 'Tema claro' : 'Tema escuro'}>
                      <button
                        type="button"
                        className="lp-tb-icon"
                        aria-label={prefs.escuro ? 'Tema claro' : 'Tema escuro'}
                        onClick={prefs.alternarTema}
                      >
                        <Icone icone={prefs.escuro ? 'sun' : 'moon'} />
                      </button>
                    </Dica>
                  )}
                </>
              )}

              {notificacoes && (
                <div className="lp-tb-menu-wrap">
                  <Dica texto="Notificações">
                    <button
                      type="button"
                      className={cx('lp-tb-icon lp-tb-bell', menu === 'sino' && 'lp-menu-open')}
                      aria-expanded={menu === 'sino'}
                      aria-label={naoLidas ? `Notificações: ${naoLidas} não lida(s)` : 'Notificações'}
                      onClick={() => alternarMenu('sino')}
                    >
                      <Icone icone="bell" />
                      {naoLidas > 0 && <span className="lp-bell-dot" aria-hidden="true" />}
                    </button>
                  </Dica>
                  {menu === 'sino' && (
                    <div className="lp-tb-menu lp-tb-menu-notif" role="group" aria-label="Notificações">
                      <div className="lp-tb-menu-ttl">
                        <span>Notificações</span>
                        {naoLidas > 0 && <span className="lp-notif-count">{naoLidas} não lida(s)</span>}
                      </div>
                      {notificacoes.length ? (
                        notificacoes.map((n) => (
                          <button
                            key={n.id}
                            type="button"
                            className={cx('lp-tb-menu-item lp-notif-item', n.naoLida && 'lp-unread')}
                            onClick={() => escolher(aoEscolherNotificacao)(n.id)}
                          >
                            <span className="lp-notif-ic">
                              <Icone icone={n.icone ?? 'bell'} />
                            </span>
                            <span className="lp-notif-tx">
                              <span className="lp-notif-ttl">{n.titulo}</span>
                              {n.descricao && <span className="lp-notif-desc">{n.descricao}</span>}
                              {n.tempo && <span className="lp-notif-time">{n.tempo}</span>}
                            </span>
                            {n.naoLida && <span className="lp-notif-dot" aria-hidden="true" />}
                          </button>
                        ))
                      ) : (
                        <p className="lp-notif-empty">
                          <Icone icone="circle-check" />
                          Tudo em dia — sem notificações.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {usuario &&
                (!movel ? (
                  <>
                    <span className="lp-tb-divider" />
                    <div className="lp-tb-menu-wrap">
                      <button
                        type="button"
                        className={cx('lp-profile', !menuUsuario.length && 'lp-no-menu')}
                        aria-expanded={menuUsuario.length ? menu === 'usuario' : undefined}
                        aria-label={`Usuário: ${usuario.nome}`}
                        onClick={() => menuUsuario.length && alternarMenu('usuario')}
                      >
                        {avatar}
                        <div className="lp-profile-info">
                          <div className="lp-profile-name">{usuario.nome}</div>
                          {usuario.cargo && <div className="lp-profile-role">{usuario.cargo}</div>}
                        </div>
                        {menuUsuario.length > 0 && (
                          <Icone icone="chevron-down" className={cx('lp-profile-caret', menu === 'usuario' && 'lp-caret-open')} />
                        )}
                      </button>
                      {menu === 'usuario' && (
                        <div className="lp-tb-menu lp-tb-menu-user" role="group" aria-label="Menu do usuário">
                          {cabecalhoUsuario}
                          <ItensMenu itens={menuUsuario} aoEscolher={escolher(aoEscolherMenuUsuario)} />
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="lp-tb-menu-wrap">
                    <button
                      type="button"
                      className="lp-profile"
                      aria-expanded={menu === 'compacto'}
                      aria-label={`Conta e preferências: ${usuario.nome}`}
                      onClick={() => alternarMenu('compacto')}
                    >
                      {avatar}
                    </button>
                    {menu === 'compacto' && (
                      <div className="lp-tb-menu lp-tb-menu-compact" role="group" aria-label="Conta e preferências">
                        {cabecalhoUsuario}
                        {aoBuscar && (
                          <div className="lp-cm-search" role="search">
                            <Icone icone="search" />
                            <input
                              type="search"
                              className="lp-cm-search-input"
                              placeholder={placeholderBusca}
                              aria-label="Busca global"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  aoBuscar(e.currentTarget.value.trim());
                                  setMenu(null);
                                }
                              }}
                            />
                          </div>
                        )}
                        {prefs && (
                          <>
                            <div className="lp-tb-menu-ttl">Aparência</div>
                            <button type="button" className="lp-tb-menu-item" onClick={prefs.alternarTema}>
                              <Icone icone={prefs.escuro ? 'sun' : 'moon'} />
                              <span>{prefs.escuro ? 'Tema claro' : 'Tema escuro'}</span>
                            </button>
                          </>
                        )}
                        {temDev && (
                          <>
                            <div className="lp-tb-menu-ttl">Desenvolvimento</div>
                            <ItensMenu itens={menuDesenvolvimento} aoEscolher={escolher(aoEscolherMenuDesenvolvimento)} />
                          </>
                        )}
                        {prefs && (
                          <>
                            <div className="lp-tb-menu-ttl">Densidade</div>
                            {menuDensidade}
                          </>
                        )}
                        {menuUsuario.length > 0 && (
                          <>
                            <div className="lp-tb-menu-ln" aria-hidden="true" />
                            <ItensMenu itens={menuUsuario} aoEscolher={escolher(aoEscolherMenuUsuario)} />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </header>

          <main className="lp-content" id={idConteudo} ref={conteudoRef} tabIndex={-1}>
            <div className="lp-content-inner">
              <ProvedorTrilha value={trilha}>{children}</ProvedorTrilha>
            </div>
          </main>
          {rodape && <footer className="lp-rodape">{rodape}</footer>}
        </div>
      </div>
    </div>
  );
}
