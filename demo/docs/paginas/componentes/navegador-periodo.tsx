import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Navegador de período"
      icone="calendar-range"
      componente="NavegadorPeriodo"
      tipos={['Periodo', 'AtalhoPeriodo']}
      importar={['periodoDe', 'type Periodo']}
      resumo="“‹ Novembro de 2026 ›”: as setas andam de mês em mês (ou trimestre, ano, intervalo), e o rótulo abre atalhos e um intervalo livre de/até. Para relatórios, extratos e painéis."
      notas={
        <ul className="doc-lista">
          <li>
            <C>Periodo</C> é <C>{'{ tipo, de, ate }'}</C> com datas <C>AAAA-MM-DD</C> no fuso local, as mesmas do <C>CampoData</C>. Mande{' '}
            <C>de</C> e <C>ate</C> direto para a API.
          </li>
          <li>
            Utilitários: <C>periodoDe('mes' | 'trimestre' | 'ano', data)</C>, <C>moverPeriodo(p, passos)</C> (o personalizado anda pelo próprio
            tamanho), <C>noPeriodo(data, p)</C>, <C>rotuloPeriodo(p)</C>, <C>mesesDoPeriodo(p)</C> e <C>dataIso(date)</C>.
          </li>
          <li>
            <C>atalhos</C> troca a lista do painel (ex.: “Safra 2025/26”); <C>{'personalizado={false}'}</C> tira o intervalo livre.
          </li>
        </ul>
      }
    >
      <Exemplo id="navegador-periodo/Basico" titulo="Mês a mês, atalhos e intervalo" />
    </PaginaComponente>
  );
}
