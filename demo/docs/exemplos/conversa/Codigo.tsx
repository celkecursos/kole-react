import { BlocoCodigo, Mensagem } from '../../../../src';

// a resposta em Markdown é renderizada pelo app; o BlocoCodigo entra no lugar do `code`
export default function Exemplo() {
  return (
    <Mensagem autor="assistente" nome="Assistente" avatar copiavel textoCopia="Faturamento por região">
      <p>
        O faturamento de outubro foi de <strong>R$ 1,28 milhão</strong>:
      </p>
      <table>
        <thead>
          <tr>
            <th>Região</th>
            <th className="is-num">Faturamento</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sudeste</td>
            <td className="is-num">R$ 612.400</td>
          </tr>
          <tr>
            <td>Sul</td>
            <td className="is-num">R$ 318.900</td>
          </tr>
        </tbody>
      </table>
      <ul>
        <li>O Sul ficou 9% acima da meta.</li>
        <li>
          Ticket médio: <code>R$ 459,90</code>.
        </li>
      </ul>
      <BlocoCodigo linguagem="sql" codigo={'SELECT regiao, SUM(valor_total)\n  FROM pedidos\n GROUP BY regiao;'} />
    </Mensagem>
  );
}
