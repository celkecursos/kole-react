import { BotaoOcultarValores, ProvedorValores, Valor } from '../../../../src';

export default function Exemplo() {
  return (
    // tudo dentro do provedor obedece ao olho
    <ProvedorValores>
      <div className="demo-pilha">
        <div className="demo-linha">
          <Valor valor={48110.91} tamanho="destaque" />
          <BotaoOcultarValores />
        </div>
        <div className="demo-linha">
          <Valor valor={8900} tipo="receita" forte />
          <Valor valor={2200} tipo="despesa" forte />
          <Valor valor={800} tipo="neutro" />
          <Valor valor={-312.4} colorir />
          <Valor valor={1250000} compacto />
          <Valor valor={189} riscado />
        </div>
      </div>
    </ProvedorValores>
  );
}
