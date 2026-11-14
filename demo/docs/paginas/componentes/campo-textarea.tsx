import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="campoTextarea"
      icone="file-text"
      componente="CampoTextarea"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.campoTextarea.textos.oContadorApareceCom'))}</li>
          <li>{t('docs.campoTextarea.textos.aceitaOsAtributosNativos')}<C>{'<textarea>'}</C>{rico(t('docs.campoTextarea.textos.comoRowsEPlaceholder'))}</li>
          <li>{rico(t('docs.campoTextarea.textos.paraMensagemDeChat'))}</li>
        </ul>
      }
    >
      <Exemplo id="campo-textarea/Basico" titulo={t('docs.campoTextarea.secoes.basicoEComErro')} />
    </PaginaComponente>
  );
}
