import { Tabela } from '../../../src';
import { Exemplo } from '../Exemplo';
import { PaginaGuia, Secao } from '../PaginaDoc';
import { useT } from '../../i18n/useT';
import { rico } from '../../i18n/rico';

const QUAL_USAR = [
  { id: 1, situacao: 'Salvar um formulário', usar: 'Form com salvando', porque: 'O Salvar gira e recusa clique repetido; o Cancelar fica desabilitado.' },
  { id: 2, situacao: 'Ação de um botão', usar: 'Botao ou AcaoLinha com carregando', porque: 'O botão continua focável e não dispara de novo.' },
  { id: 3, situacao: 'Abrir uma página ou card', usar: 'Skeleton', porque: 'A silhueta tem o formato do conteúdo: a página não pula.' },
  { id: 4, situacao: 'Primeira carga de lista', usar: 'Tabela / ListaCards com carregando', porque: 'Silhuetas no lugar das linhas, já prontas.' },
  { id: 5, situacao: 'Paginar, ordenar, filtrar', usar: 'Tabela / ListaCards com atualizando', porque: 'Mantém os dados atuais esmaecidos, sem piscar.' },
  { id: 6, situacao: 'Área sem formato conhecido', usar: 'Carregando', porque: 'Mensagem e animação no lugar da área.' },
  { id: 7, situacao: 'Nada na tela pode ser usado', usar: 'Carregando bloqueante', porque: 'Cobre a tela e segura o foco até terminar.' },
  { id: 8, situacao: 'Sabe quanto falta', usar: 'Progresso', porque: 'Upload e importação: a pessoa vê o andamento.' },
  { id: 9, situacao: 'Cards de painel e gráficos', usar: 'Indicador / gráficos com carregando', porque: 'Cada card carrega sozinho; o painel aparece aos poucos.' },
  { id: 10, situacao: 'Trecho pequeno, inline', usar: 'Girador', porque: 'Indicador avulso, com rótulo para leitor de tela.' },
];

export function DocCarregamento() {
  const { t } = useT();
  return (
    <PaginaGuia
      pagina="carregamento"
      icone="loader-circle"
    >
      <Secao id="qual-usar" titulo={t('docs.carregamento.secoes.qualUsar')}>
        <Tabela
          rotulo={t('docs.carregamento.textos.qualLoadingUsarEm')}
          registros={QUAL_USAR}
          colunas={[
            { campo: 'situacao', rotulo: t('docs.carregamento.textos.situacao'), destaque: true },
            { campo: 'usar', rotulo: t('docs.carregamento.textos.use') },
            { campo: 'porque', rotulo: t('docs.carregamento.textos.porQue') },
          ]}
        />
        <p className="doc-p">{t('docs.carregamento.textos.regraGeralPrefiraO')}</p>
      </Secao>

      <Secao id="formulario" titulo={t('docs.carregamento.secoes.formulario')}>
        <Exemplo id="carregamento/Formulario" titulo={t('docs.carregamento.secoes.formularioSalvando')}>{rico(t('docs.carregamento.textos.cliqueEmSalvarSalvando'))}</Exemplo>
        <Exemplo id="carregamento/Botao" titulo={t('docs.carregamento.secoes.botaoEAcaoDe')}>{rico(t('docs.carregamento.textos.paraAcoesForaDe'))}</Exemplo>
      </Secao>

      <Secao id="pagina" titulo={t('docs.carregamento.secoes.pagina')}>
        <Exemplo id="carregamento/Pagina" titulo={t('docs.carregamento.secoes.silhuetaDoConteudo')}>{rico(t('docs.carregamento.textos.skeletonNoFormatoDos'))}</Exemplo>
        <Exemplo id="carregamento/Area" titulo={t('docs.carregamento.secoes.areaETelaInteira')}>{rico(t('docs.carregamento.textos.carregandoNumaAreaQuando'))}</Exemplo>
      </Secao>

      <Secao id="listas" titulo={t('docs.carregamento.secoes.listas')}>
        <Exemplo id="carregamento/Lista" titulo={t('docs.carregamento.secoes.primeiraCargaEPaginacao')}>{rico(t('docs.carregamento.textos.carregandoSoNaPrimeira'))}</Exemplo>
      </Secao>

      <Secao id="andamento" titulo={t('docs.carregamento.secoes.andamento')}>
        <Exemplo id="carregamento/Progresso" titulo={t('docs.carregamento.secoes.comProgresso')}>{t('docs.carregamento.textos.quandoDaParaMedir')}</Exemplo>
        <Exemplo id="carregamento/Painel" titulo={t('docs.carregamento.secoes.indicadoresEGirador')} />
      </Secao>

      <Secao id="acessibilidade" titulo={t('docs.carregamento.secoes.acessibilidade')}>
        <ul className="doc-lista">
          <li>{rico(t('docs.carregamento.textos.carregandoEGiradorTem'))}</li>
          <li>{rico(t('docs.carregamento.textos.skeletonEDecorativoMarque'))}</li>
          <li>{rico(t('docs.carregamento.textos.botaoComCarregandoGanha'))}</li>
          <li>{t('docs.carregamento.textos.depoisDeCarregarAvise')}</li>
        </ul>
      </Secao>
    </PaginaGuia>
  );
}
