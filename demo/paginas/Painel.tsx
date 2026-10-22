import { Alerta, BoasVindas, Botao, Icone, Indicador, Indicadores, Status, Tabela, formatarNumero } from '../../src';
import { PEDIDOS, SEVERIDADE } from './dados';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export function PaginaPainel({ navegar }: { navegar: (r: string) => void }) {
  const abertos = PEDIDOS.filter((p) => p.situacao === 'Aguardando pagamento' || p.situacao === 'Pago');
  const vendas = PEDIDOS.filter((p) => p.situacao !== 'Cancelado').reduce((s, p) => s + p.total, 0);
  const ticket = vendas / PEDIDOS.filter((p) => p.situacao !== 'Cancelado').length;
  const aguardando = PEDIDOS.filter((p) => p.situacao === 'Aguardando pagamento').length;

  return (
    <div className="demo-pilha">
      <BoasVindas nome="Gabrielly Ribeiro da Silva" cargo="Gerente comercial" sigla="Comercial" ultimoAcesso={new Date(Date.now() - 26 * 3600 * 1000)}>
        <Botao rotulo="Novo pedido" icone="plus" onClick={() => navegar('/pedidos/novo')} />
      </BoasVindas>

      <Indicadores>
        <Indicador rotulo="Vendas do mês" valor={`R$ ${formatarNumero(vendas, { compacto: true })}`} icone="chart-line" cor="var(--info-solid)" aoClicar={() => navegar('/pedidos')}>
          <span style={{ color: 'var(--ok-fg)' }}>
            <Icone icone="arrow-up" />
          </span> 12% sobre o mês anterior
        </Indicador>
        <Indicador rotulo="Pedidos abertos" valor={abertos.length} icone="shopping-cart" cor="var(--ok-solid)" aoClicar={() => navegar('/pedidos')} />
        <Indicador rotulo="Clientes ativos" valor={1284} icone="users" cor="var(--acento)" />
        <Indicador rotulo="Ticket médio" valor={BRL.format(ticket)} icone="wallet" carregando />
      </Indicadores>

      <Alerta
        severidade="warn"
        mensagem={`${aguardando} pedidos aguardam confirmação de pagamento há mais de 3 dias.`}
        acoes={<Botao rotulo="Ver" severidade="warn" aparencia="contorno" onClick={() => navegar('/pedidos')} />}
      />

      <Tabela
        rotulo="Pedidos abertos"
        registros={abertos.slice(0, 5)}
        colunas={[
          { campo: 'numero', rotulo: 'Pedido', destaque: true },
          { campo: 'cliente', rotulo: 'Cliente' },
          { campo: 'total', rotulo: 'Total', alinhamento: 'direita', formato: (v) => BRL.format(v as number) },
          { campo: 'situacao', rotulo: 'Situação', render: (p) => <Status rotulo={p.situacao} severidade={SEVERIDADE[p.situacao]} /> },
        ]}
      />
    </div>
  );
}
