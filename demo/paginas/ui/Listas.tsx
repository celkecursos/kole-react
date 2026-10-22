import { useState } from 'react';
import { Avatar, Badge, CabecalhoPagina, Icone, ItemLista, Lista, useToast, type CorBadge, type CorItemLista } from '../../../src';
import { Bloco, retrato } from '../Bloco';

const PESSOAS: Array<[string, string]> = [
  ['Alícia Serra', '#1f5fe0'],
  ['Samanta Melo', '#e8590c'],
  ['Juliana Pena', '#15803d'],
  ['Adão Silva', '#7c3aed'],
  ['Farid Amaral', '#0b72aa'],
];

const CORES: Array<{ cor?: CorItemLista; nome: string }> = [
  { nome: 'padrão' },
  { cor: 'pri', nome: 'primária' },
  { cor: 'secundario', nome: 'secundária' },
  { cor: 'ok', nome: 'de sucesso' },
  { cor: 'err', nome: 'de perigo' },
  { cor: 'warn', nome: 'de aviso' },
  { cor: 'info', nome: 'informativa' },
  { cor: 'destaque', nome: 'de destaque' },
  { cor: 'escuro', nome: 'escura' },
];

const FRASES = [
  'Pedido separado e pronto para envio.',
  'Há muitas variações de entrega disponíveis.',
  'Todos os geradores de etiqueta estão ativos.',
  'Todos os relatórios foram processados.',
  'Fechamento do mês concluído sem pendências.',
];

const TAREFAS = [
  'Conferir o estoque do dia.',
  'Responder os clientes da manhã.',
  'Configurar a própria meta de vendas.',
  'Revisar os pedidos atrasados.',
  'Emitir as notas pendentes.',
  'Enviar o relatório semanal.',
];

export function PaginaListas() {
  const toast = useToast();
  const [cidade, setCidade] = useState('sp');
  const [botao, setBotao] = useState(0);
  const [marcadas, setMarcadas] = useState<number[]>([0, 2, 4]);
  const [plano, setPlano] = useState(2);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Listas" icone="list" trilha />

      <div className="demo-colunas-3">
        <Bloco titulo="Lista básica">
          <Lista rotulo="Equipe">
            {PESSOAS.map(([nome, cor]) => (
              <ItemLista key={nome} inicio={<Avatar nome={nome} foto={retrato(cor, nome[0])} tamanho="1.75rem" />}>
                {nome}
              </ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo="Item ativo">
          <Lista rotulo="Seções">
            {[
              ['house', 'Início'],
              ['bell', 'Notificações'],
              ['send', 'Mensagens enviadas'],
              ['user-plus', 'Novas solicitações'],
              ['trash-2', 'Mensagens excluídas'],
            ].map(([icone, rotulo], i) => (
              <ItemLista key={rotulo} ativo={i === 0} inicio={
                  <span className="demo-lista-caixa">
                    <Icone icone={icone} />
                  </span>
                }>
                {rotulo}
              </ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo="Item desabilitado">
          <Lista>
            <ItemLista desabilitado>Um item desabilitado de propósito</ItemLista>
            {FRASES.map((f) => (
              <ItemLista key={f}>{f}</ItemLista>
            ))}
          </Lista>
        </Bloco>

        <Bloco titulo="Sem borda" descricao="Encostada no container, para usar dentro de cards.">
          <Lista variante="sem-borda" rotulo="Contatos">
            {[
              ['mail', 'Ana Trindade', '(11) 91023-8453'],
              ['phone', 'Alexandre Russo', '(21) 97546-1234'],
              ['message-square', 'Karen Souza', '(31) 99944-5663'],
              ['users', 'Melissa Brito', '(41) 91023-3432'],
              ['camera', 'Camila Rios', '(51) 96342-1100'],
            ].map(([icone, nome, tel]) => (
              <ItemLista key={nome} icone={icone} fim={tel}>
                <strong>{nome}</strong>
              </ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo="Links" descricao="Cada item é um link; o ativo leva aria-current.">
          <Lista rotulo="Cidades">
            {[
              ['sp', 'São Paulo'],
              ['rj', 'Rio de Janeiro'],
              ['bh', 'Belo Horizonte'],
              ['ctba', 'Curitiba'],
              ['poa', 'Porto Alegre'],
            ].map(([id, nome]) => (
              <ItemLista
                key={id}
                href="#/ui/listas"
                ativo={cidade === id}
                desabilitado={id === 'poa'}
                inicio={<Avatar iniciais={nome[0]} tamanho="1.75rem" />}
                onClick={(e) => {
                  e.preventDefault();
                  setCidade(id);
                }}
              >
                {nome}
              </ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo="Botões" descricao="Itens clicáveis que não navegam.">
          <Lista>
            {FRASES.map((f, i) => (
              <ItemLista key={f} ativo={botao === i} desabilitado={i === FRASES.length - 1} onClick={() => setBotao(i)}>
                {f}
              </ItemLista>
            ))}
          </Lista>
        </Bloco>
      </div>

      <div className="demo-colunas">
        <Bloco titulo="Cores">
          <Lista>
            {CORES.map((c) => (
              <ItemLista key={c.nome} cor={c.cor}>
                Um item simples na cor {c.nome}
              </ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo="Cores com hover" descricao="Em links e botões, o hover reforça o tom.">
          <Lista>
            {CORES.map((c) => (
              <ItemLista key={c.nome} cor={c.cor} onClick={() => toast.info('Item', c.nome)}>
                Um item clicável na cor {c.nome}
              </ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo="Cores sólidas">
          <Lista>
            {CORES.map((c) => (
              <ItemLista key={c.nome} cor={c.cor} solido>
                Um item sólido na cor {c.nome}
              </ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo="Conteúdo personalizado" descricao="Título, texto e informação à direita.">
          <Lista>
            {[
              ['Como os editores de página usam texto de exemplo?', 'há 3 dias', 'Existem muitas variações de passagens disponíveis, mas a maioria sofreu alterações.'],
              ['Quem foi o professor que achou a origem?', 'há 4 h', 'Ao contrário da crença popular, o texto de exemplo não é aleatório.'],
              ['Ele usa um dicionário com mais de 200 palavras?', 'há 15 h', 'O texto de exemplo é o padrão da indústria desde o século XVI.'],
              ['Por que usamos texto de exemplo?', 'há 2 dias', 'Um leitor se distrai com o conteúdo legível ao olhar o layout.'],
            ].map(([titulo, tempo, texto], i) => (
              <ItemLista key={titulo} titulo={titulo} fim={tempo} ativo={i === 0} href="#/ui/listas" onClick={(e) => e.preventDefault()}>
                {texto}
              </ItemLista>
            ))}
          </Lista>
        </Bloco>
      </div>

      <div className="demo-colunas-3">
        <Bloco titulo="Subtítulos" descricao="Numerada, com título, descrição e badge.">
          <Lista numerada>
            {(
              [
                ['O que aconteceu?', 'Especialistas sugerem que pode existir.', '32 visitas', 'pri'],
                ['Foi incrível!', 'A ideia envolvia pegar o vermelho.', '52 visitas', 'info'],
                ['Notícia é uma grande arma.', 'Notícias influenciam de muitas formas.', '1.204 visitas', 'ok'],
                ['Uma pessoa feliz', 'Bem-estar começa com bons hábitos.', '24 visitas', 'err'],
              ] as Array<[string, string, string, CorBadge]>
            ).map(([titulo, desc, visitas, cor]) => (
              <ItemLista key={titulo} titulo={titulo} fim={<Badge cor={cor} aparencia="suave" rotulo={visitas} />}>
                {desc}
              </ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo="Lista numerada">
          <Lista numerada>
            {FRASES.concat('Escrito em 45 a.C., um tratado sobre a teoria.').map((f) => (
              <ItemLista key={f}>{f}</ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo="Com caixas de marcação">
          <Lista rotulo="Tarefas">
            {TAREFAS.map((t, i) => (
              <ItemLista
                key={t}
                marcacao="caixa"
                marcado={marcadas.includes(i)}
                desabilitado={i === TAREFAS.length - 1}
                aoMarcar={(m) => setMarcadas((xs) => (m ? [...xs, i] : xs.filter((x) => x !== i)))}
              >
                {t}
              </ItemLista>
            ))}
          </Lista>
          <code className="demo-util-res">marcadas: {JSON.stringify([...marcadas].sort())}</code>
        </Bloco>

        <Bloco titulo="Com rádios">
          <Lista rotulo="Plano">
            {TAREFAS.map((t, i) => (
              <ItemLista key={t} marcacao="radio" nome="demo-lista-radio" marcado={plano === i} desabilitado={i === TAREFAS.length - 1} aoMarcar={() => setPlano(i)}>
                {t}
              </ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo="Com badges">
          <Lista>
            <ItemLista fim={<Badge cor="pri" rotulo="Disponível" />}>Mercearia</ItemLista>
            <ItemLista fim={<Badge cor="destaque" rotulo="Comprar" />}>Móveis</ItemLista>
            <ItemLista fim={<Badge cor="err" formato="pilula" rotulo="32" />}>Beleza</ItemLista>
            <ItemLista fim={<Badge cor="ok" aparencia="suave" rotulo="Novo" />}>Livros</ItemLista>
            <ItemLista fim={<Badge cor="info" aparencia="contorno" rotulo="Em alta" />}>Esportes</ItemLista>
            <ItemLista fim={<Badge cor="warn" formato="pilula" rotulo="5" />}>Brinquedos</ItemLista>
          </Lista>
        </Bloco>
        <Bloco titulo="Horizontal" descricao="Sempre, ou só a partir de um tamanho de tela.">
          <div className="demo-pilha-p">
            <Lista horizontal>
              <ItemLista>Um item</ItemLista>
              <ItemLista>Segundo</ItemLista>
              <ItemLista>Terceiro</ItemLista>
            </Lista>
            {(['sm', 'md', 'lg', 'xl'] as const).map((bp) => (
              <Lista key={bp} horizontal={bp}>
                <ItemLista>Um item</ItemLista>
                <ItemLista>Segundo</ItemLista>
                <ItemLista>{bp}</ItemLista>
              </Lista>
            ))}
          </div>
        </Bloco>
      </div>
    </div>
  );
}
