import { useMemo, useRef, useState } from 'react';
import {
  Botao,
  Calendario,
  CampoData,
  CampoHora,
  CampoMarcacao,
  CampoSelect,
  CampoTexto,
  Form,
  FormSecao,
  repetirEvento,
  type CorEvento,
  type EventoCalendario,
  type PeriodoCalendario,
  type RascunhoCalendario,
  type RegraRepeticao,
} from '../../../../src';

/* ---------- formulário do evento ---------- */

export type Repete = 'nao' | 'diaria' | 'uteis' | 'semanal' | 'mensal' | 'anual';

export interface DadosEvento {
  titulo: string;
  categoria: string;
  diaInteiro: boolean;
  /** `aaaa-mm-dd` (valor do `CampoData`). */
  data: string;
  /** `HH:mm` (valor do `CampoHora`). */
  inicio: string;
  fim: string;
  repete: Repete;
}

/** A categoria define a cor do evento. */
export const CATEGORIAS: { valor: string; rotulo: string; cor: CorEvento }[] = [
  { valor: 'Reunião', rotulo: 'Reunião', cor: 'pri' },
  { valor: 'Visita', rotulo: 'Visita', cor: 'graf-4' },
  { valor: 'Entrega', rotulo: 'Entrega', cor: 'ok' },
  { valor: 'Ligação', rotulo: 'Ligação', cor: 'info' },
  { valor: 'Financeiro', rotulo: 'Financeiro', cor: 'err' },
  { valor: 'Marketing', rotulo: 'Marketing', cor: 'graf-2' },
];
const corDa = (categoria: string): CorEvento => CATEGORIAS.find((c) => c.valor === categoria)?.cor ?? 'pri';

const p2 = (n: number) => String(n).padStart(2, '0');
const isoData = (d: Date) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
const hhmm = (d: Date) => `${p2(d.getHours())}:${p2(d.getMinutes())}`;
const NOME_DIA = ['aos domingos', 'às segundas', 'às terças', 'às quartas', 'às quintas', 'às sextas', 'aos sábados'];
const DIA_MES = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' });

/** Formulário preenchido a partir de um horário (ou de um evento existente). */
export function dadosDe(inicio: Date, fim?: Date, extra: Partial<DadosEvento> = {}): DadosEvento {
  const f = fim ?? new Date(inicio.getTime() + 3600000);
  return { titulo: '', categoria: 'Reunião', diaInteiro: false, data: isoData(inicio), inicio: hhmm(inicio), fim: hhmm(f), repete: 'nao', ...extra };
}

/** Datas do formulário; `null` se a data ou os horários não fecham (fim antes do início). */
export function datasDe(d: DadosEvento): { inicio: Date; fim?: Date } | null {
  const [a, m, dia] = d.data.split('-').map(Number);
  if (!a || !m || !dia) return null;
  if (d.diaInteiro) return { inicio: new Date(a, m - 1, dia) };
  const [hi, mi] = d.inicio.split(':').map(Number);
  const [hf, mf] = d.fim.split(':').map(Number);
  const inicio = new Date(a, m - 1, dia, hi, mi);
  const fim = new Date(a, m - 1, dia, hf, mf);
  return Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime()) || fim <= inicio ? null : { inicio, fim };
}

export function regraDe(repete: Repete): RegraRepeticao | null {
  if (repete === 'nao') return null;
  if (repete === 'uteis') return { frequencia: 'semanal', diasSemana: [1, 2, 3, 4, 5] };
  return { frequencia: repete };
}

export function repeteDe(regra: RegraRepeticao): Repete {
  if (regra.frequencia === 'semanal' && regra.diasSemana?.join() === '1,2,3,4,5') return 'uteis';
  return regra.frequencia;
}

/** O rascunho tracejado no calendário enquanto o formulário está aberto. */
export function rascunhoDe(d: DadosEvento | null): RascunhoCalendario | null {
  const datas = d && datasDe(d);
  return datas ? { ...datas, titulo: d.titulo, cor: corDa(d.categoria), diaInteiro: d.diaInteiro } : null;
}

export interface DialogoEventoProps {
  dados: DadosEvento | null;
  aoMudar: (d: DadosEvento) => void;
  aoSalvar: (d: DadosEvento) => void;
  aoFechar: () => void;
  /** Editando: mostra o Excluir. */
  editando?: boolean;
  /** Editando uma ocorrência de série: o Excluir oferece só este dia ou a série toda. */
  daSerie?: boolean;
  aoExcluir?: (tudo: boolean) => void;
}

/** Cadastro e edição de evento num `Form` em diálogo. */
export function DialogoEvento({ dados, aoMudar, aoSalvar, aoFechar, editando, daSerie, aoExcluir }: DialogoEventoProps) {
  const [tentou, setTentou] = useState(false);
  if (!dados) return null;
  const mudar = (parcial: Partial<DadosEvento>) => aoMudar({ ...dados, ...parcial });
  const horarioRuim = !dados.diaInteiro && !datasDe(dados);
  const dia = datasDe({ ...dados, diaInteiro: true })?.inicio;
  const opcoesRepete: { valor: Repete; rotulo: string }[] = [
    { valor: 'nao', rotulo: 'Não repete' },
    { valor: 'diaria', rotulo: 'Todo dia' },
    { valor: 'uteis', rotulo: 'Dias úteis (segunda a sexta)' },
    { valor: 'semanal', rotulo: dia ? `Toda semana, ${NOME_DIA[dia.getDay()]}` : 'Toda semana' },
    { valor: 'mensal', rotulo: dia ? `Todo mês, no dia ${dia.getDate()}` : 'Todo mês' },
    { valor: 'anual', rotulo: dia ? `Todo ano, em ${DIA_MES.format(dia)}` : 'Todo ano' },
  ];
  const salvar = () => {
    setTentou(true);
    if (!dados.titulo.trim() || !datasDe(dados)) return;
    setTentou(false);
    aoSalvar(dados);
  };
  const fechar = () => {
    setTentou(false);
    aoFechar();
  };

  return (
    <Form
      arranjo="modal"
      entidade="evento"
      modo={editando ? 'editar' : 'novo'}
      icone="calendar"
      tamanho="medio"
      aberto
      aoCancelar={fechar}
      aoSalvar={salvar}
      acoes={
        editando &&
        aoExcluir && (
          <>
            {daSerie && <Botao rotulo="Excluir só este dia" severidade="err" aparencia="texto" onClick={() => aoExcluir(false)} />}
            <Botao rotulo={daSerie ? 'Excluir a série' : 'Excluir'} icone="trash-2" severidade="err" aparencia="texto" onClick={() => aoExcluir(true)} />
          </>
        )
      }
    >
      <FormSecao legenda="Evento" icone="calendar" colunas={3}>
        <CampoTexto
          className="lp-col-full"
          rotulo="Título"
          obrigatorio
          autoFocus
          valor={dados.titulo}
          aoMudar={(titulo) => mudar({ titulo })}
          erro={tentou && !dados.titulo.trim() ? 'Informe o título.' : undefined}
        />
        <CampoSelect rotulo="Categoria" opcoes={CATEGORIAS} valor={dados.categoria} aoMudar={(categoria) => mudar({ categoria: categoria ?? 'Reunião' })} />
        <CampoSelect
          className="lp-col-2"
          rotulo="Repete"
          opcoes={opcoesRepete}
          valor={dados.repete}
          aoMudar={(repete) => mudar({ repete: repete ?? 'nao' })}
          dica={daSerie ? 'As mudanças valem para toda a série.' : undefined}
        />
        <CampoMarcacao className="lp-col-full" aparencia="chave" rotulo="Dia inteiro" valor={dados.diaInteiro} aoMudar={(diaInteiro) => mudar({ diaInteiro })} />
        <CampoData rotulo={dados.repete === 'nao' ? 'Data' : 'Começa em'} obrigatorio valor={dados.data} aoMudar={(data) => mudar({ data })} />
        {!dados.diaInteiro && (
          <>
            <CampoHora rotulo="Início" valor={dados.inicio} aoMudar={(inicio) => mudar({ inicio })} />
            <CampoHora rotulo="Fim" valor={dados.fim} aoMudar={(fim) => mudar({ fim })} erro={horarioRuim ? 'O fim vem depois do início.' : undefined} />
          </>
        )}
      </FormSecao>
    </Form>
  );
}

/* ---------- agenda: avulsos + séries, guardados pelo app ---------- */

export interface Serie {
  base: EventoCalendario;
  regra: RegraRepeticao;
  excecoes: Date[];
}

/** O que está aberto no diálogo: um novo evento, um avulso ou uma série (e o dia da ocorrência clicada). */
type Edicao = { tipo: 'novo' } | { tipo: 'avulso'; id: EventoCalendario['id'] } | { tipo: 'serie'; id: EventoCalendario['id']; dia: Date };

/** Estado da agenda e as ações do diálogo; a demo usa o mesmo gancho. */
export function useAgenda(inicial: { avulsos?: EventoCalendario[]; series?: Serie[] } = {}) {
  const [avulsos, setAvulsos] = useState<EventoCalendario[]>(inicial.avulsos ?? []);
  const [series, setSeries] = useState<Serie[]>(inicial.series ?? []);
  const [periodo, setPeriodo] = useState<PeriodoCalendario | null>(null);
  const [dados, setDados] = useState<DadosEvento | null>(null);
  const [edicao, setEdicao] = useState<Edicao>({ tipo: 'novo' });
  const proximo = useRef(1);
  const novoId = () => `novo-${proximo.current++}`;

  const eventos = useMemo(() => {
    if (!periodo) return avulsos;
    return [...series.flatMap((s) => repetirEvento(s.base, { ...s.regra, excecoes: s.excecoes }, periodo)), ...avulsos];
  }, [avulsos, series, periodo]);

  const novo = (inicio: Date, fim?: Date, diaInteiro = false) => {
    setEdicao({ tipo: 'novo' });
    setDados(dadosDe(inicio, fim, { diaInteiro }));
  };
  const abrir = (ev: EventoCalendario) => {
    const s = ev.serie != null ? series.find((x) => x.base.id === ev.serie) : undefined;
    const base = s?.base ?? ev;
    setEdicao(s ? { tipo: 'serie', id: s.base.id, dia: ev.inicio } : { tipo: 'avulso', id: ev.id });
    setDados(
      dadosDe(base.inicio, base.fim, { titulo: base.titulo, categoria: base.categoria ?? 'Reunião', diaInteiro: !!base.diaInteiro, repete: s ? repeteDe(s.regra) : 'nao' }),
    );
  };
  const fechar = () => setDados(null);

  const salvar = (d: DadosEvento) => {
    const datas = datasDe(d)!;
    const regra = regraDe(d.repete);
    const id = edicao.tipo === 'novo' ? novoId() : edicao.id;
    const ev: EventoCalendario = { id, titulo: d.titulo.trim(), categoria: d.categoria, cor: corDa(d.categoria), diaInteiro: d.diaInteiro, ...datas };
    // tira o evento de onde estava e põe de novo (avulso ou série, conforme o "Repete")
    const excecoes = edicao.tipo === 'serie' ? (series.find((s) => s.base.id === id)?.excecoes ?? []) : [];
    setAvulsos((l) => [...l.filter((e) => e.id !== id), ...(regra ? [] : [ev])]);
    setSeries((l) => [...l.filter((s) => s.base.id !== id), ...(regra ? [{ base: ev, regra, excecoes }] : [])]);
    setDados(null);
  };
  const excluir = (tudo: boolean) => {
    if (edicao.tipo === 'avulso') setAvulsos((l) => l.filter((e) => e.id !== edicao.id));
    if (edicao.tipo === 'serie') {
      const { id, dia } = edicao;
      setSeries((l) => (tudo ? l.filter((s) => s.base.id !== id) : l.map((s) => (s.base.id === id ? { ...s, excecoes: [...s.excecoes, dia] } : s))));
    }
    setDados(null);
  };

  return {
    eventos,
    avulsos,
    series,
    periodo,
    setPeriodo,
    setAvulsos,
    setSeries,
    novo,
    abrir,
    /** Props do `DialogoEvento`. */
    dialogo: {
      dados,
      aoMudar: setDados,
      aoSalvar: salvar,
      aoFechar: fechar,
      editando: edicao.tipo !== 'novo',
      daSerie: edicao.tipo === 'serie',
      aoExcluir: excluir,
    } satisfies DialogoEventoProps,
    /** O rascunho tracejado só aparece no cadastro novo. */
    rascunho: edicao.tipo === 'novo' ? rascunhoDe(dados) : null,
  };
}

export default function Exemplo() {
  const agenda = useAgenda();
  return (
    <>
      <Calendario
        rotulo="Agenda"
        eventos={agenda.eventos}
        visaoInicial="semana"
        aoMudarPeriodo={agenda.setPeriodo}
        // arrastar sobre horários vazios escolhe o intervalo; um clique, a meia hora
        aoSelecionarHorario={({ inicio, fim }) => agenda.novo(inicio, fim)}
        aoClicarDia={(dia) => agenda.novo(new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), 9))}
        aoClicarEvento={agenda.abrir}
        rascunho={agenda.rascunho}
      />
      <DialogoEvento {...agenda.dialogo} />
    </>
  );
}
