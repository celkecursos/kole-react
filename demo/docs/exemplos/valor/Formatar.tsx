import { Fragment } from 'react';
import { dividirEmParcelas, formatarMoeda, formatarPercentual, somarMoeda, variacaoPercentual } from '../../../../src';

const LINHAS: [string, string][] = [
  ["formatarMoeda(1234.5)", formatarMoeda(1234.5)],
  ["formatarMoeda(-80)", formatarMoeda(-80)],
  ["formatarMoeda(10, { sinal: true })", formatarMoeda(10, { sinal: true })],
  ["formatarMoeda(12400, { compacto: true })", formatarMoeda(12400, { compacto: true })],
  ["formatarMoeda(99.9, { moeda: 'USD' })", formatarMoeda(99.9, { moeda: 'USD' })],
  ["formatarPercentual(12.5, { sinal: true })", formatarPercentual(12.5, { sinal: true })],
  ["variacaoPercentual(12, 10)", String(variacaoPercentual(12, 10))],
  ["dividirEmParcelas(100, 3)", dividirEmParcelas(100, 3).join(' · ')],
  ["somarMoeda([0.1, 0.2])", String(somarMoeda([0.1, 0.2]))],
];

export default function Exemplo() {
  return (
    <div className="demo-util">
      {LINHAS.map(([codigo, res]) => (
        <Fragment key={codigo}>
          <code>{codigo}</code>
          <div className="demo-util-res">{res}</div>
        </Fragment>
      ))}
    </div>
  );
}
