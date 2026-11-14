import { CabecalhoPagina, Carrossel, type SlideCarrossel } from '../../../src';
import { Bloco, cena } from '../Bloco';
import { useT } from '../../i18n/useT';

const IMAGENS = [
  { imagem: cena('#1f5fe0', '#0b1a36'), alt: 'Paisagem azul ao anoitecer' },
  { imagem: cena('#f7931e', '#7a2e0e', '#fff3c4'), alt: 'Paisagem laranja ao entardecer' },
  { imagem: cena('#4fb3e8', '#15803d'), alt: 'Campo verde sob céu azul' },
];

/** Imagens claras, para a variante escura. */
const CLARAS = [
  { imagem: cena('#dbeafe', '#93c5fd', '#fde68a'), alt: 'Paisagem azul-clara' },
  { imagem: cena('#fef3c7', '#fcd34d', '#fb923c'), alt: 'Paisagem amarela' },
  { imagem: cena('#dcfce7', '#86efac', '#fde68a'), alt: 'Paisagem verde-clara' },
];

const LEGENDAS = [
  { titulo: 'Primeiro slide', descricao: 'Um conteúdo de exemplo para o primeiro slide.' },
  { titulo: 'Segundo slide', descricao: 'Um conteúdo de exemplo para o segundo slide.' },
  { titulo: 'Terceiro slide', descricao: 'Um conteúdo de exemplo para o terceiro slide.' },
];

const comLegendas = (base: typeof IMAGENS): SlideCarrossel[] => base.map((s, i) => ({ ...s, ...LEGENDAS[i] }));

export function PaginaCarrosseis() {
  const { t } = useT();
  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.carrossel.titulo')} icone="image" trilha />

      <div className="demo-colunas-3">
        <Bloco titulo={t('paginas.carrossel.secoes.soOsSlides')} descricao={t('paginas.carrossel.textos.avancaSozinhoOBotao')}>
          <Carrossel rotulo={t('paginas.carrossel.textos.soOsSlides')} slides={IMAGENS} />
        </Bloco>
        <Bloco titulo={t('paginas.carrossel.secoes.comControles')} descricao={t('paginas.carrossel.textos.setasDeAnteriorE')}>
          <Carrossel rotulo={t('paginas.carrossel.textos.comControles')} slides={IMAGENS} controles />
        </Bloco>
        <Bloco titulo={t('paginas.carrossel.secoes.comIndicadores')} descricao={t('paginas.carrossel.textos.tracinhosQueLevamA')}>
          <Carrossel rotulo={t('paginas.carrossel.textos.comIndicadores')} slides={IMAGENS} controles indicadores />
        </Bloco>

        <Bloco titulo={t('paginas.carrossel.secoes.comLegendas')}>
          <Carrossel rotulo={t('paginas.carrossel.textos.comLegendas')} slides={comLegendas(IMAGENS)} controles indicadores />
        </Bloco>
        <Bloco titulo={t('paginas.carrossel.secoes.esmaecer')} descricao={t('paginas.carrossel.textos.trocaComEsmaecimentoEm')}>
          <Carrossel rotulo={t('paginas.carrossel.textos.esmaecer')} slides={IMAGENS} controles transicao="esmaecer" />
        </Bloco>
        <Bloco titulo={t('paginas.carrossel.secoes.intervaloPorSlide')} descricao={t('paginas.carrossel.textos.oPrimeiroFica10')}>
          <Carrossel rotulo={t('paginas.carrossel.textos.intervaloPorSlide')} slides={IMAGENS.map((s, i) => ({ ...s, intervalo: [10000, 2000, undefined][i] }))} controles />
        </Bloco>

        <Bloco titulo={t('paginas.carrossel.secoes.semArrastar')} descricao={t('paginas.carrossel.textos.desligaATrocaPor')}>
          <Carrossel rotulo={t('paginas.carrossel.textos.semArrastar')} slides={IMAGENS} controles arrastar={false} automatico={false} />
        </Bloco>
        <Bloco titulo={t('paginas.carrossel.secoes.varianteEscura')} descricao={t('paginas.carrossel.textos.controlesELegendasEscuros')}>
          <Carrossel rotulo={t('paginas.carrossel.textos.varianteEscura')} slides={comLegendas(CLARAS)} controles indicadores escuro />
        </Bloco>
      </div>
    </div>
  );
}
