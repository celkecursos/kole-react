/**
 * Tipos dos textos da demo. As chaves saem do pt-BR: usar no código uma chave
 * que não está lá é erro de tipo (ver chaves.tipos.ts).
 */
import type { Plural } from '../../src/i18n/idiomas';
import type { textosDemoPtBR } from './pt-BR';

/** O formato do dicionário da demo (o do pt-BR). */
export type TextosDemo = typeof textosDemoPtBR;

/** Folha de plural: um objeto com `other` (as formas do `Intl.PluralRules`). */
type EhPlural<T> = T extends { other: string } ? true : false;

/** O dicionário de outro idioma: tudo opcional, mas só com chaves do pt-BR. */
export type TextosDemoParciais<T = TextosDemo> = {
  [K in keyof T]?: T[K] extends string ? string : EhPlural<T[K]> extends true ? Plural : TextosDemoParciais<T[K]>;
};

/** `'menu.itens.painel'`, `'docs.instalacao.secoes.instalar'`…: as chaves de texto, para o `t`. */
export type ChaveTexto<T = TextosDemo, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${P}${K}`
    : EhPlural<T[K]> extends true
      ? never
      : ChaveTexto<T[K], `${P}${K}.`>;
}[keyof T & string];

/** As chaves de plural (`'docs.indice.textos.resumo'`), para o `tp`. */
export type ChavePlural<T = TextosDemo, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? never
    : EhPlural<T[K]> extends true
      ? `${P}${K}`
      : ChavePlural<T[K], `${P}${K}.`>;
}[keyof T & string];
