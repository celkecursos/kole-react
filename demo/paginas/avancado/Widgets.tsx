import { useState } from 'react';
import {
  Aba,
  Abas,
  Avatar,
  Badge,
  Botao,
  CabecalhoPagina,
  CampoMoeda,
  CampoTexto,
  Card,
  Icone,
  Indicador,
  Indicadores,
  ItemLista,
  Lista,
  MenuSuspenso,
  Progresso,
  useToast,
  type CorBadge,
  type CorProgresso,
} from '../../../src';
import { retrato } from '../Bloco';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const PESSOAS = [
  { nome: 'Ana Pereira', cor: '#1f5fe0', cidade: 'São Paulo' },
  { nome: 'Bruno Lima', cor: '#e8590c', cidade: 'Recife' },
  { nome: 'Carla Dias', cor: '#15803d', cidade: 'Curitiba' },
  { nome: 'Diego Rocha', cor: '#7c3aed', cidade: 'Belém' },
  { nome: 'Elisa Moura', cor: '#0b72aa', cidade: 'Porto Alegre' },
];

const foto = (i: number) => retrato(PESSOAS[i].cor, PESSOAS[i].nome[0]);

/** Menu "…" que se repete no canto dos widgets. */
function MaisOpcoes({ rotulo }: { rotulo: string }) {
  return (
    <MenuSuspenso
      icone="ellipsis"
      semSeta
      aria-label={`Opções de ${rotulo}`}
      aparencia="texto"
      severidade="secundario"
      tamanho="pequeno"
      alinhamento="fim"
      itens={[
        { id: 'semana', rotulo: 'Esta semana' },
        { id: 'mes', rotulo: 'Este mês' },
        { id: 'ano', rotulo: 'Este ano' },
      ]}
    />
  );
}

/** Gráfico de barras simples em SVG (sem biblioteca de gráficos). */
function Barras({ dados, rotulos }: { dados: Array<[number, number]>; rotulos: string[] }) {
  const max = 100;
  const larg = 280;
  const alt = 150;
  const passo = larg / dados.length;
  return (
    <svg className="demo-wid-barras" viewBox={`0 0 ${larg} ${alt + 18}`} role="img" aria-label="Candidatos por dia da semana: candidaturas e entrevistas">
      {[0, 25, 50, 75, 100].map((v) => (
        <line key={v} x1="0" x2={larg} y1={alt - (v / max) * alt} y2={alt - (v / max) * alt} className="demo-wid-grade" />
      ))}
      {dados.map(([a, b], i) => {
        const x = i * passo + passo / 2;
        return (
          <g key={i}>
            <rect x={x - 9} y={alt - (a / max) * alt} width="7" height={(a / max) * alt} rx="2" className="demo-wid-barra-a" />
            <rect x={x + 2} y={alt - (b / max) * alt} width="7" height={(b / max) * alt} rx="2" className="demo-wid-barra-b" />
            <text x={x} y={alt + 14} textAnchor="middle" className="demo-wid-eixo">
              {rotulos[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function PaginaWidgets() {
  const toast = useToast();
  const [tarefasFeitas, setTarefasFeitas] = useState<number[]>([1]);
  const [destino, setDestino] = useState(2);
  const [conta, setConta] = useState('11 96773-1611');
  const [valor, setValor] = useState<number | null>(2000);

  const TAREFAS: Array<[string, string, string, CorBadge]> = [
    ['Página de tarefas do novo modelo', '12h43', 'Hoje', 'pri'],
    ['Corrigir a interface do novo modelo', '11h25', 'Amanhã', 'destaque'],
    ['Preparar os requisitos', '09h56', 'Hoje', 'pri'],
    ['Trocar o estilo do painel', '08h15', 'Hoje', 'pri'],
    ['Atualizar o tema de cores', '16h20', 'Amanhã', 'destaque'],
  ];

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Widgets" icone="layout-grid" trilha />

      {/* ---- indicadores com variação ---- */}
      <Indicadores className="demo-wid-linha-ind">
        <Indicador rotulo="Produtos" valor={45280} icone="package" cor="var(--pri)" variacao={1.31} />
        <Indicador rotulo="Pedidos" valor={12088} icone="shopping-cart" cor="var(--err-solid)" variacao={-12.05} />
        <Indicador rotulo="Vendas" valor={10500} icone="chart-line" cor="var(--info-solid)" variacao={1.14} />
        <Indicador rotulo="Receita" valor={BRL.format(69270)} icone="wallet" cor="var(--acento)" variacao={2.58} />
        <Indicador rotulo="Despesas" valor={BRL.format(21520)} icone="credit-card" cor="var(--ok-solid)" variacao={-14.69} variacaoBoa="baixa" />
      </Indicadores>

      <Indicadores>
        <Indicador rotulo="Projetos" valor="676,90" icone="briefcase" cor="var(--info-solid)" variacao={105.05} descricao="há 6 min" />
        <Indicador rotulo="Projetos pendentes" valor="406,90" icone="clock" cor="var(--err-solid)" variacao={-95.05} descricao="há 30 min" />
        <Indicador rotulo="Projetos novos" valor="716,80" icone="folder" cor="var(--acento)" variacao={6.43} descricao="há 1 h" />
        <Indicador rotulo="Projetos concluídos" valor="536,80" icone="circle-check" cor="var(--ok-solid)" variacao={-396.03} descricao="há 30 min" />
      </Indicadores>

      <div className="demo-wid-grade-6">
        {(
          [
            ['Candidaturas', 1123, 'users', 'var(--pri)', 1.26, 'alta'],
            ['Pré-selecionados', 7123, 'user-plus', 'var(--err-solid)', 4.26, 'alta'],
            ['Contratados', 8123, 'circle-check', 'var(--ok-solid)', 6.26, 'alta'],
            ['Recusados', 8123, 'circle-x', 'var(--err-solid)', 9.26, 'baixa'],
            ['Localidades', 5123, 'map-pin', 'var(--acento)', 0.86, 'alta'],
            ['Currículos enviados', 5123, 'file-text', 'var(--info-solid)', 9.68, 'alta'],
          ] as const
        ).map(([rotulo, v, icone, cor, variacao, boa]) => (
          <Indicador key={rotulo} rotulo={rotulo} valor={v} icone={icone} cor={cor} variacao={variacao} variacaoBoa={boa} />
        ))}
      </div>

      {/* ---- metas ---- */}
      <div className="demo-wid-grade-4">
        {(
          [
            ['Candidatos', 'Total no processo seletivo.', 2460, 2.5, 14, 'pri'],
            ['Recrutadores', 'Equipe ativa neste mês.', 7539, 3.1, 55, 'destaque'],
            ['Visualizações', 'Páginas de vagas abertas.', 13693, 5.4, 24, 'ok'],
            ['Assinaturas', 'Planos pagos ativos.', 1116, -3.2, 67, 'info'],
          ] as const
        ).map(([titulo, desc, v, variacao, meta, cor]) => (
          <Card key={titulo} ferramentas={<MaisOpcoes rotulo={titulo} />} titulo={titulo} subtitulo={desc}>
            <div className="demo-wid-meta">
              {/* o título já está no cabeçalho do card: o rótulo do indicador fica só para leitor de tela */}
              <Indicador rotulo={titulo} valor={v} variacao={variacao} className="demo-wid-sem-borda demo-wid-sem-rotulo" />
              <Progresso valor={meta} cor={cor as CorProgresso} altura="sm" rotulo={`${meta}% da meta`} />
              <small>{meta}% da meta</small>
            </div>
          </Card>
        ))}
      </div>

      {/* ---- faixa + destaque ---- */}
      <div className="demo-wid-faixa-linha">
        <Card corpoSemEspaco>
          <div className="demo-wid-faixa">
            {(
              [
                ['Produtos', 45280, 'package', 1.31],
                ['Vendas', 10500, 'chart-line', -1.14],
                ['Receita', BRL.format(69270), 'wallet', 2.58],
                ['Pedidos', 12088, 'shopping-cart', 12.05],
              ] as const
            ).map(([rotulo, v, icone, variacao]) => (
              <div key={rotulo} className="demo-wid-faixa-item">
                <span className="demo-wid-tile">
                  <Icone icone={icone} />
                </span>
                <Indicador rotulo={rotulo} valor={v} variacao={variacao} className="demo-wid-sem-borda demo-wid-ind-p" />
              </div>
            ))}
          </div>
        </Card>
        <Card cor="pri">
          <div className="demo-wid-destaque">
            <span className="demo-wid-tile demo-wid-tile--claro">
              <Icone icone="credit-card" />
            </span>
            <div>
              <strong>{BRL.format(21520)}</strong>
              <span>Despesas</span>
            </div>
            <Badge cor="ok" rotulo="↑ 14,69%" />
          </div>
        </Card>
      </div>

      <div className="demo-wid-dois">
        <Card titulo="Resumo de RH" subtitulo="Comparado ao mês anterior">
          <div className="demo-wid-mini-grade">
            {(
              [
                ['Funcionários', 256, 'users', -1.05],
                ['Candidatos', 4026, 'user-plus', 0.4],
                ['Localidades', 48, 'map-pin', 0.82],
                ['Recrutadores', 1116, 'briefcase', 0.21],
                ['Assinaturas', 1468, 'bell', -0.153],
                ['Currículos/proporção', '34%', 'file-text', 0.165],
              ] as const
            ).map(([rotulo, v, icone, variacao]) => (
              <div key={rotulo} className="demo-wid-mini">
                <span className="demo-wid-tile">
                  <Icone icone={icone} />
                </span>
                <Indicador rotulo={rotulo} valor={v} variacao={variacao} className="demo-wid-sem-borda demo-wid-ind-p" />
              </div>
            ))}
          </div>
        </Card>
        <div className="demo-pilha">
          <Card cor="pri" titulo="Recrutadores premium" ferramentas={<Icone icone="chevron-right" />}>
            <div className="demo-wid-premium">
              <strong>9.231</strong>
              <span>
                <Icone icone="arrow-up" /> 2,3% desde o mês passado
              </span>
            </div>
          </Card>
          <Card>
            <div className="demo-wid-cripto">
              <span className="demo-wid-tile">
                <Icone icone="wallet" />
              </span>
              <div>
                <strong>Bitcoin</strong>
                <span>{BRL.format(58151.02)}</span>
              </div>
              <div className="demo-wid-cripto-var">
                <Badge cor="ok" aparencia="suave" rotulo="↑ 2,14%" />
                <span>+{BRL.format(5745.62)}</span>
              </div>
            </div>
            <div className="demo-wid-cripto-acoes">
              <Botao rotulo="Vender" severidade="secundario" aparencia="suave" formato="retangulo" bloco onClick={() => toast.info('Venda', 'Simulação')} />
              <Botao rotulo="Comprar" aparencia="suave" formato="retangulo" bloco onClick={() => toast.ok('Compra', 'Simulação')} />
            </div>
          </Card>
        </div>
      </div>

      <div className="demo-wid-dois">
        <Card titulo="Desempenho da equipe" rodape={<Botao rotulo="Ver o desempenho de todos" icone="arrow-right" posicaoIcone="direita" aparencia="texto" formato="retangulo" />}>
          <div className="demo-wid-equipe">
            <div>
              <Avatar nome={PESSOAS[0].nome} foto={foto(0)} tamanho="3.5rem" />
              <strong>{PESSOAS[0].nome}</strong>
              <span>Melhor vendedora</span>
            </div>
            <div>
              <span className="demo-wid-tile">
                <Icone icone="shopping-cart" />
              </span>
              <strong>71.234</strong>
              <span>Metas totais</span>
            </div>
            <div>
              <span className="demo-wid-tile">
                <Icone icone="chart-column" />
              </span>
              <strong>66.450</strong>
              <span>Vendas totais</span>
            </div>
          </div>
        </Card>
        <Card titulo="Vendas por categoria">
          <div className="demo-wid-categorias">
            <div>
              <span>Vendas totais</span>
              <strong>55.283 / 120 mil</strong>
            </div>
            <Progresso
              altura="xl"
              mostrarValor="dentro"
              rotulo="Vendas por categoria"
              segmentos={[
                { valor: 25, cor: 'pri', rotulo: 'Eletrônicos' },
                { valor: 40, cor: 'destaque', rotulo: 'Casa' },
              ]}
            />
            <div className="demo-wid-legenda">
              <span>
                <i className="demo-wid-ponto" style={{ background: 'var(--pri)' }} /> Eletrônicos
              </span>
              <span>
                <i className="demo-wid-ponto" style={{ background: 'var(--acento)' }} /> Casa
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card titulo="Principais origens" ferramentas={<MaisOpcoes rotulo="Principais origens" />} corpoSemEspaco>
        <table className="demo-wid-tabela">
          <thead>
            <tr>
              <th>Navegador</th>
              <th>Visualizações</th>
              <th>Participação</th>
            </tr>
          </thead>
          <tbody>
            {(
              [
                ['Chrome', 37098, true, 62, 'pri'],
                ['Safari', 37098, true, 58, 'info'],
                ['Firefox', 54085, false, 42, 'destaque'],
                ['Opera', 74085, true, 48, 'err'],
                ['Edge', 54085, false, 44, 'ok'],
              ] as const
            ).map(([nav, v, subiu, pct, cor]) => (
              <tr key={nav}>
                <td>
                  <span className="demo-wid-nav">
                    <Avatar iniciais={nav[0]} tamanho="1.75rem" />
                    {nav}
                  </span>
                </td>
                <td>
                  {v.toLocaleString('pt-BR')}{' '}
                  <Icone icone={subiu ? 'arrow-up' : 'arrow-down'} className={subiu ? 'demo-wid-sobe' : 'demo-wid-desce'} />
                </td>
                <td className="demo-wid-col-prog">
                  <Progresso valor={pct} cor={cor} altura="sm" rotulo={`${nav}: ${pct}%`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="demo-wid-dois demo-wid-dois--largo">
        <Card titulo="Lista de tarefas" ferramentas={<Botao rotulo="Nova tarefa" icone="plus" tamanho="pequeno" aparencia="suave" formato="retangulo" />}>
          <Abas variante="suave" rotulo="Tarefas">
            <Aba valor="ativas" rotulo="Ativas">
              <Lista rotulo="Tarefas ativas">
                {TAREFAS.map(([t, hora, quando, cor], i) => (
                  <ItemLista
                    key={t}
                    marcacao="caixa"
                    marcado={tarefasFeitas.includes(i)}
                    aoMarcar={(m) => setTarefasFeitas((xs) => (m ? [...xs, i] : xs.filter((x) => x !== i)))}
                    fim={
                      <>
                        <span>{hora}</span>
                        <Badge cor={cor} aparencia="suave" rotulo={quando} />
                      </>
                    }
                  >
                    {t}
                  </ItemLista>
                ))}
              </Lista>
            </Aba>
            <Aba valor="concluidas" rotulo="Concluídas" pendentes={tarefasFeitas.length}>
              <Lista rotulo="Tarefas concluídas">
                {tarefasFeitas.length ? (
                  tarefasFeitas.map((i) => (
                    <ItemLista key={i} icone="circle-check">
                      {TAREFAS[i][0]}
                    </ItemLista>
                  ))
                ) : (
                  <ItemLista>Nenhuma tarefa concluída.</ItemLista>
                )}
              </Lista>
            </Aba>
          </Abas>
        </Card>
        <Card titulo="Transações recentes" ferramentas={<MaisOpcoes rotulo="Transações recentes" />}>
          <Lista variante="sem-borda">
            {(
              [
                ['Compras', 'Cartão', -256.99, '12/03/2026', 'shopping-cart'],
                ['Bolsa de valores', 'Transferência', 18587, '10/03/2026', 'chart-line'],
                ['Mercado', 'Cartão', -256.99, '23/04/2026', 'package'],
                ['Livros', 'Cartão', -256.99, '18/03/2026', 'file-text'],
                ['Empresa', 'Transferência', 5746, '02/05/2026', 'briefcase'],
              ] as const
            ).map(([t, tipo, v, data, icone]) => (
              <ItemLista
                key={t}
                titulo={t}
                inicio={
                  <span className="demo-wid-tile">
                    <Icone icone={icone} />
                  </span>
                }
                fim={
                  <span className="demo-wid-transacao">
                    <strong className={v < 0 ? 'demo-wid-desce' : 'demo-wid-sobe'}>{(v < 0 ? '' : '+') + BRL.format(v)}</strong>
                    <span>{data}</span>
                  </span>
                }
              >
                {tipo}
              </ItemLista>
            ))}
          </Lista>
        </Card>
      </div>

      <div className="demo-wid-tres">
        <Card
          titulo="Status das tarefas"
          ferramentas={
            <MenuSuspenso
              rotulo="Semanal"
              tamanho="pequeno"
              aparencia="suave"
              formato="retangulo"
              alinhamento="fim"
              itens={[
                { id: 'semana', rotulo: 'Semanal', ativo: true },
                { id: 'mes', rotulo: 'Mensal' },
              ]}
            />
          }
        >
          <Lista variante="sem-borda">
            {(
              [
                [0, 'Novo design do site', 90, 'pri'],
                [1, 'Novo projeto de anúncios', 65, 'destaque'],
                [2, 'Novo design do site', 45, 'ok'],
                [3, 'Relatório de vendas', 75, 'info'],
                [4, 'Novo design do site', 55, 'warn'],
              ] as const
            ).map(([i, t, pct, cor]) => (
              <ItemLista key={i} titulo={PESSOAS[i].nome} inicio={<Avatar nome={PESSOAS[i].nome} foto={foto(i)} tamanho="2rem" />} fim={<span className="demo-wid-status">{pct}%</span>}>
                <span className="demo-wid-status-linha">
                  {t}
                  <Progresso valor={pct} cor={cor} altura="xs" rotulo={`${t}: ${pct}%`} />
                </span>
              </ItemLista>
            ))}
          </Lista>
        </Card>
        <Card titulo="Membros da equipe" ferramentas={<Botao rotulo="Ver todos" icone="arrow-right" posicaoIcone="direita" tamanho="pequeno" aparencia="suave" formato="retangulo" />}>
          <Lista variante="sem-borda">
            {PESSOAS.map((p, i) => (
              <ItemLista
                key={p.nome}
                titulo={p.nome}
                inicio={<Avatar nome={p.nome} foto={foto(i)} tamanho="2rem" />}
                fim={
                  <span className="demo-wid-membro">
                    <Badge cor="ok" aparencia="suave" icone="map-pin" rotulo={p.cidade} />
                    <Botao icone="message-square" dica="Mensagem" aria-label={`Mensagem para ${p.nome}`} tamanho="pequeno" aparencia="suave" severidade="destaque" formato="retangulo" />
                  </span>
                }
              >
                Olá, tudo bem?
              </ItemLista>
            ))}
          </Lista>
        </Card>
        <Card titulo="Novos candidatos" ferramentas={<Badge cor="pri" aparencia="suave" rotulo="Hoje" />}>
          <Lista variante="sem-borda">
            {['Desenvolvedor full-stack', 'Designer de interface', 'Líder de equipe', 'Gerente de produto', 'Desenvolvedor web'].map((vaga, i) => (
              <ItemLista key={vaga} titulo={PESSOAS[i].nome} inicio={<Avatar nome={PESSOAS[i].nome} foto={foto(i)} tamanho="2rem" />}>
                Candidatou-se a {vaga}
              </ItemLista>
            ))}
          </Lista>
        </Card>
      </div>

      <div className="demo-wid-tres">
        <Card titulo="Transferência rápida">
          <div className="demo-wid-transfer">
            <div className="demo-wid-transfer-pessoas" role="radiogroup" aria-label="Enviar para">
              {PESSOAS.map((p, i) => (
                <button
                  key={p.nome}
                  type="button"
                  role="radio"
                  aria-checked={destino === i}
                  aria-label={p.nome}
                  className={destino === i ? 'is-atual' : undefined}
                  onClick={() => setDestino(i)}
                >
                  <Avatar nome={p.nome} foto={foto(i)} tamanho="2.25rem" />
                </button>
              ))}
            </div>
            <CampoTexto rotulo={`Enviar para ${PESSOAS[destino].nome}`} valor={conta} aoMudar={setConta} sufixo={<Botao rotulo="Conferir" tamanho="pequeno" aparencia="texto" formato="retangulo" />} />
            <CampoMoeda rotulo="Valor" valor={valor} aoMudar={setValor} />
            <Botao
              rotulo="Transferir"
              icone="send"
              formato="retangulo"
              bloco
              onClick={() => toast.ok('Transferência enviada', `${BRL.format(valor ?? 0)} para ${PESSOAS[destino].nome}`)}
            />
          </div>
        </Card>
        <Card titulo="Candidatos recentes" subtitulo="Candidaturas e entrevistas na semana">
          <Barras
            rotulos={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            dados={[
              [42, 30],
              [40, 22],
              [56, 30],
              [84, 34],
              [56, 22],
              [44, 30],
              [70, 40],
            ]}
          />
          <div className="demo-wid-legenda">
            <span>
              <i className="demo-wid-ponto" style={{ background: 'var(--pri)' }} /> Candidaturas
            </span>
            <span>
              <i className="demo-wid-ponto" style={{ background: 'var(--border-2)' }} /> Entrevistas
            </span>
          </div>
        </Card>
        <Card titulo="Contato" subtitulo="Preencha o formulário e nossa equipe retorna.">
          <Lista variante="sem-borda">
            {(
              [
                ['phone', 'Telefone', '(11) 3123-5678', 'pri'],
                ['mail', 'E-mail', 'contato@exemplo.com', 'err'],
                ['clock', 'Horário', 'Seg a sex, 9h às 18h', 'ok'],
                ['map-pin', 'Endereço', 'Av. Paulista, 1000 · São Paulo', 'destaque'],
              ] as const
            ).map(([icone, titulo, texto, cor]) => (
              <ItemLista
                key={titulo}
                titulo={titulo}
                inicio={
                  <span className={`demo-wid-tile demo-wid-tile--${cor}`}>
                    <Icone icone={icone} />
                  </span>
                }
              >
                {texto}
              </ItemLista>
            ))}
          </Lista>
        </Card>
      </div>
    </div>
  );
}
