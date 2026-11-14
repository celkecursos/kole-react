# Changelog

## 0.6.0

Novedades:

- Multiidioma: los textos de la propia biblioteca (etiquetas predeterminadas,
  listas vacías, `aria-label`s, validaciones, anuncios de arrastre, fechas y
  números) en portugués de Brasil, inglés o español. El predeterminado sigue
  siendo `pt-BR` y nada cambia sin una acción del sistema: no se consulta el
  idioma del navegador.
- `ProvedorPreferencias` (y `ProvedorUi`): `idioma` y `definirIdioma` en el
  contexto; props `idiomaInicial`, `aoMudarIdioma` (al montar y en cada
  cambio, para sincronizar el i18n del sistema) y `textos` (reemplaza textos o
  agrega un idioma). La elección queda en `lp-preferencias`, junto con el tema
  y la densidad, y actualiza el `<html lang>`.
- `scriptTemaInicial({ idiomaInicial })` también define el `lang` antes de la
  primera pintura (solo con idioma guardado o `idiomaInicial`).
- `Estrutura`: la prop `idiomas` activa el selector de idioma en la barra
  superior, al lado del tema (sin la prop, no aparece nada). `SeletorIdioma`
  suelto (apariencia `icone` o `botao`, para la pantalla de inicio de sesión)
  y `Bandeira` (Brasil, EE. UU. y España en SVG propio).
- Diccionarios exportados (`textosPtBR`, `textosEn`, `textosEs`, tipo
  `Textos`, organizados por componente), `useTextos`, `useIdioma`,
  `textosDe`, `interpolar`, `pluralizar` (`Intl.PluralRules`) y formateadores
  con caché por idioma (`formatoNumero`, `formatoData`, `formatoLista`,
  `diasDaSemana`, `mesesDoAno`).
- Utilidades con idioma opcional (predeterminado `pt-BR`, se mantiene la firma
  anterior): `formatarNumero`, `formatarMoeda`, `formatarPercentual`,
  `rotuloPeriodo`, `dataCurta`, `tempoRelativo`, `situacaoPrazo`, `validar`,
  `validarTelefone`, `validarSenha`, `saudacaoPorHora`, `listaPorExtenso` y
  `tituloDeEntidade`. Las reglas brasileñas (máscaras, CPF, CNPJ, CEP,
  teléfono, estados, valores en letras) no cambian; la moneda sigue viniendo
  de `moeda`.
- Demo: selector de idioma en la barra superior y página Idioma en la
  documentación (cómo activarlo, qué cambia, sincronización con react-i18next
  y con Laravel `users.locale`).
- Demo: menú, títulos, leyendas y tarjetas en pt-BR, inglés y español.
  Diccionario propio de la demo en `demo/i18n` (pt-BR es la fuente; `en` y
  `es` parciales, con lo que falte en portugués), hook `useT()` sobre el
  `useIdioma()` y el `interpolar`/`pluralizar` de la biblioteca, y prueba de
  tipos que detecta una clave usada sin texto en pt-BR. Cambiar el idioma
  traduce el menú, la ruta de navegación, la búsqueda Ctrl K, los títulos de
  las páginas y de la documentación, las leyendas de `FormSecao` y los títulos
  de `Card`, sin recargar; el portugués no cambia.
- Demo: textos corridos en inglés y español, página por página: bloques de
  ejemplo, párrafos, etiquetas, mensajes y toasts de las pantallas de la demo,
  del sitio público y de las pantallas de error, y los textos de la
  documentación (resúmenes, notas, descripciones de los ejemplos y el
  encabezado de la tabla de props). El diccionario queda dividido por área
  (`demo/i18n/<idioma>/menu`, `paginas/<grupo>`, `docs/<categoria>`), y los
  párrafos con destaque usan `rico()` (comillas invertidas y
  `<strong>`/`<em>`/`<code>` en la propia cadena). El código de los ejemplos
  queda en portugués.
- Demo: los textos de interfaz guardados en listas y constantes de las
  páginas (opciones, columnas de tabla, nombres de colores y posiciones,
  tarjetas, FAQ, planes y posts del sitio, tablas de las guías de Tema y de
  Carga) también salen en el idioma elegido: cada constante pasó a ser una
  función que recibe el `t`. Las fechas relativas, porcentajes, valores y
  saludos de la demo pasan el idioma a las utilidades de la biblioteca
  (`tempoRelativo`, `formatarMoeda`, `formatarPercentual`, `rotuloPeriodo`…).
- Demo: los datos de ejemplo también salen en el idioma elegido (productos,
  categorías, formas de pago, tareas y tableros, agenda del calendario,
  movimientos de las finanzas, respuestas del asistente y del chat, textos de
  tarjetas y listas). La traducción sale de una tabla indexada por el propio
  texto en pt-BR (`demo/i18n/<idioma>/conteudo.ts`), con el `tc()` del
  `useT()` al momento de mostrar: los datos siguen en pt-BR y con los mismos
  tipos. Los nombres de personas, empresas, ciudades y estados quedan como
  están.
- Demo: el CHANGELOG también en inglés y español (`CHANGELOG.en.md` y
  `CHANGELOG.es.md`); la página Changelog muestra el del idioma elegido.
- Documentación: las descripciones de las props (JSDoc) en inglés y español,
  en `demo/docs/props.en.json` y `props.es.json`, con el texto pt-BR del JSDoc
  como clave. `npm run docs:conferir` falla si una descripción queda sin
  traducción o si sobra una traducción de un texto que salió del JSDoc
  (`npm run docs:props` limpia las que sobran); sin traducción, la descripción
  aparece en pt-BR. La verificación deja de marcar `props.gerado.json` como
  desactualizado solo por el fin de línea CRLF.
- Prueba visual: proyecto `en` con las pantallas de texto de la biblioteca
  (tabla vacía, paginación, calendario y el selector abierto) y con el marco
  traducido de la demo (documentación, formulario y tarjetas); en las
  referencias anteriores, el selector queda oculto.

- Finanzas: `Valor` (dinero con signo y color de entrada y salida, tamaños,
  tachado, compacto), `ProvedorValores` y `BotaoOcultarValores` (el "ocultar
  valores", recordado en el navegador con `chave`) y `useValoresOcultos`.
- `formatarMoeda` (signo menos tipográfico, `sinal`, `compacto`, `moeda`, sin
  `−0,00`), `formatarPercentual`, `variacaoPercentual`, `dividirEmParcelas`
  (centavos exactos) y `somarMoeda` (suma en centavos).
- `GraficoRosca`: participación de cada parte, con la porción activa en el
  medio del anillo, leyenda con valor y porcentaje (oculta porciones),
  `maxFatias` ("Otros"), `aoEscolher` al hacer clic o con Enter, teclado,
  "Ver datos" y entrada animada.
- `NavegadorPeriodo`: "‹ Noviembre de 2026 ›" con atajos (este mes, mes
  pasado, trimestre, año) e intervalo libre; utilidades `periodoDe`,
  `moverPeriodo`, `noPeriodo`, `rotuloPeriodo`, `mesesDoPeriodo` y `dataIso`.
- `SeletorContexto`: cambia personal × empresa, sucursal o escuela; nueva
  prop `contexto` en la `Estrutura`, a la izquierda de la barra superior y
  visible también en el celular.
- Íconos `arrow-left-right`, `banknote`, `calendar-range`, `chart-pie`,
  `landmark`, `piggy-bank`, `receipt`, `repeat`, `target`, `trending-down` y
  `trending-up`.
- Demo: sección Soluciones › Finanzas, para finanzas personales y de la
  empresa (el selector superior cambia entre las dos): visión general,
  movimientos (filtros, selección masiva, cuotas y repetición mensual), cuentas
  y tarjetas (factura y límite), cuentas por pagar y cobrar, presupuesto por
  categoría, metas, flujo de caja proyectado e informes (estado de resultados
  en la empresa, con exportación CSV). Documentación: páginas Valor y dinero,
  Navegador de período y Selector de contexto; dona en la página de Gráficos.

- `Kanban`: tablero con columnas (color, conteo, `limite` de tarjetas, menú
  para renombrar, plegar y eliminar, `acoesColuna`), tarjetas que se arrastran
  entre columnas, "Agregar tarjeta" en la columna, "Agregar columna", columnas
  arrastrables (`aoSoltarColuna`), `filtro` con conteo "2 de 5", `altura` fija
  con desplazamiento por columna y pantalla vacía.
- `CartaoKanban`: portada, etiquetas, título, descripción, prioridad,
  vencimiento, progreso de las subtareas, adjuntos, comentarios, responsables
  y el espacio libre `extra` (p. ej.: valor y empresa en un embudo de ventas);
  con `aoAbrir`, toda la tarjeta abre el detalle.
- `ListaTarefas`: filas con marcar como hecha, situación, prioridad, plazo,
  etiquetas, subtareas y responsables; reordena arrastrando (`aoReordenar`) y
  arma vistas con `filtro` sin perder el orden de las tareas ocultas.
- `SeloPrioridade`, `SeloPrazo` y `Etiqueta`, con `PRIORIDADES` y
  `SITUACOES_TAREFA` para armar selects.
- `GrupoAvatares`: avatares superpuestos con "+N" y todos los nombres para el
  lector de pantalla.
- `tempoRelativo` ("há 5 min", "ontem", "em 3 dias"), `situacaoPrazo`
  (atrasado, hoy, pronto, en plazo), `diasEntre`, `dataCurta` y `paraData`
  (`AAAA-MM-DD` en la zona horaria local).
- `QuadroArrastavel`: `aoSoltar` (elemento, de dónde salió y adónde fue, una
  vez al soltar), `podeSoltar` (regla de destino; con el teclado, las flechas
  saltan las columnas rechazadas), `visivel` (oculta elementos sin sacarlos de
  su lugar), `layout="faixa"` con `larguraColuna`, `cabecalhoColuna`,
  `rodapeColuna`, `fim`, `classeColuna`, columnas arrastrables
  (`colunasArrastaveis` y `aoSoltarColuna`), columnas `recolhida`,
  desplazamiento automático cerca de los bordes y Esc también al arrastrar
  con el mouse.
- Íconos `flag`, `list-checks`, `list-todo` y `square-kanban`.
- Demo: sección Aplicaciones con el listado de tableros (favoritos y todos,
  búsqueda, crear tablero), el tablero con filtros y el detalle de la tarjeta
  en un diálogo (incluso un embudo de ventas) y la pantalla de Tareas (vistas,
  listas y etiquetas en el lateral, filtros de plazo y panel de detalle).
  Documentación: páginas Kanban y Lista de tareas, ejemplos nuevos en Tablero
  arrastrable y en Avatar.
- Asistente de IA: `ListaConversas` (historial agrupado por fecha, con
  búsqueda, renombrar, fijar y eliminar), `InicioConversa` (saludo y
  sugerencias, en tarjetas o píldoras), `BlocoCodigo` (código con el lenguaje
  y el botón de copiar) y `ChatFlutuante` (atención del sitio: botón fijo en
  la esquina y panel con la conversación; pantalla completa en el celular).
- `CampoMensagem`: `anexos` en chips (con progreso y error),
  `aoRemoverAnexo` y `aoAdicionarArquivos` (arrastrar al campo o pegar). Con
  adjuntos, envía sin texto; mientras un adjunto sube, el Enviar espera.
- `Mensagem`: estilos para el Markdown renderizado por la app (títulos,
  listas, tablas que se desplazan dentro de la burbuja, citas y código en
  línea).
- Íconos: `thumbs-up`, `thumbs-down`, `square-pen`, `globe`, `wrench`,
  `sparkles`, `bot`, `message-circle`, `panel-left`, `file-search` y `pin`.
- Demo: página modelo Asistente (Advanced UI) y el chat de atención en las
  páginas modelo del sitio.
- `Calendario`: vistas mes, semana, día y lista; eventos con color por los
  tokens, "+N más" por día, franja de horarios con eventos lado a lado cuando
  se superponen y línea del "ahora"; `aoMudarPeriodo`, `aoClicarDia`,
  `aoClicarEvento` y `aoClicarHorario`; semana que empieza el domingo o el
  lunes y navegación con el teclado en todas las vistas (en la semana y en el
  día, un cursor de 30 minutos). Demo: página Calendario.
- `Calendario.aoAlterarEvento`: arrastrar el evento a otro día u horario (de
  15 en 15 minutos) y estirar la duración por el borde inferior del bloque; en
  pantallas táctiles, mantener presionado antes de arrastrar; con el teclado,
  Alt+flechas y Alt+Shift+↑↓. Campos nuevos en `EventoCalendario`: `fixo`,
  `repete` y `serie`. La prop `data` lleva el calendario hasta un día.
- `MiniCalendario`: mes pequeño para la columna lateral, con el día elegido,
  días marcados y franja destacada (la semana visible).
- `Calendario.aoSelecionarHorario`: en la semana y en el día, arrastrar sobre
  horarios vacíos elige un intervalo (de 15 en 15 minutos); el clic y Enter
  eligen la media hora, y Shift+↑↓ en el cursor amplían el intervalo.
  `Calendario.rascunho`: evento provisional con línea discontinua (p. ej.:
  mientras el formulario de nuevo evento está abierto). Demo y documentación:
  alta y edición de evento en un diálogo, con el campo "Repite".
- `repetirEvento(base, regra, periodo)`: ocurrencias de una serie diaria,
  semanal, mensual o anual en el período, con `intervalo`, `ate`, `vezes` y
  `excecoes`.
- Demo: sección Documentación con Instalación, Tema y tokens, Tailwind, Carga
  (qué indicador de carga usar en cada situación), Changelog y 60 páginas de
  componente en seis categorías (ejemplos en vivo, código y tabla de props
  generada a partir de los tipos por `npm run docs:props`).
- Demo: el pie de la barra lateral muestra la versión del paquete (leída del
  `package.json`), en lugar del `v0.1.0` fijo.
- CI: actions actualizadas a versiones en Node 24 (`checkout@v6`,
  `upload-artifact@v6`, `setup-node@v6`); la publicación pasa a usar Node 26
  (LTS).

Correcciones:

- `GraficoCombinado`: el eje derecho solo aparece cuando alguna serie está en
  él (antes, una línea con `eixo: 'esquerdo'` dejaba un eje derecho vacío de 0
  a 1 y "(eje izquierdo)" en todas las leyendas).
- `CabecalhoPagina`: sin espacio, las acciones bajan a la línea de abajo, en
  lugar de apretar el título (el título queda con al menos 12rem).
- `QuadroArrastavel`: `aoMudar` pasa a llamarse una vez, al soltar (antes, en
  cada cambio de posición durante el arrastre); la vista previa del movimiento
  queda en el propio tablero.
- `Dialogo` (y el `Form` en modal): al cerrar, el foco vuelve a quien lo abrió
  también cuando un campo del diálogo tiene `autoFocus`; antes, quedaba
  perdido en la página.
- Demo estática (`npm run build:demo`): el CSS salía sin los tokens de color,
  sin el `base.css` y sin los selectores de tema, porque el `sideEffects` del
  paquete hacía que el bundler saltara los imports de CSS del `src/index.ts`.
  La demo importa los dos archivos directamente, y el build falla si el CSS
  sale sin los tokens.

## 0.5.0

Novedades:

- Componentes de sitio público: `EstruturaSite` (barra de aviso, encabezado
  fijo con marca, menú horizontal, botón de tema y acciones; en el celular,
  menú en panel), `RodapeSite` (columnas, newsletter y redes), `SecaoSite`,
  `DestaqueSite` (franja de apertura oscura o clara, con título resaltado),
  `CabecalhoSecao`, `CampoPesquisa`, `CardConteudo` (vertical, destacado,
  horizontal, compacto y fila), `CardRecurso`, `CardDepoimento`, `CardPlano`,
  `FaixaNumeros`, `FaixaChamada`, `ListaNumerada`, `FiltroPilulas`,
  `ConteudoArtigo`, `SumarioPagina` y `Newsletter`. Enlaces de verdad, que
  dentro de la `EstruturaSite` navegan por el `aoNavegar`/`renderLink` de la
  app y se abren en una pestaña nueva con Ctrl+clic.
- Tokens del sitio: `--site-largura`, `--r-site`, `--r-site-2`,
  `--sombra-site`, `--fs-site-hero`, `--fs-site-titulo`, `--fs-site-secao` y
  `--site-escuro-*`.
- `tailwind.css`: utilidades del sitio (`max-w-site`, `rounded-site`,
  `shadow-site`, `text-site-hero`, `text-site-escuro-t3`…).
- Demo: menú Sitio con las páginas modelo de un sitio genérico (Inicio con
  franja oscura y clara, Acerca de, Servicios y planes, Blog, Post sin y con
  columna lateral, Contacto, Términos de uso, Política de Privacidad y
  Política de Cookies).

## 0.4.1

Correcciones:

- `CampoSelect`, `CampoSelectMultiplo` y los campos hechos con ellos
  (`CampoUf`, `CampoUfMultiplo`, `CampoTipoPessoa`…): cursor de mano en todo
  el campo, incluso con `comBusca`, que mostraba el cursor de texto. Con
  búsqueda, el cursor de texto solo aparece con la lista abierta, para escribir
  el filtro. Hacer clic en el borde interno del campo también abre y cierra la
  lista. El `CampoBusca` sigue con el cursor de texto.

## 0.4.0

Novedades:

- Gráficos en SVG propio, sin dependencia nueva: `GraficoLinha` (área, franjas
  sombreadas en el eje X, líneas de referencia, series discontinuas),
  `GraficoBarras` (agrupadas, divergentes, horizontales para ranking, valores
  en las barras), `GraficoCombinado` (barras y líneas con dos ejes Y, con el
  eje de cada serie en la leyenda), `GraficoDispersao` (recta de regresión con
  `r`, `r²` y `n`, puntos destacados, `nota`) y `MapaCalor` (cuadrícula con
  escala secuencial, celda sin dato rayada, desplazamiento vertical con las
  columnas fijas arriba). Común a todos: ancho del contenedor, leyenda que
  oculta series, caja de detalles con el mouse, el toque y las flechas del
  teclado, "Ver datos" en `Tabela`, `carregando` y `textoVazio`. `null` es sin
  dato, nunca cero.
- `animacao` en todos los gráficos y en el `Indicador` (minigráfico),
  predeterminado `false`: entrada animada solo con CSS (las líneas se dibujan,
  las barras crecen desde cero, los puntos y las celdas aparecen), una sola
  vez, cuando el gráfico aparece. Desactivada con `prefers-reduced-motion`.
- `regressaoLinear(pontos)`: `{ inclinacao, intercepto, r, r2, n }` o `null`
  con menos de 3 puntos o varianza cero.
- `Indicador.tendencia`: minigráfico debajo del valor, en el color de `cor`.
  Sin la prop, el indicador queda como antes. El dibujo también se exporta
  como `Minigrafico`.
- Tokens `--graf-1` a `--graf-6`, `--graf-pos`, `--graf-neg`, `--graf-seq-1`
  a `--graf-seq-5`, `--graf-grade`, `--graf-eixo`, `--graf-texto` y
  `--graf-faixa`, en los temas claro y oscuro.
- Demo: página Gráficos (Advanced UI) con cada componente y variación, y un
  bloque Animación con el botón para repetir la entrada.

## 0.3.0

Novedades:

- `ItemNav.recarregar` y `Marca.recarregar`: la página marcada se abre con
  recarga completa. El enlace pasa a ser un `<a>` común, sin pasar por
  `renderLink` ni `aoNavegar`, en el menú, en la búsqueda del menú
  (`ItemBusca.recarregar`) y en la ruta de navegación. Sirve para apps con
  páginas fuera de React, como un Laravel con Inertia y Blade (vea "Páginas
  fora do React no mesmo app" en el README). Sin el campo, nada cambia.

## 0.2.0

Cambios que pueden alterar la apariencia para quien ya usa la biblioteca:

- El CSS (`estilos.css` y `tokens.css`) ahora queda en la capa `@layer kole`.
  El CSS fuera de capa siempre gana al CSS en capa, así que **cualquier regla
  de la app pasa a ganarle al kole**, incluso con menor especificidad y en
  cualquier orden de import. Revise las reglas globales de elemento en la app
  (`a { color }`, `h1 { font-size }`, `button {…}`, `:focus-visible {…}`):
  antes perdían frente a las clases `lp-*`, ahora se aplican también a los
  componentes. Los `@font-face` de Inter quedan fuera de la capa.
- El token `--font-mono` pasó a ser `--lp-font-mono`: el nombre anterior es el
  mismo de Tailwind y uno sobrescribía al otro. Si la app usa
  `var(--font-mono)` esperando la fuente del kole, cámbielo por
  `var(--lp-font-mono)`.
- El tipo `Tema` ganó `'sistema'`. El código de la app con `switch` exhaustivo
  o `Record<Tema, …>` necesita tratar el valor nuevo.
- Sin elección guardada y sin `temaInicial`, el tema predeterminado ahora es
  `sistema`. Antes, el tema del sistema operativo se leía en la primera visita
  y se guardaba como claro/oscuro, y la app dejaba de seguirlo si el sistema
  cambiaba después. Quien ya tiene una elección guardada (incluso la guardada
  sola por la versión anterior) sigue con ella; para el comportamiento
  anterior, pase `temaInicial="claro"`.

Novedades:

- Tema `sistema` (`<html data-theme="system">`): sigue el modo del sistema
  operativo, incluso si cambia con la página abierta. Funciona también solo
  con el `tokens.css`, sin React. En el `ProvedorUi`: `temaInicial="sistema"`
  o `definirTema('sistema')`; `escuro` indica lo que está en pantalla, y
  `alternarTema()` sale de `sistema` hacia el opuesto del actual.
- `scriptTemaInicial()`: script para el `<head>` que aplica tema y densidad
  antes de la primera pintura (sin el destello blanco para quien usa el tema
  oscuro). El README trae la versión lista para el `index.html`.
- `@celke/kole-react/tailwind.css` (opcional): el `dark:` de Tailwind sigue el
  tema del kole, y los tokens se vuelven utilidades (`bg-surface`, `text-ink`,
  `border-border`, `rounded-card`…).
- Con Tailwind 4, declare el orden de las capas antes de todo (vea "Com
  Tailwind 4" en el README): las utilidades (`mt-4`) pasan a valer en los
  componentes del kole, y el preflight no deshace su estilo.

Desarrollo:

- La demo usa la misma cascada del paquete (capa `kole` y tema `sistema` en
  dev).
- Prueba visual de la demo con Playwright (`npm run visual:referencia` /
  `npm run visual`), con las páginas leídas del menú de la demo
  (`demo/nav.ts`).
- CI de la prueba visual en cada PR y en `main`, contra la referencia de Linux
  guardada en git (`.github/workflows/visual.yml`).

## 0.1.0

- Primera versión publicada.
