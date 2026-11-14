import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="avaliacao"
      icone="star"
      componente="Avaliacao"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.avaliacao.textos.oRotuloEObrigatorio'))}</li>
          <li>{t('docs.avaliacao.textos.cadaEstrelaEUm')}</li>
          <li>{rico(t('docs.avaliacao.textos.comAomudarDevolvendoUma'))}</li>
        </ul>
      }
    >
      <Exemplo id="avaliacao/Basico" titulo={t('docs.avaliacao.secoes.variacoes')} />
      <Exemplo id="avaliacao/Servidor" titulo={t('docs.avaliacao.secoes.salvandoNoServidor')} />
    </PaginaComponente>
  );
}
