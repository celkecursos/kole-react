import { Icone } from '../../utils/Icone';
import { useState, type KeyboardEvent } from 'react';
import { cx } from '../../utils/cx';
import { forcaSenha, POLITICA_PADRAO, validarSenha, type PoliticaSenha } from '../../utils/senha';
import { CampoTexto, type CampoTextoProps } from '../CampoTexto/CampoTexto';
import './CampoSenha.css';
import { useIdioma, useTextos } from '../../i18n/contexto';
import { interpolar } from '../../i18n/idiomas';

export interface CampoSenhaProps extends Omit<CampoTextoProps, 'type' | 'mascara' | 'maiuscula' | 'prefixo' | 'sufixo'> {
  /** Botão de olho para mostrar/ocultar (padrão: sim). */
  revelavel?: boolean;
  /**
   * Liga o medidor de força E a validação pela `politica`. Desligado no
   * login — não se cobra política de uma senha que já existe.
   */
  forca?: boolean;
  politica?: PoliticaSenha;
  /** `new-password` em cadastro/troca de senha (padrão: `current-password`). */
  autoComplete?: string;
}


/** Senha com olho, aviso de Caps Lock e medidor de força opcional. */
export function CampoSenha({
  revelavel = true,
  forca = false,
  politica = POLITICA_PADRAO,
  autoComplete = 'current-password',
  className,
  valor = '',
  validar,
  aviso,
  onKeyDown,
  onKeyUp,
  disabled,
  ...p
}: CampoSenhaProps) {
  const t = useTextos();
  const idioma = useIdioma();
  const [visivel, setVisivel] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const f = forcaSenha(valor, politica);

  const lerCaps = (e: KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState?.('CapsLock') ?? false);

  return (
    <div className={cx('lp-senha', className)}>
      <CampoTexto
        {...p}
        type={visivel ? 'text' : 'password'}
        autoComplete={autoComplete}
        valor={valor}
        disabled={disabled}
        validar={forca ? (v) => validarSenha(v, politica, idioma) || validar?.(v) || '' : validar}
        aviso={aviso ?? (capsLock ? t.senha.capsLock : undefined)}
        onKeyDown={(e) => {
          lerCaps(e);
          onKeyDown?.(e);
        }}
        onKeyUp={(e) => {
          lerCaps(e);
          onKeyUp?.(e);
        }}
        sufixo={
          revelavel && !disabled ? (
            <button
              type="button"
              className="lp-ctl-suffix"
              aria-label={visivel ? t.senha.ocultar : t.senha.mostrar}
              aria-pressed={visivel}
              onClick={() => setVisivel((x) => !x)}
            >
              <Icone icone={visivel ? 'eye-off' : 'eye'} />
            </button>
          ) : undefined
        }
      />
      {forca && (
        <div className="lp-senha-forca" data-nivel={f.nivel} aria-live="polite">
          <div className="lp-senha-barras" aria-hidden="true">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className={cx('lp-senha-barra', n <= f.score && 'is-on')} />
            ))}
          </div>
          {f.nivel !== 'vazia' && <span className="lp-senha-nivel">{interpolar(t.senha.forca, { nivel: t.senha[f.nivel] })}</span>}
        </div>
      )}
    </div>
  );
}
