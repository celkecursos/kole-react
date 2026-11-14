import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="carrossel"
      icone="image"
      componente="Carrossel"
      importar={['type SlideCarrossel']}
      notas={
        <ul className="doc-lista">
          <li>
            A troca automática pausa com o mouse ou o foco em cima e respeita a preferência de movimento reduzido do sistema.
          </li>
          <li>
            Informação importante não deve ficar só num slide: muita gente não espera a troca.
          </li>
          <li>
            Cada slide precisa de <C>alt</C>; o <C>rotulo</C> dá nome ao carrossel inteiro.
          </li>
        </ul>
      }
    >
      <Exemplo id="carrossel/Basico" titulo="Com controles e indicadores" />
    </PaginaComponente>
  );
}
