import { useState } from 'react';
import { CampoMensagem, Conversa, InicioConversa, useToast } from '../../../../src';

export default function Exemplo() {
  const toast = useToast();
  const [texto, setTexto] = useState('');
  return (
    <div style={{ height: '28rem' }}>
      <Conversa
        vazio={
          <InicioConversa
            icone="sparkles"
            titulo="Como posso ajudar?"
            descricao="Pergunte sobre vendas, pedidos e clientes."
            sugestoes={[
              { titulo: 'Resumir as vendas do mês', descricao: 'Faturamento por região', icone: 'chart-line' },
              { titulo: 'Listar pedidos atrasados', descricao: 'Com dias de atraso', icone: 'truck' },
            ]}
            // aqui o app envia a pergunta (ou só põe o texto no campo)
            aoEscolher={(s) => setTexto(s.texto ?? s.titulo)}
          />
        }
        campo={<CampoMensagem valor={texto} aoMudar={setTexto} aoEnviar={(t) => toast.info('Enviar', t)} />}
      />
    </div>
  );
}
