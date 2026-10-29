import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Botao,
  CabecalhoPagina,
  CampoMensagem,
  Card,
  Conversa,
  Mensagem,
  Referencias,
  Vazio,
  type AutorMensagem,
  type EstadoMensagem,
  type ItemReferencia,
} from '../../../src';
import { Bloco } from '../Bloco';

interface Msg {
  id: number;
  autor: AutorMensagem;
  texto: string;
  estado: EstadoMensagem;
  hora: Date;
  erro?: string;
  referencias?: ItemReferencia[];
}

interface Resposta {
  texto: string;
  referencias?: ItemReferencia[];
}

const FONTES_FRETE: ItemReferencia[] = [
  {
    id: 'f1',
    titulo: 'Política comercial 2026.pdf',
    detalhe: 'Página 3',
    trecho:
      'Pedidos acima de R$ 500,00 têm frete grátis para as regiões Sul e Sudeste. Nas demais regiões, o frete é calculado pela tabela da transportadora parceira e aparece no carrinho antes da confirmação do pagamento. Pedidos com itens sob encomenda seguem o prazo do fornecedor.',
  },
  { id: 'f2', titulo: 'Tabela de fretes', detalhe: 'Aba "Regiões"', trecho: 'Norte e Nordeste: R$ 39,90 até 10 kg.' },
  { id: 'f3', titulo: 'Central de ajuda', detalhe: 'Artigo', href: 'https://example.com/ajuda/frete' },
];

const RESPOSTAS: Resposta[] = [
  {
    texto:
      'Pedidos acima de R$ 500,00 têm frete grátis no Sul e no Sudeste.\n\nNas outras regiões o frete segue a tabela da transportadora e aparece no carrinho antes do pagamento.',
    referencias: FONTES_FRETE,
  },
  {
    texto:
      'Claro! Os passos são:\n1. Abra o pedido em Pedidos.\n2. Clique em "Editar".\n3. Troque o endereço de entrega e salve.\n\nSe o pedido já foi faturado, o endereço não pode mais ser alterado.',
  },
  {
    texto:
      'Links longos também quebram dentro da bolha: https://example.com/um/endereco/bem/comprido/que/nao/cabe/numa/linha/so?parametro=valor-extenso-para-testar-a-quebra',
  },
];

const AGORA = Date.now();
const minutosAtras = (m: number) => new Date(AGORA - m * 60_000);

const INICIAIS: Msg[] = [
  { id: 1, autor: 'sistema', texto: 'Conversa iniciada hoje', estado: 'concluida', hora: minutosAtras(12) },
  { id: 2, autor: 'usuario', texto: 'Como funciona o frete grátis?', estado: 'concluida', hora: minutosAtras(11) },
  { id: 3, autor: 'assistente', texto: RESPOSTAS[0].texto, referencias: FONTES_FRETE, estado: 'concluida', hora: minutosAtras(11) },
  { id: 4, autor: 'usuario', texto: 'E para mudar o endereço de um pedido?', estado: 'concluida', hora: minutosAtras(10) },
  { id: 5, autor: 'assistente', texto: RESPOSTAS[1].texto, estado: 'concluida', hora: minutosAtras(10) },
];

let seq = 100;

/**
 * Chat simulado, sem rede: a resposta chega em pedaços por `setInterval`.
 * `falhar` = a primeira resposta dá erro (para mostrar o "Tentar novamente").
 */
function useChatSimulado(inicial: Msg[], falhar = false) {
  const [mensagens, setMensagens] = useState(inicial);
  const [gerando, setGerando] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const proxima = useRef(0);
  const falhou = useRef(false);

  const limpar = () => {
    window.clearTimeout(timer.current);
    window.clearInterval(timer.current);
  };
  useEffect(() => limpar, []);

  const mudar = (id: number, m: Partial<Msg>) => setMensagens((l) => l.map((x) => (x.id === id ? { ...x, ...m } : x)));

  const transmitir = (id: number, resposta: Resposta) => {
    setGerando(true);
    const palavras = resposta.texto.split(/(?<=\s)/);
    let i = 0;
    // os três pontos aparecem um instante antes do texto
    timer.current = window.setTimeout(() => {
      timer.current = window.setInterval(() => {
        i += 1 + Math.floor(Math.random() * 3);
        const parcial = palavras.slice(0, i).join('');
        if (i < palavras.length) {
          mudar(id, { texto: parcial });
          return;
        }
        limpar();
        mudar(id, { texto: resposta.texto, estado: 'concluida', referencias: resposta.referencias });
        setGerando(false);
      }, 60);
    }, 700);
  };

  const responder = (id: number) => {
    if (falhar && !falhou.current) {
      falhou.current = true;
      setGerando(true);
      timer.current = window.setTimeout(() => {
        mudar(id, { estado: 'erro', erro: 'A resposta não chegou. Verifique a conexão e tente de novo.' });
        setGerando(false);
      }, 1200);
      return;
    }
    transmitir(id, RESPOSTAS[proxima.current++ % RESPOSTAS.length]);
  };

  const enviar = (texto: string) => {
    const idUsuario = ++seq;
    const idResposta = ++seq;
    setMensagens((l) => [
      ...l,
      { id: idUsuario, autor: 'usuario', texto, estado: 'enviando', hora: new Date() },
      { id: idResposta, autor: 'assistente', texto: '', estado: 'gerando', hora: new Date() },
    ]);
    window.setTimeout(() => mudar(idUsuario, { estado: 'concluida' }), 400);
    responder(idResposta);
  };

  const parar = () => {
    limpar();
    setGerando(false);
    setMensagens((l) => [
      ...l.map((x): Msg => (x.estado === 'gerando' ? { ...x, estado: 'concluida' } : x)),
      { id: ++seq, autor: 'sistema', texto: 'Resposta interrompida', estado: 'concluida', hora: new Date() },
    ]);
  };

  const tentarNovamente = (id: number) => {
    mudar(id, { estado: 'gerando', texto: '', erro: undefined });
    responder(id);
  };

  return { mensagens, gerando, enviar, parar, tentarNovamente };
}

/** Conversa + campo ligados ao chat simulado. */
function ChatDemo({ inicial, falhar, larguraMaxima, vazio }: { inicial: Msg[]; falhar?: boolean; larguraMaxima?: string; vazio?: ReactNode }) {
  const chat = useChatSimulado(inicial, falhar);
  const [texto, setTexto] = useState('');

  return (
    <Conversa
      larguraMaxima={larguraMaxima}
      vazio={vazio}
      campo={
        <CampoMensagem
          valor={texto}
          aoMudar={setTexto}
          aoEnviar={(t) => {
            chat.enviar(t);
            setTexto('');
          }}
          gerando={chat.gerando}
          aoParar={chat.parar}
          maxCaracteres={500}
          acoesExtras={<Botao icone="paperclip" aria-label="Anexar arquivo" dica="Anexar arquivo" severidade="secundario" aparencia="texto" tamanho="pequeno" />}
        />
      }
    >
      {chat.mensagens.map((m) => (
        <Mensagem
          key={m.id}
          autor={m.autor}
          nome={m.autor === 'usuario' ? 'Você' : m.autor === 'assistente' ? 'Assistente' : undefined}
          avatar={m.autor === 'assistente' ? true : undefined}
          hora={m.autor === 'sistema' ? undefined : m.hora}
          estado={m.estado}
          erro={m.erro}
          aoTentarNovamente={() => chat.tentarNovamente(m.id)}
          copiavel={m.autor === 'assistente'}
          rodape={m.referencias && <Referencias itens={m.referencias} />}
        >
          {m.texto}
        </Mensagem>
      ))}
    </Conversa>
  );
}

export function PaginaConversas() {
  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Conversas" icone="message-square" trilha />

      <Bloco
        titulo="Conversa ocupando a página"
        descricao="Envie uma mensagem: a resposta chega aos poucos e a conversa acompanha o fim. Role para cima durante a resposta para ver o “Ir para o fim”. Enter envia, Shift+Enter quebra a linha."
      >
        <div className="demo-chat-pagina">
          <ChatDemo inicial={INICIAIS} larguraMaxima="48rem" />
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Card titulo="Erro e tentar novamente" subtitulo="A primeira resposta falha" corpoSemEspaco>
          <div className="demo-chat-card">
            <ChatDemo inicial={[]} falhar vazio={<Vazio titulo="Faça uma pergunta" descricao="A primeira resposta vai falhar de propósito." icone="message-square" />} />
          </div>
        </Card>
        <Card titulo="Estado vazio" subtitulo="Card com altura fixa" corpoSemEspaco>
          <div className="demo-chat-card">
            <ChatDemo inicial={[]} />
          </div>
        </Card>
      </div>

      <Bloco titulo="Mensagens soltas" descricao="Todos os estados, sem a área rolável.">
        <Mensagem autor="usuario" nome="Você" hora={new Date()} estado="enviando">
          Mensagem ainda sendo enviada
        </Mensagem>
        <Mensagem autor="assistente" nome="Assistente" avatar estado="gerando" />
        <Mensagem autor="assistente" nome="Assistente" avatar estado="gerando">
          Texto parcial, com o cursor no fim
        </Mensagem>
        <Mensagem autor="assistente" nome="Assistente" avatar estado="erro" erro="O serviço demorou demais para responder." aoTentarNovamente={() => undefined}>
          Começo de resposta que parou no meio
        </Mensagem>
        <Mensagem autor="assistente" nome="Assistente" avatar copiavel rodape={<Referencias itens={FONTES_FRETE} abertoInicial />}>
          Resposta concluída, com as fontes abertas.
        </Mensagem>
        <Mensagem autor="sistema">Ana Pereira entrou na conversa</Mensagem>
      </Bloco>
    </div>
  );
}
