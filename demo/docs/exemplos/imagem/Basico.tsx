import { Figura, Imagem } from '../../../../src';
import { cena } from '../card/cena';

export default function Exemplo() {
  return (
    <div className="demo-grade-2">
      <Imagem src={cena('#9cc3f5', '#2f7d4f')} alt="Campo verde sob céu azul" cantos="arredondado" proporcao="16 / 9" />
      <Figura
        src={cena('#f5b49c', '#7d4f2f')}
        alt="Morros ao entardecer"
        legenda="Depósito de Ponta Grossa, inaugurado em 2026."
        proporcao="16 / 9"
      />
      <Imagem src={cena('#b9a5f5', '#4f2f7d')} alt="Miniatura" miniatura largura="8rem" />
      <Imagem src={cena('#9cf5d8', '#2f7d6a')} alt="Recorte em círculo" cantos="circulo" largura="8rem" proporcao="1" />
    </div>
  );
}
