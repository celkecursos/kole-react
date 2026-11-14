import { Alerta } from '../../../src';
import { Codigo } from '../Codigo';
import { PaginaGuia, Secao } from '../PaginaDoc';
import { useT } from '../../i18n/useT';
import { rico } from '../../i18n/rico';

const CSS_APP = `/* app.css: esta linha vem antes do @import do Tailwind */
@layer theme, base, kole, components, utilities;
@import 'tailwindcss';
@import '@celke/kole-react/tailwind.css'; /* opcional: a ponte abaixo */`;

const MAIN = `// main.tsx
import './app.css';
import '@celke/kole-react/estilos.css';`;

const UTILITARIOS = `<Card titulo="Resumo" className="mt-4">
  <p className="text-t3">Atualizado agora</p>
  <div className="mt-2 rounded-card border border-border bg-surface p-4">
    <span className="text-ok-fg">Tudo certo</span>
  </div>
</Card>`;

export function DocTailwind() {
  const { t } = useT();
  return (
    <PaginaGuia
      pagina="tailwind"
      icone="code"
    >
      <Secao id="camadas" titulo={t('docs.tailwind.secoes.camadas')}>
        <p className="doc-p">{rico(t('docs.tailwind.textos.todoOCssDa'))}</p>
        <Codigo linguagem="css" codigo={CSS_APP} />
        <Codigo codigo={MAIN} />
        <Alerta
          severidade="warn"
          titulo={t('docs.tailwind.textos.seOEstilosCss')}
          mensagem={t('docs.tailwind.textos.aCamadaKoleFica')}
        />
      </Secao>

      <Secao id="ponte" titulo={t('docs.tailwind.secoes.ponte')}>
        <ul className="doc-lista">
          <li>{rico(t('docs.tailwind.textos.oDarkDoTailwind'))}</li>
          <li>{rico(t('docs.tailwind.textos.osTokensViramUtilitarios'))}</li>
          <li>{rico(t('docs.tailwind.textos.fontSansEFont'))}</li>
          <li>{rico(t('docs.tailwind.textos.paraOSitePublico'))}</li>
        </ul>
        <Codigo codigo={UTILITARIOS} />
      </Secao>

      <Secao id="limites" titulo={t('docs.tailwind.secoes.limites')}>
        <p className="doc-p">{rico(t('docs.tailwind.textos.aDensidadeNaoChega'))}</p>
      </Secao>
    </PaginaGuia>
  );
}
