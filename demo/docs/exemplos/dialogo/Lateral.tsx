import { useState } from 'react';
import { Botao, Dialogo } from '../../../../src';

export default function Exemplo() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <Botao rotulo="Ver detalhes" icone="panel-right" aparencia="contorno" onClick={() => setAberto(true)} />
      <Dialogo
        aberto={aberto}
        aoFechar={() => setAberto(false)}
        titulo="Pedido PED-2026-0042"
        aparencia="lateral"
        tom="escuro"
        rodape={<Botao rotulo="Fechar" onClick={() => setAberto(false)} />}
      >
        <p>Painel encostado à direita, com a altura da tela. Bom para detalhes e filtros sem sair da listagem.</p>
      </Dialogo>
    </>
  );
}
