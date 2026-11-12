import { Botao, TelaErro } from '../../../../src';

export default function Exemplo() {
  return (
    <TelaErro
      tela="contida"
      codigo={500}
      cor="err"
      titulo="Algo deu errado do nosso lado"
      descricao="Já fomos avisados. Tente de novo em alguns minutos."
      icone="triangle-alert"
      // detalhe: o identificador para o suporte encontrar o erro
      detalhe="Código do erro: 7f3a-91c2"
      acoes={<Botao rotulo="Tentar de novo" icone="refresh-cw" />}
    />
  );
}
