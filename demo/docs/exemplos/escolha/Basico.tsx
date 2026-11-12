import { useState } from 'react';
import { Escolha } from '../../../../src';

export default function Exemplo() {
  const [periodo, setPeriodo] = useState<string | null>('mes');
  const [entrega, setEntrega] = useState<string | null>(null);

  return (
    <div className="demo-grade-2">
      <Escolha
        rotulo="Período"
        valor={periodo}
        aoMudar={setPeriodo}
        opcoes={[
          { valor: 'dia', rotulo: 'Dia' },
          { valor: 'semana', rotulo: 'Semana' },
          { valor: 'mes', rotulo: 'Mês' },
        ]}
      />
      <Escolha
        rotulo="Entrega"
        aparencia="radio"
        obrigatorio
        valor={entrega}
        aoMudar={setEntrega}
        opcoes={[
          { valor: 'retirar', rotulo: 'Retirar na loja' },
          { valor: 'motoboy', rotulo: 'Motoboy (mesmo dia)' },
          { valor: 'correio', rotulo: 'Correio', desabilitada: true },
        ]}
      />
    </div>
  );
}
