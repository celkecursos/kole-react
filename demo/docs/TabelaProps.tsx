import { Alerta, Tabela } from '../../src';
import { C } from './Codigo';
import PROPS from './props.gerado.json';
import { useT } from '../i18n/useT';
import { rico } from '../i18n/rico';

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
  const { t } = useT();
  const entrada = TODAS[componente];
  if (!entrada) return <Alerta severidade="err" mensagem={t('docs.comum.textos.semPropsGeradasPara', { componente })} />;
  if (!entrada.props.length)
    return (
      <p className="doc-props-nota">
        <C>{componente}</C>{rico(t('docs.comum.textos.naoTemPropsProprias'))}</p>
    );
  const registros = entrada.props.map((p) => ({ ...p, id: p.nome, padrao: p.padrao ?? padroes[p.nome] }));

  return (
    <div className="doc-props">
      <Tabela
        rotulo={t('docs.comum.textos.propsDeComponente', { componente })}
        registros={registros}
        colunas={[
          {
            campo: 'nome',
            rotulo: t('docs.comum.textos.prop'),
            largura: '11rem',
            render: (p) => (
              <span className="doc-props-nome">
                <C>{p.nome}</C>
                {p.obrigatorio && <span className="doc-props-obrig" title={t('docs.comum.textos.obrigatoria')}>*</span>}
              </span>
            ),
          },
          { campo: 'tipo', rotulo: t('docs.comum.textos.tipo'), render: (p) => <C>{p.tipo}</C> },
          { campo: 'padrao', rotulo: t('docs.comum.textos.padrao'), largura: '8rem', render: (p) => (p.padrao ? <C>{p.padrao}</C> : <span className="doc-props-vazio">—</span>) },
          {
            campo: 'descricao',
            rotulo: t('docs.comum.textos.descricao'),
            render: (p) => (
              <>
                <Texto texto={p.descricao} />
                {p.de && <span className="doc-props-de">{t('docs.comum.textos.deDe', { de: p.de })}</span>}
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
              <>{t('docs.comum.textos.aceitaTambemOsAtributos')}<C>{`<${tag}>`}</C>
                {fora?.length ? (
                  <>{t('docs.comum.textos.exceto')}{fora.map((f, i) => (
                      <span key={f}>
                        {i > 0 && ', '}
                        <C>{f}</C>
                      </span>
                    ))}
                    )
                  </>
                ) : null}{rico(t('docs.comum.textos.comoIdAriaE'))}</>
            ) : (
              <>{t('docs.comum.textos.estende')}<C>{externo}</C>.
              </>
            )}
          </p>
        );
      })}
      <p className="doc-props-nota">
        <span className="doc-props-obrig">*</span>{t('docs.comum.textos.obrigatoriaTabelaGeradaDos')}<C>{entrada.arquivo}</C>.
      </p>
    </div>
  );
}
