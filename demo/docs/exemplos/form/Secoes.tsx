import { useState } from 'react';
import { CampoCep, CampoSelect, CampoTexto, CampoUf, FormSecao } from '../../../../src';

export default function Exemplo() {
  const [f, setF] = useState({ nome: '', categoria: null as string | null, cep: '', uf: null as string | null, cidade: '' });

  return (
    <div className="demo-pilha">
      {/* a seção monta a grade: colunas={3} e as classes lp-col-2, lp-col-3 e lp-col-full */}
      <FormSecao legenda="Produto" icone="package">
        <CampoTexto className="lp-col-2" rotulo="Nome" obrigatorio valor={f.nome} aoMudar={(nome) => setF({ ...f, nome })} />
        <CampoSelect
          rotulo="Categoria"
          valor={f.categoria}
          aoMudar={(categoria) => setF({ ...f, categoria })}
          opcoes={[
            { valor: 'bebidas', rotulo: 'Bebidas' },
            { valor: 'limpeza', rotulo: 'Limpeza' },
          ]}
        />
      </FormSecao>
      <FormSecao legenda="Endereço do depósito" icone="map-pin">
        <CampoCep rotulo="CEP" valor={f.cep} aoMudar={(cep) => setF({ ...f, cep })} />
        <CampoUf rotulo="UF" valor={f.uf} aoMudar={(uf) => setF({ ...f, uf })} />
        <CampoTexto rotulo="Cidade" valor={f.cidade} aoMudar={(cidade) => setF({ ...f, cidade })} />
      </FormSecao>
    </div>
  );
}
