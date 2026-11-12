import { useState } from 'react';
import { Badge, ItemLista, Lista } from '../../../../src';

export default function Exemplo() {
  const [ativo, setAtivo] = useState('geral');

  return (
    <div className="demo-grade-2">
      <Lista rotulo="Configurações">
        {[
          ['geral', 'settings', 'Geral'],
          ['notificacoes', 'bell', 'Notificações'],
          ['seguranca', 'shield', 'Segurança'],
        ].map(([id, icone, titulo]) => (
          <ItemLista key={id} icone={icone} ativo={ativo === id} onClick={() => setAtivo(id)} fim={id === 'notificacoes' && <Badge rotulo="3" cor="err" />}>
            {titulo}
          </ItemLista>
        ))}
        <ItemLista icone="lock" desabilitado>
          Integrações (em breve)
        </ItemLista>
      </Lista>
      <Lista rotulo="Contatos" variante="sem-borda">
        <ItemLista icone="mail" titulo="Ana Trindade">
          ana@exemplo.com
        </ItemLista>
        <ItemLista icone="phone" titulo="Alexandre Russo">
          (21) 97546-1234
        </ItemLista>
      </Lista>
    </div>
  );
}
