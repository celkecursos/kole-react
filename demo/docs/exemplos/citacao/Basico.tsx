import { Citacao } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-pilha">
      <Citacao autor="Equipe de logística" fonte="Manual de entregas, 2026">
        Pedido pago até as 14h sai no mesmo dia; depois disso, no dia útil seguinte.
      </Citacao>
      <Citacao aparencia="cartao" cor="destaque" icone="triangle-alert" autor="Financeiro">
        Descontos acima de 15% precisam de aprovação do gerente.
      </Citacao>
    </div>
  );
}
