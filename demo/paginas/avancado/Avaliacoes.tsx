import { useState } from 'react';
import { Avaliacao, CabecalhoPagina, Icone, useToast } from '../../../src';
import { Bloco } from '../Bloco';

const MENSAGENS = ['Muito ruim', 'Ruim', 'Regular', 'Bom', 'Excelente!'];

export function PaginaAvaliacoes() {
  const toast = useToast();
  const [basica, setBasica] = useState(4);
  const [meia, setMeia] = useState(2.5);
  const [mensagem, setMensagem] = useState(4);
  const [servidor, setServidor] = useState(2);
  const [passando, setPassando] = useState<number | null>(null);
  const [notaPassar, setNotaPassar] = useState(3);
  const [limpar, setLimpar] = useState(3);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Avaliações" icone="star" trilha />

      <div className="demo-colunas">
        <Bloco titulo="Básica">
          <div className="demo-aval">
            <p>
              Mostre um pouco de <Icone icone="heart" className="demo-aval-coracao" /> avaliando
            </p>
            <Avaliacao rotulo="Avaliação básica" valor={basica} aoMudar={setBasica} />
          </div>
        </Bloco>
        <Bloco titulo="Meias estrelas" descricao="Com passo 0,5, a metade esquerda da estrela vale meio ponto.">
          <div className="demo-aval">
            <p>Não se esqueça de avaliar o produto</p>
            <Avaliacao rotulo="Avaliação do produto" valor={meia} aoMudar={setMeia} passo={0.5} />
            <code className="demo-util-res">valor: {meia}</code>
          </div>
        </Bloco>

        <Bloco titulo="Mensagens por nota">
          <div className="demo-aval">
            <p>Sua avaliação é muito importante 👏</p>
            <Avaliacao rotulo="Avaliação com mensagem" valor={mensagem} aoMudar={setMensagem} mensagens={MENSAGENS} />
          </div>
        </Bloco>
        <Bloco titulo="Salvando no servidor" descricao="aoMudar devolve uma Promise: o componente espera e mostra o texto de ocupado.">
          <div className="demo-aval">
            <p>Obrigado por avaliar</p>
            <Avaliacao
              rotulo="Avaliação salva no servidor"
              valor={servidor}
              textoOcupado="Enviando sua nota..."
              aoMudar={(v) =>
                // servidor de mentira: responde em 1,5 s
                new Promise<void>((ok) =>
                  window.setTimeout(() => {
                    setServidor(v);
                    toast.ok('Nota registrada', `${v} de 5`);
                    ok();
                  }, 1500),
                )
              }
            />
          </div>
        </Bloco>

        <Bloco titulo="Ao passar o mouse" descricao="aoPassar avisa a nota sob o ponteiro.">
          <div className="demo-aval">
            <p>
              Dê a sua nota: <strong className="demo-aval-num">{passando ?? notaPassar}</strong>
            </p>
            <Avaliacao rotulo="Avaliação com evento de passar" valor={notaPassar} aoMudar={setNotaPassar} aoPassar={setPassando} icone="heart" />
          </div>
        </Bloco>
        <Bloco titulo="Limpar" descricao="limpavel mostra o botão para zerar a nota.">
          <div className="demo-aval">
            <p>Muito obrigado pelo seu apoio!</p>
            <Avaliacao rotulo="Avaliação que pode ser limpa" valor={limpar} aoMudar={setLimpar} limpavel />
          </div>
        </Bloco>
      </div>

      <Bloco titulo="Só leitura, com quantas estrelas quiser" descricao="Aceita frações (ex.: 7,5 de 10).">
        <div className="demo-aval demo-aval--leitura">
          <Avaliacao rotulo="Nota do fornecedor" valor={7.5} max={10} somenteLeitura />
          <Avaliacao rotulo="Nota média" valor={3.7} somenteLeitura tamanho="grande" />
          <Avaliacao rotulo="Nota da entrega" valor={4.2} somenteLeitura tamanho="pequeno" />
        </div>
      </Bloco>
    </div>
  );
}
