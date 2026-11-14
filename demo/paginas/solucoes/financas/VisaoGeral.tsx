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
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

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
  const { t, idioma } = useT();
  const { espaco, periodo, lancamentos, orcamentos } = useFinancas();
  const moeda = useMoeda();
  const toast = useToast();
  const abrir = useEditorLancamento();
  const empresa = espaco === 'empresa';

  const todos = doEspaco(lancamentos, espaco);
  const doPeriodo = noIntervalo(todos, periodo);
  const meses = mesesDoPeriodo(periodo).length;
  const soma = totais(doPeriodo);
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

  const margem = soma.receitas ? (soma.saldo / soma.receitas) * 100 : 0;
  const varRec = variacaoPercentual(soma.receitas, ta.receitas);
  const varDesp = variacaoPercentual(soma.despesas, ta.despesas);
  const eixoMoeda = { formatar: (v: number) => moeda(v, { compacto: true }) };

  const abrirCategoria = (id: string) => {
    acoes.pedirFiltro({ categoria: id });
    navegar(ROTAS.lancamentos);
  };
  const pagar = (l: Lancamento) => {
    acoes.marcarPago([l.id]);
    toast.ok(l.tipo === 'receita' ? t('paginas.finVisaoGeral.textos.recebimentoRegistrado') : t('paginas.finVisaoGeral.textos.pagamentoRegistrado'), `${l.descricao} · ${formatarMoeda(l.valor, { idioma })}`);
  };

  return (
    <div className="demo-pilha">
      <CabecalhoFinancas titulo={t('paginas.finVisaoGeral.titulo')} icone="house" />

      <Indicadores>
        <Indicador
          rotulo={t('paginas.finVisaoGeral.textos.saldoEmContas')}
          icone="landmark"
          cor="var(--graf-1)"
          valor={moeda(saldoTotal)}
          tendencia={fins.map(saldoEm)}
          descricao={t('paginas.finVisaoGeral.textos.hojeSomandoNContas', { n: bancarias.length })}
          aoClicar={() => navegar(ROTAS.contas)}
        />
        <Indicador rotulo={empresa ? t('paginas.finVisaoGeral.textos.faturamento') : t('paginas.finVisaoGeral.textos.receitas')} icone="trending-up" cor="var(--ok-solid)" valor={moeda(soma.receitas)} variacao={varRec ?? undefined} descricao={t('paginas.finVisaoGeral.textos.comparadoAoPeriodoAnterior')} />
        <Indicador rotulo={t('paginas.finVisaoGeral.textos.despesas')} icone="trending-down" cor="var(--err-solid)" valor={moeda(soma.despesas)} variacao={varDesp ?? undefined} variacaoBoa="baixa" descricao={t('paginas.finVisaoGeral.textos.comparadoAoPeriodoAnterior')} />
        <Indicador
          rotulo={empresa ? t('paginas.finVisaoGeral.textos.resultado') : t('paginas.finVisaoGeral.textos.economia')}
          icone={empresa ? 'chart-column' : 'piggy-bank'}
          cor={soma.saldo >= 0 ? 'var(--graf-3)' : 'var(--err-solid)'}
          valor={moeda(soma.saldo, { sinal: true })}
          descricao={soma.receitas ? `${formatarPercentual(margem, { idioma })} ${empresa ? 'de margem' : 'das receitas'}` : t('paginas.finVisaoGeral.textos.semReceitasNoPeriodo')}
        />
      </Indicadores>

      <div className="fin-grade fin-grade--graficos">
        <Card>
          <GraficoCombinado
            titulo={t('paginas.finVisaoGeral.textos.entradasESaidasNos')}
            descricao={t('paginas.finVisaoGeral.textos.receitasDespesasEResultado', { valor: MES_CURTO.format(paraData(periodo.ate)) })}
            dados={serie}
            eixoX={{ chave: 'mes', tipo: 'data', rotulo: t('paginas.finVisaoGeral.textos.mes') }}
            eixoY={eixoMoeda}
            barras={[
              { chave: 'receitas', rotulo: t('paginas.finVisaoGeral.textos.receitas'), cor: 'var(--graf-pos)' },
              { chave: 'despesas', rotulo: t('paginas.finVisaoGeral.textos.despesas'), cor: 'var(--graf-neg)' },
            ]}
            linhas={[{ chave: 'resultado', rotulo: t('paginas.finVisaoGeral.textos.resultado'), cor: 'var(--graf-1)', eixo: 'esquerdo' }]}
            altura={260}
          />
        </Card>
        <Card>
          <GraficoRosca
            titulo={t('paginas.finVisaoGeral.textos.despesasPorCategoria')}
            descricao={t('paginas.finVisaoGeral.textos.cliqueNumaFatiaPara')}
            dados={despesasCat.map((d) => ({ rotulo: d.categoria.nome, valor: d.valor, cor: d.categoria.cor, id: d.categoria.id }))}
            chaveRotulo="rotulo"
            chaveValor="valor"
            chaveCor="cor"
            maxFatias={7}
            formatar={(v) => moeda(v)}
            centro={{ rotulo: t('paginas.finVisaoGeral.textos.totalGasto'), valor: moeda(soma.despesas) }}
            aoEscolher={(d) => abrirCategoria(d.id as string)}
            textoVazio={t('paginas.finVisaoGeral.textos.nenhumaDespesaNoPeriodo')}
            posicaoLegenda="abaixo"
            altura={210}
          />
        </Card>
      </div>

      <div className="fin-grade fin-grade--2">
        <Card
          titulo={t('paginas.finVisaoGeral.secoes.proximosVencimentos')}
          subtitulo={t('paginas.finVisaoGeral.textos.atrasadosEDosProximos')}
          corpoSemEspaco
          rodape={<Botao rotulo={t('paginas.finVisaoGeral.textos.verContasAPagar')} aparencia="texto" icone="arrow-right" posicaoIcone="direita" onClick={() => navegar(ROTAS.pagarReceber)} />}
        >
          {pendentes.length === 0 ? (
            <Vazio titulo={t('paginas.finVisaoGeral.textos.tudoEmDia')} descricao={t('paginas.finVisaoGeral.textos.nadaVenceNosProximos')} icone="circle-check" />
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
                  <AcaoLinha icone="check" rotulo={l.tipo === 'receita' ? t('paginas.finVisaoGeral.textos.marcarComoRecebido') : t('paginas.finVisaoGeral.textos.marcarComoPago')} severidade="pri" onClick={() => pagar(l)} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          titulo={t('paginas.finVisaoGeral.secoes.contas')}
          subtitulo={t('paginas.finVisaoGeral.textos.saldoHoje')}
          corpoSemEspaco
          rodape={
            <div className="fin-rodape-total">
              <span>{t('paginas.finVisaoGeral.textos.totalDisponivel')}</span>
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
                    <span className="fin-linha-valor">{rico(t('paginas.finVisaoGeral.textos.fatura'))}<Valor valor={Math.max(0, -saldo)} forte />
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
          titulo={meses === 1 ? t('paginas.finVisaoGeral.secoes.orcamentoMes') : t('paginas.finVisaoGeral.secoes.orcamentoPeriodo')}
          subtitulo={t('paginas.finVisaoGeral.textos.asCategoriasMaisPerto')}
          rodape={<Botao rotulo={t('paginas.finVisaoGeral.textos.verOrcamento')} aparencia="texto" icone="arrow-right" posicaoIcone="direita" onClick={() => navegar(ROTAS.orcamento)} />}
        >
          <div className="fin-orc-lista">
            {orcadas.map(({ c, gasto, limite, parte }) => (
              <div key={c.id} className="fin-orc-item">
                <div className="fin-orc-topo">
                  <IconeCategoria categoria={c} tamanho="pequeno" />
                  <span>{c.nome}</span>
                  <small>
                    <Valor valor={gasto} />{t('paginas.finVisaoGeral.textos.de')}<Valor valor={limite} centavos={false} />
                  </small>
                </div>
                <Progresso valor={Math.min(100, parte * 100)} altura="sm" cor={parte > 1 ? 'err' : parte > 0.85 ? 'warn' : 'ok'} rotulo={t('paginas.finVisaoGeral.textos.nomeValorDoOrcamento', { nome: c.nome, valor: formatarPercentual(parte * 100, { casas: 0 , idioma }) })} />
              </div>
            ))}
          </div>
        </Card>

        <Card
          titulo={t('paginas.finVisaoGeral.secoes.ultimosLancamentos')}
          corpoSemEspaco
          rodape={<Botao rotulo={t('paginas.finVisaoGeral.textos.verTodos')} aparencia="texto" icone="arrow-right" posicaoIcone="direita" onClick={() => navegar(ROTAS.lancamentos)} />}
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
