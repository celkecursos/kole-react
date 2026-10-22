import { useState } from 'react';
import { Botao, CabecalhoPagina, Card, Carregando, Girador, Skeleton, type CorGirador, type SeveridadeBotao } from '../../../src';
import { Bloco } from '../Bloco';

const CORES: CorGirador[] = ['pri', 'secundario', 'ok', 'err', 'warn', 'info', 'destaque', 'escuro'];

export function PaginaGiradores() {
  const [salvando, setSalvando] = useState(false);

  const salvar = () => {
    setSalvando(true);
    window.setTimeout(() => setSalvando(false), 2000);
  };

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Giradores" icone="loader-circle" trilha />

      <div className="demo-colunas">
        <Bloco titulo="Anel" descricao="Gira sem parar; o texto vai só para o leitor de tela.">
          <div>
            <Girador />
          </div>
        </Bloco>
        <Bloco titulo="Anel em cores">
          <div className="demo-linha demo-linha--centro">
            {CORES.map((c) => (
              <Girador key={c} cor={c} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Pulso" descricao="Cresce e some, para esperas mais discretas.">
          <div>
            <Girador tipo="pulso" />
          </div>
        </Bloco>
        <Bloco titulo="Pulso em cores">
          <div className="demo-linha demo-linha--centro">
            {CORES.map((c) => (
              <Girador key={c} tipo="pulso" cor={c} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Pontos" descricao="Três pontos piscando em sequência.">
          <div>
            <Girador tipo="pontos" />
          </div>
        </Bloco>
        <Bloco titulo="Pontos em cores">
          <div className="demo-linha demo-linha--centro">
            {CORES.map((c) => (
              <Girador key={c} tipo="pontos" cor={c} tamanho="pequeno" />
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Alinhamento com flex" descricao="Texto de um lado, girador do outro.">
          <div className="demo-gir-flex">
            <Girador />
          </div>
          <div className="demo-gir-flex demo-gir-flex--entre">
            <strong>Carregando...</strong>
            <Girador rotulo="Carregando a lista" />
          </div>
        </Bloco>
        <Bloco titulo="Alinhamento flutuante">
          <div className="demo-gir-fluxo">
            <Girador className="demo-gir-direita" />
          </div>
          <div className="demo-gir-fluxo">
            <Girador className="demo-gir-esquerda" />
          </div>
        </Bloco>

        <Bloco titulo="Centralizado">
          <div className="demo-gir-centro">
            <Girador />
          </div>
        </Bloco>
        <Bloco titulo="Com margem" descricao="Espaço em volta, separado do conteúdo.">
          <div>
            <Girador className="demo-gir-margem" />
          </div>
        </Bloco>

        <Bloco titulo="Tamanhos" descricao="pequeno, medio, grande ou qualquer medida.">
          <div className="demo-linha demo-linha--centro">
            <Girador tamanho="pequeno" />
            <Girador tipo="pulso" tamanho="pequeno" />
            <Girador tamanho="medio" />
            <Girador tipo="pulso" tamanho="medio" />
            <Girador tamanho="grande" />
            <Girador tipo="pulso" tamanho="grande" />
            <Girador tamanho="3.5rem" />
          </div>
        </Bloco>
        <Bloco titulo="Com rótulo visível">
          <div className="demo-linha demo-linha--centro">
            <Girador mostrarRotulo tamanho="pequeno" />
            <Girador tipo="pulso" cor="ok" mostrarRotulo rotulo="Sincronizando..." tamanho="pequeno" />
            <Girador tipo="pontos" cor="destaque" mostrarRotulo rotulo="Digitando" tamanho="pequeno" />
          </div>
        </Bloco>
      </div>

      <Bloco titulo="Em botões" descricao={<>Use cor=&quot;atual&quot; para o girador herdar a cor do botão.</>}>
        <div className="demo-linha demo-linha--centro">
          <Botao icone={<Girador tamanho="0.875rem" cor="atual" />} aparencia="suave" formato="retangulo" aria-label="Carregando" disabled />
          <Botao icone={<Girador tamanho="0.875rem" cor="atual" rotulo="" />} rotulo="Carregando..." aparencia="suave" formato="retangulo" disabled />
          <Botao icone={<Girador tipo="pulso" tamanho="0.875rem" cor="atual" />} aparencia="suave" formato="retangulo" aria-label="Carregando" disabled />
          {(['pri', 'secundario', 'ok', 'info', 'warn', 'err'] as SeveridadeBotao[]).map((s) => (
            <Botao key={s} icone={<Girador tipo="pulso" tamanho="0.875rem" cor="atual" rotulo="" />} rotulo="Carregando..." severidade={s} aparencia="suave" formato="retangulo" disabled />
          ))}
          <Botao icone={<Girador tamanho="0.875rem" cor="atual" rotulo="" />} rotulo="Carregando..." severidade="escuro" formato="retangulo" disabled />
        </div>
        <div className="demo-linha demo-linha--centro">
          <Botao rotulo={salvando ? 'Salvando...' : 'Salvar'} icone="save" carregando={salvando} formato="retangulo" onClick={salvar} />
          <span className="demo-bloco-desc demo-gir-nota">O próprio Botao tem a prop carregando: clique para ver.</span>
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo="Silhuetas" descricao="Skeleton ocupa o lugar do conteúdo enquanto ele carrega.">
          <Card>
            <div className="demo-pilha-p">
              <Skeleton largura="60%" />
              <Skeleton />
              <Skeleton largura="80%" />
              <Skeleton largura="2.5rem" altura="2.5rem" formato="circulo" />
            </div>
          </Card>
        </Bloco>
        <Bloco titulo="Carregando" descricao="Girador com mensagem, para áreas inteiras. A versão bloqueante está em Notificações.">
          <Card>
            <Carregando mensagem="Carregando" />
          </Card>
        </Bloco>
      </div>
    </div>
  );
}
