import { Botao, useToast } from '../../../../src';

export default function Exemplo() {
  const toast = useToast();

  return (
    <div className="demo-linha">
      <Botao rotulo="Sucesso" severidade="ok" onClick={() => toast.ok('Pedido salvo', 'PED-2026-0042')} />
      <Botao rotulo="Informação" severidade="info" onClick={() => toast.info('Importação agendada', 'Começa às 22h.')} />
      <Botao rotulo="Atenção" severidade="warn" onClick={() => toast.warn('Estoque baixo', '3 produtos abaixo do mínimo.')} />
      <Botao rotulo="Erro" severidade="err" onClick={() => toast.err('Falha ao enviar', 'Tente de novo em instantes.')} />
    </div>
  );
}
