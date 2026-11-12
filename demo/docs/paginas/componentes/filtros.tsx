import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Filtros"
      icone="funnel"
      componente="Filtros"
      importar={['type FiltroAplicado']}
      resumo="Barra de filtros de listagem: campos, Consultar, Limpar e os chips dos filtros aplicados."
      notas={
        <ul className="doc-lista">
          <li>
            Separe o rascunho (o que está nos campos) do aplicado (o que a listagem usa). <C>alterado</C> avisa que há mudança ainda não
            consultada.
          </li>
          <li>
            É um <C>{'<form>'}</C>: Enter em qualquer campo consulta.
          </li>
          <li>
            Use os campos com <C>variante="inline"</C>, que cabem numa linha. Com muitos filtros, <C>aparencia="secao"</C> vira uma
            moldura com legenda.
          </li>
          <li>
            Cada chip remove o próprio filtro (<C>aoRemover</C>) e consulta de novo.
          </li>
        </ul>
      }
    >
      <Exemplo id="filtros/Basico" titulo="Básico">
        Mude um campo para ver o aviso de alteração; consulte para ver os chips.
      </Exemplo>
    </PaginaComponente>
  );
}
