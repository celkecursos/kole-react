/** Severidade de situação (selo, alerta, toast). */
export type Severidade = 'ok' | 'info' | 'warn' | 'err' | 'neutral';

/** Opção de select/escolha. */
export interface Opcao<V = string> {
  valor: V;
  rotulo: string;
  desabilitada?: boolean;
}
