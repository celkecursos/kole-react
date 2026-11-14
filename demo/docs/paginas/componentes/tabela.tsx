import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="tabela"
      icone="table"
      componente="Tabela"
      tipos={['Coluna']}
      importar={['type Coluna', 'type Ordenacao']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.tabela.textos.aTabelaNaoOrdena'))}</li>
          <li>{rico(t('docs.tabela.textos.campoAceitaCaminhoCom'))}</li>
          <li>{rico(t('docs.tabela.textos.carregandoMostraSilhuetasNa'))}</li>
          <li>{t('docs.tabela.textos.emTelaEstreitaA')}</li>
          <li>{rico(t('docs.tabela.textos.paraRegistrosQueLeem'))}</li>
        </ul>
      }
    >
      <Exemplo id="tabela/Basico" titulo={t('docs.tabela.secoes.colunasSituacaoEAcoes')} />
      <Exemplo id="tabela/OrdenarPaginar" titulo={t('docs.tabela.secoes.ordenacaoSelecaoEPaginacao')} />
      <Exemplo id="tabela/Estados" titulo={t('docs.tabela.secoes.carregandoVaziaEErro')} />
    </PaginaComponente>
  );
}
