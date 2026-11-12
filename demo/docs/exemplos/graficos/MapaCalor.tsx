import { MapaCalor, type CelulaMapaCalor } from '../../../../src';

const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HORAS = ['8h', '10h', '12h', '14h', '16h', '18h'];
const BASE = [12, 18, 34, 22, 26, 31];

const VALORES: CelulaMapaCalor[] = HORAS.flatMap((hora, h) =>
  DIAS.map((dia, d) => ({ linha: hora, coluna: dia, valor: Math.round(BASE[h] * (d === 5 ? 0.6 : 1 + d * 0.05)) })),
);

export default function Exemplo() {
  return (
    <MapaCalor
      titulo="Pedidos por hora e dia"
      descricao="Quanto mais escura a célula, mais pedidos. Picos no almoço e no fim da tarde."
      linhas={HORAS}
      colunas={DIAS}
      valores={VALORES}
      unidade="pedidos"
      rotuloLinhas="Hora"
    />
  );
}
