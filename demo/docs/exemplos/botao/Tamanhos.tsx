import { Botao } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-linha">
      <Botao rotulo="Pequeno" tamanho="pequeno" />
      <Botao rotulo="Médio" />
      <Botao rotulo="Grande" tamanho="grande" />
      <Botao rotulo="Retângulo" formato="retangulo" />
    </div>
  );
}
