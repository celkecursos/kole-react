import { useState } from 'react';
import { Picklist, type PicklistValor } from '../../../../src';

const PERMISSOES = ['Cadastrar pedido', 'Editar pedido', 'Excluir pedido', 'Aprovar desconto', 'Emitir nota fiscal', 'Ver relatórios'];

export default function Exemplo() {
  const [valor, setValor] = useState<PicklistValor<string>>({ fonte: PERMISSOES.slice(2), alvo: PERMISSOES.slice(0, 2) });

  return (
    <Picklist
      rotulo="Permissões do perfil"
      rotuloFonte="Disponíveis"
      rotuloAlvo="Concedidas"
      filtro
      valor={valor}
      aoMudar={setValor}
    />
  );
}
