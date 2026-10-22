/**
 * Máscara de digitação simples, sem dependências.
 *
 * Coringas do padrão: `0` dígito · `A` letra · `S` letra ou dígito · `*` qualquer.
 * Qualquer outro caractere é literal e entra sozinho.
 * Vários padrões (array) = o primeiro que comporta o texto digitado vence
 * (ex.: telefone fixo × celular).
 */
export type Mascara = string | string[];

const CORINGAS: Record<string, RegExp> = {
  '0': /\d/,
  A: /[a-zA-Z]/,
  S: /[a-zA-Z0-9]/,
  '*': /./,
};

function capacidade(padrao: string): number {
  return [...padrao].filter((c) => c in CORINGAS).length;
}

/** Remove os literais da máscara, deixando só o que o usuário digitou. */
export function semMascara(valor: string): string {
  return valor.replace(/[^a-zA-Z0-9]/g, '');
}

export function aplicarMascara(valor: string, mascara: Mascara): string {
  const padroes = (Array.isArray(mascara) ? mascara : [mascara])
    .slice()
    .sort((a, b) => capacidade(a) - capacidade(b));
  const cru = semMascara(valor);
  const padrao = padroes.find((p) => capacidade(p) >= cru.length) ?? padroes[padroes.length - 1];

  let saida = '';
  let i = 0;
  for (const c of padrao) {
    if (i >= cru.length) break;
    const coringa = CORINGAS[c];
    if (coringa) {
      // descarta o que não casa com o coringa até achar um caractere válido
      while (i < cru.length && !coringa.test(cru[i])) i++;
      if (i >= cru.length) break;
      saida += cru[i++];
    } else {
      saida += c;
    }
  }
  return saida;
}

export const MASCARAS = {
  cpf: '000.000.000-00',
  cnpj: '00.000.000/0000-00',
  cep: '00000-000',
  telefone: ['(00) 0000-0000', '(00) 00000-0000'],
  placa: 'AAA0S00',
} as const;
