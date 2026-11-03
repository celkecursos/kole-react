import { Cartesiano } from './Cartesiano';
import type { DadoGrafico, EixoGrafico, EixoXGrafico, GraficoBaseProps, ReferenciaGrafico, SerieGrafico } from './tipos';

export interface GraficoCombinadoProps extends GraficoBaseProps {
  dados: DadoGrafico[];
  eixoX: EixoXGrafico;
  /** Eixo esquerdo. */
  eixoY?: EixoGrafico;
  eixoYDireito?: EixoGrafico;
  /** Padrão: eixo esquerdo. */
  barras?: SerieGrafico[];
  /** Padrão: eixo direito. */
  linhas?: SerieGrafico[];
  referencias?: ReferenciaGrafico[];
  /** Marca os pontos das linhas. Padrão: sim até 60 pontos. */
  pontos?: boolean;
}

/**
 * Barras e linhas no mesmo eixo X, com dois eixos Y. A legenda diz o eixo de cada
 * série ("Ticket médio (R$, eixo direito)"): sem isso, o gráfico de dois eixos engana.
 */
export function GraficoCombinado({ barras = [], linhas = [], eixoYDireito, ...props }: GraficoCombinadoProps) {
  return (
    <Cartesiano
      {...props}
      eixoYDireito={eixoYDireito ?? {}}
      series={[...barras.map((s) => ({ ...s, tipo: 'barra' as const })), ...linhas.map((s) => ({ ...s, tipo: 'linha' as const }))]}
    />
  );
}
