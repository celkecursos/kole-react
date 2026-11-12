import { Botao, CabecalhoPagina } from '../../../../src';

export default function Exemplo() {
  return (
    <CabecalhoPagina
      titulo="Pedidos"
      icone="shopping-cart"
      categoria="Vendas"
      // trilha: o caminho vem do menu da Estrutura; a lista acrescenta passos no fim
      trilha={[{ rotulo: 'PED-2026-0042' }]}
      acoes={
        <>
          <Botao rotulo="Exportar" icone="download" severidade="secundario" aparencia="contorno" />
          <Botao rotulo="Novo pedido" icone="plus" />
        </>
      }
    >
      Pedidos dos últimos 30 dias. Use os filtros para ver períodos anteriores.
    </CabecalhoPagina>
  );
}
