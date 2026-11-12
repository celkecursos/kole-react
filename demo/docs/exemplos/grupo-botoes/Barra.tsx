import { BarraBotoes, Botao } from '../../../../src';

export default function Exemplo() {
  return (
    // distribuicao="entre": o primeiro grupo à esquerda, o resto à direita
    <BarraBotoes rotulo="Ações do pedido" distribuicao="entre">
      <Botao rotulo="Excluir" icone="trash-2" severidade="err" aparencia="texto" />
      <div className="demo-linha">
        <Botao rotulo="Cancelar" severidade="secundario" aparencia="contorno" />
        <Botao rotulo="Salvar" icone="save" />
      </div>
    </BarraBotoes>
  );
}
