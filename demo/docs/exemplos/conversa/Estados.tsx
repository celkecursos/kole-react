import { Mensagem } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-pilha-p">
      <Mensagem autor="usuario" nome="Você" estado="enviando">
        Mensagem ainda sendo enviada
      </Mensagem>
      <Mensagem autor="assistente" nome="Assistente" avatar estado="erro" erro="O serviço demorou demais para responder." aoTentarNovamente={() => undefined}>
        Começo de resposta que parou no meio
      </Mensagem>
      <Mensagem autor="sistema">Ana Pereira entrou na conversa</Mensagem>
    </div>
  );
}
