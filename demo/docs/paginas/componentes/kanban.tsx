import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="kanban"
      icone="square-kanban"
      componente="Kanban"
      outros={['CartaoKanban', 'SeloPrioridade', 'SeloPrazo', 'Etiqueta']}
      tipos={['ColunaKanban', 'EtiquetaKanban', 'ContagemSubtarefas', 'SoltarItem']}
      importar={['CartaoKanban', 'type ColunaKanban']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.kanban.textos.montadoSobreOQuadroarrastavel'))}</li>
          <li>{rico(t('docs.kanban.textos.cadaAcaoApareceQuando'))}</li>
          <li>{rico(t('docs.kanban.textos.oQuadroNaoPergunta'))}</li>
          <li>{rico(t('docs.kanban.textos.limiteNumaColunaCheia'))}</li>
          <li>{rico(t('docs.kanban.textos.filtroEscondeCartoesBusca'))}</li>
          <li>{rico(t('docs.kanban.textos.alturaFixaOTamanho'))}</li>
          <li>{rico(t('docs.kanban.textos.cartaokanbanEOCartao'))}</li>
          <li>{rico(t('docs.kanban.textos.prioridadeBaixaMediaAlta'))}</li>
          <li>{t('docs.kanban.textos.aDemoTrazAs')}</li>
        </ul>
      }
    >
      <Exemplo id="kanban/Basico" titulo={t('docs.kanban.secoes.quadroComAcoesE')} />
      <Exemplo id="kanban/Cartoes" titulo={t('docs.kanban.secoes.cartoes')} />
      <Exemplo id="kanban/Filtros" titulo={t('docs.kanban.secoes.buscaFiltroRegraDe')} />
    </PaginaComponente>
  );
}
