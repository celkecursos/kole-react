import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Formulário"
      icone="file-pen"
      componente="Form"
      outros={['FormSecao']}
      resumo="Moldura de cadastro: em página (com menu lateral de etapas) ou em modal. Traz título, Salvar/Cancelar, pendências e a grade dos campos."
      notas={
        <ul className="doc-lista">
          <li>
            Ao salvar, o <C>Form</C> revela as pendências de todos os campos de dentro (obrigatório vazio, <C>validar</C> com erro), mesmo
            os que ninguém tocou. A regra de negócio fica no <C>aoSalvar</C> do app.
          </li>
          <li>
            Com <C>entidade="cliente"</C> e <C>modo</C>, o título sai sozinho: "Cadastrar cliente", "Editar cliente", "Visualizar
            cliente".
          </li>
          <li>
            Em página, <C>menu</C> + <C>menuAtivo</C> mostram as etapas ao lado, com contagem de <C>pendencias</C> por etapa.
          </li>
          <li>
            Na grade da <C>FormSecao</C>, <C>lp-col-2</C>, <C>lp-col-3</C> e <C>lp-col-full</C> fazem o campo ocupar mais colunas. No
            celular, tudo vira uma coluna.
          </li>
        </ul>
      }
    >
      <Exemplo id="form/Modal" titulo="Em modal">
        Clique em Salvar sem preencher para ver as pendências aparecerem.
      </Exemplo>
      <Exemplo id="form/Secoes" titulo="Seções e grade" />
    </PaginaComponente>
  );
}
