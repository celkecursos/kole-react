import { Botao, GrupoBotoes, usePreferencias, type Densidade, type Tema } from '../../../src';
import { C, Codigo } from '../Codigo';
import { PaginaGuia, Secao } from '../PaginaDoc';
import { useT, type TradutorDemo } from '../../i18n/useT';
import { rico } from '../../i18n/rico';

type Token = { nome: string; uso: string };
const CORES = (t: TradutorDemo['t']): { grupo: string; tokens: Token[] }[] => ([
  {
    grupo: t('docs.tema.textos.marca'),
    tokens: [
      { nome: '--navy', uso: t('docs.tema.textos.marinhoDaSidebarE') },
      { nome: '--acento', uso: t('docs.tema.textos.laranjaDeDestaqueItem') },
      { nome: '--destaque-fg', uso: t('docs.tema.textos.laranjaComoTexto') },
    ],
  },
  {
    grupo: t('docs.tema.textos.acao'),
    tokens: [
      { nome: '--pri', uso: t('docs.tema.textos.botaoLinkFoco') },
      { nome: '--pri-ink', uso: t('docs.tema.textos.hoverETextoSobre') },
      { nome: '--pri-bg', uso: t('docs.tema.textos.fundoClaroDeAcao') },
      { nome: '--pri-bd', uso: t('docs.tema.textos.bordaSobrePriBg') },
    ],
  },
  {
    grupo: t('docs.tema.textos.superficies'),
    tokens: [
      { nome: '--bg', uso: t('docs.tema.textos.fundoDaPagina') },
      { nome: '--surface', uso: t('docs.tema.textos.cardsEPaineis') },
      { nome: '--surf-2', uso: t('docs.tema.textos.apoioCabecalhoHover') },
      { nome: '--surf-3', uso: t('docs.tema.textos.apoioMaisForte') },
      { nome: '--border', uso: t('docs.tema.textos.bordas') },
      { nome: '--border-2', uso: t('docs.tema.textos.bordasDeCampo') },
    ],
  },
  {
    grupo: t('docs.tema.textos.texto'),
    tokens: [
      { nome: '--ink', uso: t('docs.tema.textos.textoPrincipal') },
      { nome: '--t2', uso: t('docs.tema.textos.textoForte') },
      { nome: '--t3', uso: t('docs.tema.textos.textoDeApoio') },
      { nome: '--t4', uso: t('docs.tema.textos.rotulos') },
      { nome: '--t5', uso: t('docs.tema.textos.placeholder') },
    ],
  },
  {
    grupo: t('docs.tema.textos.status'),
    tokens: [
      { nome: '--ok-solid', uso: t('docs.tema.textos.sucesso') },
      { nome: '--warn-solid', uso: t('docs.tema.textos.atencao') },
      { nome: '--err-solid', uso: t('docs.tema.textos.erro') },
      { nome: '--info-solid', uso: t('docs.tema.textos.informativo') },
    ],
  },
]);

const MEDIDAS = (t: TradutorDemo['t']): Token[] => ([
  { nome: '--r-field', uso: t('docs.tema.textos.raioDeCampo') },
  { nome: '--r-btn', uso: t('docs.tema.textos.raioDeControlesE') },
  { nome: '--r-card', uso: t('docs.tema.textos.raioDeCard') },
  { nome: '--r-dialog', uso: t('docs.tema.textos.raioDeDialogo') },
  { nome: '--d-h', uso: t('docs.tema.textos.alturaDeControleMuda') },
  { nome: '--d-gap', uso: t('docs.tema.textos.espacoEntreCamposMuda') },
  { nome: '--fs-corpo', uso: t('docs.tema.textos.corpoDeTexto') },
  { nome: '--fs-titulo', uso: t('docs.tema.textos.tituloDePagina') },
]);

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

const TEMAS = (t: TradutorDemo['t']): { id: Tema; rotulo: string; icone: string }[] => ([
  { id: 'claro', rotulo: t('docs.tema.textos.claro'), icone: 'sun' },
  { id: 'escuro', rotulo: t('docs.tema.textos.escuro'), icone: 'moon' },
  { id: 'sistema', rotulo: t('docs.tema.textos.sistema'), icone: 'settings' },
]);
const DENSIDADES = (t: TradutorDemo['t']): { id: Densidade; rotulo: string }[] => ([
  { id: 'compacta', rotulo: t('docs.tema.textos.compacta') },
  { id: 'confortavel', rotulo: t('docs.tema.textos.confortavel') },
  { id: 'espacosa', rotulo: t('docs.tema.textos.espacosa') },
]);

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
              {TEMAS(t).map((t) => (
                <Botao key={t.id} rotulo={t.rotulo} icone={t.icone} pressionado={tema === t.id} onClick={() => definirTema(t.id)} />
              ))}
            </GrupoBotoes>
          </span>
          <GrupoBotoes rotulo={t('docs.tema.textos.densidade')} aparencia="contorno" tamanho="pequeno">
            {DENSIDADES(t).map((d) => (
              <Botao key={d.id} rotulo={d.rotulo} pressionado={densidade === d.id} onClick={() => definirDensidade(d.id)} />
            ))}
          </GrupoBotoes>
        </div>
      </Secao>

      <Secao id="cores" titulo={t('docs.tema.secoes.cores')}>
        {CORES(t).map((g) => (
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
          {MEDIDAS(t).map((t) => (
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
