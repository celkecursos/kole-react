import { Acordeao, ItemAcordeao } from '../../../../src';

export default function Exemplo() {
  return (
    <Acordeao padraoAbertos={['prazo']}>
      <ItemAcordeao valor="prazo" titulo="Qual o prazo de entrega?" icone="truck">
        Pedidos pagos até as 14h saem no mesmo dia; depois disso, no dia útil seguinte.
      </ItemAcordeao>
      <ItemAcordeao valor="troca" titulo="Como faço uma troca?" icone="rotate-cw">
        Em até 7 dias corridos após o recebimento, com a nota fiscal.
      </ItemAcordeao>
      <ItemAcordeao valor="pagamento" titulo="Quais formas de pagamento?" icone="wallet">
        Pix, boleto e cartão de crédito em até 6 vezes.
      </ItemAcordeao>
    </Acordeao>
  );
}
