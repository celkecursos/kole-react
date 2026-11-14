import { useEffect, useRef, useState } from 'react';
import {
  BlocoCodigo,
  Botao,
  CabecalhoPagina,
  CampoMensagem,
  Card,
  Chip,
  Conversa,
  Dialogo,
  Icone,
  InicioConversa,
  ListaConversas,
  MenuSuspenso,
  Mensagem,
  Referencias,
  saudacaoPorHora,
  useConfirmacao,
  useToast,
  type AnexoMensagem,
  type EstadoMensagem,
  type ItemReferencia,
  type SugestaoConversa,
} from '../../../src';
import { useT, type TradutorDemo } from '../../i18n/useT';
import { rico } from '../../i18n/rico';

/*
 * Página modelo de um assistente de IA dentro do sistema. Tudo aqui é simulado, sem rede:
 * num app de verdade, a resposta vem da API (em pedaços, por streaming), o histórico é
 * salvo no banco e o Markdown da resposta é renderizado pelo app (ex.: react-markdown,
 * com o `BlocoCodigo` no lugar do `code`). Os "blocos" abaixo fazem o papel desse Markdown.
 */

type BlocoResposta =
  | { tipo: 'p'; texto: string }
  | { tipo: 'titulo'; texto: string }
  | { tipo: 'lista'; itens: string[]; ordenada?: boolean }
  | { tipo: 'tabela'; colunas: string[]; linhas: string[][]; numericas?: number[] }
  | { tipo: 'codigo'; linguagem: string; codigo: string };

interface Resposta {
  blocos: BlocoResposta[];
  referencias?: ItemReferencia[];
}

interface MsgIA {
  id: number;
  autor: 'usuario' | 'assistente';
  texto?: string;
  resposta?: Resposta;
  /** Quantos blocos já chegaram (a resposta aparece aos poucos). */
  visiveis?: number;
  anexos?: AnexoMensagem[];
  ferramentas?: string[];
  estado: EstadoMensagem;
  hora: Date;
  avaliacao?: 'boa' | 'ruim';
}

interface ConversaIA {
  id: string;
  titulo: string;
  data: Date;
  fixada?: boolean;
  mensagens: MsgIA[];
}

/* ---------- respostas prontas ---------- */

const FONTE_VENDAS: ItemReferencia[] = [
  { id: 'v1', titulo: 'Relatório de vendas · outubro', detalhe: 'Módulo Vendas', trecho: 'Faturamento consolidado por região, com pedidos faturados entre 01/10 e 31/10.' },
  { id: 'v2', titulo: 'Metas comerciais 2026.xlsx', detalhe: 'Aba "Regiões"' },
];

const VENDAS: Resposta = {
  blocos: [
    { tipo: 'p', texto: 'O faturamento de outubro foi de <strong>R$ 1,28 milhão</strong>, 8% acima de setembro e 3% acima da meta.' },
    {
      tipo: 'tabela',
      colunas: ['Região', 'Faturamento', 'Pedidos', 'Meta'],
      linhas: [
        ['Sudeste', 'R$ 612.400', '1.284', '104%'],
        ['Sul', 'R$ 318.900', '702', '109%'],
        ['Nordeste', 'R$ 201.300', '455', '96%'],
        ['Centro-Oeste', 'R$ 98.700', '214', '91%'],
        ['Norte', 'R$ 48.200', '118', '88%'],
      ],
      numericas: [1, 2, 3],
    },
    {
      tipo: 'lista',
      itens: [
        'O <strong>Sul</strong> teve o melhor resultado sobre a meta, puxado pela promoção de Pix.',
        'Norte e Centro-Oeste ficaram abaixo da meta; o frete subiu 12% nessas regiões.',
        'O ticket médio ficou em <code>R$ 459,90</code>.',
      ],
    },
  ],
  referencias: FONTE_VENDAS,
};

const SQL: Resposta = {
  blocos: [
    { tipo: 'p', texto: 'Esta é a consulta que soma o faturamento por região no mês:' },
    {
      tipo: 'codigo',
      linguagem: 'sql',
      codigo: `SELECT c.regiao,
       SUM(p.valor_total)   AS faturamento,
       COUNT(*)             AS pedidos
  FROM pedidos p
  JOIN clientes c ON c.id = p.cliente_id
 WHERE p.situacao = 'faturado'
   AND p.faturado_em >= DATE '2026-10-01'
   AND p.faturado_em <  DATE '2026-11-01'
 GROUP BY c.regiao
 ORDER BY faturamento DESC;`,
    },
    { tipo: 'p', texto: 'Para comparar com a meta, junte a tabela metas_regiao pelo campo regiao.' },
  ],
};

const ATRASADOS: Resposta = {
  blocos: [
    { tipo: 'p', texto: 'Há 4 pedidos com a entrega atrasada:' },
    {
      tipo: 'tabela',
      colunas: ['Pedido', 'Cliente', 'Previsto', 'Atraso'],
      linhas: [
        ['#10482', 'Mercado Bom Preço', '05/11', '7 dias'],
        ['#10511', 'Farmácia Vida Plena', '07/11', '5 dias'],
        ['#10530', 'Padaria Pão Dourado', '09/11', '3 dias'],
        ['#10544', 'Loja Casa & Cia', '10/11', '2 dias'],
      ],
      numericas: [3],
    },
    { tipo: 'p', texto: 'Três deles estão com a mesma transportadora. Quer que eu escreva o aviso para os clientes?' },
  ],
};

const EMAIL: Resposta = {
  blocos: [
    { tipo: 'titulo', texto: 'Assunto: boleto em aberto' },
    { tipo: 'p', texto: 'Olá, tudo bem? Notamos que o boleto do pedido #10482, vencido em 05/11, ainda está em aberto.' },
    { tipo: 'p', texto: 'Se o pagamento já foi feito, desconsidere esta mensagem. Se precisar de uma segunda via, é só responder este e-mail.' },
    { tipo: 'p', texto: 'Obrigado!' },
  ],
};

const GENERICA: Resposta = {
  blocos: [
    { tipo: 'p', texto: 'Posso ajudar com os dados do sistema. Por exemplo:' },
    {
      tipo: 'lista',
      ordenada: true,
      itens: ['Resumir vendas, pedidos e estoque de um período.', 'Gerar consultas e relatórios.', 'Escrever e-mails e avisos para clientes.'],
    },
  ],
};

function responderA(texto: string, anexos: AnexoMensagem[], tx: TradutorDemo['t']): Resposta {
  const t = texto.toLowerCase();
  if (anexos.length) {
    return {
      blocos: [
        {
          tipo: 'p',
          texto: anexos.length === 1
            ? tx('paginas.assistente.textos.liOArquivo', { nome: anexos[0].nome })
            : tx('paginas.assistente.textos.liOsArquivos', { n: anexos.length }),
        },
        { tipo: 'lista', itens: ['O documento trata de prazos e condições de entrega.', 'Há uma tabela de valores por região na página 2.', 'Nenhuma cláusula conflita com a política atual.'] },
      ],
    };
  }
  if (t.includes('sql') || t.includes('consulta')) return SQL;
  if (t.includes('atras') || t.includes('overdue') || t.includes('late')) return ATRASADOS;
  if (t.includes('venda') || t.includes('sale')) return VENDAS;
  if (t.includes('mail') || t.includes('cobran')) return EMAIL;
  return GENERICA;
}

/** Texto puro da resposta, para o botão de copiar. */
function textoDe(r: Resposta, tc: TradutorDemo['tc']): string {
  const tx = (n: string): string => tc(n).replace(/<[^>]+>/g, '');
  return r.blocos
    .map((b) =>
      b.tipo === 'codigo'
        ? b.codigo
        : b.tipo === 'tabela'
          ? [b.colunas, ...b.linhas].map((l) => l.map(tx).join(' | ')).join('\n')
          : b.tipo === 'lista'
            ? b.itens.map((i, n) => `${b.ordenada ? `${n + 1}.` : '-'} ${tx(i)}`).join('\n')
            : tx(b.texto),
    )
    .join('\n\n');
}

/** "Markdown renderizado": no app, viria do renderizador de Markdown. */
function ConteudoResposta({ resposta, visiveis }: { resposta: Resposta; visiveis: number }) {
  const { tc } = useT();
  return (
    <>
      {resposta.blocos.slice(0, visiveis).map((b, i) => {
        if (b.tipo === 'p') return <p key={i}>{rico(tc(b.texto))}</p>;
        if (b.tipo === 'titulo') return <h3 key={i}>{tc(b.texto)}</h3>;
        if (b.tipo === 'codigo') return <BlocoCodigo key={i} linguagem={b.linguagem} codigo={b.codigo} />;
        if (b.tipo === 'lista') {
          const L = b.ordenada ? 'ol' : 'ul';
          return (
            <L key={i}>
              {b.itens.map((it, n) => (
                <li key={n}>{rico(tc(it))}</li>
              ))}
            </L>
          );
        }
        return (
          <table key={i}>
            <thead>
              <tr>
                {b.colunas.map((c, n) => (
                  <th key={c} className={b.numericas?.includes(n) ? 'is-num' : undefined}>
                    {tc(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.linhas.map((l) => (
                <tr key={l[0]}>
                  {l.map((c, n) => (
                    <td key={n} className={b.numericas?.includes(n) ? 'is-num' : undefined}>
                      {tc(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      })}
    </>
  );
}

/* ---------- histórico inicial ---------- */

const AGORA = new Date();
const horasAtras = (h: number) => new Date(AGORA.getTime() - h * 3600000);
const diasAtras = (d: number, h = 10) => new Date(AGORA.getFullYear(), AGORA.getMonth(), AGORA.getDate() - d, h);
const curta = (pergunta: string, resposta: Resposta, quando: Date, id: number): MsgIA[] => [
  { id, autor: 'usuario', texto: pergunta, estado: 'concluida', hora: quando },
  { id: id + 1, autor: 'assistente', resposta, visiveis: resposta.blocos.length, estado: 'concluida', hora: quando },
];

function historicoInicial(): ConversaIA[] {
  return [
    {
      id: 'c1',
      titulo: 'Vendas de outubro por região',
      data: horasAtras(0.5),
      mensagens: [
        ...curta('Resuma as vendas de outubro por região.', VENDAS, horasAtras(0.6), 1),
        ...curta('Qual consulta você usou?', SQL, horasAtras(0.5), 3),
      ],
    },
    { id: 'c2', titulo: 'Pedidos atrasados da semana', data: horasAtras(3), mensagens: curta('Liste os pedidos atrasados.', ATRASADOS, horasAtras(3), 10) },
    { id: 'c3', titulo: 'E-mail de cobrança', data: diasAtras(1), mensagens: curta('Escreva um e-mail de cobrança educado.', EMAIL, diasAtras(1), 20) },
    { id: 'c4', titulo: 'Fretes do Sul e do Nordeste', data: diasAtras(3), mensagens: curta('Compare os fretes do Sul e do Nordeste.', GENERICA, diasAtras(3), 30) },
    { id: 'c5', titulo: 'Metas do trimestre', data: diasAtras(12), fixada: true, mensagens: curta('Quais são as metas do trimestre?', GENERICA, diasAtras(12), 40) },
    { id: 'c6', titulo: 'Política de devolução', data: diasAtras(20), mensagens: curta('Resuma a política de devolução.', GENERICA, diasAtras(20), 50) },
    { id: 'c7', titulo: 'Planejamento de estoque', data: diasAtras(48), mensagens: curta('Como planejar o estoque de dezembro?', GENERICA, diasAtras(48), 60) },
  ];
}

const SUGESTOES = (t: TradutorDemo['t']): SugestaoConversa[] => ([
  { titulo: t('paginas.assistente.textos.resumirAsVendasDo'), descricao: t('paginas.assistente.textos.faturamentoPorRegiaoE'), icone: 'chart-line' },
  { titulo: t('paginas.assistente.textos.listarPedidosAtrasados'), descricao: t('paginas.assistente.textos.comClienteEDias'), icone: 'truck' },
  { titulo: t('paginas.assistente.textos.gerarAConsultaSql'), descricao: t('paginas.assistente.textos.paraUsarNoRelatorio'), icone: 'code' },
  { titulo: t('paginas.assistente.textos.escreverUmEMail'), descricao: t('paginas.assistente.textos.educadoEDireto'), icone: 'mail' },
]);

const MODOS = (t: TradutorDemo['t']) => ([
  { id: 'rapido', rotulo: t('paginas.assistente.textos.rapido'), extra: t('paginas.assistente.textos.respostasCurtas') },
  { id: 'detalhado', rotulo: t('paginas.assistente.textos.detalhado'), extra: t('paginas.assistente.textos.pensaMais') },
]);
const FERRAMENTAS = (t: TradutorDemo['t']): Record<string, string> => ({ docs: t('paginas.assistente.textos.documentos'), web: t('paginas.assistente.textos.web') });

let seq = 1000;

/* ---------- a página ---------- */

export function PaginaAssistente() {
  const { t: tx, idioma, tc } = useT();
  const { t } = useT();
  const toast = useToast();
  const confirmar = useConfirmacao();
  const [conversas, setConversas] = useState(historicoInicial);
  const [ativa, setAtiva] = useState<string | null>('c1');
  const [texto, setTexto] = useState('');
  const [anexos, setAnexos] = useState<AnexoMensagem[]>([]);
  const [ferramentas, setFerramentas] = useState<string[]>([]);
  const [modo, setModo] = useState('rapido');
  const [gerando, setGerando] = useState(false);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const arquivo = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const depois = (ms: number, f: () => void) => timers.current.push(window.setTimeout(f, ms));

  const conversa = conversas.find((c) => c.id === ativa) ?? null;
  const mudarMsg = (idConv: string, idMsg: number, m: Partial<MsgIA>) =>
    setConversas((l) => l.map((c) => (c.id === idConv ? { ...c, mensagens: c.mensagens.map((x) => (x.id === idMsg ? { ...x, ...m } : x)) } : c)));

  /** A resposta "chega" um bloco por vez, como num streaming. */
  const transmitir = (idConv: string, idMsg: number, resposta: Resposta) => {
    setGerando(true);
    depois(800, () => {
      let n = 0;
      const passo = () => {
        n++;
        const fim = n >= resposta.blocos.length;
        mudarMsg(idConv, idMsg, { resposta, visiveis: n, estado: fim ? 'concluida' : 'gerando' });
        if (fim) setGerando(false);
        else depois(260, passo);
      };
      passo();
    });
  };

  const enviar = (t: string) => {
    const agora = new Date();
    const anexosProntos = anexos.filter((a) => !a.erro);
    let idConv = ativa;
    const idU = ++seq;
    const idR = ++seq;
    const novas: MsgIA[] = [
      { id: idU, autor: 'usuario', texto: t, anexos: anexosProntos, ferramentas: ferramentas.map((f) => FERRAMENTAS(tx)[f]), estado: 'concluida', hora: agora },
      { id: idR, autor: 'assistente', estado: 'gerando', hora: agora, visiveis: 0 },
    ];
    if (!idConv) {
      // conversa nova: o título vem da primeira pergunta (o app pode pedir um título à IA)
      idConv = `c${++seq}`;
      const titulo = t ? (t.length > 42 ? `${t.slice(0, 40)}…` : t) : (anexosProntos[0]?.nome ?? tc('Nova conversa'));
      setConversas((l) => [{ id: idConv!, titulo, data: agora, mensagens: novas }, ...l]);
      setAtiva(idConv);
    } else {
      setConversas((l) => l.map((c) => (c.id === idConv ? { ...c, data: agora, mensagens: [...c.mensagens, ...novas] } : c)));
    }
    setTexto('');
    setAnexos([]);
    transmitir(idConv, idR, responderA(t, anexosProntos, tx));
  };

  const parar = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setGerando(false);
    setConversas((l) => l.map((c) => ({ ...c, mensagens: c.mensagens.map((m) => (m.estado === 'gerando' ? { ...m, estado: 'concluida' as const } : m)) })));
  };

  const gerarDeNovo = (m: MsgIA) => {
    if (!conversa || gerando) return;
    const i = conversa.mensagens.findIndex((x) => x.id === m.id);
    const pergunta = conversa.mensagens[i - 1];
    mudarMsg(conversa.id, m.id, { estado: 'gerando', visiveis: 0, avaliacao: undefined });
    transmitir(conversa.id, m.id, responderA(pergunta?.texto ?? '', pergunta?.anexos ?? [], tx));
  };

  const avaliar = (m: MsgIA, avaliacao: 'boa' | 'ruim') => {
    if (!conversa) return;
    const nova = m.avaliacao === avaliacao ? undefined : avaliacao;
    mudarMsg(conversa.id, m.id, { avaliacao: nova });
    if (nova) toast.ok(t('paginas.assistente.textos.obrigadoPeloRetorno'), nova === 'boa' ? t('paginas.assistente.textos.issoAjudaAMelhorar') : t('paginas.assistente.textos.vamosUsarIssoPara'));
  };

  // anexos: o "upload" sobe aos poucos (no app, o progresso viria do envio de verdade)
  const anexar = (arquivos: File[]) => {
    const grande = 20 * 1024 * 1024;
    const novos = arquivos.map((f) => ({ id: ++seq, nome: f.name, tamanho: f.size, tipo: f.type, progresso: 0, erro: f.size > grande ? t('paginas.assistente.textos.maiorQue20Mb') : undefined }));
    setAnexos((l) => [...l, ...novos]);
    for (const a of novos.filter((x) => !x.erro)) {
      [35, 70, 100].forEach((p, i) => depois(300 * (i + 1), () => setAnexos((l) => l.map((x) => (x.id === a.id ? { ...x, progresso: p } : x)))));
    }
  };

  const nova = () => {
    setAtiva(null);
    setHistoricoAberto(false);
  };
  const escolher = (id: string | number) => {
    setAtiva(String(id));
    setHistoricoAberto(false);
  };
  const excluir = async (id: string | number) => {
    const c = conversas.find((x) => x.id === id);
    if (!c || !(await confirmar.remover({ mensagem: t('paginas.assistente.textos.aConversaTituloSera', { titulo: c.titulo }) }))) return;
    setConversas((l) => l.filter((x) => x.id !== id));
    if (ativa === id) setAtiva(null);
  };

  const historico = (
    <ListaConversas
      itens={conversas.map((c) => ({ ...c, titulo: tc(c.titulo) }))}
      ativa={ativa}
      aoEscolher={escolher}
      aoNova={nova}
      aoRenomear={(id, titulo) => setConversas((l) => l.map((c) => (c.id === id ? { ...c, titulo } : c)))}
      aoFixar={(id, fixada) => setConversas((l) => l.map((c) => (c.id === id ? { ...c, fixada } : c)))}
      aoExcluir={excluir}
    />
  );

  const modoAtual = MODOS(t).find((m) => m.id === modo)!;
  const campo = (
    <CampoMensagem
      valor={texto}
      aoMudar={setTexto}
      aoEnviar={enviar}
      gerando={gerando}
      aoParar={parar}
      placeholder={t('paginas.assistente.textos.pergunteAoAssistente')}
      anexos={anexos}
      aoRemoverAnexo={(id) => setAnexos((l) => l.filter((a) => a.id !== id))}
      aoAdicionarArquivos={anexar}
      acoesExtras={
        <>
          <MenuSuspenso
            icone="plus"
            aria-label={t('paginas.assistente.textos.adicionar')}
            dica={t('paginas.assistente.textos.anexarEFerramentas')}
            severidade="secundario"
            aparencia="texto"
            tamanho="pequeno"
            semSeta
            direcao="cima"
            itens={[
              { id: 'anexar', rotulo: t('paginas.assistente.textos.anexarArquivo'), icone: 'paperclip' },
              { tipo: 'divisor' },
              { tipo: 'titulo', rotulo: t('paginas.assistente.textos.ferramentas') },
              { id: 'docs', rotulo: t('paginas.assistente.textos.buscarNosDocumentos'), icone: 'file-search', ativo: ferramentas.includes('docs') },
              { id: 'web', rotulo: t('paginas.assistente.textos.pesquisarNaWeb'), icone: 'globe', ativo: ferramentas.includes('web') },
            ]}
            aoEscolher={(id) => {
              if (id === 'anexar') arquivo.current?.click();
              else setFerramentas((l) => (l.includes(id) ? l.filter((f) => f !== id) : [...l, id]));
            }}
          />
          {ferramentas.map((f) => (
            <Chip key={f} rotulo={FERRAMENTAS(t)[f]} aoRemover={() => setFerramentas((l) => l.filter((x) => x !== f))} />
          ))}
          <MenuSuspenso
            rotulo={tc(modoAtual.rotulo)}
            icone="sparkles"
            aria-label={t('paginas.assistente.textos.modoRotulo', { rotulo: modoAtual.rotulo })}
            severidade="secundario"
            aparencia="texto"
            tamanho="pequeno"
            direcao="cima"
            itens={MODOS(t).map((m) => ({ ...m, ativo: m.id === modo }))}
            aoEscolher={setModo}
          />
          <input
            ref={arquivo}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              anexar(Array.from(e.target.files ?? []));
              e.target.value = '';
            }}
          />
        </>
      }
    />
  );

  const avatarIA = (
    <span className="demo-ia-avatar" aria-hidden="true">
      <Icone icone="sparkles" />
    </span>
  );

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.assistente.titulo')} icone="sparkles" trilha>{t('paginas.assistente.textos.paginaModeloDeUm')}</CabecalhoPagina>

      <div className="demo-ia">
        <aside className="demo-ia-lado">{historico}</aside>
        <section className="demo-ia-chat" aria-label={t('paginas.assistente.textos.conversaComOAssistente')}>
          <div className="demo-ia-topo">
            <Botao
              className="demo-ia-bt-historico"
              icone="panel-left"
              aria-label={t('paginas.assistente.textos.historicoDeConversas')}
              dica={t('paginas.assistente.textos.historico')}
              severidade="secundario"
              aparencia="texto"
              tamanho="pequeno"
              onClick={() => setHistoricoAberto(true)}
            />
            <h2 className="demo-ia-titulo">{tc(conversa?.titulo) ?? tc('Nova conversa')}</h2>
            {conversa && <Botao icone="square-pen" aria-label={t('paginas.assistente.textos.novaConversa')} dica={t('paginas.assistente.textos.novaConversa')} severidade="secundario" aparencia="texto" tamanho="pequeno" onClick={nova} />}
          </div>
          <Conversa
            rotulo={tc(conversa?.titulo) ?? t('paginas.assistente.textos.novaConversa')}
            larguraMaxima="46rem"
            campo={campo}
            vazio={
              <InicioConversa
                icone="sparkles"
                titulo={t('paginas.assistente.textos.valorAnaComoPosso', { valor: saudacaoPorHora(AGORA, idioma) })}
                descricao={t('paginas.assistente.textos.pergunteSobreVendasPedidos')}
                sugestoes={SUGESTOES(t)}
                aoEscolher={(s) => enviar(s.texto ?? s.titulo)}
              >
                <p className="demo-ia-aviso">{t('paginas.assistente.textos.asRespostasPodemConter')}</p>
              </InicioConversa>
            }
          >
            {conversa?.mensagens.map((m) =>
              m.autor === 'usuario' ? (
                <Mensagem
                  key={m.id}
                  autor="usuario"
                  nome={tc("Você")}
                  hora={m.hora}
                  rodape={
                    !!(m.anexos?.length || m.ferramentas?.length) && (
                      <div className="demo-ia-anexos">
                        {m.anexos?.map((a) => <Chip key={a.id} rotulo={tc(a.nome)} />)}
                        {m.ferramentas?.map((f) => <Chip key={f} campo={tc("Com")} rotulo={f} />)}
                      </div>
                    )
                  }
                >
                  {tc(m.texto) || undefined}
                </Mensagem>
              ) : (
                <Mensagem
                  key={m.id}
                  autor="assistente"
                  nome={tc("Assistente")}
                  avatar={avatarIA}
                  hora={m.hora}
                  estado={m.estado}
                  copiavel={m.estado === 'concluida'}
                  textoCopia={m.resposta && textoDe(m.resposta, tc)}
                  rodape={m.estado === 'concluida' && m.resposta?.referencias && <Referencias itens={m.resposta.referencias.map((r) => ({ ...r, titulo: tc(r.titulo), detalhe: tc(r.detalhe), trecho: tc(r.trecho) }))} />}
                  acoes={
                    m.estado === 'concluida' && (
                      <>
                        <Botao icone="refresh-cw" aria-label={t('paginas.assistente.textos.gerarDeNovo')} dica={t('paginas.assistente.textos.gerarDeNovo')} severidade="secundario" aparencia="texto" tamanho="pequeno" disabled={gerando} onClick={() => gerarDeNovo(m)} />
                        <Botao
                          icone="thumbs-up"
                          aria-label={t('paginas.assistente.textos.boaResposta')}
                          dica={t('paginas.assistente.textos.boaResposta')}
                          severidade="secundario"
                          aparencia="texto"
                          tamanho="pequeno"
                          pressionado={m.avaliacao === 'boa'}
                          onClick={() => avaliar(m, 'boa')}
                        />
                        <Botao
                          icone="thumbs-down"
                          aria-label={t('paginas.assistente.textos.respostaRuim')}
                          dica={t('paginas.assistente.textos.respostaRuim')}
                          severidade="secundario"
                          aparencia="texto"
                          tamanho="pequeno"
                          pressionado={m.avaliacao === 'ruim'}
                          onClick={() => avaliar(m, 'ruim')}
                        />
                      </>
                    )
                  }
                >
                  {m.resposta && m.visiveis ? <ConteudoResposta resposta={m.resposta} visiveis={m.visiveis} /> : undefined}
                </Mensagem>
              ),
            )}
          </Conversa>
        </section>
      </div>

      <Dialogo aberto={historicoAberto} aoFechar={() => setHistoricoAberto(false)} titulo={t('paginas.assistente.textos.conversas')} icone="history" aparencia="lateral" tamanho="pequeno">
        <div className="demo-ia-gaveta">{historico}</div>
      </Dialogo>

      <div className="demo-colunas">
        <Card titulo={t('paginas.assistente.secoes.componentesKole')} subtitulo={t('paginas.assistente.textos.oQueEstaPagina')}>
          <ul className="demo-ia-lista">
            <li>{rico(t('paginas.assistente.textos.listaconversasHistoricoAgrupadoPor'))}</li>
            <li>{rico(t('paginas.assistente.textos.conversaInicioconversaRolagemQue'))}</li>
            <li>{rico(t('paginas.assistente.textos.campomensagemAnexosEmChips'))}</li>
            <li>{rico(t('paginas.assistente.textos.mensagemConteudoRicoTabela'))}</li>
          </ul>
        </Card>
        <Card titulo={t('paginas.assistente.secoes.ficaComApp')} subtitulo={t('paginas.assistente.textos.foraDaBiblioteca')}>
          <ul className="demo-ia-lista">
            <li>{rico(t('paginas.assistente.textos.chamarAApiDo'))}</li>
            <li>{rico(t('paginas.assistente.textos.salvarEBuscarO'))}</li>
            <li>{rico(t('paginas.assistente.textos.enviarOsAnexosE'))}</li>
            <li>{rico(t('paginas.assistente.textos.renderizarOMarkdownDa'))}</li>
            <li>{t('paginas.assistente.textos.guardarAsAvaliacoesE')}</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
