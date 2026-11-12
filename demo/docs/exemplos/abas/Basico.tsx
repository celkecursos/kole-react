import { Aba, Abas, Detalhes } from '../../../../src';

export default function Exemplo() {
  return (
    <Abas rotulo="Dados do cliente">
      <Aba valor="geral" rotulo="Geral" icone="user">
        <div className="demo-grade">
          <Detalhes rotulo="Nome" valor="Mercado Bom Preço" />
          <Detalhes rotulo="CNPJ" valor="12.345.678/0001-95" />
        </div>
      </Aba>
      <Aba valor="enderecos" rotulo="Endereços" icone="map-pin">
        Rua das Flores, 120 — Curitiba/PR
      </Aba>
      {/* pendentes: chip âmbar com o número de pendências */}
      <Aba valor="documentos" rotulo="Documentos" icone="paperclip" pendentes={2}>
        Dois documentos aguardam envio.
      </Aba>
      <Aba valor="historico" rotulo="Histórico" icone="history" desabilitada>
        —
      </Aba>
    </Abas>
  );
}
