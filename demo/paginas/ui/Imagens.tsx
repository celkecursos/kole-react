import { Avatar, CabecalhoPagina, Figura, Foto, Imagem, Status, type Anexo } from '../../../src';
import { Bloco, cena, retrato } from '../Bloco';
import { useT, type TradutorDemo } from '../../i18n/useT';

const FOTOS: Anexo[] = [
  { nome: 'frente.svg', tamanho: 18_000, tipo: 'image/svg+xml', url: retrato('#0b1a36', 'AP') },
  { nome: 'perfil.svg', tamanho: 17_500, tipo: 'image/svg+xml', url: retrato('#1f5fe0', 'AP') },
  { nome: 'lateral.svg', tamanho: 17_900, tipo: 'image/svg+xml', url: retrato('#f7931e', 'AP') },
];

const IMG = {
  mar: cena('#1f5fe0', '#0b1a36'),
  tarde: cena('#f7931e', '#7a2e0e', '#fff3c4'),
  campo: cena('#4fb3e8', '#15803d'),
  noite: cena('#0b1a36', '#1f2a44', '#e8eef8'),
  rosa: cena('#e879a6', '#5b2140'),
  deserto: cena('#f2c86b', '#a85d1e', '#fff8e1'),
  floresta: cena('#7cc4a0', '#14532d', '#fef3c7'),
};

const TEXTO = (t: TradutorDemo['t']) => (t('paginas.imagens.textos.textoDeExemploCorrendo'));

export function PaginaImagens() {
  const { t } = useT();
  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.imagens.titulo')} icone="image" trilha />

      <div className="demo-colunas-3">
        <Bloco titulo={t('paginas.imagens.secoes.imagemResponsiva')} descricao={t('paginas.imagens.textos.encolheParaCaberNo')}>
          <div>
            <Imagem src={IMG.mar} alt={t('paginas.imagens.textos.paisagemAzulComSol')} proporcao="1 / 1" largura="12.5rem" />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.imagens.secoes.comCantosArredondados')} descricao={<>cantos=&quot;arredondado&quot;</>}>
          <div>
            <Imagem src={IMG.tarde} alt={t('paginas.imagens.textos.paisagemAoEntardecer')} cantos="arredondado" proporcao="1 / 1" largura="12.5rem" />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.imagens.secoes.imagemRedonda')} descricao={<>cantos=&quot;circulo&quot; com proporção 1 / 1.</>}>
          <div>
            <Imagem src={IMG.campo} alt={t('paginas.imagens.textos.paisagemDeCampo')} cantos="circulo" proporcao="1 / 1" largura="12.5rem" />
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-3">
        <Bloco titulo={t('paginas.imagens.secoes.alinhadaAEsquerda')}>
          <div className="demo-img-fluxo">
            <Imagem src={IMG.rosa} alt={t('paginas.imagens.textos.paisagemRosada')} cantos="arredondado" alinhamento="esquerda" proporcao="1 / 1" largura="8rem" />
            <p>{TEXTO(t)}</p>
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.imagens.secoes.centralizada')}>
          <div>
            <Imagem src={IMG.floresta} alt={t('paginas.imagens.textos.paisagemVerde')} cantos="arredondado" alinhamento="centro" proporcao="1 / 1" largura="12.5rem" />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.imagens.secoes.alinhadaADireita')}>
          <div className="demo-img-fluxo">
            <Imagem src={IMG.deserto} alt={t('paginas.imagens.textos.paisagemDeDeserto')} cantos="arredondado" alinhamento="direita" proporcao="1 / 1" largura="8rem" />
            <p>{TEXTO(t)}</p>
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-4">
        <div className="demo-span-2">
          <Bloco titulo={t('paginas.imagens.secoes.figuras')} descricao={t('paginas.imagens.textos.imagemComLegendaA')}>
            <div className="demo-img-fluxo">
              <Figura src={IMG.noite} alt={t('paginas.imagens.textos.paisagemNoturna')} legenda={t('paginas.imagens.textos.umaLegendaParaA')} proporcao="4 / 3" largura="12rem" />
              <Figura
                src={IMG.mar}
                alt={t('paginas.imagens.textos.paisagemAzul')}
                legenda={t('paginas.imagens.textos.umaLegendaParaA')}
                alinhamentoLegenda="fim"
                alinhamento="direita"
                proporcao="4 / 3"
                largura="12rem"
              />
            </div>
          </Bloco>
        </div>
        <Bloco titulo={t('paginas.imagens.secoes.miniatura')} descricao={t('paginas.imagens.textos.bordaFinaERespiro')}>
          <div>
            <Imagem src={IMG.campo} alt={t('paginas.imagens.textos.paisagemDeCampo')} miniatura proporcao="1 / 1" largura="10rem" />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.imagens.secoes.miniaturaRedonda')}>
          <div>
            <Imagem src={IMG.tarde} alt={t('paginas.imagens.textos.paisagemAoEntardecer')} miniatura cantos="circulo" proporcao="1 / 1" largura="10rem" />
          </div>
        </Bloco>
      </div>

      <Bloco titulo={t('paginas.imagens.secoes.recorteEmProporcao')} descricao={t('paginas.imagens.textos.aMesmaImagemRecortada')}>
        <div className="demo-linha">
          {['1 / 1', '4 / 3', '16 / 9', '3 / 4'].map((p) => (
            <Figura key={p} src={IMG.deserto} alt={t('paginas.imagens.textos.recorteP', { p })} legenda={p} alinhamentoLegenda="centro" proporcao={p} largura="11rem" />
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.imagens.secoes.avatares')} descricao={t('paginas.imagens.textos.iniciaisDoNomeQuando')}>
          <div className="demo-linha demo-linha--centro">
            <Avatar nome="Ana Pereira" />
            <Avatar nome="Bruno Lima" tom="escuro" />
            <Avatar nome="Carla Dias" formato="quadrado" tamanho="2.5rem" />
            <Avatar nome="Daniel Moreira" foto={retrato('#15803d', 'DM')} tamanho="3rem" />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.imagens.secoes.foto')} descricao={t('paginas.imagens.textos.tamanhosSmMdE')}>
          <div className="demo-linha">
            <Foto nome="Ana Pereira" fotos={FOTOS[0].url} tamanho="sm" />
            <Foto
              nome="Ana Pereira"
              fotos={FOTOS}
              ampliavel
              sobreposto={
                <span style={{ position: 'absolute', left: 6, top: 6 }}>
                  <Status rotulo={t('paginas.imagens.textos.t3Fotos')} severidade="info" />
                </span>
              }
            />
            <Foto nome="Ana Pereira" fotos={FOTOS[2]} tamanho="lg" ampliavel />
            <Foto nome="Bruno Lima" />
            <Foto nome="Carla Dias" semFoto={<span style={{ fontSize: 'var(--fs-caption)', color: 'var(--t4)' }}>{t('paginas.imagens.textos.fotoIndisponivel')}</span>} />
          </div>
        </Bloco>
      </div>
    </div>
  );
}
