import { Alerta, BoasVindas, Botao, Icone, Indicador, Indicadores, Status, Tabela, formatarNumero } from '../../src';
import { PEDIDOS, SEVERIDADE } from './dados';
import { useT } from '../i18n/useT';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export function PaginaPainel({ navegar }: { navegar: (r: string) => void }) {
  const { t, idioma } = useT();
  const abertos = PEDIDOS.filter((p) => p.situacao === 'Aguardando pagamento' || p.situacao === 'Pago');
  const vendas = PEDIDOS.filter((p) => p.situacao !== 'Cancelado').reduce((s, p) => s + p.total, 0);
  const ticket = vendas / PEDIDOS.filter((p) => p.situacao !== 'Cancelado').length;
  const aguardando = PEDIDOS.filter((p) => p.situacao === 'Aguardando pagamento').length;

  return (
    <div className="demo-pilha">
      <BoasVindas nome="Gabrielly Ribeiro da Silva" cargo="Gerente comercial" sigla="Comercial" ultimoAcesso={new Date(Date.now() - 26 * 3600 * 1000)}>
        <Botao rotulo={t('paginas.painel.textos.novoPedido')} icone="plus" onClick={() => navegar('/pedidos/novo')} />
      </BoasVindas>

      <Indicadores>
        <Indicador rotulo={t('paginas.painel.textos.vendasDoMes')} valor={`R$ ${formatarNumero(vendas, { compacto: true , idioma })}`} icone="chart-line" cor="var(--info-solid)" aoClicar={() => navegar('/pedidos')}>
          <span style={{ color: 'var(--ok-fg)' }}>
            <Icone icone="arrow-up" />
          </span>{t('paginas.painel.textos.t12SobreOMes')}</Indicador>
        <Indicador rotulo={t('paginas.painel.textos.pedidosAbertos')} valor={abertos.length} icone="shopping-cart" cor="var(--ok-solid)" aoClicar={() => navegar('/pedidos')} />
        <Indicador rotulo={t('paginas.painel.textos.clientesAtivos')} valor={1284} icone="users" cor="var(--acento)" />
        <Indicador rotulo={t('paginas.painel.textos.ticketMedio')} valor={BRL.format(ticket)} icone="wallet" carregando />
      </Indicadores>

      <Alerta
        severidade="warn"
        mensagem={t('paginas.painel.textos.aguardandoPedidosAguardamConfirmacao', { aguardando })}
        acoes={<Botao rotulo={t('paginas.painel.textos.ver')} severidade="warn" aparencia="contorno" onClick={() => navegar('/pedidos')} />}
      />

      <Tabela
        rotulo={t('paginas.painel.textos.pedidosAbertos')}
        registros={abertos.slice(0, 5)}
        colunas={[
          { campo: 'numero', rotulo: t('paginas.painel.textos.pedido'), destaque: true },
          { campo: 'cliente', rotulo: t('paginas.painel.textos.cliente') },
          { campo: 'total', rotulo: t('paginas.painel.textos.total'), alinhamento: 'direita', formato: (v) => BRL.format(v as number) },
          { campo: 'situacao', rotulo: t('paginas.painel.textos.situacao'), render: (p) => <Status rotulo={p.situacao} severidade={SEVERIDADE[p.situacao]} /> },
        ]}
      />
    </div>
  );
}
