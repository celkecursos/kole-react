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
os tokens no CSS do app, carregado **depois** do `estilos.css` — por exemplo
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

O tema escuro usa `<html data-theme="dark">`; a densidade, as classes
`density-compact`, `density-comfortable` e `density-cozy` no `<body>` (o
`ProvedorUi` cuida das duas). A lista completa de tokens, com os valores dos
dois temas, está em `@celke/kole-react/tokens.css`.

Para usar só os tokens fora do React: `@import '@celke/kole-react/tokens.css';`.

## CSS

Classes CSS usam o prefixo `lp-`.

## Desenvolvimento

```bash
npm install
npm run dev          # http://localhost:5173 — demo com todos os componentes
npm run typecheck
npm run build        # dist/index.js + tipos (.d.ts) + dist/estilos.css + dist/tokens.css
```

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

Publicar uma versão nova: `npm version patch` e `npm publish` (o `prepare` roda o
build; confira o conteúdo antes com `npm pack --dry-run`).

## Autor

Criado por **Cesar Szpak**.

## Licença

MIT © 2026 Celke — veja o arquivo [LICENSE](https://github.com/celkecursos/kole-react/blob/main/LICENSE).
