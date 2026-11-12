import { GraficoLinha, type DadoGrafico } from '../../../../src';

const DADOS: DadoGrafico[] = [
  { mes: '2026-01', vendas: 142, meta: 150 },
  { mes: '2026-02', vendas: 138, meta: 150 },
  { mes: '2026-03', vendas: 161, meta: 155 },
  { mes: '2026-04', vendas: 172, meta: 160 },
  { mes: '2026-05', vendas: 168, meta: 165 },
  { mes: '2026-06', vendas: 184, meta: 170 },
];

export default function Exemplo() {
  return (
    <GraficoLinha
      titulo="Vendas no 1º semestre"
      descricao="Vendas por mês, em mil reais, com a meta tracejada."
      dados={DADOS}
      eixoX={{ chave: 'mes', tipo: 'data', rotulo: 'Mês' }}
      eixoY={{ rotulo: 'Vendas', unidade: 'mil R$' }}
      series={[
        { chave: 'vendas', rotulo: 'Vendas' },
        { chave: 'meta', rotulo: 'Meta', tracejada: true },
      ]}
      area
    />
  );
}
