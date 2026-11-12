import { useState } from 'react';
import { Aba, Abas } from '../../../../src';

export default function Exemplo() {
  const [aba, setAba] = useState('mes');

  return (
    <div className="demo-pilha">
      <Abas rotulo="Período" variante="pilulas" ativa={aba} aoMudar={setAba}>
        <Aba valor="dia" rotulo="Hoje">Pedidos de hoje.</Aba>
        <Aba valor="semana" rotulo="Semana">Pedidos da semana.</Aba>
        <Aba valor="mes" rotulo="Mês">Pedidos do mês.</Aba>
      </Abas>
      <Abas rotulo="Etapas do cadastro" variante="segmentado" painel="caixa">
        <Aba valor="dados" rotulo="Dados">Primeira etapa.</Aba>
        <Aba valor="endereco" rotulo="Endereço">Segunda etapa.</Aba>
        <Aba valor="revisao" rotulo="Revisão">Terceira etapa.</Aba>
      </Abas>
    </div>
  );
}
