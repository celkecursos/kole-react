import { Botao, Dica } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-linha">
      <Dica texto="Dica em cima" posicao="cima">
        <Botao rotulo="Em cima" aparencia="contorno" />
      </Dica>
      <Dica texto="Dica à direita" posicao="direita">
        <Botao rotulo="À direita" aparencia="contorno" />
      </Dica>
      <Dica texto="Dica embaixo" posicao="baixo" cor="pri">
        <Botao rotulo="Embaixo" aparencia="contorno" />
      </Dica>
      {/* no Botao, a prop dica faz o mesmo; o nome acessível continua no aria-label */}
      <Botao icone="printer" aria-label="Imprimir" dica="Imprimir" aparencia="suave" />
    </div>
  );
}
