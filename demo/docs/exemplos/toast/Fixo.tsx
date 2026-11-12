import { Botao, Toast } from '../../../../src';

export default function Exemplo() {
  return (
    // o cartão do toast direto na página, como aviso fixo
    <Toast
      severidade="info"
      modelo="cabecalho"
      titulo="Atualização do sistema"
      tempo="há 5 min"
      detalhe="A versão 2.4 entra no ar hoje às 22h. Salve o que estiver fazendo antes disso."
      acoes={<Botao rotulo="Ver novidades" tamanho="pequeno" aparencia="texto" />}
    />
  );
}
