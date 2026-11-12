import type { ReactNode } from 'react';
import { CabecalhoPagina, type IconeProp } from '../../src';
import { Codigo } from './Codigo';
import { TabelaProps } from './TabelaProps';

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
export function PaginaComponente({ titulo, icone, componente, importar = [], resumo, padroes, children, notas }: PaginaComponenteProps) {
  return (
    <article className="doc">
      <CabecalhoPagina titulo={titulo} icone={icone} categoria="Componentes" trilha>
        {resumo}
      </CabecalhoPagina>
      <Secao id="importar" titulo="Importar">
        <Codigo codigo={`import { ${[componente, ...importar].join(', ')} } from '@celke/kole-react';`} />
      </Secao>
      <Secao id="exemplos" titulo="Exemplos">
        {children}
      </Secao>
      <Secao id="props" titulo="Props">
        <TabelaProps componente={componente} padroes={padroes} />
      </Secao>
      {notas && (
        <Secao id="notas" titulo="Boas práticas">
          {notas}
        </Secao>
      )}
    </article>
  );
}
