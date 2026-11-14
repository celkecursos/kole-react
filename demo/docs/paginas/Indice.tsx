import type { ChaveTexto } from '../../i18n/tipos';
import { useT } from '../../i18n/useT';
import { CATEGORIAS, rotaComponente } from '../nav';
import { PaginaGuia, Secao } from '../PaginaDoc';

const TOTAL = CATEGORIAS.reduce((n, c) => n + c.itens.length, 0);

/** `menu.docs.itens.campoTexto` → `docs.campoTexto.textos.descricao` (a linha curta do índice). */
const descricaoDe = (chave: string) => `docs.${chave.split('.').pop()}.textos.descricao` as ChaveTexto;

export function DocIndice() {
  const { t, tp } = useT();
  return (
    <PaginaGuia pagina="indice" icone="layers" resumo={tp('docs.indice.textos.resumo', TOTAL)}>
      {CATEGORIAS.map((c) => (
        // o id (âncora) segue o rótulo pt-BR: o link da seção não muda com o idioma
        <Secao key={c.rotulo} id={c.rotulo.toLowerCase().replace(/\s+/g, '-')} titulo={t(c.chave)}>
          <div className="doc-indice">
            {c.itens.map((i) => (
              <a key={i.slug} className="doc-indice-item" href={`#${rotaComponente(i.slug)}`}>
                {t(i.chave)}
                <span className="doc-indice-desc">{t(descricaoDe(i.chave))}</span>
              </a>
            ))}
          </div>
        </Secao>
      ))}
    </PaginaGuia>
  );
}
