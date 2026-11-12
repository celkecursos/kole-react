import { useState } from 'react';
import { CampoSelect } from '../../../../src';

export default function Exemplo() {
  const [situacao, setSituacao] = useState<string | null>(null);

  return (
    // variante="inline": pílula com o rótulo dentro, para barras de filtro
    <CampoSelect
      variante="inline"
      rotulo="Situação"
      placeholder="Todas"
      botaoLimpar
      valor={situacao}
      aoMudar={setSituacao}
      opcoes={[
        { valor: 'aberto', rotulo: 'Em aberto' },
        { valor: 'pago', rotulo: 'Pago' },
        { valor: 'cancelado', rotulo: 'Cancelado' },
      ]}
    />
  );
}
