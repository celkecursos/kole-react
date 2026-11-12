import { Badge } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-linha">
      <Badge rotulo="Principal" />
      <Badge rotulo="Destaque" cor="destaque" />
      <Badge rotulo="Pago" cor="ok" />
      <Badge rotulo="Pendente" cor="warn" />
      <Badge rotulo="Cancelado" cor="err" />
      <Badge rotulo="Novo" cor="info" />
      <Badge rotulo="Arquivado" cor="neutral" />
    </div>
  );
}
