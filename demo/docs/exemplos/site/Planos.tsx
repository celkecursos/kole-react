import { Botao, CardDepoimento, CardPlano, FaixaChamada } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-pilha">
      <div className="demo-grade-2">
        <CardPlano nome="Essencial" preco="49" periodo="/mês" itens={['1 loja', 'Até 3 usuários', 'Pedidos e estoque']} acao={<Botao rotulo="Assinar" aparencia="contorno" bloco />} />
        <CardPlano
          nome="Completo"
          descricao="Para quem tem mais de uma loja."
          preco="99"
          periodo="/mês"
          destaque
          itens={['Lojas ilimitadas', 'Usuários ilimitados', 'Relatórios e integrações']}
          acao={<Botao rotulo="Assinar" severidade="destaque" bloco />}
        />
      </div>
      <CardDepoimento nome="Marta Oliveira" cargo="Dona do Empório Sabor" texto="Fechamos o caixa em 10 minutos, não mais em uma hora." nota={5} />
      <FaixaChamada titulo="Pronto para começar?" descricao="Teste grátis por 14 dias, sem cartão." acoes={<Botao rotulo="Criar conta" severidade="destaque" />} />
    </div>
  );
}
