import { useState } from 'react';
import { CampoTexto } from '../../../../src';

export default function Exemplo() {
  const [cpf, setCpf] = useState('');
  const [placa, setPlaca] = useState('');

  return (
    <div className="demo-grade-2">
      {/* `0` = dígito · `A` = letra · `S` = letra ou dígito */}
      <CampoTexto rotulo="CPF" mascara="000.000.000-00" valor={cpf} aoMudar={setCpf} inputMode="numeric" />
      <CampoTexto rotulo="Placa" mascara="AAA-0S00" maiuscula valor={placa} aoMudar={setPlaca} />
    </div>
  );
}
