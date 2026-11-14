import { useState } from 'react';
import { Alerta, Card, Escolha, GraficoLinha, Indicador, Indicadores, Tabela, Valor, paraData, somarMoeda } from '../../../../src';
import { dia, type Lancamento } from './dados';
import { CabecalhoFinancas, dataBr, useMoeda } from './comum';
import { contasDo, doEspaco, efeito, saldoConta, useFinancas } from './estado';
import { useT } from '../../../i18n/useT';

type Horizonte = '30' | '60' | '90';
const PASSADO = 30;
const CURTA = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });

interface Semana {
  id: string;
  de: string;
  ate: string;
  entradas: number;
  saidas: number;
  saldo: number;
}

export function FluxoCaixa() {
  const { t } = useT();
  const { espaco, lancamentos } = useFinancas();
  const moeda = useMoeda();
  const [horizonte, setHorizonte] = useState<Horizonte>('60');
  const futuro = Number(horizonte);
  const todos = doEspaco(lancamentos, espaco);
  // caixa = contas com liquidez (sem investimentos nem cartões: a fatura entra quando é paga)
  const caixa = contasDo(espaco).filter((c) => c.tipo !== 'cartao' && c.tipo !== 'investimento');
  const ids = new Set(caixa.map((c) => c.id));
  const mexe = (l: Lancamento) => somarMoeda(caixa.map((c) => efeito(l, c.id)));
  const toca = (l: Lancamento) => ids.has(l.conta) || (!!l.contaDestino && ids.has(l.contaDestino));
  const hoje = dia(0);

  const saldoHoje = somarMoeda(caixa.map((c) => saldoConta(c, todos)));
  // previstos: tudo o que está pendente; o atrasado conta como se saísse hoje
  const previstos = todos.filter((l) => !l.pago && toca(l) && l.data <= dia(futuro));
  const previstoNo = (d: string) => previstos.filter((l) => (l.data < hoje ? hoje : l.data) === d);

  const pontos: { dia: string; realizado: number | null; projetado: number | null }[] = [];
  for (let i = -PASSADO; i < 0; i++) pontos.push({ dia: dia(i), realizado: somarMoeda(caixa.map((c) => saldoConta(c, todos, dia(i)))), projetado: null });
  let acumulado = saldoHoje;
  const projecao: { dia: string; saldo: number }[] = [];
  for (let i = 0; i <= futuro; i++) {
    const d = dia(i);
    acumulado = somarMoeda([acumulado, ...previstoNo(d).map(mexe)]);
    projecao.push({ dia: d, saldo: acumulado });
    // hoje aparece nas duas linhas: uma continua a outra
    pontos.push({ dia: d, realizado: i === 0 ? saldoHoje : null, projetado: acumulado });
  }
  const entradas = somarMoeda(previstos.map(mexe).filter((v) => v > 0));
  const saidas = somarMoeda(previstos.map(mexe).filter((v) => v < 0).map((v) => -v));
  const menor = projecao.reduce((a, b) => (b.saldo < a.saldo ? b : a), projecao[0]);
  const final = projecao[projecao.length - 1].saldo;

  const semanas: Semana[] = [];
  for (let i = 0; i <= futuro; i += 7) {
    const de = dia(i);
    const ate = dia(Math.min(futuro, i + 6));
    const daSemana = previstos.filter((l) => {
      const d = l.data < hoje ? hoje : l.data;
      return d >= de && d <= ate;
    });
    const valores = daSemana.map(mexe);
    semanas.push({
      id: de,
      de,
      ate,
      entradas: somarMoeda(valores.filter((v) => v > 0)),
      saidas: somarMoeda(valores.filter((v) => v < 0).map((v) => -v)),
      saldo: projecao.find((p) => p.dia === ate)!.saldo,
    });
  }

  return (
    <div className="demo-pilha">
      <CabecalhoFinancas
        titulo={t('paginas.finFluxoCaixa.titulo')}
        icone="chart-line"
        semPeriodo
        acoes={
          <Escolha<Horizonte>
            ariaLabel="Projetar"
            opcoes={[
              { valor: '30', rotulo: t('paginas.finFluxoCaixa.textos.t30Dias') },
              { valor: '60', rotulo: t('paginas.finFluxoCaixa.textos.t60Dias') },
              { valor: '90', rotulo: t('paginas.finFluxoCaixa.textos.t90Dias') },
            ]}
            valor={horizonte}
            aoMudar={setHorizonte}
          />
        }
      >{t('paginas.finFluxoCaixa.textos.saldoDasContasCom')}{caixa.map((c) => c.nome).join(', ')}{t('paginas.finFluxoCaixa.textos.nosUltimosPassadoDias', { PASSADO })}</CabecalhoFinancas>

      {menor.saldo < 0 && (
        <Alerta severidade="err" titulo={t('paginas.finFluxoCaixa.textos.oCaixaFicaNegativo', { valor: dataBr(menor.dia) })}>{t('paginas.finFluxoCaixa.textos.aProjecaoChegaA')}{moeda(menor.saldo)}{t('paginas.finFluxoCaixa.textos.antecipeRecebimentosAdiePagamentos')}</Alerta>
      )}

      <Indicadores>
        <Indicador rotulo={t('paginas.finFluxoCaixa.textos.saldoHoje')} icone="wallet" cor="var(--graf-1)" valor={moeda(saldoHoje)} />
        <Indicador rotulo={t('paginas.finFluxoCaixa.textos.entradasPrevistas')} icone="trending-up" cor="var(--ok-solid)" valor={moeda(entradas)} descricao={t('paginas.finFluxoCaixa.textos.proximosFuturoDias', { futuro })} />
        <Indicador rotulo={t('paginas.finFluxoCaixa.textos.saidasPrevistas')} icone="trending-down" cor="var(--err-solid)" valor={moeda(saidas)} descricao={t('paginas.finFluxoCaixa.textos.proximosFuturoDias', { futuro })} />
        <Indicador
          rotulo={t('paginas.finFluxoCaixa.textos.menorSaldoPrevisto')}
          icone={menor.saldo < 0 ? 'circle-alert' : 'shield-check'}
          cor={menor.saldo < 0 ? 'var(--err-solid)' : 'var(--graf-3)'}
          valor={moeda(menor.saldo)}
          descricao={t('paginas.finFluxoCaixa.textos.emValorTerminaCom', { valor: dataBr(menor.dia), valor2: moeda(final, { centavos: false }) })}
        />
      </Indicadores>

      <Card>
        <GraficoLinha
          titulo={t('paginas.finFluxoCaixa.textos.saldoDiarioRealizadoE')}
          descricao={t('paginas.finFluxoCaixa.textos.saldoDeHojeValor', { valor: moeda(saldoHoje), valor2: moeda(menor.saldo), valor3: dataBr(menor.dia) })}
          dados={pontos}
          eixoX={{ chave: 'dia', tipo: 'data', rotulo: t('paginas.finFluxoCaixa.textos.dia') }}
          eixoY={{ formatar: (v) => moeda(v, { compacto: true }) }}
          series={[
            { chave: 'realizado', rotulo: t('paginas.finFluxoCaixa.textos.realizado'), cor: 'var(--graf-1)' },
            { chave: 'projetado', rotulo: t('paginas.finFluxoCaixa.textos.projetado'), cor: 'var(--graf-1)', tracejada: true },
          ]}
          faixas={[{ de: hoje, ate: dia(futuro), rotulo: t('paginas.finFluxoCaixa.textos.projecao') }]}
          referencias={menor.saldo < 0 ? [{ valor: 0, rotulo: t('paginas.finFluxoCaixa.textos.zero') }] : undefined}
          pontos={false}
          area
          altura={300}
        />
      </Card>

      <Card titulo={t('paginas.finFluxoCaixa.secoes.semanaASemana')} corpoSemEspaco>
        <Tabela<Semana>
          rotulo={t('paginas.finFluxoCaixa.textos.projecaoPorSemana')}
          registros={semanas}
          colunas={[
            {
              campo: 'de',
              rotulo: t('paginas.finFluxoCaixa.textos.semana'),
              destaque: true,
              formato: (_v, s) => `${CURTA.format(paraData(s.de))} a ${CURTA.format(paraData(s.ate))}`,
            },
            { campo: 'entradas', rotulo: t('paginas.finFluxoCaixa.textos.entradas'), alinhamento: 'direita', render: (s) => <Valor valor={s.entradas} tipo={s.entradas ? 'receita' : 'neutro'} /> },
            { campo: 'saidas', rotulo: t('paginas.finFluxoCaixa.textos.saidas'), alinhamento: 'direita', render: (s) => <Valor valor={s.saidas} tipo={s.saidas ? 'despesa' : 'neutro'} /> },
            { campo: 'saldo', rotulo: t('paginas.finFluxoCaixa.textos.saldoNoFim'), alinhamento: 'direita', render: (s) => <Valor valor={s.saldo} colorir={s.saldo < 0} forte /> },
          ]}
        />
      </Card>
    </div>
  );
}
