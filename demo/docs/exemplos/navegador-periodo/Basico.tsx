import { useState } from 'react';
import { NavegadorPeriodo, noPeriodo, periodoDe, rotuloPeriodo } from '../../../../src';

const VENDAS = ['2026-09-12', '2026-10-03', '2026-10-28', '2026-11-05', '2026-11-13'];

export default function Exemplo() {
  // começa no mês corrente
  const [periodo, setPeriodo] = useState(() => periodoDe('mes'));
  const noIntervalo = VENDAS.filter((d) => noPeriodo(d, periodo)).length;
  return (
    <div className="demo-pilha">
      <NavegadorPeriodo valor={periodo} aoMudar={setPeriodo} />
      <small>
        {periodo.de} a {periodo.ate} · {noIntervalo} de {VENDAS.length} vendas em {rotuloPeriodo(periodo)}
      </small>
    </div>
  );
}
