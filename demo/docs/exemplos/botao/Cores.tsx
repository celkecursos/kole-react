import { Botao } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-linha">
      <Botao rotulo="Principal" />
      <Botao rotulo="Secundário" severidade="secundario" />
      <Botao rotulo="Destaque" severidade="destaque" />
      <Botao rotulo="Sucesso" severidade="ok" />
      <Botao rotulo="Atenção" severidade="warn" />
      <Botao rotulo="Erro" severidade="err" />
      <Botao rotulo="Info" severidade="info" />
      <Botao rotulo="Escuro" severidade="escuro" />
    </div>
  );
}
