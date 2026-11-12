import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Carregando"
      icone="loader-circle"
      componente="Carregando"
      resumo="Aviso de espera com animação e mensagem, numa área ou cobrindo a tela inteira (bloqueante)."
      notas={
        <ul className="doc-lista">
          <li>
            <C>bloqueante</C> é para quando nada na tela pode ser usado (gerar arquivo, trocar de empresa): segura o foco e devolve ao
            terminar.
          </li>
          <li>
            Na primeira carga de listas, prefira o <C>carregando</C> da <C>Tabela</C> e da <C>ListaCards</C>, que mostram silhuetas
            (<C>Skeleton</C>).
          </li>
          <li>
            Tem <C>role="status"</C>: o leitor de tela anuncia a mensagem. <C>logo</C> troca a animação pelo logotipo do app.
          </li>
        </ul>
      }
    >
      <Exemplo id="carregando/Basico" titulo="Em área e bloqueante" />
    </PaginaComponente>
  );
}
