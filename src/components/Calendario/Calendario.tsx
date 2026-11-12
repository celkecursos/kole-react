import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Abas, Aba } from '../Abas/Abas';
import { Botao } from '../Botao/Botao';
import { Dialogo } from '../Dialogo/Dialogo';
import { Skeleton } from '../Skeleton/Skeleton';
import { Vazio } from '../Vazio/Vazio';
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
  className?: string;
}

const NOMES_DIA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const CURTOS_DIA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MES = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
const DIA_LONGO = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
const HORA = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

const meiaNoite = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const somaDias = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const mesmoDia = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const chave = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const primeiraMaiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** As 6 semanas (42 dias) que mostram o mês de `ref`, começando no `inicioSemana`. */
function gradeDoMes(ref: Date, inicioSemana: 0 | 1): Date[] {
  const primeiro = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const recuo = (primeiro.getDay() - inicioSemana + 7) % 7;
  const inicio = somaDias(primeiro, -recuo);
  return Array.from({ length: 42 }, (_, i) => somaDias(inicio, i));
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

const inicioDaSemana = (d: Date, inicioSemana: 0 | 1) => somaDias(d, -((d.getDay() - inicioSemana + 7) % 7));

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
    const passos: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    let alvo: Date | null = null;
    if (e.key in passos) alvo = somaDias(dia, passos[e.key]);
    else if (e.key === 'Home') alvo = somaDias(dia, -((dia.getDay() - inicioSemana + 7) % 7));
    else if (e.key === 'End') alvo = somaDias(dia, 6 - ((dia.getDay() - inicioSemana + 7) % 7));
    else if (e.key === 'PageUp' || e.key === 'PageDown') alvo = new Date(dia.getFullYear(), dia.getMonth() + (e.key === 'PageUp' ? -1 : 1), Math.min(dia.getDate(), 28));
    else if (e.key === 'Enter' || e.key === ' ') {
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
  const chip = (ev: EventoCalendario, completo = false) => (
    <button
      key={ev.id}
      type="button"
      className={cx('lp-cal-evento', `lp-cal-evento--${ev.cor ?? 'pri'}`, ev.diaInteiro && 'is-dia-inteiro', completo && 'is-completo')}
      onClick={(e) => {
        e.stopPropagation();
        if (completo) setDiaAberto(null);
        aoClicarEvento?.(ev);
      }}
      onKeyDown={(e) => e.stopPropagation()}
      title={`${ev.titulo} · ${textoHora(ev)}`}
    >
      {!ev.diaInteiro && <span className="lp-cal-evento-hora">{HORA.format(ev.inicio)}</span>}
      <span className="lp-cal-evento-tx">{ev.titulo}</span>
    </button>
  );

  // visão lista: dias do mês com evento, em ordem
  const diasLista = useMemo(() => {
    const ini = new Date(ref.getFullYear(), ref.getMonth(), 1);
    const fim = new Date(ref.getFullYear(), ref.getMonth() + 1, 1);
    const lista: Date[] = [];
    for (let d = ini; d < fim; d = somaDias(d, 1)) if (mapa.get(chave(d))?.length) lista.push(d);
    return lista;
  }, [mapa, ref]);

  return (
    <section className={cx('lp-cal', className)} aria-label={rotulo}>
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
          aoClicarEvento={aoClicarEvento}
          aoClicarHorario={aoClicarHorario}
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
                    className={cx('lp-cal-dia', fora && 'is-fora', eHoje && 'is-hoje', aoClicarDia && 'is-clicavel')}
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
                      {visiveis.map((ev) => chip(ev))}
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
                      <span className="lp-cal-lista-titulo">{ev.titulo}</span>
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

      <Dialogo aberto={!!diaAberto} aoFechar={() => setDiaAberto(null)} titulo={diaAberto ? primeiraMaiuscula(DIA_LONGO.format(diaAberto)) : ''} icone="calendar" tamanho="pequeno">
        <div className="lp-cal-dia-todos">{diaAberto && (mapa.get(chave(diaAberto)) ?? []).map((ev) => chip(ev, true))}</div>
      </Dialogo>
    </section>
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
  chip: (ev: EventoCalendario) => ReactNode;
  aoClicarDia?: (dia: Date) => void;
  aoClicarEvento?: (evento: EventoCalendario) => void;
  aoClicarHorario?: (dataHora: Date) => void;
  /** Sair pela borda com o teclado: semana (ou dia) anterior ou seguinte. */
  aoNavegar: (n: number) => void;
}

/** Semana ou dia: faixa de dia inteiro e, embaixo, os eventos posicionados pela hora. */
function GradeHorarios({ dias, mapa, hoje, agora, horaInicio, horaFim, rotulo, chip, aoClicarDia, aoClicarEvento, aoClicarHorario, aoNavegar }: GradeHorariosProps) {
  // cursor do teclado: um horário de 30 minutos (dia da coluna + faixa)
  const nFaixas = (horaFim - horaInicio) * 2;
  const indiceHoje = dias.findIndex((d) => mesmoDia(d, hoje));
  const [cursor, setCursor] = useState(() => ({
    d: Math.max(0, indiceHoje),
    f: Math.min(nFaixas - 1, Math.max(0, (agora.getHours() - horaInicio) * 2)),
  }));
  const cursorEl = useRef<HTMLDivElement>(null);
  const focarCursor = useRef(false);
  const dc = Math.min(cursor.d, dias.length - 1);
  useEffect(() => {
    if (!focarCursor.current) return;
    focarCursor.current = false;
    cursorEl.current?.focus();
  });
  const dataDoCursor = (c = { d: dc, f: cursor.f }) => {
    const dia = dias[c.d];
    const min = horaInicio * 60 + c.f * 30;
    return new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), Math.floor(min / 60), min % 60);
  };
  const eventosNoCursor = () => {
    const ini = horaInicio * 60 + cursor.f * 30;
    return posicionar(mapa.get(chave(dias[dc])) ?? [], dias[dc]).filter((it) => it.ini < ini + 30 && it.fim > ini);
  };
  const teclar = (e: KeyboardEvent<HTMLDivElement>) => {
    let { f } = cursor;
    let nd = dc;
    if (e.key === 'ArrowUp') f = Math.max(0, f - 1);
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
      if (aoClicarHorario) aoClicarHorario(dataDoCursor());
      else if (noHorario.length) aoClicarEvento?.(noHorario[0].ev);
      return;
    } else return;
    e.preventDefault();
    focarCursor.current = true;
    setCursor({ d: nd, f });
  };
  const cursorTexto = (() => {
    const dt = dataDoCursor();
    const n = eventosNoCursor();
    return `${DIA_LONGO.format(dt)}, ${HORA.format(dt)}${n.length ? `, ${n.map((it) => it.ev.titulo).join(', ')}` : ', livre'}`;
  })();
  const horas = Array.from({ length: horaFim - horaInicio }, (_, i) => horaInicio + i);
  const minIni = horaInicio * 60;
  const minFim = horaFim * 60;
  const total = minFim - minIni;
  const pct = (min: number) => `${((Math.min(Math.max(min, minIni), minFim) - minIni) / total) * 100}%`;
  const diaInteiro = dias.map((d) => (mapa.get(chave(d)) ?? []).filter((e) => e.diaInteiro));
  const temDiaInteiro = diaInteiro.some((l) => l.length > 0);
  const agoraMin = agora.getHours() * 60 + agora.getMinutes();
  const estilo = { '--cal-dias': dias.length } as CSSProperties;
  const idAjuda = `lp-cal-ajuda-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const clicarHorario = (e: MouseEvent<HTMLDivElement>, dia: Date) => {
    if (!aoClicarHorario || e.target !== e.currentTarget) return;
    const r = e.currentTarget.getBoundingClientRect();
    const min = minIni + Math.floor((((e.clientY - r.top) / r.height) * total) / 30) * 30;
    aoClicarHorario(new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), Math.floor(min / 60), min % 60));
  };

  return (
    <div className={cx('lp-cal-horas', dias.length === 1 && 'lp-cal-horas--dia')} style={estilo} role="grid" aria-label={rotulo} aria-readonly="true">
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
            <div key={chave(d)} role="gridcell" className="lp-cal-horas-inteiro-cel">
              {diaInteiro[i].map((ev) => chip(ev))}
            </div>
          ))}
        </div>
      )}
      <span id={idAjuda} className="lp-sr">
        Setas para cima e para baixo mudam o horário; para os lados, o dia. Enter escolhe o horário.
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
              aria-label={`${DIA_LONGO.format(d)}${itens.length ? `, ${itens.length} evento${itens.length > 1 ? 's' : ''}` : ''}`}
              className={cx('lp-cal-horas-col', mesmoDia(d, hoje) && 'is-hoje', aoClicarHorario && 'is-clicavel')}
              onClick={(e) => clicarHorario(e, d)}
            >
              {itens.map((it) => (
                <button
                  key={it.ev.id}
                  type="button"
                  className={cx('lp-cal-bloco', `lp-cal-evento--${it.ev.cor ?? 'pri'}`, it.fim - it.ini < 45 && 'is-curto', dias.length > 1 && it.cols >= 3 && 'is-estreito')}
                  style={{
                    top: pct(it.ini),
                    height: `calc(${pct(it.fim)} - ${pct(it.ini)} - 0.125rem)`,
                    left: `calc(${(it.col / it.cols) * 100}% + 0.125rem)`,
                    width: `calc(${100 / it.cols}% - 0.25rem)`,
                  }}
                  onClick={() => aoClicarEvento?.(it.ev)}
                  title={`${it.ev.titulo} · ${textoHora(it.ev)}`}
                >
                  <span className="lp-cal-bloco-titulo">{it.ev.titulo}</span>
                  <span className="lp-cal-bloco-hora">{textoHora(it.ev)}</span>
                </button>
              ))}
              {i === dc && (
                <div
                  ref={cursorEl}
                  className="lp-cal-cursor"
                  style={{ top: pct(minIni + cursor.f * 30), height: `calc(${pct(minIni + cursor.f * 30 + 30)} - ${pct(minIni + cursor.f * 30)})` }}
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
