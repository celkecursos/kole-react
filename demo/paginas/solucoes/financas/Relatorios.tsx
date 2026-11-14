import { useState, type ReactNode } from 'react';
import { Botao, Card, GraficoBarras, Icone, dataIso, formatarMoeda, formatarPercentual, mesesDoPeriodo, paraData, somarMoeda, useToast } from '../../../../src';
import type { GrupoDre, Lancamento } from './dados';
import { CabecalhoFinancas, useMoeda } from './comum';
import { categoriasDo, doEspaco, noIntervalo, useFinancas } from './estado';
import { useT } from '../../../i18n/useT';

const MES = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' });

interface Linha {
  id: string;
  rotulo: string;
  /** Um valor por mês (o total é a soma). */
  valores: number[];
  tipo: 'grupo' | 'item' | 'subtotal' | 'total' | 'percentual';
  /** Sinal mostrado antes do nome: (−) dedução, (=) subtotal. */
  sinal?: string;
  filhos?: Linha[];
}

const soma = (linhas: Linha[], n: number) => Array.from({ length: n }, (_, i) => somarMoeda(linhas.map((l) => l.valores[i])));
const menos = (a: number[], b: number[]) => a.map((v, i) => somarMoeda([v, -b[i]]));

/** As colunas: os meses do período, ou os 6 que terminam nele quando o período é um mês só. */
function mesesDoRelatorio(p: { tipo: string; de: string; ate: string }) {
  const lista = mesesDoPeriodo({ tipo: 'personalizado', de: p.de, ate: p.ate });
  if (lista.length > 1) return lista;
  const d = paraData(p.de);
  return Array.from({ length: 6 }, (_, i) => dataIso(new Date(d.getFullYear(), d.getMonth() - 5 + i, 1)));
}

export function Relatorios() {
  const { t } = useT();
  const { espaco, periodo, lancamentos } = useFinancas();
  const moeda = useMoeda();
  const toast = useToast();
  const empresa = espaco === 'empresa';
  const [abertos, setAbertos] = useState<ReadonlySet<string>>(new Set());
  const meses = mesesDoRelatorio(periodo);
  const n = meses.length;
  const intervalos = meses.map((m) => {
    const d = paraData(m);
    return { de: m, ate: dataIso(new Date(d.getFullYear(), d.getMonth() + 1, 0)) };
  });
  const todos = doEspaco(lancamentos, espaco);
  // regime de competência: vale a data do lançamento, pago ou não
  const porMes = intervalos.map((i) => noIntervalo(todos, i));

  const itens = (filtro: (cat: { id: string; tipo: string; dre?: GrupoDre }) => boolean, tipo: 'receita' | 'despesa'): Linha[] =>
    categoriasDo(espaco, tipo)
      .filter(filtro)
      .map((c) => ({
        id: c.id,
        rotulo: c.nome,
        tipo: 'item' as const,
        valores: porMes.map((ls) => somarMoeda(ls.filter((l: Lancamento) => l.categoria === c.id).map((l) => l.valor))),
      }));
  const grupo = (id: string, rotulo: string, filhos: Linha[], sinal?: string): Linha => ({ id, rotulo, sinal, tipo: 'grupo', filhos, valores: soma(filhos, n) });

  let linhas: Linha[];
  if (empresa) {
    const receita = grupo('receita', 'Receita bruta', itens((c) => c.dre === 'receita', 'receita'));
    const deducoes = grupo('deducoes', 'Deduções e impostos', itens((c) => c.dre === 'deducao', 'despesa'), '(−)');
    const liquida: Linha = { id: 'liquida', rotulo: 'Receita líquida', sinal: '(=)', tipo: 'subtotal', valores: menos(receita.valores, deducoes.valores) };
    const custos = grupo('custos', 'Custos dos serviços e produtos', itens((c) => c.dre === 'custo', 'despesa'), '(−)');
    const bruto: Linha = { id: 'bruto', rotulo: 'Lucro bruto', sinal: '(=)', tipo: 'subtotal', valores: menos(liquida.valores, custos.valores) };
    const despesas = grupo('despesas', 'Despesas operacionais', itens((c) => c.dre === 'despesa', 'despesa'), '(−)');
    const operacional: Linha = { id: 'operacional', rotulo: 'Resultado operacional', sinal: '(=)', tipo: 'subtotal', valores: menos(bruto.valores, despesas.valores) };
    const recFin = itens((c) => c.dre === 'financeiro', 'receita');
    const despFin = itens((c) => c.dre === 'financeiro', 'despesa').map((l) => ({ ...l, valores: l.valores.map((v) => -v) }));
    const financeiro = grupo('financeiro', 'Resultado financeiro', [...recFin, ...despFin], '(±)');
    const liquido: Linha = { id: 'liquido', rotulo: 'Resultado líquido', sinal: '(=)', tipo: 'total', valores: soma([operacional, financeiro], n) };
    const margem: Linha = { id: 'margem', rotulo: 'Margem líquida', tipo: 'percentual', valores: liquido.valores.map((v, i) => (receita.valores[i] ? (v / receita.valores[i]) * 100 : 0)) };
    linhas = [receita, deducoes, liquida, custos, bruto, despesas, operacional, financeiro, liquido, margem];
  } else {
    const receitas = grupo('receitas', 'Receitas', itens(() => true, 'receita'));
    const despesas = grupo('despesas', 'Despesas', itens(() => true, 'despesa'), '(−)');
    const resultado: Linha = { id: 'resultado', rotulo: 'Sobrou no mês', sinal: '(=)', tipo: 'total', valores: menos(receitas.valores, despesas.valores) };
    const taxa: Linha = { id: 'taxa', rotulo: 'Taxa de poupança', tipo: 'percentual', valores: resultado.valores.map((v, i) => (receitas.valores[i] ? (v / receitas.valores[i]) * 100 : 0)) };
    linhas = [receitas, despesas, resultado, taxa];
  }
  const base = linhas[0];
  const totalBase = somarMoeda(base.valores);
  const final = linhas.find((l) => l.tipo === 'total')!;
  const total = (l: Linha) => (l.tipo === 'percentual' ? (totalBase ? (somarMoeda(final.valores) / totalBase) * 100 : 0) : somarMoeda(l.valores));

  const alternar = (id: string) =>
    setAbertos((a) => {
      const x = new Set(a);
      if (x.has(id)) x.delete(id);
      else x.add(id);
      return x;
    });
  const todasAbertas = linhas.filter((l) => l.filhos).every((l) => abertos.has(l.id));

  const celula = (l: Linha, v: number) => (l.tipo === 'percentual' ? formatarPercentual(v) : moeda(v, { centavos: false }));

  const exportar = () => {
    const nomes = meses.map((m) => MES.format(paraData(m)));
    const csv = (v: number, l: Linha) => (l.tipo === 'percentual' ? formatarPercentual(v) : formatarMoeda(v, { semSimbolo: true }));
    const planas = linhas.flatMap((l) => [l, ...(l.filhos ?? [])]);
    const conteudo = [
      ['Linha', ...nomes, 'Total'].join(';'),
      ...planas.map((l) => [`${l.tipo === 'item' ? '   ' : ''}${l.sinal ? `${l.sinal} ` : ''}${l.rotulo}`, ...l.valores.map((v) => csv(v, l)), csv(total(l), l)].map((c) => `"${c}"`).join(';')),
    ].join('\r\n');
    // BOM: o Excel abre os acentos certos
    const url = URL.createObjectURL(new Blob(['﻿', conteudo], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${empresa ? 'dre' : 'resumo-por-categoria'}-${meses[0].slice(0, 7)}-a-${meses[n - 1].slice(0, 7)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.ok('Planilha gerada', a.download);
  };

  const linhaTabela = (l: Linha, filho = false): ReactNode => {
    const aberto = abertos.has(l.id);
    const t = total(l);
    return (
      <tr key={l.id} className={`fin-dre-${l.tipo}${filho ? ' fin-dre-filho' : ''}`}>
        <th scope="row">
          {l.filhos ? (
            <button type="button" className="fin-dre-abrir" aria-expanded={aberto} onClick={() => alternar(l.id)}>
              <Icone icone={aberto ? 'chevron-down' : 'chevron-right'} />
              {l.sinal && <span className="fin-dre-sinal">{l.sinal}</span>}
              {l.rotulo}
            </button>
          ) : (
            <span className="fin-dre-nome">
              {l.sinal && <span className="fin-dre-sinal">{l.sinal}</span>}
              {l.rotulo}
            </span>
          )}
        </th>
        {l.valores.map((v, i) => (
          <td key={i} className={v < 0 && l.tipo !== 'item' ? 'is-neg' : undefined}>
            {celula(l, v)}
          </td>
        ))}
        <td className={`fin-dre-total${t < 0 && l.tipo !== 'item' ? ' is-neg' : ''}`}>{celula(l, t)}</td>
        <td className="fin-dre-av">{l.tipo === 'percentual' || !totalBase ? '' : formatarPercentual((t / totalBase) * 100)}</td>
      </tr>
    );
  };

  return (
    <div className="demo-pilha">
      <CabecalhoFinancas titulo={empresa ? t('paginas.finRelatorios.textos.dre') : t('paginas.finRelatorios.titulo')} icone="file-spreadsheet" acoes={<Botao rotulo="Exportar CSV" icone="download" aparencia="contorno" severidade="secundario" onClick={exportar} />}>
        {empresa
          ? 'Demonstração do resultado pelo regime de competência: cada lançamento conta no mês da sua data, pago ou não. Transferências entre contas ficam de fora.'
          : 'Receitas e despesas de cada categoria, mês a mês. Transferências entre as suas contas ficam de fora.'}
      </CabecalhoFinancas>

      <Card corpoSemEspaco>
        <div className="fin-dre-barra">
          <strong>{empresa ? 'Demonstração do resultado' : 'Resumo por categoria'}</strong>
          <Botao
            rotulo={todasAbertas ? 'Recolher tudo' : 'Abrir tudo'}
            icone={todasAbertas ? 'chevrons-left' : 'chevrons-right'}
            aparencia="texto"
            severidade="secundario"
            tamanho="pequeno"
            onClick={() => setAbertos(todasAbertas ? new Set() : new Set(linhas.filter((l) => l.filhos).map((l) => l.id)))}
          />
        </div>
        <div className="fin-dre-rolagem" tabIndex={0} role="region" aria-label="Tabela do relatório (role para o lado)">
          <table className="fin-dre">
            <thead>
              <tr>
                <th scope="col">{empresa ? 'Conta' : 'Categoria'}</th>
                {meses.map((m) => (
                  <th key={m} scope="col">
                    {MES.format(paraData(m))}
                  </th>
                ))}
                <th scope="col">Total</th>
                <th scope="col" title="Análise vertical: participação sobre a primeira linha">
                  AV%
                </th>
              </tr>
            </thead>
            <tbody>{linhas.map((l) => [linhaTabela(l), ...(abertos.has(l.id) ? (l.filhos ?? []).map((f) => linhaTabela(f, true)) : [])])}</tbody>
          </table>
        </div>
      </Card>

      <Card>
        <GraficoBarras
          titulo={empresa ? 'Resultado líquido por mês' : 'Quanto sobrou em cada mês'}
          dados={meses.map((m, i) => ({ mes: m.slice(0, 7), resultado: final.valores[i] }))}
          eixoX={{ chave: 'mes', tipo: 'data', rotulo: 'Mês' }}
          eixoY={{ formatar: (v) => moeda(v, { compacto: true }) }}
          series={[{ chave: 'resultado', rotulo: final.rotulo }]}
          divergente
          rotulosNasBarras
          altura={240}
        />
      </Card>
    </div>
  );
}
