/** `null` = sem dado: a linha fica com uma falha, a barra some, a célula fica sem cor. Nunca vira zero. */
export type ValorGrafico = number | null;

export interface SerieGrafico {
  /** Campo de cada item de `dados`. */
  chave: string;
  /** Legenda e caixa de detalhes. */
  rotulo: string;
  /** Padrão: `--graf-1`, `--graf-2`… na ordem das séries. */
  cor?: string;
  /** Ex.: linha de tendência. */
  tracejada?: boolean;
  /** Só no `GraficoCombinado`. Padrão: barras no esquerdo, linhas no direito. */
  eixo?: 'esquerdo' | 'direito';
}

export interface EixoGrafico {
  /** Ex.: "Vendas". */
  rotulo?: string;
  /** Ex.: "mil R$"; aparece no eixo e na caixa de detalhes. */
  unidade?: string;
  formatar?: (valor: number) => string;
  minimo?: number;
  maximo?: number;
}

export interface EixoXGrafico {
  chave: string;
  /** `data` aceita `Date`, timestamp ou texto `aaaa-mm-dd` / `aaaa-mm`. */
  tipo: 'categoria' | 'data' | 'numero';
  /** Cabeçalho da coluna na tabela do "Ver dados" (padrão: Categoria, Data ou Valor). */
  rotulo?: string;
  formatar?: (valor: string | number | Date) => string;
}

/** Linha horizontal de referência (ex.: média mensal). */
export interface ReferenciaGrafico {
  valor: number;
  rotulo: string;
  eixo?: 'esquerdo' | 'direito';
}

/** Intervalo sombreado no eixo X (ex.: novembro e dezembro). `de` e `ate` são valores do eixo X. */
export interface FaixaGrafico {
  de: string | number;
  ate: string | number;
  rotulo?: string;
}

/** Item de `dados`: um objeto por ponto do eixo X. */
export type DadoGrafico = Record<string, unknown>;

/** Props comuns a todos os gráficos. */
export interface GraficoBaseProps {
  /** Nome acessível do gráfico (aparece acima dele). */
  titulo: string;
  /** Resumo em texto para leitor de tela (ex.: "Faturamento mensal de 2025, máximo em dezembro"). */
  descricao?: string;
  /** Altura da área do gráfico em px. Padrão `280`; a largura acompanha o container. */
  altura?: number;
  /** Padrão `true`. Clicar num item esconde ou mostra a série. */
  legenda?: boolean;
  carregando?: boolean;
  /** Sem dados, mostra o `Vazio` com este texto. */
  textoVazio?: string;
  /**
   * Anima a entrada do gráfico (linhas se desenham, barras crescem a partir do zero).
   * Só na primeira vez que aparece, não a cada atualização dos dados, e nunca com
   * "reduzir movimento" ligado no sistema. Padrão `false`.
   */
  animacao?: boolean;
  /** Padrão `true`. Botão que alterna entre o gráfico e uma `Tabela` com os mesmos valores. */
  verDados?: boolean;
  className?: string;
}
