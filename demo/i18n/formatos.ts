/**
 * Formatadores da demo no idioma ativo (o do seletor da topbar). Ficam no
 * nível do módulo, como um `Intl.NumberFormat` fixo, mas leem o idioma na hora
 * de formatar: trocar o idioma muda datas e números sem recriar nada. A moeda
 * continua sendo a do formato (real), só a escrita muda (`R$ 1.234,50` ·
 * `R$1,234.50`).
 */
import { formatoData, formatoNumero, idiomaAtivo, localeDe } from '../../src';

/** `Intl.NumberFormat` no idioma ativo. */
export const numeroNoIdioma = (opcoes?: Intl.NumberFormatOptions) => ({
  format: (valor: number | bigint) => formatoNumero(idiomaAtivo(), opcoes).format(valor),
});

/** `Intl.DateTimeFormat` no idioma ativo. */
export const dataNoIdioma = (opcoes?: Intl.DateTimeFormatOptions) => ({
  format: (data?: Date | number) => formatoData(idiomaAtivo(), opcoes).format(data),
});

/** O locale do `Intl` do idioma ativo (`en-US`, `pt-BR`…), para `toLocaleString`. */
export const localeAtivo = () => localeDe(idiomaAtivo());
