import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="form"
      icone="file-pen"
      componente="Form"
      outros={['FormSecao']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.form.textos.aoSalvarOForm'))}</li>
          <li>{rico(t('docs.form.textos.comEntidadeClienteE'))}</li>
          <li>{rico(t('docs.form.textos.emPaginaMenuMenuativo'))}</li>
          <li>{rico(t('docs.form.textos.naGradeDaFormsecao'))}</li>
        </ul>
      }
    >
      <Exemplo id="form/Modal" titulo={t('docs.form.secoes.emModal')}>{t('docs.form.textos.cliqueEmSalvarSem')}</Exemplo>
      <Exemplo id="form/Secoes" titulo={t('docs.form.secoes.secoesEGrade')} />
    </PaginaComponente>
  );
}
