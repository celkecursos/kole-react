import { Indicador, Indicadores } from '../../../../src';

export default function Exemplo() {
  return (
    // Indicadores = a grade dos cards do painel
    <Indicadores>
      <Indicador
        rotulo="Vendas do mês"
        valor="R$ 184,2 mil"
        icone="chart-line"
        cor="var(--info-solid)"
        variacao={12}
        tendencia={[120, 132, 128, 150, 162, 158, 184]}
      />
      <Indicador rotulo="Pedidos abertos" valor={37} icone="shopping-cart" cor="var(--ok-solid)" href="#/docs/componentes/tabela" />
      {/* variacaoBoa="baixa": cair é bom (cancelamentos, prazo) */}
      <Indicador rotulo="Cancelamentos" valor="2,1%" icone="circle-x" cor="var(--err-solid)" variacao={-0.4} variacaoBoa="baixa" />
      <Indicador rotulo="Ticket médio" valor="" icone="wallet" carregando />
    </Indicadores>
  );
}
