import { useMemo, useState } from 'react';
import {
  Botao,
  CabecalhoPagina,
  GraficoBarras,
  GraficoCombinado,
  GraficoDispersao,
  GraficoLinha,
  Indicador,
  Indicadores,
  MapaCalor,
  regressaoLinear,
  type CelulaMapaCalor,
  type DadoGrafico,
} from '../../../src';
import { Bloco } from '../Bloco';
import { PEDIDOS, TABELA_CATEGORIAS, TABELA_PAGAMENTOS } from '../dados';
import { useT } from '../../i18n/useT';
import { rico } from '../../i18n/rico';

/*
 * Dados FICTÍCIOS e fixos, no mesmo tema das páginas de pedidos e tabelas: um
 * sorteio com semente fixa, para o teste visual dar sempre o mesmo resultado.
 */
function sorteio(semente: number) {
  let s = semente >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const arred = (v: number, casas = 0) => Number(v.toFixed(casas));
const mes = (ano: number, m: number) => `${ano}-${String(m + 1).padStart(2, '0')}`;

const REAL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const CENTAVOS = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const emReais = (v: number) => REAL.format(v);
const emCentavos = (v: number) => CENTAVOS.format(v);

/** Peso de cada mês nas vendas: novembro e dezembro puxam, fevereiro é fraco. */
const SAZONAL = [0.86, 0.8, 0.95, 0.93, 1.02, 0.97, 0.99, 1.01, 0.96, 1.04, 1.22, 1.38];

// 24 meses, de julho de 2024 a junho de 2026
const MESES_24 = Array.from({ length: 24 }, (_, i) => ({ ano: 2024 + Math.floor((i + 6) / 12), m: (i + 6) % 12, i }));
const s1 = sorteio(11);
const MENSAL = MESES_24.map(({ ano, m, i }) => {
  const pedidos = Math.round((1180 + i * 22) * SAZONAL[m] * (0.93 + s1() * 0.14));
  const ticket = arred(168 + i * 1.6 + (s1() - 0.5) * 18, 2);
  return { mes: mes(ano, m), pedidos, ticket, faturamento: Math.round(pedidos * ticket), meta: Math.round((205000 + i * 4200) * SAZONAL[m]) };
});
const FATURAMENTO: DadoGrafico[] = MENSAL.map((d) => ({ mes: d.mes, faturamento: d.mes === '2025-04' ? null : d.faturamento, meta: d.meta }));
const MEDIA_MENSAL = Math.round(MENSAL.reduce((t, d) => t + d.faturamento, 0) / MENSAL.length);
const DESVIO_META: DadoGrafico[] = MENSAL.slice(-18).map((d) => ({ mes: d.mes, desvio: Math.round((d.faturamento - d.meta) / 1000) }));
const COMBINADO: DadoGrafico[] = MENSAL.slice(-12).map((d) => ({ mes: d.mes, pedidos: d.pedidos, ticket: d.ticket }));

// pedidos por forma de pagamento (nomes da tabela Formas de pagamento), com a tendência do Pix
const nomePagamento = (prefixo: string) => TABELA_PAGAMENTOS.find((p) => p.nome.startsWith(prefixo))?.nome ?? prefixo;
const PIX = nomePagamento('Pix');
const CREDITO = nomePagamento('Cartão de crédito à vista');
const BOLETO = nomePagamento('Boleto bancário');
const s2 = sorteio(3);
const PAGAMENTOS = MENSAL.map((d, i) => ({
  mes: d.mes,
  pix: Math.round(d.pedidos * (0.3 + i * 0.008) * (0.95 + s2() * 0.1)),
  credito: Math.round(d.pedidos * (0.38 - i * 0.002) * (0.95 + s2() * 0.1)),
  boleto: d.mes === '2025-09' ? null : Math.round(d.pedidos * (0.2 - i * 0.004) * (0.9 + s2() * 0.2)),
}));
const retaPix = regressaoLinear(PAGAMENTOS.map((d, i) => ({ x: i, y: d.pix })))!;
const POR_PAGAMENTO: DadoGrafico[] = PAGAMENTOS.map((d, i) => ({ ...d, tendencia: Math.round(retaPix.intercepto + retaPix.inclinacao * i) }));

// pedidos por dia: 120 dias, de janeiro a abril de 2026 (domingo vende menos)
const s3 = sorteio(5);
const POR_DIA: DadoGrafico[] = Array.from({ length: 120 }, (_, i) => {
  const d = new Date(2026, 0, 1 + i);
  const fator = d.getDay() === 0 ? 0.45 : d.getDay() === 6 ? 0.8 : 1;
  return {
    dia: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    pedidos: Math.round((38 + i * 0.12) * fator * (0.75 + s3() * 0.5)),
  };
});

// vendas por categoria (as seis ativas com mais produtos da tabela Categorias), 1º semestre de 2025 e de 2026
const s4 = sorteio(8);
const POR_CATEGORIA: DadoGrafico[] = (TABELA_CATEGORIAS.filter((c) => c.ativa)
  .sort((a, b) => b.produtos - a.produtos)
  .slice(0, 6)
  .map((c, i) => ({
    categoria: c.nome,
    ano2025: c.nome === 'Utilidades' ? null : arred(c.produtos * 0.62 * (0.85 + s4() * 0.3), 1),
    ano2026: arred(c.produtos * 0.62 * (1.02 + s4() * 0.3) + i, 1),
  })));

// clientes que mais compraram: somados dos pedidos da página Pedidos
const totalPorCliente = new Map<string, number>();
for (const p of PEDIDOS) if (p.situacao !== 'Cancelado') totalPorCliente.set(p.cliente, (totalPorCliente.get(p.cliente) ?? 0) + p.total);
const RANKING: DadoGrafico[] = [...totalPorCliente]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 7)
  .map(([cliente, total]) => ({ cliente, total: Math.round(total) }));
const MEDIA_RANKING = Math.round(RANKING.reduce((t, d) => t + (d.total as number), 0) / RANKING.length);

// produtos: preço × unidades vendidas no mês (quanto mais caro, menos sai)
const PRODUTOS = [
  ['Arroz tipo 1 — 5 kg', 27.9],
  ['Feijão carioca — 1 kg', 8.49],
  ['Café torrado — 500 g', 18.9],
  ['Detergente neutro — 500 ml', 2.79],
  ['Papel A4 — resma 500 fls', 32.5],
  ['Caneta esferográfica — cx 50', 44],
  ['Açúcar refinado — 1 kg', 4.99],
  ['Óleo de soja — 900 ml', 7.29],
  ['Leite integral — 1 l', 5.49],
  ['Sabão em pó — 1,6 kg', 21.9],
  ['Papel higiênico — 12 rolos', 19.9],
  ['Água mineral — fardo 12', 16.9],
  ['Refrigerante — 2 l', 9.99],
  ['Biscoito recheado — 140 g', 3.49],
  ['Macarrão espaguete — 500 g', 4.79],
  ['Molho de tomate — 340 g', 3.99],
  ['Desinfetante — 2 l', 12.9],
  ['Shampoo — 400 ml', 17.5],
  ['Creme dental — 90 g', 4.29],
  ['Ração para cães — 3 kg', 39.9],
  ['Caderno universitário', 24.9],
  ['Fita adesiva larga', 11.5],
] as const;
const s6 = sorteio(17);
const DISPERSAO: DadoGrafico[] = PRODUTOS.map(([produto, preco], i) => {
  const promocao = i % 5 === 2;
  const unidades = Math.round(Math.max(40, (980 - preco * 19) * (0.7 + s6() * 0.6) * (promocao ? 1.35 : 1)));
  return { produto, preco, unidades, promocao };
});
const retaPreco = regressaoLinear(DISPERSAO.map((d) => ({ x: d.preco as number, y: d.unidades as number })))!;

// pedidos por hora e dia da semana (soma do semestre); o sistema ficou em manutenção num domingo de madrugada
const DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];
const HORAS = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}h`);
/** Movimento por hora: quase nada de madrugada, picos no almoço e no fim da tarde. */
const POR_HORA = [2, 1, 1, 1, 1, 3, 8, 18, 34, 46, 52, 60, 66, 58, 50, 52, 58, 64, 70, 62, 44, 30, 16, 7];
const s7 = sorteio(19);
const CALOR: CelulaMapaCalor[] = HORAS.flatMap((hora, h) =>
  DIAS.map((dia, d) => {
    const fimDeSemana = d === 6 ? 0.5 : d === 5 ? 0.8 : 1;
    const valor = d === 6 && h >= 3 && h <= 4 ? null : Math.round(POR_HORA[h] * 4 * fimDeSemana * (0.8 + s7() * 0.4));
    return { linha: hora, coluna: dia, valor };
  }),
);

const ULTIMO = MENSAL[MENSAL.length - 1];
const PENULTIMO = MENSAL[MENSAL.length - 2];
const variacao = (atual: number, anterior: number) => arred(((atual - anterior) / anterior) * 100, 2);

export function PaginaGraficos() {
  const { t, tc } = useT();
  // nomes dos produtos e dias da semana no idioma (os dados ficam em pt-BR)
  const dispersao = useMemo(() => DISPERSAO.map((d) => ({ ...d, produto: tc(d.produto) })), [tc]);
  const calor = useMemo(() => CALOR.map((c) => ({ ...c, coluna: tc(c.coluna) })), [tc]);
  // trocar a key monta os gráficos de novo: é assim que a entrada animada se repete
  const [rodada, setRodada] = useState(0);
  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.graficos.titulo')} icone="chart-line" trilha>{t('paginas.graficos.textos.linhaBarrasCombinadoDispersao')}</CabecalhoPagina>

      <Indicadores>
        <Indicador
          rotulo={t('paginas.graficos.textos.faturamentoDeJunho')}
          valor={emReais(ULTIMO.faturamento)}
          icone="wallet"
          cor="var(--graf-1)"
          variacao={variacao(ULTIMO.faturamento, PENULTIMO.faturamento)}
          tendencia={MENSAL.slice(-12).map((d) => d.faturamento)}
          descricao={t('paginas.graficos.textos.ultimos12Meses')}
        />
        <Indicador
          rotulo={t('paginas.graficos.textos.pedidosEmJunho')}
          valor={ULTIMO.pedidos}
          icone="shopping-cart"
          cor="var(--graf-3)"
          variacao={variacao(ULTIMO.pedidos, PENULTIMO.pedidos)}
          tendencia={MENSAL.slice(-12).map((d) => d.pedidos)}
          descricao={t('paginas.graficos.textos.ultimos12Meses')}
        />
        <Indicador rotulo={t('paginas.graficos.textos.ticketMedio')} valor={emCentavos(ULTIMO.ticket)} icone="credit-card" cor="var(--graf-4)" tendencia={MENSAL.slice(-12).map((d) => d.ticket)} descricao={t('paginas.graficos.textos.porPedido')} />
        <Indicador rotulo={t('paginas.graficos.textos.semMinigrafico')} valor={TABELA_CATEGORIAS.length} icone="tags" descricao={t('paginas.graficos.textos.categoriasCadastradas')} />
      </Indicadores>

      <Bloco titulo={t('paginas.graficos.secoes.linha')} descricao={t('paginas.graficos.textos.faixasSombreadasFimDe')}>
        <GraficoLinha
          titulo={t('paginas.graficos.textos.faturamentoMensal')}
          descricao={t('paginas.graficos.textos.faturamentoDeJulhoDe')}
          dados={FATURAMENTO}
          eixoX={{ chave: 'mes', tipo: 'data', rotulo: t('paginas.graficos.textos.mes') }}
          eixoY={{ rotulo: t('paginas.graficos.textos.faturamento'), formatar: emReais }}
          series={[
            { chave: 'faturamento', rotulo: t('paginas.graficos.textos.faturamento') },
            { chave: 'meta', rotulo: t('paginas.graficos.textos.meta'), tracejada: true },
          ]}
          area
          faixas={[
            { de: '2024-11', ate: '2024-12', rotulo: t('paginas.graficos.textos.fimDeAno') },
            { de: '2025-11', ate: '2025-12', rotulo: t('paginas.graficos.textos.fimDeAno') },
          ]}
          referencias={[{ valor: MEDIA_MENSAL, rotulo: t('paginas.graficos.textos.mediaMensalValor', { valor: emReais(MEDIA_MENSAL) }) }]}
        />
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.graficos.secoes.variasSeriesETendencia')}>
          <GraficoLinha
            titulo={t('paginas.graficos.textos.pedidosPorFormaDe')}
            descricao={t('paginas.graficos.textos.pedidosPorMesPagos', { PIX: tc(PIX), CREDITO: tc(CREDITO), BOLETO: tc(BOLETO), PIX2: tc(PIX) })}
            dados={POR_PAGAMENTO}
            eixoX={{ chave: 'mes', tipo: 'data', rotulo: t('paginas.graficos.textos.mes') }}
            eixoY={{ rotulo: t('paginas.graficos.textos.pedidos') }}
            series={[
              { chave: 'pix', rotulo: tc(PIX) },
              { chave: 'credito', rotulo: tc(CREDITO) },
              { chave: 'boleto', rotulo: tc(BOLETO) },
              { chave: 'tendencia', rotulo: t('paginas.graficos.textos.tendenciaDoPix', { PIX: tc(PIX) }), tracejada: true, cor: 'var(--graf-texto)' },
            ]}
          />
        </Bloco>
        <Bloco titulo={t('paginas.graficos.secoes.muitosPontos')}>
          <GraficoLinha
            titulo={t('paginas.graficos.textos.pedidosPorDiaJaneiro')}
            descricao={t('paginas.graficos.textos.t120DiasDePedidos')}
            dados={POR_DIA}
            eixoX={{ chave: 'dia', tipo: 'data', rotulo: t('paginas.graficos.textos.dia') }}
            eixoY={{ rotulo: t('paginas.graficos.textos.pedidos') }}
            series={[{ chave: 'pedidos', rotulo: t('paginas.graficos.textos.pedidosDoDia') }]}
            area
          />
        </Bloco>
      </div>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.graficos.secoes.barrasAgrupadas')}>
          <GraficoBarras
            titulo={t('paginas.graficos.textos.vendasPorCategoriaNo')}
            descricao={t('paginas.graficos.textos.vendasDasSeisCategorias')}
            dados={POR_CATEGORIA}
            eixoX={{ chave: 'categoria', tipo: 'categoria', rotulo: t('paginas.graficos.textos.categoria') }}
            eixoY={{ rotulo: t('paginas.graficos.textos.vendas'), unidade: tc('mil R$') }}
            series={[
              { chave: 'ano2025', rotulo: '2025' },
              { chave: 'ano2026', rotulo: '2026' },
            ]}
            rotulosNasBarras
          />
        </Bloco>
        <Bloco titulo={t('paginas.graficos.secoes.barrasDivergentes')}>
          <GraficoBarras
            titulo={t('paginas.graficos.textos.faturamentoAcimaOuAbaixo')}
            descricao={t('paginas.graficos.textos.diferencaEntreOFaturamento')}
            dados={DESVIO_META}
            eixoX={{ chave: 'mes', tipo: 'data', rotulo: t('paginas.graficos.textos.mes') }}
            eixoY={{ rotulo: t('paginas.graficos.textos.diferenca'), unidade: tc('mil R$') }}
            series={[{ chave: 'desvio', rotulo: t('paginas.graficos.textos.diferencaParaAMeta') }]}
            divergente
          />
        </Bloco>
      </div>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.graficos.secoes.barrasHorizontaisRanking')}>
          <GraficoBarras
            titulo={t('paginas.graficos.textos.clientesQueMaisCompraram')}
            descricao={t('paginas.graficos.textos.osSeteClientesCom')}
            dados={RANKING}
            eixoX={{ chave: 'cliente', tipo: 'categoria', rotulo: t('paginas.graficos.textos.cliente') }}
            eixoY={{ rotulo: t('paginas.graficos.textos.totalEmPedidos'), formatar: emReais }}
            series={[{ chave: 'total', rotulo: t('paginas.graficos.textos.totalEmPedidos') }]}
            orientacao="horizontal"
            rotulosNasBarras
            referencias={[{ valor: MEDIA_RANKING, rotulo: t('paginas.graficos.textos.media') }]}
          />
        </Bloco>
        <Bloco titulo={t('paginas.graficos.secoes.combinadoDoisEixos')}>
          <GraficoCombinado
            titulo={t('paginas.graficos.textos.pedidosETicketMedio')}
            descricao={t('paginas.graficos.textos.quantidadeDePedidosEm')}
            dados={COMBINADO}
            eixoX={{ chave: 'mes', tipo: 'data', rotulo: t('paginas.graficos.textos.mes') }}
            eixoY={{ rotulo: t('paginas.graficos.textos.pedidos') }}
            eixoYDireito={{ rotulo: t('paginas.graficos.textos.ticketMedio'), formatar: emCentavos }}
            barras={[{ chave: 'pedidos', rotulo: t('paginas.graficos.textos.pedidos') }]}
            linhas={[{ chave: 'ticket', rotulo: t('paginas.graficos.textos.ticketMedio'), cor: 'var(--graf-2)' }]}
          />
        </Bloco>
      </div>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.graficos.secoes.dispersaoComRegressao')}>
          <GraficoDispersao
            titulo={t('paginas.graficos.textos.precoUnidadesVendidas')}
            descricao={t('paginas.graficos.textos.umPontoPorProduto')}
            dados={dispersao}
            eixoX={{ rotulo: t('paginas.graficos.textos.preco'), formatar: emCentavos }}
            eixoY={{ rotulo: t('paginas.graficos.textos.unidadesVendidas') }}
            chaveX="preco"
            chaveY="unidades"
            chaveRotulo="produto"
            chaveDestaque="promocao"
            rotuloPontos={tc("Produtos")}
            rotuloDestaque={t('paginas.graficos.textos.emPromocao')}
            regressao
            nota={t('paginas.graficos.textos.aCadaR100', { n: Math.abs(Math.round(retaPreco.inclinacao)) })}
          />
        </Bloco>
        <Bloco titulo={t('paginas.graficos.secoes.estados')}>
          <div className="demo-pilha">
            <GraficoLinha titulo={t('paginas.graficos.textos.carregando')} dados={[]} eixoX={{ chave: 'x', tipo: 'categoria' }} series={[{ chave: 'y', rotulo: 'Y' }]} carregando altura={120} />
            <GraficoBarras
              titulo={t('paginas.graficos.textos.pedidosCanceladosNoPeriodo')}
              dados={[]}
              eixoX={{ chave: 'x', tipo: 'categoria' }}
              series={[{ chave: 'y', rotulo: 'Y' }]}
              textoVazio={t('paginas.graficos.textos.nenhumPedidoCanceladoNo')}
            />
          </div>
        </Bloco>
      </div>

      <Bloco
        titulo={t('paginas.graficos.secoes.animacao')}
        descricao={
          rico(t('paginas.graficos.textos.comAnimacaoAsLinhas'))
        }
      >
        <div className="demo-linha">
          <Botao rotulo={t('paginas.graficos.textos.repetirAAnimacao')} icone="rotate-cw" severidade="secundario" tamanho="pequeno" onClick={() => setRodada((r) => r + 1)} />
        </div>
        <div key={rodada} className="demo-pilha">
          <Indicadores>
            <Indicador
              rotulo={t('paginas.graficos.textos.faturamentoDeJunho')}
              valor={emReais(ULTIMO.faturamento)}
              icone="wallet"
              cor="var(--graf-1)"
              tendencia={MENSAL.slice(-12).map((d) => d.faturamento)}
              animacao
              descricao={t('paginas.graficos.textos.ultimos12Meses')}
            />
            <Indicador
              rotulo={t('paginas.graficos.textos.pedidosEmJunho')}
              valor={ULTIMO.pedidos}
              icone="shopping-cart"
              cor="var(--graf-3)"
              tendencia={MENSAL.slice(-12).map((d) => d.pedidos)}
              animacao
              descricao={t('paginas.graficos.textos.ultimos12Meses')}
            />
          </Indicadores>
          <div className="demo-colunas">
            <GraficoCombinado
              titulo={t('paginas.graficos.textos.pedidosETicketMedio')}
              dados={COMBINADO}
              eixoX={{ chave: 'mes', tipo: 'data', rotulo: t('paginas.graficos.textos.mes') }}
              eixoY={{ rotulo: t('paginas.graficos.textos.pedidos') }}
              eixoYDireito={{ rotulo: t('paginas.graficos.textos.ticketMedio'), formatar: emCentavos }}
              barras={[{ chave: 'pedidos', rotulo: t('paginas.graficos.textos.pedidos') }]}
              linhas={[{ chave: 'ticket', rotulo: t('paginas.graficos.textos.ticketMedio'), cor: 'var(--graf-2)' }]}
              animacao
            />
            <GraficoBarras
              titulo={t('paginas.graficos.textos.faturamentoAcimaOuAbaixo')}
              dados={DESVIO_META}
              eixoX={{ chave: 'mes', tipo: 'data', rotulo: t('paginas.graficos.textos.mes') }}
              eixoY={{ rotulo: t('paginas.graficos.textos.diferenca'), unidade: tc('mil R$') }}
              series={[{ chave: 'desvio', rotulo: t('paginas.graficos.textos.diferencaParaAMeta') }]}
              divergente
              animacao
            />
            <GraficoBarras
              titulo={t('paginas.graficos.textos.clientesQueMaisCompraram')}
              dados={RANKING}
              eixoX={{ chave: 'cliente', tipo: 'categoria', rotulo: t('paginas.graficos.textos.cliente') }}
              eixoY={{ rotulo: t('paginas.graficos.textos.totalEmPedidos'), formatar: emReais }}
              series={[{ chave: 'total', rotulo: t('paginas.graficos.textos.totalEmPedidos') }]}
              orientacao="horizontal"
              rotulosNasBarras
              referencias={[{ valor: MEDIA_RANKING, rotulo: t('paginas.graficos.textos.media') }]}
              animacao
            />
            <GraficoDispersao
              titulo={t('paginas.graficos.textos.precoUnidadesVendidas')}
              dados={dispersao}
              eixoX={{ rotulo: t('paginas.graficos.textos.preco'), formatar: emCentavos }}
              eixoY={{ rotulo: t('paginas.graficos.textos.unidadesVendidas') }}
              chaveX="preco"
              chaveY="unidades"
              chaveRotulo="produto"
              chaveDestaque="promocao"
              rotuloPontos={tc("Produtos")}
              rotuloDestaque={t('paginas.graficos.textos.emPromocao')}
              regressao
              animacao
            />
          </div>
          <GraficoLinha
            titulo={t('paginas.graficos.textos.faturamentoMensal')}
            dados={FATURAMENTO}
            eixoX={{ chave: 'mes', tipo: 'data', rotulo: t('paginas.graficos.textos.mes') }}
            eixoY={{ rotulo: t('paginas.graficos.textos.faturamento'), formatar: emReais }}
            series={[
              { chave: 'faturamento', rotulo: t('paginas.graficos.textos.faturamento') },
              { chave: 'meta', rotulo: t('paginas.graficos.textos.meta'), tracejada: true },
            ]}
            area
            referencias={[{ valor: MEDIA_MENSAL, rotulo: t('paginas.graficos.textos.mediaMensalValor', { valor: emReais(MEDIA_MENSAL) }) }]}
            animacao
          />
        </div>
      </Bloco>

      <Bloco
        titulo={t('paginas.graficos.secoes.mapaDeCalor')}
        descricao={t('paginas.graficos.textos.pedidosPorHoraE')}
      >
        <MapaCalor
          titulo={t('paginas.graficos.textos.pedidosPorHoraE2')}
          descricao={t('paginas.graficos.textos.gradeDeHorasPor')}
          linhas={HORAS}
          colunas={DIAS.map(tc)}
          valores={calor}
          unidade={tc('pedidos')}
          rotuloLinhas={tc("Hora")}
          altura={360}
          animacao
        />
      </Bloco>
    </div>
  );
}
