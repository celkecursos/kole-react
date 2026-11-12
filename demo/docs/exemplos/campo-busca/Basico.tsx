import { useState } from 'react';
import { CampoBusca } from '../../../../src';

interface Cliente {
  id: number;
  nome: string;
  cidade: string;
}

const CLIENTES: Cliente[] = [
  { id: 1, nome: 'Mercado Bom Preço', cidade: 'Curitiba' },
  { id: 2, nome: 'Padaria Pão Quente', cidade: 'Londrina' },
  { id: 3, nome: 'Mercearia do Bairro', cidade: 'Maringá' },
  { id: 4, nome: 'Supermercado Central', cidade: 'Cascavel' },
];

// no app, aqui vai a chamada à API: fetch(`/api/clientes?busca=${termo}`)
const buscarClientes = (termo: string) =>
  new Promise<Cliente[]>((ok) =>
    setTimeout(() => ok(CLIENTES.filter((c) => c.nome.toLowerCase().includes(termo.toLowerCase()))), 400),
  );

export default function Exemplo() {
  const [cliente, setCliente] = useState<Cliente | null>(null);

  return (
    <div className="demo-grade-2">
      <CampoBusca<Cliente>
        rotulo="Cliente"
        placeholder="Digite o nome"
        buscar={buscarClientes}
        paraRotulo={(c) => c.nome}
        paraDetalhe={(c) => c.cidade}
        valor={cliente}
        aoMudar={setCliente}
      />
      <code className="demo-util-res">valor: {cliente ? JSON.stringify(cliente) : 'null'}</code>
    </div>
  );
}
