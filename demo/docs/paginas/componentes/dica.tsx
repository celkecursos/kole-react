import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="dica"
      icone="circle-question-mark"
      componente="Dica"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.dica.textos.envolvaUmUnicoElemento'))}</li>
          <li>{t('docs.dica.textos.apareceNoHoverE')}</li>
          <li>{rico(t('docs.dica.textos.nadaDeConteudoInterativo'))}</li>
        </ul>
      }
    >
      <Exemplo id="dica/Basico" titulo={t('docs.dica.secoes.posicoes')} />
    </PaginaComponente>
  );
}
