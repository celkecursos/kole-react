import { useState } from 'react';
import { CampoTexto } from '../../../../src';

export default function Exemplo() {
  const [nome, setNome] = useState('');

  return (
    <CampoTexto
      rotulo="Nome do cliente"
      placeholder="Ex.: Mercado Bom Preço"
      dica="Como aparece na nota fiscal."
      obrigatorio
      valor={nome}
      aoMudar={setNome}
    />
  );
}
