import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="imagem"
      icone="image"
      componente="Imagem"
      outros={['Figura']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.imagem.textos.altEObrigatorioDescreva'))}</li>
          <li>{rico(t('docs.imagem.textos.proporcaoReservaOEspaco'))}</li>
          <li>{rico(t('docs.imagem.textos.fotosDePessoasOu'))}</li>
        </ul>
      }
    >
      <Exemplo id="imagem/Basico" titulo={t('docs.imagem.secoes.variacoes')} />
    </PaginaComponente>
  );
}
