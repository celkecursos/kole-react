import { Badge, Botao, Card, Imagem } from '../../../../src';
import { cena } from './cena';

export default function Exemplo() {
  return (
    <div className="demo-cards">
      <Card titulo="Resumo do dia" subtitulo="Atualizado às 10h" ferramentas={<Badge rotulo="Novo" cor="destaque" />}>
        37 pedidos, R$ 8.420 em vendas.
      </Card>
      <Card
        midia={<Imagem src={cena('#9cc3f5', '#2f7d4f')} alt="Paisagem com morros" />}
        titulo="Campanha de inverno"
        acoes={<Botao rotulo="Ver campanha" tamanho="pequeno" />}
      >
        Descontos de até 20% em bebidas quentes.
      </Card>
      <Card titulo="Estoque crítico" borda="err" rodape="3 produtos abaixo do mínimo">
        Café, açúcar e leite em pó.
      </Card>
    </div>
  );
}
