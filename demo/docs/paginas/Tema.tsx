import { Botao, GrupoBotoes, usePreferencias, type Densidade, type Tema } from '../../../src';
import { C, Codigo } from '../Codigo';
import { PaginaGuia, Secao } from '../PaginaDoc';
import { useT } from '../../i18n/useT';
import { rico } from '../../i18n/rico';

type Token = { nome: string; uso: string };
const CORES: { grupo: string; tokens: Token[] }[] = [
  {
    grupo: 'Marca',
    tokens: [
      { nome: '--navy', uso: 'marinho da sidebar e da marca' },
      { nome: '--acento', uso: 'laranja de destaque (item ativo)' },
      { nome: '--destaque-fg', uso: 'laranja como texto' },
    ],
  },
  {
    grupo: 'Ação',
    tokens: [
      { nome: '--pri', uso: 'botão, link, foco' },
      { nome: '--pri-ink', uso: 'hover e texto sobre --pri-bg' },
      { nome: '--pri-bg', uso: 'fundo claro de ação' },
      { nome: '--pri-bd', uso: 'borda sobre --pri-bg' },
    ],
  },
  {
    grupo: 'Superfícies',
    tokens: [
      { nome: '--bg', uso: 'fundo da página' },
      { nome: '--surface', uso: 'cards e painéis' },
      { nome: '--surf-2', uso: 'apoio (cabeçalho, hover)' },
      { nome: '--surf-3', uso: 'apoio mais forte' },
      { nome: '--border', uso: 'bordas' },
      { nome: '--border-2', uso: 'bordas de campo' },
    ],
  },
  {
    grupo: 'Texto',
    tokens: [
      { nome: '--ink', uso: 'texto principal' },
      { nome: '--t2', uso: 'texto forte' },
      { nome: '--t3', uso: 'texto de apoio' },
      { nome: '--t4', uso: 'rótulos' },
      { nome: '--t5', uso: 'placeholder' },
    ],
  },
  {
    grupo: 'Status',
    tokens: [
      { nome: '--ok-solid', uso: 'sucesso' },
      { nome: '--warn-solid', uso: 'atenção' },
      { nome: '--err-solid', uso: 'erro' },
      { nome: '--info-solid', uso: 'informativo' },
    ],
  },
];

const MEDIDAS: Token[] = [
  { nome: '--r-field', uso: 'raio de campo' },
  { nome: '--r-btn', uso: 'raio de controles e alertas' },
  { nome: '--r-card', uso: 'raio de card' },
  { nome: '--r-dialog', uso: 'raio de diálogo' },
  { nome: '--d-h', uso: 'altura de controle (muda com a densidade)' },
  { nome: '--d-gap', uso: 'espaço entre campos (muda com a densidade)' },
  { nome: '--fs-corpo', uso: 'corpo de texto' },
  { nome: '--fs-titulo', uso: 'título de página' },
];

const TROCAR_MARCA = `/* no CSS do app: a ordem dos imports não importa (o kole fica em @layer kole) */
:root {
  --pri: #0f766e;
  --pri-ink: #115e59;
}
[data-theme='dark'] {
  --pri: #2dd4bf;
  --pri-ink: #5eead4;
}`;

const PREFERENCIAS = `import { usePreferencias } from '@celke/kole-react';

function BotaoTema() {
  const { escuro, alternarTema } = usePreferencias();
  return <Botao icone={escuro ? 'sun' : 'moon'} dica="Alternar tema" onClick={alternarTema} />;
}`;

const TEMAS: { id: Tema; rotulo: string; icone: string }[] = [
  { id: 'claro', rotulo: 'Claro', icone: 'sun' },
  { id: 'escuro', rotulo: 'Escuro', icone: 'moon' },
  { id: 'sistema', rotulo: 'Sistema', icone: 'settings' },
];
const DENSIDADES: { id: Densidade; rotulo: string }[] = [
  { id: 'compacta', rotulo: 'Compacta' },
  { id: 'confortavel', rotulo: 'Confortável' },
  { id: 'espacosa', rotulo: 'Espaçosa' },
];

export function DocTema() {
  const { t } = useT();
  const { t: tx } = useT();
  const { tema, densidade, definirTema, definirDensidade } = usePreferencias();

  return (
    <PaginaGuia
      pagina="tema"
      icone="palette"
    >
      <Secao id="experimente" titulo={t('docs.tema.secoes.experimente')}>
        <p className="doc-p">{t('docs.tema.textos.asAmostrasAbaixoLeem')}</p>
        <div className="demo-linha">
          {/* o teste visual compara o tema "sistema" com a referência do escuro: o botão marcado é a única diferença */}
          <span data-visual-ignorar>
            <GrupoBotoes rotulo={t('docs.tema.textos.tema')} aparencia="contorno" tamanho="pequeno">
              {TEMAS.map((t) => (
                <Botao key={t.id} rotulo={t.rotulo} icone={t.icone} pressionado={tema === t.id} onClick={() => definirTema(t.id)} />
              ))}
            </GrupoBotoes>
          </span>
          <GrupoBotoes rotulo={t('docs.tema.textos.densidade')} aparencia="contorno" tamanho="pequeno">
            {DENSIDADES.map((d) => (
              <Botao key={d.id} rotulo={d.rotulo} pressionado={densidade === d.id} onClick={() => definirDensidade(d.id)} />
            ))}
          </GrupoBotoes>
        </div>
      </Secao>

      <Secao id="cores" titulo={t('docs.tema.secoes.cores')}>
        {CORES.map((g) => (
          <div key={g.grupo} className="doc-tokens">
            <h3 className="doc-tokens-grupo">{g.grupo}</h3>
            <div className="doc-tokens-grade">
              {g.tokens.map((t) => (
                <div key={t.nome} className="doc-token">
                  <span className="doc-token-amostra" style={{ background: `var(${t.nome})` }} />
                  <span>
                    <C>{t.nome}</C>
                    <span className="doc-token-uso">{t.uso}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Secao>

      <Secao id="medidas" titulo={t('docs.tema.secoes.medidas')}>
        <div className="doc-tokens-grade">
          {MEDIDAS.map((t) => (
            <div key={t.nome} className="doc-token">
              <span className="doc-token-medida" style={t.nome.startsWith('--r-') ? { borderRadius: `var(${t.nome})` } : undefined}>
                {t.nome.startsWith('--fs-') ? <span style={{ fontSize: `var(${t.nome})` }}>{tx('docs.tema.textos.aa')}</span> : null}
                {t.nome.startsWith('--d-') ? <span className="doc-token-barra" style={{ height: `var(${t.nome})` }} /> : null}
              </span>
              <span>
                <C>{t.nome}</C>
                <span className="doc-token-uso">{t.uso}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="doc-p">{rico(t('docs.tema.textos.aListaCompletaCom'))}</p>
      </Secao>

      <Secao id="marca" titulo={t('docs.tema.secoes.marca')}>
        <p className="doc-p">{t('docs.tema.textos.redefinaOsTokensNo')}</p>
        <Codigo linguagem="css" codigo={TROCAR_MARCA} />
      </Secao>

      <Secao id="preferencias" titulo={t('docs.tema.secoes.preferencias')}>
        <p className="doc-p">{rico(t('docs.tema.textos.oTemaVemDo'))}<C>{'<html>'}</C>{rico(t('docs.tema.textos.lightDarkOuSystem'))}</p>
        <Codigo codigo={PREFERENCIAS} />
      </Secao>
    </PaginaGuia>
  );
}
