import { useState } from 'react';
import { CabecalhoPagina, Paginacao } from '../../../src';
import { Bloco } from '../Bloco';
import { useT } from '../../i18n/useT';

export function PaginaPaginacoes() {
  const { t } = useT();
  const [pagina, setPagina] = useState(3);
  const [tamanho, setTamanho] = useState(10);
  const [simples, setSimples] = useState(1);
  const [poucas, setPoucas] = useState(2);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.paginacao.titulo')} icone="chevrons-right" trilha />

      <Bloco titulo={t('paginas.paginacao.secoes.completa')} descricao={t('paginas.paginacao.textos.totalPaginasEEscolha')}>
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

      <Bloco titulo={t('paginas.paginacao.secoes.semEscolhaDeTamanho')} descricao={t('paginas.paginacao.textos.semAomudartamanhoSoA')}>
        <Paginacao total={120} pagina={simples} tamanho={10} aoMudarPagina={setSimples} />
      </Bloco>

      <Bloco titulo={t('paginas.paginacao.secoes.poucasPaginas')}>
        <Paginacao total={32} pagina={poucas} tamanho={10} aoMudarPagina={setPoucas} />
      </Bloco>

      <Bloco titulo={t('paginas.paginacao.secoes.embutida')} descricao={t('paginas.paginacao.textos.semBordaPropriaPara')}>
        <div style={{ border: 'var(--hairline) solid var(--border)', borderRadius: 'var(--r-card)' }}>
          <Paginacao total={230} pagina={pagina} tamanho={tamanho} aoMudarPagina={setPagina} embutida />
        </div>
      </Bloco>
    </div>
  );
}
