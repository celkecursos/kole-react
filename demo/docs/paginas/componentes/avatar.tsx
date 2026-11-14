import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="avatar"
      icone="circle-user"
      componente="Avatar"
      outros={['ComBadge', 'GrupoAvatares']}
      tipos={['PessoaAvatar']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.avatar.textos.semFotoOuSe'))}</li>
          <li>{rico(t('docs.avatar.textos.oNomeViraO'))}</li>
          <li>{rico(t('docs.avatar.textos.combadgeValeParaQualquer'))}</li>
          <li>{rico(t('docs.avatar.textos.grupoavataresMostraAteMax'))}</li>
        </ul>
      }
    >
      <Exemplo id="avatar/Basico" titulo={t('docs.avatar.secoes.fotoIniciaisEBadge')} />
      <Exemplo id="avatar/Grupo" titulo={t('docs.avatar.secoes.grupoDeAvatares')} />
    </PaginaComponente>
  );
}
