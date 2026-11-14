/**
 * Dados de exemplo da demo (clientes, produtos, tarefas, lançamentos…): a
 * tradução sai pelo próprio texto em pt-BR, numa tabela por idioma
 * (`en/conteudo.ts`, `es/conteudo.ts`). Os dados continuam escritos em pt-BR,
 * com os tipos de sempre; a página traduz na hora de mostrar, com o `tc` do
 * `useT()`. Texto que não está na tabela (um nome próprio, o que a pessoa
 * digitou) sai como está.
 */
import type { Idioma } from '../../src/i18n/idiomas';
import { conteudoEn } from './en/conteudo';
import { conteudoEs } from './es/conteudo';

const TABELAS: Record<string, Record<string, string> | undefined> = { en: conteudoEn, es: conteudoEs };

/**
 * O texto de exemplo no idioma. O tipo não muda (serve para literais e
 * uniões); o que não é texto (número, elemento React) sai como está.
 */
export function traduzirConteudo<T>(idioma: Idioma, texto: T): T {
  if (typeof texto !== 'string' || !texto) return texto;
  return (TABELAS[idioma]?.[texto] ?? texto) as T;
}
