import { useState, type ReactNode } from 'react';
import { Avatar, Badge, Botao, CabecalhoPagina, Card, QuadroArrastavel, type ColunaArrastavel } from '../../../src';
import { cena, retrato } from '../Bloco';
import { useT, type TradutorDemo } from '../../i18n/useT';

interface ItemCard {
  id: string;
  nome: string;
}

const TEXTO = 'Existem muitas variações de passagens disponíveis, mas a maioria sofreu alguma alteração, por humor inserido ou palavras ao acaso.';

const INICIAL: ColunaArrastavel<ItemCard>[] = [
  {
    id: 'esq',
    titulo: 'coluna da esquerda',
    itens: [
      { id: 'tela-cheia', nome: 'Card com tela cheia' },
      { id: 'citacao', nome: 'Card de citação' },
      { id: 'imagem-1', nome: 'Card com imagem de fundo' },
      { id: 'perfil-1', nome: 'Card de perfil de Atharva Simão' },
    ],
  },
  {
    id: 'dir',
    titulo: 'coluna da direita',
    itens: [
      { id: 'perfil-2', nome: 'Card de perfil de Alícia Keller' },
      { id: 'imagem-2', nome: 'Card com imagem de fundo 2' },
      { id: 'licenca', nome: 'Card de licença' },
      { id: 'recolher', nome: 'Card recolhível' },
      { id: 'fechar', nome: 'Card que fecha' },
    ],
  },
];

/** O conteúdo de cada card; `alca` é o botão de arrastar. */
// recebe o `t` de quem renderiza: é chamada pelo QuadroArrastavel, não é um componente
function conteudo(item: ItemCard, alca: ReactNode, t: TradutorDemo['t']) {
  switch (item.id) {
    case 'tela-cheia':
      return (
        <Card titulo={t('paginas.cardsArrastaveis.secoes.telaCheia')} telaCheia ferramentas={alca} rodape={<Botao rotulo="Ler mais" tamanho="pequeno" formato="retangulo" />}>
          <strong>Card em tela cheia</strong>
          <p className="demo-arrasta-texto">{TEXTO}</p>
        </Card>
      );
    case 'citacao':
      return (
        <Card cor="pri" alinhamento="centro" acoes={alca}>
          <p className="demo-arrasta-citacao">“As coisas mais lindas do mundo não podem ser vistas nem tocadas: precisam ser sentidas com o coração.”</p>
          <small>— Helen Keller</small>
        </Card>
      );
    case 'imagem-1':
    case 'imagem-2':
      return (
        <Card
          midia={<img src={item.id === 'imagem-1' ? cena('#4fb3e8', '#15803d') : cena('#f7931e', '#7a2e0e', '#fff3c4')} alt="" />}
          posicaoMidia="fundo"
          titulo={t('paginas.cardsArrastaveis.secoes.imagensVeu')}
          acoes={alca}
        >
          <p className="demo-arrasta-texto">{TEXTO}</p>
          <small>Atualizado há 2 min</small>
        </Card>
      );
    case 'perfil-1':
      return (
        <Card acoes={alca}>
          <div className="demo-arrasta-perfil">
            <Avatar nome="Atharva Simão" foto={retrato('#7c3aed', 'A')} tamanho="3rem" />
            <div>
              <strong>Atharva Simão</strong>
              <span>Professor correspondente</span>
            </div>
          </div>
        </Card>
      );
    case 'perfil-2':
      return (
        <Card borda="info" acoes={alca}>
          <div className="demo-arrasta-perfil">
            <Avatar nome="Alícia Keller" foto={retrato('#0b72aa', 'A')} tamanho="3rem" />
            <div>
              <strong>Alícia Keller</strong>
              <span>Departamento comercial</span>
              <span className="demo-arrasta-badges">
                <Badge cor="info" aparencia="suave" rotulo="24 anos" />
                <Badge cor="destaque" aparencia="suave" rotulo="Vendas" />
              </span>
            </div>
          </div>
        </Card>
      );
    case 'licenca':
      return (
        <Card cor="ok" acoes={alca}>
          <div className="demo-arrasta-perfil">
            <Avatar nome="Samanta Dias" foto={retrato('#15803d', 'S')} tamanho="3rem" />
            <div>
              <strong>Samanta Dias</strong>
              <span>De licença por 1 mês</span>
            </div>
          </div>
        </Card>
      );
    case 'recolher':
      return (
        <Card titulo={t('paginas.cardsArrastaveis.secoes.recolhivel')} recolhivel ferramentas={alca}>
          <strong>Card recolhível</strong>
          <p className="demo-arrasta-texto">{TEXTO}</p>
        </Card>
      );
    default:
      return (
        <Card titulo={t('paginas.cardsArrastaveis.secoes.fecha')} dispensavel ferramentas={alca}>
          <strong>Card fechável</strong>
          <p className="demo-arrasta-texto">{TEXTO}</p>
        </Card>
      );
  }
}

export function PaginaCardsArrastaveis() {
  const { t } = useT();
  const [colunas, setColunas] = useState(INICIAL);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.cardsArrastaveis.titulo')} icone="grip-vertical" trilha />
      <p className="demo-bloco-desc demo-arrasta-ajuda">
        Arraste pela alça <span aria-hidden="true">⋮⋮</span> para reordenar ou trocar de coluna. No teclado: foque a alça, Espaço pega e solta, as setas
        movem e Esc cancela.
      </p>
      <QuadroArrastavel colunas={colunas} aoMudar={setColunas} renderItem={(item, alca) => conteudo(item, alca, t)} nomeItem={(i) => i.nome} />
      <div>
        <Botao rotulo="Voltar à ordem inicial" icone="rotate-cw" aparencia="texto" formato="retangulo" onClick={() => setColunas(INICIAL)} />
      </div>
    </div>
  );
}
