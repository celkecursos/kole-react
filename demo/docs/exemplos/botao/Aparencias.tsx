import { Botao } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-linha">
      <Botao rotulo="Sólido" />
      <Botao rotulo="Suave" aparencia="suave" />
      <Botao rotulo="Contorno" aparencia="contorno" />
      <Botao rotulo="Fantasma" aparencia="fantasma" />
      <Botao rotulo="Gradiente" aparencia="gradiente" />
      <Botao rotulo="Texto" aparencia="texto" />
    </div>
  );
}
