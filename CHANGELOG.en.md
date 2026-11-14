# Changelog

## Unreleased

Target version: 0.6.0.

New:

- Multi-language: the library's own texts (default labels, empty lists,
  `aria-label`s, validations, drag announcements, dates and numbers) in
  Brazilian Portuguese, English or Spanish. The default is still `pt-BR` and
  nothing changes unless the app acts: the browser language is not read.
- `ProvedorPreferencias` (and `ProvedorUi`): `idioma` and `definirIdioma` in
  the context; props `idiomaInicial`, `aoMudarIdioma` (on mount and on every
  change, to sync the app's i18n) and `textos` (replaces texts or adds a
  language). The choice is stored in `lp-preferencias`, along with theme and
  density, and updates `<html lang>`.
- `scriptTemaInicial({ idiomaInicial })` also sets `lang` before the first
  paint (only with a saved language or `idiomaInicial`).
- `Estrutura`: the `idiomas` prop turns on the language selector in the
  topbar, next to the theme (without the prop, nothing shows). Standalone
  `SeletorIdioma` (`icone` or `botao` appearance, for the login screen) and
  `Bandeira` (Brazil, USA and Spain in its own SVG).
- Exported dictionaries (`textosPtBR`, `textosEn`, `textosEs`, `Textos` type,
  organized by component), `useTextos`, `useIdioma`, `textosDe`,
  `interpolar`, `pluralizar` (`Intl.PluralRules`) and formatters cached per
  language (`formatoNumero`, `formatoData`, `formatoLista`, `diasDaSemana`,
  `mesesDoAno`).
- Utilities with an optional language (default `pt-BR`, old signature kept):
  `formatarNumero`, `formatarMoeda`, `formatarPercentual`, `rotuloPeriodo`,
  `dataCurta`, `tempoRelativo`, `situacaoPrazo`, `validar`, `validarTelefone`,
  `validarSenha`, `saudacaoPorHora`, `listaPorExtenso` and `tituloDeEntidade`.
  Brazilian rules (masks, CPF, CNPJ, CEP, phone, states, amounts in words)
  don't change; the currency still comes from `moeda`.
- Demo: language selector in the topbar and an Idioma page in the
  documentation (how to turn it on, what changes, syncing with react-i18next
  and with Laravel `users.locale`).
- Demo: menu, titles, legends and cards in pt-BR, English and Spanish. The
  demo's own dictionary in `demo/i18n` (pt-BR is the source; `en` and `es`
  partial, falling back to Portuguese), a `useT()` hook over the library's
  `useIdioma()` and `interpolar`/`pluralizar`, and a type test that flags a
  key used without pt-BR text. Switching the language translates the menu, the
  breadcrumb, the Ctrl K search, the page and documentation titles, the
  `FormSecao` legends and the `Card` titles, without reloading; Portuguese
  stays the same.
- Demo: running text in English and Spanish, page by page: example blocks,
  paragraphs, labels, messages and toasts of the demo screens, the public site
  and the error screens, and the documentation texts (summaries, notes,
  example descriptions and the props table header). The dictionary is split
  by area (`demo/i18n/<idioma>/menu`, `paginas/<grupo>`, `docs/<categoria>`),
  and paragraphs with emphasis use `rico()` (backticks and
  `<strong>`/`<em>`/`<code>` in the string itself). The example code stays in
  Portuguese.
- Demo: interface texts kept in lists and constants of the pages (options,
  table columns, color and position names, cards, FAQ, site plans and posts,
  tables in the Theme and Loading guides) also show in the chosen language:
  each constant became a function that receives `t`. The demo's relative
  dates, percentages, amounts and greetings pass the language to the library
  utilities (`tempoRelativo`, `formatarMoeda`, `formatarPercentual`,
  `rotuloPeriodo`…).
- Demo: the sample data also shows in the chosen language (products,
  categories, payment methods, tasks and boards, the calendar schedule,
  finance entries, assistant and chat replies, card and list texts). The
  translation comes from a table keyed by the pt-BR text itself
  (`demo/i18n/<idioma>/conteudo.ts`), with `useT()`'s `tc()` at display time:
  the data stays in pt-BR and keeps the same types. Names of people,
  companies, cities and states stay as they are.
- Demo: the CHANGELOG also in English and Spanish (`CHANGELOG.en.md` and
  `CHANGELOG.es.md`); the Changelog page shows the one for the chosen
  language.
- Documentation: the prop descriptions (JSDoc) in English and Spanish, in
  `demo/docs/props.en.json` and `props.es.json`, with the pt-BR JSDoc text as
  the key. `npm run docs:conferir` fails if a description is left untranslated
  or if there's a leftover translation for text that left the JSDoc
  (`npm run docs:props` removes the leftovers); without a translation, the
  description shows in pt-BR. The check no longer flags `props.gerado.json` as
  outdated just because of CRLF line endings.
- Visual test: an `en` project with the library's text screens (empty table,
  pagination, calendar and the open selector) and with the demo's translated
  frame (documentation, form and cards); in the old references, the selector
  is hidden.

- Finance: `Valor` (money with sign and color for income and expense, sizes,
  strikethrough, compact), `ProvedorValores` and `BotaoOcultarValores` (the
  "hide amounts" toggle, remembered in the browser with `chave`) and
  `useValoresOcultos`.
- `formatarMoeda` (typographic minus sign, `sinal`, `compacto`, `moeda`, no
  `−0,00`), `formatarPercentual`, `variacaoPercentual`, `dividirEmParcelas`
  (exact cents) and `somarMoeda` (sum in cents).
- `GraficoRosca`: each part's share, with the active slice in the middle of
  the ring, a legend with amount and percentage (hides slices), `maxFatias`
  ("Others"), `aoEscolher` on click or Enter, keyboard, "View data" and an
  animated entrance.
- `NavegadorPeriodo`: "‹ November 2026 ›" with shortcuts (this month, last
  month, quarter, year) and a free range; utilities `periodoDe`,
  `moverPeriodo`, `noPeriodo`, `rotuloPeriodo`, `mesesDoPeriodo` and
  `dataIso`.
- `SeletorContexto`: switches personal × business, branch or school; new
  `contexto` prop in `Estrutura`, on the left of the top bar and visible on
  mobile too.
- Icons `arrow-left-right`, `banknote`, `calendar-range`, `chart-pie`,
  `landmark`, `piggy-bank`, `receipt`, `repeat`, `target`, `trending-down` and
  `trending-up`.
- Demo: Solutions › Finance section, for personal and business finances (the
  top selector switches between the two): overview, entries (filters, bulk
  selection, installments and monthly repetition), accounts and cards (bill
  and limit), bills to pay and receive, budget by category, goals, projected
  cash flow and reports (income statement for the business, with CSV export).
  Documentation: Valor and money, Period navigator and Context selector pages;
  donut on the Charts page.

- `Kanban`: board with columns (color, count, card `limite`, menu to rename,
  collapse and delete, `acoesColuna`), cards that drag between columns, "Add
  card" in the column, "Add column", draggable columns (`aoSoltarColuna`),
  `filtro` with a "2 of 5" count, fixed `altura` with per-column scrolling and
  an empty screen.
- `CartaoKanban`: cover, labels, title, description, priority, due date,
  subtask progress, attachments, comments, assignees and the free `extra` slot
  (e.g.: amount and company in a sales pipeline); with `aoAbrir`, the whole
  card opens the detail.
- `ListaTarefas`: rows with mark as done, status, priority, due date, labels,
  subtasks and assignees; reorders by dragging (`aoReordenar`) and builds
  views with `filtro` without losing the order of hidden tasks.
- `SeloPrioridade`, `SeloPrazo` and `Etiqueta`, with `PRIORIDADES` and
  `SITUACOES_TAREFA` to build selects.
- `GrupoAvatares`: overlapping avatars with "+N" and every name for the screen
  reader.
- `tempoRelativo` ("há 5 min", "ontem", "em 3 dias"), `situacaoPrazo`
  (overdue, today, soon, on time), `diasEntre`, `dataCurta` and `paraData`
  (`AAAA-MM-DD` in the local time zone).
- `QuadroArrastavel`: `aoSoltar` (item, where it came from and where it went,
  once on drop), `podeSoltar` (target rule; on the keyboard, the arrows skip
  refused columns), `visivel` (hides items without moving them),
  `layout="faixa"` with `larguraColuna`, `cabecalhoColuna`, `rodapeColuna`,
  `fim`, `classeColuna`, draggable columns (`colunasArrastaveis` and
  `aoSoltarColuna`), `recolhida` columns, automatic scrolling near the edges
  and Esc also when dragging with the mouse.
- Icons `flag`, `list-checks`, `list-todo` and `square-kanban`.
- Demo: Applications section with the board list (favorites and all, search,
  create board), the board with filters and the card detail in a dialog
  (including a sales pipeline) and the Tasks screen (views, lists and labels in
  the sidebar, due date filters and a detail panel). Documentation: Kanban and
  Task list pages, new examples in Draggable board and Avatar.
- AI assistant: `ListaConversas` (history grouped by date, with search,
  rename, pin and delete), `InicioConversa` (greeting and suggestions, as cards
  or pills), `BlocoCodigo` (code with the language and the copy button) and
  `ChatFlutuante` (site support: fixed button in the corner and a panel with
  the chat; full screen on mobile).
- `CampoMensagem`: `anexos` as chips (with progress and error),
  `aoRemoverAnexo` and `aoAdicionarArquivos` (drag onto the field or paste).
  With attachments, it sends without text; while an attachment uploads, Send
  waits.
- `Mensagem`: styles for the Markdown rendered by the app (headings, lists,
  tables that scroll inside the bubble, quotes and inline code).
- Icons: `thumbs-up`, `thumbs-down`, `square-pen`, `globe`, `wrench`,
  `sparkles`, `bot`, `message-circle`, `panel-left`, `file-search` and `pin`.
- Demo: Assistant template page (Advanced UI) and the support chat on the
  site template pages.
- `Calendario`: month, week, day and list views; events colored by the tokens,
  "+N more" per day, a time grid with events side by side when they overlap
  and a "now" line; `aoMudarPeriodo`, `aoClicarDia`, `aoClicarEvento` and
  `aoClicarHorario`; week starting on Sunday or Monday and keyboard navigation
  in every view (in week and day, a 30-minute cursor). Demo: Calendar page.
- `Calendario.aoAlterarEvento`: drag the event to another day or time (in
  15-minute steps) and stretch the duration from the bottom edge of the block;
  on touch, hold before dragging; on the keyboard, Alt+arrows and
  Alt+Shift+↑↓. New fields in `EventoCalendario`: `fixo`, `repete` and
  `serie`. The `data` prop takes the calendar to a day.
- `MiniCalendario`: small month for the side column, with the chosen day,
  marked days and a highlighted range (the visible week).
- `Calendario.aoSelecionarHorario`: in week and day, dragging over empty slots
  picks a range (in 15-minute steps); click and Enter pick the half hour, and
  Shift+↑↓ on the cursor extend the range. `Calendario.rascunho`: a dashed
  provisional event (e.g.: while the new event form is open). Demo and
  documentation: create and edit an event in a dialog, with the "Repeats"
  field.
- `repetirEvento(base, regra, periodo)`: occurrences of a daily, weekly,
  monthly or yearly series in the period, with `intervalo`, `ate`, `vezes` and
  `excecoes`.
- Demo: Documentation section with Installation, Theme and tokens, Tailwind,
  Loading (which loading to use in each situation), Changelog and 60 component
  pages in six categories (live examples, code and a props table generated
  from the types by `npm run docs:props`).
- Demo: the sidebar footer shows the package version (read from
  `package.json`), instead of the fixed `v0.1.0`.
- CI: actions updated to Node 24 versions (`checkout@v6`,
  `upload-artifact@v6`, `setup-node@v6`); publishing now uses Node 26 (LTS).

Fixes:

- `GraficoCombinado`: the right axis only shows when some series is on it
  (before, a line with `eixo: 'esquerdo'` left an empty right axis from 0 to 1
  and "(left axis)" in every legend).
- `CabecalhoPagina`: without room, the actions drop to the line below instead
  of squeezing the title (the title keeps at least 12rem).
- `QuadroArrastavel`: `aoMudar` is now called once, on drop (before, on every
  position change during the drag); the movement preview stays in the board
  itself.
- `Dialogo` (and `Form` in a modal): on close, focus goes back to the opener
  also when a field in the dialog has `autoFocus`; before, it got lost on the
  page.
- Static demo (`npm run build:demo`): the CSS came out without the color
  tokens, without `base.css` and without the theme selectors, because the
  package's `sideEffects` made the bundler skip the CSS imports of
  `src/index.ts`. The demo imports both files directly, and the build fails if
  the CSS comes out without the tokens.

## 0.5.0

New:

- Public site components: `EstruturaSite` (announcement bar, sticky header
  with brand, horizontal menu, theme button and actions; on mobile, menu in a
  panel), `RodapeSite` (columns, newsletter and social links), `SecaoSite`,
  `DestaqueSite` (dark or light opening band, with a highlighted title),
  `CabecalhoSecao`, `CampoPesquisa`, `CardConteudo` (vertical, featured,
  horizontal, compact and row), `CardRecurso`, `CardDepoimento`, `CardPlano`,
  `FaixaNumeros`, `FaixaChamada`, `ListaNumerada`, `FiltroPilulas`,
  `ConteudoArtigo`, `SumarioPagina` and `Newsletter`. Real links, which inside
  `EstruturaSite` navigate through the app's `aoNavegar`/`renderLink` and open
  in a new tab with Ctrl+click.
- Site tokens: `--site-largura`, `--r-site`, `--r-site-2`, `--sombra-site`,
  `--fs-site-hero`, `--fs-site-titulo`, `--fs-site-secao` and
  `--site-escuro-*`.
- `tailwind.css`: site utilities (`max-w-site`, `rounded-site`,
  `shadow-site`, `text-site-hero`, `text-site-escuro-t3`…).
- Demo: Site menu with the template pages of a generic website (Home with a
  dark and a light band, About, Services and plans, Blog, Post without and with
  a side column, Contact, Terms of use, Privacy Policy and Cookie Policy).

## 0.4.1

Fixes:

- `CampoSelect`, `CampoSelectMultiplo` and the fields built on them
  (`CampoUf`, `CampoUfMultiplo`, `CampoTipoPessoa`…): pointer cursor over the
  whole field, including with `comBusca`, which showed the text cursor. With
  search, the text cursor only shows with the list open, to type the filter.
  Clicking the field's inner border also opens and closes the list.
  `CampoBusca` keeps the text cursor.

## 0.4.0

New:

- Charts in their own SVG, with no new dependency: `GraficoLinha` (area,
  shaded bands on the X axis, reference lines, dashed series), `GraficoBarras`
  (grouped, diverging, horizontal for rankings, values on the bars),
  `GraficoCombinado` (bars and lines with two Y axes, with each series' axis in
  the legend), `GraficoDispersao` (regression line with `r`, `r²` and `n`,
  highlighted points, `nota`) and `MapaCalor` (grid with a sequential scale,
  hatched cell for missing data, vertical scrolling with the columns pinned to
  the top). Common to all: container width, a legend that hides series, a
  details box on mouse, touch and keyboard arrows, "View data" in a `Tabela`,
  `carregando` and `textoVazio`. `null` means no data, never zero.
- `animacao` on every chart and on `Indicador` (sparkline), default `false`:
  CSS-only animated entrance (lines draw themselves, bars grow from zero,
  points and cells pop in), only once, when the chart appears. Turned off with
  `prefers-reduced-motion`.
- `regressaoLinear(pontos)`: `{ inclinacao, intercepto, r, r2, n }` or `null`
  with fewer than 3 points or zero variance.
- `Indicador.tendencia`: sparkline below the value, in the `cor` color.
  Without the prop, the indicator stays as before. The drawing is also
  exported as `Minigrafico`.
- Tokens `--graf-1` to `--graf-6`, `--graf-pos`, `--graf-neg`, `--graf-seq-1`
  to `--graf-seq-5`, `--graf-grade`, `--graf-eixo`, `--graf-texto` and
  `--graf-faixa`, in the light and dark themes.
- Demo: Charts page (Advanced UI) with each component and variation, and an
  Animation block with the button to replay the entrance.

## 0.3.0

New:

- `ItemNav.recarregar` and `Marca.recarregar`: the marked page opens with a
  full reload. The link becomes a plain `<a>`, without going through
  `renderLink` or `aoNavegar`, in the menu, in the menu search
  (`ItemBusca.recarregar`) and in the breadcrumb. Useful for apps with pages
  outside React, like Laravel with Inertia and Blade (see "Páginas fora do
  React no mesmo app" in the README). Without the field, nothing changes.

## 0.2.0

Changes that may alter the look for those already using the library:

- The CSS (`estilos.css` and `tokens.css`) is now in the `@layer kole` layer.
  Unlayered CSS always beats layered CSS, so **any app rule now beats kole**,
  even with lower specificity and in any import order. Check global element
  rules in the app (`a { color }`, `h1 { font-size }`, `button {…}`,
  `:focus-visible {…}`): before they lost to the `lp-*` classes, now they also
  apply to the components. Inter's `@font-face` rules stay outside the layer.
- The `--font-mono` token became `--lp-font-mono`: the old name is the same as
  Tailwind's and one overrode the other. If the app uses `var(--font-mono)`
  expecting kole's font, change it to `var(--lp-font-mono)`.
- The `Tema` type gained `'sistema'`. App code with an exhaustive `switch` or
  `Record<Tema, …>` needs to handle the new value.
- With no saved choice and no `temaInicial`, the default theme is now
  `sistema`. Before, the operating system theme was read on the first visit
  and saved as light/dark, and the app stopped following it if the system
  changed later. Those who already have a saved choice (including the one
  saved on its own by the previous version) keep it; for the old behavior,
  pass `temaInicial="claro"`.

New:

- `sistema` theme (`<html data-theme="system">`): follows the operating
  system mode, even if it changes while the page is open. It also works with
  just `tokens.css`, without React. In `ProvedorUi`: `temaInicial="sistema"`
  or `definirTema('sistema')`; `escuro` tells what is on screen, and
  `alternarTema()` leaves `sistema` for the opposite of the current one.
- `scriptTemaInicial()`: a script for the `<head>` that applies theme and
  density before the first paint (no white flash for dark theme users). The
  README has the ready-made version for `index.html`.
- `@celke/kole-react/tailwind.css` (optional): Tailwind's `dark:` follows
  kole's theme, and the tokens become utilities (`bg-surface`, `text-ink`,
  `border-border`, `rounded-card`…).
- With Tailwind 4, declare the layer order before anything else (see "Com
  Tailwind 4" in the README): utilities (`mt-4`) now apply to kole components,
  and the preflight doesn't undo their style.

Development:

- The demo uses the same cascade as the package (`kole` layer and `sistema`
  theme in dev).
- Visual test of the demo with Playwright (`npm run visual:referencia` /
  `npm run visual`), with the pages read from the demo menu (`demo/nav.ts`).
- Visual test CI on every PR and on `main`, against the Linux reference kept
  in git (`.github/workflows/visual.yml`).

## 0.1.0

- First published version.
