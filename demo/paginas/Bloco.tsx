import type { ReactNode } from 'react';

export function Bloco({ titulo, descricao, children }: { titulo: string; descricao?: ReactNode; children: ReactNode }) {
  return (
    <section className="demo-bloco">
      <h2 className="demo-bloco-titulo">{titulo}</h2>
      {descricao && <p className="demo-bloco-desc">{descricao}</p>}
      <div className="demo-bloco-corpo">{children}</div>
    </section>
  );
}

/** Imagem SVG gerada (retrato de exemplo), para não depender de arquivo. */
export function retrato(cor: string, iniciais: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="640" viewBox="0 0 480 640"><rect width="480" height="640" fill="${cor}"/><circle cx="240" cy="250" r="110" fill="#fff" fill-opacity=".85"/><rect x="90" y="400" width="300" height="240" rx="150" fill="#fff" fill-opacity=".85"/><text x="240" y="275" font-family="Arial" font-size="72" font-weight="700" text-anchor="middle" fill="${cor}">${iniciais}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Paisagem SVG gerada (céu em degradê, sol e morros), para não depender de foto. */
export function cena(ceu: string, chao: string, sol = '#ffd27a') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ceu}"/><stop offset="1" stop-color="#ffffff" stop-opacity=".55"/></linearGradient></defs><rect width="640" height="400" fill="${ceu}"/><rect width="640" height="400" fill="url(#c)"/><circle cx="470" cy="130" r="54" fill="${sol}" fill-opacity=".9"/><path d="M0 300 C120 220 220 250 320 290 C420 330 520 230 640 270 L640 400 L0 400Z" fill="${chao}" fill-opacity=".75"/><path d="M0 340 C140 290 260 330 380 350 C500 370 560 320 640 330 L640 400 L0 400Z" fill="${chao}"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
