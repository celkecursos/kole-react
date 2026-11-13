import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../utils/cx';
import { Botao } from '../Botao/Botao';
import { DIA_LONGO, MES, NOMES_DIA, chave, diaPelaTecla, gradeDoMes, meiaNoite, mesmoDia, primeiraMaiuscula } from './datasCalendario';
import './MiniCalendario.css';

const LETRA_DIA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export interface MiniCalendarioProps {
  /** Dia escolhido (destacado). */
  valor?: Date | null;
  aoEscolher?: (dia: Date) => void;
  /** Dias com bolinha (ex.: os que têm evento). */
  marcados?: Date[];
  /** Faixa destacada, com `fim` exclusivo (ex.: o `PeriodoCalendario` da semana visível no `Calendario`). */
  destaque?: { inicio: Date; fim: Date } | null;
  /** Primeiro dia da semana: `0` = domingo (padrão), `1` = segunda. */
  inicioSemana?: 0 | 1;
  /** O mês mostrado mudou (setas ou teclado): o app pode buscar os `marcados` dele. */
  aoMudarMes?: (mes: Date) => void;
  /** "Hoje" do calendário (para testes). Padrão: a data atual. */
  hoje?: Date;
  /** Nome para leitor de tela. Padrão: "Escolher dia". */
  rotulo?: string;
  className?: string;
}

/**
 * Calendário pequeno de um mês, para a coluna lateral de uma agenda: escolhe o dia
 * (setas, Home/End, Page Up/Down e Enter também valem) e mostra os dias com evento.
 * Vai sozinho para o mês do `valor` quando ele muda.
 */
export function MiniCalendario({
  valor,
  aoEscolher,
  marcados = [],
  destaque,
  inicioSemana = 0,
  aoMudarMes,
  hoje: hojeProp,
  rotulo = 'Escolher dia',
  className,
}: MiniCalendarioProps) {
  const hoje = meiaNoite(hojeProp ?? new Date());
  const inicial = meiaNoite(valor ?? hoje);
  const [mes, setMes] = useState(() => new Date(inicial.getFullYear(), inicial.getMonth(), 1));
  const [foco, setFoco] = useState(inicial);
  const grade = useRef<HTMLDivElement>(null);
  const peloTeclado = useRef(false);

  const valorMs = valor ? meiaNoite(valor).getTime() : null;
  useEffect(() => {
    if (valorMs == null) return;
    const v = new Date(valorMs);
    setFoco(v);
    setMes((m) => (m.getMonth() === v.getMonth() && m.getFullYear() === v.getFullYear() ? m : new Date(v.getFullYear(), v.getMonth(), 1)));
  }, [valorMs]);

  const avisoMes = useRef(aoMudarMes);
  avisoMes.current = aoMudarMes;
  const primeiraVez = useRef(true);
  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false;
      return;
    }
    avisoMes.current?.(mes);
  }, [mes.getTime()]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!peloTeclado.current) return;
    peloTeclado.current = false;
    grade.current?.querySelector<HTMLElement>(`[data-dia="${chave(foco)}"]`)?.focus();
  }, [foco, mes]);

  const dias = useMemo(() => gradeDoMes(mes, inicioSemana), [mes, inicioSemana]);
  const comEvento = useMemo(() => new Set(marcados.map(chave)), [marcados]);
  const ini = destaque ? meiaNoite(destaque.inicio) : null;
  const fim = destaque ? destaque.fim : null;
  // o dia focável fica sempre no mês mostrado
  const focoNoMes = foco.getMonth() === mes.getMonth() && foco.getFullYear() === mes.getFullYear() ? foco : new Date(mes.getFullYear(), mes.getMonth(), 1);

  const irMes = (n: number) => {
    const novo = new Date(mes.getFullYear(), mes.getMonth() + n, 1);
    setMes(novo);
    setFoco(novo);
  };
  const escolher = (dia: Date) => {
    setFoco(dia);
    if (dia.getMonth() !== mes.getMonth()) setMes(new Date(dia.getFullYear(), dia.getMonth(), 1));
    aoEscolher?.(dia);
  };
  const teclar = (e: KeyboardEvent, dia: Date) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      escolher(dia);
      return;
    }
    const alvo = diaPelaTecla(e.key, dia, inicioSemana);
    if (!alvo) return;
    e.preventDefault();
    peloTeclado.current = true;
    setFoco(alvo);
    if (alvo.getMonth() !== mes.getMonth() || alvo.getFullYear() !== mes.getFullYear()) setMes(new Date(alvo.getFullYear(), alvo.getMonth(), 1));
  };

  const titulo = primeiraMaiuscula(MES.format(mes));
  const cabecalhos = Array.from({ length: 7 }, (_, i) => (i + inicioSemana) % 7);

  return (
    <div className={cx('lp-minical', className)} role="group" aria-label={rotulo}>
      <div className="lp-minical-topo">
        <span className="lp-minical-titulo" aria-live="polite">
          {titulo}
        </span>
        <Botao icone="chevron-left" aria-label="Mês anterior" dica="Mês anterior" severidade="secundario" aparencia="texto" tamanho="pequeno" onClick={() => irMes(-1)} />
        <Botao icone="chevron-right" aria-label="Próximo mês" dica="Próximo mês" severidade="secundario" aparencia="texto" tamanho="pequeno" onClick={() => irMes(1)} />
      </div>
      <div ref={grade} className="lp-minical-grade" role="grid" aria-label={titulo}>
        <div className="lp-minical-linha" role="row">
          {cabecalhos.map((d) => (
            <span key={d} className="lp-minical-cab" role="columnheader" aria-label={NOMES_DIA[d]}>
              {LETRA_DIA[d]}
            </span>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, s) => (
          <div key={s} className="lp-minical-linha" role="row">
            {dias.slice(s * 7, s * 7 + 7).map((dia) => {
              const escolhido = !!valor && mesmoDia(dia, valor);
              const naFaixa = !!ini && !!fim && dia >= ini && dia < fim;
              const temEvento = comEvento.has(chave(dia));
              return (
                <div
                  key={chave(dia)}
                  data-dia={chave(dia)}
                  role="gridcell"
                  tabIndex={mesmoDia(dia, focoNoMes) ? 0 : -1}
                  aria-selected={escolhido}
                  aria-current={mesmoDia(dia, hoje) ? 'date' : undefined}
                  aria-label={`${DIA_LONGO.format(dia)}${temEvento ? ', com eventos' : ''}`}
                  className={cx(
                    'lp-minical-dia',
                    dia.getMonth() !== mes.getMonth() && 'is-fora',
                    mesmoDia(dia, hoje) && 'is-hoje',
                    escolhido && 'is-escolhido',
                    naFaixa && 'is-faixa',
                    naFaixa && ini && mesmoDia(dia, ini) && 'is-faixa-ini',
                    naFaixa && fim && dia.getTime() === new Date(fim.getFullYear(), fim.getMonth(), fim.getDate() - 1).getTime() && 'is-faixa-fim',
                    temEvento && 'is-marcado',
                  )}
                  onClick={() => escolher(dia)}
                  onKeyDown={(e) => teclar(e, dia)}
                >
                  <span className="lp-minical-num" aria-hidden="true">
                    {dia.getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
