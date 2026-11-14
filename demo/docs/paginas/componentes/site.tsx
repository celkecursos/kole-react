import { Botao } from '../../../../src';
import { C, Codigo } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

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
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="site"
      icone="app-window"
      componente="EstruturaSite"
      outros={['RodapeSite', 'SecaoSite', 'DestaqueSite', 'CabecalhoSecao', 'CardRecurso', 'CardPlano', 'CardConteudo', 'FaixaNumeros', 'FaixaChamada']}
      importar={['CardDepoimento', 'CampoPesquisa', 'FiltroPilulas', 'Newsletter', 'ListaNumerada', 'SumarioPagina', 'ConteudoArtigo']}
      notas={
        <ul className="doc-lista">
          <li>{t('docs.site.textos.osLinksSaoDe')}<C>{'<a href>'}</C>{rico(t('docs.site.textos.ctrlCliqueAbreEm'))}</li>
          <li>{rico(t('docs.site.textos.cabecalhosecaoEscolheONivel'))}</li>
          <li>{rico(t('docs.site.textos.comTailwindOsUtilitarios'))}</li>
          <li>{rico(t('docs.site.textos.conteudoartigoFormataOHtml'))}</li>
        </ul>
      }
    >
      <p className="doc-p">{rico(t('docs.site.textos.aMolduraEstruturasiteE'))}</p>
      <div className="demo-linha">
        <Botao rotulo={t('docs.site.textos.abrirOSiteModelo')} icone="external-link" onClick={() => (window.location.hash = '/site')} />
      </div>
      <h3 className="doc-exemplo-titulo">{t('docs.site.textos.moldura')}</h3>
      <Codigo codigo={MOLDURA} />
      <Exemplo id="site/Destaque" titulo={t('docs.site.secoes.faixaDeAbertura')} />
      <Exemplo id="site/Secao" titulo={t('docs.site.secoes.secaoRecursosENumeros')} />
      <Exemplo id="site/Planos" titulo={t('docs.site.secoes.planosDepoimentoEChamada')} />
      <Exemplo id="site/Conteudo" titulo={t('docs.site.secoes.blogPesquisaFiltroCards')} />
    </PaginaComponente>
  );
}
