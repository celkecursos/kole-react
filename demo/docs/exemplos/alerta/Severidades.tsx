import { Alerta } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-pilha-p">
      <Alerta severidade="info" mensagem="A importação roda à noite e termina até as 6h." />
      <Alerta severidade="ok" titulo="Pedido enviado" mensagem="O cliente recebe o aviso por e-mail." />
      <Alerta severidade="warn" mensagem="O certificado digital vence em 12 dias." />
      <Alerta severidade="err" titulo="Falha ao salvar" mensagem="Confira os campos destacados e tente de novo." />
    </div>
  );
}
