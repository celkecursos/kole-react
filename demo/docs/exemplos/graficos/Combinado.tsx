import { GraficoCombinado, type DadoGrafico } from '../../../../src';

const DADOS: DadoGrafico[] = [
  { mes: '2026-01', pedidos: 410, ticket: 182 },
  { mes: '2026-02', pedidos: 392, ticket: 188 },
  { mes: '2026-03', pedidos: 455, ticket: 179 },
  { mes: '2026-04', pedidos: 470, ticket: 191 },
  { mes: '2026-05', pedidos: 448, ticket: 197 },
  { mes: '2026-06', pedidos: 502, ticket: 203 },
];

export default function Exemplo() {
  return (
    <GraficoCombinado
      titulo="Pedidos e ticket médio"
      descricao="Pedidos em barras, no eixo esquerdo; ticket médio em linha, no eixo direito."
      dados={DADOS}
      eixoX={{ chave: 'mes', tipo: 'data', rotulo: 'Mês' }}
      eixoY={{ rotulo: 'Pedidos' }}
      eixoYDireito={{ rotulo: 'Ticket médio', unidade: 'R$' }}
      barras={[{ chave: 'pedidos', rotulo: 'Pedidos' }]}
      linhas={[{ chave: 'ticket', rotulo: 'Ticket médio', cor: 'var(--graf-2)' }]}
    />
  );
}
