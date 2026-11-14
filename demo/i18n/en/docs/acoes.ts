import type { TextosDemoParciais } from '../../tipos';
import type { docsAcoes as Pt } from '../../pt-BR/docs/acoes';

export const docsAcoes: TextosDemoParciais<typeof Pt> = {
  botao: {
    titulo: 'Button',
    textos: {
      resumo: 'Triggers an action. It has eight colors, six appearances, three sizes, an icon, a loading state and toggle mode.',
      useUmaUnicaAcao: 'Use a single solid `pri` action per screen area; the others in `contorno`, `suave` or `texto`.',
      botaoSoComIcone: 'An icon-only button needs `aria-label` (the name the screen reader announces) and `dica` (the tooltip for sighted users).',
      oPadraoEType: 'The default is `type="button"`: inside a form, pass `type="submit"` to the button that submits.',
      comCarregandoOBotao: 'With `carregando`, the button stays focusable and refuses the click (`aria-busy`), instead of leaving focus like with `disabled`.',
      paraPadronizarVariosBotoes: 'To standardize several buttons at once (color, size), use `GrupoBotoes`.',
      aPropSeveridadeEscolhe: 'The `severidade` prop picks the color. The default is `pri`, the action blue.',
      aPropAparenciaMuda: 'The `aparencia` prop changes the visual weight without changing the color.',
      qualquerIconeDoLucide: 'Any Lucide icon by name. `iconeDestacado` puts the icon in a darker segment.',
      descricao: 'Colors, appearances, icon and loading',
    },
    secoes: {
      basico: 'Basic',
      cores: 'Colors',
      aparencias: 'Appearances',
      tamanhosEFormato: 'Sizes and shape',
      comIcone: 'With icon',
      carregandoDesabilitadoEAlternancia: 'Loading, disabled and toggle',
    },
  },
  grupoBotoes: {
    titulo: 'Button group',
    textos: {
      resumo: 'Buttons joined in a block (GrupoBotoes), aligned in a bar (BarraBotoes) or working as a selector (GrupoAlternancia).',
      semprePasseRotuloVira: 'Always pass `rotulo`: it becomes the group\'s name for screen readers (`role="group"`).',
      grupoalternanciaRecebeOpcoesValor: '`GrupoAlternancia` takes `opcoes`, `valor` and `aoMudar`; with `multiplo`, the value is a list. Each button sets `aria-pressed`.',
      paraEscolherUmaOpcao: 'To pick an option in a form, `Escolha` has a label, error and field validation.',
      osBotoesDeDentro: 'The buttons inside inherit `severidade`, `aparencia`, `formato` and `tamanho`, and each one can override them.',
      descricao: 'Joined buttons, bar and toggle',
    },
    secoes: { grupo: 'Group', alternancia: 'Toggle', barraDeBotoes: 'Button bar' },
  },
  menuSuspenso: {
    titulo: 'Dropdown menu',
    textos: {
      resumo: 'A button that opens a list of actions. It accepts headings, dividers, shortcuts, links and split mode.',
      abreComCliqueEnter: 'Opens on click, Enter or down arrow; the arrows move through the items and Esc closes it, returning focus to the button.',
      itemComHrefVira: 'An item with `href` becomes a link. `tipo: \'titulo\'` and `tipo: \'divisor\'` organize long lists.',
      paraUmGatilhoProprio: 'For a custom trigger (avatar, card), use the `gatilho` prop, which receives the accessibility props to spread on the element.',
      descricao: 'List of actions in a button',
    },
    secoes: { basico: 'Basic', botaoDividido: 'Split button' },
  },
  acaoLinha: {
    titulo: 'Row action',
    textos: {
      resumo: 'Icon-only button for the actions on each row of a table or list: view, edit, delete.',
      useDentroDaProp: 'Use it inside the `acoes` prop of `Tabela`, which reserves the last column for them.',
      oRotuloEObrigatorio: '`rotulo` is required: it becomes the accessible name and the button\'s tooltip.',
      mantenhaAMesmaOrdem: 'Keep the same order and colors on every screen (view, edit, delete).',
      descricao: 'Action icon in tables',
    },
    secoes: { basico: 'Basic' },
  },
  botaoFechar: {
    titulo: 'Close button',
    textos: {
      resumo: 'The standard × for dialogs, cards, alerts and panels, with an accessible name and a proper touch area.',
      oRotuloPadraoFechar: '`rotulo` (default "Fechar") becomes the `aria-label`; change it when there\'s more than one on screen ("Fechar aviso").',
      dialogoCardEAlerta: '`Dialogo`, `Card` and `Alerta` already bring their own button: use this one only in app components.',
      descricao: 'The × of cards and panels',
    },
    secoes: { variantes: 'Variants' },
  },
};
