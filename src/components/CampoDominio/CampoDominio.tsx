import { ESTADOS, TIPOS_PESSOA } from '../../utils/constantes';
import { CampoSelect, CampoSelectMultiplo, type CampoSelectMultiploProps, type CampoSelectProps } from '../CampoSelect/CampoSelect';

type SemOpcoes<P> = Omit<P, 'opcoes'>;

export interface CampoUfProps extends SemOpcoes<CampoSelectProps<string>> {
  /** `sigla` = "PR" · `completo` = "PR — Paraná" (padrão). */
  exibicao?: 'sigla' | 'completo';
}

const opcoesUf = (exibicao: CampoUfProps['exibicao']) =>
  ESTADOS.map((e) => ({ valor: e.uf, rotulo: exibicao === 'sigla' ? e.uf : `${e.uf} — ${e.descricao}` }));

/** UF (estado) a partir de `ESTADOS`; o valor é a sigla. */
export function CampoUf({ exibicao = 'completo', comBusca = true, placeholder = 'UF', ...p }: CampoUfProps) {
  return <CampoSelect<string> opcoes={opcoesUf(exibicao)} comBusca={comBusca} placeholder={placeholder} {...p} />;
}

export interface CampoUfMultiploProps extends SemOpcoes<CampoSelectMultiploProps<string>> {
  exibicao?: 'sigla' | 'completo';
}

/** Várias UFs; o valor é a lista de siglas. */
export function CampoUfMultiplo({ exibicao = 'completo', comBusca = true, placeholder = 'UFs', ...p }: CampoUfMultiploProps) {
  return <CampoSelectMultiplo<string> opcoes={opcoesUf(exibicao)} comBusca={comBusca} placeholder={placeholder} {...p} />;
}

export type CampoTipoPessoaProps = SemOpcoes<CampoSelectProps<'F' | 'J'>>;

/** Pessoa física (`F`) ou jurídica (`J`). */
export function CampoTipoPessoa({ placeholder = 'Selecione', ...p }: CampoTipoPessoaProps) {
  return <CampoSelect<'F' | 'J'> opcoes={[...TIPOS_PESSOA]} placeholder={placeholder} {...p} />;
}
