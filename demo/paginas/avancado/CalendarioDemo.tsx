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
import { useT, type TradutorDemo } from '../../i18n/useT';

/*
 * Agenda fictícia de vendas, montada a partir do mês atual (o teste visual fixa
 * o relógio, então o calendário sai sempre igual).
 */
function agendaDoMes(base: Date, tc: TradutorDemo['tc']): EventoCalendario[] {
  const a = base.getFullYear();
  const m = base.getMonth();
  const em = (dia: number, h = 0, min = 0) => new Date(a, m, dia, h, min);
  return [
    { id: 1, titulo: tc('Inventário do estoque'), inicio: em(2), fim: em(3, 23, 59), diaInteiro: true, cor: 'warn', categoria: tc('Estoque') },
    { id: 2, titulo: tc('Entrega · Mercado Bom Preço'), inicio: em(4, 9), fim: em(4, 11), cor: 'ok', categoria: tc('Entrega') },
    { id: 3, titulo: tc('Visita · Padaria Pão Dourado'), inicio: em(6, 14, 30), fim: em(6, 15, 30), cor: 'graf-4', categoria: tc('Visita') },
    { id: 4, titulo: tc('Reunião de vendas'), inicio: em(9, 8, 30), fim: em(9, 9, 30), cor: 'pri', categoria: tc('Reunião') },
    { id: 5, titulo: tc('Entrega · Farmácia Vida Plena'), inicio: em(9, 10), fim: em(9, 12), cor: 'ok', categoria: tc('Entrega') },
    { id: 6, titulo: tc('Visita · Construtora Alicerce'), inicio: em(9, 14), cor: 'graf-4', categoria: tc('Visita') },
    { id: 7, titulo: tc('Ligação · Loja Casa & Cia'), inicio: em(9, 16), cor: 'info', categoria: tc('Ligação') },
    { id: 8, titulo: tc('Fechamento do caixa'), inicio: em(9, 18), cor: 'destaque', categoria: tc('Financeiro') },
    { id: 9, titulo: tc('Promoção de Pix'), inicio: em(12), fim: em(18, 23, 59), diaInteiro: true, cor: 'graf-2', categoria: tc('Marketing') },
    { id: 10, titulo: tc('Entrega · Restaurante Sabor Caseiro'), inicio: em(15, 9), cor: 'ok', categoria: tc('Entrega') },
    { id: 11, titulo: tc('Prazo · boletos do mês'), inicio: em(20), diaInteiro: true, cor: 'err', categoria: tc('Financeiro') },
    { id: 12, titulo: tc('Treinamento da equipe'), inicio: em(22, 13), fim: em(22, 17), cor: 'pri', categoria: tc('Reunião') },
    { id: 13, titulo: tc('Visita · Clínica Bem-Estar'), inicio: em(25, 10), cor: 'graf-4', categoria: tc('Visita') },
    { id: 14, titulo: tc('Entrega · Distribuidora Litoral'), inicio: em(27, 8), fim: em(27, 10), cor: 'ok', categoria: tc('Entrega') },
    { id: 15, titulo: tc('Reunião de resultados'), inicio: em(28, 15), fim: em(28, 16, 30), cor: 'pri', categoria: tc('Reunião') },
  ];
}

/** Agenda em volta de hoje, com eventos que se sobrepõem, para as visões semana e dia. */
function agendaDaSemana(hoje: Date, tc: TradutorDemo['tc']): EventoCalendario[] {
  const em = (dias: number, h = 0, min = 0) => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + dias, h, min);
  return [
    { id: 's1', titulo: tc('Promoção de Pix'), inicio: em(-1), fim: em(2, 23, 59), diaInteiro: true, cor: 'graf-2', categoria: tc('Marketing') },
    { id: 's2', titulo: tc('Reunião de vendas'), inicio: em(0, 8, 30), fim: em(0, 9, 30), cor: 'pri', categoria: tc('Reunião') },
    { id: 's3', titulo: tc('Visita · Loja Casa & Cia'), inicio: em(0, 9), fim: em(0, 11), cor: 'graf-4', categoria: tc('Visita') },
    { id: 's4', titulo: tc('Ligação · Clínica Bem-Estar'), inicio: em(0, 9, 15), fim: em(0, 9, 45), cor: 'info', categoria: tc('Ligação') },
    { id: 's5', titulo: tc('Entrega · Mercado Bom Preço'), inicio: em(0, 14), fim: em(0, 16), cor: 'ok', categoria: tc('Entrega') },
    { id: 's6', titulo: tc('Fechamento do caixa'), inicio: em(0, 18), fim: em(0, 18, 30), cor: 'destaque', categoria: tc('Financeiro') },
    { id: 's7', titulo: tc('Entrega · Farmácia Vida Plena'), inicio: em(-1, 10), fim: em(-1, 12), cor: 'ok', categoria: tc('Entrega') },
    { id: 's8', titulo: tc('Treinamento da equipe'), inicio: em(1, 13), fim: em(1, 17), cor: 'pri', categoria: tc('Reunião') },
    { id: 's9', titulo: tc('Visita · Padaria Pão Dourado'), inicio: em(1, 14), fim: em(1, 15), cor: 'graf-4', categoria: tc('Visita') },
    { id: 's10', titulo: tc('Prazo · boletos'), inicio: em(2), diaInteiro: true, cor: 'err', categoria: tc('Financeiro') },
    { id: 's11', titulo: tc('Café com fornecedor'), inicio: em(-2, 8), fim: em(-2, 9), cor: 'graf-6', categoria: tc('Reunião') },
    { id: 's12', titulo: tc('Entrega · Distribuidora Litoral'), inicio: em(3, 7, 30), fim: em(3, 9), cor: 'ok', categoria: tc('Entrega') },
  ];
}

/** Séries da agenda editável: o app guarda a regra e calcula as ocorrências do período visível. */
function seriesDaAgenda(hoje: Date, tc: TradutorDemo['tc']): { base: EventoCalendario; regra: RegraRepeticao }[] {
  const em = (dias: number, h = 0, min = 0) => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + dias, h, min);
  return [
    {
      base: { id: 'abertura', titulo: tc('Abertura do caixa'), inicio: em(-30, 7, 30), fim: em(-30, 8), cor: 'destaque', categoria: tc('Financeiro') },
      regra: { frequencia: 'semanal', diasSemana: [1, 2, 3, 4, 5] },
    },
    {
      base: { id: 'vendas', titulo: tc('Reunião de vendas'), inicio: em(-28, 9), fim: em(-28, 10), cor: 'pri', categoria: tc('Reunião') },
      regra: { frequencia: 'semanal', diasSemana: [hoje.getDay()] },
    },
    {
      base: { id: 'aluguel', titulo: tc('Aluguel da loja'), inicio: new Date(hoje.getFullYear(), hoje.getMonth() - 2, 5), diaInteiro: true, cor: 'err', categoria: tc('Financeiro') },
      regra: { frequencia: 'mensal' },
    },
  ];
}

/** Eventos avulsos da agenda editável. */
function avulsosDaAgenda(hoje: Date, tc: TradutorDemo['tc']): EventoCalendario[] {
  const em = (dias: number, h = 0, min = 0) => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + dias, h, min);
  return [
    { id: 'a1', titulo: tc('Visita · Loja Casa & Cia'), inicio: em(0, 13), fim: em(0, 14, 30), cor: 'graf-4', categoria: tc('Visita') },
    { id: 'a2', titulo: tc('Entrega · Mercado Bom Preço'), inicio: em(1, 10), fim: em(1, 12), cor: 'ok', categoria: tc('Entrega') },
    { id: 'a3', titulo: tc('Ligação · Clínica Bem-Estar'), inicio: em(2, 15), fim: em(2, 15, 30), cor: 'info', categoria: tc('Ligação') },
    { id: 'a4', titulo: tc('Feira do setor'), inicio: em(-1), fim: em(0, 23, 59), diaInteiro: true, cor: 'graf-2', categoria: tc('Marketing') },
    { id: 'a5', titulo: tc('Inventário'), inicio: em(2, 8), fim: em(2, 11), cor: 'warn', categoria: tc('Estoque'), fixo: true },
  ];
}

/**
 * Agenda editável: arrastar e esticar mudam os eventos (numa série, só a ocorrência arrastada);
 * clicar ou arrastar num horário vazio abre o cadastro, e clicar num evento abre a edição.
 * O estado e o diálogo são os do exemplo "Cadastro" da documentação.
 */
function AgendaEditavel() {
  const { t, tc } = useT();
  const toast = useToast();
  const hoje = useMemo(() => new Date(), []);
  const agenda = useAgenda({ avulsos: avulsosDaAgenda(hoje, tc), series: seriesDaAgenda(hoje, tc).map((s) => ({ ...s, excecoes: [] })) });
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
      toast.info(t('paginas.calendario.textos.soEstaOcorrencia'), t('paginas.calendario.textos.tituloMudouSoNeste', { titulo: ev.titulo }));
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
        rotulo={t('paginas.calendario.textos.agendaEditavel')}
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
  const { t, tc } = useT();
  const toast = useToast();
  const [segunda, setSegunda] = useState(false);
  const [periodo, setPeriodo] = useState<PeriodoCalendario | null>(null);
  const [aberto, setAberto] = useState<EventoCalendario | null>(null);
  // o "app" monta a agenda do mês visível (num sistema de verdade, buscaria na API)
  const semana = useMemo(() => agendaDaSemana(new Date(), tc), [tc]);
  const eventos = useMemo(() => {
    if (!periodo) return [];
    const meio = new Date((periodo.inicio.getTime() + periodo.fim.getTime()) / 2);
    return agendaDoMes(meio, tc);
  }, [periodo, tc]);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.calendario.titulo')} icone="calendar" trilha>{t('paginas.calendario.textos.visaoMesSemanaDia')}</CabecalhoPagina>

      <Bloco titulo={t('paginas.calendario.secoes.agendaDeVendas')} descricao={t('paginas.calendario.textos.cliqueNumDiaPara')}>
        <div className="demo-linha">
          <Botao
            rotulo={t('paginas.calendario.textos.semanaComecaNaSegunda')}
            severidade="secundario"
            aparencia="contorno"
            tamanho="pequeno"
            pressionado={segunda}
            onClick={() => setSegunda((s) => !s)}
          />
        </div>
        <Calendario
          rotulo={t('paginas.calendario.textos.agendaDeVendas')}
          eventos={eventos}
          inicioSemana={segunda ? 1 : 0}
          aoMudarPeriodo={setPeriodo}
          aoClicarDia={(d) => toast.info(t('paginas.calendario.textos.novoEvento'), t('paginas.calendario.textos.criarEventoEmValor', { valor: DATA.format(d) }))}
          aoClicarEvento={setAberto}
        />
      </Bloco>

      <Bloco
        titulo={t('paginas.calendario.secoes.semanaEDia')}
        descricao={t('paginas.calendario.textos.faixaDeHorariosDas')}
      >
        <Calendario
          rotulo={t('paginas.calendario.textos.agendaDaSemana')}
          eventos={semana}
          visaoInicial="semana"
          inicioSemana={segunda ? 1 : 0}
          aoClicarDia={(d) => toast.info(t('paginas.calendario.textos.dia'), DATA.format(d))}
          aoClicarHorario={(d) => toast.info(t('paginas.calendario.textos.novoEvento'), t('paginas.calendario.textos.criarEventoEmValor2', { valor: DATA.format(d), valor2: HORA.format(d) }))}
          aoClicarEvento={setAberto}
        />
      </Bloco>

      <Bloco
        titulo={t('paginas.calendario.secoes.cadastrarArrastarERepetir')}
        descricao={t('paginas.calendario.textos.cliqueNumHorarioVazio')}
      >
        <AgendaEditavel />
      </Bloco>

      <Bloco titulo={t('paginas.calendario.secoes.visaoLista')} descricao={t('paginas.calendario.textos.eventosDoMesAgrupados')}>
        <Calendario rotulo={t('paginas.calendario.textos.agendaEmLista')} eventos={eventos} visaoInicial="lista" aoClicarEvento={setAberto} />
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.calendario.secoes.carregando')}>
          <Calendario eventos={[]} carregando visoes={['mes']} />
        </Bloco>
        <Bloco titulo={t('paginas.calendario.secoes.semEventosLista')}>
          <Calendario eventos={[]} visaoInicial="lista" textoVazio={t('paginas.calendario.textos.nenhumaEntregaAgendadaNeste')} />
        </Bloco>
      </div>

      <Dialogo aberto={!!aberto} aoFechar={() => setAberto(null)} titulo={tc(aberto?.titulo) ?? ''} icone="calendar" tamanho="pequeno">
        {aberto && (
          <div className="demo-pilha">
            <Detalhes rotulo={t('paginas.calendario.textos.data')} valor={DATA.format(aberto.inicio)} />
            <Detalhes rotulo={t('paginas.calendario.textos.horario')} valor={aberto.diaInteiro ? tc('Dia inteiro') : `${HORA.format(aberto.inicio)}${aberto.fim ? ` às ${HORA.format(aberto.fim)}` : ''}`} />
            <Detalhes rotulo={t('paginas.calendario.textos.categoria')} valor={aberto.categoria} />
          </div>
        )}
      </Dialogo>
    </div>
  );
}
