import { useMemo, useState } from 'react';
import { Botao, CabecalhoPagina, Calendario, Detalhes, Dialogo, useToast, type EventoCalendario, type PeriodoCalendario } from '../../../src';
import { Bloco } from '../Bloco';

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

const DATA = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const HORA = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

export function PaginaCalendario() {
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
      <CabecalhoPagina titulo="Calendário" icone="calendar" trilha>
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
