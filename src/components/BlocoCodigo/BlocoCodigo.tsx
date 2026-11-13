import { useEffect, useRef, useState } from 'react';
import { cx } from '../../utils/cx';
import { Botao } from '../Botao/Botao';
import { useToastOpcional } from '../Toast/Toast';
import './BlocoCodigo.css';

export interface BlocoCodigoProps {
  codigo: string;
  /** Nome no topo (ex.: `sql`, `tsx`). Vai também em `data-linguagem` e na classe `language-*`, para um realce do app. */
  linguagem?: string;
  /** Botão de copiar. Padrão: `true`. */
  copiavel?: boolean;
  /** Quebra as linhas longas em vez de rolar para o lado. */
  quebrarLinhas?: boolean;
  className?: string;
}

/**
 * Bloco de código com a linguagem e o botão de copiar. Sem realce de sintaxe (o app pode
 * aplicar o dele). Serve de componente `code`/`pre` para um renderizador de Markdown.
 */
export function BlocoCodigo({ codigo, linguagem, copiavel = true, quebrarLinhas, className }: BlocoCodigoProps) {
  const toast = useToastOpcional();
  const [copiado, setCopiado] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast?.err('Não foi possível copiar', 'O navegador bloqueou o acesso à área de transferência.');
    }
  };

  return (
    <div className={cx('lp-bloco-codigo', quebrarLinhas && 'is-quebrando', className)} data-linguagem={linguagem}>
      {(linguagem || copiavel) && (
        <div className="lp-bloco-codigo-topo">
          <span className="lp-bloco-codigo-ling">{linguagem}</span>
          {copiavel && (
            <Botao
              rotulo={copiado ? 'Copiado' : 'Copiar'}
              icone={copiado ? 'check' : 'copy'}
              severidade="secundario"
              aparencia="texto"
              tamanho="pequeno"
              aria-label={copiado ? 'Código copiado' : 'Copiar código'}
              onClick={copiar}
            />
          )}
        </div>
      )}
      <pre className="lp-bloco-codigo-pre" tabIndex={0}>
        <code className={linguagem ? `language-${linguagem}` : undefined}>{codigo}</code>
      </pre>
      <span className="lp-sr" aria-live="polite">
        {copiado ? 'Código copiado' : ''}
      </span>
    </div>
  );
}
