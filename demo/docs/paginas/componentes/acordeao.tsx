import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Acordeão"
      icone="list"
      componente="Acordeao"
      outros={['ItemAcordeao']}
      resumo="Seções que abrem e fecham: perguntas frequentes, grupos de configurações, detalhes opcionais."
      notas={
        <ul className="doc-lista">
          <li>
            Por padrão, abrir um item fecha o outro; com <C>multiplo</C>, cada um abre sozinho.
          </li>
          <li>
            <C>padraoAbertos</C> define os abertos no início; <C>abertos</C> + <C>aoMudar</C> deixam o app controlar.
          </li>
          <li>
            O título é um botão com <C>aria-expanded</C>, e o conteúdo fechado sai da ordem de foco.
          </li>
        </ul>
      }
    >
      <Exemplo id="acordeao/Basico" titulo="Básico" />
      <Exemplo id="acordeao/Variantes" titulo="Variantes" />
    </PaginaComponente>
  );
}
