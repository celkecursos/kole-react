import type { Idioma } from '../../i18n/idiomas';
import { Icone } from '../../utils/Icone';

/**
 * Bandeira do idioma em SVG próprio (emoji de bandeira não aparece no Windows).
 * Desenho simplificado, para 1em; decorativa (o nome do idioma vai em texto).
 * Idioma sem bandeira própria mostra o globo.
 */
export function Bandeira({ idioma, className }: { idioma: Idioma; className?: string }) {
  const comum = { className: ['lp-bandeira', className].filter(Boolean).join(' '), viewBox: '0 0 30 20', width: '1.35em', height: '0.9em', 'aria-hidden': true, focusable: false } as const;
  if (idioma === 'pt-BR')
    return (
      <svg {...comum}>
        <rect width="30" height="20" fill="#009b3a" />
        <path d="M15 2.2 27.3 10 15 17.8 2.7 10Z" fill="#fedf00" />
        <circle cx="15" cy="10" r="4.6" fill="#002776" />
        <path d="M10.6 9.1c2.9-.5 6.1.1 8.7 1.6" stroke="#fff" strokeWidth=".9" fill="none" />
      </svg>
    );
  if (idioma === 'en')
    return (
      <svg {...comum}>
        <rect width="30" height="20" fill="#fff" />
        {[0, 2, 4, 6, 8, 10, 12].map((i) => (
          <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13} fill="#b22234" />
        ))}
        <rect width="13" height={(20 / 13) * 7} fill="#3c3b6e" />
        {[0, 1, 2].flatMap((l) => [0, 1, 2, 3].map((c) => <circle key={`${l}-${c}`} cx={2 + c * 3} cy={2.2 + l * 3.4} r=".65" fill="#fff" />))}
      </svg>
    );
  if (idioma === 'es')
    return (
      <svg {...comum}>
        <rect width="30" height="20" fill="#aa151b" />
        <rect y="5" width="30" height="10" fill="#f1bf00" />
        <rect x="7" y="7.5" width="3" height="5" rx=".6" fill="#aa151b" opacity=".75" />
      </svg>
    );
  return <Icone icone="globe" className={comum.className} />;
}
