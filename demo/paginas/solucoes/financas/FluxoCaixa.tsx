import { useState } from 'react';
import { Alerta, Card, Escolha, GraficoLinha, Indicador, Indicadores, Tabela, Valor, paraData, somarMoeda } from '../../../../src';
import { dia, type Lancamento } from './dados';
import { CabecalhoFinancas, dataBr, useMoeda } from './comum';
import { contasDo, doEspaco, efeito, saldoConta, useFinancas } from './estado';

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
        titulo="Fluxo de caixa"
        icone="chart-line"
        semPeriodo
        acoes={
          <Escolha<Horizonte>
            ariaLabel="Projetar"
            opcoes={[
              { valor: '30', rotulo: '30 dias' },
              { valor: '60', rotulo: '60 dias' },
              { valor: '90', rotulo: '90 dias' },
            ]}
            valor={horizonte}
            aoMudar={setHorizonte}
          />
        }
      >
        Saldo das contas com liquidez ({caixa.map((c) => c.nome).join(', ')}) nos últimos {PASSADO} dias e a projeção com o que falta pagar e receber.
      </CabecalhoFinancas>

      {menor.saldo < 0 && (
        <Alerta severidade="err" titulo={`O caixa fica negativo em ${dataBr(menor.dia)}`}>
          A projeção chega a {moeda(menor.saldo)}. Antecipe recebimentos, adie pagamentos ou resgate da reserva antes dessa data.
        </Alerta>
      )}

      <Indicadores>
        <Indicador rotulo="Saldo hoje" icone="wallet" cor="var(--graf-1)" valor={moeda(saldoHoje)} />
        <Indicador rotulo="Entradas previstas" icone="trending-up" cor="var(--ok-solid)" valor={moeda(entradas)} descricao={`Próximos ${futuro} dias`} />
        <Indicador rotulo="Saídas previstas" icone="trending-down" cor="var(--err-solid)" valor={moeda(saidas)} descricao={`Próximos ${futuro} dias`} />
        <Indicador
          rotulo="Menor saldo previsto"
          icone={menor.saldo < 0 ? 'circle-alert' : 'shield-check'}
          cor={menor.saldo < 0 ? 'var(--err-solid)' : 'var(--graf-3)'}
          valor={moeda(menor.saldo)}
          descricao={`Em ${dataBr(menor.dia)} · termina com ${moeda(final, { centavos: false })}`}
        />
      </Indicadores>

      <Card>
        <GraficoLinha
          titulo="Saldo diário: realizado e projetado"
          descricao={`Saldo de hoje ${moeda(saldoHoje)}; menor saldo previsto ${moeda(menor.saldo)} em ${dataBr(menor.dia)}`}
          dados={pontos}
          eixoX={{ chave: 'dia', tipo: 'data', rotulo: 'Dia' }}
          eixoY={{ formatar: (v) => moeda(v, { compacto: true }) }}
          series={[
            { chave: 'realizado', rotulo: 'Realizado', cor: 'var(--graf-1)' },
            { chave: 'projetado', rotulo: 'Projetado', cor: 'var(--graf-1)', tracejada: true },
          ]}
          faixas={[{ de: hoje, ate: dia(futuro), rotulo: 'Projeção' }]}
          referencias={menor.saldo < 0 ? [{ valor: 0, rotulo: 'Zero' }] : undefined}
          pontos={false}
          area
          altura={300}
        />
      </Card>

      <Card titulo="Semana a semana" corpoSemEspaco>
        <Tabela<Semana>
          rotulo="Projeção por semana"
          registros={semanas}
          colunas={[
            {
              campo: 'de',
              rotulo: 'Semana',
              destaque: true,
              formato: (_v, s) => `${CURTA.format(paraData(s.de))} a ${CURTA.format(paraData(s.ate))}`,
            },
            { campo: 'entradas', rotulo: 'Entradas', alinhamento: 'direita', render: (s) => <Valor valor={s.entradas} tipo={s.entradas ? 'receita' : 'neutro'} /> },
            { campo: 'saidas', rotulo: 'Saídas', alinhamento: 'direita', render: (s) => <Valor valor={s.saidas} tipo={s.saidas ? 'despesa' : 'neutro'} /> },
            { campo: 'saldo', rotulo: 'Saldo no fim', alinhamento: 'direita', render: (s) => <Valor valor={s.saldo} colorir={s.saldo < 0} forte /> },
          ]}
        />
      </Card>
    </div>
  );
}
