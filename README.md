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

### Tema sem piscar ao abrir

O `ProvedorUi` só aplica o tema depois que o React monta, e quem salvou o tema
escuro vê a página clara piscar por um instante. Para evitar, aplique o tema no
`<head>`, antes do CSS da página pintar:

```html
<!-- index.html -->
<head>
  <script>(function(){var p={};try{p=JSON.parse(localStorage.getItem("lp-preferencias")||"{}")||{}}catch(e){}var t=p.tema||"sistema";var h=document.documentElement;h.setAttribute("data-theme",{"claro":"light","escuro":"dark","sistema":"system"}[t]||"light");var d={"compacta":"density-compact","confortavel":"density-comfortable","espacosa":"density-cozy"}[p.densidade||"confortavel"];if(d)h.classList.add(d)})();</script>
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
| Dados | `Tabela`, `ListaCards`, `Paginacao`, `Indicador`/`Indicadores`, `Detalhes`, `Status`, `Chip`, `Avatar`, `Placa` |
| Feedback | `Alerta`, `Dialogo` (central ou `lateral`), `useConfirmacao` (+ `.remover()`, `.avisar()`), `useToast`, `Vazio`, `Skeleton`, `Carregando` |
| Conversa | `Conversa`, `Mensagem`, `CampoMensagem`, `Referencias` |
| Gráficos | `GraficoLinha`, `GraficoBarras`, `GraficoCombinado`, `GraficoDispersao`, `MapaCalor`, `Minigrafico` (e `tendencia` no `Indicador`), `regressaoLinear` |

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

### Gráficos

Desenhados em SVG próprio, sem biblioteca de gráficos e sem animação. A largura
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

A densidade não chega aos utilitários: `p-4` e `h-10` são fixos, só os
componentes `lp-*` mudam com ela.

## Desenvolvimento

```bash
npm install
npm run dev          # http://localhost:5173 — demo com todos os componentes
npm run typecheck
npm run build        # dist/index.js + tipos (.d.ts) + dist/estilos.css + dist/tokens.css + dist/tailwind.css
```

A demo usa o mesmo CSS do pacote (na camada `kole`, com o tema `sistema`), e o
`demo/demo.css` fica fora da camada, como o CSS de um app.

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
workflow pela publicação confiável (Trusted Publisher, sem token nem segundo
fator) e o pacote sai com o atestado de procedência. O workflow recusa versão
que já está no npm.

## Autor

Criado por **Cesar Szpak**.

## Licença

MIT © 2026 Celke — veja o arquivo [LICENSE](https://github.com/celkecursos/kole-react/blob/main/LICENSE).
