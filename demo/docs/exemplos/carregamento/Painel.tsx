import { Girador, Indicador, Indicadores } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-pilha">
      {/* cada card carrega por conta própria: o painel aparece aos poucos */}
      <Indicadores>
        <Indicador rotulo="Vendas do mês" valor="R$ 184,2 mil" icone="chart-line" cor="var(--info-solid)" />
        <Indicador rotulo="Ticket médio" valor="" icone="wallet" carregando />
      </Indicadores>
      {/* girador: um trecho pequeno, quando não dá para prever o formato */}
      <div className="demo-linha" style={{ alignItems: 'center' }}>
        <Girador tamanho="pequeno" rotulo="Sincronizando com o estoque" mostrarRotulo />
      </div>
    </div>
  );
}
