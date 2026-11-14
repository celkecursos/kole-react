import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="botaoFechar"
      icone="x"
      componente="BotaoFechar"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.botaoFechar.textos.oRotuloPadraoFechar'))}</li>
          <li>{rico(t('docs.botaoFechar.textos.dialogoCardEAlerta'))}</li>
        </ul>
      }
    >
      <Exemplo id="botao-fechar/Basico" titulo={t('docs.botaoFechar.secoes.variantes')} />
    </PaginaComponente>
  );
}
