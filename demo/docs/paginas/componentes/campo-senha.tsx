import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="campoSenha"
      icone="key"
      componente="CampoSenha"
      importar={['type PoliticaSenha']}
      notas={
        <ul className="doc-lista">
          <li>
            No login, deixe sem <C>forca</C> e sem <C>politica</C>: exigir regras ali só atrapalha quem já tem senha.
          </li>
          <li>
            Em troca de senha, passe <C>autoComplete="new-password"</C> para o navegador sugerir uma senha nova.
          </li>
          <li>
            Com <C>forca</C>, a <C>politica</C> liga o medidor e vira validação do campo: o <C>Form</C> acusa a pendência ao salvar. Sem
            ela, vale a política padrão.
          </li>
        </ul>
      }
    >
      <Exemplo id="campo-senha/Basico" titulo="Login e troca de senha" />
    </PaginaComponente>
  );
}
