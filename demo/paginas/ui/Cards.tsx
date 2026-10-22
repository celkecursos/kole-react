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

const PESSOAS = [
  ['Ana Pereira', '#1f5fe0', 'Finaliza hoje'],
  ['Bruno Lima', '#f7931e', 'Concluído há 2 dias'],
  ['Carla Dias', '#15803d', 'Concluído hoje'],
  ['Daniel Moreira', '#0b72aa', 'Pendente há 4 dias'],
  ['Eduarda Martins', '#b45309', 'Em férias até sexta'],
  ['Fábio Andrade', '#b42318', 'Concluído amanhã'],
  ['Gabriela Rocha', '#55627a', 'Finaliza dia 24'],
  ['Henrique Alves', '#0e1726', 'Concluído dia 24'],
] as const;
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

const VEICULOS: Veiculo[] = [
  { id: 1, placa: 'QBX-7H42', uf: 'PR', modelo: 'Fiat Strada', cor: 'Branca', ano: 2022, situacao: 'Regular', proprietario: 'Ana Pereira' },
  { id: 2, placa: 'NJU-4021', uf: 'PR', modelo: 'Toyota Hilux', cor: 'Prata', ano: 2018, situacao: 'Licenciamento vencido', proprietario: 'Bruno Lima' },
  { id: 3, placa: 'RTA-2B19', uf: 'GO', modelo: 'VW Gol', cor: 'Vermelha', ano: 2020, situacao: 'Em manutenção', proprietario: 'Carla Dias' },
  { id: 4, placa: 'QCD-9E07', uf: 'PR', modelo: 'Honda CG 160', cor: 'Preta', ano: 2023, situacao: 'Regular', proprietario: 'Daniel Moreira' },
  { id: 5, placa: 'OAK-3311', uf: 'MS', modelo: 'Chevrolet Onix', cor: 'Cinza', ano: 2019, situacao: 'Regular', proprietario: 'Eduarda Martins' },
  { id: 6, placa: 'QBZ-1F88', uf: 'PR', modelo: 'Renault Duster', cor: 'Azul', ano: 2021, situacao: 'Licenciamento vencido', proprietario: 'Fábio Andrade' },
];

const SEV_VEICULO = { Regular: 'ok', 'Licenciamento vencido': 'err', 'Em manutenção': 'warn' } as const;

export function PaginaCards() {
  const toast = useToast();
  const [estadoLista, setEstadoLista] = useState('normal');
  const [aba, setAba] = useState<string | null>('ativo');

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Cards" icone="layers" trilha />

      <div className="demo-cards-4">
        <Card midia={<Imagem src={IMG.mar} />} rodape={<span className="demo-cards-mudo">Atualizado há 3 minutos</span>}>
          <div className="demo-card-titulo">Título do card</div>
          <p className="demo-cards-texto">{LOREM}</p>
          <Botao rotulo="Ver mais" formato="retangulo" />
        </Card>
        <div className="demo-pilha">
          <Card titulo="Destaque">
            <div className="demo-card-titulo">Tratamento especial do título</div>
            <p className="demo-cards-texto">{LOREM}</p>
            <Botao rotulo="Ver mais" formato="retangulo" />
          </Card>
          <Card
            rodape={
              <div className="demo-linha">
                <a className="demo-cards-link" href="#/pedidos">
                  Comprar agora
                </a>
                <a className="demo-cards-link" href="#/ui/cards">
                  Avaliações
                </a>
              </div>
            }
          >
            <div className="demo-card-titulo" style={{ marginBottom: 0 }}>
              Título do card
            </div>
            <div className="demo-cards-mudo" style={{ marginBottom: '0.5rem' }}>
              Subtítulo do card
            </div>
            <p className="demo-cards-texto">{LOREM}</p>
          </Card>
        </div>
        <div className="demo-pilha">
          <Card midia={<Imagem src={IMG.rosa} />}>
            <p className="demo-cards-texto">Um texto curto de exemplo para compor a maior parte do conteúdo do card.</p>
          </Card>
          <div className="demo-secao-titulo">Só corpo:</div>
          <Card>
            <p className="demo-cards-texto">Um card só com o corpo, sem título nem imagem.</p>
          </Card>
        </div>
        <Card
          midia={<Imagem src={IMG.tarde} />}
          corpoSemEspaco
          rodape={
            <div className="demo-linha">
              <a className="demo-cards-link" href="#/ui/cards">
                Link do card
              </a>
              <a className="demo-cards-link demo-cards-link--destaque" href="#/ui/cards">
                Outro link
              </a>
            </div>
          }
        >
          <div className="demo-cards-pad">
            <div className="demo-card-titulo">Título do card</div>
            <p className="demo-cards-texto">Um texto de exemplo antes da lista.</p>
          </div>
          <ul className="demo-cards-lista">
            <li>Um item</li>
            <li>Um segundo item</li>
          </ul>
        </Card>
      </div>

      <div className="demo-cards-alinha">
        <Secao titulo="Alinhamento do texto:">
          <div className="demo-cards-3">
            {(['esquerda', 'centro', 'direita'] as const).map((a, i) => (
              <Card key={a} alinhamento={a}>
                <div className="demo-cards-avatar" style={{ justifyContent: a === 'centro' ? 'center' : a === 'direita' ? 'flex-end' : 'flex-start' }}>
                  <Avatar nome={PESSOAS[i][0]} foto={retrato(PESSOAS[i][1], PESSOAS[i][0][0])} formato="quadrado" tamanho="2rem" />
                </div>
                <div className="demo-card-titulo">{['De onde vem', 'Por que usar?', 'O que tem de especial?'][i]}</div>
                <p className="demo-cards-texto">{LOREM}</p>
                <Botao rotulo="Abrir" formato="retangulo" />
              </Card>
            ))}
          </div>
        </Secao>
        <Secao titulo="Borda colorida:">
          <Card borda="ok" titulo="Cabeçalho" rodape={<span className="demo-cards-mudo">Rodapé</span>}>
            <div className="demo-card-titulo" style={{ color: 'var(--ok-fg)' }}>
              Procurando resultado?
            </div>
            <p className="demo-cards-texto" style={{ color: 'var(--ok-fg)' }}>
              {LOREM}
            </p>
          </Card>
        </Secao>
      </div>

      <div className="demo-colunas">
        <div className="demo-pilha">
          <Secao titulo="Citação:">
            <Card alinhamento="centro">
              <blockquote className="demo-cards-citacao">
                <p>“A maior glória da vida não é nunca cair, mas levantar a cada queda.”</p>
                <footer>— Alguém famoso, em <cite>Fonte do texto</cite></footer>
              </blockquote>
            </Card>
          </Secao>
          <Secao titulo="Grupo de lista:">
            <div className="demo-cards-3">
              <Card corpoSemEspaco>
                <ul className="demo-cards-lista">
                  <li>Um item</li>
                  <li>Um segundo item</li>
                  <li>Um terceiro item</li>
                  <li>Um quarto item</li>
                </ul>
              </Card>
              <Card titulo="Destaque" corpoSemEspaco>
                <ul className="demo-cards-lista">
                  <li>Um item</li>
                  <li>Um segundo item</li>
                  <li>Um terceiro item</li>
                </ul>
              </Card>
              <Card corpoSemEspaco rodape={<span className="demo-cards-mudo">Rodapé do card</span>}>
                <ul className="demo-cards-lista">
                  <li>Um item</li>
                  <li>Um segundo item</li>
                  <li>Um terceiro item</li>
                </ul>
              </Card>
            </div>
          </Secao>
        </div>
        <Secao titulo="Grade de produtos:">
          <div className="demo-cards-3">
            {(
              [
                ['Produto A', IMG.noite, 'pri'],
                ['Produto B', IMG.deserto, 'destaque'],
                ['Produto C', IMG.campo, 'secundario'],
              ] as const
            ).map(([nome, img, cor]) => (
              <Card key={nome}>
                <div className="demo-cards-thumb">
                  <img src={img} alt="" />
                </div>
                <div className="demo-card-titulo">{nome}</div>
                <p className="demo-cards-texto">Texto de apoio abaixo, como introdução ao conteúdo.</p>
                <Botao rotulo="Comprar" severidade={cor} formato="retangulo" onClick={() => toast.ok(`${nome} no carrinho`)} />
              </Card>
            ))}
          </div>
        </Secao>
      </div>

      <Secao titulo="Cabeçalho e rodapé:">
        <div className="demo-cards-4">
          <Card
            titulo={
              <span className="demo-cards-pessoa">
                <Avatar nome="Ana Pereira" foto={retrato('#1f5fe0', 'A')} tamanho="2.25rem" />
                <span>
                  Ana Pereira
                  <span className="demo-cards-mudo">Gerente comercial</span>
                </span>
              </span>
            }
            ferramentas={<Botao icone="ellipsis-vertical" severidade="secundario" aparencia="suave" tamanho="pequeno" formato="retangulo" dica="Mais" aria-label="Mais opções" />}
            rodape={
              <div className="demo-linha" style={{ justifyContent: 'space-between' }}>
                <span className="demo-cards-mudo">28 nov. 2026</span>
                <span style={{ color: 'var(--ok-fg)', fontWeight: 700, fontSize: 'var(--fs-caption)' }}>Gerente comercial</span>
              </div>
            }
          >
            <p className="demo-cards-texto">{LOREM}</p>
          </Card>
          <Card
            rodape={
              <span className="demo-cards-pessoa">
                <Avatar nome="Bruno Lima" foto={retrato('#f7931e', 'B')} tamanho="1.75rem" />
                Bruno Lima
              </span>
            }
          >
            <div className="demo-cards-estrelas" aria-label="4 de 5 estrelas">
              {[1, 2, 3, 4, 5].map((n) => (
                <Icone key={n} icone="star" className={n <= 4 ? 'is-on' : undefined} />
              ))}
            </div>
            <div className="demo-cards-mudo">Há 1 ano</div>
            <div className="demo-card-titulo" style={{ marginTop: '0.5rem' }}>
              Muito bom!
            </div>
            <p className="demo-cards-texto">Entrega rápida e o pedido chegou completo. Recomendo a loja.</p>
          </Card>
          <Card alinhamento="centro" acoes={<Botao icone="heart" severidade="err" aparencia="texto" tamanho="pequeno" dica="Favoritar" aria-label="Favoritar" />}>
            <div className="demo-cards-avatar" style={{ justifyContent: 'center' }}>
              <Avatar nome="Carla Dias" foto={retrato('#15803d', 'C')} tamanho="3.5rem" />
            </div>
            <div className="demo-card-titulo" style={{ marginBottom: 0 }}>
              Carla Dias
            </div>
            <div className="demo-cards-mudo">Vendedora</div>
            <div className="demo-linha" style={{ justifyContent: 'center', marginTop: '0.75rem' }}>
              <Botao icone="mail" severidade="pri" formato="retangulo" tamanho="pequeno" dica="E-mail" aria-label="E-mail" />
              <Botao icone="phone" severidade="info" formato="retangulo" tamanho="pequeno" dica="Telefone" aria-label="Telefone" />
              <Botao icone="message-square" severidade="destaque" formato="retangulo" tamanho="pequeno" dica="Mensagem" aria-label="Mensagem" />
            </div>
          </Card>
          <Card borda="pri" rodape={<span className="demo-cards-mudo">Atualizado hoje</span>}>
            <span className="demo-cards-icone-grande">
              <Icone icone="calculator" />
            </span>
            <div className="demo-card-titulo" style={{ fontSize: 'var(--fs-titulo)' }}>
              Cálculos
            </div>
            <p className="demo-cards-texto">Totais, descontos e frete calculados automaticamente em cada pedido.</p>
          </Card>
        </div>
      </Secao>

      <div className="demo-cards-5">
        {(
          [
            ['Montanhas', IMG.rosa, 'Novo', 'pri'],
            ['Morros', IMG.tarde, 'Promoção', 'destaque'],
            ['Natureza', IMG.campo, 'Oferta', 'neutral'],
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
            <p className="demo-cards-texto">Texto de apoio, como introdução.</p>
          </Card>
        ))}
        <Card titulo="Destaque" alinhamento="centro" rodape={<span className="demo-cards-mudo">11:32</span>}>
          <div className="demo-card-titulo">Notícia urgente!</div>
          <p className="demo-cards-texto">Texto de apoio, como introdução ao conteúdo.</p>
          <div className="demo-linha" style={{ justifyContent: 'center' }}>
            <Botao rotulo="Ver mais" formato="retangulo" />
            <Botao rotulo="Fechar" severidade="destaque" aparencia="contorno" formato="retangulo" />
          </div>
        </Card>
        <Card corpoSemEspaco>
          <div className="demo-cards-perfil">
            <Avatar nome="Daniel Moreira" foto={retrato('#0b72aa', 'D')} tamanho="3rem" />
            <dl className="demo-cards-numeros">
              <div>
                <dt>Pedidos</dt>
                <dd>25</dd>
              </div>
              <div>
                <dt>Clientes</dt>
                <dd>1.253</dd>
              </div>
              <div>
                <dt>Metas</dt>
                <dd>367</dd>
              </div>
            </dl>
          </div>
          <div className="demo-cards-pad">
            <div className="demo-card-titulo" style={{ marginBottom: 0 }}>
              Daniel Moreira
            </div>
            <div className="demo-cards-mudo">Analista comercial</div>
            <div className="demo-card-titulo" style={{ margin: '0.75rem 0 0.25rem', fontSize: 'var(--fs-corpo)' }}>
              Sobre:
            </div>
            <p className="demo-cards-texto">Atende os clientes da região Sul há 6 anos.</p>
          </div>
        </Card>
      </div>

      <div className="demo-cards-3">
        <Card titulo="Card com recolher" recolhivel rodape={<Botao rotulo="Ver mais" formato="retangulo" />}>
          <div className="demo-card-titulo">Card recolhível</div>
          <p className="demo-cards-texto">{LOREM}</p>
        </Card>
        <Card titulo="Card com fechar" dispensavel aoFechar={() => toast.info('Card fechado')} rodape={<Botao rotulo="Ver mais" formato="retangulo" />}>
          <div className="demo-card-titulo">Card que fecha</div>
          <p className="demo-cards-texto">{LOREM}</p>
        </Card>
        <Card titulo="Card com tela cheia" telaCheia rodape={<Botao rotulo="Ver mais" formato="retangulo" />}>
          <div className="demo-card-titulo">Card em tela cheia</div>
          <p className="demo-cards-texto">{LOREM} Pressione Esc para voltar.</p>
        </Card>
      </div>

      <Secao titulo="Posição da imagem:">
        <div className="demo-cards-3">
          <Card midia={<Imagem src={IMG.deserto} altura="12rem" />} rodape={<span className="demo-cards-mudo">Atualizado há 3 minutos</span>}>
            <div className="demo-card-titulo">Imagem no topo</div>
            <p className="demo-cards-texto">{LOREM}</p>
          </Card>
          <Card midia={<Imagem src={IMG.campo} altura="12rem" />} posicaoMidia="base">
            <div className="demo-card-titulo">Imagem embaixo</div>
            <p className="demo-cards-texto">{LOREM}</p>
            <span className="demo-cards-mudo">Atualizado há 3 minutos</span>
          </Card>
          <Card titulo="Com cabeçalho" midia={<Imagem src={IMG.mar} altura="12rem" />} posicaoMidia="base" rodape={<span className="demo-cards-mudo">Atualizado há 3 minutos</span>}>
            <p className="demo-cards-texto">{LOREM}</p>
          </Card>
        </div>
      </Secao>

      <Secao titulo="Texto sobre a imagem:">
        <div className="demo-cards-3">
          <Card midia={<img src={IMG.mar} alt="" />} posicaoMidia="fundo" titulo="Imagens sobrepostas são ótimas!">
            <p className="demo-cards-texto">{LOREM}</p>
            <span className="demo-cards-mudo-claro">Atualizado há 3 minutos</span>
          </Card>
          <Card midia={<img src={IMG.campo} alt="" />} posicaoMidia="fundo" rodape={<span className="demo-cards-mudo-claro">Atualizado há 3 minutos</span>}>
            <div className="demo-card-titulo">Imagens sobrepostas são ótimas!</div>
            <p className="demo-cards-texto">{LOREM}</p>
          </Card>
          <Card midia={<img src={IMG.noite} alt="" />} posicaoMidia="fundo" titulo="Com cabeçalho e rodapé" rodape={<span className="demo-cards-mudo-claro">Atualizado há 3 minutos</span>}>
            <p className="demo-cards-texto">{LOREM}</p>
          </Card>
        </div>
      </Secao>

      <div className="demo-colunas">
        <Secao titulo="Larguras:">
          <div className="demo-linha" style={{ alignItems: 'stretch' }}>
            <Card titulo="Largura de 75%" style={{ width: '38%' }} rodape={<Botao rotulo="Botão" bloco formato="retangulo" />}>
              <p className="demo-cards-texto">Largura definida por style ou classe do app.</p>
            </Card>
            <Card titulo="Largura de 50%" style={{ width: '26%' }} rodape={<Botao rotulo="Botão" formato="retangulo" />}>
              <p className="demo-cards-texto">Mais estreito.</p>
            </Card>
          </div>
        </Secao>
        <Secao titulo="Navegação:">
          <div className="demo-cards-2">
            {(['secundario', 'pri'] as const).map((cor) => (
              <Card
                key={cor}
                alinhamento="centro"
                titulo={
                  <GrupoAlternancia
                    rotulo="Abas do card"
                    severidade={cor}
                    aparencia="texto"
                    tamanho="pequeno"
                    formato="retangulo"
                    opcoes={[
                      { valor: 'ativo', rotulo: 'Ativo' },
                      { valor: 'link', rotulo: 'Link' },
                      { valor: 'off', rotulo: 'Desativado', desabilitada: true },
                    ]}
                    valor={aba}
                    aoMudar={setAba}
                  />
                }
              >
                <div className="demo-card-titulo">Tratamento especial do título</div>
                <p className="demo-cards-texto">Texto de apoio, como introdução.</p>
                <Botao rotulo="Abrir" formato="retangulo" />
              </Card>
            ))}
          </div>
        </Secao>
      </div>

      <Secao titulo="Cards horizontais:">
        <div className="demo-cards-3">
          <Card midia={<img src={IMG.tarde} alt="" />} posicaoMidia="esquerda" titulo="Cards horizontais" rodape={<span className="demo-cards-mudo">Atualizado há 3 minutos</span>}>
            <div className="demo-card-titulo">Cards horizontais são ótimos!</div>
            <p className="demo-cards-texto">Um card mais largo, com texto de apoio.</p>
          </Card>
          <Card midia={<img src={IMG.mar} alt="" />} posicaoMidia="direita" titulo="Cards horizontais" rodape={<span className="demo-cards-mudo">Atualizado há 3 minutos</span>}>
            <div className="demo-card-titulo">Cards horizontais são ótimos!</div>
            <p className="demo-cards-texto">Um card mais largo, com texto de apoio um pouco maior.</p>
          </Card>
          <Card midia={<img src={IMG.deserto} alt="" />} posicaoMidia="direita" rodape={<span className="demo-cards-mudo">Atualizado há 3 minutos</span>}>
            <div className="demo-card-titulo" style={{ marginBottom: 0 }}>
              Cards horizontais
            </div>
            <div className="demo-cards-mudo" style={{ marginBottom: '0.5rem' }}>
              São ótimos!
            </div>
            <p className="demo-cards-texto">Um card mais largo, com texto de apoio.</p>
          </Card>
        </div>
      </Secao>

      <Secao titulo="Grupo de cards com rodapé:">
        <GrupoCards>
          {(
            [
              ['Comida boa é uma bênção!', IMG.rosa],
              ['O escritório é o melhor lugar para aprender?', IMG.deserto],
              ['Escrever é uma arte.', IMG.noite],
            ] as const
          ).map(([t, img]) => (
            <Card key={t} midia={<Imagem src={img} altura="11rem" />} rodape={<span className="demo-cards-mudo">Atualizado há 3 minutos</span>}>
              <div className="demo-card-titulo">{t}</div>
              <p className="demo-cards-texto">{LOREM}</p>
            </Card>
          ))}
        </GrupoCards>
      </Secao>

      <Secao titulo="Fundo colorido:">
        <div className="demo-cards-4">
          {PESSOAS.map(([nome, corAvatar, status], i) => (
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

      <Secao titulo="Borda colorida:">
        <div className="demo-cards-4">
          {(
            [
              ['Página inicial', ['React', 'Vite', 'TypeScript'], 'pri'],
              ['Página de vendas', ['Laravel', 'MySQL'], 'destaque'],
              ['Atualizar projeto', ['HTML', 'CSS', 'React'], 'warn'],
              ['Discussão de projeto', ['React', 'TypeScript'], 'info'],
              ['Testes recentes', ['UI', 'Vitest'], 'err'],
              ['Página institucional', ['HTML', 'PHP'], 'ok'],
              ['Novos colaboradores', ['RH', 'Treinamento'], 'neutral'],
              ['Colaboradores desligados', ['RH'], 'neutral'],
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
                {PESSOAS.slice(i % 3, (i % 3) + 3).map(([n, c]) => (
                  <Avatar key={n} nome={n} foto={retrato(c, n[0])} tamanho="1.75rem" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Secao>

      <Secao titulo="Grade de cards:">
        <div className="demo-cards-4">
          {(
            [
              ['Morfologia de uma fruta típica.', IMG.tarde],
              ['Pesquisa melhora a agilidade!', IMG.deserto],
              ['Áreas tropicais são adequadas', IMG.campo],
              ['São frutas da estação?', IMG.rosa],
            ] as const
          ).map(([t, img]) => (
            <Card key={t} midia={<Imagem src={img} altura="9rem" />}>
              <div className="demo-card-titulo">{t}</div>
              <p className="demo-cards-texto">{LOREM}</p>
            </Card>
          ))}
        </div>
      </Secao>

      <Secao titulo="Card como link:">
        <div className="demo-cards-link-grade">
          <Card midia={<Imagem src={IMG.rosa} altura="10rem" />} aoClicar={() => toast.info('Abrir: Florestas são ótimas')}>
            <div className="demo-card-titulo" style={{ margin: 0 }}>
              Florestas são ótimas.
            </div>
          </Card>
          <div className="demo-pilha">
            <Card cor="pri" alinhamento="centro" aoClicar={() => toast.info('Abrir citação')}>
              <blockquote className="demo-cards-citacao" style={{ color: 'inherit' }}>
                <p>“As coisas mais belas do mundo não podem ser vistas nem tocadas — precisam ser sentidas com o coração.”</p>
                <footer style={{ color: 'inherit', opacity: 0.85 }}>— Helen Keller</footer>
              </blockquote>
            </Card>
            <div className="demo-cards-2">
              <div className="demo-pilha">
                <Card aoClicar={() => toast.info('Abrir: Ana Pereira')}>
                  <div className="demo-cards-pessoa">
                    <Avatar nome="Ana Pereira" foto={retrato('#1f5fe0', 'A')} formato="quadrado" tamanho="2.25rem" />
                    <span>
                      <strong>Ana Pereira</strong>
                      <span className="demo-cards-mudo">Gerente comercial</span>
                    </span>
                  </div>
                </Card>
                <Card borda="info" aoClicar={() => toast.info('Abrir: Bruno Lima')}>
                  <div className="demo-cards-pessoa">
                    <Avatar nome="Bruno Lima" foto={retrato('#f7931e', 'B')} formato="quadrado" tamanho="3rem" />
                    <span>
                      <strong style={{ color: 'var(--info-fg)' }}>Bruno Lima</strong>
                      <span className="demo-cards-mudo">Departamento comercial</span>
                    </span>
                  </div>
                </Card>
              </div>
              <Card midia={<img src={IMG.tarde} alt="" />} posicaoMidia="direita" aoClicar={() => toast.info('Abrir: A raposa é bonita?')} rodape={<span className="demo-cards-mudo">Atualizado há 3 minutos</span>}>
                <div className="demo-card-titulo">A raposa é bonita?</div>
                <p className="demo-cards-texto">Um animal selvagem, conhecido pela habilidade de caça.</p>
              </Card>
            </div>
          </div>
          <Card midia={<Imagem src={IMG.mar} altura="8rem" />} aoClicar={() => toast.info('Abrir: Áreas tropicais')}>
            <div className="demo-card-titulo">Áreas tropicais são adequadas</div>
            <p className="demo-cards-texto">{LOREM}</p>
          </Card>
        </div>
      </Secao>

      <Secao titulo="Card de registro">
        <div className="demo-cards-4">
          <Card
            aoClicar={() => toast.info('Card clicado')}
            acoes={
              <>
                <AcaoLinha icone="pencil" rotulo="Editar" severidade="destaque" />
                <AcaoLinha icone="trash-2" rotulo="Excluir" severidade="err" />
              </>
            }
            rodape={<Status rotulo="Pago" severidade="info" />}
          >
            <div className="demo-card-titulo">Farmácia Vida Plena</div>
            <Detalhes rotulo="Pedido" valor="PED-2026-0054" disposicao="linha" />
            <Detalhes rotulo="Total" valor="R$ 1.239,90" disposicao="linha" />
          </Card>
        </div>
      </Secao>

      <Secao titulo="Lista em cards">
        <p className="demo-bloco-desc">Frota de entrega. Passe o mouse (ou foque) num card para ver o painel de detalhes.</p>
        <Escolha
          rotulo="Estado"
          valor={estadoLista}
          aoMudar={setEstadoLista}
          opcoes={[
            { valor: 'normal', rotulo: 'Normal' },
            { valor: 'carregando', rotulo: 'Carregando' },
            { valor: 'atualizando', rotulo: 'Atualizando' },
            { valor: 'erro', rotulo: 'Erro' },
            { valor: 'vazio', rotulo: 'Vazio' },
          ]}
        />
        <ListaCards<Veiculo>
          rotulo="Frota de entrega"
          itens={estadoLista === 'vazio' ? [] : VEICULOS}
          carregando={estadoLista === 'carregando'}
          atualizando={estadoLista === 'atualizando'}
          erro={estadoLista === 'erro'}
          aoRecarregar={() => setEstadoLista('normal')}
          alturaCard="7.5rem"
          larguraMin="15rem"
          vazioTitulo="Nenhum veículo na frota"
          card={(v) => (
            <Card
              acoes={
                <>
                  <AcaoLinha icone="eye" rotulo="Visualizar" severidade="pri" onClick={() => toast.info(v.placa)} />
                  <AcaoLinha icone="pencil" rotulo="Editar" severidade="destaque" onClick={() => toast.info('Editar', v.placa)} />
                </>
              }
              rodape={<Status rotulo={v.situacao} severidade={SEV_VEICULO[v.situacao]} />}
              detalhes={
                <>
                  <Detalhes rotulo="Proprietário" valor={v.proprietario} disposicao="linha" />
                  <Detalhes rotulo="Cor" valor={v.cor} disposicao="linha" />
                  <Detalhes rotulo="Ano" valor={v.ano} disposicao="linha" />
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
