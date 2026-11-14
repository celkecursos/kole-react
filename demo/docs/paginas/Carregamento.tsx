import { Tabela } from '../../../src';
import { Exemplo } from '../Exemplo';
import { PaginaGuia, Secao } from '../PaginaDoc';
import { useT, type TradutorDemo } from '../../i18n/useT';
import { rico } from '../../i18n/rico';

const QUAL_USAR = (t: TradutorDemo['t']) => ([
  { id: 1, situacao: t('docs.carregamento.textos.salvarUmFormulario'), usar: t('docs.carregamento.textos.formComSalvando'), porque: t('docs.carregamento.textos.oSalvarGiraE') },
  { id: 2, situacao: t('docs.carregamento.textos.acaoDeUmBotao'), usar: t('docs.carregamento.textos.botaoOuAcaolinhaCom'), porque: t('docs.carregamento.textos.oBotaoContinuaFocavel') },
  { id: 3, situacao: t('docs.carregamento.textos.abrirUmaPaginaOu'), usar: t('docs.carregamento.textos.skeleton'), porque: t('docs.carregamento.textos.aSilhuetaTemO') },
  { id: 4, situacao: t('docs.carregamento.textos.primeiraCargaDeLista'), usar: t('docs.carregamento.textos.tabelaListacardsComCarregando'), porque: t('docs.carregamento.textos.silhuetasNoLugarDas') },
  { id: 5, situacao: t('docs.carregamento.textos.paginarOrdenarFiltrar'), usar: t('docs.carregamento.textos.tabelaListacardsComAtualizando'), porque: t('docs.carregamento.textos.mantemOsDadosAtuais') },
  { id: 6, situacao: t('docs.carregamento.textos.areaSemFormatoConhecido'), usar: t('docs.carregamento.textos.carregando'), porque: t('docs.carregamento.textos.mensagemEAnimacaoNo') },
  { id: 7, situacao: t('docs.carregamento.textos.nadaNaTelaPode'), usar: t('docs.carregamento.textos.carregandoBloqueante'), porque: t('docs.carregamento.textos.cobreATelaE') },
  { id: 8, situacao: t('docs.carregamento.textos.sabeQuantoFalta'), usar: t('docs.carregamento.textos.progresso'), porque: t('docs.carregamento.textos.uploadEImportacaoA') },
  { id: 9, situacao: t('docs.carregamento.textos.cardsDePainelE'), usar: t('docs.carregamento.textos.indicadorGraficosComCarregando'), porque: t('docs.carregamento.textos.cadaCardCarregaSozinho') },
  { id: 10, situacao: t('docs.carregamento.textos.trechoPequenoInline'), usar: t('docs.carregamento.textos.girador'), porque: t('docs.carregamento.textos.indicadorAvulsoComRotulo') },
]);

export function DocCarregamento() {
  const { t } = useT();
  return (
    <PaginaGuia
      pagina="carregamento"
      icone="loader-circle"
    >
      <Secao id="qual-usar" titulo={t('docs.carregamento.secoes.qualUsar')}>
        <Tabela
          rotulo={t('docs.carregamento.textos.qualLoadingUsarEm')}
          registros={QUAL_USAR(t)}
          colunas={[
            { campo: 'situacao', rotulo: t('docs.carregamento.textos.situacao'), destaque: true },
            { campo: 'usar', rotulo: t('docs.carregamento.textos.use') },
            { campo: 'porque', rotulo: t('docs.carregamento.textos.porQue') },
          ]}
        />
        <p className="doc-p">{t('docs.carregamento.textos.regraGeralPrefiraO')}</p>
      </Secao>

      <Secao id="formulario" titulo={t('docs.carregamento.secoes.formulario')}>
        <Exemplo id="carregamento/Formulario" titulo={t('docs.carregamento.secoes.formularioSalvando')}>{rico(t('docs.carregamento.textos.cliqueEmSalvarSalvando'))}</Exemplo>
        <Exemplo id="carregamento/Botao" titulo={t('docs.carregamento.secoes.botaoEAcaoDe')}>{rico(t('docs.carregamento.textos.paraAcoesForaDe'))}</Exemplo>
      </Secao>

      <Secao id="pagina" titulo={t('docs.carregamento.secoes.pagina')}>
        <Exemplo id="carregamento/Pagina" titulo={t('docs.carregamento.secoes.silhuetaDoConteudo')}>{rico(t('docs.carregamento.textos.skeletonNoFormatoDos'))}</Exemplo>
        <Exemplo id="carregamento/Area" titulo={t('docs.carregamento.secoes.areaETelaInteira')}>{rico(t('docs.carregamento.textos.carregandoNumaAreaQuando'))}</Exemplo>
      </Secao>

      <Secao id="listas" titulo={t('docs.carregamento.secoes.listas')}>
        <Exemplo id="carregamento/Lista" titulo={t('docs.carregamento.secoes.primeiraCargaEPaginacao')}>{rico(t('docs.carregamento.textos.carregandoSoNaPrimeira'))}</Exemplo>
      </Secao>

      <Secao id="andamento" titulo={t('docs.carregamento.secoes.andamento')}>
        <Exemplo id="carregamento/Progresso" titulo={t('docs.carregamento.secoes.comProgresso')}>{t('docs.carregamento.textos.quandoDaParaMedir')}</Exemplo>
        <Exemplo id="carregamento/Painel" titulo={t('docs.carregamento.secoes.indicadoresEGirador')} />
      </Secao>

      <Secao id="acessibilidade" titulo={t('docs.carregamento.secoes.acessibilidade')}>
        <ul className="doc-lista">
          <li>{rico(t('docs.carregamento.textos.carregandoEGiradorTem'))}</li>
          <li>{rico(t('docs.carregamento.textos.skeletonEDecorativoMarque'))}</li>
          <li>{rico(t('docs.carregamento.textos.botaoComCarregandoGanha'))}</li>
          <li>{t('docs.carregamento.textos.depoisDeCarregarAvise')}</li>
        </ul>
      </Secao>
    </PaginaGuia>
  );
}
