import { useMemo, useState, type Key } from 'react';
import {
  AcaoLinha,
  Botao,
  CabecalhoPagina,
  CampoSelect,
  CampoTexto,
  Filtros,
  Tabela,
  useConfirmacao,
  useToast,
  type Ordenacao,
} from '../../src';
import { OPCOES_PAGAMENTO, OPCOES_SITUACAO, PEDIDOS, SEVERIDADE, type Pedido } from './dados';
import { useT } from '../i18n/useT';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const DATA = (iso: unknown) => new Date(`${iso}T00:00`).toLocaleDateString('pt-BR');

interface Criterios {
  cliente: string;
  pagamento: string | null;
  situacao: string | null;
}
const VAZIO: Criterios = { cliente: '', pagamento: null, situacao: null };

export function PaginaListagem({ navegar }: { navegar: (r: string) => void }) {
  const { t } = useT();
  const toast = useToast();
  const confirmar = useConfirmacao();
  const [rascunho, setRascunho] = useState<Criterios>(VAZIO);
  const [aplicados, setAplicados] = useState<Criterios>(VAZIO);
  const [pagina, setPagina] = useState(1);
  const [tamanho, setTamanho] = useState(10);
  const [ordem, setOrdem] = useState<Ordenacao | null>({ campo: 'numero', direcao: 'desc' });
  const [selecionados, setSelecionados] = useState<Key[]>([]);
  const [registros, setRegistros] = useState(PEDIDOS);

  const filtrados = useMemo(() => {
    let l = registros.filter(
      (c) =>
        (!aplicados.cliente || `${c.cliente} ${c.numero}`.toLowerCase().includes(aplicados.cliente.toLowerCase())) &&
        (!aplicados.pagamento || c.pagamento === aplicados.pagamento) &&
        (!aplicados.situacao || c.situacao === aplicados.situacao),
    );
    if (ordem) {
      const k = ordem.campo as keyof Pedido;
      l = [...l].sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * (ordem.direcao === 'asc' ? 1 : -1));
    }
    return l;
  }, [registros, aplicados, ordem]);

  const paginaAtual = filtrados.slice((pagina - 1) * tamanho, pagina * tamanho);
  const alterado = JSON.stringify(rascunho) !== JSON.stringify(aplicados);

  const consultar = (c = rascunho) => {
    setAplicados(c);
    setRascunho(c);
    setPagina(1);
  };

  const chips = [
    aplicados.cliente && { campo: 'Cliente', rotulo: aplicados.cliente, aoRemover: () => consultar({ ...aplicados, cliente: '' }) },
    aplicados.pagamento && { campo: 'Pagamento', rotulo: aplicados.pagamento, aoRemover: () => consultar({ ...aplicados, pagamento: null }) },
    aplicados.situacao && { campo: 'Situação', rotulo: aplicados.situacao, aoRemover: () => consultar({ ...aplicados, situacao: null }) },
  ].filter(Boolean) as { campo: string; rotulo: string; aoRemover: () => void }[];

  const excluir = async (c: Pedido) => {
    const ok = await confirmar.remover({ titulo: t('paginas.pedidos.textos.excluirPedido'), mensagem: t('paginas.pedidos.textos.oPedidoNumeroCliente', { numero: c.numero, cliente: c.cliente }), rotuloAceitar: 'Excluir' });
    if (!ok) return;
    setRegistros((l) => l.filter((x) => x.id !== c.id));
    toast.ok(t('paginas.pedidos.textos.pedidoExcluido'), c.numero);
  };

  return (
    <div className="demo-pilha">
      <CabecalhoPagina
        titulo={t('paginas.pedidos.titulo')}
        trilha
        icone="shopping-cart"
        acoes={
          <>
            {selecionados.length > 0 && (
              <Botao rotulo={t('paginas.pedidos.textos.exportarN', { n: selecionados.length })} icone="download" severidade="secundario" onClick={() => toast.info(t('paginas.pedidos.textos.exportacaoIniciada'))} />
            )}
            <Botao rotulo={t('paginas.pedidos.textos.novoPedido')} icone="plus" onClick={() => navegar('/pedidos/novo')} />
          </>
        }
      />

      <Filtros
        aoConsultar={() => consultar()}
        aoLimpar={() => consultar(VAZIO)}
        alterado={alterado}
        aplicados={chips}
      >
        <CampoTexto variante="inline" rotulo={t('paginas.pedidos.textos.cliente')} placeholder={t('paginas.pedidos.textos.nomeOuNDo')} valor={rascunho.cliente} aoMudar={(cliente) => setRascunho({ ...rascunho, cliente })} />
        <CampoSelect variante="inline" rotulo={t('paginas.pedidos.textos.pagamento')} placeholder={t('paginas.pedidos.textos.todos')} opcoes={OPCOES_PAGAMENTO} valor={rascunho.pagamento} aoMudar={(pagamento) => setRascunho({ ...rascunho, pagamento })} botaoLimpar />
        <CampoSelect variante="inline" rotulo={t('paginas.pedidos.textos.situacao')} placeholder={t('paginas.pedidos.textos.todas')} opcoes={OPCOES_SITUACAO} valor={rascunho.situacao} aoMudar={(situacao) => setRascunho({ ...rascunho, situacao })} botaoLimpar />
      </Filtros>

      <Tabela<Pedido>
        rotulo={t('paginas.pedidos.textos.pedidos')}
        registros={paginaAtual}
        selecao="multipla"
        selecionados={selecionados}
        aoMudarSelecao={setSelecionados}
        ordenacao={ordem}
        aoOrdenar={(campo) =>
          setOrdem((o) => (o?.campo === campo ? { campo, direcao: o.direcao === 'asc' ? 'desc' : 'asc' } : { campo, direcao: 'asc' }))
        }
        acoes={(c) => (
          <>
            <AcaoLinha icone="eye" rotulo={t('paginas.pedidos.textos.visualizar')} severidade="pri" onClick={() => toast.info(c.numero, c.cliente)} />
            <AcaoLinha icone="pencil" rotulo={t('paginas.pedidos.textos.editar')} severidade="destaque" onClick={() => navegar('/pedidos/novo')} />
            <AcaoLinha icone="trash-2" rotulo={t('paginas.pedidos.textos.excluir')} severidade="err" onClick={() => excluir(c)} />
          </>
        )}
        colunas={[
          { campo: 'numero', rotulo: t('paginas.pedidos.textos.pedido'), ordenavel: true, destaque: true, largura: '9.5rem' },
          { campo: 'cliente', rotulo: t('paginas.pedidos.textos.cliente'), ordenavel: true },
          { campo: 'uf', rotulo: t('paginas.pedidos.textos.uf'), alinhamento: 'centro' },
          { campo: 'itens', rotulo: t('paginas.pedidos.textos.itens'), ordenavel: true, alinhamento: 'direita' },
          { campo: 'total', rotulo: t('paginas.pedidos.textos.total'), ordenavel: true, alinhamento: 'direita', formato: (v) => BRL.format(v as number) },
          { campo: 'pagamento', rotulo: t('paginas.pedidos.textos.pagamento') },
          { campo: 'entrega', rotulo: t('paginas.pedidos.textos.entrega'), ordenavel: true, formato: DATA },
          { campo: 'situacao', rotulo: t('paginas.pedidos.textos.situacao'), severidade: (c) => SEVERIDADE[c.situacao] },
        ]}
        vazioDescricao={t('paginas.pedidos.textos.ajusteOsFiltrosE')}
        vazioAcoes={<Botao rotulo={t('paginas.pedidos.textos.limparFiltros')} severidade="secundario" onClick={() => consultar(VAZIO)} />}
        paginacao={{
          total: filtrados.length,
          pagina,
          tamanho,
          aoMudarPagina: setPagina,
          aoMudarTamanho: (t) => {
            setTamanho(t);
            setPagina(1);
          },
        }}
      />
    </div>
  );
}
