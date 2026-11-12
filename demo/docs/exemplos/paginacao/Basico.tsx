import { useState } from 'react';
import { Paginacao } from '../../../../src';

export default function Exemplo() {
  const [pagina, setPagina] = useState(3);
  const [tamanho, setTamanho] = useState(20);

  return (
    <Paginacao
      total={487}
      pagina={pagina}
      tamanho={tamanho}
      aoMudarPagina={setPagina}
      aoMudarTamanho={(t) => {
        setTamanho(t);
        setPagina(1);
      }}
    />
  );
}
