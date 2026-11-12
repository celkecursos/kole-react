import { Trilha, type ItemTrilha } from '../../../../src';

const ITENS: ItemTrilha[] = [
  { rotulo: 'Início', rota: '/', icone: 'house' },
  { rotulo: 'Cadastros', rota: '/cadastros' },
  { rotulo: 'Clientes', rota: '/clientes' },
  { rotulo: 'Mercado Bom Preço' },
];

export default function Exemplo() {
  return (
    <div className="demo-pilha-p">
      <Trilha itens={ITENS} />
      <Trilha itens={ITENS} separador="barra" icones="nenhum" />
      <Trilha itens={ITENS} separador="seta" aparencia="fundo" />
    </div>
  );
}
