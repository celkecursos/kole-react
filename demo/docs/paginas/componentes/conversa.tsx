import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="conversa"
      icone="message-square"
      componente="Conversa"
      outros={['Mensagem', 'CampoMensagem', 'ListaConversas', 'InicioConversa', 'BlocoCodigo', 'ChatFlutuante']}
      tipos={['AnexoMensagem', 'ItemConversa', 'SugestaoConversa']}
      importar={['Referencias']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.conversa.textos.aConversaDesceSozinha'))}</li>
          <li>{rico(t('docs.conversa.textos.noCampomensagemEnterEnvia'))}</li>
          <li>{rico(t('docs.conversa.textos.estadosDaMensagemEnviando'))}</li>
          <li>{rico(t('docs.conversa.textos.asFontesDeUma'))}</li>
          <li>{rico(t('docs.conversa.textos.listaconversasAgrupaOHistorico'))}</li>
          <li>{rico(t('docs.conversa.textos.inicioconversaVaiNoVazio'))}</li>
          <li>{rico(t('docs.conversa.textos.anexosNoCampomensagemAnexos'))}</li>
          <li>{rico(t('docs.conversa.textos.oMarkdownDaResposta'))}</li>
          <li>{rico(t('docs.conversa.textos.chatflutuanteEOAtendimento'))}</li>
        </ul>
      }
    >
      <Exemplo id="conversa/Basico" titulo={t('docs.conversa.secoes.chat')}>{t('docs.conversa.textos.escrevaEAperteEnter')}</Exemplo>
      <Exemplo id="conversa/Estados" titulo={t('docs.conversa.secoes.estadosDaMensagem')} />
      <Exemplo id="conversa/Historico" titulo={t('docs.conversa.secoes.historicoDeConversas')} />
      <Exemplo id="conversa/Inicio" titulo={t('docs.conversa.secoes.telaInicialComSugestoes')} />
      <Exemplo id="conversa/Anexos" titulo={t('docs.conversa.secoes.anexosEMenu')} />
      <Exemplo id="conversa/Codigo" titulo={t('docs.conversa.secoes.respostaComTabelaE')} />
      <Exemplo id="conversa/Flutuante" titulo={t('docs.conversa.secoes.chatFlutuanteDoSite')} />
    </PaginaComponente>
  );
}
