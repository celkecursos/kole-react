import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Seleção"
      icone="chevron-down"
      componente="CampoSelect"
      outros={['CampoSelectMultiplo']}
      importar={['type Opcao']}
      resumo="Escolha de uma opção (CampoSelect) ou de várias (CampoSelectMultiplo) numa lista, com busca e botão de limpar."
      notas={
        <ul className="doc-lista">
          <li>
            O valor é o <C>valor</C> da opção (texto, número ou outro tipo, via genérico <C>{'CampoSelect<number>'}</C>), e <C>null</C>{' '}
            quando nada foi escolhido.
          </li>
          <li>
            <C>comBusca</C> vale a pena a partir de umas dez opções. Para listas que vêm do servidor, use o <C>CampoBusca</C>.
          </li>
          <li>Teclado: setas, Home e End percorrem; Enter ou espaço escolhe; Esc fecha.</li>
          <li>
            Até umas cinco opções que cabem na tela, a <C>Escolha</C> (segmentado ou rádio) mostra tudo sem precisar abrir.
          </li>
        </ul>
      }
    >
      <Exemplo id="campo-select/Basico" titulo="Uma ou várias opções" />
      <Exemplo id="campo-select/Inline" titulo="Em barra de filtro" />
    </PaginaComponente>
  );
}
