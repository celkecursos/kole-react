import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="campoTexto"
      icone="pencil"
      componente="CampoTexto"
      padroes={{ type: "'text'" }}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.campoTexto.textos.oCampoEControlado'))}</li>
          <li>{rico(t('docs.campoTexto.textos.validarMostraOErro'))}</li>
          <li>{rico(t('docs.campoTexto.textos.paraCpfCnpjTelefone'))}</li>
          <li>{rico(t('docs.campoTexto.textos.rotuloDicaEErro'))}</li>
        </ul>
      }
    >
      <Exemplo id="campo-texto/Basico" titulo={t('docs.campoTexto.secoes.basico')} />
      <Exemplo id="campo-texto/Mascara" titulo={t('docs.campoTexto.secoes.mascara')}>{rico(t('docs.campoTexto.textos.coringas0DigitoA'))}</Exemplo>
      <Exemplo id="campo-texto/PrefixoSufixo" titulo={t('docs.campoTexto.secoes.iconePrefixoESufixo')} />
      <Exemplo id="campo-texto/Validacao" titulo={t('docs.campoTexto.secoes.validacaoAvisoEErro')} />
    </PaginaComponente>
  );
}
