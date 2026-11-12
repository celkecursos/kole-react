import { Alerta } from '../../../src';
import { C, Codigo } from '../Codigo';
import { PaginaGuia, Secao } from '../PaginaDoc';

const CSS_APP = `/* app.css: esta linha vem antes do @import do Tailwind */
@layer theme, base, kole, components, utilities;
@import 'tailwindcss';
@import '@celke/kole-react/tailwind.css'; /* opcional: a ponte abaixo */`;

const MAIN = `// main.tsx
import './app.css';
import '@celke/kole-react/estilos.css';`;

const UTILITARIOS = `<Card titulo="Resumo" className="mt-4">
  <p className="text-t3">Atualizado agora</p>
  <div className="mt-2 rounded-card border border-border bg-surface p-4">
    <span className="text-ok-fg">Tudo certo</span>
  </div>
</Card>`;

export function DocTailwind() {
  return (
    <PaginaGuia
      titulo="Tailwind"
      icone="code"
      resumo="A kole-react não depende de Tailwind, mas convive com ele. Com a ordem de camadas certa, o kole vence o preflight e os utilitários vencem o kole."
    >
      <Secao id="camadas" titulo="Ordem das camadas">
        <p className="doc-p">
          Todo o CSS da biblioteca fica em <C>@layer kole</C>. A ordem das camadas precisa ser declarada antes de qualquer CSS, então o
          CSS do app (com o Tailwind) é importado antes do <C>estilos.css</C>:
        </p>
        <Codigo linguagem="css" codigo={CSS_APP} />
        <Codigo codigo={MAIN} />
        <Alerta
          severidade="warn"
          titulo="Se o estilos.css vier primeiro"
          mensagem="A camada kole fica abaixo do preflight do Tailwind e botões e campos perdem o estilo."
        />
      </Secao>

      <Secao id="ponte" titulo="A ponte tailwind.css">
        <ul className="doc-lista">
          <li>
            O <C>dark:</C> do Tailwind passa a seguir o tema do kole (<C>data-theme</C>), e não o do sistema operacional.
          </li>
          <li>
            Os tokens viram utilitários com o mesmo nome: <C>bg-surface</C>, <C>text-ink</C>, <C>text-t3</C>, <C>border-border</C>,{' '}
            <C>bg-pri</C>, <C>text-ok-fg</C>, <C>bg-err-bg</C>, <C>rounded-card</C>, <C>rounded-pill</C>… Trocam de tema junto com o kole.
          </li>
          <li>
            <C>font-sans</C> e <C>font-mono</C> passam a ser as fontes do kole.
          </li>
          <li>
            Para o site público: <C>max-w-site</C>, <C>rounded-site</C>, <C>shadow-site</C>, <C>text-site-hero</C>, <C>text-site-titulo</C>{' '}
            e <C>text-site-secao</C>.
          </li>
        </ul>
        <Codigo codigo={UTILITARIOS} />
      </Secao>

      <Secao id="limites" titulo="O que não muda">
        <p className="doc-p">
          A densidade não chega aos utilitários: <C>p-4</C> e <C>h-10</C> são fixos, só os componentes <C>lp-*</C> mudam com ela. Regras
          globais do app (<C>{'a { color: … }'}</C>, <C>{'h1 { … }'}</C>) também atingem os componentes, porque CSS fora de camada vence
          CSS em camada; escope essas regras (por exemplo, <C>.conteudo-artigo h1</C>).
        </p>
      </Secao>
    </PaginaGuia>
  );
}
