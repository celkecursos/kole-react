import { useState } from 'react';
import { Botao, CampoTexto, Dialogo } from '../../../../src';

export default function Exemplo() {
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState('');
  const fechar = () => setAberto(false);

  return (
    <>
      <Botao rotulo="Nova categoria" icone="plus" onClick={() => setAberto(true)} />
      <Dialogo
        aberto={aberto}
        aoFechar={fechar}
        titulo="Nova categoria"
        subtitulo="Agrupa os produtos no catálogo."
        icone="tags"
        tamanho="pequeno"
        rodape={
          <>
            <Botao rotulo="Cancelar" severidade="secundario" aparencia="contorno" onClick={fechar} />
            <Botao rotulo="Salvar" onClick={fechar} />
          </>
        }
      >
        <CampoTexto rotulo="Nome" valor={nome} aoMudar={setNome} obrigatorio autoFocus />
      </Dialogo>
    </>
  );
}
