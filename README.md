# @celke/kole-react

Biblioteca de componentes **React** para sistemas administrativos. Design tokens
próprios (cores, raios, densidade, tema claro/escuro), CSS puro e sem dependência
de Tailwind.

## Instalação

```bash
npm i @celke/kole-react
```

Requisitos: React 18.2+ ou 19. A fonte Inter já vem dentro do pacote (o
`estilos.css` carrega só os alfabetos que a página usa). O pacote é só ESM, traz
os tipos TypeScript e já vem marcado com `'use client'`, então funciona no App
Router do Next.js.

## Uso

```tsx
// main.tsx
import { createRoot } from 'react-dom/client';
import '@celke/kole-react/estilos.css';
import { ProvedorUi } from '@celke/kole-react';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <ProvedorUi>
    <App />
  </ProvedorUi>,
);
```

`ProvedorUi` liga tema/densidade (lembrados no navegador), toasts (`useToast`) e
confirmação (`useConfirmacao`).

### Idioma

Os textos da própria biblioteca saem em português do Brasil (padrão), inglês ou
espanhol. Ligue o seletor na topbar com `idiomas` e sincronize o i18n do seu
sistema em `aoMudarIdioma` (chamado ao montar e a cada troca). A biblioteca não
traduz os textos do sistema: ela só informa o idioma escolhido.

```tsx
<ProvedorUi idiomaInicial={usuario.locale} aoMudarIdioma={(idioma) => i18n.changeLanguage(idioma)}>
  <Estrutura idiomas={['pt-BR', 'en', 'es']} {...props}>…</Estrutura>
</ProvedorUi>
```

Prioridade dos textos: prop passada > dicionário do idioma > pt-BR. Para trocar
um texto ou acrescentar um idioma, passe `textos` ao provedor
(`{ 'pt-BR': { tabela: { rotulo: 'Lista' } } }`). Regras brasileiras (máscaras e
validação de CPF, CNPJ, CEP e telefone) e a moeda não mudam com o idioma; só a
formatação e as mensagens. A demo traz a página Idioma com os exemplos de
react-i18next e Laravel.

### Tema sem piscar ao abrir

O `ProvedorUi` só aplica o tema depois que o React monta, e quem salvou o tema
escuro vê a página clara piscar por um instante. Para evitar, aplique o tema no
`<head>`, antes do CSS da página pintar:

```html
<!-- index.html -->
<head>
  <script>(function(){var p={};try{p=JSON.parse(localStorage.getItem("lp-preferencias")||"{}")||{}}catch(e){}var t=p.tema||"sistema";var h=document.documentElement;h.setAttribute("data-theme",{"claro":"light","escuro":"dark","sistema":"system"}[t]||"light");var l=p.idioma||"";if(l)h.lang=l;var d={"compacta":"density-compact","confortavel":"density-comfortable","espacosa":"density-cozy"}[p.densidade||"confortavel"];if(d)h.classList.add(d)})();</script>
</head>
```

Com Content-Security-Policy sem `'unsafe-inline'` em `script-src`, o script
inline é bloqueado: salve o mesmo conteúdo num arquivo (por exemplo,
`public/tema.js`) e carregue com `<script src="/tema.js"></script>` no
`<head>`, sem `type="module"` nem `defer`, para rodar antes da pintura.

Esse é o resultado de `scriptTemaInicial()`. Com SSR (Next.js, React Router em
modo framework), gere pela função, com o mesmo `temaInicial`/`densidadeInicial`
passado ao `ProvedorUi`:

```tsx
import { scriptTemaInicial } from '@celke/kole-react';

<head>
  <script dangerouslySetInnerHTML={{ __html: scriptTemaInicial({ temaInicial: 'sistema' }) }} />
</head>
```

### Layout com React Router

```tsx
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Estrutura } from '@celke/kole-react';

export function Layout({ sair }: { sair: () => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <Estrutura
      marca={{ nome: 'Gestor', subtitulo: 'Gestão comercial', logo: '/logo.svg' }}
      nav={[
        { itens: [{ rotulo: 'Painel', icone: 'house', rota: '/' }] },
        {
          rotulo: 'Cadastros',
          itens: [
            { rotulo: 'Pedidos', icone: 'shopping-cart', rota: '/pedidos' },
            { rotulo: 'Tabelas', icone: 'table', filhos: [{ rotulo: 'Categorias', rota: '/categorias' }] },
          ],
        },
      ]}
      rotaAtual={pathname}
      aoNavegar={navigate}
      usuario={{ nome: 'Gabrielly Ribeiro', cargo: 'Gerente comercial' }}
      menuUsuario={[{ id: 'sair', rotulo: 'Sair', icone: 'log-out', destrutivo: true }]}
      aoEscolherMenuUsuario={(id) => id === 'sair' && sair()}
    >
      <Outlet />
    </Estrutura>
  );
}
```

Para links de verdade do roteador (ctrl+clique abre em nova aba), passe
`renderLink={(p) => <Link to={p.href} className={p.className} onClick={p.onClick} aria-current={p['aria-current']}>{p.children}</Link>}`.

### Páginas fora do React no mesmo app (Inertia + Blade)

Num app Laravel com páginas Inertia e páginas Blade, o `<Link>` do Inertia só
serve para as páginas Inertia. Marque as outras com `recarregar: true`: o link
vira um `<a>` comum (sem `renderLink` nem `aoNavegar`) e abre com recarga
completa. Vale para o menu, a busca do menu e a trilha. Se a marca aponta para
uma página Blade, use `marca={{ …, recarregar: true }}`.

```tsx
import { Link, router, usePage } from '@inertiajs/react';

<Estrutura
  nav={[
    {
      itens: [
        { rotulo: 'Painel', icone: 'house', rota: '/painel' },                    // Inertia
        { rotulo: 'Relatórios', icone: 'file-text', rota: '/relatorios', recarregar: true }, // Blade
      ],
    },
  ]}
  rotaAtual={usePage().url}
  aoNavegar={(rota) => router.visit(rota)}
  renderLink={(p) => <Link href={p.href} className={p.className} onClick={p.onClick} aria-current={p['aria-current']}>{p.children}</Link>}
  …
/>
```

Do Blade para o Inertia não precisa de nada: um link comum abre a página
Inertia. Para as telas Blade com o mesmo layout, veja o pacote Composer
[`celke/kole-laravel`](https://github.com/celkecursos/kole-laravel).

## Componentes

| Grupo | Componentes |
|---|---|
| Layout | `Estrutura`, `Busca`, `CabecalhoPagina`, `BoasVindas`, `TelaLogin`, `Abas`/`Aba`, `Card` |
| Ações | `Botao`, `AcaoLinha`, `Dica` |
| Formulário | `Form` (página ou modal, `entidade`/`modo`), `FormSecao`, `Campo`, `CampoTexto`, `CampoTextarea`, `CampoSenha`, `CampoSelect`, `CampoSelectMultiplo`, `CampoMarcacao`, `Escolha`, `Picklist`, `Filtros` |
| Campos prontos | `CampoCpf`, `CampoCnpj`, `CampoCpfCnpj`, `CampoCep`, `CampoTelefone`, `CampoPlaca`, `CampoRenavam`, `CampoChassi`, `CampoCnh`, `CampoImei`, `CampoEmail`, `CampoData`, `CampoHora`, `CampoDataHora`, `CampoMoeda`, `CampoInteiro`, `CampoUf`, `CampoUfMultiplo`, `CampoTipoPessoa` |
| Busca remota | `CampoBusca`, `CampoCidade`, `useBuscaAssincrona` |
| Arquivos | `CampoAnexo`, `VisualizadorArquivo`, `DialogoArquivo`, `Foto` |
| Dados | `Tabela`, `ListaCards`, `Paginacao`, `Indicador`/`Indicadores`, `Detalhes`, `Status`, `Chip`, `Avatar`, `GrupoAvatares`, `Placa` |
| Feedback | `Alerta`, `Dialogo` (central ou `lateral`), `useConfirmacao` (+ `.remover()`, `.avisar()`), `useToast`, `Vazio`, `Skeleton`, `Carregando` |
| Conversa | `Conversa`, `Mensagem`, `CampoMensagem`, `Referencias`, `ListaConversas`, `InicioConversa`, `BlocoCodigo`, `ChatFlutuante` |
| Site público | `EstruturaSite`, `RodapeSite`, `SecaoSite`, `DestaqueSite`, `CabecalhoSecao`, `CampoPesquisa`, `CardConteudo`, `CardRecurso`, `CardDepoimento`, `CardPlano`, `FaixaNumeros`, `FaixaChamada`, `ListaNumerada`, `FiltroPilulas`, `ConteudoArtigo`, `SumarioPagina`, `Newsletter` |
| Calendário | `Calendario` (visões mês, semana, dia e lista, com arrastar), `MiniCalendario`, `repetirEvento` |
| Kanban e tarefas | `Kanban`, `CartaoKanban`, `ListaTarefas`, `QuadroArrastavel`, `SeloPrioridade`, `SeloPrazo`, `Etiqueta`, `tempoRelativo`, `situacaoPrazo` |
| Gráficos | `GraficoLinha`, `GraficoBarras`, `GraficoCombinado`, `GraficoDispersao`, `GraficoRosca`, `MapaCalor`, `Minigrafico` (e `tendencia` no `Indicador`), `regressaoLinear` |
| Idioma | `SeletorIdioma`, `Bandeira`, `useTextos`, `useIdioma`, `textosPtBR`, `textosEn`, `textosEs`, `interpolar`, `pluralizar` (e `idiomas` na `Estrutura`) |
| Finanças | `Valor`, `ProvedorValores`, `BotaoOcultarValores`, `NavegadorPeriodo`, `SeletorContexto`, `formatarMoeda`, `formatarPercentual`, `dividirEmParcelas`, `periodoDe`, `noPeriodo` |

### Conversa (chat)

`Conversa` é a área rolável (acompanha o fim durante o streaming e para de
puxar se a pessoa rolar para cima); `Mensagem` é a bolha; `CampoMensagem` é o
campo de envio (Enter envia, Shift+Enter quebra a linha); `Referencias` lista
as fontes de uma resposta. A conversa ocupa a altura do contêiner pai, e a
busca da resposta (rede, streaming, Markdown) fica com o app.

```tsx
import { useState } from 'react';
import {
  CampoMensagem,
  Conversa,
  Mensagem,
  Referencias,
  type AutorMensagem,
  type EstadoMensagem,
  type ItemReferencia,
} from '@celke/kole-react';

interface ItemChat {
  id: string;
  autor: AutorMensagem;
  estado: EstadoMensagem;
  texto: string;
  hora: Date;
  fontes?: ItemReferencia[]; // { id, titulo, detalhe?, trecho?, href? }
}

interface ChatProps {
  mensagens: ItemChat[];
  gerando: boolean;
  enviar: (texto: string) => void;
  parar: () => void;
}

export function Chat({ mensagens, gerando, enviar, parar }: ChatProps) {
  const [texto, setTexto] = useState('');
  return (
    <div style={{ height: '32rem' }}>
      <Conversa
        campo={
          <CampoMensagem
            valor={texto}
            aoMudar={setTexto}
            aoEnviar={(t) => {
              enviar(t);
              setTexto('');
            }}
            gerando={gerando}
            aoParar={parar}
          />
        }
      >
        {mensagens.map((m) => (
          <Mensagem
            key={m.id}
            autor={m.autor} // 'usuario' | 'assistente' | 'sistema'
            estado={m.estado} // 'enviando' | 'gerando' | 'concluida' | 'erro'
            hora={m.hora}
            copiavel={m.autor === 'assistente'}
            rodape={m.fontes && <Referencias itens={m.fontes} />}
          >
            {m.texto}
          </Mensagem>
        ))}
      </Conversa>
    </div>
  );
}
```

#### Assistente de IA

A demo tem a página modelo **Assistente** (Advanced UI): histórico ao lado,
tela inicial com sugestões, anexos, ferramentas, seletor de modo e respostas com
tabela e código. As peças:

- `ListaConversas`: histórico agrupado por data (Fixadas, Hoje, Ontem, Últimos 7
  dias, Últimos 30 dias e os meses), busca sem acento, renomear no próprio item
  (Enter salva, Esc cancela), fixar e excluir. Ocupa a altura do pai.
- `InicioConversa`: saudação e sugestões, no `vazio` da `Conversa`. Em painel
  estreito, `aparencia="pilulas"`.
- `CampoMensagem` com `anexos` (chips com `progresso` e `erro`), `aoRemoverAnexo`
  e `aoAdicionarArquivos` (arrastar para o campo ou colar). Com anexos, dá para
  enviar sem texto; enquanto um anexo sobe, o Enviar espera.
- `BlocoCodigo`: código com a linguagem e o botão de copiar. A `Mensagem` já
  estiliza o Markdown renderizado pelo app (listas, tabelas, citações).

```tsx
import ReactMarkdown from 'react-markdown';
import { BlocoCodigo, InicioConversa, ListaConversas, type AnexoMensagem } from '@celke/kole-react';

<ListaConversas
  itens={conversas} // { id, titulo, data, fixada? }
  ativa={ativa}
  aoEscolher={setAtiva}
  aoNova={() => setAtiva(null)}
  aoRenomear={(id, titulo) => api.renomear(id, titulo)}
  aoExcluir={(id) => api.excluir(id)}
/>;

<Conversa
  vazio={<InicioConversa titulo="Como posso ajudar?" sugestoes={[{ titulo: 'Resumir as vendas do mês', icone: 'chart-line' }]} aoEscolher={(s) => enviar(s.titulo)} />}
  campo={<CampoMensagem valor={texto} aoMudar={setTexto} aoEnviar={enviar} anexos={anexos} aoRemoverAnexo={remover} aoAdicionarArquivos={subir} />}
>
  {mensagens.map((m) => (
    <Mensagem key={m.id} autor={m.autor} estado={m.estado}>
      <ReactMarkdown
        components={{
          code: ({ className, children }) =>
            className ? <BlocoCodigo linguagem={className.replace('language-', '')} codigo={String(children).trimEnd()} /> : <code>{children}</code>,
        }}
      >
        {m.texto}
      </ReactMarkdown>
    </Mensagem>
  ))}
</Conversa>;
```

A chamada à API (streaming), o histórico salvo, o envio dos anexos e o
Markdown ficam com o app.

#### Chat flutuante (site)

`ChatFlutuante` é o atendimento de site: botão fixo no canto ("Fale com a
gente", com `naoLidas`) que abre um painel com a conversa. Esc fecha e o foco
volta ao botão; no celular, o painel ocupa a tela. As páginas modelo do site da
demo já trazem um, com as perguntas frequentes como sugestões.

```tsx
<ChatFlutuante titulo="Fale com a gente" subtitulo="Respondemos em poucos minutos" naoLidas={1}>
  <Conversa
    vazio={<InicioConversa aparencia="pilulas" titulo="Olá! Como podemos ajudar?" sugestoes={faq} aoEscolher={(s) => enviar(s.titulo)} />}
    campo={<CampoMensagem valor={texto} aoMudar={setTexto} aoEnviar={enviar} />}
  >
    {mensagens}
  </Conversa>
</ChatFlutuante>
```

### Site público

Para a parte aberta do sistema (site institucional, loja, portal) há uma moldura
própria, sem o menu lateral: `EstruturaSite`, com barra de aviso opcional,
cabeçalho fixo (marca, menu horizontal, botão de tema e as `acoes`), conteúdo e
`RodapeSite`. No celular, o menu vai para um painel aberto pelo botão Menu. Os
links são `<a href>` de verdade: dentro da `EstruturaSite`, os cartões, as listas e
a `Trilha` navegam pelo `aoNavegar`/`renderLink` do app, e Ctrl+clique ou o botão
do meio abrem em nova aba. A demo tem as páginas modelo de um site genérico (menu
**Site**): Home (faixa escura ou clara), Sobre, Serviços e planos, Blog, Post (sem
e com coluna lateral), Contato e as páginas legais (Termos de uso, Política de Privacidade e Política de
Cookies, com texto de exemplo a ser revisado por um advogado).

```tsx
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Botao,
  CabecalhoSecao,
  CardConteudo,
  CardDepoimento,
  CardPlano,
  CardRecurso,
  DestaqueSite,
  EstruturaSite,
  FaixaChamada,
  FaixaNumeros,
  ListaNumerada,
  Newsletter,
  RodapeSite,
  SecaoSite,
} from '@celke/kole-react';

export function LayoutSite() {
  const { pathname } = useLocation();
  return (
    <EstruturaSite
      marca={{ nome: 'Sua Marca', href: '/', logo: '/logo.svg' }}
      nav={[
        { rotulo: 'Home', rota: '/' },
        { rotulo: 'Serviços', rota: '/servicos' },
        { rotulo: 'Contato', rota: '/contato' },
      ]}
      rotaAtual={pathname}
      renderLink={(p) => (
        <Link to={p.href} className={p.className} onClick={p.onClick} aria-current={p['aria-current']}>
          {p.children}
        </Link>
      )}
      aviso={<><b>Novidade:</b> conheça a nova versão.</>}
      acoes={<Botao rotulo="Fale conosco" />}
      rodape={
        <RodapeSite
          nome="Sua Marca"
          descricao="O que a empresa faz e para quem."
          extra={<Newsletter aparencia="linha" rotuloBotao="Assinar" aoInscrever={async (email) => { /* envie ao servidor */ }} />}
          colunas={[{ titulo: 'Navegação', links: [{ rotulo: 'Serviços', rota: '/servicos' }] }]}
          copyright="© 2026 Sua Marca"
          redes={[{ rotulo: 'Instagram', rota: 'https://instagram.com/suamarca' }]}
        />
      }
    >
      <Outlet />
    </EstruturaSite>
  );
}

export function Home() {
  return (
    <>
      {/* aparencia="claro" centraliza o texto e põe a `midia` embaixo */}
      <DestaqueSite selo="Seu slogan" titulo="Uma frase forte sobre o seu negócio." realce="negócio" lateral={<img src="/produto.png" alt="" />}>
        <Botao rotulo="Começar agora" severidade="destaque" tamanho="grande" />
        <FaixaNumeros aparencia="simples" itens={[{ valor: '+1.200', rotulo: 'clientes' }]} />
      </DestaqueSite>
      <SecaoSite>
        <CabecalhoSecao sobretitulo="Diferenciais" titulo="Por que escolher a Sua Marca" />
        <CardRecurso icone="shield" titulo="Seguro e confiável">Garantias e cuidados com o cliente.</CardRecurso>
        <ListaNumerada itens={[{ titulo: 'Contato inicial', descricao: 'O cliente conta o que precisa.' }]} />
        <FaixaNumeros itens={[{ valor: '98', sufixo: '%', rotulo: 'de satisfação' }]} />
        <CardDepoimento texto="O atendimento foi rápido e o resultado veio." nome="Nome do Cliente" cargo="Cargo · Empresa" />
        <CardConteudo href="/blog/post" midia={<img src="/post.jpg" alt="" />} titulo="Título do post" />
        <CardPlano nome="Profissional" preco="99" periodo="/mês" itens={['Suporte prioritário']} destaque acao={<Botao rotulo="Assinar" bloco />} />
        <FaixaChamada titulo="Pronto para começar?" acoes={<Botao rotulo="Solicitar contato" severidade="destaque" />} />
      </SecaoSite>
    </>
  );
}
```

`CardConteudo` tem cinco formatos: `vertical` (grade de posts), `destaque`,
`horizontal` (post em destaque), `compacto` e `linha` (listagem com quadro à
direita). `CardRecurso` serve para diferenciais, serviços (`formato="horizontal"`),
valores (`numero`) e canais de contato (`sobretitulo`). `ConteudoArtigo` estiliza o
texto de posts e páginas como termos de uso; HTML vindo de Markdown deve chegar
sanitizado. `SumarioPagina` lista as seções de uma página longa (pelo `id` dos
títulos), marca a seção em leitura e rola até ela sem trocar o endereço, então
funciona também em app com rotas no `#hash`. `Newsletter` confere o e-mail antes de chamar `aoInscrever`. Para
perguntas frequentes, use o `Acordeao` (`icone="mais"`).

Tokens próprios do site: `--site-largura`, `--r-site`, `--r-site-2`,
`--sombra-site`, `--fs-site-hero`, `--fs-site-titulo`, `--fs-site-secao` e os tons
sobre o marinho (`--site-escuro-*`). A cor de ação é o `--pri` de sempre: para a cor
da marca do cliente, redefina `--pri`, `--pri-ink`, `--pri-bg` e `--pri-bd` (veja
"Tema e tokens").

### Calendário

`Calendario` mostra eventos na visão **mês** (grade de 6 semanas, hoje em
destaque, até `maxPorDia` eventos por dia e "+N mais", que abre a lista do dia),
nas visões **semana** e **dia** (faixa de horários de `horaInicio` a `horaFim`,
eventos posicionados pela hora, os que se sobrepõem lado a lado, faixa de dia
inteiro no topo e a linha vermelha do "agora") e na visão **lista** (eventos
agrupados por dia, a melhor no celular). O app guarda
e busca os eventos: o componente avisa o período visível em `aoMudarPeriodo` e os
cliques em `aoClicarDia` (ex.: criar evento) e `aoClicarEvento`.

```tsx
import { Calendario, type EventoCalendario } from '@celke/kole-react';

const eventos: EventoCalendario[] = [
  { id: 1, titulo: 'Reunião de vendas', inicio: new Date(2026, 10, 9, 8, 30), fim: new Date(2026, 10, 9, 9, 30), cor: 'pri', categoria: 'Reunião' },
  { id: 2, titulo: 'Promoção de Pix', inicio: new Date(2026, 10, 12), fim: new Date(2026, 10, 18), diaInteiro: true, cor: 'graf-2' },
];

<Calendario
  eventos={eventos}
  inicioSemana={1} // 0 = domingo (padrão), 1 = segunda
  aoMudarPeriodo={({ inicio, fim }) => {
    /* buscar os eventos de [inicio, fim) */
  }}
  aoClicarDia={(dia) => {
    /* abrir o formulário de novo evento */
  }}
  aoClicarEvento={(evento) => {
    /* abrir o evento */
  }}
  horaInicio={7} // semana e dia: faixa de horários (padrão 7h às 21h)
  horaFim={21}
  aoClicarHorario={(dataHora) => {
    /* semana e dia: clique num horário vazio, arredondado para a meia hora */
  }}
/>;
```

Cores do evento pelos tokens: `pri`, `ok`, `warn`, `err`, `info`, `destaque` e
`graf-1` a `graf-6`. Teclado na visão mês: setas andam pelos dias, Home/End vão
ao começo e ao fim da semana, Page Up/Down trocam de mês e Enter equivale ao
clique no dia. Na semana e no dia, um cursor de 30 minutos: ↑/↓ mudam o horário,
←/→ o dia (passando para a semana ou o dia vizinho), Home/End vão ao primeiro e
ao último horário e Enter chama `aoClicarHorario` (sem ele, abre o evento daquele
horário). O leitor de tela ouve o dia, a hora e os eventos do horário. `visoes` escolhe quais visões aparecem na barra (padrão: as quatro).

#### Arrastar e esticar

Com `aoAlterarEvento`, o evento é arrastado para outro dia (mês e faixa de dia
inteiro) ou horário (semana e dia, de 15 em 15 minutos), e a borda de baixo do
bloco estica a duração. No toque, segure o evento antes de arrastar; Esc cancela.
Pelo teclado, Alt+setas movem (←/→ um dia; ↑/↓ uma semana no mês ou 15 minutos na
semana e no dia) e Alt+Shift+↑/↓ esticam. O calendário só avisa: o app grava e
devolve a lista nova em `eventos`. `fixo: true` trava um evento.

```tsx
<Calendario
  eventos={eventos}
  aoAlterarEvento={(evento, { inicio, fim, tipo }) => {
    // tipo: 'mover' (mesma duração) ou 'esticar' (só o fim mudou)
    setEventos((l) => l.map((e) => (e.id === evento.id ? { ...e, inicio, fim } : e)));
  }}
/>
```

#### Cadastrar: intervalo e rascunho

Na semana e no dia, `aoSelecionarHorario` recebe `{ inicio, fim }`: arrastar sobre
horários vazios escolhe o intervalo (de 15 em 15 minutos) e um clique escolhe a
meia hora. No cursor do teclado, Shift+↑/↓ aumentam o intervalo e Enter
confirma. Com ele, o clique na faixa de horários não chama o `aoClicarHorario`.
Abra o formulário do app e passe os dados em `rascunho`: o evento aparece
tracejado, em qualquer visão, enquanto o formulário está aberto.

```tsx
const [novo, setNovo] = useState<{ inicio: Date; fim: Date; titulo: string } | null>(null);

<Calendario
  eventos={eventos}
  aoSelecionarHorario={({ inicio, fim }) => setNovo({ inicio, fim, titulo: '' })}
  rascunho={novo} // { inicio, fim?, titulo?, cor?, diaInteiro? }
/>;
```

O formulário fica no app (cada sistema tem seus campos). A documentação da demo
traz um pronto para copiar, com título, categoria, dia inteiro, data, horários,
"Repete" e excluir só um dia ou a série toda.

#### Eventos que se repetem

A série fica no app (o evento base e a regra), e `repetirEvento` calcula as
ocorrências do período visível. Cada ocorrência ganha `id` `"<id>@aaaa-mm-dd"`,
`repete: true` (ícone de repetição) e `serie` com o id da base. Mensal no dia 31
pula os meses sem esse dia.

```tsx
import { repetirEvento, type PeriodoCalendario } from '@celke/kole-react';

const [periodo, setPeriodo] = useState<PeriodoCalendario | null>(null);
const ocorrencias = periodo
  ? repetirEvento(
      { id: 'vendas', titulo: 'Reunião de vendas', inicio: new Date(2026, 10, 2, 9), fim: new Date(2026, 10, 2, 10) },
      { frequencia: 'semanal', diasSemana: [1, 4], ate: new Date(2026, 11, 31), excecoes: [new Date(2026, 10, 19)] },
      periodo,
    )
  : [];

<Calendario eventos={[...ocorrencias, ...avulsos]} aoMudarPeriodo={setPeriodo} />;
```

Regra: `frequencia` (`diaria`, `semanal`, `mensal`, `anual`), `intervalo` (a cada
N), `diasSemana` (semanal, `0` = domingo), `ate`, `vezes` e `excecoes` (dias que a
série pula). Para mudar só uma ocorrência arrastada, ponha o dia dela em
`excecoes` e crie um evento avulso com o horário novo.

#### MiniCalendario

Mês pequeno para a coluna lateral: escolhe o dia, mostra bolinhas nos dias com
evento e destaca a semana visível. Ligue o dia escolhido à prop `data` do
`Calendario`, que leva a agenda até ele.

```tsx
<MiniCalendario
  valor={dia}
  aoEscolher={setDia}
  marcados={diasComEvento} // Date[]
  destaque={periodo} // { inicio, fim } com fim exclusivo, ex.: a semana do Calendario
  aoMudarMes={(mes) => {
    /* buscar os marcados do mês */
  }}
/>
<Calendario eventos={eventos} data={dia} aoMudarPeriodo={setPeriodo} />
```
No celular, a semana mostra os eventos como faixas de cor; use dia ou lista para
ler os títulos.

### Kanban e tarefas

`Kanban` é o quadro pronto: colunas com cor, contagem, `limite` de cartões e
menu (renomear, recolher, excluir), cartões que se arrastam entre colunas (mouse,
toque e teclado), "Adicionar cartão", "Adicionar coluna", rolagem horizontal e
tela vazia. Cada ação aparece quando o callback dela é passado. Durante o
arraste o quadro mostra uma prévia; ao soltar, `aoMudar` recebe as colunas e
`aoSoltar` o movimento, que é o que o servidor precisa para gravar.

```tsx
import { CartaoKanban, Kanban, type ColunaKanban } from '@celke/kole-react';

const [colunas, setColunas] = useState<ColunaKanban<Cartao>[]>(inicial);

<Kanban
  colunas={colunas}
  aoMudar={setColunas}
  aoSoltar={({ item, de, para }) => api.moverCartao(item.id, para.coluna, para.indice)}
  aoSoltarColuna={({ colunas }) => api.ordenarColunas(colunas.map((c) => c.id))} // liga o arraste das colunas
  filtro={busca ? (c) => c.titulo.includes(busca) : undefined} // esconde sem tirar do lugar
  nomeItem={(c) => c.titulo}
  renderCartao={(c, alca) => (
    <CartaoKanban
      titulo={c.titulo}
      etiquetas={c.etiquetas}
      prioridade={c.prioridade} // 'baixa' | 'media' | 'alta' | 'critica'
      vencimento={c.vencimento} // 'AAAA-MM-DD': atrasado, hoje, em breve
      subtarefas={{ feitas: 2, total: 5 }}
      responsaveis={c.pessoas}
      alca={alca}
      aoAbrir={() => abrirDetalhe(c)}
    />
  )}
  aoAdicionarCartao={(colunaId, titulo) => criarCartao(colunaId, titulo)}
  aoAdicionarColuna={(titulo) => criarColuna(titulo)}
  aoRenomearColuna={renomear}
  aoRecolherColuna={recolher}
  aoExcluirColuna={async (id) => (await confirmar.remover()) && excluir(id)}
/>
```

`ListaTarefas` mostra tarefas em linhas: marcar como feita (`aoConcluir`),
situação, prioridade, prazo, etiquetas e responsáveis; `aoReordenar` liga o
arraste e recebe a lista na ordem nova; `filtro` faz as visões (hoje,
atrasadas, uma lista) sem perder a ordem das escondidas.

Os dois são montados sobre o `QuadroArrastavel`, que também serve sozinho:
`layout="faixa"`, `podeSoltar` (regra de destino), `visivel`,
`colunasArrastaveis` e rolagem automática perto das bordas. A demo traz as telas
completas em Aplicativos › Kanban (listagem de quadros, quadro com filtros e
detalhe do cartão) e Aplicativos › Tarefas.

### Finanças

`Valor` mostra dinheiro com o sentido certo: guarde o valor sempre positivo e
diga o `tipo` (`receita` em verde com `+`, `despesa` em vermelho com `−`,
`neutro` para transferência). Dentro de um `ProvedorValores`, o
`BotaoOcultarValores` esconde todos de uma vez, como nos apps de banco.

```tsx
import { BotaoOcultarValores, NavegadorPeriodo, ProvedorValores, Valor, periodoDe } from '@celke/kole-react';

const [periodo, setPeriodo] = useState(() => periodoDe('mes')); // { tipo, de: 'AAAA-MM-DD', ate }

<ProvedorValores chave="financas-ocultos">
  <NavegadorPeriodo valor={periodo} aoMudar={setPeriodo} /> {/* ‹ Novembro de 2026 › */}
  <BotaoOcultarValores />
  <Valor valor={2200} tipo="despesa" forte /> {/* −R$ 2.200,00 */}
</ProvedorValores>
```

`GraficoRosca` faz o "despesas por categoria" (com `maxFatias` e `aoEscolher`
para abrir os lançamentos da fatia) e o `SeletorContexto`, na prop `contexto`
da `Estrutura`, troca o sistema inteiro entre pessoal e empresa (ou filiais).
`formatarMoeda`, `dividirEmParcelas` e `somarMoeda` cuidam do sinal de menos,
dos centavos das parcelas e do erro de ponto flutuante. A demo traz a solução
completa em Soluções › Finanças.

### Gráficos

Desenhados em SVG próprio, sem biblioteca de gráficos. A largura
acompanha o container (o desenho é refeito no tamanho novo, sem esticar o texto),
os números e as datas saem em pt-BR (`1.234,5`, `jan/21`) e as cores vêm dos
tokens `--graf-*`, então funcionam nos temas claro, escuro e sistema.

Comum a todos: `titulo` (obrigatório; vira o nome acessível), `descricao` (resumo
para leitor de tela), `altura` (padrão `280` px), `legenda` (padrão `true`; clicar
esconde ou mostra a série), `carregando`, `textoVazio` e `verDados` (padrão
`true`; alterna entre o gráfico e uma `Tabela` com os mesmos valores, o caminho
completo para quem não enxerga o gráfico). Passe o mouse, toque ou foque o
gráfico e use as setas do teclado: uma caixa mostra o valor de cada série. `null`
é "sem dado": falha na linha, barra ausente, célula hachurada, nunca zero.

**Animação** (`animacao`, padrão `false`): na entrada, as linhas se desenham da
esquerda para a direita, as barras crescem a partir do zero e os pontos e as
células surgem; rótulos e referências chegam depois. É só CSS e roda uma vez,
quando o gráfico aparece: dados que chegam depois (atualização periódica, por
exemplo) não reiniciam a animação. Com "reduzir movimento" ligado no sistema
(`prefers-reduced-motion`), nada se mexe. O `Indicador` também aceita `animacao`
para o minigráfico da `tendencia`. Prefira deixar desligado em painéis abertos
todo dia: a animação ajuda em apresentações, mas atrasa a leitura.

```tsx
import {
  GraficoBarras,
  GraficoCombinado,
  GraficoDispersao,
  GraficoLinha,
  Indicador,
  MapaCalor,
  regressaoLinear,
} from '@celke/kole-react';

const reais = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

// séries no tempo: faixa sombreada no eixo X e linha de referência
<GraficoLinha
  titulo="Faturamento mensal"
  dados={[{ mes: '2025-10', valor: 248000 }, { mes: '2025-11', valor: null }, { mes: '2025-12', valor: 342000 }]}
  eixoX={{ chave: 'mes', tipo: 'data' }}
  eixoY={{ rotulo: 'Faturamento', formatar: reais }}
  series={[{ chave: 'valor', rotulo: 'Faturamento' }]}
  area
  faixas={[{ de: '2025-11', ate: '2025-12', rotulo: 'Fim de ano' }]}
  referencias={[{ valor: 260000, rotulo: 'Média mensal' }]}
/>;

// barras: várias séries ficam agrupadas; `divergente` pinta acima e abaixo de zero;
// `orientacao="horizontal"` serve para rankings (rótulo longo quebra em duas linhas)
<GraficoBarras
  titulo="Faturamento acima ou abaixo da meta"
  dados={[{ mes: '2026-05', diferenca: -12 }, { mes: '2026-06', diferenca: 8.5 }]}
  eixoX={{ chave: 'mes', tipo: 'data' }}
  eixoY={{ unidade: 'mil R$' }}
  series={[{ chave: 'diferenca', rotulo: 'Diferença para a meta' }]}
  divergente
/>;

// dois eixos: a legenda diz o eixo de cada série ("Ticket médio (R$, eixo direito)")
<GraficoCombinado
  titulo="Pedidos e ticket médio"
  dados={[{ mes: '2026-05', pedidos: 1420, ticket: 198.4 }, { mes: '2026-06', pedidos: 1510, ticket: 203.1 }]}
  eixoX={{ chave: 'mes', tipo: 'data' }}
  eixoY={{ rotulo: 'Pedidos' }}
  eixoYDireito={{ rotulo: 'Ticket médio', unidade: 'R$' }}
  barras={[{ chave: 'pedidos', rotulo: 'Pedidos' }]}
  linhas={[{ chave: 'ticket', rotulo: 'Ticket médio' }]}
/>;

// um ponto por item; `regressao` desenha a reta e mostra r, r² e n
<GraficoDispersao
  titulo="Preço × unidades vendidas"
  dados={produtos} // [{ produto: 'Café torrado — 500 g', preco: 18.9, unidades: 610, promocao: false }, …]
  eixoX={{ rotulo: 'Preço', unidade: 'R$' }}
  eixoY={{ rotulo: 'Unidades vendidas' }}
  chaveX="preco"
  chaveY="unidades"
  chaveRotulo="produto"
  chaveDestaque="promocao"
  regressao
  nota="Estatísticas a mais (como o p-valor) são calculadas pelo app."
/>;

// grade de células (ex.: hora × dia da semana); com muitas linhas, rola com os rótulos das colunas presos no topo
<MapaCalor
  titulo="Pedidos por hora e dia da semana"
  linhas={['08h', '09h']}
  colunas={['seg', 'ter']}
  valores={[{ linha: '08h', coluna: 'seg', valor: 72 }, { linha: '08h', coluna: 'ter', valor: null }]}
  unidade="pedidos"
/>;

// minigráfico abaixo do valor, na cor do indicador
<Indicador rotulo="Pedidos em junho" valor={1510} cor="var(--graf-3)" tendencia={[1180, 1240, 1320, 1290, 1420, 1510]} />;

// a mesma conta da dispersão, para usar no app: { inclinacao, intercepto, r, r2, n } ou null
const reta = regressaoLinear([{ x: 4.99, y: 880 }, { x: 18.9, y: 610 }, { x: 39.9, y: 190 }]);
```

Tipos do eixo X: `categoria` (texto, uma faixa por item), `data` (`Date`,
timestamp ou texto `aaaa-mm-dd`/`aaaa-mm`; o rótulo se ajusta a dados diários,
mensais ou anuais) e `numero`. Os rótulos do eixo X nunca se sobrepõem: se não
couberem, aparece um a cada N. `eixo.formatar` troca o formato dos números
(eixo, caixa de detalhes e tabela).

Tokens (definidos nos dois temas; redefina no CSS do app para mudar a paleta):

| Token | Uso |
|---|---|
| `--graf-1` a `--graf-6` | Cores das séries, nessa ordem (contraste de 3:1 ou mais contra `--surface`) |
| `--graf-pos` / `--graf-neg` | Barras divergentes, acima e abaixo de zero |
| `--graf-seq-1` a `--graf-seq-5` | Escala do mapa de calor, do valor mais baixo ao mais alto |
| `--graf-grade`, `--graf-eixo`, `--graf-texto` | Linhas de grade, eixos e rótulos |
| `--graf-faixa` | Faixa sombreada de destaque |

**Volume de pontos:** cada gráfico é fluido até cerca de 2.000 pontos. Séries
maiores devem chegar agregadas (por exemplo, os pedidos de anos somados por mês
em vez de um ponto por pedido, ou o mapa de calor em vez de uma linha só).

Utilitários (lógica pura, também exportados): validadores BR (`isCpf`, `isCnpj`,
`isCnh`, `isImei`, `validar(tipo, valor)`…), `TIPOS_CAMPO` (máscara +
placeholder + regra por tipo), `ESTADOS`/`TIPOS_PESSOA`, por extenso
(`numeroPorExtenso`, `valorMonetarioPorExtenso`, `listaPorExtenso`), texto
(`normalizar`, `nomeProprio`, `nomeCurto`, `iniciais`, `formatCpfCnpj`), datas
pt-BR (`parseDataBr`, `formatDataBr`…), `tituloDeEntidade`/`nomeDeArquivo`,
anexos (`formatBytes`, `tipoDeArquivo`, `iconeArquivo`), senha
(`validarSenha`, `forcaSenha`), picklist, JWT (`decodificarJwt`, `jwtExpirado`…)
e `severidadeCor`. A demo do repositório tem uma página interativa de cada um
(`#/utilitarios`).

Convenções:

- Campos são controlados por `valor` + `aoMudar`; aceitam `rotulo`, `dica`,
  `erro`, `aviso`, `obrigatorio` e `variante="inline"` (pílula com rótulo dentro,
  para barras de filtro).
- Severidades: `ok`, `info`, `warn`, `err`, `neutral` (botão: `pri`, `secundario`,
  `ok`, `warn`, `err`).
- Ícones: [Lucide](https://lucide.dev/icons) (SVG, já incluso no pacote). Passe o
  nome (`icone="save"`, `icone="trash-2"`) ou o componente
  (`import { Rocket } from 'lucide-react'` → `icone={<Rocket />}`). Só os ícones
  registrados entram no bundle; para usar outro pelo nome, registre uma vez:
  `registrarIcones({ rocket: Rocket })`. Um nome não registrado avisa no console
  em desenvolvimento.
- Pendência de campo: o erro aparece ao **sair** do campo depois de digitar, ou
  quando o `Form` tenta salvar (todos os campos acusam). Um valor carregado de
  fora que não atende ao formato não é recusado: vira aviso âmbar.
- Grade do `FormSecao`: 4 colunas na página, 3 no modal; `className="lp-col-2"`,
  `lp-col-3` ou `lp-col-full` alarga o campo.
- Cadastro com vários formulários: passe `menu` (itens com `id`, `rotulo`,
  `icone`, `href`) e `menuAtivo` ao `Form` de cada página; o menu lateral liga
  os formulários entre si, cada um com o próprio Salvar.

## Tema e tokens

Toda cor/medida vem de variáveis CSS (os tokens). Para mudar a marca, redefina
os tokens no CSS do app (a ordem dos imports não importa, veja [CSS](#css)) — por exemplo
`--navy` (marinho da sidebar), `--pri` (azul de ação) e `--acento-claro` (laranja
do item ativo). O tema escuro tem valores próprios, então redefina lá também:

```css
:root {
  --pri: #0f766e;
  --pri-ink: #115e59;
}
[data-theme='dark'] {
  --pri: #2dd4bf;
  --pri-ink: #5eead4;
}
```

O tema vem do atributo `data-theme` no `<html>`: `light`, `dark` ou `system`
(segue o modo do sistema operacional, inclusive se ele mudar com a página
aberta). No `ProvedorUi`, são os temas `claro`, `escuro` e `sistema`
(`temaInicial`, `definirTema`). Enquanto a pessoa não escolhe, vale o
`temaInicial`, e sem ele o `sistema`. `escuro` no `usePreferencias()` diz o que
está na tela. A densidade usa as classes `density-compact`, `density-comfortable` e
`density-cozy` no `<body>`. O `ProvedorUi` cuida de tudo isso. A lista
completa de tokens, com os valores dos dois temas, está em
`@celke/kole-react/tokens.css`.

Para usar só os tokens fora do React: `@import '@celke/kole-react/tokens.css';`
e `<html data-theme="system">` (ou `light`/`dark`) para escolher o tema sem JS.

## CSS

Classes CSS usam o prefixo `lp-`, e todo o CSS da biblioteca fica na camada
`@layer kole`. CSS fora de camada sempre vence CSS em camada, então o CSS do
app personaliza o kole sem disputar especificidade nem depender da ordem dos
imports. O lado oposto: uma regra global do app (`a { color: … }`,
`h1 { font-size: … }`) também atinge os componentes, por isso escope as regras
de elemento do app (por exemplo, `.conteudo-artigo h1`).

### Com Tailwind 4

A ordem das camadas precisa ser declarada **antes** de qualquer CSS, então o
CSS do app (com o Tailwind) é importado antes do `estilos.css`:

```css
/* app.css — esta linha vem antes do @import do Tailwind */
@layer theme, base, kole, components, utilities;
@import 'tailwindcss';
@import '@celke/kole-react/tailwind.css'; /* opcional: a ponte abaixo */
```

```tsx
// main.tsx
import './app.css';
import '@celke/kole-react/estilos.css';
```

Assim o kole vence o preflight do Tailwind (botões e campos mantêm o estilo) e
os utilitários vencem o kole (`<Botao className="mt-4" />` funciona). Se o
`estilos.css` vier primeiro, a camada `kole` fica abaixo do preflight e os
componentes perdem o estilo.

A ponte `@celke/kole-react/tailwind.css` faz duas coisas:

- o `dark:` do Tailwind segue o tema do kole (`data-theme`), e não o do sistema
  operacional, então uma tela com os dois não fica metade clara e metade escura;
- os tokens viram utilitários com o mesmo nome: `bg-surface`, `text-ink`,
  `text-t3`, `border-border`, `bg-pri`, `text-ok-fg`, `bg-err-bg`,
  `rounded-card`, `rounded-pill`… Como apontam para os tokens, trocam de tema
  junto com o kole. `font-sans` e `font-mono` passam a ser as fontes do kole.
  Para o site público: `max-w-site`, `rounded-site`, `rounded-site-2`,
  `shadow-site`, `text-site-hero`, `text-site-titulo`, `text-site-secao` e, sobre
  o marinho, `bg-navy text-site-escuro-t3`.

A densidade não chega aos utilitários: `p-4` e `h-10` são fixos, só os
componentes `lp-*` mudam com ela.

Vale igual para o site e para o sistema: os componentes de site (`EstruturaSite`,
`DestaqueSite`…) estão no mesmo `estilos.css`, na mesma camada `kole`, então
`<SecaoSite className="mt-8" />` funciona e o preflight não desfaz o estilo deles.

## Desenvolvimento

```bash
npm install
npm run dev          # http://localhost:5173 — demo com todos os componentes
npm run typecheck
npm run build        # dist/index.js + tipos (.d.ts) + dist/estilos.css + dist/tokens.css + dist/tailwind.css
```

A demo usa o mesmo CSS do pacote (na camada `kole`, com o tema `sistema`), e o
`demo/demo.css` fica fora da camada, como o CSS de um app.

### Documentação

A demo tem a seção **Documentação** (`/#/docs/...`): Instalação, Tema e tokens,
Tailwind, Carregamento, Changelog e 60 páginas de componente, com exemplos ao vivo, o código
de cada exemplo e a tabela de props. Fica em `demo/docs/`:

- `nav.ts`: o catálogo (categoria → componente). O menu, o índice
  (`/#/docs/componentes`) e as rotas saem dele.
- `paginas/componentes/<slug>.tsx`: a página de cada componente (`export
  default`), montada com `PaginaComponente`. Componente novo = uma linha no
  catálogo + este arquivo.
- `exemplos/<slug>/<Nome>.tsx`: cada arquivo é ao mesmo tempo o exemplo que roda
  e o código que a página mostra (os imports de `src` aparecem como
  `@celke/kole-react`). Na página: `<Exemplo id="botao/Cores" titulo="Cores" />`.
  As classes `demo-*` dos exemplos são só de layout da demo.
- `props.gerado.json`: as props de todas as interfaces exportadas (`BotaoProps`
  vira `Botao`; `OpcoesToast`, `Coluna`… ficam com o próprio nome), lidas dos
  tipos TypeScript: nome, tipo, obrigatória, padrão e o comentário `/** … */` da
  prop como descrição. É gerado por `npm run docs:props`, que já roda no `dev` e
  no `build:demo`; `npm run docs:conferir` falha se estiver desatualizado.

### Teste visual

Captura cada página do menu da demo (`demo/nav.ts`) nos temas claro e escuro e
compara pixel a pixel com uma referência. Também confere que o tema `sistema`,
com o sistema operacional no escuro, sai igual ao tema escuro. Página nova no
menu entra no teste sozinha.

O print muda de um sistema operacional para outro, então a referência fica em
`tests/visual/__referencia__/<sistema>/`. Só a de Linux vai para o git: é a que
o CI usa (`.github/workflows/visual.yml`, na imagem Docker do Playwright), em
todo PR e na `main`.

**Mudança visual de propósito:** o CI do PR vai falhar apontando as páginas que
mudaram (o relatório com as diferenças fica nos artefatos do workflow). Confira
e grave a referência nova: Actions → Teste visual → Run workflow, na branch do
PR, com "atualizar" marcado. O workflow faz o commit da referência na branch.

No Windows ou no macOS, o teste usa uma referência local, fora do git:

```bash
npx playwright install chromium   # uma vez
npm run visual:referencia         # ANTES de mexer no CSS: grava a referência
npm run visual                    # depois: aponta cada página que mudou
npx playwright show-report        # diferenças lado a lado
```

Para comparar com uma versão já publicada, sirva a demo dela noutra porta (por
exemplo, num `git worktree` da tag) e gere a referência com
`KOLE_URL=http://localhost:5181 npm run visual:referencia`.

Para testar uma versão que ainda não está no npm, instale direto do GitHub
(o `prepare` gera o `dist/` na instalação) ou de um pacote local:

```bash
npm i github:celkecursos/kole-react
# ou: gere o .tgz na pasta da biblioteca e instale no app
npm pack                                   # → celke-kole-react-<versão>.tgz
npm i ../kole-react/celke-kole-react-<versão>.tgz
```

Evite `npm i ../kole-react` (pasta): o npm cria um link e o bundler
pega o React do `node_modules` da biblioteca — dois Reacts no app quebram os hooks
(_Invalid hook call_). Se precisar do link durante o desenvolvimento, use
`resolve: { dedupe: ['react', 'react-dom'] }` no `vite.config` do app.

Publicar uma versão nova: `npm version patch` (só correção) ou `npm version minor`
(muda a aparência ou a API — antes da 1.0, o `^0.x` dos apps não pega a minor
sozinho), registre no [CHANGELOG](CHANGELOG.md) e confira o conteúdo com
`npm pack --dry-run`. Depois do merge na `main`, publique pelo GitHub: Actions →
Publicar → Run workflow (`.github/workflows/publish.yml`). O npm confia nesse
workflow pela publicação confiável (Trusted Publisher, sem token) e o pacote
sai com o atestado de procedência. O workflow só deixa a versão em espera
(`npm stage publish`): ela vai ao ar depois que um mantenedor aprova com o
segundo fator, com `npm stage list @celke/kole-react` e `npm stage approve <id>`
(ou pelo site do npm). O workflow recusa versão que já está no npm.

## Autor

Criado por **Cesar Szpak**.

## Licença

MIT © 2026 Celke — veja o arquivo [LICENSE](https://github.com/celkecursos/kole-react/blob/main/LICENSE).
