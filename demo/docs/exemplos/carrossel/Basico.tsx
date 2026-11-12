import { Carrossel, type SlideCarrossel } from '../../../../src';
import { cena } from '../card/cena';

const SLIDES: SlideCarrossel[] = [
  { imagem: cena('#9cc3f5', '#2f7d4f'), alt: 'Campo verde', titulo: 'Campanha de inverno', descricao: 'Até 20% em bebidas quentes.' },
  { imagem: cena('#f5b49c', '#7d4f2f'), alt: 'Morros ao entardecer', titulo: 'Frete grátis', descricao: 'Acima de R$ 300.' },
  { imagem: cena('#b9a5f5', '#4f2f7d'), alt: 'Céu lilás', titulo: 'Novo aplicativo', descricao: 'Peça pelo celular.' },
];

export default function Exemplo() {
  return <Carrossel rotulo="Destaques da loja" slides={SLIDES} controles indicadores automatico={false} proporcao="16 / 7" />;
}
