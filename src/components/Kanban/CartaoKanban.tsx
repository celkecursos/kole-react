import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import { GrupoAvatares, type PessoaAvatar } from '../Avatar/GrupoAvatares';
import { Progresso } from '../Progresso/Progresso';
import { Etiqueta, SeloPrazo, SeloPrioridade } from './Pecas';
import type { ContagemSubtarefas, CorKanban, EtiquetaKanban, Prioridade } from './tipos';
import './Pecas.css';
import './CartaoKanban.css';
import { useIdioma, useTextos } from '../../i18n/contexto';
import { interpolar, pluralizar } from '../../i18n/idiomas';

export interface CartaoKanbanProps {
  titulo: string;
  /** Resumo em até duas linhas. */
  descricao?: string;
  /** Imagem do topo: URL ou um elemento pronto. */
  capa?: string | ReactNode;
  etiquetas?: EtiquetaKanban[];
  prioridade?: Prioridade;
  /** Data de vencimento (`Date` ou `AAAA-MM-DD`). */
  vencimento?: Date | string;
  /** Concluído: o prazo fica verde, sem "Atrasado". */
  concluido?: boolean;
  subtarefas?: ContagemSubtarefas;
  anexos?: number;
  comentarios?: number;
  responsaveis?: PessoaAvatar[];
  /** Faixa colorida na borda esquerda. */
  cor?: CorKanban;
  /** Espaço livre abaixo do título (ex.: valor e empresa de um negócio no CRM). */
  extra?: ReactNode;
  /** Botão de arrastar, recebido do `Kanban`/`QuadroArrastavel`. */
  alca?: ReactNode;
  /** Botões no canto superior (ex.: um `MenuSuspenso` de ações). */
  acoes?: ReactNode;
  /** Clicar no cartão (ou Enter no título) abre o detalhe. */
  aoAbrir?: () => void;
  /** Referência de "hoje" para o prazo (padrão: agora). */
  agora?: Date;
  className?: string;
}

/** Cartão de kanban: capa, etiquetas, título, prioridade, prazo, subtarefas, contadores e responsáveis. */
export function CartaoKanban({
  titulo,
  descricao,
  capa,
  etiquetas,
  prioridade,
  vencimento,
  concluido = false,
  subtarefas,
  anexos,
  comentarios,
  responsaveis,
  cor,
  extra,
  alca,
  acoes,
  aoAbrir,
  agora,
  className,
}: CartaoKanbanProps) {
  const t = useTextos();
  const idioma = useIdioma();
  const temFerramentas = !!(alca || acoes);
  const temRodape = !!(prioridade || vencimento || anexos || comentarios || responsaveis?.length);
  return (
    <article
      className={cx('lp-cartao', cor && `lp-cartao--cor lp-kb-cor--${cor}`, aoAbrir && 'lp-cartao--clicavel', concluido && 'is-concluido', className)}
    >
      {capa && (
        // a capa também abre o detalhe no clique (o botão acessível é o título)
        <div className="lp-cartao-capa" onClick={aoAbrir}>{typeof capa === 'string' ? <img src={capa} alt="" loading="lazy" /> : capa}</div>
      )}
      <div className={cx('lp-cartao-corpo', temFerramentas && 'lp-cartao-corpo--ferr')}>
        {etiquetas && etiquetas.length > 0 && (
          <div className="lp-cartao-etiquetas">
            {etiquetas.map((e) => (
              <Etiqueta key={e.rotulo} rotulo={e.rotulo} cor={e.cor} />
            ))}
          </div>
        )}
        <h4 className="lp-cartao-titulo">
          {aoAbrir ? (
            <button type="button" className="lp-cartao-abrir" onClick={aoAbrir}>
              {titulo}
            </button>
          ) : (
            titulo
          )}
        </h4>
        {descricao && <p className="lp-cartao-desc">{descricao}</p>}
        {extra && <div className="lp-cartao-extra">{extra}</div>}
        {subtarefas && subtarefas.total > 0 && (
          <div className="lp-cartao-sub" title={interpolar(t.kanban.subtarefasFeitas, { feitas: subtarefas.feitas, total: subtarefas.total })}>
            <span className="lp-cartao-sub-num">
              <Icone icone="list-checks" />
              <span aria-hidden="true">
                {subtarefas.feitas}/{subtarefas.total}
              </span>
              <span className="lp-sr">
                {interpolar(t.kanban.subtarefasFeitas, { feitas: subtarefas.feitas, total: subtarefas.total })}
              </span>
            </span>
            <Progresso
              valor={subtarefas.feitas}
              max={subtarefas.total}
              altura="xs"
              cor={subtarefas.feitas >= subtarefas.total ? 'ok' : 'pri'}
              rotulo={t.kanban.subtarefas}
            />
          </div>
        )}
        {temRodape && (
          <div className="lp-cartao-rodape">
            {prioridade && <SeloPrioridade prioridade={prioridade} />}
            {vencimento && <SeloPrazo vencimento={vencimento} concluido={concluido} agora={agora} />}
            {!!anexos && (
              <span className="lp-cartao-cont" title={pluralizar(idioma, anexos, t.kanban.anexos)}>
                <Icone icone="paperclip" />
                <span aria-hidden="true">{anexos}</span>
                <span className="lp-sr">{pluralizar(idioma, anexos, t.kanban.anexos)}</span>
              </span>
            )}
            {!!comentarios && (
              <span className="lp-cartao-cont" title={pluralizar(idioma, comentarios, t.kanban.comentarios)}>
                <Icone icone="message-square" />
                <span aria-hidden="true">{comentarios}</span>
                <span className="lp-sr">{pluralizar(idioma, comentarios, t.kanban.comentarios)}</span>
              </span>
            )}
            {responsaveis && responsaveis.length > 0 && <GrupoAvatares pessoas={responsaveis} className="lp-cartao-pessoas" tamanho="1.5rem" />}
          </div>
        )}
        {temFerramentas && (
          <div className="lp-cartao-ferr">
            {acoes}
            {alca}
          </div>
        )}
      </div>
    </article>
  );
}
