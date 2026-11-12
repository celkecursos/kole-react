import { Botao, useToast } from '../../../../src';

export default function Exemplo() {
  const toast = useToast();
  return <Botao rotulo="Salvar" onClick={() => toast.ok('Salvo')} />;
}
