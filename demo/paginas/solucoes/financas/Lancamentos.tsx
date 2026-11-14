import { useEffect, useMemo, useState, type Key } from 'react';
import {
  AcaoLinha,
  Badge,
  Botao,
  CampoSelect,
  CampoTexto,
  FiltroPilulas,
  Icone,
  Status,
  Tabela,
  Valor,
  formatarMoeda,
  normalizar,
  rotuloPeriodo,
  useConfirmacao,
  useToast,
  type Ordenacao,
} from '../../../../src';
import { CENTROS_CUSTO, CONTATOS, type Lancamento, type TipoLancamento } from './dados';
import { CabecalhoFinancas, IconeCategoria, dataBr, useEditorLancamento } from './comum';
import { SITUACOES, acoes, categoria, categoriasDo, conta, contasDo, doEspaco, noIntervalo, situacao, totais, useFinancas, type Situacao } from './estado';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

type FiltroTipo = 'todos' | TipoLancamento;
type FiltroSituacao = 'pagos' | 'pendentes' | 'atrasados';

interface Criterios {
  busca: string;
  tipo: FiltroTipo;
  conta: string | null;
  categoria: string | null;
  situacao: FiltroSituacao | null;
  centro: string | null;
  contato: string | null;
}

const VAZIO: Criterios = { busca: '', tipo: 'todos', conta: null, categoria: null, situacao: null, centro: null, contato: null };
const POR_PAGINA = 15;

const naSituacao = (f: FiltroSituacao, s: Situacao) => (f === 'pagos' ? s === 'pago' || s === 'recebido' : f === 'atrasados' ? s === 'atrasado' : s === 'pendente' || s === 'hoje' || s === 'atrasado');

export function Lancamentos() {
  const { t, idioma, tc } = useT();
  const { espaco, periodo, lancamentos, filtroInicial } = useFinancas();
  const toast = useToast();
  const confirmar = useConfirmacao();
  const abrir = useEditorLancamento();
  const empresa = espaco === 'empresa';
  // um filtro pedido por outra tela (fatia do gráfico, conta) vale ao abrir
  const [f, setF] = useState<Criterios>(() => ({ ...VAZIO, ...filtroInicial }));
  const [pagina, setPagina] = useState(1);
  const [ordem, setOrdem] = useState<Ordenacao | null>({ campo: 'data', direcao: 'desc' });
  const [selecionados, setSelecionados] = useState<Key[]>([]);
  useEffect(() => {
    if (filtroInicial) acoes.pedirFiltro(null);
  }, [filtroInicial]);
  // trocar de espaço zera os filtros (as contas e categorias são outras)
  const [espacoDoFiltro, setEspacoDoFiltro] = useState(espaco);
  if (espacoDoFiltro !== espaco) {
    setEspacoDoFiltro(espaco);
    setF(VAZIO);
    setSelecionados([]);
    setPagina(1);
  }

  const mudar = (p: Partial<Criterios>) => {
    setF((x) => ({ ...x, ...p }));
    setPagina(1);
    setSelecionados([]);
  };

  const doPeriodo = noIntervalo(doEspaco(lancamentos, espaco), periodo);
  const filtrados = useMemo(() => {
    const termo = normalizar(f.busca.trim());
    let l = doPeriodo.filter(
      (x) =>
        (f.tipo === 'todos' || x.tipo === f.tipo) &&
        (!f.conta || x.conta === f.conta || x.contaDestino === f.conta) &&
        (!f.categoria || x.categoria === f.categoria) &&
        (!f.situacao || naSituacao(f.situacao, situacao(x))) &&
        (!f.centro || x.centroCusto === f.centro) &&
        (!f.contato || x.contato === f.contato) &&
        (!termo || normalizar(`${tc(x.descricao)} ${tc(categoria(x.categoria)?.nome) ?? ''} ${x.observacao ?? ''}`).includes(termo)),
    );
    if (ordem) {
      const dir = ordem.direcao === 'asc' ? 1 : -1;
      const chave = (x: Lancamento) => (ordem.campo === 'valor' ? (x.tipo === 'despesa' ? -x.valor : x.valor) : ordem.campo === 'descricao' ? normalizar(x.descricao) : x.data);
      l = [...l].sort((a, b) => (chave(a) > chave(b) ? 1 : chave(a) < chave(b) ? -1 : 0) * dir);
    }
    return l;
  }, [doPeriodo, f, ordem]);

  const soma = totais(filtrados);
  const pendentes = filtrados.filter((x) => !x.pago).length;
  const nestaPagina = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  const selecionadosL = filtrados.filter((x) => selecionados.includes(x.id));
  const filtrando = JSON.stringify(f) !== JSON.stringify(VAZIO);

  const contas = contasDo(espaco);
  const categorias = categoriasDo(espaco, f.tipo === 'receita' || f.tipo === 'despesa' ? f.tipo : undefined);

  const pagarSelecionados = () => {
    const ids = selecionadosL.filter((x) => !x.pago).map((x) => x.id);
    acoes.marcarPago(ids);
    toast.ok(`${ids.length} ${ids.length === 1 ? tc('lançamento baixado') : tc('lançamentos baixados')}`);
    setSelecionados([]);
  };
  const excluirSelecionados = async () => {
    const n = selecionadosL.length;
    const sim = await confirmar.remover({ titulo: t('paginas.finLancamentos.textos.excluirNV', { n, v: n === 1 ? 'lançamento' : 'lançamentos' }), mensagem: t('paginas.finLancamentos.textos.elesSaemDosSaldos'), rotuloAceitar: tc('Excluir') });
    if (!sim) return;
    acoes.excluir(selecionadosL.map((x) => x.id));
    toast.ok(`${n} ${n === 1 ? tc('lançamento excluído') : tc('lançamentos excluídos')}`);
    setSelecionados([]);
  };

  return (
    <div className="demo-pilha">
      <CabecalhoFinancas titulo={t('paginas.finLancamentos.titulo')} icone="list" />

      <div className="fin-resumo" aria-label={t('paginas.finLancamentos.textos.resumoDeValor', { valor: rotuloPeriodo(periodo, { idioma }) })}>
        <div>{rico(t('paginas.finLancamentos.textos.receitas'))}<Valor valor={soma.receitas} tipo="receita" tamanho="grande" />
        </div>
        <div>{rico(t('paginas.finLancamentos.textos.despesas'))}<Valor valor={soma.despesas} tipo="despesa" tamanho="grande" />
        </div>
        <div>{rico(t('paginas.finLancamentos.textos.resultado'))}<Valor valor={soma.saldo} colorir sinal tamanho="grande" />
        </div>
        <div>{rico(t('paginas.finLancamentos.textos.pendentes'))}<strong className="fin-resumo-n">{pendentes}</strong>
        </div>
      </div>

      <div className="fin-filtros">
        <FiltroPilulas<FiltroTipo>
          rotulo={t('paginas.finLancamentos.textos.tipo')}
          valor={f.tipo}
          aoMudar={(tipo) => mudar({ tipo, categoria: null })}
          opcoes={[
            { valor: 'todos', rotulo: t('paginas.finLancamentos.textos.todos') },
            { valor: 'receita', rotulo: t('paginas.finLancamentos.textos.receitas2') },
            { valor: 'despesa', rotulo: t('paginas.finLancamentos.textos.despesas2') },
            { valor: 'transferencia', rotulo: t('paginas.finLancamentos.textos.transferencias') },
          ]}
        />
        <div className="fin-filtros-campos">
          <CampoTexto icone="search" aria-label={t('paginas.finLancamentos.textos.buscarLancamento')} placeholder={t('paginas.finLancamentos.textos.buscarDescricao')} valor={f.busca} aoMudar={(busca) => mudar({ busca })} />
          <CampoSelect aria-label={t('paginas.finLancamentos.textos.conta')} placeholder={t('paginas.finLancamentos.textos.todasAsContas')} botaoLimpar opcoes={contas.map((c) => ({ valor: c.id, rotulo: tc(c.nome) }))} valor={f.conta} aoMudar={(v) => mudar({ conta: v })} />
          {f.tipo !== 'transferencia' && (
            <CampoSelect aria-label={t('paginas.finLancamentos.textos.categoria')} placeholder={t('paginas.finLancamentos.textos.todasAsCategorias')} botaoLimpar comBusca opcoes={categorias.map((c) => ({ valor: c.id, rotulo: tc(c.nome) }))} valor={f.categoria} aoMudar={(v) => mudar({ categoria: v })} />
          )}
          <CampoSelect<FiltroSituacao>
            aria-label={t('paginas.finLancamentos.textos.situacao')}
            placeholder={t('paginas.finLancamentos.textos.qualquerSituacao')}
            botaoLimpar
            opcoes={[
              { valor: 'pagos', rotulo: t('paginas.finLancamentos.textos.pagosERecebidos') },
              { valor: 'pendentes', rotulo: t('paginas.finLancamentos.textos.pendentes2') },
              { valor: 'atrasados', rotulo: t('paginas.finLancamentos.textos.atrasados') },
            ]}
            valor={f.situacao}
            aoMudar={(v) => mudar({ situacao: v })}
          />
          {empresa && (
            <>
              <CampoSelect aria-label={t('paginas.finLancamentos.textos.centroDeCusto')} placeholder={t('paginas.finLancamentos.textos.todosOsCentros')} botaoLimpar opcoes={CENTROS_CUSTO.map((c) => ({ valor: c.id, rotulo: tc(c.nome) }))} valor={f.centro} aoMudar={(v) => mudar({ centro: v })} />
              <CampoSelect aria-label={t('paginas.finLancamentos.textos.clienteOuFornecedor')} placeholder={t('paginas.finLancamentos.textos.clientesEFornecedores')} botaoLimpar comBusca opcoes={CONTATOS.map((c) => ({ valor: c.id, rotulo: tc(c.nome) }))} valor={f.contato} aoMudar={(v) => mudar({ contato: v })} />
            </>
          )}
          {filtrando && <Botao rotulo={t('paginas.finLancamentos.textos.limpar')} icone="funnel-x" aparencia="texto" severidade="secundario" onClick={() => mudar(VAZIO)} />}
        </div>
      </div>

      {selecionadosL.length > 0 && (
        <div className="fin-selecao" role="region" aria-label={t('paginas.finLancamentos.textos.acoesDosSelecionados')}>
          <span>
            <strong>{selecionadosL.length}</strong>{t('paginas.finLancamentos.textos.selecionados')}<Valor valor={totais(selecionadosL).saldo} colorir sinal forte />
          </span>
          <Botao rotulo={t('paginas.finLancamentos.textos.marcarComoPago')} icone="check" severidade="ok" tamanho="pequeno" disabled={selecionadosL.every((x) => x.pago)} onClick={pagarSelecionados} />
          <Botao rotulo={t('paginas.finLancamentos.textos.excluir')} icone="trash-2" severidade="err" aparencia="contorno" tamanho="pequeno" onClick={excluirSelecionados} />
          <Botao rotulo={t('paginas.finLancamentos.textos.desmarcar')} aparencia="texto" severidade="secundario" tamanho="pequeno" onClick={() => setSelecionados([])} />
        </div>
      )}

      <Tabela<Lancamento>
        rotulo={t('paginas.finLancamentos.textos.lancamentosDeValor', { valor: rotuloPeriodo(periodo, { idioma }) })}
        className="fin-tabela"
        registros={nestaPagina}
        selecao="multipla"
        selecionados={selecionados}
        aoMudarSelecao={setSelecionados}
        aoClicarLinha={abrir}
        ordenacao={ordem}
        aoOrdenar={(campo) => setOrdem((o) => (o?.campo === campo ? { campo, direcao: o.direcao === 'asc' ? 'desc' : 'asc' } : { campo, direcao: campo === 'descricao' ? 'asc' : 'desc' }))}
        colunas={[
          { campo: 'data', rotulo: t('paginas.finLancamentos.textos.data'), ordenavel: true, largura: '7rem', formato: (v) => dataBr(v as string) },
          {
            campo: 'descricao',
            rotulo: t('paginas.finLancamentos.textos.descricao'),
            ordenavel: true,
            render: (l) => {
              const cat = categoria(l.categoria);
              const contato = CONTATOS.find((c) => c.id === l.contato);
              return (
                <span className="fin-cel-desc">
                  <IconeCategoria categoria={cat} transferencia={l.tipo === 'transferencia'} />
                  <span>
                    <strong>{tc(l.descricao)}</strong>
                    <small>
                      {l.tipo === 'transferencia' ? `${tc(conta(l.conta)?.nome)} → ${tc(conta(l.contaDestino)?.nome)}` : tc(cat?.nome)}
                      {contato && ` · ${tc(contato.nome)}`}
                      {l.parcela && (
                        <Badge cor="neutral" aparencia="suave">
                          {l.parcela.numero}/{l.parcela.total}
                        </Badge>
                      )}
                      {l.recorrente && <Icone icone="repeat" className="fin-recorrente" />}
                    </small>
                  </span>
                </span>
              );
            },
          },
          { campo: 'conta', rotulo: t('paginas.finLancamentos.textos.conta'), formato: (_v, l) => (l.tipo === 'transferencia' ? '—' : tc(conta(l.conta)?.nome)) },
          {
            campo: 'pago',
            rotulo: t('paginas.finLancamentos.textos.situacao'),
            render: (l) => {
              const s = SITUACOES[situacao(l)];
              return <Status rotulo={tc(s.rotulo)} severidade={s.severidade} icone={s.icone} />;
            },
          },
          { campo: 'valor', rotulo: t('paginas.finLancamentos.textos.valor'), ordenavel: true, alinhamento: 'direita', render: (l) => <Valor valor={l.valor} tipo={l.tipo === 'transferencia' ? 'neutro' : l.tipo} forte /> },
        ]}
        acoes={(l) =>
          !l.pago ? (
            <AcaoLinha
              icone="check"
              rotulo={l.tipo === 'receita' ? t('paginas.finLancamentos.textos.marcarComoRecebido') : t('paginas.finLancamentos.textos.marcarComoPago')}
              severidade="pri"
              onClick={(e) => {
                e.stopPropagation();
                acoes.marcarPago([l.id]);
                toast.ok(l.tipo === 'receita' ? t('paginas.finLancamentos.textos.recebimentoRegistrado') : t('paginas.finLancamentos.textos.pagamentoRegistrado'), `${tc(l.descricao)} · ${formatarMoeda(l.valor, { idioma })}`);
              }}
            />
          ) : (
            <AcaoLinha
              icone="pencil"
              rotulo={t('paginas.finLancamentos.textos.editar')}
              severidade="pri"
              onClick={(e) => {
                e.stopPropagation();
                abrir(l);
              }}
            />
          )
        }
        vazioTitulo={filtrando ? t('paginas.finLancamentos.textos.nadaComEssesFiltros') : t('paginas.finLancamentos.textos.nenhumLancamentoNoPeriodo')}
        vazioDescricao={filtrando ? t('paginas.finLancamentos.textos.mudeOsFiltrosOu') : t('paginas.finLancamentos.textos.registreUmaReceitaOu')}
        vazioIcone="receipt"
        vazioAcoes={filtrando ? <Botao rotulo={t('paginas.finLancamentos.textos.limparFiltros')} severidade="secundario" onClick={() => mudar(VAZIO)} /> : <Botao rotulo={t('paginas.finLancamentos.textos.novaDespesa')} icone="plus" onClick={() => abrir('despesa')} />}
        paginacao={filtrados.length > POR_PAGINA ? { total: filtrados.length, pagina, tamanho: POR_PAGINA, aoMudarPagina: setPagina } : undefined}
      />
    </div>
  );
}
