# Changelog

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
