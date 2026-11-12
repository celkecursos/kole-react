import { useState } from 'react';
import { Chip } from '../../../../src';

export default function Exemplo() {
  const [filtros, setFiltros] = useState([
    { campo: 'Cliente', rotulo: 'Mercado Bom Preço' },
    { campo: 'Situação', rotulo: 'Pago' },
    { campo: 'UF', rotulo: 'PR' },
  ]);

  return (
    <div className="demo-linha">
      {filtros.map((f) => (
        <Chip key={f.campo} campo={f.campo} rotulo={f.rotulo} aoRemover={() => setFiltros(filtros.filter((x) => x !== f))} />
      ))}
      {!filtros.length && <span>Nenhum filtro aplicado.</span>}
      <Chip rotulo="Só leitura" />
    </div>
  );
}
