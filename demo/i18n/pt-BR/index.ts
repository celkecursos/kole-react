/**
 * Textos da demo em pt-BR: a FONTE. Toda chave nasce aqui; `en/` e `es/` são
 * parciais e o que faltar neles sai em português.
 *
 * ## Onde fica cada texto
 *
 * O dicionário de cada idioma é uma pasta com um arquivo por área, juntados
 * neste index:
 *
 * - `menu.ts`: o menu lateral (`menu.*`).
 * - `paginas/<area>.ts`: telas da demo, por grupo do menu (`geral`, `tabelas`,
 *   `ui`, `avancado`, `apps`, `financas`, `site`, `erro`).
 * - `docs/<area>.ts`: documentação: `guias` (Instalação, Tema… e o `comum` de
 *   PaginaDoc/TabelaProps/Exemplo) e uma área por categoria de componentes
 *   (`acoes`, `formularios`, `dados`, `feedback`, `navegacao`, `telas`).
 *
 * Os arquivos de `en/` e `es/` têm a mesma divisão e são tipados pelo arquivo
 * pt-BR correspondente: chave que não existe aqui é erro de tipo lá.
 *
 * ## Convenção de chaves
 *
 * - `menu.*`: `menu.secoes.<secao>` é o título da seção, `menu.itens.<item>`
 *   cada link da demo e `menu.docs.*` a parte da documentação. O `rotulo` em
 *   demo/nav.ts e demo/docs/nav.ts continua o texto pt-BR e tem que ser igual
 *   ao daqui (o teste em tests/visual/demo.spec.ts confere).
 * - `paginas.<tela>.titulo|secoes|textos`: telas da demo (pedidos, perfil,
 *   finanças…). `titulo` é o do CabecalhoPagina (ou do Form); `secoes.<nome>`
 *   os títulos de Bloco, Card e as legendas de FormSecao; `textos.<nome>` o
 *   resto (rótulos, parágrafos, mensagens, toasts).
 * - `docs.<pagina>.titulo|secoes|textos`: páginas da documentação, no mesmo
 *   formato. `<pagina>` é o slug em camelCase (`campo-texto` → `campoTexto`);
 *   em `secoes`, a chave é o `id` da `<Secao>` em camelCase
 *   (`primeira-tela` → `primeiraTela`); `textos.resumo` é o resumo do cabeçalho.
 *
 * Cada folha é um texto (com `{valor}` para interpolar) ou um plural no
 * formato `Plural` da biblioteca (`{ one, other }`, com `{n}` já formatado no
 * idioma).
 *
 * ## Marcação dentro do texto
 *
 * Um parágrafo com trechos destacados fica numa chave só, com marcação, e a
 * página usa `rico(t('…'))` (demo/i18n/rico.tsx): o trecho entre crases vira
 * código inline (o `<C>` da documentação), e `<strong>`, `<em>`, `<code>`,
 * `<b>`, `<small>`, `<kbd>`, `<br/>` viram as próprias tags. Assim a tradução
 * pode mudar a ordem das palavras sem quebrar o destaque. Texto que encosta
 * num elemento (link, valor) fica em pedaços; o espaço da borda é do pt-BR.
 *
 * ## Fallback
 *
 * Chave que falta em `en`/`es` (ou idioma sem dicionário) sai do pt-BR: dá
 * para extrair os textos de uma página agora e traduzir depois, sem nada
 * quebrar. Chave que falta AQUI é erro de tipo no `npm run typecheck`
 * (demo/i18n/chaves.tipos.ts): não existe chave sem texto em pt-BR.
 *
 * ## Como traduzir uma página
 *
 * 1. Acrescente os textos no arquivo da área, na chave da página. Ex.: a seção
 *    "1. Instalar o pacote" do guia de Instalação
 *    (`<Secao id="instalar" titulo="1. Instalar o pacote">`) vira
 *    `docs.instalacao.secoes.instalar: '1. Instalar o pacote'` em
 *    `docs/guias.ts`.
 * 2. Na página, troque o texto pela chave:
 *    `const { t } = useT();` (demo/i18n/useT.ts) e
 *    `<Secao id="instalar" titulo={t('docs.instalacao.secoes.instalar')}>`.
 *    Plural: `tp('docs.indice.textos.resumo', total)`. Fora de componente
 *    (função de renderização, dados): receba o `t` por parâmetro, ou use
 *    `traduzir`/`traduzirPlural` (demo/i18n/traduzir.ts).
 * 3. Traduza a mesma chave em `en/` e `es/` (pode ficar para depois).
 * 4. Confira: `npm run typecheck`, e a página nos três idiomas pelo seletor
 *    da topbar. Em pt-BR o texto tem que sair igual ao de antes.
 *
 * Dados de exemplo (produtos, tarefas, lançamentos, respostas do assistente)
 * ficam em pt-BR no código e se traduzem pelo próprio texto, na tabela
 * `<idioma>/conteudo.ts`, com o `tc()` do `useT()` (ver conteudo.ts). Nomes
 * próprios (pessoas, empresas, cidades) não entram na tabela.
 *
 * Fica em pt-BR de propósito: o código dos exemplos (demo/docs/exemplos, que
 * a página mostra como código). O CHANGELOG tem as traduções em
 * CHANGELOG.en.md e CHANGELOG.es.md, na raiz.
 *
 * Só dados: o teste visual importa o menu no Node, sem React nem CSS.
 */
import { menu } from './menu';
import { paginasGeral } from './paginas/geral';
import { paginasTabelas } from './paginas/tabelas';
import { paginasUi } from './paginas/ui';
import { paginasAvancado } from './paginas/avancado';
import { paginasApps } from './paginas/apps';
import { paginasFinancas } from './paginas/financas';
import { paginasSite } from './paginas/site';
import { paginasErro } from './paginas/erro';
import { docsGuias } from './docs/guias';
import { docsAcoes } from './docs/acoes';
import { docsFormularios } from './docs/formularios';
import { docsDados } from './docs/dados';
import { docsFeedback } from './docs/feedback';
import { docsNavegacao } from './docs/navegacao';
import { docsTelas } from './docs/telas';

export const textosDemoPtBR = {
  menu,
  paginas: { ...paginasGeral, ...paginasTabelas, ...paginasUi, ...paginasAvancado, ...paginasApps, ...paginasFinancas, ...paginasSite, ...paginasErro },
  docs: { ...docsGuias, ...docsAcoes, ...docsFormularios, ...docsDados, ...docsFeedback, ...docsNavegacao, ...docsTelas },
};
