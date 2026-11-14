import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="recolhivel"
      icone="chevron-down"
      componente="Recolhivel"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.recolhivel.textos.ligueOBotaoAo'))}</li>
          <li>{rico(t('docs.recolhivel.textos.fechadoOConteudoFica'))}</li>
          <li>{rico(t('docs.recolhivel.textos.paraVariasSecoesCom'))}</li>
        </ul>
      }
    >
      <Exemplo id="recolhivel/Basico" titulo={t('docs.recolhivel.secoes.comBotao')} />
    </PaginaComponente>
  );
}
