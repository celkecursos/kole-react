import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Girador"
      icone="loader-circle"
      componente="Girador"
      resumo="Indicador de atividade em três formas (anel, pulso, pontos), com cor e tamanho."
      notas={
        <ul className="doc-lista">
          <li>
            O <C>rotulo</C> é sempre anunciado ao leitor de tela (<C>role="status"</C>); <C>mostrarRotulo</C> também o mostra na tela.
          </li>
          <li>
            Dentro de botão, use o <C>carregando</C> do <C>Botao</C>, que já troca o ícone pelo girador.
          </li>
          <li>
            <C>tamanho</C> aceita também uma medida CSS (<C>"3rem"</C>).
          </li>
        </ul>
      }
    >
      <Exemplo id="girador/Basico" titulo="Formas, cores e tamanhos" />
    </PaginaComponente>
  );
}
