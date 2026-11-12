import { useState } from 'react';
import { ItemLista, Lista } from '../../../../src';

const TAREFAS = ['Conferir estoque', 'Emitir notas do dia', 'Responder clientes'];

export default function Exemplo() {
  const [feitas, setFeitas] = useState<string[]>(['Conferir estoque']);
  const [envio, setEnvio] = useState('motoboy');

  return (
    <div className="demo-grade-2">
      <Lista rotulo="Tarefas">
        {TAREFAS.map((t) => (
          <ItemLista
            key={t}
            marcacao="caixa"
            marcado={feitas.includes(t)}
            aoMarcar={(m) => setFeitas(m ? [...feitas, t] : feitas.filter((f) => f !== t))}
          >
            {t}
          </ItemLista>
        ))}
      </Lista>
      <Lista rotulo="Envio">
        {[
          ['retirar', 'Retirar na loja'],
          ['motoboy', 'Motoboy'],
          ['correio', 'Correio'],
        ].map(([id, rotulo]) => (
          <ItemLista key={id} marcacao="radio" nome="envio" marcado={envio === id} aoMarcar={() => setEnvio(id)}>
            {rotulo}
          </ItemLista>
        ))}
      </Lista>
    </div>
  );
}
