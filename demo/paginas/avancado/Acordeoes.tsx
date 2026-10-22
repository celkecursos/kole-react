import { useState, type ReactNode } from 'react';
import { Acordeao, Botao, CabecalhoPagina, ItemAcordeao, Recolhivel, type AcordeaoProps } from '../../../src';
import { Bloco } from '../Bloco';

const TEXTO = (
  <>
    <strong>Este é o corpo do primeiro item.</strong> Ele aparece aberto por padrão, até que o componente adicione as classes que fazem a animação
    de abrir e fechar. Dá para colocar qualquer conteúdo aqui dentro: texto, listas, formulários.
  </>
);

/** Os 3 itens de exemplo, com o primeiro aberto. */
function Exemplo(props: Omit<AcordeaoProps, 'children'> & { icones?: boolean }) {
  const { icones, ...resto } = props;
  return (
    <Acordeao padraoAbertos={['um']} {...resto}>
      <ItemAcordeao valor="um" titulo="Item 1 do acordeão" icone={icones ? 'package' : undefined}>
        {TEXTO}
      </ItemAcordeao>
      <ItemAcordeao valor="dois" titulo="Item 2 do acordeão" icone={icones ? 'truck' : undefined}>
        Conteúdo do segundo item. Abra-o para ver o primeiro se fechar (a não ser no modo múltiplo).
      </ItemAcordeao>
      <ItemAcordeao valor="tres" titulo="Item 3 do acordeão" icone={icones ? 'wallet' : undefined}>
        Conteúdo do terceiro item.
      </ItemAcordeao>
    </Acordeao>
  );
}

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <>
      <h2 className="demo-secao-titulo">{titulo}</h2>
      {children}
    </>
  );
}

export function PaginaAcordeoes() {
  const [link, setLink] = useState(false);
  const [primeiro, setPrimeiro] = useState(false);
  const [segundo, setSegundo] = useState(false);
  const [lateral, setLateral] = useState(false);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Acordeões e recolhíveis" icone="list" trilha />

      <div className="demo-colunas">
        <Bloco titulo="Acordeão básico" descricao="Abrir um item fecha o outro.">
          <Exemplo />
        </Bloco>
        <Bloco titulo="Sempre aberto" descricao="Com multiplo, abrir um item não fecha os demais.">
          <Exemplo multiplo />
        </Bloco>
      </div>

      <Bloco titulo="Sem borda" descricao="Encostado no container, para usar dentro de cards.">
        <Exemplo variante="sem-borda" />
      </Bloco>

      <Secao titulo="Cores sólidas">
        <div className="demo-colunas">
          <Bloco titulo="Primário">
            <Exemplo variante="solido" />
          </Bloco>
          <Bloco titulo="Destaque">
            <Exemplo variante="solido" cor="destaque" />
          </Bloco>
        </div>
      </Secao>

      <Secao titulo="Cores suaves">
        <div className="demo-colunas">
          <Bloco titulo="Primário">
            <Exemplo variante="suave" />
          </Bloco>
          <Bloco titulo="Destaque">
            <Exemplo variante="suave" cor="destaque" />
          </Bloco>
        </div>
      </Secao>

      <div className="demo-colunas">
        <Bloco titulo="Ícone de mais e menos" descricao="Itens separados, com + / −.">
          <Exemplo separado icone="mais" />
        </Bloco>
        <Bloco titulo="Uma cor por item" descricao="A cor do item vence a do acordeão.">
          <Acordeao separado variante="suave" padraoAbertos={['um']}>
            <ItemAcordeao valor="um" titulo="Item 1 do acordeão" cor="pri">
              {TEXTO}
            </ItemAcordeao>
            <ItemAcordeao valor="dois" titulo="Item 2 do acordeão" cor="err">
              Conteúdo do segundo item.
            </ItemAcordeao>
            <ItemAcordeao valor="tres" titulo="Item 3 do acordeão" cor="destaque">
              Conteúdo do terceiro item.
            </ItemAcordeao>
          </Acordeao>
        </Bloco>
      </div>

      <Secao titulo="Bordas coloridas">
        <div className="demo-colunas">
          <Bloco titulo="Primário">
            <Exemplo variante="contorno" separado />
          </Bloco>
          <Bloco titulo="Sucesso">
            <Exemplo variante="contorno" separado cor="ok" />
          </Bloco>
        </div>
      </Secao>

      <div className="demo-colunas">
        <Bloco titulo="Ícone à esquerda" descricao="Com ícone no título também.">
          <Exemplo separado posicaoIcone="inicio" icones />
        </Bloco>
        <Bloco titulo="Sem ícone">
          <Exemplo separado icone="nenhum" />
        </Bloco>
      </div>

      <Secao titulo="Recolhível">
        <div className="demo-colunas">
          <Bloco titulo="Exemplo" descricao="Qualquer conteúdo pode abrir e fechar com o Recolhivel.">
            <div className="demo-linha">
              <Botao rotulo="Link com recolhível" aparencia="texto" formato="retangulo" onClick={() => setLink((v) => !v)} aria-expanded={link} />
              <Botao rotulo="Botão com recolhível" formato="retangulo" onClick={() => setLink((v) => !v)} aria-expanded={link} />
            </div>
            <Recolhivel aberto={link}>
              <div className="demo-recolhivel-caixa">
                Um conteúdo de exemplo para o recolhível. Ele aparece e some com uma animação suave, e sai da ordem de foco quando fechado.
              </div>
            </Recolhivel>
          </Bloco>
          <Bloco titulo="Vários alvos" descricao="Um botão pode controlar mais de um recolhível.">
            <div className="demo-linha">
              <Botao rotulo="Alternar o primeiro" formato="retangulo" onClick={() => setPrimeiro((v) => !v)} aria-expanded={primeiro} />
              <Botao rotulo="Alternar o segundo" severidade="secundario" formato="retangulo" onClick={() => setSegundo((v) => !v)} aria-expanded={segundo} />
              <Botao
                rotulo="Alternar os dois"
                severidade="ok"
                formato="retangulo"
                onClick={() => {
                  setPrimeiro((v) => !v);
                  setSegundo((v) => !v);
                }}
              />
            </div>
            <div className="demo-colunas">
              <Recolhivel aberto={primeiro}>
                <div className="demo-recolhivel-caixa">Primeiro recolhível: abre com o primeiro botão ou com o terceiro.</div>
              </Recolhivel>
              <Recolhivel aberto={segundo}>
                <div className="demo-recolhivel-caixa">Segundo recolhível: abre com o segundo botão ou com o terceiro.</div>
              </Recolhivel>
            </div>
          </Bloco>
        </div>
      </Secao>

      <Bloco titulo="Recolhível horizontal" descricao={<>orientacao=&quot;horizontal&quot; anima a largura em vez da altura.</>}>
        <div>
          <Botao rotulo="Alternar na largura" formato="retangulo" onClick={() => setLateral((v) => !v)} aria-expanded={lateral} />
        </div>
        <div className="demo-recolhivel-faixa">
          <Recolhivel aberto={lateral} orientacao="horizontal">
            <div className="demo-recolhivel-caixa demo-recolhivel-caixa--largura">Este conteúdo aparece abrindo para o lado.</div>
          </Recolhivel>
        </div>
      </Bloco>
    </div>
  );
}
