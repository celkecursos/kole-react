import { useMemo, useState } from 'react';
import {
  Botao,
  CabecalhoPagina,
  Calendario,
  Card,
  Detalhes,
  Dialogo,
  MiniCalendario,
  repetirEvento,
  useToast,
  type EventoCalendario,
  type MudancaEvento,
  type PeriodoCalendario,
  type RegraRepeticao,
} from '../../../src';
import { DialogoEvento, useAgenda } from '../../docs/exemplos/calendario/Cadastro';
import { Bloco } from '../Bloco';
import { useT } from '../../i18n/useT';

/*
 * Agenda fictícia de vendas, montada a partir do mês atual (o teste visual fixa
 * o relógio, então o calendário sai sempre igual).
 */
function agendaDoMes(base: Date): EventoCalendario[] {
  const a = base.getFullYear();
  const m = base.getMonth();
  const em = (dia: number, h = 0, min = 0) => new Date(a, m, dia, h, min);
  return [
    { id: 1, titulo: 'Inventário do estoque', inicio: em(2), fim: em(3, 23, 59), diaInteiro: true, cor: 'warn', categoria: 'Estoque' },
    { id: 2, titulo: 'Entrega · Mercado Bom Preço', inicio: em(4, 9), fim: em(4, 11), cor: 'ok', categoria: 'Entrega' },
    { id: 3, titulo: 'Visita · Padaria Pão Dourado', inicio: em(6, 14, 30), fim: em(6, 15, 30), cor: 'graf-4', categoria: 'Visita' },
    { id: 4, titulo: 'Reunião de vendas', inicio: em(9, 8, 30), fim: em(9, 9, 30), cor: 'pri', categoria: 'Reunião' },
    { id: 5, titulo: 'Entrega · Farmácia Vida Plena', inicio: em(9, 10), fim: em(9, 12), cor: 'ok', categoria: 'Entrega' },
    { id: 6, titulo: 'Visita · Construtora Alicerce', inicio: em(9, 14), cor: 'graf-4', categoria: 'Visita' },
    { id: 7, titulo: 'Ligação · Loja Casa & Cia', inicio: em(9, 16), cor: 'info', categoria: 'Ligação' },
    { id: 8, titulo: 'Fechamento do caixa', inicio: em(9, 18), cor: 'destaque', categoria: 'Financeiro' },
    { id: 9, titulo: 'Promoção de Pix', inicio: em(12), fim: em(18, 23, 59), diaInteiro: true, cor: 'graf-2', categoria: 'Marketing' },
    { id: 10, titulo: 'Entrega · Restaurante Sabor Caseiro', inicio: em(15, 9), cor: 'ok', categoria: 'Entrega' },
    { id: 11, titulo: 'Prazo · boletos do mês', inicio: em(20), diaInteiro: true, cor: 'err', categoria: 'Financeiro' },
    { id: 12, titulo: 'Treinamento da equipe', inicio: em(22, 13), fim: em(22, 17), cor: 'pri', categoria: 'Reunião' },
    { id: 13, titulo: 'Visita · Clínica Bem-Estar', inicio: em(25, 10), cor: 'graf-4', categoria: 'Visita' },
    { id: 14, titulo: 'Entrega · Distribuidora Litoral', inicio: em(27, 8), fim: em(27, 10), cor: 'ok', categoria: 'Entrega' },
    { id: 15, titulo: 'Reunião de resultados', inicio: em(28, 15), fim: em(28, 16, 30), cor: 'pri', categoria: 'Reunião' },
  ];
}

/** Agenda em volta de hoje, com eventos que se sobrepõem, para as visões semana e dia. */
function agendaDaSemana(hoje: Date): EventoCalendario[] {
  const em = (dias: number, h = 0, min = 0) => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + dias, h, min);
  return [
    { id: 's1', titulo: 'Promoção de Pix', inicio: em(-1), fim: em(2, 23, 59), diaInteiro: true, cor: 'graf-2', categoria: 'Marketing' },
    { id: 's2', titulo: 'Reunião de vendas', inicio: em(0, 8, 30), fim: em(0, 9, 30), cor: 'pri', categoria: 'Reunião' },
    { id: 's3', titulo: 'Visita · Loja Casa & Cia', inicio: em(0, 9), fim: em(0, 11), cor: 'graf-4', categoria: 'Visita' },
    { id: 's4', titulo: 'Ligação · Clínica Bem-Estar', inicio: em(0, 9, 15), fim: em(0, 9, 45), cor: 'info', categoria: 'Ligação' },
    { id: 's5', titulo: 'Entrega · Mercado Bom Preço', inicio: em(0, 14), fim: em(0, 16), cor: 'ok', categoria: 'Entrega' },
    { id: 's6', titulo: 'Fechamento do caixa', inicio: em(0, 18), fim: em(0, 18, 30), cor: 'destaque', categoria: 'Financeiro' },
    { id: 's7', titulo: 'Entrega · Farmácia Vida Plena', inicio: em(-1, 10), fim: em(-1, 12), cor: 'ok', categoria: 'Entrega' },
    { id: 's8', titulo: 'Treinamento da equipe', inicio: em(1, 13), fim: em(1, 17), cor: 'pri', categoria: 'Reunião' },
    { id: 's9', titulo: 'Visita · Padaria Pão Dourado', inicio: em(1, 14), fim: em(1, 15), cor: 'graf-4', categoria: 'Visita' },
    { id: 's10', titulo: 'Prazo · boletos', inicio: em(2), diaInteiro: true, cor: 'err', categoria: 'Financeiro' },
    { id: 's11', titulo: 'Café com fornecedor', inicio: em(-2, 8), fim: em(-2, 9), cor: 'graf-6', categoria: 'Reunião' },
    { id: 's12', titulo: 'Entrega · Distribuidora Litoral', inicio: em(3, 7, 30), fim: em(3, 9), cor: 'ok', categoria: 'Entrega' },
  ];
}

/** Séries da agenda editável: o app guarda a regra e calcula as ocorrências do período visível. */
function seriesDaAgenda(hoje: Date): { base: EventoCalendario; regra: RegraRepeticao }[] {
  const em = (dias: number, h = 0, min = 0) => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + dias, h, min);
  return [
    {
      base: { id: 'abertura', titulo: 'Abertura do caixa', inicio: em(-30, 7, 30), fim: em(-30, 8), cor: 'destaque', categoria: 'Financeiro' },
      regra: { frequencia: 'semanal', diasSemana: [1, 2, 3, 4, 5] },
    },
    {
      base: { id: 'vendas', titulo: 'Reunião de vendas', inicio: em(-28, 9), fim: em(-28, 10), cor: 'pri', categoria: 'Reunião' },
      regra: { frequencia: 'semanal', diasSemana: [hoje.getDay()] },
    },
    {
      base: { id: 'aluguel', titulo: 'Aluguel da loja', inicio: new Date(hoje.getFullYear(), hoje.getMonth() - 2, 5), diaInteiro: true, cor: 'err', categoria: 'Financeiro' },
      regra: { frequencia: 'mensal' },
    },
  ];
}

/** Eventos avulsos da agenda editável. */
function avulsosDaAgenda(hoje: Date): EventoCalendario[] {
  const em = (dias: number, h = 0, min = 0) => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + dias, h, min);
  return [
    { id: 'a1', titulo: 'Visita · Loja Casa & Cia', inicio: em(0, 13), fim: em(0, 14, 30), cor: 'graf-4', categoria: 'Visita' },
    { id: 'a2', titulo: 'Entrega · Mercado Bom Preço', inicio: em(1, 10), fim: em(1, 12), cor: 'ok', categoria: 'Entrega' },
    { id: 'a3', titulo: 'Ligação · Clínica Bem-Estar', inicio: em(2, 15), fim: em(2, 15, 30), cor: 'info', categoria: 'Ligação' },
    { id: 'a4', titulo: 'Feira do setor', inicio: em(-1), fim: em(0, 23, 59), diaInteiro: true, cor: 'graf-2', categoria: 'Marketing' },
    { id: 'a5', titulo: 'Inventário', inicio: em(2, 8), fim: em(2, 11), cor: 'warn', categoria: 'Estoque', fixo: true },
  ];
}

/**
 * Agenda editável: arrastar e esticar mudam os eventos (numa série, só a ocorrência arrastada);
 * clicar ou arrastar num horário vazio abre o cadastro, e clicar num evento abre a edição.
 * O estado e o diálogo são os do exemplo "Cadastro" da documentação.
 */
function AgendaEditavel() {
  const toast = useToast();
  const hoje = useMemo(() => new Date(), []);
  const agenda = useAgenda({ avulsos: avulsosDaAgenda(hoje), series: seriesDaAgenda(hoje).map((s) => ({ ...s, excecoes: [] })) });
  const { avulsos, series, periodo, setAvulsos, setSeries } = agenda;
  const [dia, setDia] = useState(hoje);
  const [mesMini, setMesMini] = useState(hoje);

  // bolinhas do minicalendário: dias com visita, entrega, ligação ou reunião no mês mostrado nele
  const marcados = useMemo(() => {
    const ini = new Date(mesMini.getFullYear(), mesMini.getMonth() - 1, 20);
    const fim = new Date(mesMini.getFullYear(), mesMini.getMonth() + 1, 15);
    const todos = [...series.flatMap((s) => repetirEvento(s.base, { ...s.regra, excecoes: s.excecoes }, { inicio: ini, fim })), ...avulsos];
    return todos.filter((e) => e.categoria !== 'Financeiro').map((e) => e.inicio);
  }, [avulsos, series, mesMini]);

  // o dia escolhido acompanha o calendário grande (setas, Hoje, troca de visão)
  const mudarPeriodo = (p: PeriodoCalendario) => {
    agenda.setPeriodo(p);
    const meio = new Date((p.inicio.getTime() + p.fim.getTime()) / 2);
    const [ini, fim] = p.visao === 'mes' || p.visao === 'lista' ? [new Date(meio.getFullYear(), meio.getMonth(), 1), new Date(meio.getFullYear(), meio.getMonth() + 1, 1)] : [p.inicio, p.fim];
    setDia((d) => (d >= ini && d < fim ? d : ini));
  };

  const alterar = (ev: EventoCalendario, m: MudancaEvento) => {
    const novo = { inicio: m.inicio, fim: m.fim };
    if (ev.serie != null) {
      // ocorrência de uma série: a série pula esse dia e a ocorrência vira um evento avulso
      setSeries((l) => l.map((s) => (s.base.id === ev.serie ? { ...s, excecoes: [...s.excecoes, ev.inicio] } : s)));
      setAvulsos((l) => [...l, { ...ev, ...novo, id: `${ev.id}-avulso`, serie: undefined, repete: false }]);
      toast.info('Só esta ocorrência', `"${ev.titulo}" mudou só neste dia; a série continua igual.`);
      return;
    }
    setAvulsos((l) => l.map((e) => (e.id === ev.id ? { ...e, ...novo } : e)));
  };

  return (
    <div className="demo-agenda">
      <Card className="demo-agenda-lado">
        <MiniCalendario valor={dia} aoEscolher={setDia} aoMudarMes={setMesMini} marcados={marcados} destaque={periodo?.visao === 'mes' ? null : periodo} />
      </Card>
      <Calendario
        rotulo="Agenda editável"
        eventos={agenda.eventos}
        visaoInicial="semana"
        data={dia}
        aoMudarPeriodo={mudarPeriodo}
        aoAlterarEvento={alterar}
        aoSelecionarHorario={({ inicio, fim }) => agenda.novo(inicio, fim)}
        aoClicarDia={(d) => agenda.novo(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9))}
        aoClicarEvento={agenda.abrir}
        rascunho={agenda.rascunho}
      />
      <DialogoEvento {...agenda.dialogo} />
    </div>
  );
}

const DATA = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const HORA = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

export function PaginaCalendario() {
  const { t } = useT();
  const toast = useToast();
  const [segunda, setSegunda] = useState(false);
  const [periodo, setPeriodo] = useState<PeriodoCalendario | null>(null);
  const [aberto, setAberto] = useState<EventoCalendario | null>(null);
  // o "app" monta a agenda do mês visível (num sistema de verdade, buscaria na API)
  const semana = useMemo(() => agendaDaSemana(new Date()), []);
  const eventos = useMemo(() => {
    if (!periodo) return [];
    const meio = new Date((periodo.inicio.getTime() + periodo.fim.getTime()) / 2);
    return agendaDoMes(meio);
  }, [periodo]);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.calendario.titulo')} icone="calendar" trilha>
        Visão mês, semana, dia e lista, eventos coloridos pelos tokens, "+N mais" por dia e navegação pelo teclado (setas, Home/End, Page Up/Down, Enter).
      </CabecalhoPagina>

      <Bloco titulo="Agenda de vendas" descricao="Clique num dia para criar um evento ou num evento para ver os detalhes. O dia 9 tem mais eventos do que cabem.">
        <div className="demo-linha">
          <Botao
            rotulo="Semana começa na segunda"
            severidade="secundario"
            aparencia="contorno"
            tamanho="pequeno"
            pressionado={segunda}
            onClick={() => setSegunda((s) => !s)}
          />
        </div>
        <Calendario
          rotulo="Agenda de vendas"
          eventos={eventos}
          inicioSemana={segunda ? 1 : 0}
          aoMudarPeriodo={setPeriodo}
          aoClicarDia={(d) => toast.info('Novo evento', `Criar evento em ${DATA.format(d)}.`)}
          aoClicarEvento={setAberto}
        />
      </Bloco>

      <Bloco
        titulo="Semana e dia"
        descricao="Faixa de horários das 7h às 21h, eventos pela hora, sobrepostos lado a lado e a linha vermelha do agora. Clique num horário vazio para criar um evento ali."
      >
        <Calendario
          rotulo="Agenda da semana"
          eventos={semana}
          visaoInicial="semana"
          inicioSemana={segunda ? 1 : 0}
          aoClicarDia={(d) => toast.info('Dia', DATA.format(d))}
          aoClicarHorario={(d) => toast.info('Novo evento', `Criar evento em ${DATA.format(d)}, às ${HORA.format(d)}.`)}
          aoClicarEvento={setAberto}
        />
      </Bloco>

      <Bloco
        titulo="Cadastrar, arrastar e repetir"
        descricao="Clique num horário vazio, ou arraste sobre ele para escolher o intervalo, e cadastre o evento (com o campo Repete); clique num evento para editar ou excluir. Arraste um evento para outro dia ou horário, ou puxe a borda de baixo para mudar a duração (no toque, segure antes de arrastar; pelo teclado, Alt+setas e Alt+Shift+↑↓; no cursor de horário, Shift+↑↓ aumentam o intervalo e Enter abre o cadastro). O Inventário é fixo. O minicalendário escolhe o dia."
      >
        <AgendaEditavel />
      </Bloco>

      <Bloco titulo="Visão lista" descricao="Eventos do mês agrupados por dia: a visão boa para o celular.">
        <Calendario rotulo="Agenda em lista" eventos={eventos} visaoInicial="lista" aoClicarEvento={setAberto} />
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo="Carregando">
          <Calendario eventos={[]} carregando visoes={['mes']} />
        </Bloco>
        <Bloco titulo="Sem eventos (lista)">
          <Calendario eventos={[]} visaoInicial="lista" textoVazio="Nenhuma entrega agendada neste mês." />
        </Bloco>
      </div>

      <Dialogo aberto={!!aberto} aoFechar={() => setAberto(null)} titulo={aberto?.titulo ?? ''} icone="calendar" tamanho="pequeno">
        {aberto && (
          <div className="demo-pilha">
            <Detalhes rotulo="Data" valor={DATA.format(aberto.inicio)} />
            <Detalhes rotulo="Horário" valor={aberto.diaInteiro ? 'Dia inteiro' : `${HORA.format(aberto.inicio)}${aberto.fim ? ` às ${HORA.format(aberto.fim)}` : ''}`} />
            <Detalhes rotulo="Categoria" valor={aberto.categoria} />
          </div>
        )}
      </Dialogo>
    </div>
  );
}
