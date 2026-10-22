import { CabecalhoPagina, Carrossel, type SlideCarrossel } from '../../../src';
import { Bloco, cena } from '../Bloco';

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
  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Carrossel" icone="image" trilha />

      <div className="demo-colunas-3">
        <Bloco titulo="Só os slides" descricao="Avança sozinho; o botão no canto pausa.">
          <Carrossel rotulo="Só os slides" slides={IMAGENS} />
        </Bloco>
        <Bloco titulo="Com controles" descricao="Setas de anterior e próximo.">
          <Carrossel rotulo="Com controles" slides={IMAGENS} controles />
        </Bloco>
        <Bloco titulo="Com indicadores" descricao="Tracinhos que levam a cada slide.">
          <Carrossel rotulo="Com indicadores" slides={IMAGENS} controles indicadores />
        </Bloco>

        <Bloco titulo="Com legendas">
          <Carrossel rotulo="Com legendas" slides={comLegendas(IMAGENS)} controles indicadores />
        </Bloco>
        <Bloco titulo="Esmaecer" descricao="Troca com esmaecimento em vez de deslizar.">
          <Carrossel rotulo="Esmaecer" slides={IMAGENS} controles transicao="esmaecer" />
        </Bloco>
        <Bloco titulo="Intervalo por slide" descricao="O primeiro fica 10 s, o segundo 2 s, o terceiro o padrão (5 s).">
          <Carrossel rotulo="Intervalo por slide" slides={IMAGENS.map((s, i) => ({ ...s, intervalo: [10000, 2000, undefined][i] }))} controles />
        </Bloco>

        <Bloco titulo="Sem arrastar" descricao="Desliga a troca por arraste; só pelos controles, sem avanço automático.">
          <Carrossel rotulo="Sem arrastar" slides={IMAGENS} controles arrastar={false} automatico={false} />
        </Bloco>
        <Bloco titulo="Variante escura" descricao="Controles e legendas escuros, para imagens claras.">
          <Carrossel rotulo="Variante escura" slides={comLegendas(CLARAS)} controles indicadores escuro />
        </Bloco>
      </div>
    </div>
  );
}
