import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="toast"
      icone="bell"
      componente="Toast"
      tipos={['OpcoesToast']}
      importar={['useToast', 'type OpcoesToast']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.toast.textos.usetoastJaFuncionaDentro'))}</li>
          <li>{t('docs.toast.textos.passarOMouseOu')}</li>
          <li>{rico(t('docs.toast.textos.oQuePrecisaContinuar'))}</li>
          <li>{rico(t('docs.toast.textos.oComponenteToastTambem'))}</li>
        </ul>
      }
    >
      <Exemplo id="toast/Basico" titulo={t('docs.toast.secoes.severidades')} />
      <Exemplo id="toast/Opcoes" titulo={t('docs.toast.secoes.aparenciaPosicaoEDuracao')} />
      <Exemplo id="toast/Fixo" titulo={t('docs.toast.secoes.cartaoFixoNaPagina')} />
    </PaginaComponente>
  );
}
