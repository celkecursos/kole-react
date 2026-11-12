import { CATEGORIAS, rotaComponente } from '../nav';
import { PaginaGuia, Secao } from '../PaginaDoc';

const TOTAL = CATEGORIAS.reduce((n, c) => n + c.itens.length, 0);

export function DocIndice() {
  return (
    <PaginaGuia
      titulo="Componentes"
      icone="layers"
      resumo={`${TOTAL} páginas, cada uma com exemplos funcionando, o código de cada exemplo e a tabela de props.`}
    >
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
