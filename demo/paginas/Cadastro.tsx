import { useState } from 'react';
import {
  AcaoLinha,
  Botao,
  CampoCep,
  CampoCpfCnpj,
  CampoData,
  CampoEmail,
  CampoHora,
  CampoInteiro,
  CampoMarcacao,
  CampoMoeda,
  CampoSelect,
  CampoTelefone,
  CampoTextarea,
  CampoTexto,
  CampoTipoPessoa,
  CampoUf,
  Escolha,
  Form,
  FormSecao,
  Tabela,
  isCpfCnpj,
  useToast,
  type ItemMenuForm,
} from '../../src';
import type { ChaveTexto } from '../i18n/tipos';
import { useT, type TradutorDemo } from '../i18n/useT';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Cada item do menu é um formulário próprio, com rota e botão Salvar independentes.
const FORMULARIOS = [
  { id: 'cliente', rota: '/pedidos/novo', rotulo: 'Cliente e entrega', icone: 'user' },
  { id: 'itens', rota: '/pedidos/novo/itens', rotulo: 'Itens e valores', icone: 'shopping-cart' },
  { id: 'pagamento', rota: '/pedidos/novo/pagamento', rotulo: 'Pagamento e prazos', icone: 'wallet' },
] as const;

type IdFormulario = (typeof FORMULARIOS)[number]['id'];
/** O rótulo de cada formulário vem do dicionário (a lista acima guarda o id e a rota). */
const ROTULO_FORMULARIO: Record<IdFormulario, ChaveTexto> = {
  cliente: 'paginas.novoPedido.textos.clienteEEntrega',
  itens: 'paginas.novoPedido.textos.itensEValores',
  pagamento: 'paginas.novoPedido.textos.pagamentoEPrazos',
};

const PRODUTOS = (t: TradutorDemo['t']) => ([
  { valor: 'arroz', rotulo: t('paginas.novoPedido.textos.arrozTipo15'), preco: 27.9 },
  { valor: 'feijao', rotulo: t('paginas.novoPedido.textos.feijaoCarioca1Kg'), preco: 8.49 },
  { valor: 'cafe', rotulo: t('paginas.novoPedido.textos.cafeTorrado500G'), preco: 18.9 },
  { valor: 'detergente', rotulo: t('paginas.novoPedido.textos.detergenteNeutro500Ml'), preco: 2.79 },
  { valor: 'papel', rotulo: t('paginas.novoPedido.textos.papelA4Resma500'), preco: 32.5 },
  { valor: 'caneta', rotulo: t('paginas.novoPedido.textos.canetaEsferograficaCx50'), preco: 44.0 },
]);

interface ItemPedido {
  id: number;
  produto: string;
  quantidade: number;
  preco: number;
}

export function PaginaCadastro({ rota, navegar }: { rota: string; navegar: (r: string) => void }) {
  const { t, tc } = useT();
  const atual: IdFormulario = FORMULARIOS.find((x) => x.rota === rota)?.id ?? 'cliente';
  const toast = useToast();
  const [salvando, setSalvando] = useState(false);
  const [tentou, setTentou] = useState(false);
  const [f, setF] = useState({
    tipoPessoa: 'J' as 'F' | 'J' | null,
    documento: '',
    cliente: '',
    email: '',
    telefone: '',
    cep: '',
    uf: 'PR' as string | null,
    cidade: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    produto: null as string | null,
    quantidade: 1 as number | null,
    preco: null as number | null,
    desconto: null as number | null,
    frete: null as number | null,
    pagamento: 'pix',
    parcelas: '1' as string | null,
    vencimento: '',
    pago: false,
    dataPedido: new Date().toISOString().slice(0, 10),
    entrega: '',
    horario: '',
    transportadora: null as string | null,
    observacoes: '',
  });
  const [itens, setItens] = useState<ItemPedido[]>([
    { id: 1, produto: 'Arroz tipo 1 — 5 kg', quantidade: 10, preco: 27.9 },
    { id: 2, produto: 'Café torrado — 500 g', quantidade: 6, preco: 18.9 },
  ]);
  const mudar = <K extends keyof typeof f>(k: K) => (v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));

  const subtotal = itens.reduce((s, i) => s + i.quantidade * i.preco, 0);
  const total = Math.max(0, subtotal - (f.desconto ?? 0) + (f.frete ?? 0));

  const erros = {
    cliente: !f.cliente.trim() ? (f.tipoPessoa === 'J' ? tc('Informe a razão social.') : tc('Informe o nome do cliente.')) : undefined,
    documento: !isCpfCnpj(f.documento) ? tc('Informe um CPF ou CNPJ válido.') : undefined,
    itens: !itens.length ? tc('Adicione pelo menos um item.') : undefined,
    entrega: !f.entrega ? tc('Informe a previsão de entrega.') : f.entrega < f.dataPedido ? tc('A entrega deve ser depois da data do pedido.') : undefined,
  };
  const pendenciasPorForm: Record<IdFormulario, number> = {
    cliente: [erros.cliente, erros.documento].filter(Boolean).length,
    itens: [erros.itens].filter(Boolean).length,
    pagamento: [erros.entrega].filter(Boolean).length,
  };
  const pendencias = pendenciasPorForm[atual];
  const erro = (k: keyof typeof erros) => (tentou ? erros[k] : undefined);

  const menu: ItemMenuForm[] = FORMULARIOS.map((x) => ({
    id: x.id,
    rotulo: t(ROTULO_FORMULARIO[x.id]),
    icone: x.icone,
    href: `#${x.rota}`,
    pendencias: tentou ? pendenciasPorForm[x.id] : undefined,
  }));

  const adicionarItem = () => {
    const p = PRODUTOS(t).find((x) => x.valor === f.produto);
    if (!p || !f.quantidade) {
      toast.warn(t('paginas.novoPedido.textos.escolhaOProdutoE'));
      return;
    }
    setItens((l) => [...l, { id: Date.now(), produto: p.rotulo, quantidade: f.quantidade!, preco: f.preco ?? p.preco }]);
    setF((x) => ({ ...x, produto: null, quantidade: 1, preco: null }));
  };

  const salvar = () => {
    setTentou(true);
    if (pendencias) {
      toast.warn(t('paginas.novoPedido.textos.haCamposACorrigir'), t('paginas.novoPedido.textos.pendenciasCampoSA', { pendencias }));
      return;
    }
    setSalvando(true);
    setTimeout(() => {
      setSalvando(false);
      toast.ok(t('paginas.novoPedido.textos.rotuloSalvo', { rotulo: t(ROTULO_FORMULARIO[atual]) }), f.cliente || undefined);
    }, 1000);
  };

  const juridica = f.tipoPessoa === 'J';

  return (
    <Form
      titulo={t('paginas.novoPedido.titulo')}
      icone="shopping-cart"
      trilha={[{ rotulo: t(ROTULO_FORMULARIO[atual]) }]}
      aoSalvar={salvar}
      aoCancelar={() => navegar('/pedidos')}
      salvando={salvando}
      pendencias={tentou ? pendencias : undefined}
      menu={menu}
      menuTitulo={t('paginas.novoPedido.textos.cadastroDoPedido')}
      menuAtivo={atual}
    >
      {atual === 'cliente' && (
        <>
          <FormSecao legenda={t('paginas.novoPedido.secoes.cliente')} icone="user">
            <CampoTipoPessoa rotulo={t('paginas.novoPedido.textos.tipoDePessoa')} valor={f.tipoPessoa} aoMudar={mudar('tipoPessoa')} />
            <CampoCpfCnpj rotulo={juridica ? t('paginas.novoPedido.textos.cnpj') : t('paginas.novoPedido.textos.cpf')} obrigatorio valor={f.documento} aoMudar={mudar('documento')} erro={erro('documento')} />
            <CampoTexto
              className="lp-col-2"
              rotulo={juridica ? t('paginas.novoPedido.textos.razaoSocial') : t('paginas.novoPedido.textos.nomeCompleto')}
              obrigatorio
              valor={f.cliente}
              aoMudar={mudar('cliente')}
              erro={erro('cliente')}
            />
            <CampoEmail className="lp-col-2" rotulo={t('paginas.novoPedido.textos.eMail')} valor={f.email} aoMudar={mudar('email')} dica={t('paginas.novoPedido.textos.recebeAConfirmacaoDo')} />
            <CampoTelefone className="lp-col-2" rotulo={t('paginas.novoPedido.textos.telefone')} valor={f.telefone} aoMudar={mudar('telefone')} />
          </FormSecao>

          <FormSecao legenda={t('paginas.novoPedido.secoes.enderecoEntrega')} icone="map-pin">
            <CampoCep rotulo={t('paginas.novoPedido.textos.cep')} valor={f.cep} aoMudar={mudar('cep')} />
            <CampoUf rotulo={t('paginas.novoPedido.textos.uf')} valor={f.uf} aoMudar={mudar('uf')} />
            <CampoTexto className="lp-col-2" rotulo={t('paginas.novoPedido.textos.cidade')} valor={f.cidade} aoMudar={mudar('cidade')} />
            <CampoTexto className="lp-col-2" rotulo={t('paginas.novoPedido.textos.logradouro')} valor={f.logradouro} aoMudar={mudar('logradouro')} />
            <CampoTexto rotulo={t('paginas.novoPedido.textos.numero')} valor={f.numero} aoMudar={mudar('numero')} />
            <CampoTexto rotulo={t('paginas.novoPedido.textos.complemento')} valor={f.complemento} aoMudar={mudar('complemento')} />
            <CampoTexto className="lp-col-2" rotulo={t('paginas.novoPedido.textos.bairro')} valor={f.bairro} aoMudar={mudar('bairro')} />
          </FormSecao>
        </>
      )}

      {atual === 'itens' && (
        <>
          <FormSecao
            legenda={t('paginas.novoPedido.secoes.itens')}
            icone="list"
            acoes={<Botao rotulo={t('paginas.novoPedido.textos.adicionarItem')} icone="plus" severidade="secundario" aparencia="contorno" onClick={adicionarItem} />}
          >
            <CampoSelect
              className="lp-col-2"
              rotulo={t('paginas.novoPedido.textos.produto')}
              comBusca
              opcoes={PRODUTOS(t)}
              valor={f.produto}
              aoMudar={(produto) => setF((x) => ({ ...x, produto, preco: PRODUTOS(t).find((p) => p.valor === produto)?.preco ?? null }))}
            />
            <CampoInteiro rotulo={t('paginas.novoPedido.textos.quantidade')} valor={f.quantidade} aoMudar={mudar('quantidade')} />
            <CampoMoeda rotulo={t('paginas.novoPedido.textos.precoUnitario')} valor={f.preco} aoMudar={mudar('preco')} dica={t('paginas.novoPedido.textos.precoDeTabelaPode')} />
            <div className="lp-col-full">
              <Tabela<ItemPedido>
                rotulo={t('paginas.novoPedido.textos.itensDoPedido')}
                registros={itens}
                erro={erro('itens')}
                vazioTitulo={t('paginas.novoPedido.textos.nenhumItemNoPedido')}
                vazioDescricao={t('paginas.novoPedido.textos.escolhaUmProdutoAcima')}
                acoes={(i) => <AcaoLinha icone="trash-2" rotulo={t('paginas.novoPedido.textos.removerItem')} severidade="err" onClick={() => setItens((l) => l.filter((x) => x.id !== i.id))} />}
                colunas={[
                  { campo: 'produto', rotulo: t('paginas.novoPedido.textos.produto'), destaque: true },
                  { campo: 'quantidade', rotulo: t('paginas.novoPedido.textos.qtd'), alinhamento: 'direita', largura: '5rem' },
                  { campo: 'preco', rotulo: t('paginas.novoPedido.textos.precoUnit'), alinhamento: 'direita', formato: (v) => BRL.format(v as number) },
                  { campo: 'id', rotulo: t('paginas.novoPedido.textos.subtotal'), alinhamento: 'direita', render: (i) => BRL.format(i.quantidade * i.preco) },
                ]}
              />
            </div>
          </FormSecao>

          <FormSecao legenda={t('paginas.novoPedido.secoes.valores')} icone="calculator">
            <CampoMoeda rotulo={t('paginas.novoPedido.textos.subtotal')} valor={subtotal} disabled dica={t('paginas.novoPedido.textos.nItemNs', { n: itens.length })} />
            <CampoMoeda rotulo={t('paginas.novoPedido.textos.desconto')} valor={f.desconto} aoMudar={mudar('desconto')} />
            <CampoMoeda rotulo={t('paginas.novoPedido.textos.frete')} valor={f.frete} aoMudar={mudar('frete')} />
            <CampoMoeda rotulo={t('paginas.novoPedido.textos.totalDoPedido')} valor={total} disabled dica={t('paginas.novoPedido.textos.subtotalDescontoFrete')} />
          </FormSecao>
        </>
      )}

      {atual === 'pagamento' && (
        <>
          <FormSecao legenda={t('paginas.novoPedido.secoes.pagamento')} icone="wallet">
            <Escolha
              className="lp-col-2"
              rotulo={t('paginas.novoPedido.textos.formaDePagamento')}
              opcoes={[
                { valor: 'pix', rotulo: t('paginas.novoPedido.textos.pix') },
                { valor: 'boleto', rotulo: t('paginas.novoPedido.textos.boleto') },
                { valor: 'credito', rotulo: t('paginas.novoPedido.textos.cartao') },
                { valor: 'prazo', rotulo: t('paginas.novoPedido.textos.aPrazo') },
              ]}
              valor={f.pagamento}
              aoMudar={mudar('pagamento')}
            />
            <CampoSelect
              rotulo={t('paginas.novoPedido.textos.parcelas')}
              disabled={f.pagamento !== 'credito' && f.pagamento !== 'prazo'}
              opcoes={[1, 2, 3, 4, 6, 10, 12].map((n) => ({ valor: String(n), rotulo: n === 1 ? t('paginas.novoPedido.textos.aVista') : t('paginas.novoPedido.textos.nDeValor', { n, valor: BRL.format(total / n) }) }))}
              valor={f.parcelas}
              aoMudar={mudar('parcelas')}
            />
            <CampoData rotulo={t('paginas.novoPedido.textos.vencimento')} valor={f.vencimento} aoMudar={mudar('vencimento')} />
            <CampoMarcacao className="lp-col-full" aparencia="chave" rotulo={t('paginas.novoPedido.textos.pagamentoJaConfirmado')} valor={f.pago} aoMudar={mudar('pago')} dica={t('paginas.novoPedido.textos.liberaOPedidoPara')} />
          </FormSecao>

          <FormSecao legenda={t('paginas.novoPedido.secoes.prazos')} icone="truck">
            <CampoData rotulo={t('paginas.novoPedido.textos.dataDoPedido')} valor={f.dataPedido} aoMudar={mudar('dataPedido')} />
            <CampoData rotulo={t('paginas.novoPedido.textos.previsaoDeEntrega')} obrigatorio valor={f.entrega} aoMudar={mudar('entrega')} erro={erro('entrega')} />
            <CampoHora rotulo={t('paginas.novoPedido.textos.horarioDeEntrega')} valor={f.horario} aoMudar={mudar('horario')} />
            <CampoSelect
              rotulo={t('paginas.novoPedido.textos.transportadora')}
              placeholder={t('paginas.novoPedido.textos.selecione')}
              opcoes={[
                { valor: 'propria', rotulo: t('paginas.novoPedido.textos.entregaPropria') },
                { valor: 'correios', rotulo: t('paginas.novoPedido.textos.correios') },
                { valor: 'rapida', rotulo: t('paginas.novoPedido.textos.rapidaLog') },
                { valor: 'retirada', rotulo: t('paginas.novoPedido.textos.retiradaNaLoja') },
              ]}
              valor={f.transportadora}
              aoMudar={mudar('transportadora')}
            />
            <CampoTextarea className="lp-col-full" rotulo={t('paginas.novoPedido.textos.observacoes')} maxLength={300} valor={f.observacoes} aoMudar={mudar('observacoes')} />
          </FormSecao>
        </>
      )}
    </Form>
  );
}
