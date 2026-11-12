import { AcaoLinha, Tabela, useToast, type Coluna } from '../../../../src';
import { PEDIDOS, type Pedido } from './dados';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const COLUNAS: Coluna<Pedido>[] = [
  { campo: 'numero', rotulo: 'Pedido', destaque: true },
  { campo: 'cliente', rotulo: 'Cliente' },
  { campo: 'total', rotulo: 'Total', alinhamento: 'direita', formato: (v) => BRL.format(v as number) },
  {
    campo: 'situacao',
    rotulo: 'Situação',
    // severidade = a célula vira selo de situação
    severidade: (p) => (p.situacao === 'Pago' ? 'ok' : p.situacao === 'Cancelado' ? 'err' : 'warn'),
  },
];

export default function Exemplo() {
  const toast = useToast();

  return (
    <Tabela
      rotulo="Pedidos"
      colunas={COLUNAS}
      registros={PEDIDOS.slice(0, 5)}
      acoes={(p) => (
        <>
          <AcaoLinha icone="eye" rotulo="Visualizar" severidade="pri" onClick={() => toast.info(p.numero)} />
          <AcaoLinha icone="trash-2" rotulo="Excluir" severidade="err" onClick={() => toast.err(`Excluir ${p.numero}`)} />
        </>
      )}
    />
  );
}
