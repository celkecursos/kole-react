import { useState } from 'react';
import {
  Botao,
  CampoMoeda,
  Card,
  GraficoBarras,
  Indicador,
  Indicadores,
  MenuSuspenso,
  Progresso,
  Valor,
  diasEntre,
  formatarMoeda,
  formatarPercentual,
  mesesDoPeriodo,
  noPeriodo,
  paraData,
  rotuloPeriodo,
  somarMoeda,
  useToast,
} from '../../../../src';
import { dia, hoje, type Categoria } from './dados';
import { CabecalhoFinancas, IconeCategoria, useMoeda } from './comum';
import { acoes, categoriasDo, doEspaco, noIntervalo, orcamentoDe, useFinancas } from './estado';
import { ROTAS } from './rotas';
import { useT } from '../../../i18n/useT';

function EditarOrcamento({ categoria, valor }: { categoria: Categoria; valor: number }) {
  const { t, idioma } = useT();
  const toast = useToast();
  const [novo, setNovo] = useState<number | null>(valor);
  return (
    <MenuSuspenso icone="pencil" aria-label={t('paginas.finOrcamento.textos.mudarOOrcamentoDe', { nome: categoria.nome })} dica={t('paginas.finOrcamento.textos.mudarOOrcamento')} semSeta aparencia="texto" severidade="secundario" tamanho="pequeno" alinhamento="fim" fechamento="fora">
      {(fechar) => (
        <form
          className="fin-orc-editar"
          onSubmit={(e) => {
            e.preventDefault();
            if (novo === null || novo < 0) return;
            acoes.definirOrcamento(categoria.id, novo);
            toast.ok(t('paginas.finOrcamento.textos.orcamentoAtualizado'), t('paginas.finOrcamento.textos.nomeValorPorMes', { nome: categoria.nome, valor: formatarMoeda(novo, { idioma }) }));
            fechar();
          }}
        >
          <CampoMoeda rotulo={t('paginas.finOrcamento.textos.nomePorMes', { nome: categoria.nome })} valor={novo} aoMudar={setNovo} autoFocus />
          <Botao type="submit" rotulo={t('paginas.finOrcamento.textos.salvar')} tamanho="pequeno" />
        </form>
      )}
    </MenuSuspenso>
  );
}

export function Orcamento({ navegar }: { navegar: (r: string) => void }) {
  const { t, idioma, tc } = useT();
  const { espaco, periodo, lancamentos, orcamentos } = useFinancas();
  const moeda = useMoeda();
  const meses = mesesDoPeriodo(periodo).length;
  const doPeriodo = noIntervalo(doEspaco(lancamentos, espaco), periodo);

  const linhas = categoriasDo(espaco, 'despesa').map((c) => {
    const gasto = somarMoeda(doPeriodo.filter((l) => l.tipo === 'despesa' && l.categoria === c.id).map((l) => l.valor));
    const mensal = orcamentoDe(c, orcamentos);
    const limite = mensal * meses;
    return { c, gasto, mensal, limite, parte: limite ? gasto / limite : 0 };
  });
  const orcado = somarMoeda(linhas.map((l) => l.limite));
  const gasto = somarMoeda(linhas.map((l) => l.gasto));
  const passaram = linhas.filter((l) => l.limite && l.gasto > l.limite);

  // o ritmo esperado: quanto do período já passou
  const emAndamento = noPeriodo(hoje(), periodo);
  const total = diasEntre(periodo.de, periodo.ate) + 1;
  const passados = emAndamento ? diasEntre(periodo.de, dia(0)) + 1 : paraData(periodo.ate) < hoje() ? total : 0;
  const ritmo = (passados / total) * 100;

  return (
    <div className="demo-pilha">
      <CabecalhoFinancas titulo={t('paginas.finOrcamento.titulo')} icone="target" />

      <Indicadores>
        <Indicador rotulo={t('paginas.finOrcamento.textos.orcado')} icone="target" cor="var(--graf-1)" valor={moeda(orcado, { centavos: false })} descricao={meses === 1 ? t('paginas.finOrcamento.textos.paraOMes') : t('paginas.finOrcamento.textos.paraMesesMeses', { meses })} />
        <Indicador rotulo={t('paginas.finOrcamento.textos.gasto')} icone="trending-down" cor="var(--err-solid)" valor={moeda(gasto)} descricao={t('paginas.finOrcamento.textos.valorDoOrcadoCom', { valor: formatarPercentual(orcado ? (gasto / orcado) * 100 : 0, { casas: 0 , idioma }) })} />
        <Indicador rotulo={t('paginas.finOrcamento.textos.disponivel')} icone="wallet" cor="var(--ok-solid)" valor={moeda(Math.max(0, orcado - gasto))} descricao={emAndamento ? t('paginas.finOrcamento.textos.vDiasAteO', { v: total - passados }) : rotuloPeriodo(periodo, { idioma })} />
        <Indicador
          rotulo={t('paginas.finOrcamento.textos.acimaDoLimite')}
          icone="circle-alert"
          cor={passaram.length ? 'var(--err-solid)' : 'var(--ok-solid)'}
          valor={String(passaram.length)}
          descricao={passaram.length ? passaram.map((l) => tc(l.c.nome)).join(', ') : t('paginas.finOrcamento.textos.nenhumaCategoriaEstourou')}
        />
      </Indicadores>

      <Card titulo={t('paginas.finOrcamento.secoes.porCategoria')} subtitulo={emAndamento ? t('paginas.finOrcamento.textos.aMarcaNaBarra', { valor: formatarPercentual(ritmo, { casas: 0 , idioma }) }) : undefined}>
        <ul className="fin-orc-tabela">
          {linhas.map(({ c, gasto: g, mensal, limite, parte }) => {
            const resta = somarMoeda([limite, -g]);
            // contas fixas saem no começo do mês: o ritmo é só referência, a cor segue o limite
            const cor = parte > 1 ? 'err' : parte >= 0.9 ? 'warn' : 'ok';
            return (
              <li key={c.id} className="fin-orc-linha">
                <IconeCategoria categoria={c} />
                <div className="fin-orc-corpo">
                  <div className="fin-orc-topo">
                    <button type="button" className="fin-link" onClick={() => {
                      acoes.pedirFiltro({ categoria: c.id });
                      navegar(ROTAS.lancamentos);
                    }}>
                      {tc(c.nome)}
                    </button>
                    <small>
                      <Valor valor={g} forte />{t('paginas.finOrcamento.textos.de')}<Valor valor={limite} centavos={false} />
                    </small>
                  </div>
                  <Progresso valor={Math.min(100, parte * 100)} altura="sm" cor={cor} marcos={emAndamento ? [ritmo] : undefined} rotulo={t('paginas.finOrcamento.textos.nomeValorDoOrcamento', { nome: c.nome, valor: formatarPercentual(parte * 100, { casas: 0 , idioma }) })} />
                  <small className={`fin-orc-resta${resta < 0 ? ' is-passou' : ''}`}>
                    {limite === 0 ? tc('Sem orçamento') : resta >= 0 ? <>{t('paginas.finOrcamento.textos.restam')}<Valor valor={resta} /></> : <>{t('paginas.finOrcamento.textos.passou')}<Valor valor={-resta} /></>}
                  </small>
                </div>
                <EditarOrcamento categoria={c} valor={mensal} />
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <GraficoBarras
          titulo={t('paginas.finOrcamento.textos.gastoEOrcamentoPor')}
          orientacao="horizontal"
          dados={linhas.map((l) => ({ categoria: l.c.nome, orcado: l.limite, gasto: l.gasto }))}
          eixoX={{ chave: 'categoria', tipo: 'categoria', rotulo: t('paginas.finOrcamento.textos.categoria') }}
          eixoY={{ formatar: (v) => moeda(v, { compacto: true }) }}
          series={[
            { chave: 'orcado', rotulo: t('paginas.finOrcamento.textos.orcado'), cor: 'var(--t5)' },
            { chave: 'gasto', rotulo: t('paginas.finOrcamento.textos.gasto'), cor: 'var(--graf-1)' },
          ]}
          altura={Math.max(260, linhas.length * 44)}
        />
      </Card>
    </div>
  );
}
