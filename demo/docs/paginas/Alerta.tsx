import { C } from '../Codigo';
import { Exemplo } from '../Exemplo';
import { PaginaComponente } from '../PaginaDoc';

export function DocAlerta() {
  return (
    <PaginaComponente
      titulo="Alerta"
      icone="triangle-alert"
      componente="Alerta"
      resumo="Mensagem fixa na página: informação, sucesso, atenção ou erro. Para avisos passageiros, use o toast."
      notas={
        <ul className="doc-lista">
          <li>
            <C>dispensavel</C> some sozinho ao clicar no ×; com <C>aoFechar</C>, quem decide é o app (por exemplo, lembrar que a pessoa já
            dispensou).
          </li>
          <li>
            O ícone vem da severidade. Troque com <C>icone</C> ou tire com <C>{'icone={false}'}</C>.
          </li>
          <li>Retorno de uma ação (salvou, excluiu) é toast; o alerta é para o que precisa continuar visível.</li>
        </ul>
      }
    >
      <Exemplo id="alerta/Severidades" titulo="Severidades" />
      <Exemplo id="alerta/Aparencias" titulo="Aparências" />
      <Exemplo id="alerta/Acoes" titulo="Com ação e fechar" />
    </PaginaComponente>
  );
}
