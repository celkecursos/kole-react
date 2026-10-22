import { useState } from 'react';
import { CabecalhoPagina, Paginacao } from '../../../src';
import { Bloco } from '../Bloco';

export function PaginaPaginacoes() {
  const [pagina, setPagina] = useState(3);
  const [tamanho, setTamanho] = useState(10);
  const [simples, setSimples] = useState(1);
  const [poucas, setPoucas] = useState(2);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Paginação" icone="chevrons-right" trilha />

      <Bloco titulo="Completa" descricao="Total, páginas e escolha da quantidade por página.">
        <Paginacao
          total={230}
          pagina={pagina}
          tamanho={tamanho}
          tamanhoOpcoes={[10, 25, 50]}
          aoMudarPagina={setPagina}
          aoMudarTamanho={(t) => {
            setTamanho(t);
            setPagina(1);
          }}
        />
      </Bloco>

      <Bloco titulo="Sem escolha de tamanho" descricao="Sem aoMudarTamanho, só a navegação entre páginas.">
        <Paginacao total={120} pagina={simples} tamanho={10} aoMudarPagina={setSimples} />
      </Bloco>

      <Bloco titulo="Poucas páginas">
        <Paginacao total={32} pagina={poucas} tamanho={10} aoMudarPagina={setPoucas} />
      </Bloco>

      <Bloco titulo="Embutida" descricao="Sem borda própria, para usar dentro de um card ou tabela.">
        <div style={{ border: 'var(--hairline) solid var(--border)', borderRadius: 'var(--r-card)' }}>
          <Paginacao total={230} pagina={pagina} tamanho={tamanho} aoMudarPagina={setPagina} embutida />
        </div>
      </Bloco>
    </div>
  );
}
