import { useRef, useState } from 'react';
import { CampoMensagem, Conversa, Mensagem } from '../../../../src';

interface Msg {
  id: number;
  autor: 'usuario' | 'assistente';
  texto: string;
}

const INICIAIS: Msg[] = [
  { id: 1, autor: 'usuario', texto: 'Qual o prazo de entrega para Curitiba?' },
  { id: 2, autor: 'assistente', texto: 'Pedidos pagos até as 14h saem no mesmo dia. Depois disso, no dia útil seguinte.' },
];

export default function Exemplo() {
  const [mensagens, setMensagens] = useState(INICIAIS);
  const [texto, setTexto] = useState('');
  const [gerando, setGerando] = useState(false);
  const proximo = useRef(3);

  const enviar = (t: string) => {
    setMensagens((m) => [...m, { id: proximo.current++, autor: 'usuario', texto: t }]);
    setTexto('');
    setGerando(true);
    // no app: a resposta do serviço
    setTimeout(() => {
      setMensagens((m) => [...m, { id: proximo.current++, autor: 'assistente', texto: 'Recebido! Vou verificar e já respondo.' }]);
      setGerando(false);
    }, 1200);
  };

  return (
    <div style={{ height: '26rem', display: 'flex' }}>
      <Conversa campo={<CampoMensagem valor={texto} aoMudar={setTexto} aoEnviar={enviar} gerando={gerando} aoParar={() => setGerando(false)} />}>
        {mensagens.map((m) => (
          <Mensagem key={m.id} autor={m.autor} nome={m.autor === 'usuario' ? 'Você' : 'Assistente'} avatar={m.autor === 'assistente' || undefined} copiavel={m.autor === 'assistente'}>
            {m.texto}
          </Mensagem>
        ))}
        {gerando && <Mensagem autor="assistente" nome="Assistente" avatar estado="gerando" />}
      </Conversa>
    </div>
  );
}
