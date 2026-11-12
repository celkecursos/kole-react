import { Balao, Botao } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-linha">
      <Balao titulo="Frete grátis" conteudo="Pedidos acima de R$ 300 em Curitiba e região metropolitana.">
        <Botao rotulo="Sobre o frete" aparencia="contorno" />
      </Balao>
      <Balao aparencia="cabecalho" cor="destaque" posicao="baixo" titulo="Novidade" conteudo="Agora dá para exportar os pedidos em planilha.">
        <Botao rotulo="Cabeçalho colorido" severidade="destaque" aparencia="contorno" />
      </Balao>
      {/* gatilho="passar": abre no hover e no foco, como uma dica rica */}
      <Balao gatilho="passar" posicao="direita" conteudo="Abre no hover e no foco.">
        <Botao rotulo="Passe o mouse" aparencia="texto" />
      </Balao>
    </div>
  );
}
