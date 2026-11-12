import { useMemo, useState, type Key } from 'react';
import { Tabela, lerCampo, type Coluna, type Ordenacao } from '../../../../src';
import { PEDIDOS, type Pedido } from './dados';

const COLUNAS: Coluna<Pedido>[] = [
  { campo: 'numero', rotulo: 'Pedido', destaque: true, ordenavel: true },
  { campo: 'cliente', rotulo: 'Cliente', ordenavel: true },
  { campo: 'total', rotulo: 'Total', alinhamento: 'direita', ordenavel: true, formato: (v) => (v as number).toFixed(2) },
];

export default function Exemplo() {
  const [ordenacao, setOrdenacao] = useState<Ordenacao | null>({ campo: 'numero', direcao: 'asc' });
  const [pagina, setPagina] = useState(1);
  const [tamanho, setTamanho] = useState(5);
  const [selecionados, setSelecionados] = useState<Key[]>([]);

  // no app, ordenar e paginar costuma ser no servidor: aqui é no navegador
  const ordenados = useMemo(() => {
    if (!ordenacao) return PEDIDOS;
    const fator = ordenacao.direcao === 'asc' ? 1 : -1;
    return [...PEDIDOS].sort((a, b) => {
      const va = lerCampo(a, ordenacao.campo) as string | number;
      const vb = lerCampo(b, ordenacao.campo) as string | number;
      return va < vb ? -fator : va > vb ? fator : 0;
    });
  }, [ordenacao]);

  // clicar no cabeçalho alterna asc → desc
  const ordenar = (campo: string) =>
    setOrdenacao((o) => ({ campo, direcao: o?.campo === campo && o.direcao === 'asc' ? 'desc' : 'asc' }));

  return (
    <Tabela
      rotulo="Pedidos"
      colunas={COLUNAS}
      registros={ordenados.slice((pagina - 1) * tamanho, pagina * tamanho)}
      ordenacao={ordenacao}
      aoOrdenar={ordenar}
      selecao="multipla"
      selecionados={selecionados}
      aoMudarSelecao={setSelecionados}
      paginacao={{
        total: PEDIDOS.length,
        pagina,
        tamanho,
        tamanhoOpcoes: [5, 10, 20],
        aoMudarPagina: setPagina,
        aoMudarTamanho: (t) => {
          setTamanho(t);
          setPagina(1);
        },
      }}
    />
  );
}
