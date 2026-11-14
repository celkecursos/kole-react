import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="boasVindas"
      icone="house"
      componente="BoasVindas"
      notas={
        <ul className="doc-lista">
          <li>
            A saudação usa o primeiro e o último nome (<C>nomeCurto</C>) e é calculada uma vez, ao abrir. Sem <C>foto</C>, entram as
            iniciais.
          </li>
          <li>
            <C>ultimoAcesso</C> ajuda a pessoa a notar um acesso que não foi dela.
          </li>
        </ul>
      }
    >
      <Exemplo id="boas-vindas/Basico" titulo="Básico" />
    </PaginaComponente>
  );
}
