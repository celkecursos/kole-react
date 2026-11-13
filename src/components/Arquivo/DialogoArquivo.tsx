import { useEffect } from 'react';
import { formatBytes, type Anexo } from '../../utils/anexos';
import { Botao } from '../Botao/Botao';
import { Dialogo } from '../Dialogo/Dialogo';
import { VisualizadorArquivo } from './VisualizadorArquivo';
import './Arquivo.css';
import { useTextos } from '../../i18n/contexto';
import { interpolar } from '../../i18n/idiomas';

export interface DialogoArquivoProps {
  aberto: boolean;
  aoFechar: () => void;
  /** A lista INTEIRA; aponte o item clicado com `indice`. */
  arquivos: readonly Anexo[];
  indice: number;
  aoMudarIndice: (indice: number) => void;
}

// setas pertencem ao controle quando o foco está num destes
const CONTROLES = 'video, audio, input, textarea, select, [contenteditable=""], [contenteditable="true"]';

/** Visualizador em tela cheia que folheia uma lista de anexos (botões ou ← →). */
export function DialogoArquivo({ aberto, aoFechar, arquivos, indice, aoMudarIndice }: DialogoArquivoProps) {
  const t = useTextos();
  const total = arquivos.length;
  const i = Math.max(0, Math.min(indice, total - 1));
  const atual = arquivos[i] ?? null;

  useEffect(() => {
    if (!aberto || total < 2) return;
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.(CONTROLES)) return;
      if (e.key === 'ArrowLeft' && i > 0) aoMudarIndice(i - 1);
      else if (e.key === 'ArrowRight' && i < total - 1) aoMudarIndice(i + 1);
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [aberto, total, i, aoMudarIndice]);

  return (
    <Dialogo
      aberto={aberto}
      aoFechar={aoFechar}
      tamanho="full"
      icone="paperclip"
      titulo={atual?.nome || t.anexo.anexo}
      subtitulo={atual?.tamanho ? formatBytes(atual.tamanho) : undefined}
      className="lp-dlg-arq"
      rodape={
        total > 1 ? (
          <>
            <span className="lp-dlg-arq-pos" aria-live="polite">
              {interpolar(t.anexo.contador, { n: i + 1, total })}
            </span>
            <Botao rotulo={t.comum.anterior} icone="chevron-left" severidade="secundario" disabled={i === 0} onClick={() => aoMudarIndice(i - 1)} />
            <Botao
              rotulo={t.comum.proximo}
              icone="chevron-right"
              posicaoIcone="direita"
              severidade="secundario"
              disabled={i === total - 1}
              onClick={() => aoMudarIndice(i + 1)}
            />
          </>
        ) : undefined
      }
    >
      <VisualizadorArquivo arquivo={atual} />
    </Dialogo>
  );
}
