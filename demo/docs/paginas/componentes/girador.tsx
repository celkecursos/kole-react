import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="girador"
      icone="loader-circle"
      componente="Girador"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.girador.textos.oRotuloESempre'))}</li>
          <li>{rico(t('docs.girador.textos.dentroDeBotaoUse'))}</li>
          <li>{rico(t('docs.girador.textos.tamanhoAceitaTambemUma'))}</li>
        </ul>
      }
    >
      <Exemplo id="girador/Basico" titulo={t('docs.girador.secoes.formasCoresETamanhos')} />
    </PaginaComponente>
  );
}
