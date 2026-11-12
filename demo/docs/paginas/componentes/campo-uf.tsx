import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="UF, cidade e tipo de pessoa"
      icone="map-pin"
      componente="CampoUf"
      outros={['CampoUfMultiplo', 'CampoCidade']}
      importar={['CampoTipoPessoa', 'type Municipio']}
      resumo="Campos de domínio já com as opções: as 27 UFs, a cidade da UF escolhida e pessoa física ou jurídica."
      notas={
        <ul className="doc-lista">
          <li>
            <C>CampoUf</C> guarda a sigla (<C>'PR'</C>); <C>exibicao="sigla"</C> mostra só a sigla na lista.
          </li>
          <li>
            <C>CampoCidade</C> com <C>buscarPorUf</C> sugere os municípios da UF; sem ele, aceita texto livre. O valor é o município
            escolhido ou o texto digitado.
          </li>
          <li>Ao trocar a UF, limpe a cidade, como no exemplo.</li>
          <li>
            <C>CampoTipoPessoa</C> guarda <C>'F'</C> ou <C>'J'</C> e aceita as props do <C>CampoSelect</C>. Combine com o{' '}
            <C>CampoCpfCnpj</C>.
          </li>
        </ul>
      }
    >
      <Exemplo id="campo-uf/Basico" titulo="Básico" />
    </PaginaComponente>
  );
}
