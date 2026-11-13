import { MASCARAS, type Mascara } from './mascara';
import type { Idioma } from '../i18n/idiomas';
import { validar, type TipoDeCampo } from './validadores';

/** Descritor de um tipo de campo: máscara, placeholder, validação e caixa alta. */
export interface MetaTipoCampo {
  mascara?: Mascara;
  placeholder?: string;
  /** Mensagem do erro (vazia se válido), no `idioma` (padrão `pt-BR`). */
  validar: (valor: string, idioma?: Idioma) => string;
  /** `true` = sempre maiúscula (placa) · `false` = nunca (e-mail). */
  caixaAlta?: boolean;
}

/** Fonte única de máscara/placeholder/validação de cada tipo de campo. */
export const TIPOS_CAMPO: Record<TipoDeCampo, MetaTipoCampo> = {
  cpf: { mascara: MASCARAS.cpf, placeholder: '000.000.000-00', validar: (v, i) => validar('cpf', v, i) },
  cnpj: { mascara: MASCARAS.cnpj, placeholder: '00.000.000/0000-00', validar: (v, i) => validar('cnpj', v, i) },
  cpfCnpj: { mascara: [MASCARAS.cpf, MASCARAS.cnpj], placeholder: 'CPF ou CNPJ', validar: (v, i) => validar('cpfCnpj', v, i) },
  email: { placeholder: 'nome@exemplo.com', validar: (v, i) => validar('email', v, i), caixaAlta: false },
  cep: { mascara: MASCARAS.cep, placeholder: '00000-000', validar: (v, i) => validar('cep', v, i) },
  telefone: { mascara: [...MASCARAS.telefone], placeholder: '(00) 00000-0000', validar: (v, i) => validar('telefone', v, i) },
  placa: { mascara: MASCARAS.placa, placeholder: 'ABC0A00', validar: (v, i) => validar('placa', v, i), caixaAlta: true },
  renavam: { mascara: '00000000000', placeholder: '00000000000', validar: (v, i) => validar('renavam', v, i) },
  chassi: { mascara: 'SSSSSSSSSSSSSSSSS', placeholder: 'Código de 17 caracteres', validar: (v, i) => validar('chassi', v, i), caixaAlta: true },
  cnh: { mascara: '00000000000', placeholder: '00000000000', validar: (v, i) => validar('cnh', v, i) },
  imei: { mascara: '000000000000000', placeholder: '000000000000000', validar: (v, i) => validar('imei', v, i) },
  hora: { mascara: '00:00', placeholder: 'HH:mm', validar: (v, i) => validar('hora', v, i) },
  data: { mascara: '00/00/0000', placeholder: 'dd/mm/aaaa', validar: (v, i) => validar('data', v, i) },
  dataHora: { mascara: '00/00/0000 00:00', placeholder: 'dd/mm/aaaa HH:mm', validar: (v, i) => validar('dataHora', v, i) },
};
