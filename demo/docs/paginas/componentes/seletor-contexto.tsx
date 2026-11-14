import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="seletorContexto"
      icone="building-2"
      componente="SeletorContexto"
      tipos={['OpcaoContexto']}
      notas={
        <ul className="doc-lista">
          <li>
            Na <C>Estrutura</C>, passe em <C>contexto</C>: ele fica à esquerda da barra do topo e continua visível no celular (abaixo de
            40rem, só o quadrado com o ícone).
          </li>
          <li>
            O seletor só avisa: <C>aoMudar</C> recebe o <C>id</C> e o app recarrega os dados do novo contexto. <C>acoes</C> acrescenta itens
            depois das opções (ex.: “Gerenciar empresas”).
          </li>
          <li>
            A demo usa o seletor para alternar entre as finanças pessoais e as da empresa (menu Soluções › Finanças).
          </li>
        </ul>
      }
    >
      <Exemplo id="seletor-contexto/Basico" titulo="Pessoal e empresas" />
    </PaginaComponente>
  );
}
