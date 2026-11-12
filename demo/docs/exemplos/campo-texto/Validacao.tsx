import { useState } from 'react';
import { CampoTexto } from '../../../../src';

export default function Exemplo() {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');

  return (
    <div className="demo-grade-2">
      {/* o erro aparece ao sair do campo depois de digitar */}
      <CampoTexto
        rotulo="E-mail"
        type="email"
        valor={email}
        aoMudar={setEmail}
        validar={(v) => (v && !/^\S+@\S+\.\S+$/.test(v) ? 'Informe um e-mail válido.' : '')}
      />
      <CampoTexto rotulo="Código do produto" valor={codigo} aoMudar={setCodigo} aviso="Código já usado em outro produto." />
      <CampoTexto rotulo="Erro vindo do servidor" valor="ABC" erro="Este código não existe." />
      <CampoTexto rotulo="Desabilitado" valor="Não editável" disabled />
    </div>
  );
}
