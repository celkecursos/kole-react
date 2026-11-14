import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="botao"
      icone="square-mouse-pointer"
      componente="Botao"
      padroes={{ severidade: "'pri'", aparencia: "'solido'", formato: "'pilula'", tamanho: "'medio'", type: "'button'" }}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.botao.textos.useUmaUnicaAcao'))}</li>
          <li>{rico(t('docs.botao.textos.botaoSoComIcone'))}</li>
          <li>{rico(t('docs.botao.textos.oPadraoEType'))}</li>
          <li>{rico(t('docs.botao.textos.comCarregandoOBotao'))}</li>
          <li>{rico(t('docs.botao.textos.paraPadronizarVariosBotoes'))}</li>
        </ul>
      }
    >
      <Exemplo id="botao/Basico" titulo={t('docs.botao.secoes.basico')} />
      <Exemplo id="botao/Cores" titulo={t('docs.botao.secoes.cores')}>{rico(t('docs.botao.textos.aPropSeveridadeEscolhe'))}</Exemplo>
      <Exemplo id="botao/Aparencias" titulo={t('docs.botao.secoes.aparencias')}>{rico(t('docs.botao.textos.aPropAparenciaMuda'))}</Exemplo>
      <Exemplo id="botao/Tamanhos" titulo={t('docs.botao.secoes.tamanhosEFormato')} />
      <Exemplo id="botao/Icones" titulo={t('docs.botao.secoes.comIcone')}>{rico(t('docs.botao.textos.qualquerIconeDoLucide'))}</Exemplo>
      <Exemplo id="botao/Estados" titulo={t('docs.botao.secoes.carregandoDesabilitadoEAlternancia')} />
    </PaginaComponente>
  );
}
