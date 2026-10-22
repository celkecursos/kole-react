import { Icone } from '../../utils/Icone';
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { formatBytes, iconeArquivo, tipoDeArquivo, type Anexo } from '../../utils/anexos';
import { cx } from '../../utils/cx';
import { Botao } from '../Botao/Botao';
import { Vazio } from '../Vazio/Vazio';
import './Arquivo.css';

export interface VisualizadorArquivoProps {
  arquivo: Anexo | null;
  /** A imagem/vídeo/áudio falhou ao carregar (URL expirada, 404, codec). */
  aoFalhar?: (arquivo: Anexo) => void;
  className?: string;
}

const NIVEIS = [1, 1.5, 2, 3, 4];

/**
 * Superfície de exibição de UM anexo: imagem (zoom, giro, arrasto), PDF,
 * vídeo e áudio nativos; o resto cai num estado com botão "Baixar".
 */
export function VisualizadorArquivo({ arquivo, aoFalhar, className }: VisualizadorArquivoProps) {
  // a identidade do anexo zera zoom/giro/arrasto ao trocar de arquivo
  const chave = arquivo ? `${arquivo.url ?? ''}|${arquivo.nome}` : 'vazio';
  return (
    <div className={cx('lp-visu', className)}>
      <Conteudo key={chave} arquivo={arquivo} aoFalhar={aoFalhar} />
    </div>
  );
}

function Conteudo({ arquivo, aoFalhar }: Omit<VisualizadorArquivoProps, 'className'>) {
  const [falhou, setFalhou] = useState(false);
  const url = arquivo?.url?.trim();
  const tipo = arquivo ? tipoDeArquivo(arquivo.tipo, arquivo.nome) : 'outro';
  const falhar = () => {
    setFalhou(true);
    if (arquivo) aoFalhar?.(arquivo);
  };

  if (!arquivo || !url || falhou || tipo === 'outro') {
    const detalhe = [arquivo?.nome, arquivo?.tamanho ? formatBytes(arquivo.tamanho) : ''].filter(Boolean).join(' · ');
    return (
      <div className="lp-visu-indisponivel">
        <Vazio
          icone={arquivo ? iconeArquivo(arquivo.tipo, arquivo.nome) : 'file'}
          titulo={url ? 'Pré-visualização indisponível' : 'Arquivo indisponível'}
          descricao={detalhe || undefined}
        >
          {url && (
            <a className="lp-visu-baixar" href={url} download={arquivo?.nome} target="_blank" rel="noreferrer">
              <Icone icone="download" />
              Baixar
            </a>
          )}
        </Vazio>
      </div>
    );
  }

  if (tipo === 'imagem') return <Imagem url={url} nome={arquivo.nome} aoFalhar={falhar} />;
  if (tipo === 'pdf') return <iframe className="lp-visu-pdf" src={url} title={arquivo.nome || 'Documento PDF'} />;
  if (tipo === 'video')
    return (
      <video className="lp-visu-video" src={url} controls preload="metadata" onError={falhar}>
        <track kind="captions" />
      </video>
    );
  return (
    <div className="lp-visu-audio">
      <Icone icone="volume-2" />
      <span className="lp-visu-audio-nome">{arquivo.nome}</span>
      <audio src={url} controls preload="metadata" onError={falhar} />
    </div>
  );
}

function Imagem({ url, nome, aoFalhar }: { url: string; nome: string; aoFalhar: () => void }) {
  const [nivel, setNivel] = useState(0);
  const [giro, setGiro] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const palco = useRef<HTMLDivElement>(null);
  const arrasto = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const zoom = NIVEIS[nivel];

  const limitar = (x: number, y: number) => {
    const r = palco.current?.getBoundingClientRect();
    if (!r) return { x, y };
    // a imagem nunca sai inteira da área visível
    const mx = (r.width * (zoom - 1)) / 2 + r.width * 0.25;
    const my = (r.height * (zoom - 1)) / 2 + r.height * 0.25;
    return { x: Math.max(-mx, Math.min(mx, x)), y: Math.max(-my, Math.min(my, y)) };
  };

  const mudarNivel = (n: number) => {
    const novo = Math.max(0, Math.min(NIVEIS.length - 1, n));
    setNivel(novo);
    if (novo === 0) setPan({ x: 0, y: 0 });
  };
  const ajustar = () => {
    setNivel(0);
    setPan({ x: 0, y: 0 });
  };
  const girar = () => {
    setGiro((g) => (g + 90) % 360);
    setPan({ x: 0, y: 0 });
  };

  const aoTeclar = (e: KeyboardEvent) => {
    if (e.key === '+' || e.key === '=') mudarNivel(nivel + 1);
    else if (e.key === '-' || e.key === '_') mudarNivel(nivel - 1);
    else if (e.key === '0') ajustar();
    else if (e.key === 'r' || e.key === 'R') girar();
    else return;
    e.preventDefault();
  };

  const aoPressionar = (e: PointerEvent) => {
    if (zoom <= 1) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    arrasto.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const aoMover = (e: PointerEvent) => {
    const a = arrasto.current;
    if (!a) return;
    setPan(limitar(a.px + e.clientX - a.x, a.py + e.clientY - a.y));
  };

  return (
    <div className="lp-visu-img">
      <div
        ref={palco}
        className={cx('lp-visu-palco', zoom > 1 && 'is-ampliado')}
        tabIndex={0}
        role="img"
        aria-label={nome ? `Imagem ${nome}` : 'Imagem'}
        onKeyDown={aoTeclar}
        onDoubleClick={() => (nivel === 0 ? setNivel(NIVEIS.indexOf(2)) : ajustar())}
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={() => (arrasto.current = null)}
        onPointerCancel={() => (arrasto.current = null)}
      >
        <img
          src={url}
          alt=""
          draggable={false}
          onError={aoFalhar}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${giro}deg)` }}
        />
      </div>
      <div className="lp-visu-barra" role="toolbar" aria-label="Controles da imagem">
        <Botao icone="zoom-out" severidade="secundario" aparencia="texto" dica="Reduzir" aria-label="Reduzir" disabled={nivel === 0} onClick={() => mudarNivel(nivel - 1)} />
        <span className="lp-visu-zoom" aria-live="polite">
          {Math.round(zoom * 100)}%
        </span>
        <Botao
          icone="zoom-in"
          severidade="secundario"
          aparencia="texto"
          dica="Ampliar" aria-label="Ampliar"
          disabled={nivel === NIVEIS.length - 1}
          onClick={() => mudarNivel(nivel + 1)}
        />
        <Botao icone="maximize" severidade="secundario" aparencia="texto" dica="Ajustar à tela" aria-label="Ajustar à tela" onClick={ajustar} />
        <Botao icone="refresh-cw" severidade="secundario" aparencia="texto" dica="Girar 90 graus" aria-label="Girar 90 graus" onClick={girar} />
      </div>
    </div>
  );
}
