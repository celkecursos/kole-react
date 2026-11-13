import type { CSSProperties } from 'react';
import { Botao, Card, Indicador, Indicadores, Minigrafico, Progresso, Valor, formatarMoeda, formatarPercentual, somarMoeda, useToast } from '../../../../src';
import { dia, hoje, type Conta } from './dados';
import { CabecalhoFinancas, IconeConta, TIPO_CONTA, dataBr, useEditorLancamento, useMoeda } from './comum';
import { acoes, contasDo, doEspaco, saldoConta, useFinancas } from './estado';
import { ROTAS } from './rotas';

/** Próxima data com o dia `d` (hoje conta). */
function proximoDia(d: number): string {
  const h = hoje();
  const neste = new Date(h.getFullYear(), h.getMonth(), d);
  return dia(Math.round(((neste >= h ? neste : new Date(h.getFullYear(), h.getMonth() + 1, d)).getTime() - h.getTime()) / 86_400_000));
}

/** O cartão desenhado: banco, final do número e titular. Decorativo (as informações estão ao lado, em texto). */
function CartaoCredito({ conta, titular }: { conta: Conta; titular: string }) {
  return (
    <div className="fin-cartao" style={{ '--fin-cor': conta.cor } as CSSProperties} aria-hidden="true">
      <div className="fin-cartao-topo">
        <strong>{conta.instituicao}</strong>
        <span className="fin-cartao-chip" />
      </div>
      <div className="fin-cartao-numero">•••• •••• •••• {conta.final}</div>
      <div className="fin-cartao-base">
        <span>{titular}</span>
        <span className="fin-cartao-bandeira">
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}

export function Contas({ navegar }: { navegar: (r: string) => void }) {
  const { espaco, lancamentos } = useFinancas();
  const moeda = useMoeda();
  const toast = useToast();
  const abrir = useEditorLancamento();
  const todos = doEspaco(lancamentos, espaco);
  const contas = contasDo(espaco);
  const bancarias = contas.filter((c) => c.tipo !== 'cartao');
  const cartoes = contas.filter((c) => c.tipo === 'cartao');
  const saldos = new Map(contas.map((c) => [c.id, saldoConta(c, todos)]));
  const disponivel = somarMoeda(bancarias.filter((c) => c.tipo !== 'investimento').map((c) => saldos.get(c.id)!));
  const investido = somarMoeda(bancarias.filter((c) => c.tipo === 'investimento').map((c) => saldos.get(c.id)!));
  const faturas = somarMoeda(cartoes.map((c) => Math.max(0, -saldos.get(c.id)!)));
  const limite = somarMoeda(cartoes.map((c) => c.limite ?? 0));
  const titular = espaco === 'empresa' ? 'ESTÚDIO AURORA' : 'GABRIELLY R. SILVA';

  const extrato = (c: Conta) => {
    acoes.pedirFiltro({ conta: c.id });
    navegar(ROTAS.lancamentos);
  };

  return (
    <div className="demo-pilha">
      <CabecalhoFinancas
        titulo="Contas e cartões"
        icone="landmark"
        semPeriodo
        acoes={<Botao rotulo="Nova conta" icone="plus" onClick={() => toast.info('Nova conta', 'Aqui entraria o cadastro da conta ou do cartão.')} />}
      />

      <Indicadores>
        <Indicador rotulo="Disponível" icone="wallet" cor="var(--graf-1)" valor={moeda(disponivel)} descricao="Contas, poupança e dinheiro" />
        <Indicador rotulo="Investido" icone="trending-up" cor="var(--graf-3)" valor={moeda(investido)} descricao="Aplicações com liquidez" />
        <Indicador rotulo="Faturas abertas" icone="credit-card" cor="var(--warn-solid)" valor={moeda(faturas)} descricao={`${cartoes.length} ${cartoes.length === 1 ? 'cartão' : 'cartões'}`} />
        <Indicador rotulo="Limite disponível" icone="shield-check" cor="var(--ok-solid)" valor={moeda(Math.max(0, limite - faturas))} descricao={`de ${moeda(limite, { centavos: false })}`} />
      </Indicadores>

      <h2 className="fin-titulo-secao">Contas</h2>
      <div className="fin-grade fin-grade--contas">
        {bancarias.map((c) => {
          // saldo de cada um dos últimos 30 dias: a forma da tendência
          const serie = Array.from({ length: 30 }, (_, i) => saldoConta(c, todos, dia(i - 29)));
          const saldo = saldos.get(c.id)!;
          const mes = serie[0] ? ((saldo - serie[0]) / Math.abs(serie[0])) * 100 : 0;
          return (
            <Card key={c.id} className="fin-conta">
              <div className="fin-conta-topo">
                <IconeConta conta={c} />
                <div>
                  <strong>{c.nome}</strong>
                  <small>
                    {c.instituicao} · {TIPO_CONTA[c.tipo]}
                  </small>
                </div>
              </div>
              <Valor valor={saldo} tamanho="destaque" colorir={saldo < 0} />
              <small className="fin-conta-var">{formatarPercentual(mes, { sinal: true })} em 30 dias</small>
              <Minigrafico valores={serie} className="fin-conta-mini" />
              <div className="fin-conta-acoes">
                <Botao rotulo="Extrato" icone="list" tamanho="pequeno" aparencia="contorno" severidade="secundario" onClick={() => extrato(c)} />
                <Botao
                  rotulo="Transferir"
                  icone="arrow-left-right"
                  tamanho="pequeno"
                  aparencia="texto"
                  severidade="secundario"
                  onClick={() => abrir('transferencia', { conta: c.id, pago: true, descricao: 'Transferência' })}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <h2 className="fin-titulo-secao">Cartões de crédito</h2>
      <div className="fin-grade fin-grade--cartoes">
        {cartoes.map((c) => {
          const fatura = Math.max(0, -saldos.get(c.id)!);
          const usado = c.limite ? fatura / c.limite : 0;
          const pendente = todos.find((l) => l.tipo === 'transferencia' && l.contaDestino === c.id && !l.pago);
          return (
            <Card key={c.id} className="fin-cartao-card">
              <CartaoCredito conta={c} titular={titular} />
              <div className="fin-cartao-info">
                <div>
                  <small>Fatura atual</small>
                  <Valor valor={fatura} tamanho="destaque" />
                </div>
                <Progresso
                  valor={Math.min(100, usado * 100)}
                  altura="sm"
                  cor={usado > 0.9 ? 'err' : usado > 0.7 ? 'warn' : 'pri'}
                  rotulo={`Limite usado: ${formatarPercentual(usado * 100, { casas: 0 })}`}
                />
                <div className="fin-cartao-limite">
                  <span>
                    Usado <Valor valor={fatura} />
                  </span>
                  <span>
                    Limite <Valor valor={c.limite ?? 0} centavos={false} />
                  </span>
                </div>
                <dl className="fin-cartao-datas">
                  <div>
                    <dt>Fecha</dt>
                    <dd>{dataBr(proximoDia(c.fechamento ?? 1))}</dd>
                  </div>
                  <div>
                    <dt>Vence</dt>
                    <dd>{dataBr(pendente?.data ?? proximoDia(c.vencimento ?? 10))}</dd>
                  </div>
                </dl>
                <div className="fin-conta-acoes">
                  {pendente ? (
                    <Botao
                      rotulo={`Pagar fatura de ${moeda(pendente.valor)}`}
                      icone="check"
                      tamanho="pequeno"
                      onClick={() => {
                        acoes.marcarPago([pendente.id]);
                        toast.ok('Fatura paga', `${c.nome} · ${formatarMoeda(pendente.valor)}`);
                      }}
                    />
                  ) : (
                    <Botao
                      rotulo="Pagar fatura"
                      icone="check"
                      tamanho="pequeno"
                      disabled={fatura === 0}
                      onClick={() => abrir('transferencia', { conta: bancarias[0].id, contaDestino: c.id, valor: fatura, pago: true, descricao: `Fatura ${c.nome}` })}
                    />
                  )}
                  <Botao rotulo="Compras" icone="list" tamanho="pequeno" aparencia="contorno" severidade="secundario" onClick={() => extrato(c)} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
