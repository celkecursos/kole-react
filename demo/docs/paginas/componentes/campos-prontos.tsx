import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="camposProntos"
      icone="id-card"
      componente="CampoTelefone"
      importar={[
        'CampoCpf',
        'CampoCnpj',
        'CampoCpfCnpj',
        'CampoCep',
        'CampoEmail',
        'CampoMoeda',
        'CampoInteiro',
        'CampoData',
        'CampoHora',
        'CampoDataHora',
        'CampoPlaca',
        'CampoRenavam',
        'CampoChassi',
        'CampoCnh',
        'CampoImei',
      ]}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.camposProntos.textos.todosAceitamAsProps'))}</li>
          <li>{rico(t('docs.camposProntos.textos.cpfCnpjCnhE'))}</li>
          <li>{rico(t('docs.camposProntos.textos.campomoedaECampointeiroTrabalham'))}</li>
          <li>{rico(t('docs.camposProntos.textos.osFormatosFicamEm'))}</li>
        </ul>
      }
    >
      <Exemplo id="campos-prontos/Documentos" titulo={t('docs.camposProntos.secoes.documentosEContato')}>{t('docs.camposProntos.textos.oCpfVemCom')}</Exemplo>
      <Exemplo id="campos-prontos/Numeros" titulo={t('docs.camposProntos.secoes.moedaNumeroEDatas')} />
      <Exemplo id="campos-prontos/Veiculos" titulo={t('docs.camposProntos.secoes.veiculosEAparelhos')} />
    </PaginaComponente>
  );
}
