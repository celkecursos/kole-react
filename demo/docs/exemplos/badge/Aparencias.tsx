import { Badge } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-pilha-p">
      <div className="demo-linha">
        <Badge rotulo="Sólido" cor="ok" />
        <Badge rotulo="Suave" cor="ok" aparencia="suave" />
        <Badge rotulo="Contorno" cor="ok" aparencia="contorno" />
        <Badge rotulo="Gradiente" cor="ok" aparencia="gradiente" />
      </div>
      <div className="demo-linha">
        <Badge rotulo="Pílula" formato="pilula" />
        <Badge rotulo="Com ícone" icone="star" cor="destaque" aparencia="suave" formato="pilula" />
        <Badge rotulo="Médio" tamanho="medio" cor="info" />
      </div>
    </div>
  );
}
