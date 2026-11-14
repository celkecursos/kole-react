import { useT } from '../../i18n/useT';
import { CATEGORIAS, rotaComponente } from '../nav';
import { PaginaGuia, Secao } from '../PaginaDoc';

const TOTAL = CATEGORIAS.reduce((n, c) => n + c.itens.length, 0);

export function DocIndice() {
  const { tp } = useT();
  return (
    <PaginaGuia pagina="indice" icone="layers" resumo={tp('docs.indice.textos.resumo', TOTAL)}>
      {CATEGORIAS.map((c) => (
        <Secao key={c.rotulo} id={c.rotulo.toLowerCase().replace(/\s+/g, '-')} titulo={c.rotulo}>
          <div className="doc-indice">
            {c.itens.map((i) => (
              <a key={i.slug} className="doc-indice-item" href={`#${rotaComponente(i.slug)}`}>
                {i.rotulo}
                <span className="doc-indice-desc">{i.desc}</span>
              </a>
            ))}
          </div>
        </Secao>
      ))}
    </PaginaGuia>
  );
}
