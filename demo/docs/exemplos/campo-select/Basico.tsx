import { useState } from 'react';
import { CampoSelect, CampoSelectMultiplo, type Opcao } from '../../../../src';

const PAGAMENTOS: Opcao[] = [
  { valor: 'pix', rotulo: 'Pix' },
  { valor: 'boleto', rotulo: 'Boleto' },
  { valor: 'cartao', rotulo: 'Cartão de crédito' },
  { valor: 'dinheiro', rotulo: 'Dinheiro', desabilitada: true },
];

const CATEGORIAS: Opcao[] = ['Bebidas', 'Limpeza', 'Hortifrúti', 'Padaria', 'Açougue', 'Frios'].map((c) => ({
  valor: c.toLowerCase(),
  rotulo: c,
}));

export default function Exemplo() {
  const [pagamento, setPagamento] = useState<string | null>('pix');
  const [categorias, setCategorias] = useState<string[]>(['bebidas']);

  return (
    <div className="demo-grade-2">
      <CampoSelect rotulo="Forma de pagamento" opcoes={PAGAMENTOS} valor={pagamento} aoMudar={setPagamento} botaoLimpar />
      <CampoSelectMultiplo
        rotulo="Categorias"
        opcoes={CATEGORIAS}
        valor={categorias}
        aoMudar={setCategorias}
        comBusca
        placeholder="Todas"
      />
    </div>
  );
}
