import { Cartesiano } from './Cartesiano';
import type { DadoGrafico, EixoGrafico, EixoXGrafico, GraficoBaseProps, ReferenciaGrafico, SerieGrafico } from './tipos';

export interface GraficoBarrasProps extends GraficoBaseProps {
  dados: DadoGrafico[];
  eixoX: EixoXGrafico;
  eixoY?: EixoGrafico;
  /** Mais de uma série = barras agrupadas lado a lado. */
  series: SerieGrafico[];
  /** `horizontal` serve para rankings: os rótulos longos ficam inteiros, sem girar. */
  orientacao?: 'vertical' | 'horizontal';
  /** `--graf-pos` acima de zero e `--graf-neg` abaixo, com a linha do zero destacada. */
  divergente?: boolean;
  /** Valor escrito na ponta de cada barra (some se não couber). */
  rotulosNasBarras?: boolean;
  referencias?: ReferenciaGrafico[];
}

/** Barras verticais ou horizontais, agrupadas ou divergentes. */
export function GraficoBarras({ series, ...props }: GraficoBarrasProps) {
  return <Cartesiano {...props} series={series.map((s) => ({ ...s, tipo: 'barra' as const, eixo: undefined }))} />;
}
