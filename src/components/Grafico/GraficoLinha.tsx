import { Cartesiano } from './Cartesiano';
import type { DadoGrafico, EixoGrafico, EixoXGrafico, FaixaGrafico, GraficoBaseProps, ReferenciaGrafico, SerieGrafico } from './tipos';

export interface GraficoLinhaProps extends GraficoBaseProps {
  /** Um objeto por ponto do eixo X. */
  dados: DadoGrafico[];
  eixoX: EixoXGrafico;
  eixoY?: EixoGrafico;
  series: SerieGrafico[];
  /** Marca os pontos. Padrão: sim até 60 pontos. */
  pontos?: boolean;
  /** Preenche abaixo da primeira série. */
  area?: boolean;
  /** Linhas horizontais (ex.: média mensal). */
  referencias?: ReferenciaGrafico[];
  /** Intervalos sombreados no eixo X (ex.: novembro e dezembro). */
  faixas?: FaixaGrafico[];
}

/** Séries ao longo do eixo X (tempo, categoria ou número). `null` deixa uma falha na linha. */
export function GraficoLinha({ series, ...props }: GraficoLinhaProps) {
  return <Cartesiano {...props} series={series.map((s) => ({ ...s, tipo: 'linha' as const, eixo: undefined }))} />;
}
