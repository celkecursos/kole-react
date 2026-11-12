import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Referências"
      icone="link"
      componente="Referencias"
      importar={['type ItemReferencia']}
      resumo="Lista recolhível das fontes de uma resposta (assistente, busca): título, detalhe, trecho e link."
      notas={
        <ul className="doc-lista">
          <li>
            Combina com a <C>Mensagem</C> da <C>Conversa</C>: passe no <C>rodape</C> da mensagem do assistente.
          </li>
          <li>
            O trecho longo fica cortado, com "Mostrar trecho completo". Troque os textos com <C>rotulo</C>, <C>rotuloMostrarMais</C> e{' '}
            <C>rotuloMostrarMenos</C>.
          </li>
        </ul>
      }
    >
      <Exemplo id="referencias/Basico" titulo="Básico" />
    </PaginaComponente>
  );
}
