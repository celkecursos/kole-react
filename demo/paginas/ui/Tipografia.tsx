import { CabecalhoPagina, Citacao, type CorCitacao } from '../../../src';
import { Bloco } from '../Bloco';
import { useT, type TradutorDemo } from '../../i18n/useT';
import { rico } from '../../i18n/rico';

/** A escala tipográfica do projeto (tokens.css), do maior para o menor. */
const ESCALA = (t: TradutorDemo['t']) => ([
  ['--fs-display-2', '34px', t('paginas.tipografia.textos.heroSaudacaoDoLogin')],
  ['--fs-display', '24px', t('paginas.tipografia.textos.numerosEDestaquesDe')],
  ['--fs-titulo', '20px', t('paginas.tipografia.textos.tituloDePaginaUnico')],
  ['--fs-titulo-secao', '16px', t('paginas.tipografia.textos.secaoDeFormularioTitulo')],
  ['--fs-corpo', '14px', t('paginas.tipografia.textos.corpoDeLeituraDo')],
  ['--fs-corpo-2', '13px', t('paginas.tipografia.textos.secundarioDensoMenuTabela')],
  ['--fs-caption', '12px', t('paginas.tipografia.textos.rotuloDeCampoDica')],
  ['--fs-micro', '11px', t('paginas.tipografia.textos.caixaAltaEstruturalContadores')],
] as const);

const FRASE = (t: TradutorDemo['t']) => (t('paginas.tipografia.textos.aMaiorGloriaDa'));

const CITACOES = (t: TradutorDemo['t']): Array<[CorCitacao, string]> => ([
  ['pri', t('paginas.tipografia.textos.primaria')],
  ['secundario', t('paginas.tipografia.textos.secundaria')],
  ['warn', t('paginas.tipografia.textos.deAviso')],
  ['ok', t('paginas.tipografia.textos.deSucesso')],
  ['info', 'informativa'],
  ['err', t('paginas.tipografia.textos.dePerigo')],
]);

export function PaginaTipografia() {
  const { t: tx, tc } = useT();
  const { t } = useT();
  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.tipografia.titulo')} icone="file-type" trilha />

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.tipografia.secoes.titulosH1AH6')}>
          <div className="demo-tipo-titulos">
            <h1>{t('paginas.tipografia.textos.h1TituloDaBiblioteca')}</h1>
            <h2>{t('paginas.tipografia.textos.h2TituloDaBiblioteca')}</h2>
            <h3>{t('paginas.tipografia.textos.h3TituloDaBiblioteca')}</h3>
            <h4>{t('paginas.tipografia.textos.h4TituloDaBiblioteca')}</h4>
            <h5>{t('paginas.tipografia.textos.h5TituloDaBiblioteca')}</h5>
            <h6>{t('paginas.tipografia.textos.h6TituloDaBiblioteca')}</h6>
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.tipografia.secoes.titulosDeDestaque')} descricao={t('paginas.tipografia.textos.paraHeroisENumeros')}>
          <div className="demo-tipo-display">
            {[4.5, 4, 3.5, 3, 2.5, 2].map((t, i) => (
              <p key={t} style={{ fontSize: `${t}rem` }}>{tx('paginas.tipografia.textos.destaque')}{i + 1}
              </p>
            ))}
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.tipografia.secoes.elementosDeTexto')}>
          <div className="demo-tipo-texto">
            <p>{rico(t('paginas.tipografia.textos.useATagMark'))}</p>
            <p>
              <del>{t('paginas.tipografia.textos.estaLinhaETratada')}</del>
            </p>
            <p>{rico(t('paginas.tipografia.textos.estaLinhaETratada2'))}</p>
            <p>
              <ins>{t('paginas.tipografia.textos.estaLinhaETratada3')}</ins>
            </p>
            <p>{rico(t('paginas.tipografia.textos.estaLinhaApareceSublinhada'))}</p>
            <p>{rico(t('paginas.tipografia.textos.estaLinhaETratada4'))}</p>
            <p>{rico(t('paginas.tipografia.textos.estaLinhaApareceEm'))}</p>
            <p>{rico(t('paginas.tipografia.textos.estaLinhaApareceEm2'))}</p>
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.tipografia.secoes.escalaDoProjeto')} descricao={t('paginas.tipografia.textos.osTamanhosVemDos')}>
          <div className="demo-tipo-escala">
            {ESCALA(t).map(([token, px, uso]) => (
              <div key={token} className="demo-tipo-escala-linha">
                <span style={{ fontSize: `var(${token})` }}>{t('paginas.tipografia.textos.textoDeExemplo')}</span>
                <code>
                  {token} · {px}
                </code>
                <small>{uso}</small>
              </div>
            ))}
          </div>
        </Bloco>
      </div>

      <Bloco titulo={t('paginas.tipografia.secoes.paragrafoDeAbertura')} descricao={t('paginas.tipografia.textos.umPoucoMaiorE')}>
        <div className="demo-tipo-texto">
          <p className="demo-tipo-abertura">{t('paginas.tipografia.textos.esteEUmParagrafo')}</p>
          <p>{t('paginas.tipografia.textos.existemMuitasVariacoesDe')}</p>
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.tipografia.secoes.listaDeDefinicoes')}>
          <dl className="demo-tipo-dl">
            <dt>{t('paginas.tipografia.textos.listaDeDefinicoes')}</dt>
            <dd>{t('paginas.tipografia.textos.perfeitaParaDefinirTermos')}</dd>
            <dt>{t('paginas.tipografia.textos.termo')}</dt>
            <dd>
              <p>{t('paginas.tipografia.textos.definicaoDoTermo')}</p>
              <p>{t('paginas.tipografia.textos.eMaisAlgumaDefinicao')}</p>
            </dd>
            <dt>{t('paginas.tipografia.textos.outroTermo')}</dt>
            <dd>{t('paginas.tipografia.textos.estaDefinicaoECurta')}</dd>
            <dt className="demo-tipo-truncar">{t('paginas.tipografia.textos.termoCompridoQueE')}</dt>
            <dd>{t('paginas.tipografia.textos.useTextOverflowEllipsis')}</dd>
          </dl>
        </Bloco>
        <Bloco titulo={t('paginas.tipografia.secoes.listaSemMarcadores')}>
          <ul className="demo-tipo-lista-limpa">
            <li>{t('paginas.tipografia.textos.estaEUmaLista')}</li>
            <li>{t('paginas.tipografia.textos.elaApareceSemEstilo')}</li>
            <li>{t('paginas.tipografia.textos.naEstruturaContinuaSendo')}</li>
            <li>{t('paginas.tipografia.textos.masOEstiloSo')}<ul>
                <li>{t('paginas.tipografia.textos.listasDentroDela')}</li>
                <li>{t('paginas.tipografia.textos.naoSaoAfetadas')}</li>
                <li>{t('paginas.tipografia.textos.eMantemOMarcador')}</li>
              </ul>
            </li>
            <li>{t('paginas.tipografia.textos.istoPodeSerUtil')}</li>
          </ul>
        </Bloco>

        <Bloco titulo={t('paginas.tipografia.secoes.citacaoAEsquerda')}>
          <Citacao autor="Nelson Mandela">{FRASE(t)}</Citacao>
        </Bloco>
        <Bloco titulo={t('paginas.tipografia.secoes.citacaoADireita')}>
          <Citacao autor="Nelson Mandela" alinhamento="fim" cor="destaque">
            {FRASE(t)}
          </Citacao>
        </Bloco>
      </div>

      <h2 className="demo-secao-titulo">{t('paginas.tipografia.textos.citacoesEmCartao')}</h2>
      <div className="demo-colunas-3">
        {CITACOES(t).map(([cor, nome]) => (
          <Bloco key={cor} titulo={t('paginas.tipografia.secoes.citacaoNome', { nome })}>
            <Citacao cor={cor} aparencia="cartao" alinhamento="centro" autor="Eleanor Roosevelt">{t('paginas.tipografia.textos.oFuturoPertenceA')}</Citacao>
          </Bloco>
        ))}
      </div>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.tipografia.secoes.abreviacoes')}>
          <div className="demo-tipo-texto">
            <p>
              <abbr title={t('paginas.tipografia.textos.atributo')}>{t('paginas.tipografia.textos.attr')}</abbr>
            </p>
            <p>
              <abbr title={t('paginas.tipografia.textos.linguagemDeMarcacaoDe')} className="demo-tipo-sigla">{t('paginas.tipografia.textos.html')}</abbr>
            </p>
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.tipografia.secoes.linhasHorizontais')}>
          <div className="demo-tipo-texto">
            <p>{t('paginas.tipografia.textos.umParagrafoAntesDa')}</p>
            <hr className="demo-tipo-hr" />
            <p>{t('paginas.tipografia.textos.eOutroParagrafoDepois')}</p>
            <hr className="demo-tipo-hr demo-tipo-hr--grossa" />
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-4">
        <Bloco titulo={t('paginas.tipografia.secoes.monoespacada')}>
          <p className="demo-tipo-mono">{t('paginas.tipografia.textos.esteTextoEstaEm')}</p>
        </Bloco>
        <Bloco titulo={t('paginas.tipografia.secoes.corHerdada')}>
          <p className="demo-tipo-mudo">{t('paginas.tipografia.textos.textoApagadoComUm')}<a href="#/ui/tipografia">{t('paginas.tipografia.textos.linkQueHerdaA')}</a>.
          </p>
        </Bloco>
        <Bloco titulo={t('paginas.tipografia.secoes.textoVisivel')}>
          <p className="demo-tipo-texto-p">{t('paginas.tipografia.textos.esteTextoEstaVisivel')}</p>
        </Bloco>
        <Bloco titulo={t('paginas.tipografia.secoes.textoInvisivel')} descricao={t('paginas.tipografia.textos.ocupaOEspacoMas')}>
          <p className="demo-tipo-texto-p demo-tipo-invisivel">{t('paginas.tipografia.textos.esteTextoEstaInvisivel')}</p>
        </Bloco>
      </div>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.tipografia.secoes.caixaDoTexto')}>
          <div className="demo-tipo-texto">
            <p className="demo-tipo-minusculas">{t('paginas.tipografia.textos.textoEmMinusculas')}</p>
            <p className="demo-tipo-maiusculas">{t('paginas.tipografia.textos.textoEmMaiusculas')}</p>
            <p className="demo-tipo-capitalizado">{t('paginas.tipografia.textos.textoComIniciaisMaiusculas')}</p>
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.tipografia.secoes.decoracaoDoTexto')}>
          <div className="demo-tipo-texto">
            <p className="demo-tipo-sublinhado">{t('paginas.tipografia.textos.esteTextoTemUma')}</p>
            <p className="demo-tipo-riscado">{t('paginas.tipografia.textos.esteTextoTemUma2')}</p>
            <p>
              <a href="#/ui/tipografia" className="demo-tipo-sem-linha">{t('paginas.tipografia.textos.esteLinkNaoTem')}</a>
            </p>
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.tipografia.secoes.pesoEItalico')}>
          <div className="demo-tipo-texto">
            {[
              [800, tc('Texto extranegrito.')],
              [700, tc('Texto em negrito.')],
              [600, tc('Texto seminegrito.')],
              [500, tc('Texto médio.')],
              [400, tc('Texto normal.')],
              [300, tc('Texto leve.')],
            ].map(([peso, txt]) => (
              <p key={peso} style={{ fontWeight: peso }}>
                {txt} <code>{peso}</code>
              </p>
            ))}
            <p>{rico(t('paginas.tipografia.textos.textoEmItalico'))}</p>
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.tipografia.secoes.alturaDaLinha')}>
          <div className="demo-tipo-texto">
            {[1, 1.25, 1.5, 2].map((a) => (
              <p key={a} style={{ lineHeight: a }} className="demo-tipo-entrelinha">
                <code>line-height: {a}</code>{t('paginas.tipografia.textos.esteEUmParagrafo2')}</p>
            ))}
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.tipografia.secoes.alinhamento')}>
          <div className="demo-tipo-texto">
            <p style={{ textAlign: 'start' }}>{t('paginas.tipografia.textos.textoAlinhadoAoInicio')}</p>
            <p style={{ textAlign: 'center' }}>{t('paginas.tipografia.textos.textoCentralizado')}</p>
            <p style={{ textAlign: 'end' }}>{t('paginas.tipografia.textos.textoAlinhadoAoFim')}</p>
            <p style={{ textAlign: 'justify' }}>{t('paginas.tipografia.textos.textoJustificadoAsLinhas')}</p>
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.tipografia.secoes.quebraECorteDo')}>
          <div className="demo-tipo-texto">
            <div className="demo-tipo-caixa" style={{ width: '9rem' }}>{t('paginas.tipografia.textos.esteTextoQuebraDe')}</div>
            <div className="demo-tipo-caixa" style={{ width: '9rem', whiteSpace: 'nowrap' }}>{t('paginas.tipografia.textos.esteTextoNaoQuebra')}</div>
            <div className="demo-tipo-caixa demo-tipo-truncar" style={{ width: '12rem' }}>{t('paginas.tipografia.textos.esteTextoECortado')}</div>
            <div className="demo-tipo-caixa" style={{ width: '9rem', overflowWrap: 'anywhere' }}>{t('paginas.tipografia.textos.palavrasemfimquequebramemqualquerponto')}</div>
          </div>
        </Bloco>
      </div>
    </div>
  );
}
