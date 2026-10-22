# @celke/kole-react

Biblioteca de componentes **React** para sistemas administrativos. Design tokens
próprios (cores, raios, densidade, tema claro/escuro), CSS puro e sem dependência
de Tailwind.

## Rodar a demo

```bash
npm install
npm run dev          # http://localhost:5173 — app de exemplo com todos os componentes
```

## Gerar a biblioteca

```bash
npm run build        # dist/index.js + tipos (.d.ts) + dist/estilos.css + dist/tokens.css
npm run typecheck
```

## Usar num app React

```bash
# do npm (depois de publicado)
npm i @celke/kole-react
# direto do GitHub (o `prepare` gera o dist/ na instalação)
npm i github:celkecursos/kole-react
# de um pacote local: gere o .tgz na pasta da biblioteca e instale no app
npm pack                                   # → celke-kole-react-0.1.0.tgz
npm i ../kole-react/celke-kole-react-0.1.0.tgz
```

Evite `npm i ../kole-react` (pasta): o npm cria um link e o bundler
pega o React do `node_modules` da biblioteca — dois Reacts no app quebram os hooks
(_Invalid hook call_). Se precisar do link durante o desenvolvimento, use
`resolve: { dedupe: ['react', 'react-dom'] }` no `vite.config` do app.

Requisitos: React 18.2+ ou 19. A fonte Inter já vem dentro do pacote (o
`estilos.css` carrega só os alfabetos que a página usa). O pacote é só ESM, traz
os tipos TypeScript e já vem marcado com `'use client'`, então funciona no App
Router do Next.js.

Publicar uma versão nova: `npm version patch` e `npm publish` (o `prepare` roda o
build; confira o conteúdo antes com `npm pack --dry-run`).

```tsx
// main.tsx
import '@celke/kole-react/estilos.css';
import { ProvedorUi, Estrutura } from '@celke/kole-react';

createRoot(root).render(
  <ProvedorUi>
    <App />
  </ProvedorUi>,
);
```

`ProvedorUi` liga tema/densidade (lembrados no navegador), toasts (`useToast`) e
confirmação (`useConfirmacao`).

### Layout com React Router

```tsx
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Layout() {
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
      aoEscolherMenuUsuario={(id) => id === 'sair' && logout()}
    >
      <Outlet />
    </Estrutura>
  );
}
```

Para links de verdade do roteador (ctrl+clique abre em nova aba), passe
`renderLink={(p) => <Link to={p.href} className={p.className} onClick={p.onClick} aria-current={p['aria-current']}>{p.children}</Link>}`.

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

Utilitários (lógica pura, também exportados): validadores BR (`isCpf`, `isCnpj`,
`isCnh`, `isImei`, `validar(tipo, valor)`…), `TIPOS_CAMPO` (máscara +
placeholder + regra por tipo), `ESTADOS`/`TIPOS_PESSOA`, por extenso
(`numeroPorExtenso`, `valorMonetarioPorExtenso`, `listaPorExtenso`), texto
(`normalizar`, `nomeProprio`, `nomeCurto`, `iniciais`, `formatCpfCnpj`), datas
pt-BR (`parseDataBr`, `formatDataBr`…), `tituloDeEntidade`/`nomeDeArquivo`,
anexos (`formatBytes`, `tipoDeArquivo`, `iconeArquivo`), senha
(`validarSenha`, `forcaSenha`), picklist, JWT (`decodificarJwt`, `jwtExpirado`…)
e `severidadeCor`. A demo tem uma página interativa de cada um (`#/utilitarios`).

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

Toda cor/medida vem de `src/styles/tokens.css` (CSS vars). Para mudar a marca,
edite os tokens — por exemplo `--navy` (marinho da sidebar), `--pri` (azul de ação) e
`--acento-claro` (laranja do item ativo). O tema escuro usa
`<html data-theme="dark">`; a densidade, as classes `density-compact`,
`density-comfortable` e `density-cozy` no `<body>` (o `ProvedorUi` cuida das duas).

Para usar só os tokens fora do React: `@import '@celke/kole-react/tokens.css';`.

## CSS

Classes CSS usam o prefixo `lp-`.

## Autor

Criado por **Cesar Szpak**.

## Licença

MIT © 2026 Celke — veja o arquivo [LICENSE](LICENSE).
