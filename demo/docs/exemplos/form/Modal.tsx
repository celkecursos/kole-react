import { useState } from 'react';
import { Botao, CampoEmail, CampoTexto, Form, FormSecao, useToast } from '../../../../src';

const VAZIO = { nome: '', email: '' };

export default function Exemplo() {
  const toast = useToast();
  const [aberto, setAberto] = useState(false);
  const [f, setF] = useState(VAZIO);

  const abrir = () => {
    setF(VAZIO);
    setAberto(true);
  };
  // ao salvar, todo campo obrigatório vazio acusa a pendência, mesmo sem ter sido tocado
  const salvar = () => {
    if (!f.nome || !f.email) return;
    setAberto(false);
    toast.ok('Cliente salvo');
  };

  return (
    <>
      <Botao rotulo="Novo cliente" icone="user-plus" onClick={abrir} />
      <Form arranjo="modal" entidade="cliente" tamanho="medio" aberto={aberto} aoCancelar={() => setAberto(false)} aoSalvar={salvar}>
        <FormSecao legenda="Identificação" icone="id-card">
          <CampoTexto className="lp-col-full" rotulo="Nome" obrigatorio valor={f.nome} aoMudar={(nome) => setF({ ...f, nome })} />
          <CampoEmail className="lp-col-full" rotulo="E-mail" obrigatorio valor={f.email} aoMudar={(email) => setF({ ...f, email })} />
        </FormSecao>
      </Form>
    </>
  );
}
