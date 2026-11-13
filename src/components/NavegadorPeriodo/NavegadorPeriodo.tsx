import { useState } from 'react';
import type { Textos } from '../../i18n/pt-BR';
import { cx } from '../../utils/cx';
import { moverPeriodo, periodoDe, rotuloPeriodo, type Periodo, type TipoPeriodo } from '../../utils/periodo';
import { Botao, type BotaoProps } from '../Botao/Botao';
import { CampoData } from '../CampoTexto/CampoTexto';
import { MenuSuspenso } from '../MenuSuspenso/MenuSuspenso';
import './NavegadorPeriodo.css';
import { useIdioma, useTextos } from '../../i18n/contexto';
import { interpolar } from '../../i18n/idiomas';

export interface AtalhoPeriodo {
  rotulo: string;
  /** O período, ou uma função de "agora" (ex.: o mês passado). */
  periodo: Periodo | ((agora: Date) => Periodo);
}

export interface NavegadorPeriodoProps {
  valor: Periodo;
  aoMudar: (periodo: Periodo) => void;
  /** Atalhos do painel. Padrão: este mês, mês passado, este trimestre, este ano e ano passado. */
  atalhos?: AtalhoPeriodo[];
  /** Intervalo livre (de/até) no painel. Padrão `true`. */
  personalizado?: boolean;
  /** "Hoje" de referência (testes, fuso do servidor). */
  agora?: Date;
  /** Nome do grupo para leitor de tela. Padrão "Período". */
  rotulo?: string;
  tamanho?: BotaoProps['tamanho'];
  className?: string;
}

/** Atalhos padrão com os rótulos em pt-BR (sem `atalhos`, o componente usa os do idioma ativo). */
export const ATALHOS_PERIODO: AtalhoPeriodo[] = [
  { rotulo: 'Este mês', periodo: (a) => periodoDe('mes', a) },
  { rotulo: 'Mês passado', periodo: (a) => moverPeriodo(periodoDe('mes', a), -1) },
  { rotulo: 'Este trimestre', periodo: (a) => periodoDe('trimestre', a) },
  { rotulo: 'Este ano', periodo: (a) => periodoDe('ano', a) },
  { rotulo: 'Ano passado', periodo: (a) => moverPeriodo(periodoDe('ano', a), -1) },
];

function atalhosDoIdioma(t: Textos['periodo']): AtalhoPeriodo[] {
  const r = [t.esteMes, t.mesPassado, t.esteTrimestre, t.esteAno, t.anoPassado];
  return ATALHOS_PERIODO.map((a, i) => ({ ...a, rotulo: r[i] }));
}

const igual = (a: Periodo, b: Periodo) => a.tipo === b.tipo && a.de === b.de && a.ate === b.ate;

/**
 * "‹ novembro de 2026 ›": anda de mês em mês (ou trimestre, ano, intervalo)
 * pelas setas, e o rótulo abre os atalhos e o intervalo livre.
 */
export function NavegadorPeriodo({ valor, aoMudar, atalhos: atalhosProp, personalizado = true, agora, rotulo: rotuloProp, tamanho, className }: NavegadorPeriodoProps) {
  const tp = useTextos().periodo;
  const idioma = useIdioma();
  const rotulo = rotuloProp ?? tp.rotulo;
  const atalhos = atalhosProp ?? atalhosDoIdioma(tp);
  const hoje = agora ?? new Date();
  const tipo: TipoPeriodo = valor.tipo;
  const anterior = moverPeriodo(valor, -1);
  const proximo = moverPeriodo(valor, 1);
  const t = rotuloPeriodo(valor, { idioma });
  const texto = t[0].toUpperCase() + t.slice(1);

  return (
    <div className={cx('lp-periodo', className)} role="group" aria-label={rotulo}>
      <Botao
        icone="chevron-left"
        aparencia="contorno"
        severidade="secundario"
        tamanho={tamanho}
        aria-label={`${tp.anterior[tipo]}: ${rotuloPeriodo(anterior, { idioma })}`}
        dica={tp.anterior[tipo]}
        onClick={() => aoMudar(anterior)}
      />
      <MenuSuspenso
        rotulo={texto}
        icone="calendar"
        aparencia="contorno"
        severidade="secundario"
        tamanho={tamanho}
        semSeta
        alinhamento="centro"
        fechamento="fora"
        className="lp-periodo-menu"
        aria-label={interpolar(tp.escolher, { rotulo, periodo: texto })}
      >
        {(fechar) => (
          <PainelPeriodo
            valor={valor}
            atalhos={atalhos}
            personalizado={personalizado}
            agora={hoje}
            aoEscolher={(p) => {
              aoMudar(p);
              fechar();
            }}
          />
        )}
      </MenuSuspenso>
      <Botao
        icone="chevron-right"
        aparencia="contorno"
        severidade="secundario"
        tamanho={tamanho}
        aria-label={`${tp.proximo[tipo]}: ${rotuloPeriodo(proximo, { idioma })}`}
        dica={tp.proximo[tipo]}
        onClick={() => aoMudar(proximo)}
      />
    </div>
  );
}

function PainelPeriodo({
  valor,
  atalhos,
  personalizado,
  agora,
  aoEscolher,
}: {
  valor: Periodo;
  atalhos: AtalhoPeriodo[];
  personalizado: boolean;
  agora: Date;
  aoEscolher: (p: Periodo) => void;
}) {
  const tx = useTextos();
  const idioma = useIdioma();
  const [de, setDe] = useState(valor.de);
  const [ate, setAte] = useState(valor.ate);
  const invertido = !!de && !!ate && de > ate;
  const valido = !!de && !!ate && !invertido;

  return (
    <div className="lp-periodo-painel">
      <div className="lp-periodo-atalhos">
        {atalhos.map((a) => {
          const p = typeof a.periodo === 'function' ? a.periodo(agora) : a.periodo;
          const atual = igual(p, valor);
          return (
            <button key={a.rotulo} type="button" className={cx('lp-periodo-atalho', atual && 'is-atual')} aria-current={atual || undefined} onClick={() => aoEscolher(p)}>
              {a.rotulo}
              <span>{rotuloPeriodo(p, { curto: true, agora, idioma })}</span>
            </button>
          );
        })}
      </div>
      {personalizado && (
        <form
          className="lp-periodo-livre"
          onSubmit={(e) => {
            e.preventDefault();
            if (valido) aoEscolher({ tipo: 'personalizado', de, ate });
          }}
        >
          <strong>{tx.periodo.livre}</strong>
          <div className="lp-periodo-datas">
            <CampoData rotulo={tx.periodo.de} valor={de} aoMudar={setDe} max={ate || undefined} />
            <CampoData rotulo={tx.periodo.ate} valor={ate} aoMudar={setAte} min={de || undefined} erro={invertido ? tx.periodo.antesDoInicio : undefined} />
          </div>
          <Botao type="submit" rotulo={tx.comum.aplicar} tamanho="pequeno" disabled={!valido} />
        </form>
      )}
    </div>
  );
}

