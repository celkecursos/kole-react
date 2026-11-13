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

function EditarOrcamento({ categoria, valor }: { categoria: Categoria; valor: number }) {
  const toast = useToast();
  const [novo, setNovo] = useState<number | null>(valor);
  return (
    <MenuSuspenso icone="pencil" aria-label={`Mudar o orçamento de ${categoria.nome}`} dica="Mudar o orçamento" semSeta aparencia="texto" severidade="secundario" tamanho="pequeno" alinhamento="fim" fechamento="fora">
      {(fechar) => (
        <form
          className="fin-orc-editar"
          onSubmit={(e) => {
            e.preventDefault();
            if (novo === null || novo < 0) return;
            acoes.definirOrcamento(categoria.id, novo);
            toast.ok('Orçamento atualizado', `${categoria.nome}: ${formatarMoeda(novo)} por mês`);
            fechar();
          }}
        >
          <CampoMoeda rotulo={`${categoria.nome} por mês`} valor={novo} aoMudar={setNovo} autoFocus />
          <Botao type="submit" rotulo="Salvar" tamanho="pequeno" />
        </form>
      )}
    </MenuSuspenso>
  );
}

export function Orcamento({ navegar }: { navegar: (r: string) => void }) {
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
      <CabecalhoFinancas titulo="Orçamento" icone="target" />

      <Indicadores>
        <Indicador rotulo="Orçado" icone="target" cor="var(--graf-1)" valor={moeda(orcado, { centavos: false })} descricao={meses === 1 ? 'Para o mês' : `Para ${meses} meses`} />
        <Indicador rotulo="Gasto" icone="trending-down" cor="var(--err-solid)" valor={moeda(gasto)} descricao={`${formatarPercentual(orcado ? (gasto / orcado) * 100 : 0, { casas: 0 })} do orçado, com o já agendado`} />
        <Indicador rotulo="Disponível" icone="wallet" cor="var(--ok-solid)" valor={moeda(Math.max(0, orcado - gasto))} descricao={emAndamento ? `${total - passados} dias até o fim do período` : rotuloPeriodo(periodo)} />
        <Indicador
          rotulo="Acima do limite"
          icone="circle-alert"
          cor={passaram.length ? 'var(--err-solid)' : 'var(--ok-solid)'}
          valor={String(passaram.length)}
          descricao={passaram.length ? passaram.map((l) => l.c.nome).join(', ') : 'Nenhuma categoria estourou'}
        />
      </Indicadores>

      <Card titulo="Por categoria" subtitulo={emAndamento ? `A marca na barra é o ritmo esperado: ${formatarPercentual(ritmo, { casas: 0 })} do período já passou` : undefined}>
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
                      {c.nome}
                    </button>
                    <small>
                      <Valor valor={g} forte /> de <Valor valor={limite} centavos={false} />
                    </small>
                  </div>
                  <Progresso valor={Math.min(100, parte * 100)} altura="sm" cor={cor} marcos={emAndamento ? [ritmo] : undefined} rotulo={`${c.nome}: ${formatarPercentual(parte * 100, { casas: 0 })} do orçamento`} />
                  <small className={`fin-orc-resta${resta < 0 ? ' is-passou' : ''}`}>
                    {limite === 0 ? 'Sem orçamento' : resta >= 0 ? <>Restam <Valor valor={resta} /></> : <>Passou <Valor valor={-resta} /></>}
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
          titulo="Gasto e orçamento por categoria"
          orientacao="horizontal"
          dados={linhas.map((l) => ({ categoria: l.c.nome, orcado: l.limite, gasto: l.gasto }))}
          eixoX={{ chave: 'categoria', tipo: 'categoria', rotulo: 'Categoria' }}
          eixoY={{ formatar: (v) => moeda(v, { compacto: true }) }}
          series={[
            { chave: 'orcado', rotulo: 'Orçado', cor: 'var(--t5)' },
            { chave: 'gasto', rotulo: 'Gasto', cor: 'var(--graf-1)' },
          ]}
          altura={Math.max(260, linhas.length * 44)}
        />
      </Card>
    </div>
  );
}
