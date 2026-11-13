import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { formatarMoeda, type OpcoesMoeda } from '../../utils/dinheiro';
import { Botao, type BotaoProps } from '../Botao/Botao';
import './Valor.css';
import { useIdioma, useTextos } from '../../i18n/contexto';

interface ContextoValores {
  ocultos: boolean;
  alternar: () => void;
  definir: (ocultos: boolean) => void;
}

const Contexto = createContext<ContextoValores | null>(null);

export interface ProvedorValoresProps {
  children: ReactNode;
  /** Começa com os valores escondidos. Padrão `false`. */
  ocultosInicial?: boolean;
  /**
   * Chave no `localStorage` para lembrar a escolha entre visitas. Sem ela, vale
   * só enquanto a página estiver aberta.
   */
  chave?: string;
}

/** Guarda o "ocultar valores" de uma área: todo `Valor` dentro dela obedece ao `BotaoOcultarValores`. */
export function ProvedorValores({ children, ocultosInicial = false, chave }: ProvedorValoresProps) {
  const [ocultos, setOcultos] = useState(() => {
    if (!chave) return ocultosInicial;
    try {
      const salvo = localStorage.getItem(chave);
      return salvo === null ? ocultosInicial : salvo === '1';
    } catch {
      return ocultosInicial;
    }
  });
  useEffect(() => {
    if (!chave) return;
    try {
      localStorage.setItem(chave, ocultos ? '1' : '0');
    } catch {
      /* navegação privada: vale só nesta sessão */
    }
  }, [chave, ocultos]);
  const alternar = useCallback(() => setOcultos((v) => !v), []);
  const valor = useMemo(() => ({ ocultos, alternar, definir: setOcultos }), [ocultos, alternar]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

/** `{ ocultos, alternar, definir }` do `ProvedorValores` mais próximo (fora dele, nada fica oculto). */
export function useValoresOcultos(): ContextoValores {
  return useContext(Contexto) ?? { ocultos: false, alternar: () => {}, definir: () => {} };
}

export type BotaoOcultarValoresProps = Omit<BotaoProps, 'onClick' | 'icone' | 'pressionado' | 'children'>;

/** Olho que esconde e mostra os valores do `ProvedorValores`. */
export function BotaoOcultarValores({ rotulo, aparencia = 'texto', severidade = 'secundario', ...resto }: BotaoOcultarValoresProps) {
  const { ocultos, alternar } = useValoresOcultos();
  const t = useTextos();
  const texto = ocultos ? t.valor.mostrar : t.valor.ocultar;
  return (
    <Botao
      {...resto}
      rotulo={rotulo}
      aria-label={rotulo ? undefined : texto}
      dica={rotulo ? undefined : texto}
      icone={ocultos ? 'eye-off' : 'eye'}
      aparencia={aparencia}
      severidade={severidade}
      pressionado={ocultos}
      onClick={alternar}
    />
  );
}

export interface ValorProps extends OpcoesMoeda {
  valor: number;
  /**
   * Cor pelo sinal: verde no positivo, vermelho no negativo. Padrão: `true`
   * com `tipo`, `false` sem ele.
   */
  colorir?: boolean;
  /**
   * Força o sentido, para valores guardados sempre positivos: `receita` = entrada (+) ·
   * `despesa` = saída (−) · `neutro` = sem cor nem `+` (transferência).
   */
  tipo?: 'receita' | 'despesa' | 'neutro';
  /** Força oculto/visível; sem ele, segue o `ProvedorValores`. */
  oculto?: boolean;
  tamanho?: 'pequeno' | 'normal' | 'grande' | 'destaque';
  /** Texto forte. */
  forte?: boolean;
  /** Riscado (ex.: lançamento cancelado). */
  riscado?: boolean;
  className?: string;
}

/**
 * Valor em dinheiro: `R$ 1.234,56`, com sinal e cor de entrada/saída e o
 * "ocultar valores" dos apps de finanças. Os números têm largura fixa
 * (alinham em coluna).
 */
export function Valor({ valor, colorir, tipo, oculto, tamanho = 'normal', forte, riscado, className, sinal, ...opcoes }: ValorProps) {
  const ctx = useValoresOcultos();
  const escondido = oculto ?? ctx.ocultos;
  // com tipo, o número vale em módulo e o sinal vem do tipo
  const numero = tipo === 'despesa' ? -Math.abs(valor) : tipo === 'receita' ? Math.abs(valor) : valor;
  const idioma = useIdioma();
  const t = useTextos();
  const texto = formatarMoeda(numero, { idioma, ...opcoes, sinal: sinal ?? (tipo === 'receita' || undefined) });
  // com `tipo`, colore por padrão (desligue com colorir={false})
  const comCor = tipo !== 'neutro' && (colorir ?? !!tipo);
  const sentido = !comCor ? null : numero > 0 ? 'entrada' : numero < 0 ? 'saida' : null;
  const cheio = opcoes.compacto ? formatarMoeda(numero, { idioma, ...opcoes, compacto: false }) : undefined;
  return (
    <span
      className={cx('lp-valor', `lp-valor--${tamanho}`, sentido && `lp-valor--${sentido}`, forte && 'lp-valor--forte', riscado && 'lp-valor--riscado', escondido && 'is-oculto', className)}
      title={escondido ? undefined : cheio}
    >
      {escondido ? (
        <>
          <span aria-hidden="true">{opcoes.semSimbolo ? '' : 'R$ '}••••</span>
          <span className="lp-sr">{t.valor.oculto}</span>
        </>
      ) : (
        texto
      )}
    </span>
  );
}
