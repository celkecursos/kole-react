import { useState } from 'react';
import { SeletorContexto, useToast } from '../../../../src';

export default function Exemplo() {
  const toast = useToast();
  const [espaco, setEspaco] = useState('pessoal');
  return (
    <SeletorContexto
      opcoes={[
        { id: 'pessoal', nome: 'Minhas finanças', descricao: 'Pessoal', icone: 'wallet' },
        { id: 'aurora', nome: 'Estúdio Aurora', descricao: 'CNPJ 12.345.678/0001-90', icone: 'building-2', cor: 'graf-3' },
        { id: 'filial', nome: 'Aurora Filial Sul', descricao: 'CNPJ 12.345.678/0002-71', cor: 'ok' },
      ]}
      valor={espaco}
      aoMudar={(id) => {
        setEspaco(id);
        toast.info('Espaço trocado', id);
      }}
      acoes={[{ id: 'gerenciar', rotulo: 'Gerenciar empresas', icone: 'settings' }]}
      aoEscolherAcao={() => toast.info('Gerenciar empresas')}
    />
  );
}
