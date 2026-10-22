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

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Cada item do menu é um formulário próprio, com rota e botão Salvar independentes.
const FORMULARIOS = [
  { id: 'cliente', rota: '/pedidos/novo', rotulo: 'Cliente e entrega', icone: 'user' },
  { id: 'itens', rota: '/pedidos/novo/itens', rotulo: 'Itens e valores', icone: 'shopping-cart' },
  { id: 'pagamento', rota: '/pedidos/novo/pagamento', rotulo: 'Pagamento e prazos', icone: 'wallet' },
] as const;

type IdFormulario = (typeof FORMULARIOS)[number]['id'];

const PRODUTOS = [
  { valor: 'arroz', rotulo: 'Arroz tipo 1 — 5 kg', preco: 27.9 },
  { valor: 'feijao', rotulo: 'Feijão carioca — 1 kg', preco: 8.49 },
  { valor: 'cafe', rotulo: 'Café torrado — 500 g', preco: 18.9 },
  { valor: 'detergente', rotulo: 'Detergente neutro — 500 ml', preco: 2.79 },
  { valor: 'papel', rotulo: 'Papel A4 — resma 500 fls', preco: 32.5 },
  { valor: 'caneta', rotulo: 'Caneta esferográfica — cx 50', preco: 44.0 },
];

interface ItemPedido {
  id: number;
  produto: string;
  quantidade: number;
  preco: number;
}

export function PaginaCadastro({ rota, navegar }: { rota: string; navegar: (r: string) => void }) {
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
    cliente: !f.cliente.trim() ? (f.tipoPessoa === 'J' ? 'Informe a razão social.' : 'Informe o nome do cliente.') : undefined,
    documento: !isCpfCnpj(f.documento) ? 'Informe um CPF ou CNPJ válido.' : undefined,
    itens: !itens.length ? 'Adicione pelo menos um item.' : undefined,
    entrega: !f.entrega ? 'Informe a previsão de entrega.' : f.entrega < f.dataPedido ? 'A entrega deve ser depois da data do pedido.' : undefined,
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
    rotulo: x.rotulo,
    icone: x.icone,
    href: `#${x.rota}`,
    pendencias: tentou ? pendenciasPorForm[x.id] : undefined,
  }));

  const adicionarItem = () => {
    const p = PRODUTOS.find((x) => x.valor === f.produto);
    if (!p || !f.quantidade) {
      toast.warn('Escolha o produto e a quantidade');
      return;
    }
    setItens((l) => [...l, { id: Date.now(), produto: p.rotulo, quantidade: f.quantidade!, preco: f.preco ?? p.preco }]);
    setF((x) => ({ ...x, produto: null, quantidade: 1, preco: null }));
  };

  const salvar = () => {
    setTentou(true);
    if (pendencias) {
      toast.warn('Há campos a corrigir', `${pendencias} campo(s) a revisar.`);
      return;
    }
    setSalvando(true);
    setTimeout(() => {
      setSalvando(false);
      toast.ok(`${FORMULARIOS.find((x) => x.id === atual)!.rotulo} salvo`, f.cliente || undefined);
    }, 1000);
  };

  const juridica = f.tipoPessoa === 'J';

  return (
    <Form
      titulo="Novo pedido"
      icone="shopping-cart"
      trilha={[{ rotulo: FORMULARIOS.find((x) => x.id === atual)!.rotulo }]}
      aoSalvar={salvar}
      aoCancelar={() => navegar('/pedidos')}
      salvando={salvando}
      pendencias={tentou ? pendencias : undefined}
      menu={menu}
      menuTitulo="Cadastro do pedido"
      menuAtivo={atual}
    >
      {atual === 'cliente' && (
        <>
          <FormSecao legenda="Cliente" icone="user">
            <CampoTipoPessoa rotulo="Tipo de pessoa" valor={f.tipoPessoa} aoMudar={mudar('tipoPessoa')} />
            <CampoCpfCnpj rotulo={juridica ? 'CNPJ' : 'CPF'} obrigatorio valor={f.documento} aoMudar={mudar('documento')} erro={erro('documento')} />
            <CampoTexto
              className="lp-col-2"
              rotulo={juridica ? 'Razão social' : 'Nome completo'}
              obrigatorio
              valor={f.cliente}
              aoMudar={mudar('cliente')}
              erro={erro('cliente')}
            />
            <CampoEmail className="lp-col-2" rotulo="E-mail" valor={f.email} aoMudar={mudar('email')} dica="Recebe a confirmação do pedido" />
            <CampoTelefone className="lp-col-2" rotulo="Telefone" valor={f.telefone} aoMudar={mudar('telefone')} />
          </FormSecao>

          <FormSecao legenda="Endereço de entrega" icone="map-pin">
            <CampoCep rotulo="CEP" valor={f.cep} aoMudar={mudar('cep')} />
            <CampoUf rotulo="UF" valor={f.uf} aoMudar={mudar('uf')} />
            <CampoTexto className="lp-col-2" rotulo="Cidade" valor={f.cidade} aoMudar={mudar('cidade')} />
            <CampoTexto className="lp-col-2" rotulo="Logradouro" valor={f.logradouro} aoMudar={mudar('logradouro')} />
            <CampoTexto rotulo="Número" valor={f.numero} aoMudar={mudar('numero')} />
            <CampoTexto rotulo="Complemento" valor={f.complemento} aoMudar={mudar('complemento')} />
            <CampoTexto className="lp-col-2" rotulo="Bairro" valor={f.bairro} aoMudar={mudar('bairro')} />
          </FormSecao>
        </>
      )}

      {atual === 'itens' && (
        <>
          <FormSecao
            legenda="Itens do pedido"
            icone="list"
            acoes={<Botao rotulo="Adicionar item" icone="plus" severidade="secundario" aparencia="contorno" onClick={adicionarItem} />}
          >
            <CampoSelect
              className="lp-col-2"
              rotulo="Produto"
              comBusca
              opcoes={PRODUTOS}
              valor={f.produto}
              aoMudar={(produto) => setF((x) => ({ ...x, produto, preco: PRODUTOS.find((p) => p.valor === produto)?.preco ?? null }))}
            />
            <CampoInteiro rotulo="Quantidade" valor={f.quantidade} aoMudar={mudar('quantidade')} />
            <CampoMoeda rotulo="Preço unitário" valor={f.preco} aoMudar={mudar('preco')} dica="Preço de tabela; pode ajustar" />
            <div className="lp-col-full">
              <Tabela<ItemPedido>
                rotulo="Itens do pedido"
                registros={itens}
                erro={erro('itens')}
                vazioTitulo="Nenhum item no pedido"
                vazioDescricao="Escolha um produto acima e clique em Adicionar item."
                acoes={(i) => <AcaoLinha icone="trash-2" rotulo="Remover item" severidade="err" onClick={() => setItens((l) => l.filter((x) => x.id !== i.id))} />}
                colunas={[
                  { campo: 'produto', rotulo: 'Produto', destaque: true },
                  { campo: 'quantidade', rotulo: 'Qtd.', alinhamento: 'direita', largura: '5rem' },
                  { campo: 'preco', rotulo: 'Preço unit.', alinhamento: 'direita', formato: (v) => BRL.format(v as number) },
                  { campo: 'id', rotulo: 'Subtotal', alinhamento: 'direita', render: (i) => BRL.format(i.quantidade * i.preco) },
                ]}
              />
            </div>
          </FormSecao>

          <FormSecao legenda="Valores" icone="calculator">
            <CampoMoeda rotulo="Subtotal" valor={subtotal} disabled dica={`${itens.length} item(ns)`} />
            <CampoMoeda rotulo="Desconto" valor={f.desconto} aoMudar={mudar('desconto')} />
            <CampoMoeda rotulo="Frete" valor={f.frete} aoMudar={mudar('frete')} />
            <CampoMoeda rotulo="Total do pedido" valor={total} disabled dica="Subtotal − desconto + frete" />
          </FormSecao>
        </>
      )}

      {atual === 'pagamento' && (
        <>
          <FormSecao legenda="Pagamento" icone="wallet">
            <Escolha
              className="lp-col-2"
              rotulo="Forma de pagamento"
              opcoes={[
                { valor: 'pix', rotulo: 'Pix' },
                { valor: 'boleto', rotulo: 'Boleto' },
                { valor: 'credito', rotulo: 'Cartão' },
                { valor: 'prazo', rotulo: 'A prazo' },
              ]}
              valor={f.pagamento}
              aoMudar={mudar('pagamento')}
            />
            <CampoSelect
              rotulo="Parcelas"
              disabled={f.pagamento !== 'credito' && f.pagamento !== 'prazo'}
              opcoes={[1, 2, 3, 4, 6, 10, 12].map((n) => ({ valor: String(n), rotulo: n === 1 ? 'À vista' : `${n}× de ${BRL.format(total / n)}` }))}
              valor={f.parcelas}
              aoMudar={mudar('parcelas')}
            />
            <CampoData rotulo="Vencimento" valor={f.vencimento} aoMudar={mudar('vencimento')} />
            <CampoMarcacao className="lp-col-full" aparencia="chave" rotulo="Pagamento já confirmado" valor={f.pago} aoMudar={mudar('pago')} dica="Libera o pedido para separação no estoque." />
          </FormSecao>

          <FormSecao legenda="Prazos e entrega" icone="truck">
            <CampoData rotulo="Data do pedido" valor={f.dataPedido} aoMudar={mudar('dataPedido')} />
            <CampoData rotulo="Previsão de entrega" obrigatorio valor={f.entrega} aoMudar={mudar('entrega')} erro={erro('entrega')} />
            <CampoHora rotulo="Horário de entrega" valor={f.horario} aoMudar={mudar('horario')} />
            <CampoSelect
              rotulo="Transportadora"
              placeholder="Selecione"
              opcoes={[
                { valor: 'propria', rotulo: 'Entrega própria' },
                { valor: 'correios', rotulo: 'Correios' },
                { valor: 'rapida', rotulo: 'Rápida Log' },
                { valor: 'retirada', rotulo: 'Retirada na loja' },
              ]}
              valor={f.transportadora}
              aoMudar={mudar('transportadora')}
            />
            <CampoTextarea className="lp-col-full" rotulo="Observações" maxLength={300} valor={f.observacoes} aoMudar={mudar('observacoes')} />
          </FormSecao>
        </>
      )}
    </Form>
  );
}
