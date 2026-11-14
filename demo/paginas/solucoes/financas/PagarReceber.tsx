import { useState } from 'react';
import { Botao, Card, Escolha, FiltroPilulas, Indicador, Indicadores, Status, Valor, Vazio, diasEntre, formatarMoeda, paraData, somarMoeda, useToast } from '../../../../src';
import { CONTATOS, hoje, type Lancamento } from './dados';
import { CabecalhoFinancas, DIA_SEMANA, IconeCategoria, useEditorLancamento, useMoeda } from './comum';
import { SITUACOES, acoes, aReceber, categoria, conta, doEspaco, qtdLancamentos, situacao, useFinancas, vencePorSi } from './estado';
import { useT } from '../../../i18n/useT';

type Lado = 'pagar' | 'receber';
type Janela = 'atrasados' | 'hoje' | 'semana' | 'mes' | 'todos';

const JANELAS: { valor: Janela; rotulo: string; ate?: number; de?: number }[] = [
  { valor: 'atrasados', rotulo: 'Atrasados', ate: -1 },
  { valor: 'hoje', rotulo: 'Hoje', de: 0, ate: 0 },
  { valor: 'semana', rotulo: 'Próximos 7 dias', ate: 7 },
  { valor: 'mes', rotulo: 'Próximos 30 dias', ate: 30 },
  { valor: 'todos', rotulo: 'Todos' },
];

const naJanela = (j: Janela, dias: number) => {
  const x = JANELAS.find((o) => o.valor === j)!;
  return (x.de === undefined || dias >= x.de) && (x.ate === undefined || dias <= x.ate);
};

export function PagarReceber() {
  const { t } = useT();
  const { espaco, lancamentos } = useFinancas();
  const moeda = useMoeda();
  const toast = useToast();
  const abrir = useEditorLancamento();
  const [lado, setLado] = useState<Lado>('pagar');
  const [janela, setJanela] = useState<Janela>('mes');
  const agora = hoje();

  const pendentes = doEspaco(lancamentos, espaco).filter((l) => !l.pago && vencePorSi(l));
  const doLado = pendentes.filter((l) => (lado === 'receber' ? aReceber(l) : !aReceber(l)));
  const dias = (l: Lancamento) => diasEntre(agora, l.data);
  const soma = (lista: Lancamento[]) => somarMoeda(lista.map((l) => l.valor));
  const contar = (j: Janela) => doLado.filter((l) => naJanela(j, dias(l)));
  const visiveis = contar(janela);

  // grupos: um por data (os atrasados juntos no topo)
  const grupos: { chave: string; titulo: string; itens: Lancamento[]; atrasado?: boolean }[] = [];
  for (const l of visiveis) {
    const atrasado = dias(l) < 0;
    const chave = atrasado ? 'atrasados' : l.data;
    let g = grupos.find((x) => x.chave === chave);
    if (!g) {
      const d = dias(l);
      const nome = atrasado ? 'Atrasados' : d === 0 ? 'Hoje' : d === 1 ? 'Amanhã' : DIA_SEMANA.format(paraData(l.data));
      g = { chave, titulo: nome[0].toUpperCase() + nome.slice(1), itens: [], atrasado };
      grupos.push(g);
    }
    g.itens.push(l);
  }

  const baixar = (l: Lancamento) => {
    acoes.marcarPago([l.id]);
    toast.ok(l.tipo === 'receita' ? t('paginas.finPagarReceber.textos.recebimentoRegistrado') : t('paginas.finPagarReceber.textos.pagamentoRegistrado'), `${l.descricao} · ${formatarMoeda(l.valor)}`);
  };

  const totalPagar = soma(pendentes.filter((l) => !aReceber(l) && dias(l) <= 30));
  const totalReceber = soma(pendentes.filter((l) => aReceber(l) && dias(l) <= 30));

  return (
    <div className="demo-pilha">
      <CabecalhoFinancas titulo={t('paginas.finPagarReceber.titulo')} icone="calendar-range" semPeriodo />

      <Escolha<Lado>
        ariaLabel="Mostrar"
        className="fin-lado"
        opcoes={[
          { valor: 'pagar', rotulo: t('paginas.finPagarReceber.textos.aPagarValor', { valor: moeda(totalPagar, { centavos: false }) }) },
          { valor: 'receber', rotulo: t('paginas.finPagarReceber.textos.aReceberValor', { valor: moeda(totalReceber, { centavos: false }) }) },
        ]}
        valor={lado}
        aoMudar={setLado}
      />

      <Indicadores>
        <Indicador rotulo={t('paginas.finPagarReceber.textos.atrasados')} icone="circle-alert" cor="var(--err-solid)" valor={moeda(soma(contar('atrasados')))} descricao={qtdLancamentos(contar('atrasados').length)} aoClicar={() => setJanela('atrasados')} />
        <Indicador rotulo={t('paginas.finPagarReceber.textos.vencemHoje')} icone="clock" cor="var(--warn-solid)" valor={moeda(soma(contar('hoje')))} descricao={qtdLancamentos(contar('hoje').length)} aoClicar={() => setJanela('hoje')} />
        <Indicador rotulo={t('paginas.finPagarReceber.textos.proximos7Dias')} icone="calendar" cor="var(--info-solid)" valor={moeda(soma(contar('semana').filter((l) => dias(l) >= 0)))} descricao={qtdLancamentos(contar('semana').filter((l) => dias(l) >= 0).length)} aoClicar={() => setJanela('semana')} />
        <Indicador rotulo={t('paginas.finPagarReceber.textos.proximos30Dias')} icone="calendar-range" cor="var(--graf-1)" valor={moeda(soma(contar('mes').filter((l) => dias(l) >= 0)))} descricao={qtdLancamentos(contar('mes').filter((l) => dias(l) >= 0).length)} aoClicar={() => setJanela('mes')} />
      </Indicadores>

      <FiltroPilulas<Janela>
        rotulo={t('paginas.finPagarReceber.textos.vencimento')}
        disposicao="rolar"
        valor={janela}
        aoMudar={setJanela}
        opcoes={JANELAS.map((j) => ({ valor: j.valor, rotulo: `${j.rotulo} (${contar(j.valor).length})` }))}
      />

      <Card corpoSemEspaco>
        {grupos.length === 0 ? (
          <Vazio
            titulo={lado === 'pagar' ? t('paginas.finPagarReceber.textos.nadaAPagarAqui') : t('paginas.finPagarReceber.textos.nadaAReceberAqui')}
            descricao={t('paginas.finPagarReceber.textos.nenhumLancamentoPendenteNesta')}
            icone="circle-check"
          >
            <Botao rotulo={lado === 'pagar' ? t('paginas.finPagarReceber.textos.novaDespesa') : t('paginas.finPagarReceber.textos.novaReceita')} icone="plus" onClick={() => abrir(lado === 'pagar' ? 'despesa' : 'receita', { pago: false })} />
          </Vazio>
        ) : (
          grupos.map((g) => (
            <section key={g.chave} className="fin-grupo" aria-labelledby={`fin-g-${g.chave}`}>
              <header className={`fin-grupo-cab${g.atrasado ? ' is-atrasado' : ''}`}>
                <h3 id={`fin-g-${g.chave}`}>{g.titulo}</h3>
                <span>
                  {g.itens.length} · <Valor valor={soma(g.itens)} forte />
                </span>
              </header>
              <ul className="fin-linhas">
                {g.itens.map((l) => {
                  const s = SITUACOES[situacao(l)];
                  const contato = CONTATOS.find((c) => c.id === l.contato);
                  const d = dias(l);
                  return (
                    <li key={l.id} className="fin-linha">
                      <IconeCategoria categoria={categoria(l.categoria)} transferencia={l.tipo === 'transferencia'} />
                      <button type="button" className="fin-linha-texto" onClick={() => abrir(l)}>
                        <strong>{l.descricao}</strong>
                        <small>
                          {[l.tipo === 'transferencia' ? 'Pagamento de fatura' : categoria(l.categoria)?.nome, contato?.nome, conta(l.conta)?.nome].filter(Boolean).join(' · ')}
                          {l.parcela && ` · parcela ${l.parcela.numero}/${l.parcela.total}`}
                        </small>
                      </button>
                      {d < 0 && <Status rotulo={t('paginas.finPagarReceber.textos.rotuloHaVV2', { rotulo: s.rotulo, v: -d, v2: d === -1 ? 'dia' : 'dias' })} severidade={s.severidade} icone={s.icone} className="fin-linha-status" />}
                      <Valor valor={l.valor} tipo={lado === 'receber' ? 'receita' : 'despesa'} forte />
                      <Botao rotulo={lado === 'receber' ? t('paginas.finPagarReceber.textos.receber') : t('paginas.finPagarReceber.textos.pagar')} icone="check" tamanho="pequeno" aparencia="suave" severidade="ok" onClick={() => baixar(l)} aria-label={`${lado === 'receber' ? 'Receber' : 'Pagar'} ${l.descricao}`} />
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </Card>
    </div>
  );
}
