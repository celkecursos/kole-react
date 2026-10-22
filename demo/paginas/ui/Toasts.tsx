import { useState } from 'react';
import { Botao, CabecalhoPagina, Toast, useToast, type CorToast, type PosicaoToast, type SeveridadeBotao } from '../../../src';
import { Bloco } from '../Bloco';

const POSICOES: Array<{ posicao: PosicaoToast; rotulo: string }> = [
  { posicao: 'topo-esquerda', rotulo: 'Topo à esquerda' },
  { posicao: 'topo-centro', rotulo: 'Topo ao centro' },
  { posicao: 'topo-direita', rotulo: 'Topo à direita' },
  { posicao: 'meio-esquerda', rotulo: 'Meio à esquerda' },
  { posicao: 'meio-centro', rotulo: 'Meio ao centro' },
  { posicao: 'meio-direita', rotulo: 'Meio à direita' },
  { posicao: 'base-esquerda', rotulo: 'Base à esquerda' },
  { posicao: 'base-centro', rotulo: 'Base ao centro' },
  { posicao: 'base-direita', rotulo: 'Base à direita' },
];

const CORES: Array<{ cor: CorToast; rotulo: string }> = [
  { cor: 'pri', rotulo: 'Primário' },
  { cor: 'secundario', rotulo: 'Secundário' },
  { cor: 'warn', rotulo: 'Aviso' },
  { cor: 'info', rotulo: 'Info' },
  { cor: 'ok', rotulo: 'Sucesso' },
  { cor: 'err', rotulo: 'Perigo' },
];

export function PaginaToasts() {
  const toast = useToast();
  // toasts fixos da página que podem ser fechados
  const [fechados, setFechados] = useState<string[]>([]);
  const fechar = (id: string) => () => setFechados((f) => [...f, id]);
  const aberto = (id: string) => !fechados.includes(id);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Toasts" icone="bell" trilha />

      <Bloco titulo="Posições" descricao="useToast().mostrar({ posicao }) — cada posição tem a sua pilha.">
        <div className="demo-linha">
          {POSICOES.map((p) => (
            <Botao
              key={p.posicao}
              rotulo={p.rotulo}
              aparencia="contorno"
              formato="retangulo"
              onClick={() => toast.mostrar({ titulo: 'Celke Kole', detalhe: `Aviso em ${p.rotulo.toLowerCase()}.`, posicao: p.posicao, aparencia: 'padrao', icone: 'bell' })}
            />
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo="Cores suaves" descricao="Fundo claro da cor (o padrão).">
          <div className="demo-linha">
            {CORES.map((c) => (
              <Botao
                key={c.cor}
                rotulo={c.rotulo}
                severidade={c.cor as SeveridadeBotao}
                aparencia="suave"
                formato="retangulo"
                onClick={() => toast.mostrar({ titulo: c.rotulo, detalhe: 'Seu aviso aparece aqui.', cor: c.cor, icone: 'bell' })}
              />
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Cores sólidas">
          <div className="demo-linha">
            {CORES.map((c) => (
              <Botao
                key={c.cor}
                rotulo={c.rotulo}
                severidade={c.cor as SeveridadeBotao}
                formato="retangulo"
                onClick={() => toast.mostrar({ titulo: c.rotulo, detalhe: 'Seu aviso aparece aqui.', cor: c.cor, aparencia: 'solido', icone: 'bell' })}
              />
            ))}
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-3">
        <div className="demo-pilha">
          <Bloco titulo="Exemplo ao vivo" descricao="Os atalhos ok, info, warn e err já trazem ícone e cor.">
            <div className="demo-linha">
              <Botao rotulo="Mostrar toast" formato="retangulo" onClick={() => toast.ok('Pedido salvo', 'PED-2026-0042 foi gravado.')} />
              <Botao rotulo="Erro" severidade="err" aparencia="contorno" formato="retangulo" onClick={() => toast.err('Falha ao salvar', 'Tente de novo em instantes.')} />
            </div>
          </Bloco>
          <Bloco titulo="Esquemas de cor" descricao="Toasts fixos, sólidos, só com o texto.">
            <div className="demo-toasts-pilha">
              {(
                [
                  ['pri', 'primária'],
                  ['destaque', 'de destaque'],
                  ['ok', 'de sucesso'],
                  ['info', 'informativa'],
                ] as const
              ).map(
                ([c, nome]) =>
                  aberto(`esq-${c}`) && (
                    <Toast key={c} cor={c} aparencia="solido" detalhe={`Olá! Este é o aviso na cor ${nome}.`} aoFechar={fechar(`esq-${c}`)} />
                  ),
              )}
            </div>
          </Bloco>
        </div>

        <div className="demo-pilha">
          <Bloco titulo="Básico" descricao="Modelo com cabeçalho: ícone, título, tempo e ×.">
            {aberto('basico') && (
              <Toast modelo="cabecalho" aparencia="padrao" icone="bell" titulo="Celke Kole" tempo="há 11 min" detalhe="Olá! Esta é uma mensagem de aviso." aoFechar={fechar('basico')} />
            )}
          </Bloco>
          <Bloco titulo="Empilhados" descricao="Vários avisos, um embaixo do outro.">
            <div className="demo-toasts-pilha">
              {aberto('pilha1') && (
                <Toast modelo="cabecalho" aparencia="padrao" icone="bell" titulo="Celke Kole" tempo="agora" detalhe="Viu? Assim mesmo." aoFechar={fechar('pilha1')} />
              )}
              {aberto('pilha2') && (
                <Toast modelo="cabecalho" aparencia="padrao" icone="bell" titulo="Celke Kole" tempo="há 2 s" detalhe="Atenção: os avisos se empilham sozinhos." aoFechar={fechar('pilha2')} />
              )}
            </div>
          </Bloco>
        </div>

        <div className="demo-pilha">
          <Bloco titulo="Translúcido" descricao="Vidro fosco: deixa o fundo aparecer.">
            <div className="demo-toasts-fundo">
              <Toast modelo="cabecalho" aparencia="translucido" icone="bell" titulo="Celke Kole" tempo="há 11 min" detalhe="Olá! Esta é uma mensagem de aviso." aoFechar={() => toast.info('É só um exemplo', 'Este fica fixo.')} />
            </div>
          </Bloco>
          <Bloco titulo="Conteúdo próprio" descricao="Botões e links dentro do aviso.">
            <div className="demo-toasts-pilha">
              {aberto('proprio') && <Toast aparencia="padrao" detalhe="Olá! Esta é uma mensagem de aviso." aoFechar={fechar('proprio')} />}
              <Toast
                aparencia="padrao"
                detalhe="Olá! Esta é uma mensagem de aviso."
                acoes={
                  <>
                    <Botao rotulo="Fazer algo" tamanho="pequeno" formato="retangulo" onClick={() => toast.ok('Feito!')} />
                    <Botao rotulo="Fechar" severidade="secundario" tamanho="pequeno" formato="retangulo" onClick={() => toast.info('É só um exemplo', 'Este fica fixo.')} />
                  </>
                }
              />
            </div>
          </Bloco>
        </div>
      </div>

      <Bloco titulo="Centralizado com flex" descricao="Um Toast é um bloco comum: alinhe como qualquer elemento.">
        <div className="demo-toasts-centro">
          <Toast modelo="cabecalho" aparencia="padrao" icone="bell" titulo="Celke Kole" tempo="há 11 min" detalhe="Olá! Esta é uma mensagem de aviso." />
        </div>
      </Bloco>

      {fechados.length > 0 && (
        <div>
          <Botao rotulo="Reabrir os toasts fechados" icone="rotate-cw" aparencia="texto" formato="retangulo" onClick={() => setFechados([])} />
        </div>
      )}
    </div>
  );
}
