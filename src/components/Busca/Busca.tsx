import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { normalizar } from '../../utils/texto';
import { Icone, type IconeProp } from '../../utils/Icone';
import { useCliqueFora } from '../../utils/useCliqueFora';
import './Busca.css';

export interface ItemBusca {
  rotulo: string;
  rota: string;
  icone?: IconeProp;
  /** Caminho no menu (ex.: "Cadastros › Pessoas"). */
  trilha?: string;
}

export interface BuscaProps {
  placeholder?: string;
  /** Mostra spinner no lugar da lupa. */
  ocupado?: boolean;
  /** Itens de menu filtrados pelo termo (seção "Menu" do painel). */
  itensMenu?: ItemBusca[];
  aoNavegar?: (rota: string) => void;
  /** Enter sem item de menu ativo. */
  aoBuscar?: (termo: string) => void;
  aoMudarTermo?: (termo: string) => void;
  /** Ctrl+K / ⌘K foca a busca (padrão: sim). */
  atalho?: boolean;
  /** Resultados do app no painel; marque opções navegáveis com `data-busca-opcao`. */
  children?: ReactNode;
  className?: string;
}

const MAX_MENU = 8;

/** Busca global da topbar: filtra o menu e hospeda resultados do app. */
export function Busca({
  placeholder = 'Buscar…',
  ocupado,
  itensMenu,
  aoNavegar,
  aoBuscar,
  aoMudarTermo,
  atalho = true,
  children,
  className,
}: BuscaProps) {
  const raiz = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const [termo, setTermo] = useState('');
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(-1);

  useCliqueFora([raiz], aberto, () => setAberto(false));

  useEffect(() => {
    if (!atalho) return;
    const h = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        campo.current?.focus();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [atalho]);

  const t = normalizar(termo.trim());
  const casam = t && itensMenu ? itensMenu.filter((i) => normalizar(`${i.rotulo} ${i.trilha ?? ''}`).includes(t)) : [];
  const menu = casam.slice(0, MAX_MENU);
  const excedente = casam.length - menu.length;

  // opções navegáveis: itens de menu + opções do app (data-busca-opcao)
  const opcoes = (): HTMLElement[] =>
    raiz.current ? [...raiz.current.querySelectorAll<HTMLElement>('.lp-pb-item, [data-busca-opcao]')] : [];

  useEffect(() => {
    opcoes().forEach((el, i) => el.classList.toggle('is-ativa', i === ativo));
  });

  const mudar = (v: string) => {
    setTermo(v);
    setAtivo(-1);
    setAberto(true);
    aoMudarTermo?.(v);
  };

  const navegar = (rota: string, e?: MouseEvent) => {
    if (aoNavegar) {
      e?.preventDefault();
      aoNavegar(rota);
    }
    setTermo('');
    setAberto(false);
    campo.current?.blur();
  };

  const aoTeclar = (e: KeyboardEvent<HTMLInputElement>) => {
    const lista = opcoes();
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!lista.length) return;
      setAberto(true);
      const passo = e.key === 'ArrowDown' ? 1 : -1;
      setAtivo((a) => (a + passo + lista.length) % lista.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (ativo >= 0 && lista[ativo]) lista[ativo].click();
      else aoBuscar?.(termo.trim());
    } else if (e.key === 'Escape') {
      if (termo) mudar('');
      else {
        setAberto(false);
        campo.current?.blur();
      }
    }
  };

  const temMenu = !!itensMenu;
  const mostrarPainel = aberto && (temMenu || !!children);

  return (
    <div ref={raiz} className={cx('lp-busca', className)}>
      <div className="lp-pb" role="search">
        <Icone icone={ocupado ? 'loader-circle' : 'search'} girar={ocupado} className="lp-pb-ic" />
        <input
          ref={campo}
          type="search"
          className="lp-pb-input"
          role="combobox"
          autoComplete="off"
          aria-expanded={mostrarPainel}
          aria-autocomplete="list"
          aria-label={placeholder}
          placeholder={placeholder}
          value={termo}
          onFocus={() => setAberto(true)}
          onChange={(e) => mudar(e.target.value)}
          onKeyDown={aoTeclar}
        />
        {atalho && (
          <kbd className="lp-pb-kbd" aria-hidden="true">
            Ctrl K
          </kbd>
        )}
      </div>
      <span className="lp-sr" role="status" aria-live="polite">
        {t && temMenu ? `${casam.length} item(ns) de menu encontrado(s)` : ''}
      </span>

      {mostrarPainel && (
        <div className="lp-pb-painel">
          {temMenu && (
            <div className={cx('lp-pb-menu', !menu.length && 'lp-pb-menu-sem-itens')}>
              {t ? (
                menu.length ? (
                  <>
                    <div className="lp-pb-ttl">Menu</div>
                    {menu.map((r) => (
                      <a key={r.rota} className="lp-pb-item" href={r.rota} onClick={(e) => navegar(r.rota, e)}>
                        <Icone icone={r.icone ?? 'chevron-right'} />
                        <span>{r.rotulo}</span>
                        {r.trilha && <span className="lp-pb-trilha">{r.trilha}</span>}
                      </a>
                    ))}
                    {excedente > 0 && <p className="lp-pb-hint">…e mais {excedente} itens no menu</p>}
                  </>
                ) : (
                  <p className="lp-pb-hint">Nenhum item de menu encontrado.</p>
                )
              ) : (
                <p className="lp-pb-hint">
                  Digite para pesquisar — <kbd className="lp-pb-kbd">Esc</kbd> limpa.
                </p>
              )}
            </div>
          )}
          {children && <div className="lp-pb-conteudo">{children}</div>}
        </div>
      )}
    </div>
  );
}
