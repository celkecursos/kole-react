import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="listaTarefas"
      icone="list-todo"
      componente="ListaTarefas"
      tipos={['TarefaLista', 'ReordenarTarefa']}
      importar={['type TarefaLista']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.listaTarefas.textos.controladaAoconcluirRecebeA'))}</li>
          <li>{rico(t('docs.listaTarefas.textos.filtroFazAsVisoes'))}</li>
          <li>{rico(t('docs.listaTarefas.textos.concluidaValeSobreSituacao'))}</li>
          <li>{rico(t('docs.listaTarefas.textos.comAoabrirALinha'))}</li>
          <li>{t('docs.listaTarefas.textos.aDemoTrazA')}</li>
        </ul>
      }
    >
      <Exemplo id="lista-tarefas/Basico" titulo={t('docs.listaTarefas.secoes.concluirReordenarEVisoes')} />
    </PaginaComponente>
  );
}
