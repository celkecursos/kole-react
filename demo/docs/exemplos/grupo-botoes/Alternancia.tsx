import { useState } from 'react';
import { GrupoAlternancia } from '../../../../src';

export default function Exemplo() {
  const [periodo, setPeriodo] = useState<string | null>('semana');
  const [colunas, setColunas] = useState<string[]>(['cliente', 'total']);

  return (
    <div className="demo-pilha-p">
      <GrupoAlternancia
        rotulo="Período"
        formato="retangulo"
        valor={periodo}
        aoMudar={setPeriodo}
        opcoes={[
          { valor: 'dia', rotulo: 'Hoje' },
          { valor: 'semana', rotulo: 'Semana' },
          { valor: 'mes', rotulo: 'Mês' },
        ]}
      />
      {/* multiplo: liga e desliga cada opção */}
      <GrupoAlternancia
        multiplo
        rotulo="Colunas visíveis"
        formato="retangulo"
        valor={colunas}
        aoMudar={setColunas}
        opcoes={[
          { valor: 'cliente', rotulo: 'Cliente' },
          { valor: 'total', rotulo: 'Total' },
          { valor: 'situacao', rotulo: 'Situação' },
        ]}
      />
    </div>
  );
}
