import type { TextosDemoParciais } from '../../tipos';
import type { docsFeedback as Pt } from '../../pt-BR/docs/feedback';

export const docsFeedback: TextosDemoParciais<typeof Pt> = {
  alerta: {
    titulo: 'Alert',
    textos: {
      resumo: 'A message fixed on the page: information, success, warning or error. For passing notices, use the toast.',
      dispensavelSomeSozinhoAo: '`dispensavel` disappears on its own when the × is clicked; with `aoFechar`, the app decides (for example, remembering that the person already dismissed it).',
      oIconeVemDa: 'The icon comes from the severity. Change it with `icone` or remove it with `icone={false}`.',
      retornoDeUmaAcao: 'Feedback for an action (saved, deleted) is a toast; the alert is for what needs to stay visible.',
      descricao: 'Message fixed on the page',
    },
    secoes: {
      severidades: 'Severities',
      aparencias: 'Appearances',
      comAcaoEFechar: 'With action and close',
    },
  },
  toast: {
    titulo: 'Toast',
    textos: {
      resumo: 'A passing notice in the corner of the screen: feedback for an action (saved, deleted, failed). It goes away on its own after a few seconds.',
      usetoastJaFuncionaDentro: '`useToast()` already works inside `ProvedorUi`. The shortcuts are `ok`, `info`, `warn` and `err` (title, detail); `mostrar` accepts every option.',
      passarOMouseOu: 'Hovering or focusing the toast pauses the timer; the × closes it right away.',
      oQuePrecisaContinuar: 'What needs to stay visible (due-date warning, load error) is an `Alerta`, not a toast.',
      oComponenteToastTambem: 'The `Toast` component can also be used directly, as a fixed notice on the page.',
      descricao: 'Passing notice',
    },
    secoes: {
      severidades: 'Severities',
      aparenciaPosicaoEDuracao: 'Appearance, position and duration',
      cartaoFixoNaPagina: 'Card fixed on the page',
    },
  },
  confirmacao: {
    titulo: 'Confirmation',
    textos: {
      resumo: 'The \'are you sure?\' dialog as a function: await confirmar(...) returns true or false. Includes the remove shortcut and the single-button notice.',
      oProvedoruiJaInclui: '`ProvedorUi` already includes `ProvedorConfirmacao`: in the app, just use `useConfirmacao()`.',
      confirmarRemoverESempre: '`confirmar.remover` is always red with a trash can, so deletion looks the same across the whole system.',
      confirmarAvisarTemUm: '`confirmar.avisar` has a single button (OK) and returns a Promise that resolves on close.',
      escECliqueFora: 'Esc and an outside click count as declining.',
      descricao: 'Are you sure? and removal',
    },
    secoes: { confirmarRemoverEAvisar: 'Confirm, remove and notify' },
  },
  dialogo: {
    titulo: 'Dialog',
    textos: {
      resumo: 'A window over the page for a short task: quick registration, details, filters. It can be centered or on the side (drawer).',
      eControladoOApp: 'It\'s controlled: the app holds `aberto` and closes in `aoFechar` (Esc, outside click and the ×). With `dispensavel={false}`, only the buttons close it.',
      oFocoEntraNo: 'Focus enters the dialog on open, stays trapped inside it and returns to the button that opened it on close.',
      paraTemCertezaUse: 'For "are you sure?", use `useConfirmacao()`, which already builds the confirmation dialog.',
      emTelasPequenasTelacheiaabaixo: 'On small screens, `telaCheiaAbaixo="md"` opens it full screen.',
      aparenciaLateralEncostaO: '`aparencia="lateral"` docks the dialog to the right; `tom="escuro"` paints the header in the brand color.',
      descricao: 'Centered or side modal',
    },
    secoes: { basico: 'Basic', lateralGaveta: 'Side (drawer)' },
  },
  dica: {
    titulo: 'Tooltip',
    textos: {
      resumo: 'A short bubble that appears on hover or focus: the name of an icon-only button, a quick explanation.',
      envolvaUmUnicoElemento: 'Wrap a single focusable element (button, link). The tooltip is visual only (`aria-hidden`): the accessible name must be on the element itself, via `aria-label` or text.',
      apareceNoHoverE: 'It appears on hover and on keyboard focus; Esc hides it. On a disabled button, the tooltip stays reachable via Tab.',
      nadaDeConteudoInterativo: 'No interactive content inside the tooltip: for that, use `Balao`, which opens on click.',
      descricao: 'Bubble on hover and focus',
    },
    secoes: { posicoes: 'Positions' },
  },
  balao: {
    titulo: 'Popover',
    textos: {
      resumo: 'Floating content attached to an element: a longer explanation, an item\'s details. Opens on click (default), on focus or on hover.',
      comOGatilhoPadrao: 'With the default trigger (`clique`), the popover stays open until you click outside or press Esc.',
      fraseCurtaQueSo: 'A short phrase that only names the button is a `Dica`; actions and forms call for `MenuSuspenso` or `Dialogo`.',
      oBalaoTrocaDe: 'The popover switches sides on its own when it doesn\'t fit in the requested `posicao`.',
      descricao: 'Floating content on click',
    },
    secoes: { cliqueEPassar: 'Click and hover' },
  },
  carregando: {
    titulo: 'Loading',
    textos: {
      resumo: 'A waiting notice with animation and message, on an area or covering the whole screen (blocking).',
      bloqueanteEParaQuando: '`bloqueante` is for when nothing on screen can be used (generating a file, switching company): it holds focus and gives it back when done.',
      naPrimeiraCargaDe: 'On the first load of lists, prefer the `carregando` of `Tabela` and `ListaCards`, which show skeletons (`Skeleton`).',
      temRoleStatusO: 'It has `role="status"`: the screen reader announces the message. `logo` swaps the animation for the app\'s logo.',
      descricao: 'Busy screen or area',
    },
    secoes: { emAreaEBloqueante: 'On an area and blocking' },
  },
  girador: {
    titulo: 'Spinner',
    textos: {
      resumo: 'Activity indicator in three shapes (ring, pulse, dots), with color and size.',
      oRotuloESempre: '`rotulo` is always announced to the screen reader (`role="status"`); `mostrarRotulo` also shows it on screen.',
      dentroDeBotaoUse: 'Inside a button, use `Botao`\'s `carregando`, which already swaps the icon for the spinner.',
      tamanhoAceitaTambemUma: '`tamanho` also accepts a CSS measure (`"3rem"`).',
      descricao: 'Activity indicator',
    },
    secoes: { formasCoresETamanhos: 'Shapes, colors and sizes' },
  },
  skeleton: {
    titulo: 'Skeleton',
    textos: {
      resumo: 'An animated silhouette in place of content that is still loading, so the page doesn\'t jump when the data arrives.',
      eDecorativoAriaHidden: 'It\'s decorative (`aria-hidden`): announce the wait another way, such as `aria-busy` on the area or a `Girador`.',
      facaASilhuetaDo: 'Make the skeleton the size of the real content: same number of lines, same height.',
      tabelaEListacardsJa: '`Tabela` and `ListaCards` already show skeletons with `carregando`.',
      descricao: 'Content silhouette',
    },
    secoes: { cartaoCarregando: 'Card loading' },
  },
  progresso: {
    titulo: 'Progress',
    textos: {
      resumo: 'Progress bar: upload, target, steps. It shows the value in several ways and accepts colored segments.',
      passeSempreRotuloE: 'Always pass `rotulo`: it\'s the bar\'s name (`role="progressbar"`) for screen readers.',
      formatarTrocaOTexto: '`formatar` changes the value text (e.g. "3 of 8 steps"). `marcos` draws marks on the track.',
      semSaberQuantoFalta: 'Without knowing how much is left, use `Girador` or `Carregando` instead of a bar that doesn\'t move.',
      descricao: 'Progress bar',
    },
    secoes: { variacoes: 'Variations' },
  },
  vazio: {
    titulo: 'Empty',
    textos: {
      resumo: 'What to show when there\'s nothing: a list with no records, a search with no results, an empty inbox.',
      digaOQueAconteceria: 'Say what would happen here and what the next step is; when there is one, offer the action as a button.',
      tabelaEListacardsJa: '`Tabela` and `ListaCards` already have the empty state through the `vazioTitulo`, `vazioDescricao` and `vazioAcoes` props.',
      descricao: 'Nothing to show',
    },
    secoes: { comESemAcao: 'With and without action' },
  },
};
