import { useState } from 'react';
import { Avaliacao, useToast } from '../../../../src';

export default function Exemplo() {
  const toast = useToast();
  const [nota, setNota] = useState(0);

  // aoMudar devolvendo uma Promise: o componente espera e mostra "Salvando..."
  const salvar = (v: number) =>
    new Promise<void>((ok) =>
      setTimeout(() => {
        setNota(v);
        toast.ok('Nota enviada', `${v} de 5`);
        ok();
      }, 1200),
    );

  return <Avaliacao rotulo="Avalie o atendimento" valor={nota} aoMudar={salvar} textoOcupado="Enviando sua nota..." />;
}
