import { Busca, useToast, type ItemBusca } from '../../../../src';

const PAGINAS: ItemBusca[] = [
  { rotulo: 'Pedidos', rota: '/pedidos', icone: 'shopping-cart', trilha: 'Vendas' },
  { rotulo: 'Novo pedido', rota: '/pedidos/novo', icone: 'circle-plus', trilha: 'Vendas' },
  { rotulo: 'Clientes', rota: '/clientes', icone: 'users', trilha: 'Cadastros' },
  { rotulo: 'Categorias', rota: '/categorias', icone: 'tags', trilha: 'Cadastros' },
];

export default function Exemplo() {
  const toast = useToast();

  return (
    // atalho={false}: nesta página o Ctrl K já é da busca do topo
    <Busca
      atalho={false}
      placeholder="Buscar páginas…"
      itensMenu={PAGINAS}
      aoNavegar={(rota) => toast.info('Ir para', rota)}
      aoBuscar={(termo) => toast.info('Buscar no servidor', termo)}
    />
  );
}
