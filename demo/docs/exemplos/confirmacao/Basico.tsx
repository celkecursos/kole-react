import { Botao, useConfirmacao, useToast } from '../../../../src';

export default function Exemplo() {
  const confirmar = useConfirmacao();
  const toast = useToast();

  // cada chamada devolve uma Promise: true (aceitou) ou false (recusou/fechou)
  const enviar = async () => {
    const ok = await confirmar({ titulo: 'Enviar pedido?', mensagem: 'O cliente recebe a confirmação por e-mail.', rotuloAceitar: 'Enviar' });
    if (ok) toast.ok('Pedido enviado');
  };

  const excluir = async () => {
    const ok = await confirmar.remover({ titulo: 'Excluir pedido?', mensagem: 'O pedido PED-2026-0042 será removido definitivamente.' });
    if (ok) toast.ok('Pedido excluído');
  };

  const avisar = () => confirmar.avisar({ titulo: 'Limite atingido', mensagem: 'Este plano permite até 5 usuários.', severidade: 'warn' });

  return (
    <div className="demo-linha">
      <Botao rotulo="Confirmar" onClick={enviar} />
      <Botao rotulo="Remover" severidade="err" aparencia="contorno" onClick={excluir} />
      <Botao rotulo="Só avisar" severidade="warn" aparencia="contorno" onClick={avisar} />
    </div>
  );
}
