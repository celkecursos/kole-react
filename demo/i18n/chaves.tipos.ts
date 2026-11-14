/**
 * Teste de tipos dos textos da demo: roda no `npm run typecheck` (tsc), não no
 * navegador; nada importa este arquivo.
 *
 * Cada `@ts-expect-error` afirma que a linha de baixo NÃO compila. Se um dia
 * ela passar a compilar (o tipo ficou frouxo), o próprio tsc acusa a diretiva
 * sem uso e o typecheck falha.
 */
import type { Idioma } from '../../src/i18n/idiomas';
import { traduzir, traduzirPlural } from './traduzir';
import type { ChavePlural, ChaveTexto, TextosDemoParciais } from './tipos';
import type { TradutorDemo } from './useT';

export function testeChaves(idioma: Idioma, { t, tp }: TradutorDemo): string[] {
  return [
    // chaves que existem no pt-BR, em cada grupo da convenção
    t('menu.itens.painel'),
    t('menu.secoes.paginas'),
    t('paginas.painel.titulo'),
    t('docs.instalacao.titulo'),
    t('docs.instalacao.secoes.instalar', { versao: '0.5' }),
    tp('docs.indice.textos.resumo', 3),
    traduzir(idioma, 'docs.indice.titulo'),
    traduzirPlural(idioma, 'docs.indice.textos.resumo', 1),

    // @ts-expect-error chave usada no código e ausente no pt-BR
    t('menu.itens.naoExiste'),
    // @ts-expect-error tela que não está no dicionário
    t('paginas.telaInexistente.titulo'),
    // @ts-expect-error caminho incompleto: aponta para um grupo, não para um texto
    t('docs.instalacao.secoes'),
    // @ts-expect-error plural não serve como texto simples
    t('docs.indice.textos.resumo'),
    // @ts-expect-error texto simples não serve como plural
    tp('docs.instalacao.titulo', 2),
    // @ts-expect-error a função sem React também confere a chave
    traduzir(idioma, 'docs.naoExiste.titulo'),
  ];
}

// os parciais (en, es) só aceitam chaves do pt-BR e folhas do tipo certo
export const parcialValido: TextosDemoParciais = { docs: { instalacao: { titulo: 'Installation' } } };

export const parcialComChaveNova: TextosDemoParciais = {
  menu: {
    itens: {
      painel: 'Dashboard',
      // @ts-expect-error chave que não existe no pt-BR
      extra: 'Extra',
    },
  },
};

export const parcialComFolhaErrada: TextosDemoParciais = {
  docs: {
    indice: {
      // @ts-expect-error texto onde o pt-BR tem um grupo
      textos: 'texto',
    },
  },
};

// as uniões de chaves não podem virar `string` (o que aceitaria qualquer chave)
type EhString<T> = string extends T ? true : false;
export const chaveTextoFechada: EhString<ChaveTexto> = false;
export const chavePluralFechada: EhString<ChavePlural> = false;
