import { Botao, TelaErro } from '../../../../src';

export default function Exemplo() {
  return (
    // tela="contida": dentro de uma área; o padrão (cheia) ocupa a janela
    <TelaErro
      tela="contida"
      codigo={404}
      titulo="Página não encontrada"
      descricao="O endereço pode ter mudado ou a página foi removida."
      icone="search"
      acoes={
        <>
          <Botao rotulo="Voltar" icone="arrow-left" severidade="secundario" aparencia="contorno" />
          <Botao rotulo="Ir para o painel" icone="house" />
        </>
      }
    />
  );
}
