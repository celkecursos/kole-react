import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
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
          <li>
            A <C>Conversa</C> desce sozinha para a mensagem nova, a não ser que a pessoa tenha subido para ler; aí aparece "Ir para o
            fim".
          </li>
          <li>
            No <C>CampoMensagem</C>, Enter envia e Shift+Enter quebra a linha. Com <C>gerando</C>, o botão vira Parar (<C>aoParar</C>).
          </li>
          <li>
            Estados da <C>Mensagem</C>: <C>enviando</C>, <C>gerando</C> (pontinhos ou cursor no fim do texto), <C>concluida</C> e{' '}
            <C>erro</C> (com Tentar novamente).
          </li>
          <li>
            As fontes de uma resposta vão no <C>rodape</C> da mensagem, com <C>Referencias</C>.
          </li>
          <li>
            <C>ListaConversas</C> agrupa o histórico por data (Fixadas, Hoje, Ontem, Últimos 7 dias, Últimos 30 dias e os meses), com busca
            sem acento, renomear no próprio item, fixar e excluir. O histórico é salvo pelo app.
          </li>
          <li>
            <C>InicioConversa</C> vai no <C>vazio</C> da <C>Conversa</C>: saudação e sugestões em cartões, ou em pílulas
            (<C>aparencia="pilulas"</C>) num painel estreito.
          </li>
          <li>
            Anexos no <C>CampoMensagem</C>: <C>anexos</C> em chips (com <C>progresso</C> e <C>erro</C>), <C>aoRemoverAnexo</C> e{' '}
            <C>aoAdicionarArquivos</C>, chamado ao arrastar para o campo ou colar. Enquanto um anexo sobe, o Enviar espera. O "+" e o
            seletor de modo vão em <C>acoesExtras</C>.
          </li>
          <li>
            O Markdown da resposta é renderizado pelo app; a <C>Mensagem</C> estiliza parágrafos, listas, tabelas (que rolam dentro da
            bolha) e citações, e o <C>BlocoCodigo</C> entra no lugar do <C>code</C> com o botão de copiar.
          </li>
          <li>
            <C>ChatFlutuante</C> é o atendimento do site: botão fixo no canto, painel com a conversa, Esc fecha e devolve o foco; no
            celular, ocupa a tela.
          </li>
        </ul>
      }
    >
      <Exemplo id="conversa/Basico" titulo="Chat">
        Escreva e aperte Enter. A resposta é simulada.
      </Exemplo>
      <Exemplo id="conversa/Estados" titulo="Estados da mensagem" />
      <Exemplo id="conversa/Historico" titulo="Histórico de conversas" />
      <Exemplo id="conversa/Inicio" titulo="Tela inicial com sugestões" />
      <Exemplo id="conversa/Anexos" titulo="Anexos e menu +" />
      <Exemplo id="conversa/Codigo" titulo="Resposta com tabela e código" />
      <Exemplo id="conversa/Flutuante" titulo="Chat flutuante do site" />
    </PaginaComponente>
  );
}
