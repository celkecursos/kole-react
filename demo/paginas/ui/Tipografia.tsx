import { CabecalhoPagina, Citacao, type CorCitacao } from '../../../src';
import { Bloco } from '../Bloco';

/** A escala tipográfica do projeto (tokens.css), do maior para o menor. */
const ESCALA = [
  ['--fs-display-2', '34px', 'Hero (saudação do login)'],
  ['--fs-display', '24px', 'Números e destaques de painel'],
  ['--fs-titulo', '20px', 'Título de página (único)'],
  ['--fs-titulo-secao', '16px', 'Seção de formulário, título de diálogo'],
  ['--fs-corpo', '14px', 'Corpo de leitura do app'],
  ['--fs-corpo-2', '13px', 'Secundário denso (menu, tabela)'],
  ['--fs-caption', '12px', 'Rótulo de campo, dica, erro'],
  ['--fs-micro', '11px', 'Caixa-alta estrutural, contadores'],
] as const;

const FRASE = 'A maior glória da vida não está em nunca cair, mas em levantar a cada queda.';

const CITACOES: Array<[CorCitacao, string]> = [
  ['pri', 'primária'],
  ['secundario', 'secundária'],
  ['warn', 'de aviso'],
  ['ok', 'de sucesso'],
  ['info', 'informativa'],
  ['err', 'de perigo'],
];

export function PaginaTipografia() {
  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Tipografia" icone="file-type" trilha />

      <div className="demo-colunas">
        <Bloco titulo="Títulos h1 a h6">
          <div className="demo-tipo-titulos">
            <h1>h1. Título da biblioteca</h1>
            <h2>h2. Título da biblioteca</h2>
            <h3>h3. Título da biblioteca</h3>
            <h4>h4. Título da biblioteca</h4>
            <h5>h5. Título da biblioteca</h5>
            <h6>h6. Título da biblioteca</h6>
          </div>
        </Bloco>
        <Bloco titulo="Títulos de destaque" descricao="Para heróis e números grandes.">
          <div className="demo-tipo-display">
            {[4.5, 4, 3.5, 3, 2.5, 2].map((t, i) => (
              <p key={t} style={{ fontSize: `${t}rem` }}>
                Destaque {i + 1}
              </p>
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Elementos de texto">
          <div className="demo-tipo-texto">
            <p>
              Use a tag <mark>mark</mark> para destacar texto.
            </p>
            <p>
              <del>Esta linha é tratada como texto apagado.</del>
            </p>
            <p>
              <s>Esta linha é tratada como texto que não vale mais.</s>
            </p>
            <p>
              <ins>Esta linha é tratada como um acréscimo ao documento.</ins>
            </p>
            <p>
              <u>Esta linha aparece sublinhada.</u>
            </p>
            <p>
              <small>Esta linha é tratada como letra miúda.</small>
            </p>
            <p>
              <strong>Esta linha aparece em negrito.</strong>
            </p>
            <p>
              <em>Esta linha aparece em itálico.</em>
            </p>
          </div>
        </Bloco>
        <Bloco titulo="Escala do projeto" descricao="Os tamanhos vêm dos tokens --fs-* (tokens.css); use-os em vez de px soltos.">
          <div className="demo-tipo-escala">
            {ESCALA.map(([token, px, uso]) => (
              <div key={token} className="demo-tipo-escala-linha">
                <span style={{ fontSize: `var(${token})` }}>Texto de exemplo</span>
                <code>
                  {token} · {px}
                </code>
                <small>{uso}</small>
              </div>
            ))}
          </div>
        </Bloco>
      </div>

      <Bloco titulo="Parágrafo de abertura" descricao="Um pouco maior e mais leve que o corpo, para abrir um texto.">
        <div className="demo-tipo-texto">
          <p className="demo-tipo-abertura">Este é um parágrafo de abertura. Ele se destaca dos parágrafos comuns.</p>
          <p>
            Existem muitas variações de passagens disponíveis, mas a maioria sofreu alguma alteração, seja por humor inserido ou por palavras escolhidas ao acaso
            que nem parecem verossímeis.
          </p>
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo="Lista de definições">
          <dl className="demo-tipo-dl">
            <dt>Lista de definições</dt>
            <dd>Perfeita para definir termos.</dd>
            <dt>Termo</dt>
            <dd>
              <p>Definição do termo.</p>
              <p>E mais alguma definição dele.</p>
            </dd>
            <dt>Outro termo</dt>
            <dd>Esta definição é curta, sem parágrafos extras.</dd>
            <dt className="demo-tipo-truncar">Termo comprido que é cortado com reticências</dt>
            <dd>Use text-overflow: ellipsis para cortar o texto que não cabe.</dd>
          </dl>
        </Bloco>
        <Bloco titulo="Lista sem marcadores">
          <ul className="demo-tipo-lista-limpa">
            <li>Esta é uma lista.</li>
            <li>Ela aparece sem estilo nenhum.</li>
            <li>Na estrutura, continua sendo uma lista.</li>
            <li>
              Mas o estilo só vale para os itens diretos.
              <ul>
                <li>Listas dentro dela</li>
                <li>não são afetadas</li>
                <li>e mantêm o marcador.</li>
              </ul>
            </li>
            <li>Isto pode ser útil em alguns casos.</li>
          </ul>
        </Bloco>

        <Bloco titulo="Citação à esquerda">
          <Citacao autor="Nelson Mandela">{FRASE}</Citacao>
        </Bloco>
        <Bloco titulo="Citação à direita">
          <Citacao autor="Nelson Mandela" alinhamento="fim" cor="destaque">
            {FRASE}
          </Citacao>
        </Bloco>
      </div>

      <h2 className="demo-secao-titulo">Citações em cartão</h2>
      <div className="demo-colunas-3">
        {CITACOES.map(([cor, nome]) => (
          <Bloco key={cor} titulo={`Citação ${nome}`}>
            <Citacao cor={cor} aparencia="cartao" alinhamento="centro" autor="Eleanor Roosevelt">
              O futuro pertence a quem acredita na beleza dos próprios sonhos.
            </Citacao>
          </Bloco>
        ))}
      </div>

      <div className="demo-colunas">
        <Bloco titulo="Abreviações">
          <div className="demo-tipo-texto">
            <p>
              <abbr title="atributo">attr</abbr>
            </p>
            <p>
              <abbr title="Linguagem de Marcação de Hipertexto" className="demo-tipo-sigla">
                HTML
              </abbr>
            </p>
          </div>
        </Bloco>
        <Bloco titulo="Linhas horizontais">
          <div className="demo-tipo-texto">
            <p>Um parágrafo antes da linha, para mostrar a separação entre dois trechos de texto.</p>
            <hr className="demo-tipo-hr" />
            <p>E outro parágrafo depois dela, já em outro assunto.</p>
            <hr className="demo-tipo-hr demo-tipo-hr--grossa" />
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-4">
        <Bloco titulo="Monoespaçada">
          <p className="demo-tipo-mono">Este texto está em fonte monoespaçada.</p>
        </Bloco>
        <Bloco titulo="Cor herdada">
          <p className="demo-tipo-mudo">
            Texto apagado com um <a href="#/ui/tipografia">link que herda a cor</a>.
          </p>
        </Bloco>
        <Bloco titulo="Texto visível">
          <p className="demo-tipo-texto-p">Este texto está visível.</p>
        </Bloco>
        <Bloco titulo="Texto invisível" descricao="Ocupa o espaço, mas não aparece.">
          <p className="demo-tipo-texto-p demo-tipo-invisivel">Este texto está invisível.</p>
        </Bloco>
      </div>

      <div className="demo-colunas">
        <Bloco titulo="Caixa do texto">
          <div className="demo-tipo-texto">
            <p className="demo-tipo-minusculas">Texto Em Minúsculas.</p>
            <p className="demo-tipo-maiusculas">Texto em maiúsculas.</p>
            <p className="demo-tipo-capitalizado">texto com iniciais maiúsculas.</p>
          </div>
        </Bloco>
        <Bloco titulo="Decoração do texto">
          <div className="demo-tipo-texto">
            <p className="demo-tipo-sublinhado">Este texto tem uma linha embaixo.</p>
            <p className="demo-tipo-riscado">Este texto tem uma linha atravessando.</p>
            <p>
              <a href="#/ui/tipografia" className="demo-tipo-sem-linha">
                Este link não tem sublinhado.
              </a>
            </p>
          </div>
        </Bloco>

        <Bloco titulo="Peso e itálico">
          <div className="demo-tipo-texto">
            {[
              [800, 'Texto extranegrito.'],
              [700, 'Texto em negrito.'],
              [600, 'Texto seminegrito.'],
              [500, 'Texto médio.'],
              [400, 'Texto normal.'],
              [300, 'Texto leve.'],
            ].map(([peso, txt]) => (
              <p key={peso} style={{ fontWeight: peso }}>
                {txt} <code>{peso}</code>
              </p>
            ))}
            <p>
              <em>Texto em itálico.</em>
            </p>
          </div>
        </Bloco>
        <Bloco titulo="Altura da linha">
          <div className="demo-tipo-texto">
            {[1, 1.25, 1.5, 2].map((a) => (
              <p key={a} style={{ lineHeight: a }} className="demo-tipo-entrelinha">
                <code>line-height: {a}</code> — Este é um parágrafo longo, escrito para mostrar como a altura da linha muda a leitura do texto quando ele
                ocupa mais de uma linha.
              </p>
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Alinhamento">
          <div className="demo-tipo-texto">
            <p style={{ textAlign: 'start' }}>Texto alinhado ao início.</p>
            <p style={{ textAlign: 'center' }}>Texto centralizado.</p>
            <p style={{ textAlign: 'end' }}>Texto alinhado ao fim.</p>
            <p style={{ textAlign: 'justify' }}>
              Texto justificado: as linhas ocupam a largura toda, com o espaço entre as palavras ajustado para que as bordas fiquem retas dos dois lados.
            </p>
          </div>
        </Bloco>
        <Bloco titulo="Quebra e corte do texto">
          <div className="demo-tipo-texto">
            <div className="demo-tipo-caixa" style={{ width: '9rem' }}>
              Este texto quebra de linha.
            </div>
            <div className="demo-tipo-caixa" style={{ width: '9rem', whiteSpace: 'nowrap' }}>
              Este texto não quebra e passa da caixa.
            </div>
            <div className="demo-tipo-caixa demo-tipo-truncar" style={{ width: '12rem' }}>
              Este texto é cortado com reticências no fim.
            </div>
            <div className="demo-tipo-caixa" style={{ width: '9rem', overflowWrap: 'anywhere' }}>
              Palavrasemfimquequebramemqualquerponto.
            </div>
          </div>
        </Bloco>
      </div>
    </div>
  );
}
