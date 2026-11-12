import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Toast"
      icone="bell"
      componente="Toast"
      tipos={['OpcoesToast']}
      importar={['useToast', 'type OpcoesToast']}
      resumo="Aviso passageiro no canto da tela: retorno de uma ação (salvou, excluiu, falhou). Sai sozinho depois de alguns segundos."
      notas={
        <ul className="doc-lista">
          <li>
            <C>useToast()</C> já funciona dentro do <C>ProvedorUi</C>. Os atalhos são <C>ok</C>, <C>info</C>, <C>warn</C> e <C>err</C>{' '}
            (título, detalhe); <C>mostrar</C> aceita todas as opções.
          </li>
          <li>Passar o mouse ou o foco sobre o toast pausa o tempo; o × fecha na hora.</li>
          <li>
            O que precisa continuar visível (aviso de vencimento, erro de carga) é <C>Alerta</C>, não toast.
          </li>
          <li>
            O componente <C>Toast</C> também pode ser usado direto, como aviso fixo na página.
          </li>
        </ul>
      }
    >
      <Exemplo id="toast/Basico" titulo="Severidades" />
      <Exemplo id="toast/Opcoes" titulo="Aparência, posição e duração" />
      <Exemplo id="toast/Fixo" titulo="Cartão fixo na página" />
    </PaginaComponente>
  );
}
