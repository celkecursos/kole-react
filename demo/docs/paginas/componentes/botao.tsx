import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Botão"
      icone="square-mouse-pointer"
      componente="Botao"
      resumo="Dispara uma ação. Tem oito cores, seis aparências, três tamanhos, ícone, estado de carregando e modo alternância."
      padroes={{ severidade: "'pri'", aparencia: "'solido'", formato: "'pilula'", tamanho: "'medio'", type: "'button'" }}
      notas={
        <ul className="doc-lista">
          <li>
            Use uma única ação <C>pri</C> sólida por área da tela; as demais em <C>contorno</C>, <C>suave</C> ou <C>texto</C>.
          </li>
          <li>
            Botão só com ícone precisa de <C>aria-label</C> (o nome que o leitor de tela anuncia) e de <C>dica</C> (o balão para quem
            enxerga).
          </li>
          <li>
            O padrão é <C>type="button"</C>: dentro de um formulário, passe <C>type="submit"</C> no botão que envia.
          </li>
          <li>
            Com <C>carregando</C>, o botão continua focável e recusa o clique (<C>aria-busy</C>), em vez de sumir do foco como no{' '}
            <C>disabled</C>.
          </li>
          <li>
            Para padronizar vários botões de uma vez (cor, tamanho), use o <C>GrupoBotoes</C>.
          </li>
        </ul>
      }
    >
      <Exemplo id="botao/Basico" titulo="Básico" />
      <Exemplo id="botao/Cores" titulo="Cores">
        A prop <C>severidade</C> escolhe a cor. O padrão é <C>pri</C>, o azul de ação.
      </Exemplo>
      <Exemplo id="botao/Aparencias" titulo="Aparências">
        A prop <C>aparencia</C> muda o peso visual sem trocar a cor.
      </Exemplo>
      <Exemplo id="botao/Tamanhos" titulo="Tamanhos e formato" />
      <Exemplo id="botao/Icones" titulo="Com ícone">
        Qualquer ícone do Lucide pelo nome. <C>iconeDestacado</C> coloca o ícone num segmento mais escuro.
      </Exemplo>
      <Exemplo id="botao/Estados" titulo="Carregando, desabilitado e alternância" />
    </PaginaComponente>
  );
}
