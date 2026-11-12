import { useState } from 'react';
import { Botao, CampoTexto, Form, FormSecao, useToast } from '../../../../src';

export default function Exemplo() {
  const toast = useToast();
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState('Bebidas');
  const [salvando, setSalvando] = useState(false);

  const salvar = async () => {
    setSalvando(true);
    // no app: await api.salvar(...)
    await new Promise((ok) => setTimeout(ok, 1500));
    setSalvando(false);
    setAberto(false);
    toast.ok('Categoria salva');
  };

  return (
    <>
      <Botao rotulo="Editar categoria" icone="pencil" aparencia="contorno" onClick={() => setAberto(true)} />
      {/* salvando: o Salvar gira e recusa o clique; o Cancelar fica desabilitado */}
      <Form arranjo="modal" entidade="categoria" modo="editar" tamanho="pequeno" aberto={aberto} salvando={salvando} aoSalvar={salvar} aoCancelar={() => setAberto(false)}>
        <FormSecao legenda="Categoria">
          <CampoTexto className="lp-col-full" rotulo="Nome" obrigatorio valor={nome} aoMudar={setNome} />
        </FormSecao>
      </Form>
    </>
  );
}
