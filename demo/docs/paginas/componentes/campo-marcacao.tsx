import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="campoMarcacao"
      icone="check"
      componente="CampoMarcacao"
      notas={
        <ul className="doc-lista">
          <li>
            Caixa para escolhas que valem ao salvar o formulário; <C>aparencia="chave"</C> para liga/desliga com efeito imediato.
          </li>
          <li>
            <C>obrigatorio</C> mostra o asterisco e marca <C>aria-required</C>; quem impede salvar sem a caixa marcada (termos de uso) é o{' '}
            <C>aoSalvar</C> do app, passando a mensagem em <C>erro</C>.
          </li>
          <li>
            A chave continua um <C>{'<input type="checkbox">'}</C> com <C>role="switch"</C>: o leitor de tela anuncia "ligado" e
            "desligado".
          </li>
        </ul>
      }
    >
      <Exemplo id="campo-marcacao/Basico" titulo="Caixa e chave" />
    </PaginaComponente>
  );
}
