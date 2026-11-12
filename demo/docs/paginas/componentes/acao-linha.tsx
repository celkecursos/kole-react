import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Ação de linha"
      icone="pencil"
      componente="AcaoLinha"
      resumo="Botão só com ícone para as ações de cada linha de uma tabela ou lista: visualizar, editar, excluir."
      notas={
        <ul className="doc-lista">
          <li>
            Use dentro da prop <C>acoes</C> da <C>Tabela</C>, que reserva a última coluna para elas.
          </li>
          <li>
            O <C>rotulo</C> é obrigatório: vira o nome acessível e a dica do botão.
          </li>
          <li>Mantenha a mesma ordem e as mesmas cores em todas as telas (ver, editar, excluir).</li>
        </ul>
      }
    >
      <Exemplo id="acao-linha/Basico" titulo="Básico" />
    </PaginaComponente>
  );
}
