import { Botao, DestaqueSite } from '../../../../src';

export default function Exemplo() {
  return (
    <DestaqueSite
      sobretitulo="Gestão comercial"
      titulo="Venda mais com menos planilha"
      realce="menos planilha"
      descricao="Pedidos, estoque e clientes num só lugar, do balcão ao celular."
    >
      {/* children: as ações, abaixo da descrição */}
      <div className="demo-linha">
        <Botao rotulo="Começar grátis" severidade="destaque" />
        <Botao rotulo="Ver planos" aparencia="contorno" />
      </div>
    </DestaqueSite>
  );
}
