import { useState } from 'react';
import { CampoMensagem, ChatFlutuante, Conversa, InicioConversa, Mensagem } from '../../../../src';

// o botão fica fixo no canto da página: veja em baixo, à direita
export default function Exemplo() {
  const [texto, setTexto] = useState('');
  const [mensagens, setMensagens] = useState<string[]>([]);
  return (
    <>
      <p>O botão "Fale com a gente" aparece no canto da tela enquanto esta página está aberta.</p>
      <ChatFlutuante titulo="Fale com a gente" subtitulo="Respondemos em poucos minutos" naoLidas={1}>
        <Conversa
          vazio={
            <InicioConversa
              aparencia="pilulas"
              icone="message-circle"
              titulo="Olá! Como podemos ajudar?"
              sugestoes={[{ titulo: 'Quais são os planos?' }, { titulo: 'Vocês emitem nota fiscal?' }]}
              aoEscolher={(s) => setMensagens((l) => [...l, s.titulo])}
            />
          }
          campo={
            <CampoMensagem
              valor={texto}
              aoMudar={setTexto}
              aoEnviar={(t) => {
                setMensagens((l) => [...l, t]);
                setTexto('');
              }}
            />
          }
        >
          {mensagens.map((m, i) => (
            <Mensagem key={i} autor="usuario">
              {m}
            </Mensagem>
          ))}
        </Conversa>
      </ChatFlutuante>
    </>
  );
}
