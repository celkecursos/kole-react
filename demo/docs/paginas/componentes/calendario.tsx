import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="calendario"
      icone="calendar"
      componente="Calendario"
      outros={['MiniCalendario']}
      tipos={['EventoCalendario', 'PeriodoCalendario', 'MudancaEvento', 'RegraRepeticao', 'RascunhoCalendario', 'IntervaloHorario']}
      importar={['type EventoCalendario', 'MiniCalendario', 'repetirEvento']}
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
            Com <C>aoAlterarEvento</C>, os eventos podem ser arrastados para outro dia ou horário (de 15 em 15 minutos) e a borda de baixo
            do bloco estica a duração. No toque, segure o evento antes de arrastar; Esc cancela. O app grava e devolve a lista nova;
            <C>fixo</C> trava um evento.
          </li>
          <li>
            Cadastro: <C>aoSelecionarHorario</C> recebe o intervalo escolhido na semana e no dia (arrastando sobre horários vazios, de 15 em
            15 minutos; um clique escolhe a meia hora; no cursor, Shift+↑↓ aumentam e Enter confirma). Abra o formulário com ele e passe
            os dados em <C>rascunho</C>: o evento aparece tracejado enquanto o diálogo está aberto. O formulário fica no app; o exemplo
            "Cadastro e edição" traz um pronto para copiar.
          </li>
          <li>
            Eventos que se repetem são calculados pelo app: <C>repetirEvento(base, regra, periodo)</C> devolve as ocorrências do período
            (diária, semanal com <C>diasSemana</C>, mensal ou anual, com <C>intervalo</C>, <C>ate</C>, <C>vezes</C> e <C>excecoes</C>).
            Cada uma traz <C>serie</C> com o id da base. Para mudar só uma ocorrência, ponha o dia em <C>excecoes</C> e crie um evento avulso.
          </li>
          <li>
            <C>MiniCalendario</C> escolhe o dia (<C>aoEscolher</C>), mostra bolinhas nos <C>marcados</C> e destaca a semana visível
            (<C>destaque</C>). Ligue o dia escolhido à prop <C>data</C> do calendário.
          </li>
          <li>
            Teclado: no mês, setas andam pelos dias e Page Up/Down trocam de mês; na semana e no dia, um cursor de 30 minutos anda com as setas e
            Enter escolhe o horário. Num evento, Alt+setas movem e Alt+Shift+↑↓ esticam.
          </li>
        </ul>
      }
    >
      <Exemplo id="calendario/Mes" titulo="Visão mês" />
      <Exemplo id="calendario/Semana" titulo="Visão semana" />
      <Exemplo id="calendario/Lista" titulo="Visão lista" />
      <Exemplo id="calendario/Arrastar" titulo="Arrastar e esticar" />
      <Exemplo id="calendario/Repetir" titulo="Série semanal e minicalendário" />
      <Exemplo id="calendario/Cadastro" titulo="Cadastro e edição (com Repete)" />
    </PaginaComponente>
  );
}
