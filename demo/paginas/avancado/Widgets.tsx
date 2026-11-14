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
import { useT } from '../../i18n/useT';
import { rico } from '../../i18n/rico';

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
  const { t } = useT();
  return (
    <MenuSuspenso
      icone="ellipsis"
      semSeta
      aria-label={t('paginas.widgets.textos.opcoesDeRotulo', { rotulo })}
      aparencia="texto"
      severidade="secundario"
      tamanho="pequeno"
      alinhamento="fim"
      itens={[
        { id: 'semana', rotulo: t('paginas.widgets.textos.estaSemana') },
        { id: 'mes', rotulo: t('paginas.widgets.textos.esteMes') },
        { id: 'ano', rotulo: t('paginas.widgets.textos.esteAno') },
      ]}
    />
  );
}

/** Gráfico de barras simples em SVG (sem biblioteca de gráficos). */
function Barras({ dados, rotulos }: { dados: Array<[number, number]>; rotulos: string[] }) {
  const { t } = useT();
  const max = 100;
  const larg = 280;
  const alt = 150;
  const passo = larg / dados.length;
  return (
    <svg className="demo-wid-barras" viewBox={`0 0 ${larg} ${alt + 18}`} role="img" aria-label={t('paginas.widgets.textos.candidatosPorDiaDa')}>
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
  const { t, tc } = useT();
  const toast = useToast();
  const [tarefasFeitas, setTarefasFeitas] = useState<number[]>([1]);
  const [destino, setDestino] = useState(2);
  const [conta, setConta] = useState('11 96773-1611');
  const [valor, setValor] = useState<number | null>(2000);

  const TAREFAS: Array<[string, string, string, CorBadge]> = [
    [tc('Página de tarefas do novo modelo'), '12h43', tc('Hoje'), 'pri'],
    [tc('Corrigir a interface do novo modelo'), '11h25', tc('Amanhã'), 'destaque'],
    [tc('Preparar os requisitos'), '09h56', tc('Hoje'), 'pri'],
    [tc('Trocar o estilo do painel'), '08h15', tc('Hoje'), 'pri'],
    [tc('Atualizar o tema de cores'), '16h20', tc('Amanhã'), 'destaque'],
  ];

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.widgets.titulo')} icone="layout-grid" trilha />

      {/* ---- indicadores com variação ---- */}
      <Indicadores className="demo-wid-linha-ind">
        <Indicador rotulo={t('paginas.widgets.textos.produtos')} valor={45280} icone="package" cor="var(--pri)" variacao={1.31} />
        <Indicador rotulo={t('paginas.widgets.textos.pedidos')} valor={12088} icone="shopping-cart" cor="var(--err-solid)" variacao={-12.05} />
        <Indicador rotulo={t('paginas.widgets.textos.vendas')} valor={10500} icone="chart-line" cor="var(--info-solid)" variacao={1.14} />
        <Indicador rotulo={t('paginas.widgets.textos.receita')} valor={BRL.format(69270)} icone="wallet" cor="var(--acento)" variacao={2.58} />
        <Indicador rotulo={t('paginas.widgets.textos.despesas')} valor={BRL.format(21520)} icone="credit-card" cor="var(--ok-solid)" variacao={-14.69} variacaoBoa="baixa" />
      </Indicadores>

      <Indicadores>
        <Indicador rotulo={t('paginas.widgets.textos.projetos')} valor="676,90" icone="briefcase" cor="var(--info-solid)" variacao={105.05} descricao={t('paginas.widgets.textos.ha6Min')} />
        <Indicador rotulo={t('paginas.widgets.textos.projetosPendentes')} valor="406,90" icone="clock" cor="var(--err-solid)" variacao={-95.05} descricao={t('paginas.widgets.textos.ha30Min')} />
        <Indicador rotulo={t('paginas.widgets.textos.projetosNovos')} valor="716,80" icone="folder" cor="var(--acento)" variacao={6.43} descricao={t('paginas.widgets.textos.ha1H')} />
        <Indicador rotulo={t('paginas.widgets.textos.projetosConcluidos')} valor="536,80" icone="circle-check" cor="var(--ok-solid)" variacao={-396.03} descricao={t('paginas.widgets.textos.ha30Min')} />
      </Indicadores>

      <div className="demo-wid-grade-6">
        {(
          [
            [tc('Candidaturas'), 1123, 'users', 'var(--pri)', 1.26, 'alta'],
            [tc('Pré-selecionados'), 7123, 'user-plus', 'var(--err-solid)', 4.26, 'alta'],
            [tc('Contratados'), 8123, 'circle-check', 'var(--ok-solid)', 6.26, 'alta'],
            [tc('Recusados'), 8123, 'circle-x', 'var(--err-solid)', 9.26, 'baixa'],
            [tc('Localidades'), 5123, 'map-pin', 'var(--acento)', 0.86, 'alta'],
            [tc('Currículos enviados'), 5123, 'file-text', 'var(--info-solid)', 9.68, 'alta'],
          ] as const
        ).map(([rotulo, v, icone, cor, variacao, boa]) => (
          <Indicador key={rotulo} rotulo={rotulo} valor={v} icone={icone} cor={cor} variacao={variacao} variacaoBoa={boa} />
        ))}
      </div>

      {/* ---- metas ---- */}
      <div className="demo-wid-grade-4">
        {(
          [
            ['candidatos', tc('Total no processo seletivo.'), 2460, 2.5, 14, 'pri'],
            ['recrutadores', tc('Equipe ativa neste mês.'), 7539, 3.1, 55, 'destaque'],
            ['visualizacoes', tc('Páginas de vagas abertas.'), 13693, 5.4, 24, 'ok'],
            ['assinaturas', tc('Planos pagos ativos.'), 1116, -3.2, 67, 'info'],
          ] as const
        ).map(([id, desc, v, variacao, meta, cor]) => (
          <Card key={id} ferramentas={<MaisOpcoes rotulo={t(`paginas.widgets.secoes.${id}`)} />} titulo={t(`paginas.widgets.secoes.${id}`)} subtitulo={desc}>
            <div className="demo-wid-meta">
              {/* o título já está no cabeçalho do card: o rótulo do indicador fica só para leitor de tela */}
              <Indicador rotulo={t(`paginas.widgets.secoes.${id}`)} valor={v} variacao={variacao} className="demo-wid-sem-borda demo-wid-sem-rotulo" />
              <Progresso valor={meta} cor={cor as CorProgresso} altura="sm" rotulo={t('paginas.widgets.textos.metaDaMeta', { meta })} />
              <small>{t('paginas.widgets.textos.metaDaMeta', { meta })}</small>
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
                [tc('Produtos'), 45280, 'package', 1.31],
                [tc('Vendas'), 10500, 'chart-line', -1.14],
                [tc('Receita'), BRL.format(69270), 'wallet', 2.58],
                [tc('Pedidos'), 12088, 'shopping-cart', 12.05],
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
              <span>{t('paginas.widgets.textos.despesas')}</span>
            </div>
            <Badge cor="ok" rotulo="↑ 14,69%" />
          </div>
        </Card>
      </div>

      <div className="demo-wid-dois">
        <Card titulo={t('paginas.widgets.secoes.resumoRh')} subtitulo={t('paginas.widgets.textos.comparadoAoMesAnterior')}>
          <div className="demo-wid-mini-grade">
            {(
              [
                [tc('Funcionários'), 256, 'users', -1.05],
                [tc('Candidatos'), 4026, 'user-plus', 0.4],
                [tc('Localidades'), 48, 'map-pin', 0.82],
                [tc('Recrutadores'), 1116, 'briefcase', 0.21],
                [tc('Assinaturas'), 1468, 'bell', -0.153],
                [tc('Currículos/proporção'), '34%', 'file-text', 0.165],
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
          <Card cor="pri" titulo={t('paginas.widgets.secoes.recrutadoresPremium')} ferramentas={<Icone icone="chevron-right" />}>
            <div className="demo-wid-premium">
              <strong>9.231</strong>
              <span>
                <Icone icone="arrow-up" />{t('paginas.widgets.textos.t23DesdeO')}</span>
            </div>
          </Card>
          <Card>
            <div className="demo-wid-cripto">
              <span className="demo-wid-tile">
                <Icone icone="wallet" />
              </span>
              <div>{rico(t('paginas.widgets.textos.bitcoin'))}<span>{BRL.format(58151.02)}</span>
              </div>
              <div className="demo-wid-cripto-var">
                <Badge cor="ok" aparencia="suave" rotulo="↑ 2,14%" />
                <span>+{BRL.format(5745.62)}</span>
              </div>
            </div>
            <div className="demo-wid-cripto-acoes">
              <Botao rotulo={t('paginas.widgets.textos.vender')} severidade="secundario" aparencia="suave" formato="retangulo" bloco onClick={() => toast.info(t('paginas.widgets.textos.venda'), t('paginas.widgets.textos.simulacao'))} />
              <Botao rotulo={t('paginas.widgets.textos.comprar')} aparencia="suave" formato="retangulo" bloco onClick={() => toast.ok(t('paginas.widgets.textos.compra'), t('paginas.widgets.textos.simulacao'))} />
            </div>
          </Card>
        </div>
      </div>

      <div className="demo-wid-dois">
        <Card titulo={t('paginas.widgets.secoes.desempenhoEquipe')} rodape={<Botao rotulo={t('paginas.widgets.textos.verODesempenhoDe')} icone="arrow-right" posicaoIcone="direita" aparencia="texto" formato="retangulo" />}>
          <div className="demo-wid-equipe">
            <div>
              <Avatar nome={tc(PESSOAS[0].nome)} foto={foto(0)} tamanho="3.5rem" />
              <strong>{tc(PESSOAS[0].nome)}</strong>
              <span>{t('paginas.widgets.textos.melhorVendedora')}</span>
            </div>
            <div>
              <span className="demo-wid-tile">
                <Icone icone="shopping-cart" />
              </span>
              <strong>71.234</strong>
              <span>{t('paginas.widgets.textos.metasTotais')}</span>
            </div>
            <div>
              <span className="demo-wid-tile">
                <Icone icone="chart-column" />
              </span>
              <strong>66.450</strong>
              <span>{t('paginas.widgets.textos.vendasTotais')}</span>
            </div>
          </div>
        </Card>
        <Card titulo={t('paginas.widgets.secoes.vendasCategoria')}>
          <div className="demo-wid-categorias">
            <div>
              <span>{t('paginas.widgets.textos.vendasTotais')}</span>{rico(t('paginas.widgets.textos.t55283120Mil'))}</div>
            <Progresso
              altura="xl"
              mostrarValor="dentro"
              rotulo={t('paginas.widgets.textos.vendasPorCategoria')}
              segmentos={[
                { valor: 25, cor: 'pri', rotulo: t('paginas.widgets.textos.eletronicos') },
                { valor: 40, cor: 'destaque', rotulo: t('paginas.widgets.textos.casa') },
              ]}
            />
            <div className="demo-wid-legenda">
              <span>
                <i className="demo-wid-ponto" style={{ background: 'var(--pri)' }} />{t('paginas.widgets.textos.eletronicos2')}</span>
              <span>
                <i className="demo-wid-ponto" style={{ background: 'var(--acento)' }} />{t('paginas.widgets.textos.casa2')}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card titulo={t('paginas.widgets.secoes.principaisOrigens')} ferramentas={<MaisOpcoes rotulo={t('paginas.widgets.textos.principaisOrigens')} />} corpoSemEspaco>
        <table className="demo-wid-tabela">
          <thead>
            <tr>
              <th>{t('paginas.widgets.textos.navegador')}</th>
              <th>{t('paginas.widgets.textos.visualizacoes')}</th>
              <th>{t('paginas.widgets.textos.participacao')}</th>
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
        <Card titulo={t('paginas.widgets.secoes.listaTarefas')} ferramentas={<Botao rotulo={t('paginas.widgets.textos.novaTarefa')} icone="plus" tamanho="pequeno" aparencia="suave" formato="retangulo" />}>
          <Abas variante="suave" rotulo={t('paginas.widgets.textos.tarefas')}>
            <Aba valor="ativas" rotulo={t('paginas.widgets.textos.ativas')}>
              <Lista rotulo={t('paginas.widgets.textos.tarefasAtivas')}>
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
            <Aba valor="concluidas" rotulo={t('paginas.widgets.textos.concluidas')} pendentes={tarefasFeitas.length}>
              <Lista rotulo={t('paginas.widgets.textos.tarefasConcluidas')}>
                {tarefasFeitas.length ? (
                  tarefasFeitas.map((i) => (
                    <ItemLista key={i} icone="circle-check">
                      {TAREFAS[i][0]}
                    </ItemLista>
                  ))
                ) : (
                  <ItemLista>{t('paginas.widgets.textos.nenhumaTarefaConcluida')}</ItemLista>
                )}
              </Lista>
            </Aba>
          </Abas>
        </Card>
        <Card titulo={t('paginas.widgets.secoes.transacoesRecentes')} ferramentas={<MaisOpcoes rotulo={t('paginas.widgets.textos.transacoesRecentes')} />}>
          <Lista variante="sem-borda">
            {(
              [
                [tc('Compras'), tc('Cartão'), -256.99, '12/03/2026', 'shopping-cart'],
                [tc('Bolsa de valores'), tc('Transferência'), 18587, '10/03/2026', 'chart-line'],
                [tc('Mercado'), tc('Cartão'), -256.99, '23/04/2026', 'package'],
                [tc('Livros'), tc('Cartão'), -256.99, '18/03/2026', 'file-text'],
                [tc('Empresa'), tc('Transferência'), 5746, '02/05/2026', 'briefcase'],
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
          titulo={t('paginas.widgets.secoes.statusTarefas')}
          ferramentas={
            <MenuSuspenso
              rotulo={t('paginas.widgets.textos.semanal')}
              tamanho="pequeno"
              aparencia="suave"
              formato="retangulo"
              alinhamento="fim"
              itens={[
                { id: 'semana', rotulo: t('paginas.widgets.textos.semanal'), ativo: true },
                { id: 'mes', rotulo: t('paginas.widgets.textos.mensal') },
              ]}
            />
          }
        >
          <Lista variante="sem-borda">
            {(
              [
                [0, tc('Novo design do site'), 90, 'pri'],
                [1, tc('Novo projeto de anúncios'), 65, 'destaque'],
                [2, tc('Novo design do site'), 45, 'ok'],
                [3, tc('Relatório de vendas'), 75, 'info'],
                [4, tc('Novo design do site'), 55, 'warn'],
              ] as const
            ).map(([i, t, pct, cor]) => (
              <ItemLista key={i} titulo={tc(PESSOAS[i].nome)} inicio={<Avatar nome={tc(PESSOAS[i].nome)} foto={foto(i)} tamanho="2rem" />} fim={<span className="demo-wid-status">{pct}%</span>}>
                <span className="demo-wid-status-linha">
                  {t}
                  <Progresso valor={pct} cor={cor} altura="xs" rotulo={`${t}: ${pct}%`} />
                </span>
              </ItemLista>
            ))}
          </Lista>
        </Card>
        <Card titulo={t('paginas.widgets.secoes.membrosEquipe')} ferramentas={<Botao rotulo={t('paginas.widgets.textos.verTodos')} icone="arrow-right" posicaoIcone="direita" tamanho="pequeno" aparencia="suave" formato="retangulo" />}>
          <Lista variante="sem-borda">
            {PESSOAS.map((p, i) => (
              <ItemLista
                key={p.nome}
                titulo={tc(p.nome)}
                inicio={<Avatar nome={tc(p.nome)} foto={foto(i)} tamanho="2rem" />}
                fim={
                  <span className="demo-wid-membro">
                    <Badge cor="ok" aparencia="suave" icone="map-pin" rotulo={p.cidade} />
                    <Botao icone="message-square" dica={t('paginas.widgets.textos.mensagem')} aria-label={t('paginas.widgets.textos.mensagemParaNome', { nome: p.nome })} tamanho="pequeno" aparencia="suave" severidade="destaque" formato="retangulo" />
                  </span>
                }
              >{t('paginas.widgets.textos.olaTudoBem')}</ItemLista>
            ))}
          </Lista>
        </Card>
        <Card titulo={t('paginas.widgets.secoes.novosCandidatos')} ferramentas={<Badge cor="pri" aparencia="suave" rotulo={t('paginas.widgets.textos.hoje')} />}>
          <Lista variante="sem-borda">
            {[tc('Desenvolvedor full-stack'), tc('Designer de interface'), tc('Líder de equipe'), tc('Gerente de produto'), tc('Desenvolvedor web')].map((vaga, i) => (
              <ItemLista key={vaga} titulo={tc(PESSOAS[i].nome)} inicio={<Avatar nome={tc(PESSOAS[i].nome)} foto={foto(i)} tamanho="2rem" />}>{t('paginas.widgets.textos.candidatouSeAVaga', { vaga })}</ItemLista>
            ))}
          </Lista>
        </Card>
      </div>

      <div className="demo-wid-tres">
        <Card titulo={t('paginas.widgets.secoes.transferenciaRapida')}>
          <div className="demo-wid-transfer">
            <div className="demo-wid-transfer-pessoas" role="radiogroup" aria-label={t('paginas.widgets.textos.enviarPara')}>
              {PESSOAS.map((p, i) => (
                <button
                  key={p.nome}
                  type="button"
                  role="radio"
                  aria-checked={destino === i}
                  aria-label={tc(p.nome)}
                  className={destino === i ? 'is-atual' : undefined}
                  onClick={() => setDestino(i)}
                >
                  <Avatar nome={tc(p.nome)} foto={foto(i)} tamanho="2.25rem" />
                </button>
              ))}
            </div>
            <CampoTexto rotulo={t('paginas.widgets.textos.enviarParaNome', { nome: PESSOAS[destino].nome })} valor={conta} aoMudar={setConta} sufixo={<Botao rotulo={t('paginas.widgets.textos.conferir')} tamanho="pequeno" aparencia="texto" formato="retangulo" />} />
            <CampoMoeda rotulo={t('paginas.widgets.textos.valor')} valor={valor} aoMudar={setValor} />
            <Botao
              rotulo={t('paginas.widgets.textos.transferir')}
              icone="send"
              formato="retangulo"
              bloco
              onClick={() => toast.ok(t('paginas.widgets.textos.transferenciaEnviada'), t('paginas.widgets.textos.valorParaNome', { valor: BRL.format(valor ?? 0), nome: PESSOAS[destino].nome }))}
            />
          </div>
        </Card>
        <Card titulo={t('paginas.widgets.secoes.candidatosRecentes')} subtitulo={t('paginas.widgets.textos.candidaturasEEntrevistasNa')}>
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
              <i className="demo-wid-ponto" style={{ background: 'var(--pri)' }} />{t('paginas.widgets.textos.candidaturas')}</span>
            <span>
              <i className="demo-wid-ponto" style={{ background: 'var(--border-2)' }} />{t('paginas.widgets.textos.entrevistas')}</span>
          </div>
        </Card>
        <Card titulo={t('paginas.widgets.secoes.contato')} subtitulo={t('paginas.widgets.textos.preenchaOFormularioE')}>
          <Lista variante="sem-borda">
            {(
              [
                ['phone', tc('Telefone'), '(11) 3123-5678', 'pri'],
                ['mail', tc('E-mail'), 'contato@exemplo.com', 'err'],
                ['clock', tc('Horário'), tc('Seg a sex, 9h às 18h'), 'ok'],
                ['map-pin', tc('Endereço'), 'Av. Paulista, 1000 · São Paulo', 'destaque'],
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
