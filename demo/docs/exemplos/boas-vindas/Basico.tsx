import { BoasVindas, Botao } from '../../../../src';

export default function Exemplo() {
  return (
    // a saudação (bom dia, boa tarde, boa noite) segue a hora; o último acesso vira "há 26 h"
    <BoasVindas nome="Gabrielly Ribeiro da Silva" cargo="Gerente comercial" sigla="Comercial" ultimoAcesso={new Date(Date.now() - 26 * 3600 * 1000)}>
      <Botao rotulo="Novo pedido" icone="plus" />
    </BoasVindas>
  );
}
