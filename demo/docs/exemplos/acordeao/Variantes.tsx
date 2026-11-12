import { Acordeao, ItemAcordeao } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-grade-2">
      {/* multiplo: vários abertos ao mesmo tempo */}
      <Acordeao multiplo variante="suave" cor="pri" separado icone="mais">
        <ItemAcordeao valor="a" titulo="Dados gerais">Nome, CNPJ e contato.</ItemAcordeao>
        <ItemAcordeao valor="b" titulo="Endereço">Rua, número e cidade.</ItemAcordeao>
      </Acordeao>
      <Acordeao variante="contorno" posicaoIcone="inicio">
        <ItemAcordeao valor="a" titulo="Primeira seção">Conteúdo da primeira seção.</ItemAcordeao>
        <ItemAcordeao valor="b" titulo="Indisponível" desabilitado>—</ItemAcordeao>
      </Acordeao>
    </div>
  );
}
