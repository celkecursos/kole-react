import { useEffect, useRef, useState } from 'react';
import { Botao, CampoMensagem, ChatFlutuante, Conversa, InicioConversa, Mensagem, type EstadoMensagem, type SugestaoConversa } from '../../../src';
import { useT } from '../../i18n/useT';

/*
 * Chat de atendimento do site modelo: respostas prontas para as perguntas frequentes
 * (num site de verdade, viriam de um assistente ou de uma pessoa da equipe).
 */

interface MsgSite {
  id: number;
  autor: 'usuario' | 'assistente';
  texto: string;
  estado: EstadoMensagem;
  hora: Date;
  humano?: boolean;
}

const PERGUNTAS: SugestaoConversa[] = [
  { titulo: 'Quais são os planos?' },
  { titulo: 'Como falar com o suporte?' },
  { titulo: 'Vocês emitem nota fiscal?' },
];

function responder(texto: string): { texto: string; humano?: boolean } {
  const t = texto.toLowerCase();
  if (t.includes('plano') || t.includes('preço') || t.includes('valor'))
    return { texto: 'Temos três planos: Essencial, Profissional e Empresarial. Todos têm 14 dias grátis, e a página Serviços compara o que cada um inclui.' };
  if (t.includes('suporte') || t.includes('falar') || t.includes('telefone'))
    return { texto: 'O suporte atende de segunda a sexta, das 8h às 18h, pelo (11) 0000-0000 ou pelo e-mail contato@suamarca.com.' };
  if (t.includes('nota')) return { texto: 'Sim. A nota fiscal de serviço sai por e-mail assim que o pagamento é confirmado.' };
  return { texto: 'Boa pergunta! Vou passar para a nossa equipe, que responde por aqui em poucos minutos.', humano: true };
}

let seq = 0;

export function AtendimentoSite({ navegar }: { navegar: (rota: string) => void }) {
  const { t } = useT();
  const [aberto, setAberto] = useState(false);
  const [lido, setLido] = useState(false);
  const [mensagens, setMensagens] = useState<MsgSite[]>([]);
  const [texto, setTexto] = useState('');
  const [gerando, setGerando] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const enviar = (t: string) => {
    const idR = ++seq;
    setMensagens((l) => [
      ...l,
      { id: ++seq, autor: 'usuario', texto: t, estado: 'concluida', hora: new Date() },
      { id: idR, autor: 'assistente', texto: '', estado: 'gerando', hora: new Date() },
    ]);
    setTexto('');
    setGerando(true);
    timer.current = window.setTimeout(() => {
      const r = responder(t);
      setMensagens((l) => l.map((m) => (m.id === idR ? { ...m, texto: r.texto, humano: r.humano, estado: 'concluida' } : m)));
      setGerando(false);
    }, 900);
  };

  return (
    <ChatFlutuante
      titulo={t('paginas.site.textos.faleComAGente')}
      subtitulo={t('paginas.site.textos.respondemosEmPoucosMinutos')}
      rotuloBotao={t('paginas.site.textos.faleComAGente')}
      naoLidas={lido ? 0 : 1}
      aberto={aberto}
      aoMudarAberto={(v) => {
        setAberto(v);
        if (v) setLido(true);
      }}
    >
      <Conversa
        rotulo={t('paginas.site.textos.atendimento')}
        vazio={
          <InicioConversa
            aparencia="pilulas"
            icone="message-circle"
            titulo={t('paginas.site.textos.olaComoPodemosAjudar')}
            descricao={t('paginas.site.textos.escolhaUmaDasPerguntas')}
            sugestoes={PERGUNTAS}
            aoEscolher={(s) => enviar(s.titulo)}
          />
        }
        campo={<CampoMensagem valor={texto} aoMudar={setTexto} aoEnviar={enviar} gerando={gerando} placeholder={t('paginas.site.textos.escrevaSuaMensagem')} linhasMaximas={4} />}
      >
        {mensagens.map((m) => (
          <Mensagem
            key={m.id}
            autor={m.autor}
            nome={m.autor === 'assistente' ? 'Sua Marca' : undefined}
            hora={m.hora}
            estado={m.estado}
            acoes={
              m.humano && (
                <Botao
                  rotulo={t('paginas.site.textos.irParaOContato')}
                  icone="mail"
                  severidade="secundario"
                  aparencia="contorno"
                  tamanho="pequeno"
                  onClick={() => {
                    setAberto(false);
                    navegar('/site/contato');
                  }}
                />
              )
            }
          >
            {m.texto || undefined}
          </Mensagem>
        ))}
      </Conversa>
    </ChatFlutuante>
  );
}
