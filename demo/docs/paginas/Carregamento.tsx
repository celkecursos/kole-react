import { Tabela } from '../../../src';
import { C } from '../Codigo';
import { Exemplo } from '../Exemplo';
import { PaginaGuia, Secao } from '../PaginaDoc';

const QUAL_USAR = [
  { id: 1, situacao: 'Salvar um formulário', usar: 'Form com salvando', porque: 'O Salvar gira e recusa clique repetido; o Cancelar fica desabilitado.' },
  { id: 2, situacao: 'Ação de um botão', usar: 'Botao ou AcaoLinha com carregando', porque: 'O botão continua focável e não dispara de novo.' },
  { id: 3, situacao: 'Abrir uma página ou card', usar: 'Skeleton', porque: 'A silhueta tem o formato do conteúdo: a página não pula.' },
  { id: 4, situacao: 'Primeira carga de lista', usar: 'Tabela / ListaCards com carregando', porque: 'Silhuetas no lugar das linhas, já prontas.' },
  { id: 5, situacao: 'Paginar, ordenar, filtrar', usar: 'Tabela / ListaCards com atualizando', porque: 'Mantém os dados atuais esmaecidos, sem piscar.' },
  { id: 6, situacao: 'Área sem formato conhecido', usar: 'Carregando', porque: 'Mensagem e animação no lugar da área.' },
  { id: 7, situacao: 'Nada na tela pode ser usado', usar: 'Carregando bloqueante', porque: 'Cobre a tela e segura o foco até terminar.' },
  { id: 8, situacao: 'Sabe quanto falta', usar: 'Progresso', porque: 'Upload e importação: a pessoa vê o andamento.' },
  { id: 9, situacao: 'Cards de painel e gráficos', usar: 'Indicador / gráficos com carregando', porque: 'Cada card carrega sozinho; o painel aparece aos poucos.' },
  { id: 10, situacao: 'Trecho pequeno, inline', usar: 'Girador', porque: 'Indicador avulso, com rótulo para leitor de tela.' },
];

export function DocCarregamento() {
  return (
    <PaginaGuia
      titulo="Carregamento"
      icone="loader-circle"
      resumo="Qual loading usar em cada situação: ao salvar, ao abrir uma página, ao paginar uma lista, ao gerar um arquivo. Os componentes já trazem o estado de espera; o app só liga a prop."
    >
      <Secao id="qual-usar" titulo="Qual usar">
        <Tabela
          rotulo="Qual loading usar em cada situação"
          registros={QUAL_USAR}
          colunas={[
            { campo: 'situacao', rotulo: 'Situação', destaque: true },
            { campo: 'usar', rotulo: 'Use' },
            { campo: 'porque', rotulo: 'Por quê' },
          ]}
        />
        <p className="doc-p">
          Regra geral: prefira o loading mais local possível. Bloquear a tela inteira só quando a pessoa realmente não pode fazer mais
          nada; silhueta quando se sabe o formato do que vem; girador quando não se sabe.
        </p>
      </Secao>

      <Secao id="formulario" titulo="Ao salvar">
        <Exemplo id="carregamento/Formulario" titulo="Formulário salvando">
          Clique em Salvar: <C>salvando</C> segura o formulário até a resposta.
        </Exemplo>
        <Exemplo id="carregamento/Botao" titulo="Botão e ação de linha">
          Para ações fora de formulário. <C>carregando</C> mantém o foco no botão e recusa o segundo clique.
        </Exemplo>
      </Secao>

      <Secao id="pagina" titulo="Ao abrir uma página">
        <Exemplo id="carregamento/Pagina" titulo="Silhueta do conteúdo">
          <C>Skeleton</C> no formato dos dados e <C>aria-busy</C> na área enquanto carrega.
        </Exemplo>
        <Exemplo id="carregamento/Area" titulo="Área e tela inteira">
          <C>Carregando</C> numa área quando não há formato a imitar; <C>bloqueante</C> para operações que travam a tela.
        </Exemplo>
      </Secao>

      <Secao id="listas" titulo="Em listas">
        <Exemplo id="carregamento/Lista" titulo="Primeira carga e paginação">
          <C>carregando</C> só na primeira vez; ao paginar ou filtrar, <C>atualizando</C> mantém o que já está na tela.
        </Exemplo>
      </Secao>

      <Secao id="andamento" titulo="Andamento e painéis">
        <Exemplo id="carregamento/Progresso" titulo="Com progresso">
          Quando dá para medir: upload, importação, processamento em lotes.
        </Exemplo>
        <Exemplo id="carregamento/Painel" titulo="Indicadores e girador" />
      </Secao>

      <Secao id="acessibilidade" titulo="Acessibilidade">
        <ul className="doc-lista">
          <li>
            <C>Carregando</C> e <C>Girador</C> têm <C>role="status"</C>: o leitor de tela anuncia a mensagem.
          </li>
          <li>
            <C>Skeleton</C> é decorativo: marque a área com <C>aria-busy</C> enquanto carrega.
          </li>
          <li>
            Botão com <C>carregando</C> ganha <C>aria-busy</C> e continua no Tab, em vez de sumir do foco como no <C>disabled</C>.
          </li>
          <li>Depois de carregar, avise o resultado quando ele não for óbvio na tela (toast de "Salvo", alerta de erro).</li>
        </ul>
      </Secao>
    </PaginaGuia>
  );
}
