import type { Opcao } from './tipos';

/** Unidade federativa: sigla + nome. */
export interface Uf {
  uf: string;
  descricao: string;
}

/** Os 26 estados + o Distrito Federal, em ordem alfabética da sigla. */
export const ESTADOS: readonly Uf[] = [
  { uf: 'AC', descricao: 'Acre' },
  { uf: 'AL', descricao: 'Alagoas' },
  { uf: 'AM', descricao: 'Amazonas' },
  { uf: 'AP', descricao: 'Amapá' },
  { uf: 'BA', descricao: 'Bahia' },
  { uf: 'CE', descricao: 'Ceará' },
  { uf: 'DF', descricao: 'Distrito Federal' },
  { uf: 'ES', descricao: 'Espírito Santo' },
  { uf: 'GO', descricao: 'Goiás' },
  { uf: 'MA', descricao: 'Maranhão' },
  { uf: 'MG', descricao: 'Minas Gerais' },
  { uf: 'MS', descricao: 'Mato Grosso do Sul' },
  { uf: 'MT', descricao: 'Mato Grosso' },
  { uf: 'PA', descricao: 'Pará' },
  { uf: 'PB', descricao: 'Paraíba' },
  { uf: 'PE', descricao: 'Pernambuco' },
  { uf: 'PI', descricao: 'Piauí' },
  { uf: 'PR', descricao: 'Paraná' },
  { uf: 'RJ', descricao: 'Rio de Janeiro' },
  { uf: 'RN', descricao: 'Rio Grande do Norte' },
  { uf: 'RO', descricao: 'Rondônia' },
  { uf: 'RR', descricao: 'Roraima' },
  { uf: 'RS', descricao: 'Rio Grande do Sul' },
  { uf: 'SC', descricao: 'Santa Catarina' },
  { uf: 'SE', descricao: 'Sergipe' },
  { uf: 'SP', descricao: 'São Paulo' },
  { uf: 'TO', descricao: 'Tocantins' },
];

/** Só as siglas, derivadas de `ESTADOS`. */
export const UF_SIGLAS: readonly string[] = ESTADOS.map((e) => e.uf);

/** Opções prontas para select: valor = sigla, rótulo = "PR — Paraná". */
export const OPCOES_ESTADOS: readonly Opcao[] = ESTADOS.map((e) => ({ valor: e.uf, rotulo: `${e.uf} — ${e.descricao}` }));

/** Tipo de pessoa no formato rótulo/valor. `F`/`J` é a convenção comum dos backends. */
export const TIPOS_PESSOA: readonly Opcao<'F' | 'J'>[] = [
  { rotulo: 'Física', valor: 'F' },
  { rotulo: 'Jurídica', valor: 'J' },
];
