/** Política de senha: o app declara só o que muda sobre `POLITICA_PADRAO`. */
export interface PoliticaSenha {
  minimo: number;
  exigirMinuscula?: boolean;
  exigirMaiuscula?: boolean;
  exigirDigito?: boolean;
  exigirSimbolo?: boolean;
}

export type NivelForcaSenha = 'vazia' | 'fraca' | 'media' | 'forte';

export interface ForcaSenha {
  /** 0 (vazia) a 4. Abaixo do mínimo fica preso em 1. */
  score: number;
  nivel: NivelForcaSenha;
}

/** Padrão da biblioteca: só o tamanho. */
export const POLITICA_PADRAO: PoliticaSenha = { minimo: 8 };

const CLASSES = {
  minuscula: /[a-z]/,
  maiuscula: /[A-Z]/,
  digito: /\d/,
  simbolo: /[^a-zA-Z0-9]/,
};

/** Primeira regra violada (tamanho → minúscula → maiúscula → dígito → símbolo), ou `''`. */
export function validarSenha(senha: string, politica: PoliticaSenha = POLITICA_PADRAO): string {
  if (!senha) return '';
  if (senha.length < politica.minimo) return `Use pelo menos ${politica.minimo} caracteres`;
  if (politica.exigirMinuscula && !CLASSES.minuscula.test(senha)) return 'Inclua uma letra minúscula';
  if (politica.exigirMaiuscula && !CLASSES.maiuscula.test(senha)) return 'Inclua uma letra maiúscula';
  if (politica.exigirDigito && !CLASSES.digito.test(senha)) return 'Inclua um número';
  if (politica.exigirSimbolo && !CLASSES.simbolo.test(senha)) return 'Inclua um símbolo';
  return '';
}

/** Heurística barata: +1 por classe de caractere, +1 com `minimo + 4` de tamanho. */
export function forcaSenha(senha: string, politica: PoliticaSenha = POLITICA_PADRAO): ForcaSenha {
  if (!senha) return { score: 0, nivel: 'vazia' };
  if (senha.length < politica.minimo) return { score: 1, nivel: 'fraca' };
  let score = Object.values(CLASSES).filter((re) => re.test(senha)).length;
  if (senha.length >= politica.minimo + 4) score++;
  score = Math.max(1, Math.min(4, score));
  return { score, nivel: score >= 3 ? 'forte' : score === 2 ? 'media' : 'fraca' };
}

export function senhasIguais(a: string, b: string): boolean {
  return a === b;
}
