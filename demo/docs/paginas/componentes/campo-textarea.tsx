import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Área de texto"
      icone="file-text"
      componente="CampoTextarea"
      resumo="Texto de várias linhas, com rótulo, dica, erro e contador de caracteres."
      notas={
        <ul className="doc-lista">
          <li>
            O contador aparece com <C>maxLength</C>; desligue com <C>{'contador={false}'}</C>.
          </li>
          <li>
            Aceita os atributos nativos de <C>{'<textarea>'}</C>, como <C>rows</C> e <C>placeholder</C>.
          </li>
          <li>
            Para mensagem de chat com Enter para enviar, use o <C>CampoMensagem</C>.
          </li>
        </ul>
      }
    >
      <Exemplo id="campo-textarea/Basico" titulo="Básico e com erro" />
    </PaginaComponente>
  );
}
