import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="quadroArrastavel"
      icone="grip-vertical"
      componente="QuadroArrastavel"
      tipos={['ColunaArrastavel', 'PosicaoQuadro', 'SoltarItem', 'SoltarColuna']}
      importar={['type ColunaArrastavel']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.quadroArrastavel.textos.arrastePelaAlcaNo'))}</li>
          <li>{rico(t('docs.quadroArrastavel.textos.oQuadroEControlado'))}</li>
          <li>{rico(t('docs.quadroArrastavel.textos.podesoltarRecusaDestinosA'))}</li>
          <li>{rico(t('docs.quadroArrastavel.textos.layoutFaixaPoeAs'))}</li>
          <li>{rico(t('docs.quadroArrastavel.textos.colunasarrastaveisDaUmaAlca'))}</li>
          <li>{rico(t('docs.quadroArrastavel.textos.osItensPrecisamDe'))}</li>
        </ul>
      }
    >
      <Exemplo id="quadro-arrastavel/Basico" titulo={t('docs.quadroArrastavel.secoes.gradeSimples')} />
      <Exemplo id="quadro-arrastavel/Faixa" titulo={t('docs.quadroArrastavel.secoes.faixaRegrasDeDestino')} />
    </PaginaComponente>
  );
}
