import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Calendário"
      icone="calendar"
      componente="Calendario"
      tipos={['EventoCalendario', 'PeriodoCalendario']}
      importar={['type EventoCalendario']}
      resumo="Agenda de eventos nas visões mês, semana, dia e lista, em pt-BR. O app guarda e busca os eventos; o calendário mostra e avisa os cliques."
      notas={
        <ul className="doc-lista">
          <li>
            <C>aoMudarPeriodo</C> avisa o período visível (ao abrir e a cada troca de mês, semana, dia ou visão): busque só os eventos dele.
          </li>
          <li>
            Na semana e no dia, os eventos ficam pela hora, lado a lado quando se sobrepõem; os de <C>diaInteiro</C> vão para a faixa do topo, e a
            linha vermelha marca a hora atual. <C>aoClicarHorario</C> recebe o horário clicado, arredondado para a meia hora.
          </li>
          <li>
            <C>cor</C> usa os tokens: <C>pri</C>, <C>ok</C>, <C>warn</C>, <C>err</C>, <C>info</C>, <C>destaque</C> e <C>graf-1</C> a <C>graf-6</C>.
          </li>
          <li>
            Teclado: no mês, setas andam pelos dias e Page Up/Down trocam de mês; na semana e no dia, um cursor de 30 minutos anda com as setas e
            Enter escolhe o horário.
          </li>
        </ul>
      }
    >
      <Exemplo id="calendario/Mes" titulo="Visão mês" />
      <Exemplo id="calendario/Semana" titulo="Visão semana" />
      <Exemplo id="calendario/Lista" titulo="Visão lista" />
    </PaginaComponente>
  );
}
