import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="abas"
      icone="panel-right"
      componente="Abas"
      outros={['Aba']}
      notas={
        <ul className="doc-lista">
          <li>
            Sem <C>ativa</C>, começa na primeira aba e controla sozinha; com <C>ativa</C> + <C>aoMudar</C>, o app controla (para guardar
            na URL, por exemplo).
          </li>
          <li>Teclado: setas trocam de aba, Home e End vão à primeira e à última.</li>
          <li>
            Todos os painéis ficam montados (os inativos com <C>hidden</C>): o que foi digitado numa aba continua lá ao voltar.
          </li>
          <li>
            <C>orientacao="responsiva"</C> empilha as abas em telas estreitas.
          </li>
        </ul>
      }
    >
      <Exemplo id="abas/Basico" titulo="Básico" />
      <Exemplo id="abas/Variantes" titulo="Pílulas e segmentado" />
    </PaginaComponente>
  );
}
