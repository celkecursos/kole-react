import { useState } from 'react';
import { Alerta, Botao } from '../../../../src';

export default function Exemplo() {
  const [visivel, setVisivel] = useState(true);

  return (
    <div className="demo-pilha-p">
      <Alerta
        severidade="warn"
        titulo="Assinatura vencendo"
        mensagem="Renove até sexta para não perder o acesso."
        acoes={<Botao rotulo="Renovar" severidade="warn" tamanho="pequeno" />}
        dispensavel
      />
      {visivel ? (
        <Alerta severidade="info" mensagem="Controlado pelo app: o × chama aoFechar." aoFechar={() => setVisivel(false)} />
      ) : (
        <Botao rotulo="Mostrar o alerta de novo" aparencia="texto" onClick={() => setVisivel(true)} />
      )}
    </div>
  );
}
