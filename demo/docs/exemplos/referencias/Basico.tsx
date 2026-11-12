import { Referencias, type ItemReferencia } from '../../../../src';

const FONTES: ItemReferencia[] = [
  {
    id: '1',
    titulo: 'Política de trocas e devoluções',
    detalhe: 'Atualizada em 03/2026',
    trecho: 'O cliente tem até 7 dias corridos após o recebimento para pedir a troca, com a nota fiscal.',
    href: '#',
  },
  { id: '2', titulo: 'Manual de entregas', detalhe: 'Seção 4.2', trecho: 'Pedidos pagos até as 14h saem no mesmo dia.' },
];

export default function Exemplo() {
  return <Referencias itens={FONTES} abertoInicial />;
}
