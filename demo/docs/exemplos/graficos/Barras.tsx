import { GraficoBarras, type DadoGrafico } from '../../../../src';

const DADOS: DadoGrafico[] = [
  { categoria: 'Bebidas', ano2025: 82, ano2026: 96 },
  { categoria: 'Limpeza', ano2025: 64, ano2026: 61 },
  { categoria: 'Padaria', ano2025: 41, ano2026: 55 },
  { categoria: 'Frios', ano2025: 38, ano2026: 44 },
];

export default function Exemplo() {
  return (
    <GraficoBarras
      titulo="Vendas por categoria"
      descricao="Vendas do 1º semestre de 2025 e de 2026, em mil reais."
      dados={DADOS}
      eixoX={{ chave: 'categoria', tipo: 'categoria', rotulo: 'Categoria' }}
      eixoY={{ rotulo: 'Vendas', unidade: 'mil R$' }}
      series={[
        { chave: 'ano2025', rotulo: '2025' },
        { chave: 'ano2026', rotulo: '2026' },
      ]}
      rotulosNasBarras
    />
  );
}
