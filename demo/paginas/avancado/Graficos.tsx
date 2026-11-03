import {
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
const POR_CATEGORIA: DadoGrafico[] = TABELA_CATEGORIAS.filter((c) => c.ativa)
  .sort((a, b) => b.produtos - a.produtos)
  .slice(0, 6)
  .map((c, i) => ({
    categoria: c.nome,
    ano2025: c.nome === 'Utilidades' ? null : arred(c.produtos * 0.62 * (0.85 + s4() * 0.3), 1),
    ano2026: arred(c.produtos * 0.62 * (1.02 + s4() * 0.3) + i, 1),
  }));

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
  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Gráficos" icone="chart-line" trilha>
        Linha, barras, combinado, dispersão, mapa de calor e minigráfico no indicador, em SVG próprio. Dados fictícios de
        vendas, no tema das páginas de pedidos e tabelas.
      </CabecalhoPagina>

      <Indicadores>
        <Indicador
          rotulo="Faturamento de junho"
          valor={emReais(ULTIMO.faturamento)}
          icone="wallet"
          cor="var(--graf-1)"
          variacao={variacao(ULTIMO.faturamento, PENULTIMO.faturamento)}
          tendencia={MENSAL.slice(-12).map((d) => d.faturamento)}
          descricao="últimos 12 meses"
        />
        <Indicador
          rotulo="Pedidos em junho"
          valor={ULTIMO.pedidos}
          icone="shopping-cart"
          cor="var(--graf-3)"
          variacao={variacao(ULTIMO.pedidos, PENULTIMO.pedidos)}
          tendencia={MENSAL.slice(-12).map((d) => d.pedidos)}
          descricao="últimos 12 meses"
        />
        <Indicador rotulo="Ticket médio" valor={emCentavos(ULTIMO.ticket)} icone="credit-card" cor="var(--graf-4)" tendencia={MENSAL.slice(-12).map((d) => d.ticket)} descricao="por pedido" />
        <Indicador rotulo="Sem minigráfico" valor={TABELA_CATEGORIAS.length} icone="tags" descricao="categorias cadastradas" />
      </Indicadores>

      <Bloco titulo="Linha" descricao="Faixas sombreadas (fim de ano), referência (média) e falha no mês que não foi fechado.">
        <GraficoLinha
          titulo="Faturamento mensal"
          descricao="Faturamento de julho de 2024 a junho de 2026, com a meta do mês tracejada e a média mensal como referência. Abril de 2025 sem fechamento; novembro e dezembro sombreados."
          dados={FATURAMENTO}
          eixoX={{ chave: 'mes', tipo: 'data', rotulo: 'Mês' }}
          eixoY={{ rotulo: 'Faturamento', formatar: emReais }}
          series={[
            { chave: 'faturamento', rotulo: 'Faturamento' },
            { chave: 'meta', rotulo: 'Meta', tracejada: true },
          ]}
          area
          faixas={[
            { de: '2024-11', ate: '2024-12', rotulo: 'Fim de ano' },
            { de: '2025-11', ate: '2025-12', rotulo: 'Fim de ano' },
          ]}
          referencias={[{ valor: MEDIA_MENSAL, rotulo: `Média mensal (${emReais(MEDIA_MENSAL)})` }]}
        />
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo="Várias séries e tendência">
          <GraficoLinha
            titulo="Pedidos por forma de pagamento"
            descricao={`Pedidos por mês pagos com ${PIX}, ${CREDITO} e ${BOLETO}, com a tendência linear do ${PIX} tracejada. Setembro de 2025 sem dado do boleto.`}
            dados={POR_PAGAMENTO}
            eixoX={{ chave: 'mes', tipo: 'data', rotulo: 'Mês' }}
            eixoY={{ rotulo: 'Pedidos' }}
            series={[
              { chave: 'pix', rotulo: PIX },
              { chave: 'credito', rotulo: CREDITO },
              { chave: 'boleto', rotulo: BOLETO },
              { chave: 'tendencia', rotulo: `Tendência do ${PIX}`, tracejada: true, cor: 'var(--graf-texto)' },
            ]}
          />
        </Bloco>
        <Bloco titulo="Muitos pontos">
          <GraficoLinha
            titulo="Pedidos por dia, janeiro a abril de 2026"
            descricao="120 dias de pedidos; os vales são os domingos. Acima de 60 pontos, os marcadores somem."
            dados={POR_DIA}
            eixoX={{ chave: 'dia', tipo: 'data', rotulo: 'Dia' }}
            eixoY={{ rotulo: 'Pedidos' }}
            series={[{ chave: 'pedidos', rotulo: 'Pedidos do dia' }]}
            area
          />
        </Bloco>
      </div>

      <div className="demo-colunas">
        <Bloco titulo="Barras agrupadas">
          <GraficoBarras
            titulo="Vendas por categoria no 1º semestre"
            descricao="Vendas das seis categorias ativas com mais produtos, no 1º semestre de 2025 e de 2026, em mil reais. Utilidades sem venda em 2025."
            dados={POR_CATEGORIA}
            eixoX={{ chave: 'categoria', tipo: 'categoria', rotulo: 'Categoria' }}
            eixoY={{ rotulo: 'Vendas', unidade: 'mil R$' }}
            series={[
              { chave: 'ano2025', rotulo: '2025' },
              { chave: 'ano2026', rotulo: '2026' },
            ]}
            rotulosNasBarras
          />
        </Bloco>
        <Bloco titulo="Barras divergentes">
          <GraficoBarras
            titulo="Faturamento acima ou abaixo da meta"
            descricao="Diferença entre o faturamento e a meta de cada mês, de janeiro de 2025 a junho de 2026, em mil reais."
            dados={DESVIO_META}
            eixoX={{ chave: 'mes', tipo: 'data', rotulo: 'Mês' }}
            eixoY={{ rotulo: 'Diferença', unidade: 'mil R$' }}
            series={[{ chave: 'desvio', rotulo: 'Diferença para a meta' }]}
            divergente
          />
        </Bloco>
      </div>

      <div className="demo-colunas">
        <Bloco titulo="Barras horizontais (ranking)">
          <GraficoBarras
            titulo="Clientes que mais compraram"
            descricao="Os sete clientes com maior valor em pedidos não cancelados, somados da página Pedidos."
            dados={RANKING}
            eixoX={{ chave: 'cliente', tipo: 'categoria', rotulo: 'Cliente' }}
            eixoY={{ rotulo: 'Total em pedidos', formatar: emReais }}
            series={[{ chave: 'total', rotulo: 'Total em pedidos' }]}
            orientacao="horizontal"
            rotulosNasBarras
            referencias={[{ valor: MEDIA_RANKING, rotulo: 'Média' }]}
          />
        </Bloco>
        <Bloco titulo="Combinado (dois eixos)">
          <GraficoCombinado
            titulo="Pedidos e ticket médio"
            descricao="Quantidade de pedidos em barras, no eixo esquerdo, e ticket médio em linha, no eixo direito, de julho de 2025 a junho de 2026."
            dados={COMBINADO}
            eixoX={{ chave: 'mes', tipo: 'data', rotulo: 'Mês' }}
            eixoY={{ rotulo: 'Pedidos' }}
            eixoYDireito={{ rotulo: 'Ticket médio', formatar: emCentavos }}
            barras={[{ chave: 'pedidos', rotulo: 'Pedidos' }]}
            linhas={[{ chave: 'ticket', rotulo: 'Ticket médio', cor: 'var(--graf-2)' }]}
          />
        </Bloco>
      </div>

      <div className="demo-colunas">
        <Bloco titulo="Dispersão com regressão">
          <GraficoDispersao
            titulo="Preço × unidades vendidas"
            descricao="Um ponto por produto: preço no eixo horizontal e unidades vendidas no mês no vertical. Os produtos em promoção estão destacados."
            dados={DISPERSAO}
            eixoX={{ rotulo: 'Preço', formatar: emCentavos }}
            eixoY={{ rotulo: 'Unidades vendidas' }}
            chaveX="preco"
            chaveY="unidades"
            chaveRotulo="produto"
            chaveDestaque="promocao"
            rotuloPontos="Produtos"
            rotuloDestaque="Em promoção"
            regressao
            nota={`A cada R$ 1,00 a mais no preço, cerca de ${Math.abs(Math.round(retaPreco.inclinacao))} unidades a menos no mês. Outras estatísticas são calculadas pelo app e entram aqui, na nota.`}
          />
        </Bloco>
        <Bloco titulo="Estados">
          <div className="demo-pilha">
            <GraficoLinha titulo="Carregando" dados={[]} eixoX={{ chave: 'x', tipo: 'categoria' }} series={[{ chave: 'y', rotulo: 'Y' }]} carregando altura={120} />
            <GraficoBarras
              titulo="Pedidos cancelados no período"
              dados={[]}
              eixoX={{ chave: 'x', tipo: 'categoria' }}
              series={[{ chave: 'y', rotulo: 'Y' }]}
              textoVazio="Nenhum pedido cancelado no período escolhido."
            />
          </div>
        </Bloco>
      </div>

      <Bloco
        titulo="Mapa de calor"
        descricao="Pedidos por hora e dia da semana. A grade rola na vertical com os dias presos no topo; células hachuradas são horas sem registro."
      >
        <MapaCalor
          titulo="Pedidos por hora e dia da semana, 1º semestre de 2026"
          descricao="Grade de horas por dias da semana; quanto mais escura a célula, mais pedidos. Picos no almoço e no fim da tarde; domingo das 3h às 4h sem registro, com o sistema em manutenção."
          linhas={HORAS}
          colunas={DIAS}
          valores={CALOR}
          unidade="pedidos"
          rotuloLinhas="Hora"
          altura={360}
        />
      </Bloco>
    </div>
  );
}
