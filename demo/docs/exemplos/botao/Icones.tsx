import { Botao } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-linha">
      <Botao rotulo="Novo pedido" icone="plus" />
      <Botao rotulo="Próximo" icone="arrow-right" posicaoIcone="direita" aparencia="contorno" />
      <Botao rotulo="Baixar" icone="download" iconeDestacado severidade="ok" />
      {/* só ícone: aria-label dá o nome (leitor de tela) e dica mostra o balão */}
      <Botao icone="pencil" aria-label="Editar" dica="Editar" aparencia="suave" />
      <Botao icone="trash-2" aria-label="Excluir" dica="Excluir" severidade="err" aparencia="suave" />
    </div>
  );
}
