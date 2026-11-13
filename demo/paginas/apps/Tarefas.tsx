import { useState } from 'react';
import {
  Badge,
  Botao,
  CabecalhoPagina,
  CampoData,
  CampoMarcacao,
  CampoSelect,
  CampoSelectMultiplo,
  CampoTextarea,
  CampoTexto,
  Dialogo,
  Etiqueta,
  FiltroPilulas,
  Icone,
  ListaTarefas,
  PRIORIDADES,
  SITUACOES_TAREFA,
  Status,
  diasEntre,
  normalizar,
  tempoRelativo,
  useConfirmacao,
  useToast,
  type Prioridade,
  type SituacaoTarefa,
} from '../../../src';
import { ETIQUETAS, LISTAS, PESSOAS, dia, etiquetas, pessoa, tarefasIniciais, type TarefaDemo } from './dados';
import './apps.css';

type Visao = { tipo: 'meu-dia' } | { tipo: 'todas' } | { tipo: 'concluidas' } | { tipo: 'lista'; id: string } | { tipo: 'etiqueta'; id: string };
type Prazo = 'todas' | 'atrasadas' | 'hoje' | 'semana';

const OPCOES_PRIORIDADE = (['baixa', 'media', 'alta'] as Prioridade[]).map((p) => ({ valor: p, rotulo: PRIORIDADES[p].rotulo }));
const OPCOES_SITUACAO = (Object.keys(SITUACOES_TAREFA) as SituacaoTarefa[]).map((s) => ({ valor: s, rotulo: SITUACOES_TAREFA[s].rotulo }));
const feita = (t: TarefaDemo) => t.situacao === 'concluida';
const novoId = () => `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
const DATA_LONGA = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

const naVisao = (v: Visao) => (t: TarefaDemo) => {
  if (v.tipo === 'meu-dia') return !!t.meuDia;
  if (v.tipo === 'todas') return !feita(t);
  if (v.tipo === 'concluidas') return feita(t);
  if (v.tipo === 'lista') return t.lista === v.id;
  return t.idsEtiquetas.includes(v.id);
};

/** Dias até o vencimento (`null` sem data). */
const diasAte = (t: TarefaDemo) => (t.vencimento ? diasEntre(new Date(), t.vencimento) : null);
const noPrazo = (p: Prazo) => (t: TarefaDemo) => {
  if (p === 'todas') return true;
  const d = diasAte(t);
  if (d === null || feita(t)) return false;
  if (p === 'atrasadas') return d < 0;
  if (p === 'hoje') return d === 0;
  return d >= 0 && d <= 6;
};

export function PaginaTarefas() {
  const toast = useToast();
  const confirmar = useConfirmacao();
  const [tarefas, setTarefas] = useState(tarefasIniciais);
  const [visao, setVisao] = useState<Visao>({ tipo: 'meu-dia' });
  const [prazo, setPrazo] = useState<Prazo>('todas');
  const [prioridades, setPrioridades] = useState<Prioridade[]>([]);
  const [busca, setBusca] = useState('');
  const [nova, setNova] = useState('');
  // tarefa aberta no painel: id, ou 'nova'
  const [aberta, setAberta] = useState<string | null>(null);

  const daVisao = tarefas.filter(naVisao(visao));
  const contar = (p: Prazo) => daVisao.filter(noPrazo(p)).length;
  const termo = normalizar(busca);
  const filtro = (t: TarefaDemo) =>
    naVisao(visao)(t) && noPrazo(prazo)(t) && (!prioridades.length || (!!t.prioridade && prioridades.includes(t.prioridade))) && (!termo || normalizar(t.titulo).includes(termo));

  const tituloVisao =
    visao.tipo === 'meu-dia'
      ? 'Meu dia'
      : visao.tipo === 'todas'
        ? 'Todas as tarefas'
        : visao.tipo === 'concluidas'
          ? 'Concluídas'
          : visao.tipo === 'lista'
            ? LISTAS.find((l) => l.id === visao.id)!.rotulo
            : `Etiqueta: ${ETIQUETAS.find((e) => e.id === visao.id)!.rotulo}`;

  // a linha da lista: etiquetas e responsável saem dos ids
  const linhas = tarefas.map((t) => ({
    ...t,
    concluida: feita(t),
    etiquetas: etiquetas(t.idsEtiquetas),
    responsaveis: t.idResponsavel ? [pessoa(t.idResponsavel)] : [],
  }));

  const mudar = (id: string, parcial: Partial<TarefaDemo>) => setTarefas((ts) => ts.map((t) => (t.id === id ? { ...t, ...parcial } : t)));
  const adicionar = () => {
    const titulo = nova.trim();
    if (!titulo) return;
    setTarefas((ts) => [
      {
        id: novoId(),
        titulo,
        situacao: 'aberta',
        prioridade: 'media',
        idsEtiquetas: visao.tipo === 'etiqueta' ? [visao.id] : [],
        lista: visao.tipo === 'lista' ? visao.id : undefined,
        meuDia: visao.tipo === 'meu-dia',
        idResponsavel: 'ana',
        criadaEm: new Date(),
      },
      ...ts,
    ]);
    setNova('');
    toast.ok('Tarefa criada');
  };
  const excluir = async (t: TarefaDemo) => {
    if (!(await confirmar.remover({ titulo: 'Excluir a tarefa?', mensagem: `"${t.titulo}" será excluída.`, rotuloAceitar: 'Excluir' }))) return;
    setTarefas((ts) => ts.filter((x) => x.id !== t.id));
    setAberta(null);
    toast.ok('Tarefa excluída');
  };

  const itemVisao = (v: Visao, rotulo: string, icone: string, n: number, cor?: string) => {
    const ativo = JSON.stringify(v) === JSON.stringify(visao);
    return (
      <li key={rotulo}>
        <button type="button" className={`demo-tarefas-visao${ativo ? ' is-ativo' : ''}`} aria-current={ativo ? 'page' : undefined} onClick={() => setVisao(v)}>
          {cor ? <span className={`demo-tarefas-ponto lp-kb-cor--${cor}`} aria-hidden="true" /> : <Icone icone={icone} className="demo-tarefas-ic" />}
          <span className="demo-tarefas-visao-rotulo">{rotulo}</span>
          {n > 0 && <Badge cor="neutral" aparencia="suave" formato="pilula" rotulo={String(n)} />}
        </button>
      </li>
    );
  };

  const tarefaAberta = aberta && aberta !== 'nova' ? tarefas.find((t) => t.id === aberta) : undefined;
  const hoje = DATA_LONGA.format(new Date());

  return (
    <div className="demo-tarefas">
      <nav className="demo-tarefas-lado" aria-label="Visões de tarefas">
        <ul>
          {itemVisao({ tipo: 'meu-dia' }, 'Meu dia', 'sun', tarefas.filter((t) => t.meuDia && !feita(t)).length)}
          {itemVisao({ tipo: 'todas' }, 'Todas as tarefas', 'list-todo', tarefas.filter((t) => !feita(t)).length)}
          {itemVisao({ tipo: 'concluidas' }, 'Concluídas', 'circle-check', tarefas.filter(feita).length)}
        </ul>
        <h2 className="demo-tarefas-lado-titulo">Minhas listas</h2>
        <ul>{LISTAS.map((l) => itemVisao({ tipo: 'lista', id: l.id }, l.rotulo, '', tarefas.filter((t) => t.lista === l.id && !feita(t)).length, l.cor))}</ul>
        <h2 className="demo-tarefas-lado-titulo">Etiquetas</h2>
        <div className="demo-tarefas-etiquetas">
          {ETIQUETAS.filter((e) => tarefas.some((t) => t.idsEtiquetas.includes(e.id))).map((e) => {
            const ativo = visao.tipo === 'etiqueta' && visao.id === e.id;
            return (
              <button
                key={e.id}
                type="button"
                className={`demo-tarefas-etiqueta${ativo ? ' is-ativo' : ''}`}
                aria-pressed={ativo}
                onClick={() => setVisao(ativo ? { tipo: 'todas' } : { tipo: 'etiqueta', id: e.id })}
              >
                <Etiqueta rotulo={e.rotulo} cor={e.cor} />
              </button>
            );
          })}
        </div>
      </nav>

      <div className="demo-pilha demo-tarefas-principal">
        <CabecalhoPagina
          titulo={tituloVisao}
          icone={visao.tipo === 'meu-dia' ? 'sun' : 'list-todo'}
          trilha
          acoes={<Botao rotulo="Nova tarefa" icone="plus" onClick={() => setAberta('nova')} />}
        >
          {visao.tipo === 'meu-dia' ? `${hoje.charAt(0).toUpperCase()}${hoje.slice(1)} · o que você planejou para hoje.` : 'Arraste pela alça para mudar a ordem.'}
        </CabecalhoPagina>

        <form
          className="demo-tarefas-nova"
          onSubmit={(e) => {
            e.preventDefault();
            adicionar();
          }}
        >
          <CampoTexto icone="plus" placeholder="Adicionar tarefa e Enter" aria-label="Título da nova tarefa" valor={nova} aoMudar={setNova} />
          <Botao type="submit" rotulo="Adicionar" disabled={!nova.trim()} />
        </form>

        <div className="demo-apps-filtros">
          <FiltroPilulas<Prazo>
            rotulo="Prazo"
            valor={prazo}
            aoMudar={setPrazo}
            disposicao="rolar"
            opcoes={[
              { valor: 'todas', rotulo: `Todas (${contar('todas')})` },
              { valor: 'atrasadas', rotulo: `Atrasadas (${contar('atrasadas')})` },
              { valor: 'hoje', rotulo: `Hoje (${contar('hoje')})` },
              { valor: 'semana', rotulo: `Esta semana (${contar('semana')})` },
            ]}
          />
          <CampoSelectMultiplo placeholder="Prioridade" aria-label="Prioridade" opcoes={OPCOES_PRIORIDADE} valor={prioridades} aoMudar={setPrioridades} />
          <CampoTexto icone="search" placeholder="Buscar tarefa" aria-label="Buscar tarefa" valor={busca} aoMudar={setBusca} />
        </div>

        <ListaTarefas
          rotulo={tituloVisao}
          tarefas={linhas}
          filtro={filtro}
          selecionada={aberta ?? undefined}
          aoAbrir={(t) => setAberta(t.id)}
          aoConcluir={(t, c) => {
            mudar(t.id, { situacao: c ? 'concluida' : 'aberta' });
            toast.ok(c ? 'Tarefa concluída' : 'Tarefa reaberta');
          }}
          aoReordenar={(nova) => {
            setTarefas(nova);
            toast.info('Ordem das tarefas salva');
          }}
          vazioTitulo={visao.tipo === 'meu-dia' && !busca ? 'Seu dia está livre' : 'Nenhuma tarefa encontrada'}
          vazioDescricao={visao.tipo === 'meu-dia' && !busca ? 'Adicione tarefas ao "Meu dia" para planejar hoje.' : 'Crie uma tarefa ou mude os filtros.'}
        />
      </div>

      {aberta && (
        <PainelTarefa
          key={aberta}
          tarefa={tarefaAberta}
          aoFechar={() => setAberta(null)}
          aoSalvar={(t) => {
            setTarefas((ts) => (ts.some((x) => x.id === t.id) ? ts.map((x) => (x.id === t.id ? t : x)) : [t, ...ts]));
            toast.ok(tarefaAberta ? 'Tarefa salva' : 'Tarefa criada');
            setAberta(null);
          }}
          aoExcluir={excluir}
        />
      )}
    </div>
  );
}

function PainelTarefa({
  tarefa,
  aoFechar,
  aoSalvar,
  aoExcluir,
}: {
  tarefa?: TarefaDemo;
  aoFechar: () => void;
  aoSalvar: (t: TarefaDemo) => void;
  aoExcluir: (t: TarefaDemo) => void;
}) {
  const [t, setT] = useState<TarefaDemo>(
    () => tarefa ?? { id: novoId(), titulo: '', situacao: 'aberta', prioridade: 'media', idsEtiquetas: [], idResponsavel: 'ana', criadaEm: new Date() },
  );
  const [erro, setErro] = useState('');
  const mudar = (p: Partial<TarefaDemo>) => setT((x) => ({ ...x, ...p }));
  const s = SITUACOES_TAREFA[t.situacao];
  const salvar = (extra: Partial<TarefaDemo> = {}) => {
    if (!t.titulo.trim()) return setErro('Informe o título da tarefa.');
    aoSalvar({ ...t, ...extra, titulo: t.titulo.trim() });
  };

  return (
    <Dialogo
      aberto
      aparencia="lateral"
      tamanho="medio"
      aoFechar={aoFechar}
      titulo={tarefa ? 'Detalhes da tarefa' : 'Nova tarefa'}
      subtitulo={tarefa ? `Criada ${tempoRelativo(tarefa.criadaEm)}` : undefined}
      icone="list-todo"
      rodape={
        <>
          {tarefa && <Botao rotulo="Excluir" icone="trash-2" aparencia="texto" severidade="err" className="demo-apps-rodape-esq" onClick={() => aoExcluir(tarefa)} />}
          <Botao rotulo="Cancelar" aparencia="contorno" severidade="secundario" onClick={aoFechar} />
          <Botao rotulo="Salvar" icone="save" onClick={() => salvar()} />
        </>
      }
    >
      <div className="demo-apps-form">
        {tarefa && (
          <div className="demo-tarefa-situacao">
            <Status rotulo={s.rotulo} severidade={s.severidade} icone={s.icone} />
            <div className="demo-apps-linha">
              {t.situacao !== 'andamento' && t.situacao !== 'concluida' && (
                <Botao rotulo="Iniciar" icone="play" aparencia="contorno" tamanho="pequeno" onClick={() => salvar({ situacao: 'andamento' })} />
              )}
              {t.situacao !== 'bloqueada' && t.situacao !== 'concluida' && (
                <Botao rotulo="Bloquear" icone="lock" aparencia="contorno" severidade="err" tamanho="pequeno" onClick={() => salvar({ situacao: 'bloqueada' })} />
              )}
              {t.situacao === 'concluida' ? (
                <Botao rotulo="Reabrir" icone="rotate-cw" aparencia="contorno" severidade="secundario" tamanho="pequeno" onClick={() => salvar({ situacao: 'aberta' })} />
              ) : (
                <Botao rotulo="Concluir" icone="circle-check" severidade="ok" tamanho="pequeno" onClick={() => salvar({ situacao: 'concluida' })} />
              )}
            </div>
          </div>
        )}
        <CampoTexto rotulo="Título" obrigatorio valor={t.titulo} aoMudar={(v) => (mudar({ titulo: v }), setErro(''))} erro={erro} autoFocus={!tarefa} />
        <CampoTextarea rotulo="Descrição" placeholder="Detalhes, contexto, links…" valor={t.descricao ?? ''} aoMudar={(v) => mudar({ descricao: v || undefined })} rows={3} />
        <div className="demo-grade-2 demo-tarefa-campos">
          <CampoSelect rotulo="Situação" opcoes={OPCOES_SITUACAO} valor={t.situacao} aoMudar={(v) => v && mudar({ situacao: v })} />
          <CampoSelect rotulo="Prioridade" opcoes={OPCOES_PRIORIDADE} valor={t.prioridade ?? null} aoMudar={(v) => mudar({ prioridade: v ?? undefined })} botaoLimpar placeholder="Sem prioridade" />
          <CampoData rotulo="Vencimento" valor={typeof t.vencimento === 'string' ? t.vencimento : ''} aoMudar={(v) => mudar({ vencimento: v || undefined })} />
          <CampoSelect
            rotulo="Responsável"
            opcoes={PESSOAS.map((p) => ({ valor: p.id, rotulo: p.nome }))}
            valor={t.idResponsavel ?? null}
            aoMudar={(v) => mudar({ idResponsavel: v ?? undefined })}
            botaoLimpar
            placeholder="Ninguém"
          />
          <CampoSelect rotulo="Lista" opcoes={LISTAS.map((l) => ({ valor: l.id, rotulo: l.rotulo }))} valor={t.lista ?? null} aoMudar={(v) => mudar({ lista: v ?? undefined })} botaoLimpar placeholder="Sem lista" />
          <CampoSelectMultiplo rotulo="Etiquetas" opcoes={ETIQUETAS.map((e) => ({ valor: e.id, rotulo: e.rotulo }))} valor={t.idsEtiquetas} aoMudar={(v) => mudar({ idsEtiquetas: v })} />
        </div>
        <div className="demo-apps-linha">
          <Botao rotulo="Hoje" aparencia="texto" tamanho="pequeno" onClick={() => mudar({ vencimento: dia(0) })} />
          <Botao rotulo="Amanhã" aparencia="texto" tamanho="pequeno" onClick={() => mudar({ vencimento: dia(1) })} />
          <Botao rotulo="Próxima semana" aparencia="texto" tamanho="pequeno" onClick={() => mudar({ vencimento: dia(7) })} />
        </div>
        <CampoMarcacao rotulo="No meu dia" aparencia="chave" valor={!!t.meuDia} aoMudar={(v) => mudar({ meuDia: v })} />
      </div>
    </Dialogo>
  );
}
