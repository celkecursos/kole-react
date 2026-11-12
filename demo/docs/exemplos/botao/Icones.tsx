import { Botao } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-linha">
      <Botao rotulo="Novo pedido" icone="plus" />
      <Botao rotulo="Próximo" icone="arrow-right" posicaoIcone="direita" aparencia="contorno" />
      <Botao rotulo="Baixar" icone="download" iconeDestacado severidade="ok" />
      {/* só ícone: use `dica` para dar nome ao botão */}
      <Botao icone="pencil" dica="Editar" aparencia="suave" />
      <Botao icone="trash-2" dica="Excluir" severidade="err" aparencia="suave" />
    </div>
  );
}
