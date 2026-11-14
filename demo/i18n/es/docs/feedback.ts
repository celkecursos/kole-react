import type { TextosDemoParciais } from '../../tipos';
import type { docsFeedback as Pt } from '../../pt-BR/docs/feedback';

export const docsFeedback: TextosDemoParciais<typeof Pt> = {
  alerta: {
    titulo: 'Alerta',
    textos: {
      resumo: 'Mensaje fijo en la página: información, éxito, atención o error. Para avisos pasajeros, use el toast.',
      dispensavelSomeSozinhoAo: '`dispensavel` desaparece solo al hacer clic en la ×; con `aoFechar`, decide la app (por ejemplo, recordar que la persona ya lo descartó).',
      oIconeVemDa: 'El icono viene de la severidad. Cámbielo con `icone` o quítelo con `icone={false}`.',
      retornoDeUmaAcao: 'El retorno de una acción (guardó, eliminó) es toast; la alerta es para lo que tiene que seguir visible.',
      descricao: 'Mensaje fijo en la página',
    },
    secoes: {
      severidades: 'Severidades',
      aparencias: 'Apariencias',
      comAcaoEFechar: 'Con acción y cerrar',
    },
  },
  toast: {
    titulo: 'Toast',
    textos: {
      resumo: 'Aviso pasajero en la esquina de la pantalla: retorno de una acción (guardó, eliminó, falló). Se va solo después de algunos segundos.',
      usetoastJaFuncionaDentro: '`useToast()` ya funciona dentro del `ProvedorUi`. Los atajos son `ok`, `info`, `warn` y `err` (título, detalle); `mostrar` acepta todas las opciones.',
      passarOMouseOu: 'Pasar el mouse o el foco sobre el toast pausa el tiempo; la × lo cierra de inmediato.',
      oQuePrecisaContinuar: 'Lo que tiene que seguir visible (aviso de vencimiento, error de carga) es `Alerta`, no toast.',
      oComponenteToastTambem: 'El componente `Toast` también se puede usar directo, como aviso fijo en la página.',
      descricao: 'Aviso pasajero',
    },
    secoes: {
      severidades: 'Severidades',
      aparenciaPosicaoEDuracao: 'Apariencia, posición y duración',
      cartaoFixoNaPagina: 'Tarjeta fija en la página',
    },
  },
  confirmacao: {
    titulo: 'Confirmación',
    textos: {
      resumo: 'El diálogo de \'¿está seguro?\' como una función: await confirmar(...) devuelve true o false. Incluye el atajo de eliminación y el aviso de un solo botón.',
      oProvedoruiJaInclui: 'El `ProvedorUi` ya incluye el `ProvedorConfirmacao`: en la app, basta `useConfirmacao()`.',
      confirmarRemoverESempre: '`confirmar.remover` es siempre rojo y con papelera, para que la eliminación se vea igual en todo el sistema.',
      confirmarAvisarTemUm: '`confirmar.avisar` tiene un solo botón (OK) y devuelve una Promise que se resuelve al cerrar.',
      escECliqueFora: 'Esc y el clic fuera cuentan como rechazar.',
      descricao: '¿Está seguro? y eliminación',
    },
    secoes: { confirmarRemoverEAvisar: 'Confirmar, eliminar y avisar' },
  },
  dialogo: {
    titulo: 'Diálogo',
    textos: {
      resumo: 'Ventana sobre la página para una tarea corta: registro rápido, detalles, filtros. Puede ser central o lateral (cajón).',
      eControladoOApp: 'Es controlado: la app guarda el `aberto` y cierra en `aoFechar` (Esc, clic fuera y la ×). Con `dispensavel={false}`, solo los botones lo cierran.',
      oFocoEntraNo: 'El foco entra en el diálogo al abrir, queda atrapado dentro de él y vuelve al botón que lo abrió al cerrar.',
      paraTemCertezaUse: 'Para "¿está seguro?", use `useConfirmacao()`, que ya arma el diálogo de confirmación.',
      emTelasPequenasTelacheiaabaixo: 'En pantallas pequeñas, `telaCheiaAbaixo="md"` lo abre en pantalla completa.',
      aparenciaLateralEncostaO: '`aparencia="lateral"` pega el diálogo a la derecha; `tom="escuro"` pinta el encabezado con el color de la marca.',
      descricao: 'Modal central o lateral',
    },
    secoes: { basico: 'Básico', lateralGaveta: 'Lateral (cajón)' },
  },
  dica: {
    titulo: 'Sugerencia',
    textos: {
      resumo: 'Globo corto que aparece al pasar el mouse o enfocar el elemento: el nombre de un botón solo con icono, una explicación rápida.',
      envolvaUmUnicoElemento: 'Envuelva un único elemento enfocable (botón, enlace). La sugerencia es solo visual (`aria-hidden`): el nombre accesible tiene que estar en el propio elemento, por `aria-label` o texto.',
      apareceNoHoverE: 'Aparece al pasar el mouse y con el foco del teclado; Esc la oculta. En un botón deshabilitado, la sugerencia sigue accesible por el Tab.',
      nadaDeConteudoInterativo: 'Nada de contenido interactivo dentro de la sugerencia: para eso, use el `Balao`, que se abre con el clic.',
      descricao: 'Globo al pasar el mouse y con el foco',
    },
    secoes: { posicoes: 'Posiciones' },
  },
  balao: {
    titulo: 'Globo',
    textos: {
      resumo: 'Contenido flotante sujeto a un elemento: explicación más larga, detalles de un elemento. Se abre con el clic (predeterminado), con el foco o al pasar el mouse.',
      comOGatilhoPadrao: 'Con el disparador predeterminado (`clique`), el globo queda abierto hasta hacer clic fuera o pulsar Esc.',
      fraseCurtaQueSo: 'Una frase corta que solo nombra el botón es `Dica`; acciones y formularios piden `MenuSuspenso` o `Dialogo`.',
      oBalaoTrocaDe: 'El globo cambia de lado solo cuando no cabe en la `posicao` pedida.',
      descricao: 'Contenido flotante con el clic',
    },
    secoes: { cliqueEPassar: 'Clic y pasar el mouse' },
  },
  carregando: {
    titulo: 'Cargando',
    textos: {
      resumo: 'Aviso de espera con animación y mensaje, en un área o cubriendo toda la pantalla (bloqueante).',
      bloqueanteEParaQuando: '`bloqueante` es para cuando nada en la pantalla se puede usar (generar archivo, cambiar de empresa): retiene el foco y lo devuelve al terminar.',
      naPrimeiraCargaDe: 'En la primera carga de listas, prefiera el `carregando` de la `Tabela` y de la `ListaCards`, que muestran siluetas (`Skeleton`).',
      temRoleStatusO: 'Tiene `role="status"`: el lector de pantalla anuncia el mensaje. `logo` cambia la animación por el logotipo de la app.',
      descricao: 'Pantalla o área ocupada',
    },
    secoes: { emAreaEBloqueante: 'En área y bloqueante' },
  },
  girador: {
    titulo: 'Indicador de carga',
    textos: {
      resumo: 'Indicador de actividad en tres formas (anillo, pulso, puntos), con color y tamaño.',
      oRotuloESempre: 'El `rotulo` siempre se anuncia al lector de pantalla (`role="status"`); `mostrarRotulo` también lo muestra en pantalla.',
      dentroDeBotaoUse: 'Dentro de un botón, use el `carregando` del `Botao`, que ya cambia el icono por el indicador.',
      tamanhoAceitaTambemUma: '`tamanho` acepta también una medida CSS (`"3rem"`).',
      descricao: 'Indicador de actividad',
    },
    secoes: { formasCoresETamanhos: 'Formas, colores y tamaños' },
  },
  skeleton: {
    titulo: 'Skeleton',
    textos: {
      resumo: 'Silueta animada en lugar del contenido que todavía está cargando, para que la página no salte cuando llegan los datos.',
      eDecorativoAriaHidden: 'Es decorativo (`aria-hidden`): anuncie la espera de otra forma, como `aria-busy` en el área o un `Girador`.',
      facaASilhuetaDo: 'Haga la silueta del tamaño del contenido real: mismo número de líneas, misma altura.',
      tabelaEListacardsJa: '`Tabela` y `ListaCards` ya muestran siluetas con `carregando`.',
      descricao: 'Silueta del contenido',
    },
    secoes: { cartaoCarregando: 'Tarjeta cargando' },
  },
  progresso: {
    titulo: 'Progreso',
    textos: {
      resumo: 'Barra de avance: envío, meta, etapas. Muestra el valor de varias formas y acepta segmentos de color.',
      passeSempreRotuloE: 'Pase siempre `rotulo`: es el nombre de la barra (`role="progressbar"`) para el lector de pantalla.',
      formatarTrocaOTexto: '`formatar` cambia el texto del valor (ej.: "3 de 8 etapas"). `marcos` dibuja marcas en el riel.',
      semSaberQuantoFalta: 'Sin saber cuánto falta, use `Girador` o `Carregando` en vez de una barra que no avanza.',
      descricao: 'Barra de avance',
    },
    secoes: { variacoes: 'Variaciones' },
  },
  vazio: {
    titulo: 'Vacío',
    textos: {
      resumo: 'Qué mostrar cuando no hay nada: lista sin registros, búsqueda sin resultado, bandeja de entrada vacía.',
      digaOQueAconteceria: 'Diga lo que pasaría aquí y cuál es el próximo paso; cuando lo haya, ofrezca la acción en un botón.',
      tabelaEListacardsJa: '`Tabela` y `ListaCards` ya tienen el estado vacío por las props `vazioTitulo`, `vazioDescricao` y `vazioAcoes`.',
      descricao: 'Nada para mostrar',
    },
    secoes: { comESemAcao: 'Con y sin acción' },
  },
};
