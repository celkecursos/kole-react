import { CabecalhoSecao, CardRecurso, FaixaNumeros, SecaoSite } from '../../../../src';

export default function Exemplo() {
  return (
    <SecaoSite fundo="superficie" espaco="compacto" rotulo="Recursos">
      <CabecalhoSecao sobretitulo="Recursos" titulo="Tudo o que a loja precisa" alinhamento="centro" />
      <div className="demo-grade">
        <CardRecurso icone="shopping-cart" titulo="Pedidos">
          Do orçamento à entrega, com aviso ao cliente.
        </CardRecurso>
        <CardRecurso icone="package" titulo="Estoque">
          Mínimo por produto e alerta de reposição.
        </CardRecurso>
        <CardRecurso icone="chart-line" titulo="Relatórios">
          Faturamento e ticket médio em tempo real.
        </CardRecurso>
      </div>
      <FaixaNumeros
        rotulo="Números da plataforma"
        aparencia="cartoes"
        itens={[
          { valor: '12', sufixo: 'mil', rotulo: 'lojas ativas' },
          { valor: '98', sufixo: '%', rotulo: 'de clientes satisfeitos' },
          { valor: '24', sufixo: 'h', rotulo: 'de suporte por dia' },
        ]}
      />
    </SecaoSite>
  );
}
