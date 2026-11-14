import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="arquivo"
      icone="paperclip"
      componente="CampoAnexo"
      outros={['Foto', 'VisualizadorArquivo', 'DialogoArquivo']}
      importar={['type Anexo', 'type CampoAnexoRef']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.arquivo.textos.oValorDoCampoanexo'))}</li>
          <li>{rico(t('docs.arquivo.textos.clicarNumAnexoAbre'))}</li>
          <li>{rico(t('docs.arquivo.textos.minimoViraPendenciaDo'))}</li>
          <li>{rico(t('docs.arquivo.textos.fotoAceitaUrlAnexo'))}</li>
        </ul>
      }
    >
      <Exemplo id="arquivo/Anexos" titulo={t('docs.arquivo.secoes.campoDeAnexos')}>{t('docs.arquivo.textos.arrasteArquivosParaO')}</Exemplo>
      <Exemplo id="arquivo/Foto" titulo={t('docs.arquivo.secoes.foto')} />
    </PaginaComponente>
  );
}
