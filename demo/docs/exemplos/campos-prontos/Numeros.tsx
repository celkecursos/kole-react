import { useState } from 'react';
import { CampoData, CampoDataHora, CampoHora, CampoInteiro, CampoMoeda } from '../../../../src';

export default function Exemplo() {
  const [preco, setPreco] = useState<number | null>(1250.9);
  const [estoque, setEstoque] = useState<number | null>(12);
  const [data, setData] = useState('2026-07-01');
  const [hora, setHora] = useState('');
  const [agenda, setAgenda] = useState('');

  return (
    <div className="demo-grade-2">
      {/* moeda e inteiro trabalham com number, não com texto */}
      <CampoMoeda rotulo="Preço" valor={preco} aoMudar={setPreco} dica={`valor: ${preco ?? 'null'}`} />
      <CampoInteiro rotulo="Estoque" valor={estoque} aoMudar={setEstoque} />
      {/* datas em ISO: AAAA-MM-DD, HH:MM, AAAA-MM-DDTHH:MM */}
      <CampoData rotulo="Entrega" valor={data} aoMudar={setData} />
      <CampoHora rotulo="Horário" valor={hora} aoMudar={setHora} />
      <CampoDataHora rotulo="Agendamento" valor={agenda} aoMudar={setAgenda} />
    </div>
  );
}
