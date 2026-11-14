import type { TextosDemoParciais } from '../../tipos';
import type { docsAcoes as Pt } from '../../pt-BR/docs/acoes';

export const docsAcoes: TextosDemoParciais<typeof Pt> = {
  botao: {
    titulo: 'Botón',
    textos: {
      resumo: 'Dispara una acción. Tiene ocho colores, seis apariencias, tres tamaños, icono, estado de carga y modo alternancia.',
      useUmaUnicaAcao: 'Use una única acción `pri` sólida por área de la pantalla; las demás en `contorno`, `suave` o `texto`.',
      botaoSoComIcone: 'El botón solo con icono necesita `aria-label` (el nombre que anuncia el lector de pantalla) y `dica` (el globo para quien ve).',
      oPadraoEType: 'El valor predeterminado es `type="button"`: dentro de un formulario, pase `type="submit"` al botón que envía.',
      comCarregandoOBotao: 'Con `carregando`, el botón sigue enfocable y rechaza el clic (`aria-busy`), en vez de salir del foco como con `disabled`.',
      paraPadronizarVariosBotoes: 'Para estandarizar varios botones a la vez (color, tamaño), use el `GrupoBotoes`.',
      aPropSeveridadeEscolhe: 'La prop `severidade` elige el color. El predeterminado es `pri`, el azul de acción.',
      aPropAparenciaMuda: 'La prop `aparencia` cambia el peso visual sin cambiar el color.',
      qualquerIconeDoLucide: 'Cualquier icono de Lucide por el nombre. `iconeDestacado` pone el icono en un segmento más oscuro.',
      descricao: 'Colores, apariencias, icono y carga',
    },
    secoes: {
      basico: 'Básico',
      cores: 'Colores',
      aparencias: 'Apariencias',
      tamanhosEFormato: 'Tamaños y formato',
      comIcone: 'Con icono',
      carregandoDesabilitadoEAlternancia: 'Cargando, deshabilitado y alternancia',
    },
  },
  grupoBotoes: {
    titulo: 'Grupo de botones',
    textos: {
      resumo: 'Botones unidos en un bloque (GrupoBotoes), alineados en una barra (BarraBotoes) o funcionando como selector (GrupoAlternancia).',
      semprePasseRotuloVira: 'Pase siempre `rotulo`: se vuelve el nombre del grupo para el lector de pantalla (`role="group"`).',
      grupoalternanciaRecebeOpcoesValor: '`GrupoAlternancia` recibe `opcoes`, `valor` y `aoMudar`; con `multiplo`, el valor es una lista. Cada botón marca `aria-pressed`.',
      paraEscolherUmaOpcao: 'Para elegir una opción en un formulario, `Escolha` tiene etiqueta, error y validación de campo.',
      osBotoesDeDentro: 'Los botones de adentro heredan `severidade`, `aparencia`, `formato` y `tamanho`, y cada uno puede sobrescribirlos.',
      descricao: 'Botones unidos, barra y alternancia',
    },
    secoes: { grupo: 'Grupo', alternancia: 'Alternancia', barraDeBotoes: 'Barra de botones' },
  },
  menuSuspenso: {
    titulo: 'Menú desplegable',
    textos: {
      resumo: 'Un botón que abre una lista de acciones. Acepta títulos, divisores, atajos, enlaces y el modo dividido.',
      abreComCliqueEnter: 'Se abre con clic, Enter o flecha hacia abajo; las flechas recorren los elementos y Esc cierra devolviendo el foco al botón.',
      itemComHrefVira: 'Un elemento con `href` se vuelve enlace. `tipo: \'titulo\'` y `tipo: \'divisor\'` organizan listas largas.',
      paraUmGatilhoProprio: 'Para un disparador propio (avatar, tarjeta), use la prop `gatilho`, que recibe las props de accesibilidad para aplicar en el elemento.',
      descricao: 'Lista de acciones en un botón',
    },
    secoes: { basico: 'Básico', botaoDividido: 'Botón dividido' },
  },
  acaoLinha: {
    titulo: 'Acción de fila',
    textos: {
      resumo: 'Botón solo con icono para las acciones de cada fila de una tabla o lista: ver, editar, eliminar.',
      useDentroDaProp: 'Úselo dentro de la prop `acoes` de la `Tabela`, que reserva la última columna para ellas.',
      oRotuloEObrigatorio: 'El `rotulo` es obligatorio: se vuelve el nombre accesible y la sugerencia del botón.',
      mantenhaAMesmaOrdem: 'Mantenga el mismo orden y los mismos colores en todas las pantallas (ver, editar, eliminar).',
      descricao: 'Icono de acción en tablas',
    },
    secoes: { basico: 'Básico' },
  },
  botaoFechar: {
    titulo: 'Botón cerrar',
    textos: {
      resumo: 'La × estándar de diálogos, tarjetas, alertas y paneles, con nombre accesible y área táctil adecuada.',
      oRotuloPadraoFechar: 'El `rotulo` (predeterminado "Fechar") se vuelve el `aria-label`; cámbielo cuando haya más de uno en la pantalla ("Fechar aviso").',
      dialogoCardEAlerta: '`Dialogo`, `Card` y `Alerta` ya traen su propio botón: use este solo en componentes de la app.',
      descricao: 'La × de tarjetas y paneles',
    },
    secoes: { variantes: 'Variantes' },
  },
};
