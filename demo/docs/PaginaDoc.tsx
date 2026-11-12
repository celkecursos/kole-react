import type { ReactNode } from 'react';
import { CabecalhoPagina, type IconeProp } from '../../src';
import { Codigo } from './Codigo';
import { TabelaProps } from './TabelaProps';

/** `import { … } from '@celke/kole-react'`, quebrando em linhas quando passa de 80 colunas. */
function linhaImport(nomes: string[]) {
  const pacote = "from '@celke/kole-react';";
  const curta = `import { ${nomes.join(', ')} } ${pacote}`;
  return curta.length <= 80 ? curta : `import {\n${nomes.map((n) => `  ${n},`).join('\n')}\n} ${pacote}`;
}

/** Seção da página de documentação (título com âncora). */
export function Secao({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <section className="doc-secao" id={id}>
      <h2 className="doc-secao-titulo">{titulo}</h2>
      {children}
    </section>
  );
}

/** Página-guia (Instalação, Tema): cabeçalho + texto. */
export function PaginaGuia({ titulo, icone, resumo, children }: { titulo: string; icone: IconeProp; resumo: ReactNode; children: ReactNode }) {
  return (
    <article className="doc">
      <CabecalhoPagina titulo={titulo} icone={icone} categoria="Documentação" trilha>
        {resumo}
      </CabecalhoPagina>
      {children}
    </article>
  );
}

interface PaginaComponenteProps {
  titulo: string;
  icone: IconeProp;
  /** Nome exportado pelo pacote (também a chave em props.gerado.json). */
  componente: string;
  /** Outros componentes da página que também ganham tabela de props (ex.: `Aba` em Abas). */
  outros?: string[];
  /** Tabelas extras de tipos usados pelo componente (ex.: `Coluna`, `OpcoesToast`). */
  tipos?: string[];
  /** Sem tabela do próprio componente (quando a API é um hook: só `tipos`). */
  semPropsProprias?: boolean;
  /** Outros nomes que o import do exemplo mostra (tipos, hooks). */
  importar?: string[];
  resumo: ReactNode;
  /** Padrões que não saem da desestruturação (ver TabelaProps). */
  padroes?: Record<string, string>;
  /** Exemplos e seções de uso. */
  children: ReactNode;
  /** Notas finais: acessibilidade, quando usar. */
  notas?: ReactNode;
}

/** Página de um componente: resumo, import, exemplos, props e notas. */
export function PaginaComponente({
  titulo,
  icone,
  componente,
  outros = [],
  tipos = [],
  semPropsProprias = false,
  importar = [],
  resumo,
  padroes,
  children,
  notas,
}: PaginaComponenteProps) {
  const tabelas = [...(semPropsProprias ? [] : [componente]), ...outros, ...tipos];
  return (
    <article className="doc">
      <CabecalhoPagina titulo={titulo} icone={icone} categoria="Componentes" trilha>
        {resumo}
      </CabecalhoPagina>
      <Secao id="importar" titulo="Importar">
        <Codigo codigo={linhaImport([componente, ...outros, ...importar])} />
      </Secao>
      <Secao id="exemplos" titulo="Exemplos">
        {children}
      </Secao>
      <Secao id="props" titulo="Props">
        {tabelas.length > 1 ? (
          tabelas.map((c) => (
            <div key={c} className="doc-props-bloco">
              <h3 className="doc-exemplo-titulo">{c}</h3>
              <TabelaProps componente={c} padroes={c === componente ? padroes : undefined} />
            </div>
          ))
        ) : (
          <TabelaProps componente={tabelas[0]} padroes={padroes} />
        )}
      </Secao>
      {notas && (
        <Secao id="notas" titulo="Boas práticas">
          {notas}
        </Secao>
      )}
    </article>
  );
}
