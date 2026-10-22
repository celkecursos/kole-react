/**
 * Validadores de dados brasileiros: predicados `is*` + o despachante `validar()`.
 * Lógica pura, sem React. A máscara de cada tipo mora em `tiposCampo.ts`.
 */

export const TIPOS_DE_CAMPO = [
  'cpf',
  'cnpj',
  'cpfCnpj',
  'email',
  'cep',
  'telefone',
  'placa',
  'renavam',
  'chassi',
  'cnh',
  'imei',
  'hora',
  'data',
  'dataHora',
] as const;

export type TipoDeCampo = (typeof TIPOS_DE_CAMPO)[number];

const digitos = (v: string) => (v ?? '').replace(/\D/g, '');
const repetido = (d: string) => /^(\d)\1*$/.test(d);

/** Dígito verificador mod-11 (CPF/CNPJ): pesos aplicados da esquerda para a direita. */
function dvMod11(base: string, pesos: number[]): number {
  const soma = [...base].reduce((s, c, i) => s + Number(c) * pesos[i], 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

/** CPF com os dois dígitos verificadores; rejeita sequências repetidas. */
export function isCpf(v: string): boolean {
  const d = digitos(v);
  if (d.length !== 11 || repetido(d)) return false;
  const dv1 = dvMod11(d.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const dv2 = dvMod11(d.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return dv1 === Number(d[9]) && dv2 === Number(d[10]);
}

/** CNPJ com os dois dígitos verificadores; rejeita sequências repetidas. */
export function isCnpj(v: string): boolean {
  const d = digitos(v);
  if (d.length !== 14 || repetido(d)) return false;
  const dv1 = dvMod11(d.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const dv2 = dvMod11(d.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return dv1 === Number(d[12]) && dv2 === Number(d[13]);
}

/** Mais de 11 dígitos = CNPJ; senão, CPF. */
export function isCpfCnpj(v: string): boolean {
  return digitos(v).length > 11 ? isCnpj(v) : isCpf(v);
}

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v ?? '').trim());
}

export function isCep(v: string): boolean {
  return digitos(v).length === 8;
}

/** Fixo (10 dígitos) ou celular (11), sempre com DDD. */
export function isTelefone(v: string): boolean {
  const n = digitos(v).length;
  return n === 10 || n === 11;
}

/** Placa antiga `AAA0000` ou Mercosul `AAA0A00` (aceita hífen). */
export function isPlaca(v: string): boolean {
  const p = (v ?? '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return /^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(p);
}

/** RENAVAM: por enquanto só o tamanho (9 a 11 dígitos); o dígito verificador fica para depois. */
export function isRenavam(v: string): boolean {
  const n = digitos(v).length;
  return n >= 9 && n <= 11 && n === (v ?? '').replace(/\s/g, '').length;
}

/** Chassi (VIN): 17 caracteres alfanuméricos, sem I, O e Q. */
export function isChassi(v: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{17}$/.test((v ?? '').trim().toUpperCase());
}

/** CNH: 9 dígitos + 2 verificadores (algoritmo do DENATRAN). */
export function isCnh(v: string): boolean {
  const d = digitos(v);
  if (d.length !== 11 || repetido(d)) return false;
  let soma = 0;
  for (let i = 0, peso = 9; i < 9; i++, peso--) soma += Number(d[i]) * peso;
  let dv1 = soma % 11;
  let desconto = 0;
  if (dv1 >= 10) {
    dv1 = 0;
    desconto = 2;
  }
  soma = 0;
  for (let i = 0, peso = 1; i < 9; i++, peso++) soma += Number(d[i]) * peso;
  const resto = soma % 11;
  let dv2 = resto >= 10 ? 0 : resto - desconto;
  if (dv2 < 0) dv2 += 11;
  if (dv2 >= 10) dv2 = 0;
  return dv1 === Number(d[9]) && dv2 === Number(d[10]);
}

/** IMEI: 15 dígitos validados por Luhn; rejeita sequências repetidas. */
export function isImei(v: string): boolean {
  const d = digitos(v);
  if (d.length !== 15 || repetido(d)) return false;
  let soma = 0;
  for (let i = 0; i < 15; i++) {
    let n = Number(d[i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    soma += n;
  }
  return soma % 10 === 0;
}

/** `HH:mm` entre 00:00 e 23:59. */
export function isHora(v: string): boolean {
  const m = /^(\d{2}):(\d{2})$/.exec((v ?? '').trim());
  return !!m && Number(m[1]) <= 23 && Number(m[2]) <= 59;
}

/** `dd/mm/aaaa` existente no calendário (31/02 é recusado). */
export function isData(v: string): boolean {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((v ?? '').trim());
  if (!m) return false;
  const [d, mes, a] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(a, mes - 1, d);
  return dt.getFullYear() === a && dt.getMonth() === mes - 1 && dt.getDate() === d;
}

/** `dd/mm/aaaa HH:mm`. */
export function isDataHora(v: string): boolean {
  const [data, hora, ...resto] = (v ?? '').trim().split(/\s+/);
  return !resto.length && isData(data ?? '') && isHora(hora ?? '');
}

/**
 * Telefone, opcionalmente restrito a um formato. Vazio é válido
 * (obrigatoriedade é assunto do campo, não do validador).
 */
export function validarTelefone(v: string, tipo?: 'fixo' | 'celular'): string {
  const n = digitos(v).length;
  if (!n) return '';
  if (tipo === 'fixo') return n === 10 ? '' : 'Deve ser um telefone fixo com DDD';
  if (tipo === 'celular') return n === 11 ? '' : 'Deve ser um celular com DDD';
  return n === 10 || n === 11 ? '' : 'Telefone incompleto';
}

/**
 * Mensagem de validação do tipo, ou `''` quando vazio ou válido.
 * Separa "incompleto" (ainda digitando) de "inválido" (errado).
 */
export function validar(tipo: TipoDeCampo, valor: string): string {
  const v = (valor ?? '').trim();
  if (!v) return '';
  const n = digitos(v).length;
  switch (tipo) {
    case 'cpf':
      return n < 11 ? 'CPF incompleto' : isCpf(v) ? '' : 'CPF inválido';
    case 'cnpj':
      return n < 14 ? 'CNPJ incompleto' : isCnpj(v) ? '' : 'CNPJ inválido';
    case 'cpfCnpj':
      if (n < 11) return 'CPF/CNPJ incompleto';
      if (n === 11) return isCpf(v) ? '' : 'CPF inválido';
      if (n < 14) return 'CNPJ incompleto';
      return isCnpj(v) ? '' : 'CNPJ inválido';
    case 'email':
      return isEmail(v) ? '' : 'E-mail inválido';
    case 'cep':
      return isCep(v) ? '' : 'CEP incompleto';
    case 'telefone':
      return validarTelefone(v);
    case 'placa':
      return isPlaca(v) ? '' : 'Placa inválida';
    case 'renavam':
      return isRenavam(v) ? '' : 'RENAVAM deve ter de 9 a 11 dígitos';
    case 'chassi':
      return v.replace(/\s/g, '').length < 17 ? 'Chassi incompleto' : isChassi(v) ? '' : 'Chassi inválido';
    case 'cnh':
      return n < 11 ? 'CNH incompleta' : isCnh(v) ? '' : 'CNH inválida';
    case 'imei':
      return n < 15 ? 'IMEI incompleto' : isImei(v) ? '' : 'IMEI inválido';
    case 'hora':
      return isHora(v) ? '' : 'Hora inválida';
    case 'data':
      return isData(v) ? '' : 'Data inválida';
    case 'dataHora':
      return isDataHora(v) ? '' : 'Data e hora inválidas';
  }
}
