import { useState } from 'react';
import { cx } from '../../utils/cx';
import { moverPeriodo, periodoDe, rotuloPeriodo, type Periodo, type TipoPeriodo } from '../../utils/periodo';
import { Botao, type BotaoProps } from '../Botao/Botao';
import { CampoData } from '../CampoTexto/CampoTexto';
import { MenuSuspenso } from '../MenuSuspenso/MenuSuspenso';
import './NavegadorPeriodo.css';

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

const NOME: Record<TipoPeriodo, string> = { mes: 'mês', trimestre: 'trimestre', ano: 'ano', personalizado: 'período' };

export const ATALHOS_PERIODO: AtalhoPeriodo[] = [
  { rotulo: 'Este mês', periodo: (a) => periodoDe('mes', a) },
  { rotulo: 'Mês passado', periodo: (a) => moverPeriodo(periodoDe('mes', a), -1) },
  { rotulo: 'Este trimestre', periodo: (a) => periodoDe('trimestre', a) },
  { rotulo: 'Este ano', periodo: (a) => periodoDe('ano', a) },
  { rotulo: 'Ano passado', periodo: (a) => moverPeriodo(periodoDe('ano', a), -1) },
];

const igual = (a: Periodo, b: Periodo) => a.tipo === b.tipo && a.de === b.de && a.ate === b.ate;

/**
 * "‹ novembro de 2026 ›": anda de mês em mês (ou trimestre, ano, intervalo)
 * pelas setas, e o rótulo abre os atalhos e o intervalo livre.
 */
export function NavegadorPeriodo({ valor, aoMudar, atalhos = ATALHOS_PERIODO, personalizado = true, agora, rotulo = 'Período', tamanho, className }: NavegadorPeriodoProps) {
  const hoje = agora ?? new Date();
  const nome = NOME[valor.tipo];
  const anterior = moverPeriodo(valor, -1);
  const proximo = moverPeriodo(valor, 1);
  const t = rotuloPeriodo(valor);
  const texto = t[0].toUpperCase() + t.slice(1);

  return (
    <div className={cx('lp-periodo', className)} role="group" aria-label={rotulo}>
      <Botao
        icone="chevron-left"
        aparencia="contorno"
        severidade="secundario"
        tamanho={tamanho}
        aria-label={`${nome[0].toUpperCase()}${nome.slice(1)} anterior: ${rotuloPeriodo(anterior)}`}
        dica={`${nome[0].toUpperCase()}${nome.slice(1)} anterior`}
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
        aria-label={`${rotulo}: ${texto}. Escolher outro período`}
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
        aria-label={`Próximo ${nome}: ${rotuloPeriodo(proximo)}`}
        dica={`Próximo ${nome}`}
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
              <span>{rotuloPeriodo(p, { curto: true, agora })}</span>
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
          <strong>Personalizado</strong>
          <div className="lp-periodo-datas">
            <CampoData rotulo="De" valor={de} aoMudar={setDe} max={ate || undefined} />
            <CampoData rotulo="Até" valor={ate} aoMudar={setAte} min={de || undefined} erro={invertido ? 'Antes do início' : undefined} />
          </div>
          <Botao type="submit" rotulo="Aplicar" tamanho="pequeno" disabled={!valido} />
        </form>
      )}
    </div>
  );
}

