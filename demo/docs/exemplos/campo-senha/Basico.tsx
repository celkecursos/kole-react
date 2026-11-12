import { useState } from 'react';
import { CampoSenha } from '../../../../src';

export default function Exemplo() {
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmar, setConfirmar] = useState('');

  return (
    <div className="demo-grade-2">
      {/* login: só o botão de revelar */}
      <CampoSenha rotulo="Senha atual" valor={atual} aoMudar={setAtual} />
      {/* troca de senha: medidor de força e política */}
      <CampoSenha
        rotulo="Nova senha"
        forca
        politica={{ minimo: 10, exigirMaiuscula: true, exigirDigito: true, exigirSimbolo: true }}
        autoComplete="new-password"
        valor={nova}
        aoMudar={setNova}
      />
      <CampoSenha
        rotulo="Confirmar nova senha"
        autoComplete="new-password"
        valor={confirmar}
        aoMudar={setConfirmar}
        validar={(v) => (v === nova ? '' : 'As senhas não conferem')}
      />
    </div>
  );
}
