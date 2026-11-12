import { Detalhes, Status } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-pilha">
      <div className="demo-grade">
        <Detalhes rotulo="Pedido" valor="PED-2026-0042" />
        <Detalhes rotulo="Cliente" valor="Mercado Bom Preço" />
        <Detalhes rotulo="Entrega" valor="15/11/2026" />
        <Detalhes rotulo="Situação">
          <Status rotulo="Pago" severidade="ok" />
        </Detalhes>
      </div>
      {/* linha: rótulo e valor lado a lado */}
      <div className="demo-pilha-p">
        <Detalhes rotulo="Telefone" valor="(41) 3333-4444" disposicao="linha" />
        <Detalhes rotulo="E-mail" valor="compras@bompreco.com.br" disposicao="linha" />
      </div>
    </div>
  );
}
