import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="card"
      icone="layers"
      componente="Card"
      importar={['GrupoCards']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.card.textos.grupocardsColaOsCards'))}</li>
          <li>{rico(t('docs.card.textos.comAoclicarOCard'))}</li>
          <li>{rico(t('docs.card.textos.corPintaOFundo'))}</li>
          <li>{rico(t('docs.card.textos.posicaomidiaPoeAImagem'))}</li>
        </ul>
      }
    >
      <Exemplo id="card/Basico" titulo={t('docs.card.secoes.tituloMidiaEBorda')} />
      <Exemplo id="card/Ferramentas" titulo={t('docs.card.secoes.recolherTelaCheiaE')} />
      <Exemplo id="card/Grupo" titulo={t('docs.card.secoes.grupoDeCards')} />
    </PaginaComponente>
  );
}
