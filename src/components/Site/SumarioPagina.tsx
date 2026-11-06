import { useEffect, useState, type MouseEvent } from 'react';
import { cx } from '../../utils/cx';
import './SumarioPagina.css';

export interface ItemSumario {
  /** `id` do título da seção na página. */
  id: string;
  rotulo: string;
}

export interface SumarioPaginaProps {
  itens: ItemSumario[];
  /** Padrão: "Nesta página". */
  titulo?: string;
  className?: string;
}

/**
 * Sumário de página longa (termos, política, documentação): links para as
 * seções, com a seção em leitura marcada. Rola até a seção sem trocar o
 * endereço, então funciona também em app com rotas no `#hash`.
 */
export function SumarioPagina({ itens, titulo = 'Nesta página', className }: SumarioPaginaProps) {
  const [atual, setAtual] = useState(itens[0]?.id);

  useEffect(() => {
    const alvos = itens.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    if (!alvos.length || typeof IntersectionObserver === 'undefined') return;
    // a seção em leitura é a última cujo título já passou do topo da janela; no fim
    // da página, a última (seção curta no fim nunca chega ao topo)
    const ver = () => {
      const fim = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      const passou = alvos.filter((el) => el.getBoundingClientRect().top < window.innerHeight * 0.3);
      setAtual((fim ? alvos[alvos.length - 1] : (passou[passou.length - 1] ?? alvos[0])).id);
    };
    const io = new IntersectionObserver(ver, { rootMargin: '0px 0px -70% 0px' });
    alvos.forEach((el) => io.observe(el));
    window.addEventListener('scroll', ver, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', ver);
    };
  }, [itens]);

  const ir = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const alvo = document.getElementById(id);
    if (!alvo) return;
    e.preventDefault();
    alvo.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    // o foco vai junto, para o teclado e o leitor de tela continuarem dali
    if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1');
    alvo.focus({ preventScroll: true });
    setAtual(id);
  };

  return (
    <nav className={cx('lp-sumario', className)} aria-label={titulo}>
      <div className="lp-sumario-titulo">{titulo}</div>
      <ol className="lp-sumario-lista">
        {itens.map((i) => (
          <li key={i.id}>
            <a className={cx('lp-sumario-link', atual === i.id && 'is-atual')} href={`#${i.id}`} aria-current={atual === i.id ? 'location' : undefined} onClick={(e) => ir(e, i.id)}>
              {i.rotulo}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
