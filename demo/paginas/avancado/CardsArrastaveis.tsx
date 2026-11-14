import { useState, type ReactNode } from 'react';
import { Avatar, Badge, Botao, CabecalhoPagina, Card, QuadroArrastavel, type ColunaArrastavel } from '../../../src';
import { cena, retrato } from '../Bloco';
import { useT, type TradutorDemo } from '../../i18n/useT';
import { rico } from '../../i18n/rico';

interface ItemCard {
  id: string;
  nome: string;
}

const TEXTO = (t: TradutorDemo['t']) => (t('paginas.cardsArrastaveis.textos.existemMuitasVariacoesDe'));

const INICIAL = (t: TradutorDemo['t']): ColunaArrastavel<ItemCard>[] => ([
  {
    id: 'esq',
    titulo: t('paginas.cardsArrastaveis.textos.colunaDaEsquerda'),
    itens: [
      { id: 'tela-cheia', nome: t('paginas.cardsArrastaveis.textos.cardComTelaCheia') },
      { id: 'citacao', nome: t('paginas.cardsArrastaveis.textos.cardDeCitacao') },
      { id: 'imagem-1', nome: t('paginas.cardsArrastaveis.textos.cardComImagemDe') },
      { id: 'perfil-1', nome: t('paginas.cardsArrastaveis.textos.cardDePerfilDe') },
    ],
  },
  {
    id: 'dir',
    titulo: t('paginas.cardsArrastaveis.textos.colunaDaDireita'),
    itens: [
      { id: 'perfil-2', nome: t('paginas.cardsArrastaveis.textos.cardDePerfilDe2') },
      { id: 'imagem-2', nome: t('paginas.cardsArrastaveis.textos.cardComImagemDe2') },
      { id: 'licenca', nome: t('paginas.cardsArrastaveis.textos.cardDeLicenca') },
      { id: 'recolher', nome: t('paginas.cardsArrastaveis.textos.cardRecolhivel2') },
      { id: 'fechar', nome: t('paginas.cardsArrastaveis.textos.cardQueFecha') },
    ],
  },
]);

/** O conteúdo de cada card; `alca` é o botão de arrastar. */
// recebe o `t` de quem renderiza: é chamada pelo QuadroArrastavel, não é um componente
function conteudo(item: ItemCard, alca: ReactNode, t: TradutorDemo['t']) {
  switch (item.id) {
    case 'tela-cheia':
      return (
        <Card titulo={t('paginas.cardsArrastaveis.secoes.telaCheia')} telaCheia ferramentas={alca} rodape={<Botao rotulo={t('paginas.cardsArrastaveis.textos.lerMais')} tamanho="pequeno" formato="retangulo" />}>{rico(t('paginas.cardsArrastaveis.textos.cardEmTelaCheia'))}<p className="demo-arrasta-texto">{TEXTO(t)}</p>
        </Card>
      );
    case 'citacao':
      return (
        <Card cor="pri" alinhamento="centro" acoes={alca}>
          <p className="demo-arrasta-citacao">{t('paginas.cardsArrastaveis.textos.asCoisasMaisLindas')}</p>{rico(t('paginas.cardsArrastaveis.textos.helenKeller'))}</Card>
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
          <p className="demo-arrasta-texto">{TEXTO(t)}</p>{rico(t('paginas.cardsArrastaveis.textos.atualizadoHa2Min'))}</Card>
      );
    case 'perfil-1':
      return (
        <Card acoes={alca}>
          <div className="demo-arrasta-perfil">
            <Avatar nome="Atharva Simão" foto={retrato('#7c3aed', 'A')} tamanho="3rem" />
            <div>{rico(t('paginas.cardsArrastaveis.textos.atharvaSimao'))}<span>{t('paginas.cardsArrastaveis.textos.professorCorrespondente')}</span>
            </div>
          </div>
        </Card>
      );
    case 'perfil-2':
      return (
        <Card borda="info" acoes={alca}>
          <div className="demo-arrasta-perfil">
            <Avatar nome="Alícia Keller" foto={retrato('#0b72aa', 'A')} tamanho="3rem" />
            <div>{rico(t('paginas.cardsArrastaveis.textos.aliciaKeller'))}<span>{t('paginas.cardsArrastaveis.textos.departamentoComercial')}</span>
              <span className="demo-arrasta-badges">
                <Badge cor="info" aparencia="suave" rotulo={t('paginas.cardsArrastaveis.textos.t24Anos')} />
                <Badge cor="destaque" aparencia="suave" rotulo={t('paginas.cardsArrastaveis.textos.vendas')} />
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
            <div>{rico(t('paginas.cardsArrastaveis.textos.samantaDias'))}<span>{t('paginas.cardsArrastaveis.textos.deLicencaPor1')}</span>
            </div>
          </div>
        </Card>
      );
    case 'recolher':
      return (
        <Card titulo={t('paginas.cardsArrastaveis.secoes.recolhivel')} recolhivel ferramentas={alca}>{rico(t('paginas.cardsArrastaveis.textos.cardRecolhivel'))}<p className="demo-arrasta-texto">{TEXTO(t)}</p>
        </Card>
      );
    default:
      return (
        <Card titulo={t('paginas.cardsArrastaveis.secoes.fecha')} dispensavel ferramentas={alca}>{rico(t('paginas.cardsArrastaveis.textos.cardFechavel'))}<p className="demo-arrasta-texto">{TEXTO(t)}</p>
        </Card>
      );
  }
}

export function PaginaCardsArrastaveis() {
  const { t } = useT();
  const [colunas, setColunas] = useState(INICIAL(t));

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.cardsArrastaveis.titulo')} icone="grip-vertical" trilha />
      <p className="demo-bloco-desc demo-arrasta-ajuda">{t('paginas.cardsArrastaveis.textos.arrastePelaAlca')}<span aria-hidden="true">⋮⋮</span>{t('paginas.cardsArrastaveis.textos.paraReordenarOuTrocar')}</p>
      <QuadroArrastavel colunas={colunas} aoMudar={setColunas} renderItem={(item, alca) => conteudo(item, alca, t)} nomeItem={(i) => i.nome} />
      <div>
        <Botao rotulo={t('paginas.cardsArrastaveis.textos.voltarAOrdemInicial')} icone="rotate-cw" aparencia="texto" formato="retangulo" onClick={() => setColunas(INICIAL(t))} />
      </div>
    </div>
  );
}
