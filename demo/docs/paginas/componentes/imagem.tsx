import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="imagem"
      icone="image"
      componente="Imagem"
      outros={['Figura']}
      notas={
        <ul className="doc-lista">
          <li>
            <C>alt</C> é obrigatório: descreva o que a imagem mostra. Para imagem só decorativa, passe <C>alt=""</C>.
          </li>
          <li>
            <C>proporcao</C> reserva o espaço antes de a imagem carregar, e a página não pula.
          </li>
          <li>
            Fotos de pessoas ou registros, com várias imagens e ampliação, ficam melhor na <C>Foto</C>.
          </li>
        </ul>
      }
    >
      <Exemplo id="imagem/Basico" titulo="Variações" />
    </PaginaComponente>
  );
}
