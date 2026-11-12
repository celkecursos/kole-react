import { Card, GrupoCards } from '../../../../src';

export default function Exemplo() {
  return (
    // GrupoCards: cards colados numa faixa só, com borda comum
    <GrupoCards>
      <Card titulo="Hoje">37 pedidos</Card>
      <Card titulo="Semana">212 pedidos</Card>
      <Card titulo="Mês">884 pedidos</Card>
    </GrupoCards>
  );
}
