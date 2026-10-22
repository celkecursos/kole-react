/**
 * Vocabulário de entidade e títulos de tela: verbo no infinitivo + substantivo
 * (`Cadastrar veículo`), sem artigo — nunca precisa saber o gênero.
 * Quando a regra não serve (verbo do domínio, substantivo deverbal), a
 * entidade declara a frase INTEIRA do modo.
 */

export type Modo = 'novo' | 'editar' | 'leitura';

export interface Entidade {
  /** Substantivo em minúsculas, como entra na frase (`veículo`). */
  readonly nome: string;
  /** Frases completas para os modos que fogem da regra (ex.: `Firmar contrato`). */
  readonly novo?: string;
  readonly editar?: string;
  readonly leitura?: string;
}

const VERBOS: Record<Modo, string> = { novo: 'Cadastrar', editar: 'Editar', leitura: 'Visualizar' };

/** Título da tela: a frase declarada do modo ou `Verbo nome`. */
export function tituloDeEntidade(entidade: string | Entidade, modo: Modo): string {
  const e: Entidade = typeof entidade === 'string' ? { nome: entidade } : entidade;
  const declarada = e[modo]?.trim();
  return declarada || `${VERBOS[modo]} ${e.nome}`.trim();
}

/** Troca `\ / : * ? " < > |` por `-` e junta espaços — nome seguro para "Salvar como PDF". */
export function nomeDeArquivo(texto: string): string {
  return (texto ?? '')
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}
