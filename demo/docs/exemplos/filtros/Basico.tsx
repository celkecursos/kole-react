import { useState } from 'react';
import { CampoSelect, CampoTexto, Filtros, type FiltroAplicado } from '../../../../src';

type Filtro = { cliente: string; situacao: string | null };
const VAZIO: Filtro = { cliente: '', situacao: null };
const SITUACOES = [
  { valor: 'aberto', rotulo: 'Em aberto' },
  { valor: 'pago', rotulo: 'Pago' },
  { valor: 'cancelado', rotulo: 'Cancelado' },
];

export default function Exemplo() {
  // rascunho = o que está nos campos; aplicado = o que a listagem está usando
  const [rascunho, setRascunho] = useState<Filtro>(VAZIO);
  const [aplicado, setAplicado] = useState<Filtro>(VAZIO);

  const consultar = (f: Filtro = rascunho) => {
    setRascunho(f);
    setAplicado(f);
  };

  const chips: FiltroAplicado[] = [];
  if (aplicado.cliente)
    chips.push({ campo: 'Cliente', rotulo: aplicado.cliente, aoRemover: () => consultar({ ...aplicado, cliente: '' }) });
  if (aplicado.situacao)
    chips.push({
      campo: 'Situação',
      rotulo: SITUACOES.find((s) => s.valor === aplicado.situacao)!.rotulo,
      aoRemover: () => consultar({ ...aplicado, situacao: null }),
    });

  return (
    <Filtros
      aoConsultar={() => consultar()}
      aoLimpar={() => consultar(VAZIO)}
      alterado={JSON.stringify(rascunho) !== JSON.stringify(aplicado)}
      aplicados={chips}
    >
      <CampoTexto
        variante="inline"
        rotulo="Cliente"
        placeholder="Nome ou nº do pedido"
        valor={rascunho.cliente}
        aoMudar={(cliente) => setRascunho({ ...rascunho, cliente })}
      />
      <CampoSelect
        variante="inline"
        rotulo="Situação"
        placeholder="Todas"
        opcoes={SITUACOES}
        botaoLimpar
        valor={rascunho.situacao}
        aoMudar={(situacao) => setRascunho({ ...rascunho, situacao })}
      />
    </Filtros>
  );
}
