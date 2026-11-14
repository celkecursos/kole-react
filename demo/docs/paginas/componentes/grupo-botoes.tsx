import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="grupoBotoes"
      icone="layout-grid"
      componente="GrupoBotoes"
      outros={['BarraBotoes']}
      importar={['GrupoAlternancia']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.grupoBotoes.textos.semprePasseRotuloVira'))}</li>
          <li>{rico(t('docs.grupoBotoes.textos.grupoalternanciaRecebeOpcoesValor'))}</li>
          <li>{rico(t('docs.grupoBotoes.textos.paraEscolherUmaOpcao'))}</li>
        </ul>
      }
    >
      <Exemplo id="grupo-botoes/Grupo" titulo={t('docs.grupoBotoes.secoes.grupo')}>{rico(t('docs.grupoBotoes.textos.osBotoesDeDentro'))}</Exemplo>
      <Exemplo id="grupo-botoes/Alternancia" titulo={t('docs.grupoBotoes.secoes.alternancia')} />
      <Exemplo id="grupo-botoes/Barra" titulo={t('docs.grupoBotoes.secoes.barraDeBotoes')} />
    </PaginaComponente>
  );
}
