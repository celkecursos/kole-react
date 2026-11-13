import { useState } from 'react';
import { CampoMensagem, MenuSuspenso, useToast, type AnexoMensagem } from '../../../../src';

let id = 0;

export default function Exemplo() {
  const toast = useToast();
  const [texto, setTexto] = useState('');
  const [anexos, setAnexos] = useState<AnexoMensagem[]>([
    { id: 'a', nome: 'contrato-transportadora.pdf', tamanho: 482_000, tipo: 'application/pdf' },
    { id: 'b', nome: 'planilha-de-fretes.xlsx', tamanho: 96_000, progresso: 60 },
    { id: 'c', nome: 'video-da-reuniao.mp4', erro: 'Maior que 20 MB' },
  ]);
  // arrastar para o campo ou colar (Ctrl+V) também chama aoAdicionarArquivos
  const adicionar = (arquivos: File[]) => setAnexos((l) => [...l, ...arquivos.map((f) => ({ id: ++id, nome: f.name, tamanho: f.size, tipo: f.type }))]);

  return (
    <CampoMensagem
      valor={texto}
      aoMudar={setTexto}
      aoEnviar={(t) => toast.info('Enviar', `${t || '(só anexos)'} · ${anexos.length} anexo(s)`)}
      anexos={anexos}
      aoRemoverAnexo={(idAnexo) => setAnexos((l) => l.filter((a) => a.id !== idAnexo))}
      aoAdicionarArquivos={adicionar}
      acoesExtras={
        <MenuSuspenso
          icone="plus"
          aria-label="Adicionar"
          severidade="secundario"
          aparencia="texto"
          tamanho="pequeno"
          semSeta
          direcao="cima"
          itens={[
            { id: 'anexar', rotulo: 'Anexar arquivo', icone: 'paperclip' },
            { id: 'docs', rotulo: 'Buscar nos documentos', icone: 'file-search' },
          ]}
          aoEscolher={(opcao) => toast.info('Escolheu', opcao)}
        />
      }
    />
  );
}
