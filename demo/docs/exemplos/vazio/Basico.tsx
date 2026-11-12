import { Botao, Vazio } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-grade-2">
      <Vazio titulo="Nenhum pedido ainda" descricao="Os pedidos cadastrados aparecem aqui.">
        <Botao rotulo="Novo pedido" icone="plus" tamanho="pequeno" />
      </Vazio>
      <Vazio icone="search" titulo="Nada encontrado" descricao="Tente outro termo ou limpe os filtros." />
    </div>
  );
}
