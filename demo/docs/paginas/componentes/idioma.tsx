import { C, Codigo } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaGuia, Secao } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

const PROVEDOR = `import { Estrutura, ProvedorUi } from '@celke/kole-react';

<ProvedorUi
  idiomaInicial={usuario.locale}             // 'pt-BR' | 'en' | 'es' (sem ele: pt-BR)
  aoMudarIdioma={(idioma) => api.salvarIdioma(idioma)}
>
  <Estrutura idiomas={['pt-BR', 'en', 'es']} {/* sem a prop, o seletor não aparece */}>
    …
  </Estrutura>
</ProvedorUi>`;

const I18NEXT = `import i18n from 'i18next';
import { ProvedorUi, type Idioma } from '@celke/kole-react';

// o kole troca os textos DELE; o sistema troca os seus pelo i18next
const sincronizar = (idioma: Idioma) => {
  i18n.changeLanguage(idioma);          // chamado ao montar e a cada troca
};

<ProvedorUi aoMudarIdioma={sincronizar}>…</ProvedorUi>`;

const LARAVEL = `// routes/web.php — grava a escolha do usuário
Route::put('/preferencias/idioma', function (Request $request) {
    $request->validate(['idioma' => 'in:pt-BR,en,es']);
    $request->user()->update(['locale' => $request->idioma]);
    return response()->noContent();
})->middleware('auth');

// app/Http/Middleware/HandleInertiaRequests.php — devolve no carregamento
'locale' => fn () => $request->user()?->locale ?? 'pt-BR',`;

const LARAVEL_REACT = `const { locale } = usePage().props;

<ProvedorUi
  idiomaInicial={locale}
  aoMudarIdioma={(idioma) => idioma !== locale && axios.put('/preferencias/idioma', { idioma })}
>`;

const TEXTOS = `<ProvedorUi
  textos={{
    // troca um texto da biblioteca
    'pt-BR': { tabela: { rotulo: 'Lista de registros' } },
    // acrescenta um idioma (o que faltar sai em pt-BR)
    fr: { idioma: { nome: 'Français', seletor: 'Langue', atual: 'Langue : {nome}' }, comum: { fechar: 'Fermer' } },
  }}
>
  <Estrutura idiomas={['pt-BR', 'en', 'es', 'fr']}>…</Estrutura>
</ProvedorUi>`;

const SCRIPT = `// no <head> (SSR) — define <html lang> antes da primeira pintura
<script dangerouslySetInnerHTML={{ __html: scriptTemaInicial({ idiomaInicial: usuario.locale }) }} />`;

export default function DocIdioma() {
  const { t } = useT();
  return (
    <PaginaGuia
      pagina="idioma"
      icone="globe"
    >
      <Secao id="ligar" titulo={t('docs.idioma.secoes.ligar')}>
        <p className="doc-p">{rico(t('docs.idioma.textos.oIdiomaFicaNo'))}</p>
        <Codigo codigo={PROVEDOR} />
        <Exemplo id="idioma/Seletor" titulo={t('docs.idioma.secoes.trocarOIdiomaA')} />
      </Secao>

      <Secao id="o-que-muda" titulo={t('docs.idioma.secoes.oQueMuda')}>
        <ul className="doc-lista">
          <li>{rico(t('docs.idioma.textos.mudamOsTextosDa'))}</li>
          <li>{rico(t('docs.idioma.textos.aMoedaNaoMuda'))}</li>
          <li>{t('docs.idioma.textos.regrasBrasileirasFicamComo')}</li>
          <li>{rico(t('docs.idioma.textos.osTextosDoSistema'))}</li>
          <li>{rico(t('docs.idioma.textos.utilitariosAceitamOIdioma'))}</li>
        </ul>
      </Secao>

      <Secao id="sincronizar" titulo={t('docs.idioma.secoes.sincronizar')}>
        <p className="doc-p">{rico(t('docs.idioma.textos.aomudaridiomaEChamadoAo'))}</p>
        <Codigo codigo={I18NEXT} />
        <p className="doc-p">{rico(t('docs.idioma.textos.comLaravelGuardeA'))}</p>
        <Codigo linguagem="php" codigo={LARAVEL} />
        <Codigo codigo={LARAVEL_REACT} />
      </Secao>

      <Secao id="textos" titulo={t('docs.idioma.secoes.textos')}>
        <p className="doc-p">{rico(t('docs.idioma.textos.osDicionariosSaoExportados'))}</p>
        <Codigo codigo={TEXTOS} />
      </Secao>

      <Secao id="sem-piscar" titulo={t('docs.idioma.secoes.semPiscar')}>
        <p className="doc-p">{rico(t('docs.idioma.textos.oScripttemainicialTambemDefine'))}<C>&lt;html&gt;</C>{rico(t('docs.idioma.textos.antesDaPrimeiraPintura'))}</p>
        <Codigo codigo={SCRIPT} />
      </Secao>
    </PaginaGuia>
  );
}
