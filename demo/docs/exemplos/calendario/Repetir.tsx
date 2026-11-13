import { useMemo, useState } from 'react';
import { Calendario, MiniCalendario, repetirEvento, type PeriodoCalendario } from '../../../../src';

// a série fica no app: o evento base e a regra
const hoje = new Date();
const reuniao = {
  base: { id: 'reuniao', titulo: 'Reunião de vendas', inicio: new Date(hoje.getFullYear(), hoje.getMonth(), 1, 9), fim: new Date(hoje.getFullYear(), hoje.getMonth(), 1, 10) },
  regra: { frequencia: 'semanal' as const, diasSemana: [1, 4] },
};

export default function Exemplo() {
  const [periodo, setPeriodo] = useState<PeriodoCalendario | null>(null);
  const [dia, setDia] = useState(hoje);
  // só as ocorrências do período visível
  const eventos = useMemo(() => (periodo ? repetirEvento(reuniao.base, reuniao.regra, periodo) : []), [periodo]);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
      <MiniCalendario valor={dia} aoEscolher={setDia} destaque={periodo?.visao === 'semana' ? periodo : null} />
      <div style={{ flex: '1 1 30rem', minWidth: 0 }}>
        <Calendario rotulo="Reuniões" eventos={eventos} visaoInicial="semana" data={dia} aoMudarPeriodo={setPeriodo} />
      </div>
    </div>
  );
}
