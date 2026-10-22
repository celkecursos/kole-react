import { useState } from 'react';
import { AcaoLinha, Botao, CabecalhoPagina, useToast, type BotaoProps, type SeveridadeBotao } from '../../../src';
import { Bloco } from '../Bloco';

const CORES: { cor: SeveridadeBotao; nome: string }[] = [
  { cor: 'pri', nome: 'Principal' },
  { cor: 'destaque', nome: 'Destaque' },
  { cor: 'ok', nome: 'Sucesso' },
  { cor: 'err', nome: 'Erro' },
  { cor: 'warn', nome: 'Atenção' },
  { cor: 'info', nome: 'Info' },
  { cor: 'secundario', nome: 'Secundário' },
  { cor: 'escuro', nome: 'Escuro' },
];

/** O botão em todas as cores. */
function Todas(props: Omit<BotaoProps, 'severidade' | 'rotulo'>) {
  return (
    <div className="demo-linha">
      {CORES.map((c) => (
        <Botao key={c.cor} severidade={c.cor} rotulo={c.nome} {...props} />
      ))}
    </div>
  );
}

export function PaginaBotoes() {
  const toast = useToast();
  const [alternado, setAlternado] = useState(false);
  const [carregandoDemo, setCarregandoDemo] = useState(false);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Botões" icone="square-mouse-pointer" trilha />

      <div className="demo-colunas">
        <Bloco titulo="Padrão" descricao={'formato="retangulo"'}>
          <Todas formato="retangulo" />
          <div className="demo-linha">
            <Botao rotulo="Link" aparencia="texto" formato="retangulo" />
          </div>
        </Bloco>
        <Bloco titulo="Arredondados" descricao="Pílula é o formato padrão do layout.">
          <Todas />
          <div className="demo-linha">
            <Botao rotulo="Link" aparencia="texto" />
          </div>
        </Bloco>

        <Bloco titulo="Suaves" descricao={'aparencia="suave"'}>
          <Todas aparencia="suave" formato="retangulo" />
        </Bloco>
        <Bloco titulo="Suaves arredondados">
          <Todas aparencia="suave" />
        </Bloco>

        <Bloco titulo="Contorno">
          <Todas aparencia="contorno" formato="retangulo" />
        </Bloco>
        <Bloco titulo="Contorno arredondados">
          <Todas aparencia="contorno" />
        </Bloco>

        <Bloco titulo="Gradiente">
          <Todas aparencia="gradiente" formato="retangulo" />
        </Bloco>
        <Bloco titulo="Gradiente arredondados">
          <Todas aparencia="gradiente" />
        </Bloco>

        <Bloco titulo="Desabilitados">
          <div className="demo-linha">
            <Botao rotulo="Principal" disabled />
            <Botao rotulo="Secundário" severidade="secundario" disabled />
            <Botao rotulo="Principal" aparencia="contorno" disabled />
            <Botao rotulo="Erro" severidade="err" aparencia="contorno" disabled />
          </div>
        </Bloco>

        <Bloco titulo="Alternância" descricao={'pressionado liga e desliga (aria-pressed).'}>
          <div className="demo-linha">
            <Botao rotulo={alternado ? 'Ligado' : 'Desligado'} icone={alternado ? 'check' : 'x'} pressionado={alternado} onClick={() => setAlternado((x) => !x)} />
            <Botao rotulo="Sempre pressionado" severidade="destaque" pressionado />
            <Botao rotulo="Alternância desabilitada" severidade="info" disabled />
          </div>
        </Bloco>
      </div>

      <Bloco titulo="Carregando" descricao="O spinner substitui o ícone e o clique é recusado; o botão continua focável.">
        <div className="demo-linha">
          <Botao rotulo="Carregando" carregando />
          <Botao rotulo="Carregando" severidade="destaque" aparencia="contorno" carregando />
          <Botao rotulo="Carregando" severidade="info" aparencia="suave" carregando />
          <Botao rotulo="Carregando" severidade="warn" aparencia="suave" carregando posicaoIcone="direita" />
          <Botao
            rotulo={carregandoDemo ? 'Salvando…' : 'Clique para salvar'}
            icone="save"
            severidade="ok"
            carregando={carregandoDemo}
            onClick={() => {
              setCarregandoDemo(true);
              setTimeout(() => {
                setCarregandoDemo(false);
                toast.ok('Salvo');
              }, 1500);
            }}
          />
        </div>
      </Bloco>

      <Bloco titulo="Só ícone" descricao="Sem rótulo, o botão fica quadrado/redondo; use dica e aria-label para dar nome a ele.">
        <div className="demo-linha">
          {(
            [
              ['building-2', 'pri', 'retangulo', 'solido'],
              ['package', 'info', 'retangulo', 'solido'],
              ['trash-2', 'err', 'retangulo', 'solido'],
              ['calendar', 'warn', 'retangulo', 'solido'],
              ['house', 'pri', 'pilula', 'suave'],
              ['trash-2', 'err', 'pilula', 'suave'],
              ['bell', 'ok', 'pilula', 'suave'],
              ['shopping-cart', 'destaque', 'pilula', 'suave'],
              ['phone', 'pri', 'pilula', 'contorno'],
              ['message-square', 'info', 'pilula', 'contorno'],
              ['video', 'ok', 'pilula', 'contorno'],
              ['save', 'err', 'pilula', 'contorno'],
            ] as const
          ).map(([icone, cor, formato, aparencia], i) => (
            <Botao key={i} icone={icone} severidade={cor} formato={formato} aparencia={aparencia} dica={icone} aria-label={icone} />
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo="Fantasma" descricao="Contorno discreto que se preenche no hover.">
          <Todas aparencia="fantasma" formato="retangulo" />
        </Bloco>
        <Bloco titulo="Tipos" descricao="type do botão HTML (button, submit, reset).">
          <form className="demo-linha" onSubmit={(e) => (e.preventDefault(), toast.info('Formulário enviado (submit)'))} onReset={() => toast.info('Formulário limpo (reset)')}>
            <Botao rotulo="Botão" formato="retangulo" />
            <Botao rotulo="Enviar" type="submit" severidade="ok" formato="retangulo" />
            <Botao rotulo="Limpar" type="reset" severidade="secundario" formato="retangulo" />
          </form>
        </Bloco>

        <Bloco titulo="Tamanhos">
          <div className="demo-linha demo-linha--centro">
            <Botao rotulo="Pequeno" tamanho="pequeno" />
            <Botao rotulo="Médio (padrão)" severidade="destaque" />
            <Botao rotulo="Grande" tamanho="grande" severidade="ok" />
          </div>
        </Bloco>
        <Bloco titulo="Larguras" descricao="Largura mínima via style (ex.: minWidth: '8rem').">
          <div className="demo-linha">
            {(['5rem', '7rem', '9rem', '11rem'] as const).map((w, i) => (
              <Botao key={w} rotulo={['P', 'M', 'G', 'GG'][i]} severidade={(['pri', 'destaque', 'warn', 'info'] as const)[i]} formato="retangulo" style={{ minWidth: w }} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Sombras">
          <div className="demo-linha demo-linha--centro">
            <Botao rotulo="Pequena" sombra="pequena" formato="retangulo" />
            <Botao rotulo="Média" sombra="media" formato="retangulo" />
            <Botao rotulo="Grande" sombra="grande" formato="retangulo" />
            <Botao rotulo="Pequena" severidade="destaque" tamanho="pequeno" sombra="pequena" formato="retangulo" />
            <Botao rotulo="Média" severidade="info" sombra="media" formato="retangulo" />
            <Botao rotulo="Grande" severidade="ok" tamanho="grande" sombra="grande" formato="retangulo" />
          </div>
        </Bloco>
        <Bloco titulo="Elevados" descricao={'sombra="elevado": sombra da cor, que sobe no hover.'}>
          <Todas sombra="elevado" formato="retangulo" />
        </Bloco>

        <Bloco titulo="Com ícone destacado" descricao="iconeDestacado põe o ícone num segmento mais escuro.">
          <div className="demo-linha">
            <Botao rotulo="Principal" icone="message-square" iconeDestacado formato="retangulo" />
            <Botao rotulo="Destaque" icone="settings" severidade="destaque" iconeDestacado formato="retangulo" />
            <Botao rotulo="Atenção" icone="circle-alert" severidade="warn" iconeDestacado />
            <Botao rotulo="Info" icone="phone" severidade="info" iconeDestacado />
            <Botao rotulo="Sucesso" icone="check" severidade="ok" iconeDestacado posicaoIcone="direita" formato="retangulo" />
            <Botao rotulo="Cancelar" icone="x" severidade="err" iconeDestacado posicaoIcone="direita" />
          </div>
        </Bloco>
        <Bloco titulo="Com ícone">
          <div className="demo-linha">
            <Botao rotulo="Novo pedido" icone="plus" />
            <Botao rotulo="Exportar" icone="download" severidade="secundario" />
            <Botao rotulo="Próximo" icone="arrow-right" posicaoIcone="direita" aparencia="contorno" />
            <Botao rotulo="Excluir" icone="trash-2" severidade="err" aparencia="suave" />
          </div>
        </Bloco>
      </div>

      <Bloco titulo="Ações de linha" descricao="AcaoLinha: botão só de ícone, com dica, para a coluna de ações de tabelas e cards.">
        <div className="demo-linha">
          <AcaoLinha icone="eye" rotulo="Visualizar" severidade="pri" />
          <AcaoLinha icone="pencil" rotulo="Editar" severidade="destaque" />
          <AcaoLinha icone="trash-2" rotulo="Excluir" severidade="err" />
        </div>
      </Bloco>

      <Bloco titulo="Bloco" descricao="bloco ocupa toda a largura disponível.">
        <Botao rotulo="Finalizar pedido" icone="check" bloco formato="retangulo" />
        <Botao rotulo="Continuar comprando" severidade="destaque" bloco formato="retangulo" />
        <div className="demo-botoes-meio">
          <Botao rotulo="Salvar rascunho" severidade="err" aparencia="suave" bloco formato="retangulo" />
          <Botao rotulo="Agendar envio" severidade="warn" bloco formato="retangulo" />
        </div>
        <div className="demo-linha" style={{ justifyContent: 'flex-end' }}>
          <Botao rotulo="Cancelar" severidade="secundario" formato="retangulo" />
          <Botao rotulo="Confirmar" severidade="info" formato="retangulo" />
        </div>
      </Bloco>
    </div>
  );
}
