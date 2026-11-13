import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import { Botao } from '../Botao/Botao';
import { MenuSuspenso, type ItemMenuSuspenso } from '../MenuSuspenso/MenuSuspenso';
import {
  QuadroArrastavel,
  type ColunaArrastavel,
  type PosicaoQuadro,
  type SoltarColuna,
  type SoltarItem,
} from '../QuadroArrastavel/QuadroArrastavel';
import { Vazio } from '../Vazio/Vazio';
import type { CorKanban } from './tipos';
import './Pecas.css';
import './Kanban.css';
import { useIdioma, useTextos } from '../../i18n/contexto';
import { interpolar, pluralizar } from '../../i18n/idiomas';

export interface ColunaKanban<T> extends ColunaArrastavel<T> {
  titulo: string;
  /** Faixa no topo e ponto ao lado do título. */
  cor?: CorKanban;
  /** Máximo de cartões (WIP): a coluna cheia não aceita mais nenhum e a contagem fica laranja. */
  limite?: number;
}

export interface KanbanProps<T extends { id: string }, C extends ColunaKanban<T> = ColunaKanban<T>> {
  /** Colunas com os cartões; campos a mais voltam em `aoMudar`. */
  colunas: (ColunaKanban<T> & C)[];
  /** As colunas na ordem nova (ao soltar um cartão ou uma coluna). */
  aoMudar: (colunas: C[]) => void;
  /** De onde para onde o cartão foi: grave no servidor aqui. */
  aoSoltar?: (evento: SoltarItem<T, C>) => void;
  /** Liga o arraste das colunas pela alça do cabeçalho e avisa a ordem nova. */
  aoSoltarColuna?: (evento: SoltarColuna<C>) => void;
  /** Regra extra de destino (o `limite` das colunas já é respeitado). */
  podeSoltar?: (item: T, para: PosicaoQuadro, de: PosicaoQuadro) => boolean;
  /** Desenha o cartão (em geral um `CartaoKanban`); ponha a `alca` nele. */
  renderCartao: (item: T, alca: ReactNode) => ReactNode;
  /** Nome do cartão para leitor de tela. */
  nomeItem: (item: T) => string;
  /** Busca e filtros: os cartões com `false` somem, e o arraste dos outros continua valendo. */
  filtro?: (item: T) => boolean;
  /** Mostra "Adicionar cartão" no pé de cada coluna; recebe o título digitado. */
  aoAdicionarCartao?: (colunaId: string, titulo: string) => void;
  /** Mostra "Adicionar coluna" no fim do quadro. */
  aoAdicionarColuna?: (titulo: string) => void;
  /** Liga "Renomear" no menu da coluna (o título vira um campo). */
  aoRenomearColuna?: (colunaId: string, titulo: string) => void;
  /** Liga "Recolher" no menu e o botão de expandir na coluna recolhida. */
  aoRecolherColuna?: (colunaId: string, recolhida: boolean) => void;
  /** Liga "Excluir coluna" no menu. Peça confirmação no app, se quiser (`useConfirmacao`). */
  aoExcluirColuna?: (colunaId: string) => void;
  /** Itens a mais no menu de cada coluna. */
  acoesColuna?: (coluna: C) => ItemMenuSuspenso[];
  aoEscolherAcaoColuna?: (acao: string, coluna: C) => void;
  /** Largura de cada coluna (padrão: `18rem`). */
  larguraColuna?: string;
  /** Altura fixa do quadro (ex.: `calc(100dvh - 14rem)`): cada coluna rola por dentro. */
  altura?: string;
  vazioTitulo?: string;
  vazioDescricao?: string;
  /** Nome acessível do quadro (padrão: "Quadro"). */
  rotulo?: string;
  className?: string;
}

/** Campo de uma linha (ou de várias) que confirma com Enter e desiste com Esc. */
function NovoTexto({
  rotulo,
  placeholder,
  confirmar,
  multilinha,
  aoConfirmar,
  aoCancelar,
  manterAberto,
  inicial = '',
}: {
  rotulo: string;
  placeholder: string;
  confirmar: string;
  multilinha?: boolean;
  aoConfirmar: (texto: string) => void;
  aoCancelar: () => void;
  /** Depois de confirmar, limpa e continua aberto (para cadastrar vários seguidos). */
  manterAberto?: boolean;
  inicial?: string;
}) {
  const t = useTextos();
  const [texto, setTexto] = useState(inicial);
  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  const enviar = (e?: FormEvent) => {
    e?.preventDefault();
    const t = texto.trim();
    if (!t) return;
    aoConfirmar(t);
    if (manterAberto) setTexto('');
  };
  const tecla = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      aoCancelar();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };
  const props = {
    ref,
    className: 'lp-input lp-kb-novo-campo',
    value: texto,
    placeholder,
    'aria-label': rotulo,
    onChange: (e: { target: { value: string } }) => setTexto(e.target.value),
    onKeyDown: tecla,
  };
  return (
    <form className="lp-kb-novo" onSubmit={enviar}>
      {multilinha ? <textarea rows={2} {...props} /> : <input type="text" {...props} />}
      <div className="lp-kb-novo-acoes">
        <Botao type="submit" rotulo={confirmar} tamanho="pequeno" disabled={!texto.trim()} />
        <Botao rotulo={t.comum.cancelar} aparencia="texto" severidade="secundario" tamanho="pequeno" onClick={aoCancelar} />
      </div>
    </form>
  );
}

/**
 * Quadro kanban: colunas com cabeçalho (cor, contagem, limite, menu de
 * renomear, recolher e excluir), cartões que se arrastam entre colunas,
 * "Adicionar cartão", "Adicionar coluna" e rolagem horizontal. Montado
 * sobre o `QuadroArrastavel`: mouse, toque e teclado.
 */
export function Kanban<T extends { id: string }, C extends ColunaKanban<T> = ColunaKanban<T>>({
  colunas,
  aoMudar,
  aoSoltar,
  aoSoltarColuna,
  podeSoltar,
  renderCartao,
  nomeItem,
  filtro,
  aoAdicionarCartao,
  aoAdicionarColuna,
  aoRenomearColuna,
  aoRecolherColuna,
  aoExcluirColuna,
  acoesColuna,
  aoEscolherAcaoColuna,
  larguraColuna = '18rem',
  altura,
  vazioTitulo: vazioTituloProp,
  vazioDescricao: vazioDescricaoProp,
  rotulo: rotuloProp,
  className,
}: KanbanProps<T, C>) {
  const tx = useTextos();
  const idioma = useIdioma();
  const vazioTitulo = vazioTituloProp ?? tx.kanban.vazioTitulo;
  const vazioDescricao = vazioDescricaoProp ?? tx.kanban.vazioDescricao;
  const rotulo = rotuloProp ?? tx.kanban.quadro;
  // a coluna com o campo "novo cartão" aberto, a que está sendo renomeada e o campo de nova coluna
  const [novoCartao, setNovoCartao] = useState<string | null>(null);
  const [renomeando, setRenomeando] = useState<string | null>(null);
  const [novaColuna, setNovaColuna] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);

  const cheia = (c: C, ignorar?: string) => c.limite !== undefined && c.itens.filter((i) => i.id !== ignorar).length >= c.limite;

  const podeSoltarComLimite = (item: T, para: PosicaoQuadro, de: PosicaoQuadro) => {
    const alvo = colunas.find((c) => c.id === para.coluna);
    if (alvo && para.coluna !== de.coluna && cheia(alvo, item.id)) return false;
    return podeSoltar ? podeSoltar(item, para, de) : true;
  };

  // devolve o foco ao botão que abriu o campo, quando ele fecha
  const focar = (seletor: string) => window.setTimeout(() => raiz.current?.querySelector<HTMLElement>(seletor)?.focus(), 0);

  const menuDe = (c: C): ItemMenuSuspenso[] => {
    const itens: ItemMenuSuspenso[] = [];
    if (aoRenomearColuna) itens.push({ id: 'renomear', rotulo: tx.comum.renomear, icone: 'pencil' });
    if (aoRecolherColuna) itens.push({ id: 'recolher', rotulo: tx.comum.recolher, icone: 'chevrons-left' });
    const extras = acoesColuna?.(c) ?? [];
    if (extras.length) {
      if (itens.length) itens.push({ tipo: 'divisor' });
      itens.push(...extras);
    }
    if (aoExcluirColuna) {
      if (itens.length) itens.push({ tipo: 'divisor' });
      itens.push({ id: 'excluir', rotulo: tx.kanban.excluirColuna, icone: 'trash-2', destrutivo: true });
    }
    return itens;
  };

  const escolher = (acao: string, c: C) => {
    if (acao === 'renomear') setRenomeando(c.id);
    else if (acao === 'recolher') aoRecolherColuna?.(c.id, true);
    else if (acao === 'excluir') aoExcluirColuna?.(c.id);
    else aoEscolherAcaoColuna?.(acao, c);
  };

  const contagem = (c: C) => {
    const total = c.itens.length;
    const visiveis = filtro ? c.itens.filter(filtro).length : total;
    const filtrado = visiveis !== total;
    const estado = c.limite === undefined ? undefined : total > c.limite ? 'acima' : total === c.limite ? 'cheia' : undefined;
    const texto = filtrado ? interpolar(tx.anexo.contador, { n: visiveis, total }) : c.limite !== undefined ? `${total}/${c.limite}` : String(total);
    const descricao = filtrado
      ? interpolar(tx.kanban.visiveis, { visiveis, total })
      : `${pluralizar(idioma, total, tx.kanban.cartoes)}${c.limite !== undefined ? `, ${interpolar(tx.kanban.limite, { n: c.limite })}` : ''}`;
    return (
      <span className="lp-kb-contagem" data-estado={estado} title={descricao}>
        <span aria-hidden="true">{texto}</span>
        <span className="lp-sr">{descricao}</span>
      </span>
    );
  };

  const cabecalho = (c: C, alca: ReactNode) => {
    if (c.recolhida)
      return (
        <div className="lp-kb-cab lp-kb-cab--recolhida">
          <button
            type="button"
            className="lp-kb-expandir"
            aria-label={interpolar(tx.kanban.expandirColuna, { nome: c.titulo })}
            title={tx.comum.expandir}
            onClick={() => {
              aoRecolherColuna?.(c.id, false);
              focar(`[data-quadro-coluna="${CSS.escape(c.id)}"] .lp-kb-menu button`);
            }}
            disabled={!aoRecolherColuna}
          >
            <Icone icone="chevrons-right" />
          </button>
          {alca}
          <h3 className="lp-kb-titulo">{c.titulo}</h3>
          {contagem(c)}
        </div>
      );
    const menu = menuDe(c);
    return (
      <div className="lp-kb-cab">
        {alca}
        <span className="lp-kb-ponto" aria-hidden="true" />
        {renomeando === c.id ? (
          <div className="lp-kb-renomear">
            <NovoTexto
              rotulo={interpolar(tx.kanban.novoNomeColuna, { nome: c.titulo })}
              placeholder={tx.kanban.nomeColuna}
              confirmar={tx.comum.salvar}
              inicial={c.titulo}
              aoConfirmar={(t) => {
                if (t !== c.titulo) aoRenomearColuna?.(c.id, t);
                setRenomeando(null);
                focar(`[data-quadro-coluna="${CSS.escape(c.id)}"] .lp-kb-menu button`);
              }}
              aoCancelar={() => {
                setRenomeando(null);
                focar(`[data-quadro-coluna="${CSS.escape(c.id)}"] .lp-kb-menu button`);
              }}
            />
          </div>
        ) : (
          <>
            <h3 className="lp-kb-titulo">{c.titulo}</h3>
            {contagem(c)}
            {menu.length > 0 && (
              <MenuSuspenso
                className="lp-kb-menu"
                icone="ellipsis"
                aria-label={interpolar(tx.kanban.acoesColuna, { nome: c.titulo })}
                dica={tx.kanban.acoesColunaCurto}
                semSeta
                aparencia="texto"
                severidade="secundario"
                tamanho="pequeno"
                alinhamento="fim"
                itens={menu}
                aoEscolher={(id) => escolher(id, c)}
              />
            )}
          </>
        )}
      </div>
    );
  };

  const rodape = aoAdicionarCartao
    ? (c: C) =>
        novoCartao === c.id ? (
          <NovoTexto
            rotulo={interpolar(tx.kanban.tituloNovoCartao, { nome: c.titulo })}
            placeholder={tx.kanban.tituloCartao}
            confirmar={tx.comum.adicionar}
            multilinha
            manterAberto
            aoConfirmar={(t) => aoAdicionarCartao(c.id, t)}
            aoCancelar={() => {
              setNovoCartao(null);
              focar(`[data-quadro-coluna="${CSS.escape(c.id)}"] .lp-kb-adicionar`);
            }}
          />
        ) : (
          <button
            type="button"
            className="lp-kb-adicionar"
            onClick={() => setNovoCartao(c.id)}
            disabled={cheia(c)}
            title={cheia(c) ? interpolar(tx.kanban.noLimite, { n: c.limite ?? 0 }) : undefined}
          >
            <Icone icone="plus" />
            {tx.kanban.adicionarCartao}
            <span className="lp-sr">{interpolar(tx.kanban.emColuna, { nome: c.titulo })}</span>
          </button>
        )
    : undefined;

  const formNovaColuna = (
    <NovoTexto
      rotulo={tx.kanban.nomeNovaColuna}
      placeholder={tx.kanban.nomeColuna}
      confirmar={tx.comum.adicionar}
      manterAberto
      aoConfirmar={(t) => aoAdicionarColuna?.(t)}
      aoCancelar={() => {
        setNovaColuna(false);
        focar('.lp-kb-nova-coluna');
      }}
    />
  );

  const fim = aoAdicionarColuna ? (
    <div className="lp-kb-fim">
      {novaColuna ? (
        formNovaColuna
      ) : (
        <button type="button" className="lp-kb-nova-coluna" onClick={() => setNovaColuna(true)}>
          <Icone icone="plus" />
          {tx.kanban.adicionarColuna}
        </button>
      )}
    </div>
  ) : undefined;

  const estilo = altura ? ({ '--kb-altura': altura } as CSSProperties) : undefined;

  if (!colunas.length)
    return (
      <div ref={raiz} className={cx('lp-kanban', 'lp-kanban--vazio', className)}>
        <Vazio titulo={vazioTitulo} descricao={vazioDescricao} icone="square-kanban">
          {aoAdicionarColuna &&
            (novaColuna ? (
              <div className="lp-kb-fim">{formNovaColuna}</div>
            ) : (
              <Botao rotulo={tx.kanban.adicionarColuna} icone="plus" className="lp-kb-nova-coluna" onClick={() => setNovaColuna(true)} />
            ))}
        </Vazio>
      </div>
    );

  return (
    <div ref={raiz} className={cx('lp-kanban', altura && 'lp-kanban--altura', className)} style={estilo}>
      <QuadroArrastavel<T, C>
        colunas={colunas}
        aoMudar={aoMudar}
        aoSoltar={aoSoltar}
        podeSoltar={podeSoltarComLimite}
        visivel={filtro}
        renderItem={renderCartao}
        nomeItem={nomeItem}
        layout="faixa"
        larguraColuna={larguraColuna}
        cabecalhoColuna={cabecalho}
        rodapeColuna={rodape}
        colunasArrastaveis={!!aoSoltarColuna}
        aoSoltarColuna={aoSoltarColuna}
        classeColuna={(c) => cx('lp-kb-coluna', c.cor && `lp-kb-coluna--cor lp-kb-cor--${c.cor}`)}
        fim={fim}
        rotulo={rotulo}
      />
    </div>
  );
}
