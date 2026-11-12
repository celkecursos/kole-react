import { Placa } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-linha">
      <Placa numero="BRA2E19" />
      <Placa numero="RIO4A21" uf="RJ" />
      <Placa numero="ABC1D23" uf="SP" />
    </div>
  );
}
