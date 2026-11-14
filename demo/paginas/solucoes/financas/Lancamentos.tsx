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
  const { t } = useT();
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
        (!termo || normalizar(`${x.descricao} ${categoria(x.categoria)?.nome ?? ''} ${x.observacao ?? ''}`).includes(termo)),
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
    toast.ok(`${ids.length} ${ids.length === 1 ? 'lançamento baixado' : 'lançamentos baixados'}`);
    setSelecionados([]);
  };
  const excluirSelecionados = async () => {
    const n = selecionadosL.length;
    const sim = await confirmar.remover({ titulo: `Excluir ${n} ${n === 1 ? 'lançamento' : 'lançamentos'}?`, mensagem: 'Eles saem dos saldos e dos relatórios.', rotuloAceitar: 'Excluir' });
    if (!sim) return;
    acoes.excluir(selecionadosL.map((x) => x.id));
    toast.ok(`${n} ${n === 1 ? 'lançamento excluído' : 'lançamentos excluídos'}`);
    setSelecionados([]);
  };

  return (
    <div className="demo-pilha">
      <CabecalhoFinancas titulo={t('paginas.finLancamentos.titulo')} icone="list" />

      <div className="fin-resumo" aria-label={`Resumo de ${rotuloPeriodo(periodo)}`}>
        <div>
          <small>Receitas</small>
          <Valor valor={soma.receitas} tipo="receita" tamanho="grande" />
        </div>
        <div>
          <small>Despesas</small>
          <Valor valor={soma.despesas} tipo="despesa" tamanho="grande" />
        </div>
        <div>
          <small>Resultado</small>
          <Valor valor={soma.saldo} colorir sinal tamanho="grande" />
        </div>
        <div>
          <small>Pendentes</small>
          <strong className="fin-resumo-n">{pendentes}</strong>
        </div>
      </div>

      <div className="fin-filtros">
        <FiltroPilulas<FiltroTipo>
          rotulo="Tipo"
          valor={f.tipo}
          aoMudar={(tipo) => mudar({ tipo, categoria: null })}
          opcoes={[
            { valor: 'todos', rotulo: 'Todos' },
            { valor: 'receita', rotulo: 'Receitas' },
            { valor: 'despesa', rotulo: 'Despesas' },
            { valor: 'transferencia', rotulo: 'Transferências' },
          ]}
        />
        <div className="fin-filtros-campos">
          <CampoTexto icone="search" aria-label="Buscar lançamento" placeholder="Buscar descrição" valor={f.busca} aoMudar={(busca) => mudar({ busca })} />
          <CampoSelect aria-label="Conta" placeholder="Todas as contas" botaoLimpar opcoes={contas.map((c) => ({ valor: c.id, rotulo: c.nome }))} valor={f.conta} aoMudar={(v) => mudar({ conta: v })} />
          {f.tipo !== 'transferencia' && (
            <CampoSelect aria-label="Categoria" placeholder="Todas as categorias" botaoLimpar comBusca opcoes={categorias.map((c) => ({ valor: c.id, rotulo: c.nome }))} valor={f.categoria} aoMudar={(v) => mudar({ categoria: v })} />
          )}
          <CampoSelect<FiltroSituacao>
            aria-label="Situação"
            placeholder="Qualquer situação"
            botaoLimpar
            opcoes={[
              { valor: 'pagos', rotulo: 'Pagos e recebidos' },
              { valor: 'pendentes', rotulo: 'Pendentes' },
              { valor: 'atrasados', rotulo: 'Atrasados' },
            ]}
            valor={f.situacao}
            aoMudar={(v) => mudar({ situacao: v })}
          />
          {empresa && (
            <>
              <CampoSelect aria-label="Centro de custo" placeholder="Todos os centros" botaoLimpar opcoes={CENTROS_CUSTO.map((c) => ({ valor: c.id, rotulo: c.nome }))} valor={f.centro} aoMudar={(v) => mudar({ centro: v })} />
              <CampoSelect aria-label="Cliente ou fornecedor" placeholder="Clientes e fornecedores" botaoLimpar comBusca opcoes={CONTATOS.map((c) => ({ valor: c.id, rotulo: c.nome }))} valor={f.contato} aoMudar={(v) => mudar({ contato: v })} />
            </>
          )}
          {filtrando && <Botao rotulo="Limpar" icone="funnel-x" aparencia="texto" severidade="secundario" onClick={() => mudar(VAZIO)} />}
        </div>
      </div>

      {selecionadosL.length > 0 && (
        <div className="fin-selecao" role="region" aria-label="Ações dos selecionados">
          <span>
            <strong>{selecionadosL.length}</strong> selecionados · <Valor valor={totais(selecionadosL).saldo} colorir sinal forte />
          </span>
          <Botao rotulo="Marcar como pago" icone="check" severidade="ok" tamanho="pequeno" disabled={selecionadosL.every((x) => x.pago)} onClick={pagarSelecionados} />
          <Botao rotulo="Excluir" icone="trash-2" severidade="err" aparencia="contorno" tamanho="pequeno" onClick={excluirSelecionados} />
          <Botao rotulo="Desmarcar" aparencia="texto" severidade="secundario" tamanho="pequeno" onClick={() => setSelecionados([])} />
        </div>
      )}

      <Tabela<Lancamento>
        rotulo={`Lançamentos de ${rotuloPeriodo(periodo)}`}
        className="fin-tabela"
        registros={nestaPagina}
        selecao="multipla"
        selecionados={selecionados}
        aoMudarSelecao={setSelecionados}
        aoClicarLinha={abrir}
        ordenacao={ordem}
        aoOrdenar={(campo) => setOrdem((o) => (o?.campo === campo ? { campo, direcao: o.direcao === 'asc' ? 'desc' : 'asc' } : { campo, direcao: campo === 'descricao' ? 'asc' : 'desc' }))}
        colunas={[
          { campo: 'data', rotulo: 'Data', ordenavel: true, largura: '7rem', formato: (v) => dataBr(v as string) },
          {
            campo: 'descricao',
            rotulo: 'Descrição',
            ordenavel: true,
            render: (l) => {
              const cat = categoria(l.categoria);
              const contato = CONTATOS.find((c) => c.id === l.contato);
              return (
                <span className="fin-cel-desc">
                  <IconeCategoria categoria={cat} transferencia={l.tipo === 'transferencia'} />
                  <span>
                    <strong>{l.descricao}</strong>
                    <small>
                      {l.tipo === 'transferencia' ? `${conta(l.conta)?.nome} → ${conta(l.contaDestino)?.nome}` : cat?.nome}
                      {contato && ` · ${contato.nome}`}
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
          { campo: 'conta', rotulo: 'Conta', formato: (_v, l) => (l.tipo === 'transferencia' ? '—' : conta(l.conta)?.nome) },
          {
            campo: 'pago',
            rotulo: 'Situação',
            render: (l) => {
              const s = SITUACOES[situacao(l)];
              return <Status rotulo={s.rotulo} severidade={s.severidade} icone={s.icone} />;
            },
          },
          { campo: 'valor', rotulo: 'Valor', ordenavel: true, alinhamento: 'direita', render: (l) => <Valor valor={l.valor} tipo={l.tipo === 'transferencia' ? 'neutro' : l.tipo} forte /> },
        ]}
        acoes={(l) =>
          !l.pago ? (
            <AcaoLinha
              icone="check"
              rotulo={l.tipo === 'receita' ? 'Marcar como recebido' : 'Marcar como pago'}
              severidade="pri"
              onClick={(e) => {
                e.stopPropagation();
                acoes.marcarPago([l.id]);
                toast.ok(l.tipo === 'receita' ? 'Recebimento registrado' : 'Pagamento registrado', `${l.descricao} · ${formatarMoeda(l.valor)}`);
              }}
            />
          ) : (
            <AcaoLinha
              icone="pencil"
              rotulo="Editar"
              severidade="pri"
              onClick={(e) => {
                e.stopPropagation();
                abrir(l);
              }}
            />
          )
        }
        vazioTitulo={filtrando ? 'Nada com esses filtros' : 'Nenhum lançamento no período'}
        vazioDescricao={filtrando ? 'Mude os filtros ou o período.' : 'Registre uma receita ou despesa para começar.'}
        vazioIcone="receipt"
        vazioAcoes={filtrando ? <Botao rotulo="Limpar filtros" severidade="secundario" onClick={() => mudar(VAZIO)} /> : <Botao rotulo="Nova despesa" icone="plus" onClick={() => abrir('despesa')} />}
        paginacao={filtrados.length > POR_PAGINA ? { total: filtrados.length, pagina, tamanho: POR_PAGINA, aoMudarPagina: setPagina } : undefined}
      />
    </div>
  );
}
