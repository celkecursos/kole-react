import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import './InicioConversa.css';
import { useTextos } from '../../i18n/contexto';

export interface SugestaoConversa {
  id?: string;
  /** Texto do cartão (e, sem `texto`, o que vai para o campo). */
  titulo: string;
  /** Linha miúda abaixo do título. */
  descricao?: string;
  icone?: IconeProp;
  /** O que mandar ao escolher, se for diferente do título. */
  texto?: string;
}

export interface InicioConversaProps {
  /** Saudação (ex.: "Boa tarde, Ana. Como posso ajudar?"). */
  titulo: ReactNode;
  descricao?: ReactNode;
  /** Ícone ou imagem acima da saudação. */
  icone?: IconeProp;
  sugestoes?: SugestaoConversa[];
  /** A pessoa escolheu uma sugestão: o app envia ou coloca o texto no campo. */
  aoEscolher?: (sugestao: SugestaoConversa) => void;
  /** `cartoes` (padrão): grade de cartões · `pilulas`: botões em linha, para painéis estreitos (ex.: `ChatFlutuante`). */
  aparencia?: 'cartoes' | 'pilulas';
  /** Abaixo das sugestões (ex.: um aviso sobre o uso dos dados). */
  children?: ReactNode;
  className?: string;
}

/** Tela inicial de uma conversa: saudação e sugestões clicáveis. Vai no `vazio` da `Conversa`. */
export function InicioConversa({ titulo, descricao, icone, sugestoes = [], aoEscolher, aparencia = 'cartoes', children, className }: InicioConversaProps) {
  const t = useTextos();
  return (
    <div className={cx('lp-inicio-conv', `lp-inicio-conv--${aparencia}`, className)}>
      {icone && (
        <span className="lp-inicio-conv-icone" aria-hidden="true">
          <Icone icone={icone} />
        </span>
      )}
      <h2 className="lp-inicio-conv-titulo">{titulo}</h2>
      {descricao && <p className="lp-inicio-conv-desc">{descricao}</p>}
      {sugestoes.length > 0 && (
        <ul className="lp-inicio-conv-sugestoes" aria-label={t.conversa.sugestoesRotulo}>
          {sugestoes.map((s) => (
            <li key={s.id ?? s.titulo}>
              <button type="button" className="lp-inicio-conv-sugestao" onClick={() => aoEscolher?.(s)}>
                {s.icone && (
                  <span className="lp-inicio-conv-sugestao-icone" aria-hidden="true">
                    <Icone icone={s.icone} />
                  </span>
                )}
                <span className="lp-inicio-conv-sugestao-tx">
                  <span className="lp-inicio-conv-sugestao-titulo">{s.titulo}</span>
                  {s.descricao && aparencia === 'cartoes' && <span className="lp-inicio-conv-sugestao-desc">{s.descricao}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
}
