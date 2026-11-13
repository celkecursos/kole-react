import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent as PointerEventReact, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import { Abas, Aba } from '../Abas/Abas';
import { Botao } from '../Botao/Botao';
import { Dialogo } from '../Dialogo/Dialogo';
import { Skeleton } from '../Skeleton/Skeleton';
import { Vazio } from '../Vazio/Vazio';
import {
  CURTOS_DIA,
  DIA_LONGO,
  HORA,
  MES,
  NOMES_DIA,
  chave,
  deChave,
  diaPelaTecla,
  difDias,
  gradeDoMes,
  inicioDaSemana,
  meiaNoite,
  mesmoDia,
  primeiraMaiuscula,
  somaDias,
  somaDiasHora,
} from './datasCalendario';
import './Calendario.css';

/** `pri`, `ok`, `warn`, `err`, `info`, `destaque` ou uma série dos gráficos (`graf-1` a `graf-6`). */
export type CorEvento = 'pri' | 'ok' | 'warn' | 'err' | 'info' | 'destaque' | 'graf-1' | 'graf-2' | 'graf-3' | 'graf-4' | 'graf-5' | 'graf-6';

export interface EventoCalendario {
  id: string | number;
  titulo: string;
  inicio: Date;
  /** Sem `fim`, o evento ocupa só o horário (ou o dia) de início. */
  fim?: Date;
  /** Evento sem horário (aparece primeiro no dia, sem hora). */
  diaInteiro?: boolean;
  /** Padrão: `pri`. */
  cor?: CorEvento;
  /** Texto miúdo na visão lista (ex.: "Entrega", "Reunião"). */
  categoria?: string;
  /** Mostra o ícone de repetição (o `repetirEvento` já marca). */
  repete?: boolean;
  /** Id do evento base de uma série (o `repetirEvento` preenche): o app sabe qual série mudar. */
  serie?: string | number;
  /** Com `aoAlterarEvento`, este evento não pode ser arrastado nem esticado. */
  fixo?: boolean;
}

/** Evento provisório, desenhado tracejado (ex.: o do formulário de novo evento aberto). */
export interface RascunhoCalendario {
  inicio: Date;
  fim?: Date;
  /** Padrão: "(sem título)". */
  titulo?: string;
  cor?: CorEvento;
  diaInteiro?: boolean;
}

/** Intervalo escolhido na faixa de horários (fim exclusivo). */
export interface IntervaloHorario {
  inicio: Date;
  fim: Date;
}

/** Novo horário de um evento arrastado ou esticado. */
export interface MudancaEvento {
  inicio: Date;
  fim?: Date;
  /** `mover`: mudou de dia ou de horário, com a mesma duração; `esticar`: mudou só o fim. */
  tipo: 'mover' | 'esticar';
}

export type VisaoCalendario = 'mes' | 'semana' | 'dia' | 'lista';

export interface PeriodoCalendario {
  inicio: Date;
  /** Exclusivo: o primeiro dia depois do período. */
  fim: Date;
  visao: VisaoCalendario;
}

export interface CalendarioProps {
  eventos: EventoCalendario[];
  /** Mês mostrado no começo. Padrão: hoje. */
  dataInicial?: Date;
  /** Padrão: `mes`. */
  visaoInicial?: VisaoCalendario;
  /** Visões oferecidas na barra. Padrão: mês, semana, dia e lista. */
  visoes?: VisaoCalendario[];
  /** Primeiro dia da semana: `0` = domingo (padrão), `1` = segunda. */
  inicioSemana?: 0 | 1;
  /** Eventos por dia na visão mês antes do "+N mais". Padrão: `3`. */
  maxPorDia?: number;
  /** O período visível mudou: o app busca os eventos dele. Chamado também ao montar. */
  aoMudarPeriodo?: (periodo: PeriodoCalendario) => void;
  aoClicarDia?: (dia: Date) => void;
  aoClicarEvento?: (evento: EventoCalendario) => void;
  carregando?: boolean;
  /** Visão lista sem eventos no mês. */
  textoVazio?: string;
  /** Nome do calendário para leitor de tela. */
  rotulo?: string;
  /** "Hoje" do calendário (para testes). Padrão: a data atual. */
  hoje?: Date;
  /** Semana e dia: primeira e última hora da faixa de horários. Padrão: 7 e 21. */
  horaInicio?: number;
  horaFim?: number;
  /** Semana e dia: clique num horário vazio, arredondado para a meia hora (ex.: criar evento ali). */
  aoClicarHorario?: (dataHora: Date) => void;
  /** Hora da linha do "agora" (para testes). Padrão: a hora atual, atualizada a cada minuto. */
  agora?: Date;
  /**
   * Liga o arrastar: o evento vai para outro dia (mês) ou horário (semana e dia, de 15 em 15
   * minutos), e a borda de baixo do bloco estica a duração. No toque, segure o evento antes de
   * arrastar. Pelo teclado: Alt+setas movem e Alt+Shift+↑↓ esticam. O app grava a mudança e
   * devolve o evento novo em `eventos`; até lá o calendário mostra o evento onde estava.
   */
  aoAlterarEvento?: (evento: EventoCalendario, mudanca: MudancaEvento) => void;
  /**
   * Semana e dia: arrastar sobre horários vazios escolhe um intervalo (de 15 em 15 minutos), e um
   * clique escolhe a meia hora. Pelo teclado, Shift+↑↓ no cursor aumentam o intervalo e Enter
   * confirma. Com ele, clique e Enter na faixa de horários chamam este, e não o `aoClicarHorario`.
   */
  aoSelecionarHorario?: (intervalo: IntervaloHorario) => void;
  /** Evento provisório, tracejado, em qualquer visão (ex.: enquanto o formulário de novo evento está aberto). */
  rascunho?: RascunhoCalendario | null;
  /** Dia mostrado. Mudar a prop leva o calendário até ele (ex.: o dia escolhido num `MiniCalendario`). */
  data?: Date;
  className?: string;
}

/** Eventos de cada dia (um evento de vários dias aparece em todos), dia inteiro primeiro, depois pela hora. */
function porDia(eventos: EventoCalendario[]): Map<string, EventoCalendario[]> {
  const mapa = new Map<string, EventoCalendario[]>();
  for (const e of eventos) {
    const ultimo = meiaNoite(e.fim && e.fim > e.inicio ? e.fim : e.inicio);
    // fim à meia-noite exata não conta o dia seguinte
    const fimReal = e.fim && e.fim.getHours() === 0 && e.fim.getMinutes() === 0 && !mesmoDia(e.fim, e.inicio) ? somaDias(ultimo, -1) : ultimo;
    for (let d = meiaNoite(e.inicio); d <= fimReal; d = somaDias(d, 1)) {
      const k = chave(d);
      if (!mapa.has(k)) mapa.set(k, []);
      mapa.get(k)!.push(e);
    }
  }
  for (const lista of mapa.values()) lista.sort((a, b) => Number(!!b.diaInteiro) - Number(!!a.diaInteiro) || a.inicio.getTime() - b.inicio.getTime());
  return mapa;
}

function textoHora(e: EventoCalendario) {
  if (e.diaInteiro) return 'dia inteiro';
  return e.fim ? `${HORA.format(e.inicio)}–${HORA.format(e.fim)}` : HORA.format(e.inicio);
}

const SEMANA_TITULO = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' });
const DIA_TITULO = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const ROTULO_VISAO: Record<VisaoCalendario, string> = { mes: 'Mês', semana: 'Semana', dia: 'Dia', lista: 'Lista' };
const MIN_DIA = 24 * 60;

const PASSO_MIN = 15;
const arredonda = (min: number) => Math.round(min / PASSO_MIN) * PASSO_MIN;

/** Arrasto em andamento: o evento e onde ele ficaria se soltasse agora. */
interface Arrasto {
  ev: EventoCalendario;
  novo: MudancaEvento;
}
type ModoArrasto = 'dia' | 'hora' | 'esticar';
/** Começa o arrasto de um evento (o `dia` é a célula ou coluna onde ele foi pego). */
type IniciarArrasto = (e: PointerEventReact<HTMLElement>, ev: EventoCalendario, modo: ModoArrasto, dia: Date) => void;

const ATALHOS_MES = 'Alt+ArrowLeft Alt+ArrowRight Alt+ArrowUp Alt+ArrowDown';
const ATALHOS_HORA = 'Alt+ArrowLeft Alt+ArrowRight Alt+ArrowUp Alt+ArrowDown Alt+Shift+ArrowUp Alt+Shift+ArrowDown';

/** Elementos debaixo do ponteiro (inclusive o que está sendo arrastado e os de baixo dele). */
function sobPonteiro<T>(x: number, y: number, ler: (el: HTMLElement) => T | undefined): T | undefined {
  for (const el of document.elementsFromPoint(x, y)) {
    const v = el instanceof HTMLElement ? ler(el) : undefined;
    if (v !== undefined) return v;
  }
  return undefined;
}

interface EventoPosicionado {
  ev: EventoCalendario;
  /** Minutos desde a meia-noite do dia, já recortados ao dia. */
  ini: number;
  fim: number;
  col: number;
  cols: number;
}

/**
 * Eventos com horário de um dia, prontos para a faixa de horários: os que se
 * sobrepõem ficam lado a lado, cada grupo dividindo a largura em colunas.
 */
function posicionar(lista: EventoCalendario[], dia: Date): EventoPosicionado[] {
  const base = meiaNoite(dia).getTime();
  const itens = lista
    .filter((e) => !e.diaInteiro)
    .map((ev) => {
      const ini = Math.max(0, (ev.inicio.getTime() - base) / 60000);
      const fimBruto = ev.fim && ev.fim > ev.inicio ? (ev.fim.getTime() - base) / 60000 : ini + 60;
      return { ev, ini, fim: Math.min(MIN_DIA, Math.max(fimBruto, ini + 20)), col: 0, cols: 1 };
    })
    .sort((a, b) => a.ini - b.ini || b.fim - a.fim);
  let grupo: EventoPosicionado[] = [];
  let colunas: number[] = [];
  let fimGrupo = -1;
  const fecha = () => grupo.forEach((g) => (g.cols = colunas.length));
  for (const it of itens) {
    if (it.ini >= fimGrupo) {
      fecha();
      grupo = [];
      colunas = [];
    }
    const livre = colunas.findIndex((f) => f <= it.ini);
    it.col = livre >= 0 ? livre : colunas.length;
    colunas[it.col] = it.fim;
    grupo.push(it);
    fimGrupo = Math.max(fimGrupo, it.fim);
  }
  fecha();
  return itens;
}

/** Calendário de eventos com visão mês, semana, dia e lista, em pt-BR. Os eventos vêm do app; o componente só mostra e avisa os cliques. */
export function Calendario({
  eventos,
  dataInicial,
  visaoInicial = 'mes',
  visoes = ['mes', 'semana', 'dia', 'lista'],
  inicioSemana = 0,
  maxPorDia = 3,
  aoMudarPeriodo,
  aoClicarDia,
  aoClicarEvento,
  carregando,
  textoVazio = 'Nenhum evento neste mês.',
  rotulo = 'Calendário',
  hoje: hojeProp,
  horaInicio = 7,
  horaFim = 21,
  aoClicarHorario,
  agora: agoraProp,
  aoAlterarEvento,
  aoSelecionarHorario,
  rascunho,
  data,
  className,
}: CalendarioProps) {
  const [agoraRelogio, setAgoraRelogio] = useState(() => new Date());
  useEffect(() => {
    if (agoraProp) return;
    const t = window.setInterval(() => setAgoraRelogio(new Date()), 60000);
    return () => window.clearInterval(t);
  }, [agoraProp]);
  const agora = agoraProp ?? agoraRelogio;
  const hoje = meiaNoite(hojeProp ?? new Date());
  const [ref, setRef] = useState(() => meiaNoite(dataInicial ?? hoje));
  const [visao, setVisao] = useState<VisaoCalendario>(visaoInicial);
  const [foco, setFoco] = useState(() => meiaNoite(dataInicial ?? hoje));
  const [diaAberto, setDiaAberto] = useState<Date | null>(null);
  const grade = useRef<HTMLDivElement>(null);
  const raiz = useRef<HTMLElement>(null);
  // o foco só segue o dia escolhido quando a mudança veio do teclado (clicar não rouba o foco)
  const peloTeclado = useRef(false);

  const dias = useMemo(() => gradeDoMes(ref, inicioSemana), [ref, inicioSemana]);
  const mapa = useMemo(() => porDia(eventos), [eventos]);
  const periodo = useMemo<PeriodoCalendario>(() => {
    if (visao === 'mes') return { inicio: dias[0], fim: somaDias(dias[41], 1), visao };
    if (visao === 'semana') {
      const ini = inicioDaSemana(ref, inicioSemana);
      return { inicio: ini, fim: somaDias(ini, 7), visao };
    }
    if (visao === 'dia') return { inicio: ref, fim: somaDias(ref, 1), visao };
    return { inicio: new Date(ref.getFullYear(), ref.getMonth(), 1), fim: new Date(ref.getFullYear(), ref.getMonth() + 1, 1), visao };
  }, [dias, ref, visao, inicioSemana]);

  // a prop `data` leva o calendário até o dia (só quando muda)
  const dataMs = data ? meiaNoite(data).getTime() : null;
  useEffect(() => {
    if (dataMs == null) return;
    setRef(new Date(dataMs));
    setFoco(new Date(dataMs));
  }, [dataMs]);

  const aviso = useRef(aoMudarPeriodo);
  aviso.current = aoMudarPeriodo;
  useEffect(() => {
    aviso.current?.(periodo);
  }, [periodo.inicio.getTime(), periodo.fim.getTime(), periodo.visao]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!peloTeclado.current) return;
    peloTeclado.current = false;
    grade.current?.querySelector<HTMLElement>(`[data-dia="${chave(foco)}"]`)?.focus();
  }, [foco, ref]);

  /** Anterior/próximo: um mês, uma semana ou um dia, conforme a visão. */
  const irMes = (n: number) => {
    const novo =
      visao === 'semana' ? somaDias(ref, 7 * n) : visao === 'dia' ? somaDias(ref, n) : new Date(ref.getFullYear(), ref.getMonth() + n, 1);
    setRef(novo);
    setFoco(novo);
  };
  const unidade = visao === 'semana' ? 'semana' : visao === 'dia' ? 'dia' : 'mês';
  const genero = visao === 'semana' ? 'a' : 'o';
  const irHoje = () => {
    setRef(hoje);
    setFoco(hoje);
  };

  const moverFoco = (e: KeyboardEvent, dia: Date) => {
    if (e.altKey) return;
    const alvo = diaPelaTecla(e.key, dia, inicioSemana);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      aoClicarDia?.(dia);
      return;
    }
    if (!alvo) return;
    e.preventDefault();
    peloTeclado.current = true;
    setFoco(alvo);
    if (alvo.getMonth() !== ref.getMonth() || alvo.getFullYear() !== ref.getFullYear()) setRef(new Date(alvo.getFullYear(), alvo.getMonth(), 1));
  };

  /* ---- arrastar e esticar ---- */
  const [arrasto, setArrasto] = useState<Arrasto | null>(null);
  const [anuncio, setAnuncio] = useState('');
  // depois de soltar, o clique que o navegador dispara não abre o evento
  const suprimirClique = useRef(false);
  // depois de mover pelo teclado, o foco volta ao evento quando o app devolver a lista nova
  const focarEvento = useRef<EventoCalendario['id'] | null>(null);
  const alterar = useRef(aoAlterarEvento);
  alterar.current = aoAlterarEvento;
  const podeMover = (ev: EventoCalendario) => !!aoAlterarEvento && !ev.fixo;
  const minIni = horaInicio * 60;
  const totalMin = (horaFim - horaInicio) * 60;

  useEffect(() => {
    const id = focarEvento.current;
    if (id == null) return;
    focarEvento.current = null;
    raiz.current?.querySelector<HTMLElement>(`[data-ev="${CSS.escape(String(id))}"]`)?.focus();
  }, [eventos]);

  const descrever = (ev: EventoCalendario, m: MudancaEvento) =>
    m.tipo === 'esticar' && m.fim
      ? `${ev.titulo}: agora termina às ${HORA.format(m.fim)}.`
      : `${ev.titulo}: ${DIA_LONGO.format(m.inicio)}${ev.diaInteiro ? '' : `, ${HORA.format(m.inicio)}`}.`;

  const confirmar = useCallback((ev: EventoCalendario, m: MudancaEvento) => {
    if (m.inicio.getTime() === ev.inicio.getTime() && m.fim?.getTime() === ev.fim?.getTime()) return false;
    alterar.current?.(ev, m);
    setAnuncio(descrever(ev, m));
    return true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const iniciarArrasto: IniciarArrasto = (e, ev, modo, dia) => {
    if (!podeMover(ev) || e.button !== 0 || !e.isPrimary) return;
    if (modo === 'esticar') e.stopPropagation();
    const toque = e.pointerType !== 'mouse';
    const x0 = e.clientX;
    const y0 = e.clientY;
    /** Coluna da faixa de horários debaixo do ponteiro: o dia e o minuto (do dia) na altura dele. */
    const minutoEm = (x: number, y: number) =>
      sobPonteiro(x, y, (el) => {
        const col = el.dataset.col;
        if (!col) return undefined;
        const r = el.getBoundingClientRect();
        return { dia: deChave(col), min: minIni + Math.min(Math.max((y - r.top) / r.height, 0), 1) * totalMin };
      });
    const diaEm = (x: number, y: number) =>
      sobPonteiro(x, y, (el) => {
        const k = el.dataset.dia ?? el.dataset.col;
        return k ? deChave(k) : undefined;
      });
    const pegou = modo === 'dia' ? null : minutoEm(x0, y0);
    let ativo = false;
    let novo: MudancaEvento | null = null;
    let espera = 0;

    const calcular = (x: number, y: number): MudancaEvento | null => {
      if (modo === 'dia') {
        const alvo = diaEm(x, y);
        if (!alvo) return novo;
        const n = difDias(alvo, dia);
        return { tipo: 'mover', inicio: somaDiasHora(ev.inicio, n), fim: ev.fim && somaDiasHora(ev.fim, n) };
      }
      const p = minutoEm(x, y);
      if (!p || !pegou) return novo;
      if (modo === 'hora') {
        const n = difDias(p.dia, dia);
        const min = arredonda(p.min - pegou.min);
        return { tipo: 'mover', inicio: somaDiasHora(ev.inicio, n, min), fim: ev.fim && somaDiasHora(ev.fim, n, min) };
      }
      // esticar: o fim segue o ponteiro na própria coluna, com 15 minutos no mínimo
      const fim = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), 0, arredonda(p.min));
      const minimo = new Date(ev.inicio.getTime() + PASSO_MIN * 60000);
      return { tipo: 'esticar', inicio: ev.inicio, fim: fim < minimo ? minimo : fim };
    };
    const ativar = () => {
      ativo = true;
      novo = { tipo: modo === 'esticar' ? 'esticar' : 'mover', inicio: ev.inicio, fim: ev.fim };
      setArrasto({ ev, novo });
    };
    const mover = (p: PointerEvent) => {
      if (p.pointerId !== e.pointerId) return;
      const longe = Math.hypot(p.clientX - x0, p.clientY - y0);
      if (!ativo) {
        // toque: segurar antes de arrastar; mexer antes disso é rolar a página
        if (toque) {
          if (longe > 8) encerrar();
          return;
        }
        if (longe < 4) return;
        ativar();
      }
      const n = calcular(p.clientX, p.clientY);
      if (n && (n.inicio.getTime() !== novo?.inicio.getTime() || n.fim?.getTime() !== novo?.fim?.getTime())) {
        novo = n;
        setArrasto({ ev, novo: n });
      }
    };
    const soltar = (p: PointerEvent) => {
      if (p.pointerId !== e.pointerId) return;
      if (ativo) {
        suprimirClique.current = true;
        window.setTimeout(() => (suprimirClique.current = false), 0);
        if (novo) confirmar(ev, novo);
      }
      encerrar();
    };
    const tecla = (k: globalThis.KeyboardEvent) => {
      if (k.key === 'Escape') {
        k.preventDefault();
        encerrar();
      }
    };
    // durante o arrasto pelo toque, a página não rola; e segurar não abre o menu do navegador
    const travarRolagem = (t: TouchEvent) => ativo && t.cancelable && t.preventDefault();
    const semMenu = (m: Event) => m.preventDefault();
    const encerrar = () => {
      window.clearTimeout(espera);
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', encerrar);
      window.removeEventListener('keydown', tecla, true);
      window.removeEventListener('touchmove', travarRolagem);
      window.removeEventListener('contextmenu', semMenu, true);
      ativo = false;
      setArrasto(null);
    };
    if (toque) espera = window.setTimeout(ativar, 350);
    window.addEventListener('pointermove', mover);
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', encerrar);
    window.addEventListener('keydown', tecla, true);
    window.addEventListener('touchmove', travarRolagem, { passive: false });
    window.addEventListener('contextmenu', semMenu, true);
  };

  /** Alt+setas no evento: ←→ um dia; ↑↓ uma semana (mês) ou 15 minutos (semana e dia); Alt+Shift+↑↓ estica. */
  const teclarEvento = (e: KeyboardEvent<HTMLElement>, ev: EventoCalendario, naGradeHoras: boolean) => {
    e.stopPropagation();
    if (!e.altKey || !podeMover(ev) || !e.key.startsWith('Arrow')) return;
    const lado = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
    const vert = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
    let m: MudancaEvento;
    if (e.shiftKey && naGradeHoras && vert && !ev.diaInteiro) {
      const fimAtual = ev.fim && ev.fim > ev.inicio ? ev.fim : new Date(ev.inicio.getTime() + 3600000);
      const fim = new Date(fimAtual.getTime() + vert * PASSO_MIN * 60000);
      if (fim.getTime() - ev.inicio.getTime() < PASSO_MIN * 60000) return;
      m = { tipo: 'esticar', inicio: ev.inicio, fim };
    } else if (lado || !naGradeHoras || ev.diaInteiro) {
      const n = lado || (naGradeHoras ? 0 : vert * 7);
      if (!n) return;
      m = { tipo: 'mover', inicio: somaDiasHora(ev.inicio, n), fim: ev.fim && somaDiasHora(ev.fim, n) };
    } else {
      const min = vert * PASSO_MIN;
      m = { tipo: 'mover', inicio: somaDiasHora(ev.inicio, 0, min), fim: ev.fim && somaDiasHora(ev.fim, 0, min) };
    }
    e.preventDefault();
    focarEvento.current = ev.id;
    // o evento que sai do período visível leva o calendário junto
    if (visao === 'mes') {
      if (m.inicio.getMonth() !== ref.getMonth() || m.inicio.getFullYear() !== ref.getFullYear()) setRef(new Date(m.inicio.getFullYear(), m.inicio.getMonth(), 1));
    } else if (m.inicio < periodo.inicio || m.inicio >= periodo.fim) setRef(meiaNoite(m.inicio));
    if (!confirmar(ev, m)) focarEvento.current = null;
  };

  const abrirEvento = (ev: EventoCalendario) => {
    if (suprimirClique.current) return;
    aoClicarEvento?.(ev);
  };

  const evRascunho = useMemo<EventoCalendario | null>(
    () => (rascunho ? { id: '__rascunho', titulo: rascunho.titulo?.trim() || '(sem título)', inicio: rascunho.inicio, fim: rascunho.fim, cor: rascunho.cor, diaInteiro: rascunho.diaInteiro } : null),
    [rascunho],
  );
  const diasRascunho = useMemo(() => (evRascunho ? new Set(porDia([evRascunho]).keys()) : null), [evRascunho]);
  const chipRascunho = (ev: EventoCalendario) => (
    <span key="rascunho" className={cx('lp-cal-evento', 'is-rascunho', `lp-cal-evento--${ev.cor ?? 'pri'}`, ev.diaInteiro && 'is-dia-inteiro')} aria-hidden="true">
      {!ev.diaInteiro && <span className="lp-cal-evento-hora">{HORA.format(ev.inicio)}</span>}
      <span className="lp-cal-evento-tx">{ev.titulo}</span>
    </span>
  );

  // onde o evento arrastado ficaria: as células do mês que ele cobre
  const diasAlvo = useMemo(() => {
    if (!arrasto) return null;
    return new Set(porDia([{ ...arrasto.ev, inicio: arrasto.novo.inicio, fim: arrasto.novo.fim }]).keys());
  }, [arrasto]);

  const cabecalhos = Array.from({ length: 7 }, (_, i) => (i + inicioSemana) % 7);
  const titulo = (() => {
    if (visao === 'dia') return primeiraMaiuscula(DIA_TITULO.format(ref));
    if (visao === 'semana') {
      const ini = periodo.inicio;
      const fim = somaDias(ini, 6);
      // mesmo mês: "8 – 14 de novembro de 2026"; senão "29 de nov – 5 de dez de 2026"
      if (ini.getMonth() === fim.getMonth()) return `${ini.getDate()} – ${fim.getDate()} de ${MES.format(fim)}`;
      return `${SEMANA_TITULO.format(ini).replace('.', '')} – ${SEMANA_TITULO.format(fim).replace('.', '')} de ${fim.getFullYear()}`;
    }
    return primeiraMaiuscula(MES.format(ref));
  })();
  /** Evento em linha (mês, faixa de dia inteiro e lista do "+N mais"). Com `dia`, pode ser arrastado para outro dia. */
  const chip = (ev: EventoCalendario, completo = false, dia?: Date, naGradeHoras = false) => {
    const movel = !!dia && podeMover(ev);
    return (
      <button
        key={ev.id}
        type="button"
        data-ev={completo ? undefined : ev.id}
        className={cx(
          'lp-cal-evento',
          `lp-cal-evento--${ev.cor ?? 'pri'}`,
          ev.diaInteiro && 'is-dia-inteiro',
          completo && 'is-completo',
          movel && 'is-movel',
          arrasto?.ev.id === ev.id && 'is-origem',
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (completo) setDiaAberto(null);
          abrirEvento(ev);
        }}
        onPointerDown={movel ? (e) => iniciarArrasto(e, ev, 'dia', dia) : undefined}
        onKeyDown={(e) => (movel ? teclarEvento(e, ev, naGradeHoras) : e.stopPropagation())}
        aria-keyshortcuts={movel ? ATALHOS_MES : undefined}
        title={`${ev.titulo} · ${textoHora(ev)}${ev.repete ? ' · repete' : ''}`}
      >
        {!ev.diaInteiro && <span className="lp-cal-evento-hora">{HORA.format(ev.inicio)}</span>}
        <span className="lp-cal-evento-tx">{ev.titulo}</span>
        {ev.repete && <SeRepete />}
      </button>
    );
  };

  // visão lista: dias do mês com evento, em ordem
  const diasLista = useMemo(() => {
    const ini = new Date(ref.getFullYear(), ref.getMonth(), 1);
    const fim = new Date(ref.getFullYear(), ref.getMonth() + 1, 1);
    const lista: Date[] = [];
    for (let d = ini; d < fim; d = somaDias(d, 1)) if (mapa.get(chave(d))?.length) lista.push(d);
    return lista;
  }, [mapa, ref]);

  return (
    <section ref={raiz} className={cx('lp-cal', arrasto && 'is-arrastando', className)} aria-label={rotulo}>
      <div className="lp-cal-barra">
        <div className="lp-cal-nav">
          <Botao rotulo="Hoje" severidade="secundario" aparencia="contorno" tamanho="pequeno" onClick={irHoje} />
          <Botao icone="chevron-left" aria-label={`${primeiraMaiuscula(unidade)} anterior`} dica={`${primeiraMaiuscula(unidade)} anterior`} severidade="secundario" aparencia="texto" tamanho="pequeno" onClick={() => irMes(-1)} />
          <Botao icone="chevron-right" aria-label={`Próxim${genero} ${unidade}`} dica={`Próxim${genero} ${unidade}`} severidade="secundario" aparencia="texto" tamanho="pequeno" onClick={() => irMes(1)} />
          <h2 className="lp-cal-titulo" aria-live="polite">
            {titulo}
          </h2>
        </div>
        {visoes.length > 1 && (
          <Abas variante="segmentado" ativa={visao} aoMudar={(v) => setVisao(v as VisaoCalendario)} rotulo="Visão do calendário">
            {visoes.map((v) => (
              <Aba key={v} valor={v} rotulo={ROTULO_VISAO[v]} />
            ))}
          </Abas>
        )}
      </div>

      {carregando ? (
        <Skeleton altura="32rem" />
      ) : visao === 'semana' || visao === 'dia' ? (
        <GradeHorarios
          dias={visao === 'dia' ? [ref] : Array.from({ length: 7 }, (_, i) => somaDias(periodo.inicio, i))}
          mapa={mapa}
          hoje={hoje}
          agora={agora}
          horaInicio={horaInicio}
          horaFim={horaFim}
          rotulo={titulo}
          chip={chip}
          aoClicarDia={aoClicarDia}
          aoClicarEvento={abrirEvento}
          arrasto={arrasto}
          podeMover={podeMover}
          iniciarArrasto={iniciarArrasto}
          teclarEvento={teclarEvento}
          aoClicarHorario={aoClicarHorario}
          aoSelecionarHorario={aoSelecionarHorario}
          rascunho={evRascunho}
          chipRascunho={chipRascunho}
          aoNavegar={irMes}
        />
      ) : visao === 'mes' ? (
        <div ref={grade} className="lp-cal-mes" role="grid" aria-label={titulo} aria-readonly="true">
          <div className="lp-cal-linha lp-cal-cab" role="row">
            {cabecalhos.map((d) => (
              <div key={d} className="lp-cal-cab-dia" role="columnheader" aria-label={NOMES_DIA[d]}>
                {CURTOS_DIA[d]}
              </div>
            ))}
          </div>
          {Array.from({ length: 6 }, (_, s) => (
            <div key={s} className="lp-cal-linha" role="row">
              {dias.slice(s * 7, s * 7 + 7).map((dia) => {
                const lista = mapa.get(chave(dia)) ?? [];
                const fora = dia.getMonth() !== ref.getMonth();
                const eHoje = mesmoDia(dia, hoje);
                const sobra = lista.length - maxPorDia;
                const visiveis = sobra > 0 ? lista.slice(0, maxPorDia - 1) : lista;
                const resto = lista.length - visiveis.length;
                return (
                  <div
                    key={chave(dia)}
                    data-dia={chave(dia)}
                    role="gridcell"
                    tabIndex={mesmoDia(dia, foco) ? 0 : -1}
                    aria-selected={mesmoDia(dia, foco)}
                    aria-current={eHoje ? 'date' : undefined}
                    aria-label={`${DIA_LONGO.format(dia)}${lista.length ? `, ${lista.length} evento${lista.length > 1 ? 's' : ''}` : ''}`}
                    className={cx('lp-cal-dia', fora && 'is-fora', eHoje && 'is-hoje', aoClicarDia && 'is-clicavel', diasAlvo?.has(chave(dia)) && 'is-alvo')}
                    onClick={() => {
                      setFoco(dia);
                      aoClicarDia?.(dia);
                    }}
                    onKeyDown={(e) => moverFoco(e, dia)}
                  >
                    <span className="lp-cal-num" aria-hidden="true">
                      {dia.getDate()}
                    </span>
                    <div className="lp-cal-eventos">
                      {visiveis.map((ev) => chip(ev, false, dia))}
                      {evRascunho && diasRascunho?.has(chave(dia)) && chipRascunho(evRascunho)}
                      {resto > 0 && (
                        <button
                          type="button"
                          className="lp-cal-mais"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDiaAberto(dia);
                          }}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          +{resto} mais
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : diasLista.length ? (
        <ol className="lp-cal-lista">
          {diasLista.map((dia) => (
            <li key={chave(dia)} className={cx('lp-cal-lista-dia', mesmoDia(dia, hoje) && 'is-hoje')}>
              <h3 className="lp-cal-lista-data">
                <span>{primeiraMaiuscula(DIA_LONGO.format(dia))}</span>
                {mesmoDia(dia, hoje) && <span className="lp-cal-lista-hoje">hoje</span>}
              </h3>
              <ul className="lp-cal-lista-eventos">
                {mapa.get(chave(dia))!.map((ev) => (
                  <li key={ev.id}>
                    <button type="button" className="lp-cal-lista-item" onClick={() => aoClicarEvento?.(ev)}>
                      <span className={cx('lp-cal-ponto', `lp-cal-evento--${ev.cor ?? 'pri'}`)} aria-hidden="true" />
                      <span className="lp-cal-lista-hora">{textoHora(ev)}</span>
                      <span className="lp-cal-lista-titulo">
                        {ev.titulo}
                        {ev.repete && <SeRepete />}
                      </span>
                      {ev.categoria && <span className="lp-cal-lista-cat">{ev.categoria}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      ) : (
        <Vazio titulo={textoVazio} icone="calendar" />
      )}

      <span className="lp-sr" aria-live="polite">
        {anuncio}
      </span>

      <Dialogo aberto={!!diaAberto} aoFechar={() => setDiaAberto(null)} titulo={diaAberto ? primeiraMaiuscula(DIA_LONGO.format(diaAberto)) : ''} icone="calendar" tamanho="pequeno">
        <div className="lp-cal-dia-todos">{diaAberto && (mapa.get(chave(diaAberto)) ?? []).map((ev) => chip(ev, true))}</div>
      </Dialogo>
    </section>
  );
}

/** Ícone de evento que se repete (com texto para leitor de tela). */
function SeRepete() {
  return (
    <span className="lp-cal-repete" title="Repete">
      <Icone icone="refresh-cw" />
      <span className="lp-sr">, repete</span>
    </span>
  );
}

interface GradeHorariosProps {
  dias: Date[];
  mapa: Map<string, EventoCalendario[]>;
  hoje: Date;
  agora: Date;
  horaInicio: number;
  horaFim: number;
  rotulo: string;
  chip: (ev: EventoCalendario, completo: boolean, dia: Date, naGradeHoras: boolean) => ReactNode;
  aoClicarDia?: (dia: Date) => void;
  aoClicarEvento?: (evento: EventoCalendario) => void;
  aoClicarHorario?: (dataHora: Date) => void;
  aoSelecionarHorario?: (intervalo: IntervaloHorario) => void;
  rascunho: EventoCalendario | null;
  chipRascunho: (ev: EventoCalendario) => ReactNode;
  /** Sair pela borda com o teclado: semana (ou dia) anterior ou seguinte. */
  aoNavegar: (n: number) => void;
  arrasto: Arrasto | null;
  podeMover: (ev: EventoCalendario) => boolean;
  iniciarArrasto: IniciarArrasto;
  teclarEvento: (e: KeyboardEvent<HTMLElement>, ev: EventoCalendario, naGradeHoras: boolean) => void;
}

/** Semana ou dia: faixa de dia inteiro e, embaixo, os eventos posicionados pela hora. */
function GradeHorarios({
  dias,
  mapa,
  hoje,
  agora,
  horaInicio,
  horaFim,
  rotulo,
  chip,
  aoClicarDia,
  aoClicarEvento,
  aoClicarHorario,
  aoSelecionarHorario,
  rascunho,
  chipRascunho,
  aoNavegar,
  arrasto,
  podeMover,
  iniciarArrasto,
  teclarEvento,
}: GradeHorariosProps) {
  // cursor do teclado: um horário de 30 minutos (dia da coluna + faixa)
  const nFaixas = (horaFim - horaInicio) * 2;
  const indiceHoje = dias.findIndex((d) => mesmoDia(d, hoje));
  // n: quantas faixas de 30 minutos o cursor cobre (Shift+↑↓, com `aoSelecionarHorario`)
  const [cursor, setCursor] = useState(() => ({
    d: Math.max(0, indiceHoje),
    f: Math.min(nFaixas - 1, Math.max(0, (agora.getHours() - horaInicio) * 2)),
    n: 1,
  }));
  const cursorEl = useRef<HTMLDivElement>(null);
  const focarCursor = useRef(false);
  const dc = Math.min(cursor.d, dias.length - 1);
  useEffect(() => {
    if (!focarCursor.current) return;
    focarCursor.current = false;
    cursorEl.current?.focus();
  });
  const dataDoCursor = (faixas = 0) => {
    const dia = dias[dc];
    const min = horaInicio * 60 + (cursor.f + faixas) * 30;
    return new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), Math.floor(min / 60), min % 60);
  };
  const eventosNoCursor = () => {
    const ini = horaInicio * 60 + cursor.f * 30;
    return posicionar(mapa.get(chave(dias[dc])) ?? [], dias[dc]).filter((it) => it.ini < ini + 30 && it.fim > ini);
  };
  const teclar = (e: KeyboardEvent<HTMLDivElement>) => {
    let { f, n } = cursor;
    let nd = dc;
    if (e.shiftKey && aoSelecionarHorario && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      n = e.key === 'ArrowDown' ? Math.min(nFaixas - f, n + 1) : Math.max(1, n - 1);
    } else if (e.key === 'ArrowUp') f = Math.max(0, f - 1);
    else if (e.key === 'ArrowDown') f = Math.min(nFaixas - 1, f + 1);
    else if (e.key === 'Home') f = 0;
    else if (e.key === 'End') f = nFaixas - 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      nd = dc + (e.key === 'ArrowLeft' ? -1 : 1);
      // saiu pela borda: semana (ou dia) vizinha, com o cursor na outra ponta
      if (nd < 0 || nd >= dias.length) {
        aoNavegar(nd < 0 ? -1 : 1);
        nd = nd < 0 ? dias.length - 1 : 0;
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const noHorario = eventosNoCursor();
      if (aoSelecionarHorario) aoSelecionarHorario({ inicio: dataDoCursor(), fim: dataDoCursor(cursor.n) });
      else if (aoClicarHorario) aoClicarHorario(dataDoCursor());
      else if (noHorario.length) aoClicarEvento?.(noHorario[0].ev);
      return;
    } else return;
    e.preventDefault();
    focarCursor.current = true;
    // mover o cursor volta a meia hora; Shift+↑↓ mudam só o tamanho
    setCursor({ d: nd, f, n: e.shiftKey ? n : 1 });
  };
  const cursorTexto = (() => {
    const dt = dataDoCursor();
    const n = eventosNoCursor();
    const ate = cursor.n > 1 ? ` até ${HORA.format(dataDoCursor(cursor.n))}` : '';
    return `${DIA_LONGO.format(dt)}, ${HORA.format(dt)}${ate}${n.length ? `, ${n.map((it) => it.ev.titulo).join(', ')}` : ', livre'}`;
  })();
  const horas = Array.from({ length: horaFim - horaInicio }, (_, i) => horaInicio + i);
  const minIni = horaInicio * 60;
  const minFim = horaFim * 60;
  const total = minFim - minIni;
  const pct = (min: number) => `${((Math.min(Math.max(min, minIni), minFim) - minIni) / total) * 100}%`;
  const diaInteiro = dias.map((d) => (mapa.get(chave(d)) ?? []).filter((e) => e.diaInteiro));
  const diasRascunho = rascunho ? new Set(porDia([rascunho]).keys()) : null;
  const temDiaInteiro = diaInteiro.some((l) => l.length > 0) || !!rascunho?.diaInteiro;
  const evArrastado = arrasto ? { ...arrasto.ev, inicio: arrasto.novo.inicio, fim: arrasto.novo.fim } : null;
  const diasArrastado = evArrastado ? new Set(porDia([evArrastado]).keys()) : null;
  const alvoInteiro = evArrastado?.diaInteiro ? diasArrastado : null;
  const agoraMin = agora.getHours() * 60 + agora.getMinutes();
  const estilo = { '--cal-dias': dias.length } as CSSProperties;
  const idAjuda = `lp-cal-ajuda-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const naHora = (dia: Date, min: number) => new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), 0, min);
  const clicarHorario = (e: MouseEvent<HTMLDivElement>, dia: Date) => {
    if (e.target !== e.currentTarget || selecionou.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const min = minIni + Math.floor((((e.clientY - r.top) / r.height) * total) / 30) * 30;
    if (aoSelecionarHorario) aoSelecionarHorario({ inicio: naHora(dia, min), fim: naHora(dia, min + 30) });
    else aoClicarHorario?.(naHora(dia, min));
  };

  // arrastar sobre horários vazios: escolhe um intervalo (mouse e caneta; no toque, o toque escolhe a meia hora)
  const [selecao, setSelecao] = useState<{ dia: Date; ini: number; fim: number } | null>(null);
  const selecionou = useRef(false);
  const comecarSelecao = (e: PointerEventReact<HTMLDivElement>, dia: Date) => {
    if (!aoSelecionarHorario || e.target !== e.currentTarget || e.button !== 0 || e.pointerType === 'touch') return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    const minEm = (y: number) => minIni + Math.min(Math.max((y - r.top) / r.height, 0), 1) * total;
    const a = Math.floor(minEm(e.clientY) / PASSO_MIN) * PASSO_MIN;
    const y0 = e.clientY;
    let atual: { dia: Date; ini: number; fim: number } | null = null;
    const mover = (p: PointerEvent) => {
      if (p.pointerId !== e.pointerId || (!atual && Math.abs(p.clientY - y0) < 4)) return;
      const b = minEm(p.clientY);
      const ini = b < a ? Math.floor(b / PASSO_MIN) * PASSO_MIN : a;
      const fim = b < a ? a + PASSO_MIN : Math.max(a + PASSO_MIN, Math.ceil(b / PASSO_MIN) * PASSO_MIN);
      if (atual && atual.ini === ini && atual.fim === fim) return;
      atual = { dia, ini, fim };
      setSelecao(atual);
    };
    const soltar = (p: PointerEvent) => {
      if (p.pointerId !== e.pointerId) return;
      const s = atual;
      encerrar();
      if (!s) return;
      selecionou.current = true;
      window.setTimeout(() => (selecionou.current = false), 0);
      aoSelecionarHorario({ inicio: naHora(s.dia, s.ini), fim: naHora(s.dia, s.fim) });
    };
    const tecla = (k: globalThis.KeyboardEvent) => {
      if (k.key !== 'Escape' || !atual) return;
      k.preventDefault();
      // cancelado: o clique que vem ao soltar também não escolhe nada
      selecionou.current = true;
      window.setTimeout(() => (selecionou.current = false), 0);
      encerrar();
    };
    const encerrar = () => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', encerrar);
      window.removeEventListener('keydown', tecla, true);
      atual = null;
      setSelecao(null);
    };
    window.addEventListener('pointermove', mover);
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', encerrar);
    window.addEventListener('keydown', tecla, true);
  };
  const textoIntervalo = (dia: Date, ini: number, fim: number) => `${HORA.format(naHora(dia, ini))}–${HORA.format(naHora(dia, fim))}`;

  return (
    <div className={cx('lp-cal-horas', dias.length === 1 && 'lp-cal-horas--dia', selecao && 'is-selecionando')} style={estilo} role="grid" aria-label={rotulo} aria-readonly="true">
      <div className="lp-cal-horas-linha lp-cal-horas-cab" role="row">
        <div className="lp-cal-horas-canto" aria-hidden="true" />
        {dias.map((d) => (
          <div key={chave(d)} role="columnheader" className={cx('lp-cal-horas-dia', mesmoDia(d, hoje) && 'is-hoje')}>
            <button type="button" className="lp-cal-horas-dia-bt" onClick={() => aoClicarDia?.(d)} aria-label={DIA_LONGO.format(d)} aria-current={mesmoDia(d, hoje) ? 'date' : undefined}>
              <span className="lp-cal-horas-dia-nome">{CURTOS_DIA[d.getDay()]}</span>
              <span className="lp-cal-horas-dia-num">{d.getDate()}</span>
            </button>
          </div>
        ))}
      </div>
      {temDiaInteiro && (
        <div className="lp-cal-horas-linha lp-cal-horas-inteiro" role="row">
          <div className="lp-cal-horas-canto lp-cal-horas-rot">dia inteiro</div>
          {dias.map((d, i) => (
            <div key={chave(d)} role="gridcell" data-dia={chave(d)} className={cx('lp-cal-horas-inteiro-cel', alvoInteiro?.has(chave(d)) && 'is-alvo')}>
              {diaInteiro[i].map((ev) => chip(ev, false, d, true))}
              {rascunho?.diaInteiro && diasRascunho?.has(chave(d)) && chipRascunho(rascunho)}
            </div>
          ))}
        </div>
      )}
      <span id={idAjuda} className="lp-sr">
        Setas para cima e para baixo mudam o horário; para os lados, o dia.{aoSelecionarHorario ? ' Shift com setas para cima e para baixo muda o tamanho do intervalo.' : ''} Enter escolhe o horário.
      </span>
      <div className="lp-cal-horas-linha lp-cal-horas-corpo" role="row">
        <div className="lp-cal-horas-escala" aria-hidden="true">
          {horas.map((h) => (
            <span key={h} className="lp-cal-horas-marca">
              {String(h).padStart(2, '0')}:00
            </span>
          ))}
        </div>
        {dias.map((d, i) => {
          const itens = posicionar(mapa.get(chave(d)) ?? [], d).filter((it) => it.fim > minIni && it.ini < minFim);
          const eHoje = mesmoDia(d, hoje) && mesmoDia(d, agora);
          return (
            <div
              key={chave(d)}
              role="gridcell"
              data-col={chave(d)}
              aria-label={`${DIA_LONGO.format(d)}${itens.length ? `, ${itens.length} evento${itens.length > 1 ? 's' : ''}` : ''}`}
              className={cx('lp-cal-horas-col', mesmoDia(d, hoje) && 'is-hoje', (aoClicarHorario || aoSelecionarHorario) && 'is-clicavel')}
              onClick={(e) => clicarHorario(e, d)}
              onPointerDown={(e) => comecarSelecao(e, d)}
            >
              {itens.map((it) => {
                const movel = podeMover(it.ev);
                // a alça de esticar só aparece no dia em que o evento termina
                const terminaAqui = !it.ev.fim || it.ev.fim <= somaDias(d, 1);
                return (
                  <button
                    key={it.ev.id}
                    type="button"
                    data-ev={it.ev.id}
                    className={cx(
                      'lp-cal-bloco',
                      `lp-cal-evento--${it.ev.cor ?? 'pri'}`,
                      it.fim - it.ini < 45 && 'is-curto',
                      dias.length > 1 && it.cols >= 3 && 'is-estreito',
                      movel && 'is-movel',
                      arrasto?.ev.id === it.ev.id && 'is-origem',
                    )}
                    style={{
                      top: pct(it.ini),
                      height: `calc(${pct(it.fim)} - ${pct(it.ini)} - 0.125rem)`,
                      left: `calc(${(it.col / it.cols) * 100}% + 0.125rem)`,
                      width: `calc(${100 / it.cols}% - 0.25rem)`,
                    }}
                    onClick={() => aoClicarEvento?.(it.ev)}
                    onPointerDown={movel ? (e) => iniciarArrasto(e, it.ev, 'hora', d) : undefined}
                    onKeyDown={(e) => teclarEvento(e, it.ev, true)}
                    aria-keyshortcuts={movel ? ATALHOS_HORA : undefined}
                    title={`${it.ev.titulo} · ${textoHora(it.ev)}${it.ev.repete ? ' · repete' : ''}`}
                  >
                    <span className="lp-cal-bloco-titulo">
                      {it.ev.titulo}
                      {it.ev.repete && <SeRepete />}
                    </span>
                    <span className="lp-cal-bloco-hora">{textoHora(it.ev)}</span>
                    {movel && terminaAqui && (
                      <span className="lp-cal-bloco-alca" aria-hidden="true" onPointerDown={(e) => iniciarArrasto(e, it.ev, 'esticar', d)} />
                    )}
                  </button>
                );
              })}
              {evArrastado &&
                !evArrastado.diaInteiro &&
                posicionar([evArrastado], d)
                  .filter((it) => diasArrastado?.has(chave(d)) && it.fim > minIni && it.ini < minFim)
                  .map((it) => (
                    <div
                      key="fantasma"
                      className={cx('lp-cal-bloco', 'is-fantasma', `lp-cal-evento--${it.ev.cor ?? 'pri'}`, it.fim - it.ini < 45 && 'is-curto')}
                      style={{ top: pct(it.ini), height: `calc(${pct(it.fim)} - ${pct(it.ini)} - 0.125rem)` }}
                      aria-hidden="true"
                    >
                      <span className="lp-cal-bloco-titulo">{it.ev.titulo}</span>
                      <span className="lp-cal-bloco-hora">{textoHora(it.ev)}</span>
                    </div>
                  ))}
              {selecao && mesmoDia(selecao.dia, d) && (
                <div
                  className={cx('lp-cal-bloco', 'is-fantasma', 'is-selecao', selecao.fim - selecao.ini < 45 && 'is-curto')}
                  style={{ top: pct(selecao.ini), height: `calc(${pct(selecao.fim)} - ${pct(selecao.ini)} - 0.125rem)` }}
                  aria-hidden="true"
                >
                  <span className="lp-cal-bloco-hora">{textoIntervalo(d, selecao.ini, selecao.fim)}</span>
                </div>
              )}
              {rascunho &&
                !rascunho.diaInteiro &&
                diasRascunho?.has(chave(d)) &&
                posicionar([rascunho], d)
                  .filter((it) => it.fim > minIni && it.ini < minFim)
                  .map((it) => (
                    <div
                      key="rascunho"
                      className={cx('lp-cal-bloco', 'is-fantasma', 'is-rascunho', `lp-cal-evento--${it.ev.cor ?? 'pri'}`, it.fim - it.ini < 45 && 'is-curto')}
                      style={{ top: pct(it.ini), height: `calc(${pct(it.fim)} - ${pct(it.ini)} - 0.125rem)` }}
                      aria-hidden="true"
                    >
                      <span className="lp-cal-bloco-titulo">{it.ev.titulo}</span>
                      <span className="lp-cal-bloco-hora">{textoHora(it.ev)}</span>
                    </div>
                  ))}
              {i === dc && (
                <div
                  ref={cursorEl}
                  className="lp-cal-cursor"
                  style={{ top: pct(minIni + cursor.f * 30), height: `calc(${pct(minIni + (cursor.f + cursor.n) * 30)} - ${pct(minIni + cursor.f * 30)})` }}
                  tabIndex={0}
                  role="gridcell"
                  aria-label={cursorTexto}
                  aria-describedby={idAjuda}
                  onKeyDown={teclar}
                />
              )}
              {eHoje && agoraMin >= minIni && agoraMin <= minFim && (
                <div className="lp-cal-agora" style={{ top: pct(agoraMin) }} role="img" aria-label={`Agora, ${HORA.format(agora)}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
