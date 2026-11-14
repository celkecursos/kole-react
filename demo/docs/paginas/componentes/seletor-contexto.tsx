import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="seletorContexto"
      icone="building-2"
      componente="SeletorContexto"
      tipos={['OpcaoContexto']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.seletorContexto.textos.naEstruturaPasseEm'))}</li>
          <li>{rico(t('docs.seletorContexto.textos.oSeletorSoAvisa'))}</li>
          <li>{t('docs.seletorContexto.textos.aDemoUsaO')}</li>
        </ul>
      }
    >
      <Exemplo id="seletor-contexto/Basico" titulo={t('docs.seletorContexto.secoes.pessoalEEmpresas')} />
    </PaginaComponente>
  );
}
