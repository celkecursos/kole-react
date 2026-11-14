import { useState, type ReactNode } from 'react';
import {
  AcaoLinha,
  Avatar,
  Badge,
  Botao,
  CabecalhoPagina,
  Card,
  Detalhes,
  Escolha,
  GrupoAlternancia,
  GrupoCards,
  Icone,
  ListaCards,
  Placa,
  Status,
  useToast,
  type CorCard,
} from '../../../src';
import { cena, retrato } from '../Bloco';
import { useT, type TradutorDemo } from '../../i18n/useT';
import { rico } from '../../i18n/rico';

const IMG = {
  mar: cena('#1f5fe0', '#0b1a36'),
  tarde: cena('#f7931e', '#7a2e0e', '#fff3c4'),
  campo: cena('#4fb3e8', '#15803d'),
  noite: cena('#0b1a36', '#1f2a44', '#e8eef8'),
  rosa: cena('#e879a6', '#5b2140'),
  deserto: cena('#f2c86b', '#a85d1e', '#fff8e1'),
};

function Imagem({ src, altura = '10rem' }: { src: string; altura?: string }) {
  return <img src={src} alt="" style={{ height: altura }} />;
}

const LOREM = 'Acompanhe pedidos, pagamentos e entregas num só lugar, com os números reais da operação.';

/** Título de seção da página (fora de card), como no Velvet. */
function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="demo-secao-cards">
      <h2 className="demo-secao-titulo">{titulo}</h2>
      {children}
    </section>
  );
}

const PESSOAS = (t: TradutorDemo['t']) => ([
  [t('paginas.cards.textos.anaPereira2'), '#1f5fe0', t('paginas.cards.textos.finalizaHoje')],
  [t('paginas.cards.textos.brunoLima'), '#f7931e', t('paginas.cards.textos.concluidoHa2Dias')],
  [t('paginas.cards.textos.carlaDias'), '#15803d', t('paginas.cards.textos.concluidoHoje')],
  [t('paginas.cards.textos.danielMoreira'), '#0b72aa', t('paginas.cards.textos.pendenteHa4Dias')],
  [t('paginas.cards.textos.eduardaMartins'), '#b45309', t('paginas.cards.textos.emFeriasAteSexta')],
  [t('paginas.cards.textos.fabioAndrade'), '#b42318', t('paginas.cards.textos.concluidoAmanha')],
  [t('paginas.cards.textos.gabrielaRocha'), '#55627a', t('paginas.cards.textos.finalizaDia24')],
  [t('paginas.cards.textos.henriqueAlves'), '#0e1726', t('paginas.cards.textos.concluidoDia24')],
] as const);
const CORES_CARD: CorCard[] = ['pri', 'destaque', 'warn', 'info', 'ok', 'err', 'neutral', 'neutral'];

interface Veiculo {
  id: number;
  placa: string;
  uf: string;
  modelo: string;
  cor: string;
  ano: number;
  situacao: 'Regular' | 'Licenciamento vencido' | 'Em manutenção';
  proprietario: string;
}

const VEICULOS: Veiculo[] = ([
  { id: 1, placa: 'QBX-7H42', uf: 'PR', modelo: 'Fiat Strada', cor: 'Branca', ano: 2022, situacao: 'Regular', proprietario: 'Ana Pereira' },
  { id: 2, placa: 'NJU-4021', uf: 'PR', modelo: 'Toyota Hilux', cor: 'Prata', ano: 2018, situacao: 'Licenciamento vencido', proprietario: 'Bruno Lima' },
  { id: 3, placa: 'RTA-2B19', uf: 'GO', modelo: 'VW Gol', cor: 'Vermelha', ano: 2020, situacao: 'Em manutenção', proprietario: 'Carla Dias' },
  { id: 4, placa: 'QCD-9E07', uf: 'PR', modelo: 'Honda CG 160', cor: 'Preta', ano: 2023, situacao: 'Regular', proprietario: 'Daniel Moreira' },
  { id: 5, placa: 'OAK-3311', uf: 'MS', modelo: 'Chevrolet Onix', cor: 'Cinza', ano: 2019, situacao: 'Regular', proprietario: 'Eduarda Martins' },
  { id: 6, placa: 'QBZ-1F88', uf: 'PR', modelo: 'Renault Duster', cor: 'Azul', ano: 2021, situacao: 'Licenciamento vencido', proprietario: 'Fábio Andrade' },
]);

/** A situação é a chave (severidade, filtros); o texto mostrado vem do dicionário. */
const rotuloSituacao = (t: TradutorDemo['t'], s: Veiculo['situacao']) =>
  ({ Regular: t('paginas.cards.textos.regular'), 'Licenciamento vencido': t('paginas.cards.textos.licenciamentoVencido'), 'Em manutenção': t('paginas.cards.textos.emManutencao') })[s];

const SEV_VEICULO = { Regular: 'ok', 'Licenciamento vencido': 'err', 'Em manutenção': 'warn' } as const;

export function PaginaCards() {
  const { t: tx, tc } = useT();
  const { t } = useT();
  const toast = useToast();
  const [estadoLista, setEstadoLista] = useState('normal');
  const [aba, setAba] = useState<string | null>('ativo');

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.cards.titulo')} icone="layers" trilha />

      <div className="demo-cards-4">
        <Card midia={<Imagem src={IMG.mar} />} rodape={<span className="demo-cards-mudo">{t('paginas.cards.textos.atualizadoHa3Minutos')}</span>}>
          <div className="demo-card-titulo">{t('paginas.cards.textos.tituloDoCard')}</div>
          <p className="demo-cards-texto">{tc(LOREM)}</p>
          <Botao rotulo={t('paginas.cards.textos.verMais')} formato="retangulo" />
        </Card>
        <div className="demo-pilha">
          <Card titulo={t('paginas.cards.secoes.destaque')}>
            <div className="demo-card-titulo">{t('paginas.cards.textos.tratamentoEspecialDoTitulo')}</div>
            <p className="demo-cards-texto">{tc(LOREM)}</p>
            <Botao rotulo={t('paginas.cards.textos.verMais')} formato="retangulo" />
          </Card>
          <Card
            rodape={
              <div className="demo-linha">
                <a className="demo-cards-link" href="#/pedidos">{t('paginas.cards.textos.comprarAgora')}</a>
                <a className="demo-cards-link" href="#/ui/cards">{t('paginas.cards.textos.avaliacoes')}</a>
              </div>
            }
          >
            <div className="demo-card-titulo" style={{ marginBottom: 0 }}>{t('paginas.cards.textos.tituloDoCard')}</div>
            <div className="demo-cards-mudo" style={{ marginBottom: '0.5rem' }}>{t('paginas.cards.textos.subtituloDoCard')}</div>
            <p className="demo-cards-texto">{tc(LOREM)}</p>
          </Card>
        </div>
        <div className="demo-pilha">
          <Card midia={<Imagem src={IMG.rosa} />}>
            <p className="demo-cards-texto">{t('paginas.cards.textos.umTextoCurtoDe')}</p>
          </Card>
          <div className="demo-secao-titulo">{t('paginas.cards.textos.soCorpo')}</div>
          <Card>
            <p className="demo-cards-texto">{t('paginas.cards.textos.umCardSoCom')}</p>
          </Card>
        </div>
        <Card
          midia={<Imagem src={IMG.tarde} />}
          corpoSemEspaco
          rodape={
            <div className="demo-linha">
              <a className="demo-cards-link" href="#/ui/cards">{t('paginas.cards.textos.linkDoCard')}</a>
              <a className="demo-cards-link demo-cards-link--destaque" href="#/ui/cards">{t('paginas.cards.textos.outroLink')}</a>
            </div>
          }
        >
          <div className="demo-cards-pad">
            <div className="demo-card-titulo">{t('paginas.cards.textos.tituloDoCard')}</div>
            <p className="demo-cards-texto">{t('paginas.cards.textos.umTextoDeExemplo')}</p>
          </div>
          <ul className="demo-cards-lista">
            <li>{t('paginas.cards.textos.umItem')}</li>
            <li>{t('paginas.cards.textos.umSegundoItem')}</li>
          </ul>
        </Card>
      </div>

      <div className="demo-cards-alinha">
        <Secao titulo={t('paginas.cards.secoes.alinhamentoDoTexto')}>
          <div className="demo-cards-3">
            {(['esquerda', 'centro', 'direita'] as const).map((a, i) => (
              <Card key={a} alinhamento={a}>
                <div className="demo-cards-avatar" style={{ justifyContent: a === 'centro' ? 'center' : a === 'direita' ? 'flex-end' : 'flex-start' }}>
                  <Avatar nome={PESSOAS(t)[i][0]} foto={retrato(PESSOAS(t)[i][1], PESSOAS(t)[i][0][0])} formato="quadrado" tamanho="2rem" />
                </div>
                <div className="demo-card-titulo">{[tc('De onde vem'), tc('Por que usar?'), tc('O que tem de especial?')][i]}</div>
                <p className="demo-cards-texto">{tc(LOREM)}</p>
                <Botao rotulo={t('paginas.cards.textos.abrir')} formato="retangulo" />
              </Card>
            ))}
          </div>
        </Secao>
        <Secao titulo={t('paginas.cards.secoes.bordaColorida')}>
          <Card borda="ok" titulo={t('paginas.cards.secoes.cabecalho')} rodape={<span className="demo-cards-mudo">{t('paginas.cards.textos.rodape')}</span>}>
            <div className="demo-card-titulo" style={{ color: 'var(--ok-fg)' }}>{t('paginas.cards.textos.procurandoResultado')}</div>
            <p className="demo-cards-texto" style={{ color: 'var(--ok-fg)' }}>
              {tc(LOREM)}
            </p>
          </Card>
        </Secao>
      </div>

      <div className="demo-colunas">
        <div className="demo-pilha">
          <Secao titulo={t('paginas.cards.secoes.citacao')}>
            <Card alinhamento="centro">
              <blockquote className="demo-cards-citacao">
                <p>{t('paginas.cards.textos.aMaiorGloriaDa')}</p>
                <footer>{t('paginas.cards.textos.alguemFamosoEm')}<cite>{t('paginas.cards.textos.fonteDoTexto')}</cite></footer>
              </blockquote>
            </Card>
          </Secao>
          <Secao titulo={t('paginas.cards.secoes.grupoDeLista')}>
            <div className="demo-cards-3">
              <Card corpoSemEspaco>
                <ul className="demo-cards-lista">
                  <li>{t('paginas.cards.textos.umItem')}</li>
                  <li>{t('paginas.cards.textos.umSegundoItem')}</li>
                  <li>{t('paginas.cards.textos.umTerceiroItem')}</li>
                  <li>{t('paginas.cards.textos.umQuartoItem')}</li>
                </ul>
              </Card>
              <Card titulo={t('paginas.cards.secoes.destaque')} corpoSemEspaco>
                <ul className="demo-cards-lista">
                  <li>{t('paginas.cards.textos.umItem')}</li>
                  <li>{t('paginas.cards.textos.umSegundoItem')}</li>
                  <li>{t('paginas.cards.textos.umTerceiroItem')}</li>
                </ul>
              </Card>
              <Card corpoSemEspaco rodape={<span className="demo-cards-mudo">{t('paginas.cards.textos.rodapeDoCard')}</span>}>
                <ul className="demo-cards-lista">
                  <li>{t('paginas.cards.textos.umItem')}</li>
                  <li>{t('paginas.cards.textos.umSegundoItem')}</li>
                  <li>{t('paginas.cards.textos.umTerceiroItem')}</li>
                </ul>
              </Card>
            </div>
          </Secao>
        </div>
        <Secao titulo={t('paginas.cards.secoes.gradeDeProdutos')}>
          <div className="demo-cards-3">
            {(
              [
                [tc('Produto A'), IMG.noite, 'pri'],
                [tc('Produto B'), IMG.deserto, 'destaque'],
                [tc('Produto C'), IMG.campo, 'secundario'],
              ] as const
            ).map(([nome, img, cor]) => (
              <Card key={nome}>
                <div className="demo-cards-thumb">
                  <img src={img} alt="" />
                </div>
                <div className="demo-card-titulo">{nome}</div>
                <p className="demo-cards-texto">{t('paginas.cards.textos.textoDeApoioAbaixo')}</p>
                <Botao rotulo={t('paginas.cards.textos.comprar')} severidade={cor} formato="retangulo" onClick={() => toast.ok(t('paginas.cards.textos.nomeNoCarrinho', { nome }))} />
              </Card>
            ))}
          </div>
        </Secao>
      </div>

      <Secao titulo={t('paginas.cards.secoes.cabecalhoERodape')}>
        <div className="demo-cards-4">
          <Card
            titulo={
              <span className="demo-cards-pessoa">
                <Avatar nome="Ana Pereira" foto={retrato('#1f5fe0', 'A')} tamanho="2.25rem" />
                <span>
                  Ana Pereira
                  <span className="demo-cards-mudo">{tc('Gerente comercial')}</span>
                </span>
              </span>
            }
            ferramentas={<Botao icone="ellipsis-vertical" severidade="secundario" aparencia="suave" tamanho="pequeno" formato="retangulo" dica={t('paginas.cards.textos.mais')} aria-label={t('paginas.cards.textos.maisOpcoes')} />}
            rodape={
              <div className="demo-linha" style={{ justifyContent: 'space-between' }}>
                <span className="demo-cards-mudo">{t('paginas.cards.textos.t28Nov2026')}</span>
                <span style={{ color: 'var(--ok-fg)', fontWeight: 700, fontSize: 'var(--fs-caption)' }}>{t('paginas.cards.textos.gerenteComercial')}</span>
              </div>
            }
          >
            <p className="demo-cards-texto">{tc(LOREM)}</p>
          </Card>
          <Card
            rodape={
              <span className="demo-cards-pessoa">
                <Avatar nome="Bruno Lima" foto={retrato('#f7931e', 'B')} tamanho="1.75rem" />{t('paginas.cards.textos.brunoLima')}</span>
            }
          >
            <div className="demo-cards-estrelas" aria-label={t('paginas.cards.textos.t4De5Estrelas')}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Icone key={n} icone="star" className={n <= 4 ? 'is-on' : undefined} />
              ))}
            </div>
            <div className="demo-cards-mudo">{t('paginas.cards.textos.ha1Ano')}</div>
            <div className="demo-card-titulo" style={{ marginTop: '0.5rem' }}>{t('paginas.cards.textos.muitoBom')}</div>
            <p className="demo-cards-texto">{t('paginas.cards.textos.entregaRapidaEO')}</p>
          </Card>
          <Card alinhamento="centro" acoes={<Botao icone="heart" severidade="err" aparencia="texto" tamanho="pequeno" dica={t('paginas.cards.textos.favoritar')} aria-label={t('paginas.cards.textos.favoritar')} />}>
            <div className="demo-cards-avatar" style={{ justifyContent: 'center' }}>
              <Avatar nome="Carla Dias" foto={retrato('#15803d', 'C')} tamanho="3.5rem" />
            </div>
            <div className="demo-card-titulo" style={{ marginBottom: 0 }}>{t('paginas.cards.textos.carlaDias')}</div>
            <div className="demo-cards-mudo">{t('paginas.cards.textos.vendedora')}</div>
            <div className="demo-linha" style={{ justifyContent: 'center', marginTop: '0.75rem' }}>
              <Botao icone="mail" severidade="pri" formato="retangulo" tamanho="pequeno" dica={t('paginas.cards.textos.eMail')} aria-label={t('paginas.cards.textos.eMail')} />
              <Botao icone="phone" severidade="info" formato="retangulo" tamanho="pequeno" dica={t('paginas.cards.textos.telefone')} aria-label={t('paginas.cards.textos.telefone')} />
              <Botao icone="message-square" severidade="destaque" formato="retangulo" tamanho="pequeno" dica={t('paginas.cards.textos.mensagem')} aria-label={t('paginas.cards.textos.mensagem')} />
            </div>
          </Card>
          <Card borda="pri" rodape={<span className="demo-cards-mudo">{t('paginas.cards.textos.atualizadoHoje')}</span>}>
            <span className="demo-cards-icone-grande">
              <Icone icone="calculator" />
            </span>
            <div className="demo-card-titulo" style={{ fontSize: 'var(--fs-titulo)' }}>{t('paginas.cards.textos.calculos')}</div>
            <p className="demo-cards-texto">{t('paginas.cards.textos.totaisDescontosEFrete')}</p>
          </Card>
        </div>
      </Secao>

      <div className="demo-cards-5">
        {(
          [
            [tc('Montanhas'), IMG.rosa, tc('Novo'), 'pri'],
            [tc('Morros'), IMG.tarde, tc('Promoção'), 'destaque'],
            [tc('Natureza'), IMG.campo, tc('Oferta'), 'neutral'],
          ] as const
        ).map(([nome, img, selo, cor]) => (
          <Card key={nome}>
            <div className="demo-cards-thumb">
              <img src={img} alt="" />
            </div>
            <div className="demo-linha" style={{ justifyContent: 'space-between', margin: '0.625rem 0 0.25rem' }}>
              <span className="demo-card-titulo" style={{ margin: 0 }}>
                {nome}
              </span>
              <Badge cor={cor} aparencia={cor === 'neutral' ? 'suave' : 'solido'} formato="pilula" rotulo={selo} />
            </div>
            <p className="demo-cards-texto">{t('paginas.cards.textos.textoDeApoioComo')}</p>
          </Card>
        ))}
        <Card titulo={t('paginas.cards.secoes.destaque')} alinhamento="centro" rodape={<span className="demo-cards-mudo">11:32</span>}>
          <div className="demo-card-titulo">{t('paginas.cards.textos.noticiaUrgente')}</div>
          <p className="demo-cards-texto">{t('paginas.cards.textos.textoDeApoioComo2')}</p>
          <div className="demo-linha" style={{ justifyContent: 'center' }}>
            <Botao rotulo={t('paginas.cards.textos.verMais')} formato="retangulo" />
            <Botao rotulo={t('paginas.cards.textos.fechar')} severidade="destaque" aparencia="contorno" formato="retangulo" />
          </div>
        </Card>
        <Card corpoSemEspaco>
          <div className="demo-cards-perfil">
            <Avatar nome="Daniel Moreira" foto={retrato('#0b72aa', 'D')} tamanho="3rem" />
            <dl className="demo-cards-numeros">
              <div>
                <dt>{t('paginas.cards.textos.pedidos')}</dt>
                <dd>25</dd>
              </div>
              <div>
                <dt>{t('paginas.cards.textos.clientes')}</dt>
                <dd>1.253</dd>
              </div>
              <div>
                <dt>{t('paginas.cards.textos.metas')}</dt>
                <dd>367</dd>
              </div>
            </dl>
          </div>
          <div className="demo-cards-pad">
            <div className="demo-card-titulo" style={{ marginBottom: 0 }}>{t('paginas.cards.textos.danielMoreira')}</div>
            <div className="demo-cards-mudo">{t('paginas.cards.textos.analistaComercial')}</div>
            <div className="demo-card-titulo" style={{ margin: '0.75rem 0 0.25rem', fontSize: 'var(--fs-corpo)' }}>{t('paginas.cards.textos.sobre')}</div>
            <p className="demo-cards-texto">{t('paginas.cards.textos.atendeOsClientesDa')}</p>
          </div>
        </Card>
      </div>

      <div className="demo-cards-3">
        <Card titulo={t('paginas.cards.secoes.comRecolher')} recolhivel rodape={<Botao rotulo={t('paginas.cards.textos.verMais')} formato="retangulo" />}>
          <div className="demo-card-titulo">{t('paginas.cards.textos.cardRecolhivel')}</div>
          <p className="demo-cards-texto">{tc(LOREM)}</p>
        </Card>
        <Card titulo={t('paginas.cards.secoes.comFechar')} dispensavel aoFechar={() => toast.info(t('paginas.cards.textos.cardFechado'))} rodape={<Botao rotulo={t('paginas.cards.textos.verMais')} formato="retangulo" />}>
          <div className="demo-card-titulo">{t('paginas.cards.textos.cardQueFecha')}</div>
          <p className="demo-cards-texto">{tc(LOREM)}</p>
        </Card>
        <Card titulo={t('paginas.cards.secoes.comTelaCheia')} telaCheia rodape={<Botao rotulo={t('paginas.cards.textos.verMais')} formato="retangulo" />}>
          <div className="demo-card-titulo">{t('paginas.cards.textos.cardEmTelaCheia')}</div>
          <p className="demo-cards-texto">{t('paginas.cards.textos.loremPressioneEscPara', { LOREM })}</p>
        </Card>
      </div>

      <Secao titulo={t('paginas.cards.secoes.posicaoDaImagem')}>
        <div className="demo-cards-3">
          <Card midia={<Imagem src={IMG.deserto} altura="12rem" />} rodape={<span className="demo-cards-mudo">{t('paginas.cards.textos.atualizadoHa3Minutos')}</span>}>
            <div className="demo-card-titulo">{t('paginas.cards.textos.imagemNoTopo')}</div>
            <p className="demo-cards-texto">{tc(LOREM)}</p>
          </Card>
          <Card midia={<Imagem src={IMG.campo} altura="12rem" />} posicaoMidia="base">
            <div className="demo-card-titulo">{t('paginas.cards.textos.imagemEmbaixo')}</div>
            <p className="demo-cards-texto">{tc(LOREM)}</p>
            <span className="demo-cards-mudo">{t('paginas.cards.textos.atualizadoHa3Minutos')}</span>
          </Card>
          <Card titulo={t('paginas.cards.secoes.comCabecalho')} midia={<Imagem src={IMG.mar} altura="12rem" />} posicaoMidia="base" rodape={<span className="demo-cards-mudo">{t('paginas.cards.textos.atualizadoHa3Minutos')}</span>}>
            <p className="demo-cards-texto">{tc(LOREM)}</p>
          </Card>
        </div>
      </Secao>

      <Secao titulo={t('paginas.cards.secoes.textoSobreAImagem')}>
        <div className="demo-cards-3">
          <Card midia={<img src={IMG.mar} alt="" />} posicaoMidia="fundo" titulo={t('paginas.cards.secoes.imagensSobrepostas')}>
            <p className="demo-cards-texto">{tc(LOREM)}</p>
            <span className="demo-cards-mudo-claro">{t('paginas.cards.textos.atualizadoHa3Minutos')}</span>
          </Card>
          <Card midia={<img src={IMG.campo} alt="" />} posicaoMidia="fundo" rodape={<span className="demo-cards-mudo-claro">{t('paginas.cards.textos.atualizadoHa3Minutos')}</span>}>
            <div className="demo-card-titulo">{t('paginas.cards.textos.imagensSobrepostasSaoOtimas')}</div>
            <p className="demo-cards-texto">{tc(LOREM)}</p>
          </Card>
          <Card midia={<img src={IMG.noite} alt="" />} posicaoMidia="fundo" titulo={t('paginas.cards.secoes.comCabecalhoRodape')} rodape={<span className="demo-cards-mudo-claro">{t('paginas.cards.textos.atualizadoHa3Minutos')}</span>}>
            <p className="demo-cards-texto">{tc(LOREM)}</p>
          </Card>
        </div>
      </Secao>

      <div className="demo-colunas">
        <Secao titulo={t('paginas.cards.secoes.larguras')}>
          <div className="demo-linha" style={{ alignItems: 'stretch' }}>
            <Card titulo={t('paginas.cards.secoes.largura75')} style={{ width: '38%' }} rodape={<Botao rotulo={t('paginas.cards.textos.botao')} bloco formato="retangulo" />}>
              <p className="demo-cards-texto">{t('paginas.cards.textos.larguraDefinidaPorStyle')}</p>
            </Card>
            <Card titulo={t('paginas.cards.secoes.largura50')} style={{ width: '26%' }} rodape={<Botao rotulo={t('paginas.cards.textos.botao')} formato="retangulo" />}>
              <p className="demo-cards-texto">{t('paginas.cards.textos.maisEstreito')}</p>
            </Card>
          </div>
        </Secao>
        <Secao titulo={t('paginas.cards.secoes.navegacao')}>
          <div className="demo-cards-2">
            {(['secundario', 'pri'] as const).map((cor) => (
              <Card
                key={cor}
                alinhamento="centro"
                titulo={
                  <GrupoAlternancia
                    rotulo={tc("Abas do card")}
                    severidade={cor}
                    aparencia="texto"
                    tamanho="pequeno"
                    formato="retangulo"
                    opcoes={[
                      { valor: 'ativo', rotulo: tc('Ativo') },
                      { valor: 'link', rotulo: tc('Link') },
                      { valor: 'off', rotulo: tc('Desativado'), desabilitada: true },
                    ]}
                    valor={aba}
                    aoMudar={setAba}
                  />
                }
              >
                <div className="demo-card-titulo">{t('paginas.cards.textos.tratamentoEspecialDoTitulo')}</div>
                <p className="demo-cards-texto">{t('paginas.cards.textos.textoDeApoioComo')}</p>
                <Botao rotulo={t('paginas.cards.textos.abrir')} formato="retangulo" />
              </Card>
            ))}
          </div>
        </Secao>
      </div>

      <Secao titulo={t('paginas.cards.secoes.cardsHorizontais')}>
        <div className="demo-cards-3">
          <Card midia={<img src={IMG.tarde} alt="" />} posicaoMidia="esquerda" titulo={t('paginas.cards.secoes.horizontais')} rodape={<span className="demo-cards-mudo">{t('paginas.cards.textos.atualizadoHa3Minutos')}</span>}>
            <div className="demo-card-titulo">{t('paginas.cards.textos.cardsHorizontaisSaoOtimos')}</div>
            <p className="demo-cards-texto">{t('paginas.cards.textos.umCardMaisLargo')}</p>
          </Card>
          <Card midia={<img src={IMG.mar} alt="" />} posicaoMidia="direita" titulo={t('paginas.cards.secoes.horizontais')} rodape={<span className="demo-cards-mudo">{t('paginas.cards.textos.atualizadoHa3Minutos')}</span>}>
            <div className="demo-card-titulo">{t('paginas.cards.textos.cardsHorizontaisSaoOtimos')}</div>
            <p className="demo-cards-texto">{t('paginas.cards.textos.umCardMaisLargo2')}</p>
          </Card>
          <Card midia={<img src={IMG.deserto} alt="" />} posicaoMidia="direita" rodape={<span className="demo-cards-mudo">{t('paginas.cards.textos.atualizadoHa3Minutos')}</span>}>
            <div className="demo-card-titulo" style={{ marginBottom: 0 }}>{t('paginas.cards.textos.cardsHorizontais')}</div>
            <div className="demo-cards-mudo" style={{ marginBottom: '0.5rem' }}>{t('paginas.cards.textos.saoOtimos')}</div>
            <p className="demo-cards-texto">{t('paginas.cards.textos.umCardMaisLargo')}</p>
          </Card>
        </div>
      </Secao>

      <Secao titulo={t('paginas.cards.secoes.grupoDeCardsCom')}>
        <GrupoCards>
          {(
            [
              [tc('Comida boa é uma bênção!'), IMG.rosa],
              [tc('O escritório é o melhor lugar para aprender?'), IMG.deserto],
              [tc('Escrever é uma arte.'), IMG.noite],
            ] as const
          ).map(([t, img]) => (
            <Card key={t} midia={<Imagem src={img} altura="11rem" />} rodape={<span className="demo-cards-mudo">{tx('paginas.cards.textos.atualizadoHa3Minutos')}</span>}>
              <div className="demo-card-titulo">{t}</div>
              <p className="demo-cards-texto">{tc(LOREM)}</p>
            </Card>
          ))}
        </GrupoCards>
      </Secao>

      <Secao titulo={t('paginas.cards.secoes.fundoColorido')}>
        <div className="demo-cards-4">
          {PESSOAS(t).map(([nome, corAvatar, status], i) => (
            <Card key={nome} cor={CORES_CARD[i]} style={i === 6 ? { background: 'var(--surf-3)', borderColor: 'var(--surf-3)', color: 'var(--ink)' } : undefined}>
              <div className="demo-cards-pessoa">
                <Avatar nome={nome} foto={retrato(corAvatar, nome[0])} tamanho="2.25rem" />
                <span style={{ flex: 1 }}>
                  <strong>{nome}</strong>
                  <span className="demo-cards-mudo-herda">{status}</span>
                </span>
                <Icone icone="ellipsis-vertical" />
              </div>
            </Card>
          ))}
        </div>
      </Secao>

      <Secao titulo={t('paginas.cards.secoes.bordaColorida')}>
        <div className="demo-cards-4">
          {(
            [
              [tc('Página inicial'), ['React', 'Vite', 'TypeScript'], 'pri'],
              [tc('Página de vendas'), ['Laravel', 'MySQL'], 'destaque'],
              [tc('Atualizar projeto'), ['HTML', 'CSS', 'React'], 'warn'],
              [tc('Discussão de projeto'), ['React', 'TypeScript'], 'info'],
              [tc('Testes recentes'), ['UI', 'Vitest'], 'err'],
              [tc('Página institucional'), ['HTML', 'PHP'], 'ok'],
              [tc('Novos colaboradores'), ['RH', tc('Treinamento')], 'neutral'],
              [tc('Colaboradores desligados'), ['RH'], 'neutral'],
            ] as const
          ).map(([titulo, tags, cor], i) => (
            <Card key={titulo} borda={i === 6 ? undefined : cor}>
              <div className="demo-linha" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="demo-card-titulo">{titulo}</span>
                <span style={{ color: i === 6 ? 'var(--t3)' : 'var(--cor-fg)' }} data-cor={cor}>
                  <Icone icone="circle-plus" />
                </span>
              </div>
              <div className="demo-linha" style={{ gap: '0.25rem' }}>
                {tags.map((t, j) => (
                  <Badge key={t} cor={(['pri', 'destaque', 'info'] as const)[j % 3]} aparencia="suave" formato="pilula" rotulo={t} />
                ))}
              </div>
              <div className="demo-cards-avatares">
                {PESSOAS(t).slice(i % 3, (i % 3) + 3).map(([n, c]) => (
                  <Avatar key={n} nome={n} foto={retrato(c, n[0])} tamanho="1.75rem" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Secao>

      <Secao titulo={t('paginas.cards.secoes.gradeDeCards')}>
        <div className="demo-cards-4">
          {(
            [
              [tc('Morfologia de uma fruta típica.'), IMG.tarde],
              [tc('Pesquisa melhora a agilidade!'), IMG.deserto],
              [tc('Áreas tropicais são adequadas'), IMG.campo],
              [tc('São frutas da estação?'), IMG.rosa],
            ] as const
          ).map(([t, img]) => (
            <Card key={t} midia={<Imagem src={img} altura="9rem" />}>
              <div className="demo-card-titulo">{t}</div>
              <p className="demo-cards-texto">{tc(LOREM)}</p>
            </Card>
          ))}
        </div>
      </Secao>

      <Secao titulo={t('paginas.cards.secoes.cardComoLink')}>
        <div className="demo-cards-link-grade">
          <Card midia={<Imagem src={IMG.rosa} altura="10rem" />} aoClicar={() => toast.info(t('paginas.cards.textos.abrirFlorestasSaoOtimas'))}>
            <div className="demo-card-titulo" style={{ margin: 0 }}>{t('paginas.cards.textos.florestasSaoOtimas')}</div>
          </Card>
          <div className="demo-pilha">
            <Card cor="pri" alinhamento="centro" aoClicar={() => toast.info(t('paginas.cards.textos.abrirCitacao'))}>
              <blockquote className="demo-cards-citacao" style={{ color: 'inherit' }}>
                <p>{t('paginas.cards.textos.asCoisasMaisBelas')}</p>
                <footer style={{ color: 'inherit', opacity: 0.85 }}>{t('paginas.cards.textos.helenKeller')}</footer>
              </blockquote>
            </Card>
            <div className="demo-cards-2">
              <div className="demo-pilha">
                <Card aoClicar={() => toast.info(t('paginas.cards.textos.abrirAnaPereira'))}>
                  <div className="demo-cards-pessoa">
                    <Avatar nome="Ana Pereira" foto={retrato('#1f5fe0', 'A')} formato="quadrado" tamanho="2.25rem" />
                    <span>{rico(t('paginas.cards.textos.anaPereira'))}<span className="demo-cards-mudo">{t('paginas.cards.textos.gerenteComercial')}</span>
                    </span>
                  </div>
                </Card>
                <Card borda="info" aoClicar={() => toast.info(t('paginas.cards.textos.abrirBrunoLima'))}>
                  <div className="demo-cards-pessoa">
                    <Avatar nome="Bruno Lima" foto={retrato('#f7931e', 'B')} formato="quadrado" tamanho="3rem" />
                    <span>
                      <strong style={{ color: 'var(--info-fg)' }}>{t('paginas.cards.textos.brunoLima')}</strong>
                      <span className="demo-cards-mudo">{t('paginas.cards.textos.departamentoComercial')}</span>
                    </span>
                  </div>
                </Card>
              </div>
              <Card midia={<img src={IMG.tarde} alt="" />} posicaoMidia="direita" aoClicar={() => toast.info(t('paginas.cards.textos.abrirARaposaE'))} rodape={<span className="demo-cards-mudo">{t('paginas.cards.textos.atualizadoHa3Minutos')}</span>}>
                <div className="demo-card-titulo">{t('paginas.cards.textos.aRaposaEBonita')}</div>
                <p className="demo-cards-texto">{t('paginas.cards.textos.umAnimalSelvagemConhecido')}</p>
              </Card>
            </div>
          </div>
          <Card midia={<Imagem src={IMG.mar} altura="8rem" />} aoClicar={() => toast.info(t('paginas.cards.textos.abrirAreasTropicais'))}>
            <div className="demo-card-titulo">{t('paginas.cards.textos.areasTropicaisSaoAdequadas')}</div>
            <p className="demo-cards-texto">{tc(LOREM)}</p>
          </Card>
        </div>
      </Secao>

      <Secao titulo={t('paginas.cards.secoes.cardDeRegistro')}>
        <div className="demo-cards-4">
          <Card
            aoClicar={() => toast.info(t('paginas.cards.textos.cardClicado'))}
            acoes={
              <>
                <AcaoLinha icone="pencil" rotulo={t('paginas.cards.textos.editar')} severidade="destaque" />
                <AcaoLinha icone="trash-2" rotulo={t('paginas.cards.textos.excluir')} severidade="err" />
              </>
            }
            rodape={<Status rotulo={t('paginas.cards.textos.pago')} severidade="info" />}
          >
            <div className="demo-card-titulo">{t('paginas.cards.textos.farmaciaVidaPlena')}</div>
            <Detalhes rotulo={t('paginas.cards.textos.pedido')} valor="PED-2026-0054" disposicao="linha" />
            <Detalhes rotulo={t('paginas.cards.textos.total')} valor="R$ 1.239,90" disposicao="linha" />
          </Card>
        </div>
      </Secao>

      <Secao titulo={t('paginas.cards.secoes.listaEmCards')}>
        <p className="demo-bloco-desc">{t('paginas.cards.textos.frotaDeEntregaPasse')}</p>
        <Escolha
          rotulo={t('paginas.cards.textos.estado')}
          valor={estadoLista}
          aoMudar={setEstadoLista}
          opcoes={[
            { valor: 'normal', rotulo: t('paginas.cards.textos.normal') },
            { valor: 'carregando', rotulo: t('paginas.cards.textos.carregando') },
            { valor: 'atualizando', rotulo: t('paginas.cards.textos.atualizando') },
            { valor: 'erro', rotulo: t('paginas.cards.textos.erro') },
            { valor: 'vazio', rotulo: t('paginas.cards.textos.vazio') },
          ]}
        />
        <ListaCards<Veiculo>
          rotulo={t('paginas.cards.textos.frotaDeEntrega')}
          itens={estadoLista === 'vazio' ? [] : VEICULOS}
          carregando={estadoLista === 'carregando'}
          atualizando={estadoLista === 'atualizando'}
          erro={estadoLista === 'erro'}
          aoRecarregar={() => setEstadoLista('normal')}
          alturaCard="7.5rem"
          larguraMin="15rem"
          vazioTitulo={t('paginas.cards.textos.nenhumVeiculoNaFrota')}
          card={(v) => (
            <Card
              acoes={
                <>
                  <AcaoLinha icone="eye" rotulo={t('paginas.cards.textos.visualizar')} severidade="pri" onClick={() => toast.info(v.placa)} />
                  <AcaoLinha icone="pencil" rotulo={t('paginas.cards.textos.editar')} severidade="destaque" onClick={() => toast.info(t('paginas.cards.textos.editar'), v.placa)} />
                </>
              }
              rodape={<Status rotulo={rotuloSituacao(t, v.situacao)} severidade={SEV_VEICULO[v.situacao]} />}
              detalhes={
                <>
                  <Detalhes rotulo={t('paginas.cards.textos.proprietario')} valor={v.proprietario} disposicao="linha" />
                  <Detalhes rotulo={t('paginas.cards.textos.cor')} valor={tc(v.cor)} disposicao="linha" />
                  <Detalhes rotulo={t('paginas.cards.textos.ano')} valor={v.ano} disposicao="linha" />
                </>
              }
            >
              <div className="demo-pilha-p">
                <Placa numero={v.placa} uf={v.uf} />
                <div className="demo-card-titulo" style={{ marginBottom: 0 }}>
                  {v.modelo} · {v.ano}
                </div>
              </div>
            </Card>
          )}
        />
      </Secao>
    </div>
  );
}
