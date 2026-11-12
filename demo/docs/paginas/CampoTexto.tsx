import { C } from '../Codigo';
import { Exemplo } from '../Exemplo';
import { PaginaComponente } from '../PaginaDoc';

export function DocCampoTexto() {
  return (
    <PaginaComponente
      titulo="Campo de texto"
      icone="pencil"
      componente="CampoTexto"
      resumo="Entrada de texto com rótulo, dica, máscara, prefixo/sufixo e validação. É a base dos outros campos da biblioteca."
      padroes={{ type: "'text'" }}
      notas={
        <ul className="doc-lista">
          <li>
            O campo é controlado: <C>valor</C> + <C>aoMudar</C>, que recebe o texto já com a máscara aplicada. Para gravar só os
            dígitos, use <C>semMascara(valor)</C>.
          </li>
          <li>
            <C>validar</C> mostra o erro ao sair do campo (ou ao salvar o <C>Form</C>), não a cada tecla. <C>erro</C> vindo de fora
            aparece na hora.
          </li>
          <li>
            Para CPF, CNPJ, telefone, e-mail e outros formatos comuns, veja os campos prontos (<C>CampoTelefone</C>,{' '}
            <C>CampoSenha</C>) e os <C>TIPOS_CAMPO</C>.
          </li>
          <li>
            Rótulo, dica e erro já ficam ligados ao input por <C>aria-describedby</C>; não precisa repetir em <C>aria-label</C>.
          </li>
        </ul>
      }
    >
      <Exemplo id="campo-texto/Basico" titulo="Básico" />
      <Exemplo id="campo-texto/Mascara" titulo="Máscara">
        Coringas: <C>0</C> dígito · <C>A</C> letra · <C>S</C> letra ou dígito. O resto entra sozinho.
      </Exemplo>
      <Exemplo id="campo-texto/PrefixoSufixo" titulo="Ícone, prefixo e sufixo" />
      <Exemplo id="campo-texto/Validacao" titulo="Validação, aviso e erro" />
    </PaginaComponente>
  );
}
