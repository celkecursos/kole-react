import type { ReactNode } from 'react';
import { CabecalhoPagina, type IconeProp } from '../../src';
import type { ChaveTexto, TextosDemo } from '../i18n/tipos';
import { useT } from '../i18n/useT';
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

/** Página da documentação no dicionário: `docs.<pagina>` (demo/i18n/pt-BR/docs). `comum` são os textos de PaginaDoc/TabelaProps/Exemplo. */
export type PaginaDocChave = Exclude<keyof TextosDemo['docs'], 'comum'>;

/**
 * Título e resumo da página no idioma ativo: `docs.<pagina>.titulo` e
 * `docs.<pagina>.textos.resumo` (o resumo, por enquanto, só em pt-BR). Um
 * `resumo` passado na prop vale mais que o do dicionário (ex.: com contagem).
 */
function useCabecalhoDoc(pagina: PaginaDocChave, resumo?: ReactNode) {
  const { t } = useT();
  return {
    t,
    titulo: t(`docs.${pagina}.titulo`),
    // nem toda página tem um resumo de texto simples (o índice usa plural): a chave é conferida aqui, não no tipo
    resumo: resumo ?? t(`docs.${pagina}.textos.resumo` as ChaveTexto),
  };
}

/** Página-guia (Instalação, Tema): cabeçalho + texto. */
export function PaginaGuia({ pagina, icone, resumo, children }: { pagina: PaginaDocChave; icone: IconeProp; resumo?: ReactNode; children: ReactNode }) {
  const cab = useCabecalhoDoc(pagina, resumo);
  return (
    <article className="doc">
      <CabecalhoPagina titulo={cab.titulo} icone={icone} categoria={cab.t('menu.secoes.documentacao')} trilha>
        {cab.resumo}
      </CabecalhoPagina>
      {children}
    </article>
  );
}

interface PaginaComponenteProps {
  /** Chave da página no dicionário (`docs.<pagina>`): dá o título e o resumo. */
  pagina: PaginaDocChave;
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
  /** Só quando o resumo do dicionário não serve (ex.: tem contagem ou marcação). */
  resumo?: ReactNode;
  /** Padrões que não saem da desestruturação (ver TabelaProps). */
  padroes?: Record<string, string>;
  /** Exemplos e seções de uso. */
  children: ReactNode;
  /** Notas finais: acessibilidade, quando usar. */
  notas?: ReactNode;
}

/** Página de um componente: resumo, import, exemplos, props e notas. */
export function PaginaComponente({
  pagina,
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
  const { t } = useT();
  const cab = useCabecalhoDoc(pagina, resumo);
  const tabelas = [...(semPropsProprias ? [] : [componente]), ...outros, ...tipos];
  return (
    <article className="doc">
      <CabecalhoPagina titulo={cab.titulo} icone={icone} categoria={cab.t('menu.docs.componentes')} trilha>
        {cab.resumo}
      </CabecalhoPagina>
      <Secao id="importar" titulo={t('docs.comum.secoes.importar')}>
        <Codigo codigo={linhaImport([componente, ...outros, ...importar])} />
      </Secao>
      <Secao id="exemplos" titulo={t('docs.comum.secoes.exemplos')}>
        {children}
      </Secao>
      <Secao id="props" titulo={t('docs.comum.secoes.props')}>
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
        <Secao id="notas" titulo={t('docs.comum.secoes.notas')}>
          {notas}
        </Secao>
      )}
    </article>
  );
}
