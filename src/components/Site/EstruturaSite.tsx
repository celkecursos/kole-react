import { useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import { Dialogo } from '../Dialogo/Dialogo';
import type { Marca, PropsLink } from '../Estrutura/Estrutura';
import { usePreferenciasOpcional } from '../Preferencias/Preferencias';
import { ProvedorTrilha } from '../Trilha/Trilha';
import { ProvedorLinkSite, useLinkSite } from './linkSite';
import './EstruturaSite.css';

export interface ItemSite {
  rotulo: string;
  rota: string;
}

export interface EstruturaSiteProps {
  marca: Marca;
  /** Itens do menu horizontal (no celular, vão para o painel do botão Menu). */
  nav: ItemSite[];
  /**
   * Rota atual: marca o item ativo (`/blog` também vale para `/blog/post`; vence a rota mais
   * longa). A página inicial (o `href` da marca) só é marcada nela mesma.
   */
  rotaAtual?: string;
  /** Navegação do roteador do app. Ctrl+clique e o botão do meio continuam abrindo em nova aba. */
  aoNavegar?: (rota: string) => void;
  /** Link do roteador (ex.: o `Link` do React Router); recebe `href`, `className`, `onClick` e `children`. */
  renderLink?: (props: PropsLink) => ReactNode;
  /** À direita do menu (ex.: "Entrar" e "Criar conta"). No celular, também vão para o painel. */
  acoes?: ReactNode;
  /** Botão de tema claro/escuro (precisa do `ProvedorUi`). Padrão: `true`. */
  alternarTema?: boolean;
  /** Barra marinha fina acima do cabeçalho (novidade, telefone, e-mail). Some no celular a parte da direita. */
  aviso?: ReactNode;
  /** À direita da barra de aviso (ex.: telefone e e-mail). */
  avisoLateral?: ReactNode;
  /** Normalmente um `RodapeSite`. */
  rodape?: ReactNode;
  children: ReactNode;
  className?: string;
}

const ID_CONTEUDO = 'lp-site-conteudo';

/** A página inicial (`/` ou o `href` da marca) só vale para ela mesma: `/termos` não marca "Home". */
function combina(rota: string, atual: string, inicio: string) {
  return atual === rota || (rota !== '/' && rota !== inicio && atual.startsWith(`${rota}/`));
}

/** Item ativo: o de rota mais longa que combina (com `/site` e `/site/produtos`, a página de produtos marca só o segundo). */
function rotaAtiva(nav: ItemSite[], atual: string | undefined, inicio: string) {
  if (!atual) return undefined;
  return nav
    .map((i) => i.rota)
    .filter((r) => combina(r, atual, inicio))
    .sort((a, b) => b.length - a.length)[0];
}

/**
 * Moldura de site público: cabeçalho fixo com marca, menu horizontal e ações,
 * conteúdo e rodapé. Para sistemas internos, use a `Estrutura`.
 */
export function EstruturaSite({ marca, nav, rotaAtual, aoNavegar, renderLink, acoes, alternarTema = true, aviso, avisoLateral, rodape, children, className }: EstruturaSiteProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  return (
    <ProvedorLinkSite value={{ aoNavegar, renderLink, aoNavegou: () => setMenuAberto(false) }}>
      <Moldura
        marca={marca}
        nav={nav}
        rotaAtual={rotaAtual}
        acoes={acoes}
        alternarTema={alternarTema}
        aviso={aviso}
        avisoLateral={avisoLateral}
        rodape={rodape}
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
        className={className}
      >
        {children}
      </Moldura>
    </ProvedorLinkSite>
  );
}

interface MolduraProps extends Omit<EstruturaSiteProps, 'aoNavegar' | 'renderLink'> {
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void;
}

function Moldura({ marca, nav, rotaAtual, acoes, alternarTema, aviso, avisoLateral, rodape, menuAberto, setMenuAberto, children, className }: MolduraProps) {
  const link = useLinkSite();
  const prefs = usePreferenciasOpcional();
  const [logoOk, setLogoOk] = useState(true);
  const ativa = rotaAtiva(nav, rotaAtual, marca.href ?? '/');
  const itensMenu = (classe: string) =>
    nav.map((item) => (
      <li key={item.rota}>{link(item.rota, item.rotulo, cx(classe, item.rota === ativa && 'is-ativo'), { atual: item.rota === ativa })}</li>
    ));
  const botaoTema =
    alternarTema && prefs ? (
      <button
        type="button"
        className="lp-site-tema"
        onClick={prefs.alternarTema}
        aria-label={prefs.escuro ? 'Usar o tema claro' : 'Usar o tema escuro'}
        title={prefs.escuro ? 'Tema claro' : 'Tema escuro'}
      >
        <Icone icone={prefs.escuro ? 'sun' : 'moon'} />
      </button>
    ) : null;

  return (
    <ProvedorTrilha value={{ itens: [], link: (rota, conteudo, classe) => link(rota, conteudo, classe) }}>
      <div className={cx('lp-site', className)}>
        <a className="lp-site-pular" href={`#${ID_CONTEUDO}`}>
          Pular para o conteúdo
        </a>
        {aviso && (
          <div className="lp-site-aviso">
            <div className="lp-site-aviso-in">
              <div className="lp-site-aviso-tx">{aviso}</div>
              {avisoLateral && <div className="lp-site-aviso-lateral">{avisoLateral}</div>}
            </div>
          </div>
        )}
        <header className="lp-site-topo">
          <div className="lp-site-topo-in">
            {link(
              marca.href ?? '/',
              <>
                {marca.logo && logoOk ? (
                  <img className="lp-site-logo" src={marca.logo} alt="" onError={() => setLogoOk(false)} />
                ) : (
                  <span className="lp-site-logo lp-site-logo--letra" aria-hidden="true">
                    {marca.nome.slice(0, 1)}
                  </span>
                )}
                <span className="lp-site-marca-tx">
                  <span className="lp-site-marca-nome">
                    {marca.nome}
                    <span className="lp-site-marca-ponto">.</span>
                  </span>
                  {marca.subtitulo && <span className="lp-site-marca-sub">{marca.subtitulo}</span>}
                </span>
              </>,
              'lp-site-marca',
              { rotulo: `${marca.nome}: página inicial` },
            )}
            <nav className="lp-site-nav" aria-label="Menu principal">
              <ul>{itensMenu('lp-site-nav-item')}</ul>
            </nav>
            <div className="lp-site-acoes">
              {botaoTema}
              {acoes && <div className="lp-site-acoes-extra">{acoes}</div>}
              <button type="button" className="lp-site-menu" aria-label="Abrir o menu" aria-expanded={menuAberto} onClick={() => setMenuAberto(true)}>
                <Icone icone="menu" />
              </button>
            </div>
          </div>
        </header>

        <Dialogo aberto={menuAberto} aoFechar={() => setMenuAberto(false)} titulo={marca.nome} aparencia="lateral" tamanho="pequeno">
          <nav aria-label="Menu principal">
            <ul className="lp-site-gaveta">{itensMenu('lp-site-gaveta-item')}</ul>
          </nav>
          {acoes && <div className="lp-site-gaveta-acoes">{acoes}</div>}
        </Dialogo>

        <main className="lp-site-main" id={ID_CONTEUDO} tabIndex={-1}>
          {children}
        </main>
        {rodape}
      </div>
    </ProvedorTrilha>
  );
}

export interface LinkRodape {
  rotulo: string;
  rota: string;
}

export interface ColunaRodape {
  titulo: string;
  links: LinkRodape[];
}

export interface RodapeSiteProps {
  /** Nome em destaque na primeira coluna. */
  nome: string;
  descricao?: ReactNode;
  colunas?: ColunaRodape[];
  /** Abaixo da descrição (ex.: um `Newsletter aparencia="linha"`). A coluna da marca fica mais larga. */
  extra?: ReactNode;
  /** Linha de baixo (ex.: "© 2026 Empresa"). */
  copyright?: ReactNode;
  /** À direita da linha de baixo (ex.: links das redes sociais). */
  redes?: LinkRodape[];
  className?: string;
}

/** Rodapé marinho do site: marca, colunas de links e a linha de direitos. */
export function RodapeSite({ nome, descricao, colunas = [], extra, copyright, redes = [], className }: RodapeSiteProps) {
  const link = useLinkSite();
  return (
    <footer className={cx('lp-site-rodape', className)}>
      <div className="lp-site-rodape-in">
        <div className={cx('lp-site-rodape-marca', !!extra && 'lp-site-rodape-marca--larga')}>
          <div className="lp-site-rodape-nome">
            {nome}
            <span className="lp-site-marca-ponto">.</span>
          </div>
          {descricao && <p className="lp-site-rodape-desc">{descricao}</p>}
          {extra}
        </div>
        {colunas.map((c) => (
          <nav key={c.titulo} className="lp-site-rodape-col" aria-label={c.titulo}>
            <div className="lp-site-rodape-titulo">{c.titulo}</div>
            <ul>
              {c.links.map((l) => (
                <li key={`${l.rota}-${l.rotulo}`}>{link(l.rota, l.rotulo, 'lp-site-rodape-link')}</li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      {(copyright || redes.length > 0) && (
        <div className="lp-site-rodape-base">
          <span>{copyright}</span>
          {redes.length > 0 && (
            <ul className="lp-site-rodape-redes" aria-label="Redes sociais">
              {redes.map((r) => (
                <li key={r.rotulo}>{link(r.rota, r.rotulo, 'lp-site-rodape-link')}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </footer>
  );
}
