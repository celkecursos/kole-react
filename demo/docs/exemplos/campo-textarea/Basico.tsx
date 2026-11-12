import { useState } from 'react';
import { CampoTextarea } from '../../../../src';

export default function Exemplo() {
  const [obs, setObs] = useState('Entregar no período da manhã.');

  return (
    <div className="demo-grade-2">
      {/* com maxLength, o contador mostra o que falta */}
      <CampoTextarea rotulo="Observações" maxLength={200} rows={4} valor={obs} aoMudar={setObs} dica="Aparece na nota de entrega." />
      <CampoTextarea rotulo="Motivo do cancelamento" obrigatorio rows={4} valor="" erro="Informe o motivo." />
    </div>
  );
}
