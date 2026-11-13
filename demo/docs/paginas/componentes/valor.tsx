import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Valor e dinheiro"
      icone="banknote"
      componente="Valor"
      outros={['ProvedorValores', 'BotaoOcultarValores']}
      resumo="Valor em dinheiro com sinal e cor de entrada e saída, números alinhados em coluna e o “ocultar valores” dos apps de finanças. Junto vêm os formatadores de moeda e porcentagem."
      notas={
        <ul className="doc-lista">
          <li>
            Guarde os valores sempre positivos e diga o sentido com <C>tipo</C>: <C>receita</C> sai em verde com <C>+</C>, <C>despesa</C> em
            vermelho com <C>−</C>, <C>neutro</C> (transferência) sem cor. Sem <C>tipo</C>, <C>colorir</C> pinta pelo sinal do número.
          </li>
          <li>
            Todo <C>Valor</C> dentro de um <C>ProvedorValores</C> obedece ao <C>BotaoOcultarValores</C>. Com <C>chave</C>, a escolha fica
            lembrada no navegador. Para textos fora do componente (um <C>Indicador</C>, o eixo de um gráfico), leia{' '}
            <C>useValoresOcultos().ocultos</C>.
          </li>
          <li>
            <C>formatarMoeda</C> usa o sinal de menos tipográfico (<C>−R$ 80,00</C>), espaço inseparável depois do <C>R$</C> e nunca mostra{' '}
            <C>−0,00</C>. <C>dividirEmParcelas</C> fecha os centavos (a diferença vai para a primeira parcela) e <C>somarMoeda</C> soma em
            centavos, sem o erro do ponto flutuante.
          </li>
        </ul>
      }
    >
      <Exemplo id="valor/Basico" titulo="Sentido, tamanhos e ocultar" />
      <Exemplo id="valor/Formatar" titulo="Formatadores" />
    </PaginaComponente>
  );
}
