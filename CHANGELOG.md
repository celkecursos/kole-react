# Changelog

## Não publicado

Novidades:

- `Kanban`: quadro com colunas (cor, contagem, `limite` de cartões, menu de
  renomear, recolher e excluir, `acoesColuna`), cartões que se arrastam entre
  colunas, "Adicionar cartão" na coluna, "Adicionar coluna", colunas
  arrastáveis (`aoSoltarColuna`), `filtro` com contagem "2 de 5", `altura` fixa
  com rolagem por coluna e tela vazia.
- `CartaoKanban`: capa, etiquetas, título, descrição, prioridade, vencimento,
  progresso das subtarefas, anexos, comentários, responsáveis e o espaço livre
  `extra` (ex.: valor e empresa num funil de vendas); com `aoAbrir`, o cartão
  inteiro abre o detalhe.
- `ListaTarefas`: linhas com marcar como feita, situação, prioridade, prazo,
  etiquetas, subtarefas e responsáveis; reordena arrastando (`aoReordenar`) e
  faz visões com `filtro` sem perder a ordem das tarefas escondidas.
- `SeloPrioridade`, `SeloPrazo` e `Etiqueta`, com `PRIORIDADES` e
  `SITUACOES_TAREFA` para montar selects.
- `GrupoAvatares`: avatares sobrepostos com "+N" e todos os nomes para o leitor
  de tela.
- `tempoRelativo` ("há 5 min", "ontem", "em 3 dias"), `situacaoPrazo`
  (atrasado, hoje, em breve, no prazo), `diasEntre`, `dataCurta` e `paraData`
  (`AAAA-MM-DD` no fuso local).
- `QuadroArrastavel`: `aoSoltar` (item, de onde saiu e para onde foi, uma vez
  ao soltar), `podeSoltar` (regra de destino; no teclado, as setas pulam as
  colunas recusadas), `visivel` (esconde itens sem tirá-los do lugar),
  `layout="faixa"` com `larguraColuna`, `cabecalhoColuna`, `rodapeColuna`,
  `fim`, `classeColuna`, colunas arrastáveis (`colunasArrastaveis` e
  `aoSoltarColuna`), colunas `recolhida`, rolagem automática perto das bordas e
  Esc também no arraste com o mouse.
- Ícones `flag`, `list-checks`, `list-todo` e `square-kanban`.
- Demo: seção Aplicativos com a listagem de quadros (favoritos e todos, busca,
  criar quadro), o quadro com filtros e detalhe do cartão em diálogo (inclusive
  um funil de vendas) e a tela de Tarefas (visões, listas e etiquetas na lateral,
  filtros de prazo e painel de detalhe). Documentação: páginas Kanban e Lista de
  tarefas, exemplos novos no Quadro arrastável e no Avatar.
- Assistente de IA: `ListaConversas` (histórico agrupado por data, com busca,
  renomear, fixar e excluir), `InicioConversa` (saudação e sugestões, em cartões
  ou pílulas), `BlocoCodigo` (código com a linguagem e o botão de copiar) e
  `ChatFlutuante` (atendimento de site: botão fixo no canto e painel com a
  conversa; tela cheia no celular).
- `CampoMensagem`: `anexos` em chips (com progresso e erro), `aoRemoverAnexo` e
  `aoAdicionarArquivos` (arrastar para o campo ou colar). Com anexos, envia sem
  texto; enquanto um anexo sobe, o Enviar espera.
- `Mensagem`: estilos para o Markdown renderizado pelo app (títulos, listas,
  tabelas que rolam dentro da bolha, citações e código em linha).
- Ícones: `thumbs-up`, `thumbs-down`, `square-pen`, `globe`, `wrench`,
  `sparkles`, `bot`, `message-circle`, `panel-left`, `file-search` e `pin`.
- Demo: página modelo Assistente (Advanced UI) e o chat de atendimento nas
  páginas modelo do site.
- `Calendario`: visões mês, semana, dia e lista; eventos com cor pelos tokens,
  "+N mais" por dia, faixa de horários com eventos lado a lado quando se
  sobrepõem e linha do "agora"; `aoMudarPeriodo`, `aoClicarDia`,
  `aoClicarEvento` e `aoClicarHorario`; semana começando no domingo ou na
  segunda e navegação pelo teclado em todas as visões (na semana e no dia, um
  cursor de 30 minutos). Demo: página Calendário.
- `Calendario.aoAlterarEvento`: arrastar o evento para outro dia ou horário (de
  15 em 15 minutos) e esticar a duração pela borda de baixo do bloco; no toque,
  segurar antes de arrastar; pelo teclado, Alt+setas e Alt+Shift+↑↓. Campos novos
  em `EventoCalendario`: `fixo`, `repete` e `serie`. Prop `data` leva o
  calendário até um dia.
- `MiniCalendario`: mês pequeno para a coluna lateral, com dia escolhido, dias
  marcados e faixa destacada (a semana visível).
- `Calendario.aoSelecionarHorario`: na semana e no dia, arrastar sobre horários
  vazios escolhe um intervalo (de 15 em 15 minutos); clique e Enter escolhem a
  meia hora, e Shift+↑↓ no cursor aumentam o intervalo. `Calendario.rascunho`:
  evento provisório tracejado (ex.: enquanto o formulário de novo evento está
  aberto). Demo e documentação: cadastro e edição de evento em diálogo, com o
  campo "Repete".
- `repetirEvento(base, regra, periodo)`: ocorrências de uma série diária,
  semanal, mensal ou anual no período, com `intervalo`, `ate`, `vezes` e
  `excecoes`.
- Demo: seção Documentação com Instalação, Tema e tokens, Tailwind,
  Carregamento (qual loading usar em cada situação), Changelog e 60 páginas de
  componente em seis categorias (exemplos ao vivo, código e tabela de props
  gerada dos tipos por `npm run docs:props`).
- Demo: o rodapé da barra lateral mostra a versão do pacote (lida do
  `package.json`), no lugar do `v0.1.0` fixo.
- CI: actions atualizadas para versões em Node 24 (`checkout@v6`,
  `upload-artifact@v6`, `setup-node@v6`); a publicação passa a usar o Node 26 (LTS).

Correções:

- `CabecalhoPagina`: sem espaço, as ações descem para a linha de baixo, em vez
  de espremer o título (o título fica com pelo menos 12rem).
- `QuadroArrastavel`: `aoMudar` passa a ser chamado uma vez, ao soltar (antes, a
  cada troca de posição durante o arraste); a prévia do movimento fica no
  próprio quadro.
- `Dialogo` (e o `Form` em modal): ao fechar, o foco volta a quem abriu também
  quando um campo do diálogo tem `autoFocus`; antes, ficava perdido na página.

## 0.5.0

Novidades:

- Componentes de site público: `EstruturaSite` (barra de aviso, cabeçalho fixo
  com marca, menu horizontal, botão de tema e ações; no celular, menu em painel),
  `RodapeSite` (colunas, newsletter e redes), `SecaoSite`, `DestaqueSite` (faixa
  de abertura escura ou clara, com título em realce), `CabecalhoSecao`,
  `CampoPesquisa`, `CardConteudo` (vertical, destaque, horizontal, compacto e
  linha), `CardRecurso`, `CardDepoimento`, `CardPlano`, `FaixaNumeros`,
  `FaixaChamada`, `ListaNumerada`, `FiltroPilulas`, `ConteudoArtigo`,
  `SumarioPagina` e `Newsletter`. Links de verdade, que dentro da `EstruturaSite` navegam pelo
  `aoNavegar`/`renderLink` do app e abrem em nova aba com Ctrl+clique.
- Tokens do site: `--site-largura`, `--r-site`, `--r-site-2`, `--sombra-site`,
  `--fs-site-hero`, `--fs-site-titulo`, `--fs-site-secao` e `--site-escuro-*`.
- `tailwind.css`: utilitários do site (`max-w-site`, `rounded-site`,
  `shadow-site`, `text-site-hero`, `text-site-escuro-t3`…).
- Demo: menu Site com as páginas modelo de um site genérico (Home com faixa
  escura e clara, Sobre, Serviços e planos, Blog, Post sem e com coluna
  lateral, Contato, Termos de uso,
  Política de Privacidade e Política de Cookies).

## 0.4.1

Correções:

- `CampoSelect`, `CampoSelectMultiplo` e os campos feitos com eles (`CampoUf`,
  `CampoUfMultiplo`, `CampoTipoPessoa`…): cursor de mão em todo o campo, inclusive
  com `comBusca`, que mostrava o cursor de texto. Com busca, o cursor de texto só
  aparece com a lista aberta, para digitar o filtro. Clicar na borda interna do
  campo também abre e fecha a lista. O `CampoBusca` continua com o cursor de texto.

## 0.4.0

Novidades:

- Gráficos em SVG próprio, sem dependência nova: `GraficoLinha`
  (área, faixas sombreadas no eixo X, linhas de referência, séries tracejadas),
  `GraficoBarras` (agrupadas, divergentes, horizontais para ranking, valores nas
  barras), `GraficoCombinado` (barras e linhas com dois eixos Y, com o eixo de
  cada série na legenda), `GraficoDispersao` (reta de regressão com `r`, `r²` e
  `n`, pontos destacados, `nota`) e `MapaCalor` (grade com escala sequencial,
  célula sem dado hachurada, rolagem vertical com as colunas presas no topo).
  Comum a todos: largura do container, legenda que esconde séries, caixa de
  detalhes pelo mouse, toque e setas do teclado, "Ver dados" em `Tabela`,
  `carregando` e `textoVazio`. `null` é sem dado, nunca zero.
- `animacao` em todos os gráficos e no `Indicador` (minigráfico), padrão
  `false`: entrada animada só em CSS (linhas se desenham, barras crescem a
  partir do zero, pontos e células surgem), uma vez só, quando o gráfico
  aparece. Desligada com `prefers-reduced-motion`.
- `regressaoLinear(pontos)`: `{ inclinacao, intercepto, r, r2, n }` ou `null`
  com menos de 3 pontos ou variância zero.
- `Indicador.tendencia`: minigráfico abaixo do valor, na cor do `cor`. Sem a
  prop, o indicador fica como antes. O desenho também é exportado como
  `Minigrafico`.
- Tokens `--graf-1` a `--graf-6`, `--graf-pos`, `--graf-neg`, `--graf-seq-1` a
  `--graf-seq-5`, `--graf-grade`, `--graf-eixo`, `--graf-texto` e `--graf-faixa`,
  nos temas claro e escuro.
- Demo: página Gráficos (Advanced UI) com cada componente e variação, e um
  bloco Animação com o botão de repetir a entrada.

## 0.3.0

Novidades:

- `ItemNav.recarregar` e `Marca.recarregar`: a página marcada abre com recarga
  completa. O link vira um `<a>` comum, sem passar por `renderLink` nem
  `aoNavegar`, no menu, na busca do menu (`ItemBusca.recarregar`) e na trilha.
  Serve para app com páginas fora do React, como um Laravel com Inertia e
  Blade (veja "Páginas fora do React no mesmo app" no README). Sem o campo,
  nada muda.

## 0.2.0

Mudanças que podem alterar a aparência de quem já usa a biblioteca:

- O CSS (`estilos.css` e `tokens.css`) agora fica na camada `@layer kole`. CSS
  fora de camada sempre vence CSS em camada, então **qualquer regra do app
  passa a vencer o kole**, mesmo com especificidade menor e em qualquer ordem
  de import. Confira regras globais de elemento no app (`a { color }`,
  `h1 { font-size }`, `button {…}`, `:focus-visible {…}`): antes perdiam para as
  classes `lp-*`, agora se aplicam também aos componentes. Os `@font-face` da
  Inter ficam fora da camada.
- O token `--font-mono` virou `--lp-font-mono`: o nome antigo é o mesmo do
  Tailwind e um sobrescrevia o outro. Se o app usa `var(--font-mono)` esperando
  a fonte do kole, troque para `var(--lp-font-mono)`.
- O tipo `Tema` ganhou `'sistema'`. Código do app com `switch` exaustivo ou
  `Record<Tema, …>` precisa tratar o valor novo.
- Sem escolha salva e sem `temaInicial`, o tema padrão agora é `sistema`. Antes,
  o tema do sistema operacional era lido na primeira visita e salvo como
  claro/escuro, e o app parava de acompanhar se o sistema mudasse depois. Quem
  já tem uma escolha salva (inclusive a salva sozinha pela versão anterior)
  continua nela; para o comportamento antigo, passe `temaInicial="claro"`.

Novidades:

- Tema `sistema` (`<html data-theme="system">`): segue o modo do sistema
  operacional, inclusive se ele mudar com a página aberta. Funciona também só
  com o `tokens.css`, sem React. No `ProvedorUi`: `temaInicial="sistema"` ou
  `definirTema('sistema')`; `escuro` diz o que está na tela, e
  `alternarTema()` sai do `sistema` para o oposto do atual.
- `scriptTemaInicial()`: script para o `<head>` que aplica tema e densidade
  antes da primeira pintura (sem o clarão branco de quem usa o tema escuro).
  O README traz a versão pronta para o `index.html`.
- `@celke/kole-react/tailwind.css` (opcional): o `dark:` do Tailwind segue o
  tema do kole, e os tokens viram utilitários (`bg-surface`, `text-ink`,
  `border-border`, `rounded-card`…).
- Com Tailwind 4, declare a ordem das camadas antes de tudo (veja "Com
  Tailwind 4" no README): os utilitários (`mt-4`) passam a valer em
  componentes do kole, e o preflight não desfaz o estilo deles.

Desenvolvimento:

- A demo usa a mesma cascata do pacote (camada `kole` e tema `sistema` no dev).
- Teste visual da demo com Playwright (`npm run visual:referencia` /
  `npm run visual`), com as páginas lidas do menu da demo (`demo/nav.ts`).
- CI do teste visual em todo PR e na `main`, contra a referência de Linux
  guardada no git (`.github/workflows/visual.yml`).

## 0.1.0

- Primeira versão publicada.
