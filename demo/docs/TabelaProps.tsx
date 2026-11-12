import { Tabela } from '../../src';
import { C } from './Codigo';
import PROPS from './props.gerado.json';

type Prop = { nome: string; tipo: string; obrigatorio: boolean; padrao?: string; descricao: string; de?: string };
type Entrada = { interface: string; arquivo: string; externos: string[]; props: Prop[] };
const TODAS = PROPS as Record<string, Entrada>;

/** Descrição com `código` entre crases. */
function Texto({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/(`[^`]+`)/).map((parte, i) => (parte.startsWith('`') ? <C key={i}>{parte.slice(1, -1)}</C> : parte))}
    </>
  );
}

/** Nota dos atributos nativos aceitos (`Omit<ButtonHTMLAttributes<…>, 'children'>` → `<button>`). */
function nativo(externo: string) {
  const elemento = /HTML(\w+)Element/.exec(externo)?.[1]?.toLowerCase();
  const nomes: Record<string, string> = { button: 'button', input: 'input', div: 'div', textarea: 'textarea', anchor: 'a', select: 'select' };
  const tag = elemento ? (nomes[elemento] ?? elemento) : null;
  const fora = /Omit<.+,\s*(.+)>$/.exec(externo)?.[1];
  return { tag, fora: fora?.replace(/'/g, '').split(/\s*\|\s*/) };
}

/**
 * Tabela de props de um componente, lida de props.gerado.json (gerado dos
 * tipos TypeScript por scripts/gerar-props.mjs). `padroes` completa o padrão
 * que não sai da desestruturação (ex.: vem de um contexto).
 */
export function TabelaProps({ componente, padroes = {} }: { componente: string; padroes?: Record<string, string> }) {
  const entrada = TODAS[componente];
  if (!entrada) throw new Error(`Sem props geradas para ${componente}: rode npm run docs:props`);
  const registros = entrada.props.map((p) => ({ ...p, id: p.nome, padrao: p.padrao ?? padroes[p.nome] }));

  return (
    <div className="doc-props">
      <Tabela
        rotulo={`Props de ${componente}`}
        registros={registros}
        colunas={[
          {
            campo: 'nome',
            rotulo: 'Prop',
            largura: '11rem',
            render: (p) => (
              <span className="doc-props-nome">
                <C>{p.nome}</C>
                {p.obrigatorio && <span className="doc-props-obrig" title="Obrigatória">*</span>}
              </span>
            ),
          },
          { campo: 'tipo', rotulo: 'Tipo', render: (p) => <C>{p.tipo}</C> },
          { campo: 'padrao', rotulo: 'Padrão', largura: '8rem', render: (p) => (p.padrao ? <C>{p.padrao}</C> : <span className="doc-props-vazio">—</span>) },
          {
            campo: 'descricao',
            rotulo: 'Descrição',
            render: (p) => (
              <>
                <Texto texto={p.descricao} />
                {p.de && <span className="doc-props-de"> (de {p.de})</span>}
              </>
            ),
          },
        ]}
      />
      {entrada.externos.map((externo) => {
        const { tag, fora } = nativo(externo);
        return (
          <p key={externo} className="doc-props-nota">
            {tag ? (
              <>
                Aceita também os atributos nativos de <C>{`<${tag}>`}</C>
                {fora?.length ? (
                  <>
                    {' '}
                    (exceto {fora.map((f, i) => (
                      <span key={f}>
                        {i > 0 && ', '}
                        <C>{f}</C>
                      </span>
                    ))}
                    )
                  </>
                ) : null}
                , como <C>id</C>, <C>aria-*</C> e eventos.
              </>
            ) : (
              <>
                Estende <C>{externo}</C>.
              </>
            )}
          </p>
        );
      })}
      <p className="doc-props-nota">
        <span className="doc-props-obrig">*</span> obrigatória. Tabela gerada dos tipos em <C>{entrada.arquivo}</C>.
      </p>
    </div>
  );
}
