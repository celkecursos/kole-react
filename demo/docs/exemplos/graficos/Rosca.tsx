import { useState } from 'react';
import { GraficoRosca, formatarMoeda, type DadoGrafico } from '../../../../src';

const DESPESAS: DadoGrafico[] = [
  { categoria: 'Moradia', valor: 2840 },
  { categoria: 'Mercado', valor: 1370 },
  { categoria: 'Transporte', valor: 830 },
  { categoria: 'Saúde', valor: 490 },
  { categoria: 'Lazer', valor: 210 },
  { categoria: 'Educação', valor: 350 },
  { categoria: 'Compras', valor: 551 },
  { categoria: 'Presentes', valor: 120 },
];

export default function Exemplo() {
  const [escolhida, setEscolhida] = useState('Clique numa fatia (ou Enter no teclado).');
  return (
    <div className="demo-pilha">
      <GraficoRosca
        titulo="Despesas por categoria"
        descricao="Despesas de novembro de 2026"
        dados={DESPESAS}
        chaveRotulo="categoria"
        chaveValor="valor"
        formatar={(v) => formatarMoeda(v)}
        // as menores viram "Outros"
        maxFatias={6}
        centro={{ rotulo: 'Total do mês' }}
        aoEscolher={(d) => setEscolhida(`Abrir os lançamentos de ${d.categoria}`)}
        animacao
      />
      <small aria-live="polite">{escolhida}</small>
    </div>
  );
}
