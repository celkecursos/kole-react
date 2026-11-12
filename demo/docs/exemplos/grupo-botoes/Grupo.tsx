import { Botao, GrupoBotoes } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-linha">
      {/* severidade, aparencia, formato e tamanho do grupo viram o padrão dos botões de dentro */}
      <GrupoBotoes rotulo="Formatação" aparencia="contorno" formato="retangulo">
        <Botao icone="arrow-left" aria-label="Voltar" dica="Voltar" />
        <Botao rotulo="Hoje" />
        <Botao icone="arrow-right" aria-label="Avançar" dica="Avançar" />
      </GrupoBotoes>
      <GrupoBotoes rotulo="Exportar" severidade="secundario" tamanho="pequeno">
        <Botao rotulo="PDF" icone="file-text" />
        <Botao rotulo="Planilha" icone="file-spreadsheet" />
        <Botao rotulo="Imprimir" icone="printer" />
      </GrupoBotoes>
    </div>
  );
}
