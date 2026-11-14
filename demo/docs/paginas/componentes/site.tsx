import { Botao } from '../../../../src';
import { C, Codigo } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

const MOLDURA = `import { EstruturaSite, RodapeSite } from '@celke/kole-react';

<EstruturaSite
  marca={{ nome: 'Minha Loja', href: '/', logo: '/logo.svg' }}
  nav={[
    { rotulo: 'Início', rota: '/' },
    { rotulo: 'Planos', rota: '/planos' },
    { rotulo: 'Blog', rota: '/blog' },
  ]}
  rotaAtual={pathname}
  aoNavegar={navegar}
  acoes={<Botao rotulo="Entrar" aparencia="contorno" />}
  rodape={
    <RodapeSite
      nome="Minha Loja"
      descricao="Gestão comercial para o pequeno varejo."
      colunas={[{ titulo: 'Empresa', links: [{ rotulo: 'Sobre', rota: '/sobre' }] }]}
      copyright="© 2026 Minha Loja"
    />
  }
>
  {/* as seções da página */}
</EstruturaSite>`;

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="site"
      icone="app-window"
      componente="EstruturaSite"
      outros={['RodapeSite', 'SecaoSite', 'DestaqueSite', 'CabecalhoSecao', 'CardRecurso', 'CardPlano', 'CardConteudo', 'FaixaNumeros', 'FaixaChamada']}
      importar={['CardDepoimento', 'CampoPesquisa', 'FiltroPilulas', 'Newsletter', 'ListaNumerada', 'SumarioPagina', 'ConteudoArtigo']}
      notas={
        <ul className="doc-lista">
          <li>
            Os links são de verdade (<C>{'<a href>'}</C>): Ctrl+clique abre em nova aba. Dentro da <C>EstruturaSite</C>, eles navegam pelo{' '}
            <C>aoNavegar</C>/<C>renderLink</C> do app.
          </li>
          <li>
            <C>CabecalhoSecao</C> escolhe o nível do título (<C>nivel</C>): mantenha um único <C>h1</C>, o da faixa de abertura.
          </li>
          <li>
            Com Tailwind, os utilitários do site (<C>max-w-site</C>, <C>rounded-site</C>, <C>text-site-hero</C>) seguem os mesmos tokens.
          </li>
          <li>
            <C>ConteudoArtigo</C> formata o HTML de um post (títulos, listas, imagens); <C>SumarioPagina</C> monta o "Nesta página" com
            âncoras.
          </li>
        </ul>
      }
    >
      <p className="doc-p">
        A moldura (<C>EstruturaSite</C> e <C>RodapeSite</C>) ocupa a janela inteira; veja as páginas modelo do site na demo.
      </p>
      <div className="demo-linha">
        <Botao rotulo="Abrir o site modelo" icone="external-link" onClick={() => (window.location.hash = '/site')} />
      </div>
      <h3 className="doc-exemplo-titulo">Moldura</h3>
      <Codigo codigo={MOLDURA} />
      <Exemplo id="site/Destaque" titulo="Faixa de abertura" />
      <Exemplo id="site/Secao" titulo="Seção, recursos e números" />
      <Exemplo id="site/Planos" titulo="Planos, depoimento e chamada" />
      <Exemplo id="site/Conteudo" titulo="Blog: pesquisa, filtro, cards e newsletter" />
    </PaginaComponente>
  );
}
