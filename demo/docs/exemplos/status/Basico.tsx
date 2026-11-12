import { Status } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-linha">
      <Status rotulo="Pago" severidade="ok" />
      <Status rotulo="Em análise" severidade="info" />
      <Status rotulo="Aguardando pagamento" severidade="warn" />
      <Status rotulo="Cancelado" severidade="err" />
      <Status rotulo="Rascunho" />
      <Status rotulo="Enviado" severidade="ok" icone="truck" />
    </div>
  );
}
