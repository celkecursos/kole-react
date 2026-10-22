import { Icone } from '../../utils/Icone';
import { useState, type CSSProperties, type ReactNode } from 'react';
import type { Anexo } from '../../utils/anexos';
import { cx } from '../../utils/cx';
import { Avatar } from '../Avatar/Avatar';
import { DialogoArquivo } from './DialogoArquivo';
import './Arquivo.css';

export type EntradaFoto = string | Anexo | readonly (string | Anexo)[] | null | undefined;

export interface FotoProps {
  /** A foto ou a coleção: URL, `Anexo` ou lista misturando os dois. */
  fotos?: EntradaFoto;
  /** De quem é a foto: vira o `alt` e as iniciais do avatar sem foto. */
  nome: string;
  tamanho?: 'sm' | 'md' | 'lg';
  /** Válvulas de escape da escala (ex.: `13rem`). */
  altura?: string;
  largura?: string;
  /** Clique abre a galeria em tela cheia. Não use dentro de outro alvo clicável. */
  ampliavel?: boolean;
  /** Qual foto da coleção (padrão: 0). */
  indice?: number;
  aoMudarIndice?: (indice: number) => void;
  aoAmpliar?: (indice: number) => void;
  /** Substitui o avatar padrão quando não há foto (ex.: "Foto indisponível"). */
  semFoto?: ReactNode;
  /** Conteúdo sobre a imagem (selo, marca d'água). */
  sobreposto?: ReactNode;
  className?: string;
}

const AVATAR = { sm: '3rem', md: '4.5rem', lg: '6rem' };

const normalizarFotos = (f: EntradaFoto): Anexo[] =>
  (f == null ? [] : Array.isArray(f) ? f : [f])
    .map((x) => (typeof x === 'string' ? { nome: '', tamanho: 0, tipo: 'image/*', url: x } : x))
    .filter((x): x is Anexo => !!x?.url?.trim());

/**
 * Moldura de foto em tamanho de leitura: fundo desfocado da própria foto,
 * sombra e anel. Entre o `Avatar` (miniatura) e o `DialogoArquivo` (tela cheia).
 */
export function Foto({
  fotos,
  nome,
  tamanho = 'md',
  altura,
  largura,
  ampliavel = false,
  indice: indiceExterno,
  aoMudarIndice,
  aoAmpliar,
  semFoto,
  sobreposto,
  className,
}: FotoProps) {
  const lista = normalizarFotos(fotos);
  const [indiceInterno, setIndiceInterno] = useState(0);
  const [aberto, setAberto] = useState(false);
  const indice = Math.max(0, Math.min(indiceExterno ?? indiceInterno, lista.length - 1));
  const mudar = (i: number) => {
    setIndiceInterno(i);
    aoMudarIndice?.(i);
  };
  const atual = lista[indice];
  const estilo: CSSProperties = { height: altura, width: largura };

  if (!atual) {
    return (
      <div className={cx('lp-foto', `lp-foto--${tamanho}`, className)} style={estilo}>
        {semFoto ?? <Avatar nome={nome} tom="escuro" formato="quadrado" tamanho={AVATAR[tamanho]} />}
        {sobreposto && <div className="lp-foto-sobreposto">{sobreposto}</div>}
      </div>
    );
  }

  const exibida = atual.miniatura ?? atual.url!;
  return (
    <div className={cx('lp-foto', `lp-foto--${tamanho}`, className)} style={estilo}>
      {/* fundo: a menor versão disponível, já que vai desfocada */}
      <div className="lp-foto-fundo" style={{ backgroundImage: `url("${exibida}")` }} aria-hidden="true" />
      <img className="lp-foto-img" src={exibida} alt={nome ? `Fotografia de ${nome}` : 'Fotografia'} />
      {ampliavel && (
        <button
          type="button"
          className="lp-foto-ampliar"
          aria-label={`Ampliar fotografia${nome ? ` de ${nome}` : ''}`}
          onClick={() => {
            aoAmpliar?.(indice);
            setAberto(true);
          }}
        >
          <span className="lp-foto-lupa" aria-hidden="true">
            <Icone icone="zoom-in" />
          </span>
        </button>
      )}
      {sobreposto && <div className="lp-foto-sobreposto">{sobreposto}</div>}
      {ampliavel && (
        <DialogoArquivo
          aberto={aberto}
          aoFechar={() => setAberto(false)}
          arquivos={lista.map((a, i) => ({ ...a, nome: a.nome || `Fotografia ${lista.length > 1 ? i + 1 : ''}`.trim() }))}
          indice={indice}
          aoMudarIndice={mudar}
        />
      )}
    </div>
  );
}
