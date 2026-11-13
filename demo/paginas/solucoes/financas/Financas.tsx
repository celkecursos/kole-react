import { ProvedorValores } from '../../../../src';
import { ProvedorEditor } from './comum';
import { Contas } from './Contas';
import { FluxoCaixa } from './FluxoCaixa';
import { Lancamentos } from './Lancamentos';
import { Metas } from './Metas';
import { Orcamento } from './Orcamento';
import { PagarReceber } from './PagarReceber';
import { Relatorios } from './Relatorios';
import { VisaoGeral } from './VisaoGeral';
import { ROTAS } from './rotas';
import './financas.css';

export { SeletorEspaco } from './comum';
export { ehFinancas } from './rotas';

/** Solução de finanças pessoal e empresarial: uma tela por rota, com o espaço escolhido no topo. */
export function PaginaFinancas({ rota, navegar }: { rota: string; navegar: (r: string) => void }) {
  let pagina;
  if (rota === ROTAS.lancamentos) pagina = <Lancamentos />;
  else if (rota === ROTAS.contas) pagina = <Contas navegar={navegar} />;
  else if (rota === ROTAS.pagarReceber) pagina = <PagarReceber />;
  else if (rota === ROTAS.orcamento) pagina = <Orcamento navegar={navegar} />;
  else if (rota === ROTAS.metas) pagina = <Metas />;
  else if (rota === ROTAS.fluxoCaixa) pagina = <FluxoCaixa />;
  else if (rota === ROTAS.relatorios) pagina = <Relatorios />;
  else pagina = <VisaoGeral navegar={navegar} />;
  return (
    // o "ocultar valores" fica lembrado no navegador
    <ProvedorValores chave="demo-financas-ocultos">
      <ProvedorEditor>{pagina}</ProvedorEditor>
    </ProvedorValores>
  );
}
