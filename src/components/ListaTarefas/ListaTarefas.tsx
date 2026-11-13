import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import { GrupoAvatares, type PessoaAvatar } from '../Avatar/GrupoAvatares';
import { Etiqueta, SeloPrazo, SeloPrioridade } from '../Kanban/Pecas';
import { SITUACOES_TAREFA, type ContagemSubtarefas, type EtiquetaKanban, type Prioridade, type SituacaoTarefa } from '../Kanban/tipos';
import { QuadroArrastavel, type ColunaArrastavel } from '../QuadroArrastavel/QuadroArrastavel';
import { Skeleton } from '../Skeleton/Skeleton';
import { Status } from '../Status/Status';
import { Vazio } from '../Vazio/Vazio';
import './ListaTarefas.css';
import { useTextos } from '../../i18n/contexto';
import { interpolar } from '../../i18n/idiomas';

export interface TarefaLista {
  id: string;
  titulo: string;
  /** Marcada como feita (sem isto, vale `situacao === 'concluida'`). */
  concluida?: boolean;
  /** Mostrada como selo quando é "Em andamento" ou "Bloqueada". */
  situacao?: SituacaoTarefa;
  prioridade?: Prioridade;
  /** Data de vencimento (`Date` ou `AAAA-MM-DD`). */
  vencimento?: Date | string;
  etiquetas?: EtiquetaKanban[];
  responsaveis?: PessoaAvatar[];
  subtarefas?: ContagemSubtarefas;
}

/** O que `aoReordenar` recebe além da lista nova. */
export interface ReordenarTarefa<T> {
  tarefa: T;
  de: number;
  para: number;
}

export interface ListaTarefasProps<T extends TarefaLista> {
  tarefas: T[];
  /** Marcar ou desmarcar como concluída. Sem isto, o círculo não aparece. */
  aoConcluir?: (tarefa: T, concluida: boolean) => void;
  /** Clicar na tarefa abre o detalhe (ex.: um `Dialogo` lateral). */
  aoAbrir?: (tarefa: T) => void;
  /** Liga o arraste para reordenar; recebe a lista na ordem nova, ao soltar. */
  aoReordenar?: (tarefas: T[], evento: ReordenarTarefa<T>) => void;
  /** Id da tarefa aberta no detalhe (fica destacada). */
  selecionada?: string;
  /** Visão e filtros: as tarefas com `false` somem, e a ordem das outras continua valendo ao arrastar. */
  filtro?: (tarefa: T) => boolean;
  /** Conteúdo a mais em cada linha, antes dos responsáveis. */
  extra?: (tarefa: T) => ReactNode;
  carregando?: boolean;
  vazioTitulo?: string;
  vazioDescricao?: string;
  vazioAcoes?: ReactNode;
  /** Referência de "hoje" para os prazos (padrão: agora). */
  agora?: Date;
  /** Nome acessível da lista (padrão: "Tarefas"). */
  rotulo?: string;
  className?: string;
}

const UNICA = 'tarefas';

/**
 * Lista de tarefas: marcar como feita, prioridade, prazo, etiquetas e
 * responsáveis em cada linha; reordena arrastando (mouse, toque e teclado).
 */
export function ListaTarefas<T extends TarefaLista>({
  tarefas,
  aoConcluir,
  aoAbrir,
  aoReordenar,
  selecionada,
  filtro,
  extra,
  carregando = false,
  vazioTitulo: vazioTituloProp,
  vazioDescricao,
  vazioAcoes,
  agora,
  rotulo: rotuloProp,
  className,
}: ListaTarefasProps<T>) {
  const tx = useTextos();
  const vazioTitulo = vazioTituloProp ?? tx.listaTarefas.vazioTitulo;
  const rotulo = rotuloProp ?? tx.listaTarefas.rotulo;
  if (carregando)
    return (
      <div className={cx('lp-tarefas', className)} aria-busy="true" aria-label={rotulo}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="lp-tarefa lp-tarefa--esqueleto">
            <Skeleton formato="circulo" largura="1.25rem" altura="1.25rem" />
            <Skeleton largura={`${60 - i * 8}%`} />
          </div>
        ))}
      </div>
    );

  const visiveis = filtro ? tarefas.filter(filtro) : tarefas;
  if (!visiveis.length)
    return (
      <div className={cx('lp-tarefas', 'lp-tarefas--vazia', className)}>
        <Vazio titulo={vazioTitulo} descricao={vazioDescricao} icone="list-todo">
          {vazioAcoes}
        </Vazio>
      </div>
    );

  const linha = (t: T, alca: ReactNode) => {
    const feita = t.concluida ?? t.situacao === 'concluida';
    const situacao = t.situacao && t.situacao !== 'aberta' && t.situacao !== 'concluida' ? { ...SITUACOES_TAREFA[t.situacao], rotulo: tx.kanban[t.situacao] } : null;
    return (
      <div className={cx('lp-tarefa', feita && 'is-concluida', selecionada === t.id && 'is-selecionada', aoAbrir && 'lp-tarefa--clicavel')}>
        {aoReordenar && alca}
        {aoConcluir && (
          <button
            type="button"
            role="checkbox"
            aria-checked={feita}
            className="lp-tarefa-check"
            aria-label={interpolar(tx.listaTarefas.concluida, { nome: t.titulo })}
            title={feita ? tx.listaTarefas.reabrir : tx.listaTarefas.concluir}
            onClick={() => aoConcluir(t, !feita)}
          >
            <Icone icone={feita ? 'circle-check' : 'circle'} />
          </button>
        )}
        <div className="lp-tarefa-texto">
          <span className="lp-tarefa-titulo">
            {aoAbrir ? (
              <button type="button" className="lp-tarefa-abrir" onClick={() => aoAbrir(t)} aria-current={selecionada === t.id ? 'true' : undefined}>
                {t.titulo}
              </button>
            ) : (
              t.titulo
            )}
          </span>
          {!!(t.etiquetas?.length || situacao || t.subtarefas?.total) && (
            <span className="lp-tarefa-sob">
              {situacao && <Status rotulo={situacao.rotulo} severidade={situacao.severidade} icone={situacao.icone} />}
              {!!t.subtarefas?.total && (
                <span className="lp-tarefa-sub" title={interpolar(tx.kanban.subtarefasFeitas, { feitas: t.subtarefas.feitas, total: t.subtarefas.total })}>
                  <Icone icone="list-checks" />
                  <span aria-hidden="true">
                    {t.subtarefas.feitas}/{t.subtarefas.total}
                  </span>
                  <span className="lp-sr">
                    {interpolar(tx.kanban.subtarefasFeitas, { feitas: t.subtarefas.feitas, total: t.subtarefas.total })}
                  </span>
                </span>
              )}
              {t.etiquetas?.map((e) => (
                <Etiqueta key={e.rotulo} rotulo={e.rotulo} cor={e.cor} />
              ))}
            </span>
          )}
        </div>
        <div className="lp-tarefa-meta">
          {t.prioridade && <SeloPrioridade prioridade={t.prioridade} compacto />}
          {t.vencimento && <SeloPrazo vencimento={t.vencimento} concluido={feita} agora={agora} />}
          {extra?.(t)}
          {t.responsaveis && t.responsaveis.length > 0 && <GrupoAvatares pessoas={t.responsaveis} max={2} tamanho="1.5rem" />}
        </div>
      </div>
    );
  };

  const colunas: ColunaArrastavel<T>[] = [{ id: UNICA, titulo: rotulo, itens: tarefas }];
  return (
    <div className={cx('lp-tarefas', aoReordenar && 'lp-tarefas--arrastavel', className)}>
      <QuadroArrastavel<T>
        colunas={colunas}
        aoMudar={() => {}}
        aoSoltar={(e) => aoReordenar?.(e.colunas[0].itens, { tarefa: e.item, de: e.de.indice, para: e.para.indice })}
        visivel={filtro}
        renderItem={linha}
        nomeItem={(t) => t.titulo}
      />
    </div>
  );
}
