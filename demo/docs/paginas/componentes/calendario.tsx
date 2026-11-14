import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="calendario"
      icone="calendar"
      componente="Calendario"
      outros={['MiniCalendario']}
      tipos={['EventoCalendario', 'PeriodoCalendario', 'MudancaEvento', 'RegraRepeticao', 'RascunhoCalendario', 'IntervaloHorario']}
      importar={['type EventoCalendario', 'MiniCalendario', 'repetirEvento']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.calendario.textos.aomudarperiodoAvisaOPeriodo'))}</li>
          <li>{rico(t('docs.calendario.textos.naSemanaENo'))}</li>
          <li>{rico(t('docs.calendario.textos.corUsaOsTokens'))}</li>
          <li>{rico(t('docs.calendario.textos.comAoalterareventoOsEventos'))}</li>
          <li>{rico(t('docs.calendario.textos.cadastroAoselecionarhorarioRecebeO'))}</li>
          <li>{rico(t('docs.calendario.textos.eventosQueSeRepetem'))}</li>
          <li>{rico(t('docs.calendario.textos.minicalendarioEscolheODia'))}</li>
          <li>{t('docs.calendario.textos.tecladoNoMesSetas')}</li>
        </ul>
      }
    >
      <Exemplo id="calendario/Mes" titulo={t('docs.calendario.secoes.visaoMes')} />
      <Exemplo id="calendario/Semana" titulo={t('docs.calendario.secoes.visaoSemana')} />
      <Exemplo id="calendario/Lista" titulo={t('docs.calendario.secoes.visaoLista')} />
      <Exemplo id="calendario/Arrastar" titulo={t('docs.calendario.secoes.arrastarEEsticar')} />
      <Exemplo id="calendario/Repetir" titulo={t('docs.calendario.secoes.serieSemanalEMinicalendario')} />
      <Exemplo id="calendario/Cadastro" titulo={t('docs.calendario.secoes.cadastroEEdicaoCom')} />
    </PaginaComponente>
  );
}
