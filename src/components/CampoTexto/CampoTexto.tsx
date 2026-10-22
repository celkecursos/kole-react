import { forwardRef, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import { aplicarMascara, MASCARAS, type Mascara } from '../../utils/mascara';
import { TIPOS_CAMPO } from '../../utils/tiposCampo';
import { validarTelefone, type TipoDeCampo } from '../../utils/validadores';
import { Campo, descricaoDe, useCampoIds, useValidacaoCampo, type CampoBaseProps } from '../Campo/Campo';
import './CampoTexto.css';

type InputNativo = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'className'>;

export interface CampoTextoProps extends CampoBaseProps, InputNativo {
  valor?: string;
  aoMudar?: (valor: string) => void;
  /** Ícone à esquerda, dentro do campo. */
  icone?: IconeProp;
  /** Máscara de digitação (`0` dígito, `A` letra, `S` alfanumérico). */
  mascara?: Mascara;
  /** Converte o texto para CAIXA ALTA enquanto digita. */
  maiuscula?: boolean;
  /** Texto fixo antes do valor (ex.: "R$"). */
  prefixo?: ReactNode;
  /** Conteúdo após o valor (ex.: botão de lupa). */
  sufixo?: ReactNode;
  /**
   * Regra de formato: devolve a mensagem, ou `''` se válido. O erro aparece
   * ao sair do campo depois de digitar (ou ao salvar o `Form`).
   */
  validar?: (valor: string) => string;
}

export const CampoTexto = forwardRef<HTMLInputElement, CampoTextoProps>(function CampoTexto(
  {
    rotulo,
    dica,
    erro,
    aviso,
    obrigatorio,
    variante = 'campo',
    className,
    id: idExterno,
    valor,
    aoMudar,
    onChange,
    icone,
    mascara,
    maiuscula,
    prefixo,
    sufixo,
    disabled,
    type = 'text',
    validar,
    onBlur,
    ...resto
  },
  ref,
) {
  const { id, msgId } = useCampoIds(idExterno);
  const validacao = useValidacaoCampo({ valor: valor ?? '', validar, obrigatorio, erro, aviso });
  erro = validacao.erro;
  aviso = validacao.aviso;
  const inline = variante === 'inline';
  const emMoldura = !inline && (prefixo !== undefined || sufixo !== undefined);

  const aoDigitar = (e: ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (mascara) v = aplicarMascara(v, mascara);
    if (maiuscula) v = v.toUpperCase();
    if (v !== e.target.value) e.target.value = v;
    validacao.aoInteragir();
    aoMudar?.(v);
    onChange?.(e);
  };

  const input = (
    <input
      ref={ref}
      id={id}
      type={type}
      className={cx('lp-input', (inline || emMoldura) && 'lp-input--bare')}
      value={valor}
      onChange={aoDigitar}
      onBlur={(e) => {
        validacao.aoSair();
        onBlur?.(e);
      }}
      disabled={disabled}
      required={obrigatorio}
      aria-required={obrigatorio || undefined}
      aria-invalid={erro ? true : undefined}
      aria-describedby={descricaoDe({ erro, aviso, dica }, msgId)}
      {...resto}
    />
  );

  return (
    <Campo
      rotulo={rotulo}
      dica={dica}
      erro={erro}
      aviso={aviso}
      obrigatorio={obrigatorio}
      variante={variante}
      className={className}
      htmlFor={id}
      msgId={msgId}
    >
      {emMoldura ? (
        <div className={cx('lp-ctl-frame', 'lp-campo-frame', erro && 'is-invalid', disabled && 'is-disabled')}>
          <Icone icone={icone} className="lp-campo-frame-ic" />
          {prefixo !== undefined && <span className="lp-campo-prefixo">{prefixo}</span>}
          {input}
          {sufixo}
        </div>
      ) : (
        <div className={cx('lp-campo-texto', inline && 'lp-campo-texto--inline', !!icone && 'tem-icone')}>
          <Icone icone={icone} className="lp-campo-texto-ic" />
          {input}
        </div>
      )}
    </Campo>
  );
});

/* ---------- campos prontos (máscaras e validação brasileiras) ---------- */

type Preset = Omit<CampoTextoProps, 'mascara'>;

/** Monta um campo tipado a partir do descritor `TIPOS_CAMPO` (máscara + placeholder + regra). */
function campoTipado(tipo: TipoDeCampo, nome: string, extra: Partial<CampoTextoProps> = {}) {
  const meta = TIPOS_CAMPO[tipo];
  const C = forwardRef<HTMLInputElement, Preset>((p, ref) => (
    <CampoTexto
      ref={ref}
      mascara={meta.mascara}
      placeholder={meta.placeholder}
      maiuscula={meta.caixaAlta}
      validar={meta.validar}
      {...extra}
      {...p}
    />
  ));
  C.displayName = nome;
  return C;
}

export const CampoCpf = campoTipado('cpf', 'CampoCpf', { inputMode: 'numeric' });
export const CampoCnpj = campoTipado('cnpj', 'CampoCnpj', { inputMode: 'numeric' });
/** CPF ou CNPJ: a máscara muda pelo número de dígitos. */
export const CampoCpfCnpj = campoTipado('cpfCnpj', 'CampoCpfCnpj', { inputMode: 'numeric' });
export const CampoCep = campoTipado('cep', 'CampoCep', { inputMode: 'numeric' });
export const CampoPlaca = campoTipado('placa', 'CampoPlaca');
export const CampoEmail = campoTipado('email', 'CampoEmail', {
  type: 'email',
  inputMode: 'email',
  autoComplete: 'email',
  icone: 'mail',
});
/** RENAVAM: 9 a 11 dígitos. */
export const CampoRenavam = campoTipado('renavam', 'CampoRenavam', { inputMode: 'numeric' });
/** Chassi (VIN): 17 caracteres, sem I, O e Q. */
export const CampoChassi = campoTipado('chassi', 'CampoChassi');
/** CNH com dígitos verificadores do DENATRAN. */
export const CampoCnh = campoTipado('cnh', 'CampoCnh', { inputMode: 'numeric' });
/** IMEI com verificação de Luhn. */
export const CampoImei = campoTipado('imei', 'CampoImei', { inputMode: 'numeric' });

export interface CampoTelefoneProps extends Preset {
  /** Restringe a fixo (10 dígitos) ou celular (11). Sem `tipo`, aceita os dois. */
  tipo?: 'fixo' | 'celular';
}

export const CampoTelefone = forwardRef<HTMLInputElement, CampoTelefoneProps>(({ tipo, ...p }, ref) => {
  const [fixo, celular] = MASCARAS.telefone;
  return (
    <CampoTexto
      ref={ref}
      mascara={tipo === 'fixo' ? fixo : tipo === 'celular' ? celular : [fixo, celular]}
      inputMode="tel"
      type="tel"
      placeholder={tipo === 'fixo' ? '(00) 0000-0000' : '(00) 00000-0000'}
      validar={(v) => validarTelefone(v, tipo)}
      {...p}
    />
  );
});
CampoTelefone.displayName = 'CampoTelefone';

/** Data no formato ISO (`AAAA-MM-DD`), com o seletor nativo do navegador. */
export const CampoData = forwardRef<HTMLInputElement, Preset>((p, ref) => (
  <CampoTexto ref={ref} type="date" {...p} />
));
CampoData.displayName = 'CampoData';

/** Hora `HH:MM`. */
export const CampoHora = forwardRef<HTMLInputElement, Preset>((p, ref) => (
  <CampoTexto ref={ref} type="time" {...p} />
));
CampoHora.displayName = 'CampoHora';

/** Data e hora `AAAA-MM-DDTHH:MM`. */
export const CampoDataHora = forwardRef<HTMLInputElement, Preset>((p, ref) => (
  <CampoTexto ref={ref} type="datetime-local" {...p} />
));
CampoDataHora.displayName = 'CampoDataHora';

/* ---------- numéricos ---------- */

type PresetNumerico = Omit<CampoTextoProps, 'mascara' | 'valor' | 'aoMudar'> & {
  valor?: number | null;
  aoMudar?: (valor: number | null) => void;
};

const BRL = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Valor em reais: digita-se da direita (centavos primeiro), como no caixa. */
export const CampoMoeda = forwardRef<HTMLInputElement, PresetNumerico>(function CampoMoeda(
  { valor, aoMudar, ...p },
  ref,
) {
  return (
    <CampoTexto
      ref={ref}
      inputMode="numeric"
      prefixo="R$"
      placeholder="0,00"
      valor={valor === null || valor === undefined ? '' : BRL.format(valor)}
      aoMudar={(t) => {
        const digitos = t.replace(/\D/g, '');
        aoMudar?.(digitos ? Number(digitos) / 100 : null);
      }}
      {...p}
    />
  );
});

/** Número inteiro (só dígitos). */
export const CampoInteiro = forwardRef<HTMLInputElement, PresetNumerico>(function CampoInteiro(
  { valor, aoMudar, ...p },
  ref,
) {
  return (
    <CampoTexto
      ref={ref}
      inputMode="numeric"
      valor={valor === null || valor === undefined ? '' : String(valor)}
      aoMudar={(t) => {
        const digitos = t.replace(/\D/g, '');
        aoMudar?.(digitos ? Number(digitos) : null);
      }}
      {...p}
    />
  );
});
