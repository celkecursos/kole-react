import { useState } from 'react';
import { Avatar, Badge, CabecalhoPagina, Icone, ItemLista, Lista, useToast, type CorBadge, type CorItemLista } from '../../../src';
import { Bloco, retrato } from '../Bloco';
import { useT, type TradutorDemo } from '../../i18n/useT';

const PESSOAS = (t: TradutorDemo['t']): Array<[string, string]> => ([
  [t('paginas.listas.textos.aliciaSerra'), '#1f5fe0'],
  [t('paginas.listas.textos.samantaMelo'), '#e8590c'],
  [t('paginas.listas.textos.julianaPena'), '#15803d'],
  [t('paginas.listas.textos.adaoSilva'), '#7c3aed'],
  [t('paginas.listas.textos.faridAmaral'), '#0b72aa'],
]);

const CORES = (t: TradutorDemo['t']): Array<{ cor?: CorItemLista; nome: string }> => ([
  { nome: t('paginas.listas.textos.padrao') },
  { cor: 'pri', nome: t('paginas.listas.textos.primaria') },
  { cor: 'secundario', nome: t('paginas.listas.textos.secundaria') },
  { cor: 'ok', nome: t('paginas.listas.textos.deSucesso') },
  { cor: 'err', nome: t('paginas.listas.textos.dePerigo') },
  { cor: 'warn', nome: t('paginas.listas.textos.deAviso') },
  { cor: 'info', nome: 'informativa' },
  { cor: 'destaque', nome: t('paginas.listas.textos.deDestaque') },
  { cor: 'escuro', nome: 'escura' },
]);

const FRASES = (t: TradutorDemo['t']) => ([
  t('paginas.listas.textos.pedidoSeparadoEPronto'),
  t('paginas.listas.textos.haMuitasVariacoesDe'),
  t('paginas.listas.textos.todosOsGeradoresDe'),
  t('paginas.listas.textos.todosOsRelatoriosForam'),
  t('paginas.listas.textos.fechamentoDoMesConcluido'),
]);

const TAREFAS = (t: TradutorDemo['t']) => ([
  t('paginas.listas.textos.conferirOEstoqueDo'),
  t('paginas.listas.textos.responderOsClientesDa'),
  t('paginas.listas.textos.configurarAPropriaMeta'),
  t('paginas.listas.textos.revisarOsPedidosAtrasados'),
  t('paginas.listas.textos.emitirAsNotasPendentes'),
  t('paginas.listas.textos.enviarORelatorioSemanal'),
]);

export function PaginaListas() {
  const { t: tx } = useT();
  const { t } = useT();
  const toast = useToast();
  const [cidade, setCidade] = useState('sp');
  const [botao, setBotao] = useState(0);
  const [marcadas, setMarcadas] = useState<number[]>([0, 2, 4]);
  const [plano, setPlano] = useState(2);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.listas.titulo')} icone="list" trilha />

      <div className="demo-colunas-3">
        <Bloco titulo={t('paginas.listas.secoes.listaBasica')}>
          <Lista rotulo={t('paginas.listas.textos.equipe')}>
            {PESSOAS(t).map(([nome, cor]) => (
              <ItemLista key={nome} inicio={<Avatar nome={nome} foto={retrato(cor, nome[0])} tamanho="1.75rem" />}>
                {nome}
              </ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo={t('paginas.listas.secoes.itemAtivo')}>
          <Lista rotulo={t('paginas.listas.textos.secoes')}>
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
        <Bloco titulo={t('paginas.listas.secoes.itemDesabilitado')}>
          <Lista>
            <ItemLista desabilitado>{t('paginas.listas.textos.umItemDesabilitadoDe')}</ItemLista>
            {FRASES(t).map((f) => (
              <ItemLista key={f}>{f}</ItemLista>
            ))}
          </Lista>
        </Bloco>

        <Bloco titulo={t('paginas.listas.secoes.semBorda')} descricao={t('paginas.listas.textos.encostadaNoContainerPara')}>
          <Lista variante="sem-borda" rotulo={t('paginas.listas.textos.contatos')}>
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
        <Bloco titulo={t('paginas.listas.secoes.links')} descricao={t('paginas.listas.textos.cadaItemEUm')}>
          <Lista rotulo={t('paginas.listas.textos.cidades')}>
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
        <Bloco titulo={t('paginas.listas.secoes.botoes')} descricao={t('paginas.listas.textos.itensClicaveisQueNao')}>
          <Lista>
            {FRASES(t).map((f, i) => (
              <ItemLista key={f} ativo={botao === i} desabilitado={i === FRASES(t).length - 1} onClick={() => setBotao(i)}>
                {f}
              </ItemLista>
            ))}
          </Lista>
        </Bloco>
      </div>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.listas.secoes.cores')}>
          <Lista>
            {CORES(t).map((c) => (
              <ItemLista key={c.nome} cor={c.cor}>{t('paginas.listas.textos.umItemSimplesNa', { nome: c.nome })}</ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo={t('paginas.listas.secoes.coresComHover')} descricao={t('paginas.listas.textos.emLinksEBotoes')}>
          <Lista>
            {CORES(t).map((c) => (
              <ItemLista key={c.nome} cor={c.cor} onClick={() => toast.info(t('paginas.listas.textos.item'), c.nome)}>{t('paginas.listas.textos.umItemClicavelNa', { nome: c.nome })}</ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo={t('paginas.listas.secoes.coresSolidas')}>
          <Lista>
            {CORES(t).map((c) => (
              <ItemLista key={c.nome} cor={c.cor} solido>{t('paginas.listas.textos.umItemSolidoNa', { nome: c.nome })}</ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo={t('paginas.listas.secoes.conteudoPersonalizado')} descricao={t('paginas.listas.textos.tituloTextoEInformacao')}>
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
        <Bloco titulo={t('paginas.listas.secoes.subtitulos')} descricao={t('paginas.listas.textos.numeradaComTituloDescricao')}>
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
        <Bloco titulo={t('paginas.listas.secoes.listaNumerada')}>
          <Lista numerada>
            {FRASES(t).concat('Escrito em 45 a.C., um tratado sobre a teoria.').map((f) => (
              <ItemLista key={f}>{f}</ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo={t('paginas.listas.secoes.comCaixasDeMarcacao')}>
          <Lista rotulo={t('paginas.listas.textos.tarefas')}>
            {TAREFAS(t).map((t, i) => (
              <ItemLista
                key={t}
                marcacao="caixa"
                marcado={marcadas.includes(i)}
                desabilitado={i === TAREFAS(tx).length - 1}
                aoMarcar={(m) => setMarcadas((xs) => (m ? [...xs, i] : xs.filter((x) => x !== i)))}
              >
                {t}
              </ItemLista>
            ))}
          </Lista>
          <code className="demo-util-res">marcadas: {JSON.stringify([...marcadas].sort())}</code>
        </Bloco>

        <Bloco titulo={t('paginas.listas.secoes.comRadios')}>
          <Lista rotulo={t('paginas.listas.textos.plano')}>
            {TAREFAS(t).map((t, i) => (
              <ItemLista key={t} marcacao="radio" nome="demo-lista-radio" marcado={plano === i} desabilitado={i === TAREFAS(tx).length - 1} aoMarcar={() => setPlano(i)}>
                {t}
              </ItemLista>
            ))}
          </Lista>
        </Bloco>
        <Bloco titulo={t('paginas.listas.secoes.comBadges')}>
          <Lista>
            <ItemLista fim={<Badge cor="pri" rotulo={t('paginas.listas.textos.disponivel')} />}>{t('paginas.listas.textos.mercearia')}</ItemLista>
            <ItemLista fim={<Badge cor="destaque" rotulo={t('paginas.listas.textos.comprar')} />}>{t('paginas.listas.textos.moveis')}</ItemLista>
            <ItemLista fim={<Badge cor="err" formato="pilula" rotulo="32" />}>{t('paginas.listas.textos.beleza')}</ItemLista>
            <ItemLista fim={<Badge cor="ok" aparencia="suave" rotulo={t('paginas.listas.textos.novo')} />}>{t('paginas.listas.textos.livros')}</ItemLista>
            <ItemLista fim={<Badge cor="info" aparencia="contorno" rotulo={t('paginas.listas.textos.emAlta')} />}>{t('paginas.listas.textos.esportes')}</ItemLista>
            <ItemLista fim={<Badge cor="warn" formato="pilula" rotulo="5" />}>{t('paginas.listas.textos.brinquedos')}</ItemLista>
          </Lista>
        </Bloco>
        <Bloco titulo={t('paginas.listas.secoes.horizontal')} descricao={t('paginas.listas.textos.sempreOuSoA')}>
          <div className="demo-pilha-p">
            <Lista horizontal>
              <ItemLista>{t('paginas.listas.textos.umItem')}</ItemLista>
              <ItemLista>{t('paginas.listas.textos.segundo')}</ItemLista>
              <ItemLista>{t('paginas.listas.textos.terceiro')}</ItemLista>
            </Lista>
            {(['sm', 'md', 'lg', 'xl'] as const).map((bp) => (
              <Lista key={bp} horizontal={bp}>
                <ItemLista>{t('paginas.listas.textos.umItem')}</ItemLista>
                <ItemLista>{t('paginas.listas.textos.segundo')}</ItemLista>
                <ItemLista>{bp}</ItemLista>
              </Lista>
            ))}
          </div>
        </Bloco>
      </div>
    </div>
  );
}
