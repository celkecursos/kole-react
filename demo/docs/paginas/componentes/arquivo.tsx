import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="arquivo"
      icone="paperclip"
      componente="CampoAnexo"
      outros={['Foto', 'VisualizadorArquivo', 'DialogoArquivo']}
      importar={['type Anexo', 'type CampoAnexoRef']}
      notas={
        <ul className="doc-lista">
          <li>
            O valor do <C>CampoAnexo</C> é uma lista de <C>Anexo</C> (nome, tamanho, tipo, url): os já salvos e os novos convivem nela. O{' '}
            <C>File</C> dos novos sai por <C>ref.arquivoDe(anexo)</C>.
          </li>
          <li>
            Clicar num anexo abre o <C>DialogoArquivo</C>, que usa o <C>VisualizadorArquivo</C>: + e − ampliam, R gira, setas folheiam.
            Use os dois direto para abrir arquivos de fora do campo.
          </li>
          <li>
            <C>minimo</C> vira pendência do <C>Form</C> ao salvar; arquivo acima de <C>maxTamanho</C> é recusado na hora, com aviso.
          </li>
          <li>
            <C>Foto</C> aceita URL, <C>Anexo</C> ou uma lista dos dois; sem foto, mostra as iniciais do <C>nome</C>.
          </li>
        </ul>
      }
    >
      <Exemplo id="arquivo/Anexos" titulo="Campo de anexos">
        Arraste arquivos para o campo ou clique para escolher. Clique num anexo para abrir o visualizador.
      </Exemplo>
      <Exemplo id="arquivo/Foto" titulo="Foto" />
    </PaginaComponente>
  );
}
