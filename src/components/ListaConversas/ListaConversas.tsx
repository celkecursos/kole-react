import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import { normalizar } from '../../utils/texto';
import { Botao } from '../Botao/Botao';
import { CampoTexto } from '../CampoTexto/CampoTexto';
import { MenuSuspenso } from '../MenuSuspenso/MenuSuspenso';
import { Skeleton } from '../Skeleton/Skeleton';
import './ListaConversas.css';

export interface ItemConversa {
  id: string | number;
  titulo: string;
  /** Última atividade: define o grupo (Hoje, Ontem, Últimos 7 dias…). */
  data: Date;
  /** Fica no grupo "Fixadas", no topo. */
  fixada?: boolean;
}

export interface ListaConversasProps {
  itens: ItemConversa[];
  /** Id da conversa aberta. */
  ativa?: ItemConversa['id'] | null;
  aoEscolher: (id: ItemConversa['id']) => void;
  /** Mostra o botão "Nova conversa". */
  aoNova?: () => void;
  /** Liga o "Renomear" no menu do item (edição no próprio item: Enter salva, Esc cancela). */
  aoRenomear?: (id: ItemConversa['id'], titulo: string) => void;
  /** Liga o "Excluir" no menu do item. A confirmação, se houver, é do app. */
  aoExcluir?: (id: ItemConversa['id']) => void;
  /** Liga o "Fixar"/"Desafixar" no menu do item. */
  aoFixar?: (id: ItemConversa['id'], fixada: boolean) => void;
  /** Campo de busca pelo título (sem acento e sem diferença de maiúsculas). Padrão: `true`. */
  busca?: boolean;
  carregando?: boolean;
  /** Sem conversas. */
  textoVazio?: string;
  /** Acima da lista, abaixo da busca (ex.: filtros). */
  extra?: ReactNode;
  rotulo?: string;
  rotuloNova?: string;
  /** "Hoje" dos grupos (para testes). Padrão: a data atual. */
  hoje?: Date;
  className?: string;
}

const MES = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
const meiaNoite = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** Grupo de uma data: Hoje, Ontem, Últimos 7 dias, Últimos 30 dias ou o mês ("Setembro de 2026"). */
function grupoDe(data: Date, hoje: Date): string {
  const dias = Math.round((meiaNoite(hoje) - meiaNoite(data)) / 86400000);
  if (dias <= 0) return 'Hoje';
  if (dias === 1) return 'Ontem';
  if (dias < 7) return 'Últimos 7 dias';
  if (dias < 30) return 'Últimos 30 dias';
  const m = MES.format(data);
  return m.charAt(0).toUpperCase() + m.slice(1);
}

/**
 * Histórico de conversas de um assistente: "Nova conversa", busca e os itens agrupados por
 * data, com renomear, fixar e excluir. O app guarda o histórico; a lista mostra e avisa.
 */
export function ListaConversas({
  itens,
  ativa,
  aoEscolher,
  aoNova,
  aoRenomear,
  aoExcluir,
  aoFixar,
  busca = true,
  carregando,
  textoVazio = 'Nenhuma conversa ainda.',
  extra,
  rotulo = 'Conversas',
  rotuloNova = 'Nova conversa',
  hoje: hojeProp,
  className,
}: ListaConversasProps) {
  const [termo, setTermo] = useState('');
  const [editando, setEditando] = useState<ItemConversa['id'] | null>(null);
  const hoje = hojeProp ?? new Date();
  const chaveHoje = meiaNoite(hoje);

  const grupos = useMemo(() => {
    const t = normalizar(termo.trim());
    const filtrados = itens.filter((i) => !t || normalizar(i.titulo).includes(t)).sort((a, b) => b.data.getTime() - a.data.getTime());
    const mapa = new Map<string, ItemConversa[]>();
    for (const i of filtrados) {
      const g = i.fixada ? 'Fixadas' : grupoDe(i.data, new Date(chaveHoje));
      if (!mapa.has(g)) mapa.set(g, []);
      mapa.get(g)!.push(i);
    }
    // "Fixadas" sempre no topo; os outros já vêm na ordem das datas
    return [...mapa.entries()].sort(([a], [b]) => Number(b === 'Fixadas') - Number(a === 'Fixadas'));
  }, [itens, termo, chaveHoje]);

  return (
    <nav className={cx('lp-lconv', className)} aria-label={rotulo}>
      {(aoNova || busca) && (
        <div className="lp-lconv-topo">
          {aoNova && <Botao className="lp-lconv-nova" rotulo={rotuloNova} icone="square-pen" severidade="secundario" aparencia="contorno" onClick={aoNova} />}
          {busca && <CampoTexto className="lp-lconv-busca" icone="search" type="search" placeholder="Buscar conversas" aria-label="Buscar conversas" valor={termo} aoMudar={setTermo} />}
        </div>
      )}
      {extra}
      <div className="lp-lconv-rolagem">
        {carregando ? (
          <div className="lp-lconv-carregando" aria-busy="true">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} altura="2rem" />
            ))}
          </div>
        ) : grupos.length === 0 ? (
          <p className="lp-lconv-vazio">{termo.trim() ? `Nada encontrado para "${termo.trim()}".` : textoVazio}</p>
        ) : (
          grupos.map(([grupo, lista]) => (
            <section key={grupo} className="lp-lconv-grupo" aria-label={grupo}>
              <h3 className="lp-lconv-grupo-titulo">{grupo}</h3>
              <ul className="lp-lconv-itens">
                {lista.map((item) => (
                  <Item
                    key={item.id}
                    item={item}
                    ativo={item.id === ativa}
                    editando={editando === item.id}
                    aoEscolher={() => aoEscolher(item.id)}
                    aoComecarRenomear={aoRenomear ? () => setEditando(item.id) : undefined}
                    aoRenomear={(titulo) => {
                      setEditando(null);
                      if (titulo && titulo !== item.titulo) aoRenomear?.(item.id, titulo);
                    }}
                    aoExcluir={aoExcluir && (() => aoExcluir(item.id))}
                    aoFixar={aoFixar && (() => aoFixar(item.id, !item.fixada))}
                  />
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </nav>
  );
}

interface ItemProps {
  item: ItemConversa;
  ativo: boolean;
  editando: boolean;
  aoEscolher: () => void;
  aoComecarRenomear?: () => void;
  /** Título novo (sem espaços nas pontas), ou `''` para cancelar. */
  aoRenomear: (titulo: string) => void;
  aoExcluir?: () => void;
  aoFixar?: () => void;
}

function Item({ item, ativo, editando, aoEscolher, aoComecarRenomear, aoRenomear, aoExcluir, aoFixar }: ItemProps) {
  const [rascunho, setRascunho] = useState(item.titulo);
  const campo = useRef<HTMLInputElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const voltarFoco = useRef(false);

  useEffect(() => {
    if (editando) {
      setRascunho(item.titulo);
      campo.current?.focus();
      campo.current?.select();
    } else if (voltarFoco.current) {
      voltarFoco.current = false;
      botao.current?.focus();
    }
  }, [editando]); // eslint-disable-line react-hooks/exhaustive-deps

  const terminar = (salvar: boolean) => {
    voltarFoco.current = true;
    aoRenomear(salvar ? rascunho.trim() : '');
  };
  const teclar = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      terminar(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      terminar(false);
    }
  };

  const acoes = [
    aoComecarRenomear && { id: 'renomear', rotulo: 'Renomear', icone: 'pencil' },
    aoFixar && { id: 'fixar', rotulo: item.fixada ? 'Desafixar' : 'Fixar', icone: 'pin' },
    aoExcluir && { id: 'excluir', rotulo: 'Excluir', icone: 'trash-2', destrutivo: true },
  ].filter((a): a is NonNullable<typeof a> => !!a);

  return (
    <li className={cx('lp-lconv-item', ativo && 'is-ativo', editando && 'is-editando')}>
      {editando ? (
        <input
          ref={campo}
          className="lp-lconv-renomear"
          value={rascunho}
          aria-label={`Novo nome para "${item.titulo}"`}
          onChange={(e) => setRascunho(e.target.value)}
          onKeyDown={teclar}
          onBlur={() => terminar(true)}
        />
      ) : (
        <button ref={botao} type="button" className="lp-lconv-abrir" aria-current={ativo ? 'page' : undefined} onClick={aoEscolher} title={item.titulo}>
          {item.fixada && <Icone icone="pin" className="lp-lconv-pino" />}
          <span className="lp-lconv-titulo">{item.titulo}</span>
        </button>
      )}
      {!editando && acoes.length > 0 && (
        <MenuSuspenso
          className="lp-lconv-menu"
          icone="ellipsis"
          aria-label={`Opções de "${item.titulo}"`}
          dica="Opções"
          severidade="secundario"
          aparencia="texto"
          tamanho="pequeno"
          semSeta
          alinhamento="fim"
          itens={acoes}
          aoEscolher={(id) => {
            if (id === 'renomear') aoComecarRenomear?.();
            else if (id === 'fixar') aoFixar?.();
            else if (id === 'excluir') aoExcluir?.();
          }}
        />
      )}
    </li>
  );
}
