import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Conversa"
      icone="message-square"
      componente="Conversa"
      outros={['Mensagem', 'CampoMensagem']}
      importar={['Referencias']}
      resumo="Chat completo: a área que rola e acompanha a última mensagem, os balões de cada autor com os estados de envio, e o campo com Enter para enviar."
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
        </ul>
      }
    >
      <Exemplo id="conversa/Basico" titulo="Chat">
        Escreva e aperte Enter. A resposta é simulada.
      </Exemplo>
      <Exemplo id="conversa/Estados" titulo="Estados da mensagem" />
    </PaginaComponente>
  );
}
