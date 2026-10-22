/** Fonte única de severidades; cada componente usa um recorte dela. */
export const SEVERIDADES = ['pri', 'ok', 'warn', 'err', 'info', 'neutral'] as const;

export type SeveridadeCompleta = (typeof SEVERIDADES)[number];

const CORES: Record<SeveridadeCompleta, string> = {
  pri: 'var(--pri)',
  ok: 'var(--ok-solid)',
  warn: 'var(--warn-solid)',
  err: 'var(--err-solid)',
  info: 'var(--info-solid)',
  neutral: 'var(--t3)',
};

/** Cor SÓLIDA da severidade (`var(--token)`) — para filete, tile ou marcador fora de um selo. */
export function severidadeCor(sev: SeveridadeCompleta): string {
  return CORES[sev];
}

/** O texto é um dos nomes de severidade? */
export function ehSeveridade(valor: string): valor is SeveridadeCompleta {
  return (SEVERIDADES as readonly string[]).includes(valor);
}
