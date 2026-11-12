import { Alerta } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-pilha-p">
      <Alerta severidade="pri" aparencia="solido" mensagem="Sólido: fundo cheio." />
      <Alerta severidade="pri" aparencia="contorno" mensagem="Contorno: só a borda." />
      <Alerta severidade="destaque" aparencia="destaque" mensagem="Destaque: fundo neutro com filete lateral." />
      <Alerta severidade="ok" aparencia="faixa" titulo="Faixa" mensagem="O título fica numa faixa sólida sobre o texto." />
    </div>
  );
}
