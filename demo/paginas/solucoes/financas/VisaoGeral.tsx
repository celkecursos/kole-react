import {
  AcaoLinha,
  Botao,
  Card,
  GraficoCombinado,
  GraficoRosca,
  Indicador,
  Indicadores,
  Progresso,
  SeloPrazo,
  Valor,
  Vazio,
  dataIso,
  formatarMoeda,
  formatarPercentual,
  mesesDoPeriodo,
  paraData,
  somarMoeda,
  useToast,
  variacaoPercentual,
} from '../../../../src';
import { dia, hoje, type Lancamento } from './dados';
import { CabecalhoFinancas, IconeCategoria, IconeConta, TIPO_CONTA, dataBr, useEditorLancamento, useMoeda } from './comum';
import {
  acoes,
  categoria,
  categoriasDo,
  contasDo,
  doEspaco,
  intervaloDeslocado,
  noIntervalo,
  orcamentoDe,
  porCategoria,
  saldoConta,
  totais,
  useFinancas,
  vencePorSi,
} from './estado';
import { ROTAS } from './rotas';

const MES_CURTO = new Intl.DateTimeFormat('pt-BR', { month: 'short' });

/** Fim de cada um dos `n` meses até o mês de `ate` (o mês corrente para em hoje). */
function fimDosMeses(ate: string, n: number): string[] {
  const d = paraData(ate);
  const hojeIso = dia(0);
  return Array.from({ length: n }, (_, i) => {
    const fim = dataIso(new Date(d.getFullYear(), d.getMonth() - (n - 1 - i) + 1, 0));
    return fim > hojeIso ? hojeIso : fim;
  });
}

export function VisaoGeral({ navegar }: { navegar: (r: string) => void }) {
  const { espaco, periodo, lancamentos, orcamentos } = useFinancas();
  const moeda = useMoeda();
  const toast = useToast();
  const abrir = useEditorLancamento();
  const empresa = espaco === 'empresa';

  const todos = doEspaco(lancamentos, espaco);
  const doPeriodo = noIntervalo(todos, periodo);
  const meses = mesesDoPeriodo(periodo).length;
  const t = totais(doPeriodo);
  const ta = totais(noIntervalo(todos, intervaloDeslocado(periodo, -meses)));

  const contas = contasDo(espaco);
  const bancarias = contas.filter((c) => c.tipo !== 'cartao');
  const saldoEm = (ate: string) => somarMoeda(bancarias.map((c) => saldoConta(c, todos, ate)));
  const saldoTotal = saldoEm(dia(0));
  const fins = fimDosMeses(dia(0), 6);

  // os 6 meses que terminam no fim do período
  const ultimos = Array.from({ length: 6 }, (_, i) => {
    const fim = paraData(periodo.ate);
    const ini = new Date(fim.getFullYear(), fim.getMonth() - 5 + i, 1);
    return { de: dataIso(ini), ate: dataIso(new Date(ini.getFullYear(), ini.getMonth() + 1, 0)) };
  });
  const serie = ultimos.map((m) => {
    const x = totais(noIntervalo(todos, m));
    return { mes: m.de.slice(0, 7), receitas: x.receitas, despesas: x.despesas, resultado: x.saldo };
  });

  const despesasCat = porCategoria(doPeriodo, 'despesa');
  const pendentes = todos
    .filter((l) => !l.pago && vencePorSi(l) && l.data <= dia(15))
    .sort((a, b) => (a.data < b.data ? -1 : 1))
    .slice(0, 6);
  const orcadas = categoriasDo(espaco, 'despesa')
    .filter((c) => orcamentoDe(c, orcamentos) > 0)
    .map((c) => {
      const gasto = somarMoeda(doPeriodo.filter((l) => l.tipo === 'despesa' && l.categoria === c.id).map((l) => l.valor));
      const limite = orcamentoDe(c, orcamentos) * meses;
      return { c, gasto, limite, parte: gasto / limite };
    })
    .sort((a, b) => b.parte - a.parte)
    .slice(0, 5);

  const margem = t.receitas ? (t.saldo / t.receitas) * 100 : 0;
  const varRec = variacaoPercentual(t.receitas, ta.receitas);
  const varDesp = variacaoPercentual(t.despesas, ta.despesas);
  const eixoMoeda = { formatar: (v: number) => moeda(v, { compacto: true }) };

  const abrirCategoria = (id: string) => {
    acoes.pedirFiltro({ categoria: id });
    navegar(ROTAS.lancamentos);
  };
  const pagar = (l: Lancamento) => {
    acoes.marcarPago([l.id]);
    toast.ok(l.tipo === 'receita' ? 'Recebimento registrado' : 'Pagamento registrado', `${l.descricao} · ${formatarMoeda(l.valor)}`);
  };

  return (
    <div className="demo-pilha">
      <CabecalhoFinancas titulo="Visão geral" icone="house" />

      <Indicadores>
        <Indicador
          rotulo="Saldo em contas"
          icone="landmark"
          cor="var(--graf-1)"
          valor={moeda(saldoTotal)}
          tendencia={fins.map(saldoEm)}
          descricao={`Hoje, somando ${bancarias.length} contas`}
          aoClicar={() => navegar(ROTAS.contas)}
        />
        <Indicador rotulo={empresa ? 'Faturamento' : 'Receitas'} icone="trending-up" cor="var(--ok-solid)" valor={moeda(t.receitas)} variacao={varRec ?? undefined} descricao="Comparado ao período anterior" />
        <Indicador rotulo="Despesas" icone="trending-down" cor="var(--err-solid)" valor={moeda(t.despesas)} variacao={varDesp ?? undefined} variacaoBoa="baixa" descricao="Comparado ao período anterior" />
        <Indicador
          rotulo={empresa ? 'Resultado' : 'Economia'}
          icone={empresa ? 'chart-column' : 'piggy-bank'}
          cor={t.saldo >= 0 ? 'var(--graf-3)' : 'var(--err-solid)'}
          valor={moeda(t.saldo, { sinal: true })}
          descricao={t.receitas ? `${formatarPercentual(margem)} ${empresa ? 'de margem' : 'das receitas'}` : 'Sem receitas no período'}
        />
      </Indicadores>

      <div className="fin-grade fin-grade--graficos">
        <Card>
          <GraficoCombinado
            titulo="Entradas e saídas nos últimos 6 meses"
            descricao={`Receitas, despesas e resultado de cada mês até ${MES_CURTO.format(paraData(periodo.ate))}`}
            dados={serie}
            eixoX={{ chave: 'mes', tipo: 'data', rotulo: 'Mês' }}
            eixoY={eixoMoeda}
            barras={[
              { chave: 'receitas', rotulo: 'Receitas', cor: 'var(--graf-pos)' },
              { chave: 'despesas', rotulo: 'Despesas', cor: 'var(--graf-neg)' },
            ]}
            linhas={[{ chave: 'resultado', rotulo: 'Resultado', cor: 'var(--graf-1)', eixo: 'esquerdo' }]}
            altura={260}
          />
        </Card>
        <Card>
          <GraficoRosca
            titulo="Despesas por categoria"
            descricao="Clique numa fatia para ver os lançamentos"
            dados={despesasCat.map((d) => ({ rotulo: d.categoria.nome, valor: d.valor, cor: d.categoria.cor, id: d.categoria.id }))}
            chaveRotulo="rotulo"
            chaveValor="valor"
            chaveCor="cor"
            maxFatias={7}
            formatar={(v) => moeda(v)}
            centro={{ rotulo: 'Total gasto', valor: moeda(t.despesas) }}
            aoEscolher={(d) => abrirCategoria(d.id as string)}
            textoVazio="Nenhuma despesa no período."
            posicaoLegenda="abaixo"
            altura={210}
          />
        </Card>
      </div>

      <div className="fin-grade fin-grade--2">
        <Card
          titulo="Próximos vencimentos"
          subtitulo="Atrasados e dos próximos 15 dias"
          corpoSemEspaco
          rodape={<Botao rotulo="Ver contas a pagar e receber" aparencia="texto" icone="arrow-right" posicaoIcone="direita" onClick={() => navegar(ROTAS.pagarReceber)} />}
        >
          {pendentes.length === 0 ? (
            <Vazio titulo="Tudo em dia" descricao="Nada vence nos próximos 15 dias." icone="circle-check" />
          ) : (
            <ul className="fin-linhas">
              {pendentes.map((l) => (
                <li key={l.id} className="fin-linha">
                  <IconeCategoria categoria={categoria(l.categoria)} transferencia={l.tipo === 'transferencia'} />
                  <button type="button" className="fin-linha-texto" onClick={() => abrir(l)}>
                    <strong>{l.descricao}</strong>
                    <SeloPrazo vencimento={l.data} agora={hoje()} emBreve={3} />
                  </button>
                  <Valor valor={l.valor} tipo={l.tipo === 'transferencia' ? 'despesa' : l.tipo} forte />
                  <AcaoLinha icone="check" rotulo={l.tipo === 'receita' ? 'Marcar como recebido' : 'Marcar como pago'} severidade="pri" onClick={() => pagar(l)} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          titulo="Contas"
          subtitulo="Saldo hoje"
          corpoSemEspaco
          rodape={
            <div className="fin-rodape-total">
              <span>Total disponível</span>
              <Valor valor={saldoTotal} forte />
            </div>
          }
        >
          <ul className="fin-linhas">
            {contas.map((c) => {
              const saldo = saldoConta(c, todos);
              return (
                <li key={c.id} className="fin-linha">
                  <IconeConta conta={c} />
                  <button
                    type="button"
                    className="fin-linha-texto"
                    onClick={() => {
                      acoes.pedirFiltro({ conta: c.id });
                      navegar(ROTAS.lancamentos);
                    }}
                  >
                    <strong>{c.nome}</strong>
                    <small>
                      {c.instituicao} · {TIPO_CONTA[c.tipo]}
                    </small>
                  </button>
                  {c.tipo === 'cartao' ? (
                    <span className="fin-linha-valor">
                      <small>Fatura</small>
                      <Valor valor={Math.max(0, -saldo)} forte />
                    </span>
                  ) : (
                    <Valor valor={saldo} colorir={saldo < 0} forte />
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        <Card
          titulo={meses === 1 ? 'Orçamento do mês' : 'Orçamento do período'}
          subtitulo="As categorias mais perto do limite"
          rodape={<Botao rotulo="Ver orçamento" aparencia="texto" icone="arrow-right" posicaoIcone="direita" onClick={() => navegar(ROTAS.orcamento)} />}
        >
          <div className="fin-orc-lista">
            {orcadas.map(({ c, gasto, limite, parte }) => (
              <div key={c.id} className="fin-orc-item">
                <div className="fin-orc-topo">
                  <IconeCategoria categoria={c} tamanho="pequeno" />
                  <span>{c.nome}</span>
                  <small>
                    <Valor valor={gasto} /> de <Valor valor={limite} centavos={false} />
                  </small>
                </div>
                <Progresso valor={Math.min(100, parte * 100)} altura="sm" cor={parte > 1 ? 'err' : parte > 0.85 ? 'warn' : 'ok'} rotulo={`${c.nome}: ${formatarPercentual(parte * 100, { casas: 0 })} do orçamento`} />
              </div>
            ))}
          </div>
        </Card>

        <Card
          titulo="Últimos lançamentos"
          corpoSemEspaco
          rodape={<Botao rotulo="Ver todos" aparencia="texto" icone="arrow-right" posicaoIcone="direita" onClick={() => navegar(ROTAS.lancamentos)} />}
        >
          <ul className="fin-linhas">
            {todos
              .filter((l) => l.pago && l.data <= dia(0))
              .slice(-6)
              .reverse()
              .map((l) => (
                <li key={l.id} className="fin-linha">
                  <IconeCategoria categoria={categoria(l.categoria)} transferencia={l.tipo === 'transferencia'} />
                  <button type="button" className="fin-linha-texto" onClick={() => abrir(l)}>
                    <strong>{l.descricao}</strong>
                    <small>
                      {dataBr(l.data)} · {l.tipo === 'transferencia' ? 'Transferência' : categoria(l.categoria)?.nome}
                    </small>
                  </button>
                  <Valor valor={l.valor} tipo={l.tipo === 'transferencia' ? 'neutro' : l.tipo} forte />
                </li>
              ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
