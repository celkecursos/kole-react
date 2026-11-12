// Paisagem em SVG para os exemplos, sem depender de arquivo de imagem.
export function cena(ceu: string, chao: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><rect width="640" height="400" fill="${ceu}"/><circle cx="470" cy="130" r="54" fill="#ffd27a"/><path d="M0 300 C120 220 220 250 320 290 C420 330 520 230 640 270 L640 400 L0 400Z" fill="${chao}" fill-opacity=".75"/><path d="M0 340 C140 290 260 330 380 350 C500 370 560 320 640 330 L640 400 L0 400Z" fill="${chao}"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
