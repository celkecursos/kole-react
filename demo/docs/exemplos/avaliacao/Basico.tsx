import { useState } from 'react';
import { Avaliacao } from '../../../../src';

export default function Exemplo() {
  const [nota, setNota] = useState(4);
  const [meia, setMeia] = useState(3.5);

  return (
    <div className="demo-pilha-p">
      <Avaliacao rotulo="Avalie a entrega" valor={nota} aoMudar={setNota} mensagens={['Ruim', 'Fraca', 'Boa', 'Muito boa', 'Excelente']} />
      <Avaliacao rotulo="Meias estrelas" valor={meia} aoMudar={setMeia} passo={0.5} limpavel />
      <Avaliacao rotulo="Favoritos" icone="heart" valor={3} aoMudar={() => undefined} tamanho="pequeno" />
      {/* só leitura: aceita frações e outro máximo */}
      <Avaliacao rotulo="Nota do fornecedor" valor={7.5} max={10} somenteLeitura />
    </div>
  );
}
