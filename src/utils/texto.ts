/**
 * Texto e número: listas e valores por extenso (documentos), leitura de
 * caminho, formatação, saudação, iniciais, normalização para busca.
 */

/** `['A']` → `A` · `['A','B']` → `A e B` · `['A','B','C']` → `A, B e C`. */
export function listaPorExtenso(itens: readonly string[]): string {
  const l = itens.map((i) => i.trim()).filter(Boolean);
  if (l.length <= 1) return l[0] ?? '';
  return `${l.slice(0, -1).join(', ')} e ${l[l.length - 1]}`;
}

const UNIDADES = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
const DEZ_A_DEZENOVE = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
const DEZENAS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
const CENTENAS = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
const ESCALAS: [string, string][] = [
  ['', ''],
  ['mil', 'mil'],
  ['milhão', 'milhões'],
  ['bilhão', 'bilhões'],
  ['trilhão', 'trilhões'],
];

/** 1 a 999 por extenso. */
function grupoPorExtenso(n: number): string {
  if (n === 100) return 'cem';
  const c = Math.floor(n / 100);
  const resto = n % 100;
  const partes: string[] = [];
  if (c) partes.push(CENTENAS[c]);
  if (resto >= 10 && resto < 20) partes.push(DEZ_A_DEZENOVE[resto - 10]);
  else {
    const d = Math.floor(resto / 10);
    const u = resto % 10;
    if (d) partes.push(DEZENAS[d]);
    if (u) partes.push(UNIDADES[u]);
  }
  return partes.join(' e ');
}

/** Inteiro por extenso (trunca decimais): `1500` → `mil e quinhentos`. */
export function numeroPorExtenso(num: number): string {
  let n = Math.trunc(num);
  if (n === 0) return 'zero';
  if (n < 0) return `menos ${numeroPorExtenso(-n)}`;

  const grupos: number[] = [];
  while (n > 0) {
    grupos.push(n % 1000);
    n = Math.floor(n / 1000);
  }
  // o "e" entra antes do último grupo quando ele é < 100 ou centena redonda
  const ultimo = grupos.findIndex((g) => g > 0);
  const partes: string[] = [];
  for (let i = grupos.length - 1; i >= 0; i--) {
    const g = grupos[i];
    if (!g) continue;
    let texto = grupoPorExtenso(g);
    // "mil", não "um mil"; "um milhão" / "dois milhões"
    if (i === 1) texto = g === 1 ? 'mil' : `${texto} mil`;
    else if (i > 1) texto = `${texto} ${g === 1 ? ESCALAS[i][0] : ESCALAS[i][1]}`;
    const comE = partes.length > 0 && i === ultimo && (g < 100 || g % 100 === 0);
    partes.push(comE ? `e ${texto}` : texto);
  }
  return partes.join(' ');
}

/** Valor em reais por extenso: `1500.5` → `mil e quinhentos reais e cinquenta centavos`. */
export function valorMonetarioPorExtenso(valor: number): string {
  const total = Math.round(Math.abs(valor) * 100);
  const inteiro = Math.floor(total / 100);
  const centavos = total % 100;
  if (!inteiro && !centavos) return 'zero reais';

  const partes: string[] = [];
  if (inteiro) {
    // "dois milhões de reais", mas "quinhentos mil reais"
    const de = inteiro >= 1_000_000 && inteiro % 1_000_000 === 0 ? ' de' : '';
    partes.push(`${numeroPorExtenso(inteiro)}${de} ${inteiro === 1 ? 'real' : 'reais'}`);
  }
  if (centavos) partes.push(`${numeroPorExtenso(centavos)} ${centavos === 1 ? 'centavo' : 'centavos'}`);
  const texto = partes.join(' e ');
  return valor < 0 ? `menos ${texto}` : texto;
}

/** Lê um caminho com ponto (`a.b.c`); `undefined` se algum trecho faltar. */
export function lerCampo(obj: unknown, caminho: string): unknown {
  if (!caminho) return obj;
  return caminho
    .split('.')
    .reduce<unknown>((o, k) => (o !== null && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj);
}

const NUMERO = new Intl.NumberFormat('pt-BR');
const COMPACTO = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 });

/** `1243` → `1.243` · compacto: `12400` → `12,4 mil` (deixe o valor cheio no `title`). */
export function formatarNumero(valor: number, opcoes?: { compacto?: boolean }): string {
  return (opcoes?.compacto ? COMPACTO : NUMERO).format(valor);
}

/** 5–11h Bom dia · 12–17h Boa tarde · demais Boa noite. */
export function saudacaoPorHora(agora: Date = new Date()): string {
  const h = agora.getHours();
  if (h >= 5 && h < 12) return 'Bom dia';
  if (h >= 12 && h < 18) return 'Boa tarde';
  return 'Boa noite';
}

/** Primeira letra das duas primeiras palavras: `Gabrielly Ribeiro da Silva` → `GR`. */
export function iniciais(nome: string): string {
  return (nome ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

/** Sem acento e em minúsculas — a comparação de toda busca/filtro. */
export function normalizar(s: string): string {
  return (s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/** Formata CPF (até 11 dígitos) ou CNPJ (12 a 14) enquanto digita. */
export function formatCpfCnpj(v: string): string {
  const d = (v ?? '').replace(/\D/g, '').slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
  }
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/\/(\d{4})(\d{1,2})$/, '/$1-$2');
}

/** Nome em caixa de título (pt-BR): `GABRIELLY RIBEIRO` → `Gabrielly Ribeiro`. */
export function nomeProprio(valor: string): string {
  return (valor ?? '')
    .trim()
    .toLocaleLowerCase('pt-BR')
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0].toLocaleUpperCase('pt-BR') + p.slice(1))
    .join(' ');
}

/** Primeiro + último nome: `GABRIELLY RIBEIRO DA SILVA` → `Gabrielly Silva`. */
export function nomeCurto(valor: string): string {
  const p = nomeProprio(valor).split(' ');
  return p.length > 1 ? `${p[0]} ${p[p.length - 1]}` : p[0] ?? '';
}
