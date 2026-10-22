/** Metadados de anexo — serializável, sem o `File` (que vive só na sessão). */
export interface Anexo {
  nome: string;
  /** Tamanho em bytes. */
  tamanho: number;
  /** MIME (pode chegar vazio do navegador). */
  tipo: string;
  /** Endereço do arquivo já armazenado (abrir/baixar). */
  url?: string;
  /** Miniatura da MESMA imagem, quando o backend serve dois tamanhos. */
  miniatura?: string;
}

/** Como o anexo pode ser EXIBIDO pelo navegador. */
export type TipoArquivo = 'imagem' | 'pdf' | 'video' | 'audio' | 'outro';

const UNIDADES_BYTES = ['B', 'KB', 'MB', 'GB', 'TB'];

/** `1536` → `1.5 KB` · uma casa decimal abaixo de 10. */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes < 0) return '0 B';
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < UNIDADES_BYTES.length - 1) {
    v /= 1024;
    i++;
  }
  if (i === 0) return `${v} B`;
  return `${v < 10 ? v.toFixed(1) : Math.round(v)} ${UNIDADES_BYTES[i]}`;
}

const extensao = (nome: string) => /\.([a-z0-9]+)$/i.exec(nome ?? '')?.[1]?.toLowerCase() ?? '';

/** Classifica pelo MIME e, na falta, pela extensão do nome. */
export function tipoDeArquivo(tipo: string, nome = ''): TipoArquivo {
  const t = (tipo ?? '').toLowerCase();
  const ext = extensao(nome);
  if (t.startsWith('image/') || /^(png|jpe?g|gif|webp|svg|bmp|avif)$/.test(ext)) return 'imagem';
  if (t === 'application/pdf' || ext === 'pdf') return 'pdf';
  if (t.startsWith('video/') || /^(mp4|webm|ogv|mov|mkv|avi)$/.test(ext)) return 'video';
  if (t.startsWith('audio/') || /^(mp3|wav|ogg|m4a|aac|flac)$/.test(ext)) return 'audio';
  return 'outro';
}

/** Nome do ícone (Lucide) do anexo, pela família do documento. */
export function iconeArquivo(tipo: string, nome = ''): string {
  const exibicao = tipoDeArquivo(tipo, nome);
  if (exibicao === 'imagem') return 'image';
  if (exibicao === 'pdf') return 'file-text';
  if (exibicao === 'video') return 'video';
  if (exibicao === 'audio') return 'volume-2';
  const t = (tipo ?? '').toLowerCase();
  const ext = extensao(nome);
  if (t.includes('word') || /^docx?$/.test(ext)) return 'file-type';
  if (t.includes('excel') || t.includes('spreadsheet') || /^(xlsx?|csv)$/.test(ext)) return 'file-spreadsheet';
  if (t.includes('zip') || t.includes('compressed') || /^(zip|rar|7z)$/.test(ext)) return 'package';
  return 'file';
}
