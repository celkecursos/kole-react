import { MASCARAS, type Mascara } from './mascara';
import { validar, type TipoDeCampo } from './validadores';

/** Descritor de um tipo de campo: máscara, placeholder, validação e caixa alta. */
export interface MetaTipoCampo {
  mascara?: Mascara;
  placeholder?: string;
  validar: (valor: string) => string;
  /** `true` = sempre maiúscula (placa) · `false` = nunca (e-mail). */
  caixaAlta?: boolean;
}

/** Fonte única de máscara/placeholder/validação de cada tipo de campo. */
export const TIPOS_CAMPO: Record<TipoDeCampo, MetaTipoCampo> = {
  cpf: { mascara: MASCARAS.cpf, placeholder: '000.000.000-00', validar: (v) => validar('cpf', v) },
  cnpj: { mascara: MASCARAS.cnpj, placeholder: '00.000.000/0000-00', validar: (v) => validar('cnpj', v) },
  cpfCnpj: { mascara: [MASCARAS.cpf, MASCARAS.cnpj], placeholder: 'CPF ou CNPJ', validar: (v) => validar('cpfCnpj', v) },
  email: { placeholder: 'nome@exemplo.com', validar: (v) => validar('email', v), caixaAlta: false },
  cep: { mascara: MASCARAS.cep, placeholder: '00000-000', validar: (v) => validar('cep', v) },
  telefone: { mascara: [...MASCARAS.telefone], placeholder: '(00) 00000-0000', validar: (v) => validar('telefone', v) },
  placa: { mascara: MASCARAS.placa, placeholder: 'ABC0A00', validar: (v) => validar('placa', v), caixaAlta: true },
  renavam: { mascara: '00000000000', placeholder: '00000000000', validar: (v) => validar('renavam', v) },
  chassi: { mascara: 'SSSSSSSSSSSSSSSSS', placeholder: 'Código de 17 caracteres', validar: (v) => validar('chassi', v), caixaAlta: true },
  cnh: { mascara: '00000000000', placeholder: '00000000000', validar: (v) => validar('cnh', v) },
  imei: { mascara: '000000000000000', placeholder: '000000000000000', validar: (v) => validar('imei', v) },
  hora: { mascara: '00:00', placeholder: 'HH:mm', validar: (v) => validar('hora', v) },
  data: { mascara: '00/00/0000', placeholder: 'dd/mm/aaaa', validar: (v) => validar('data', v) },
  dataHora: { mascara: '00/00/0000 00:00', placeholder: 'dd/mm/aaaa HH:mm', validar: (v) => validar('dataHora', v) },
};
