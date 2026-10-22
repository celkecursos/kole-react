import { useState } from 'react';
import { Botao, CabecalhoPagina, GrupoBotoes, Progresso, type CorProgresso } from '../../../src';
import { Bloco } from '../Bloco';

const VALORES = [10, 25, 50, 75, 100];
const CORES: CorProgresso[] = ['pri', 'destaque', 'ok', 'info', 'warn'];
const CORES_2: CorProgresso[] = ['secundario', 'warn', 'info', 'ok', 'err'];

export function PaginaProgressos() {
  const [rodada, setRodada] = useState(0);
  const [envio, setEnvio] = useState(40);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Progresso" icone="chart-column" trilha />

      <div className="demo-colunas">
        <Bloco titulo="Básico">
          <div className="demo-prog-pilha">
            {VALORES.map((v) => (
              <Progresso key={v} valor={v} rotulo={`Exemplo ${v}%`} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Cores">
          <div className="demo-prog-pilha">
            {CORES_2.map((c, i) => (
              <Progresso key={c} valor={VALORES[i]} cor={c} rotulo={`Exemplo ${c}`} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Listrado">
          <div className="demo-prog-pilha">
            {CORES.map((c, i) => (
              <Progresso key={c} valor={VALORES[i]} cor={c} aparencia="listrado" altura="lg" rotulo={`Listrado ${c}`} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Alturas" descricao="xs, sm, md (padrão), lg e xl.">
          <div className="demo-prog-pilha">
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((a, i) => (
              <Progresso key={a} valor={VALORES[i]} altura={a} rotulo={`Altura ${a}`} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Listrado animado">
          <div className="demo-prog-pilha">
            {CORES.map((c, i) => (
              <Progresso key={c} valor={VALORES[i]} cor={c} aparencia="listrado" animado altura="lg" rotulo={`Animado ${c}`} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Gradiente">
          <div className="demo-prog-pilha">
            {CORES.map((c, i) => (
              <Progresso key={c} valor={VALORES[i]} cor={c} aparencia="gradiente" altura="lg" rotulo={`Gradiente ${c}`} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Valor dentro da barra">
          <div className="demo-prog-pilha">
            {CORES.map((c, i) => (
              <Progresso key={c} valor={VALORES[i] === 100 ? 90 : VALORES[i] + 10} cor={c} altura="xl" mostrarValor="dentro" rotulo={`Rótulo ${c}`} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Várias barras" descricao="Segmentos empilhados na mesma trilha.">
          <div className="demo-prog-pilha">
            {(['xs', 'sm', 'lg', 'xl'] as const).map((a, i) => (
              <Progresso
                key={a}
                altura={a}
                rotulo="Distribuição"
                mostrarValor={a === 'xl' ? 'dentro' : 'nenhum'}
                segmentos={[
                  { valor: 10 + i * 5, cor: 'pri', rotulo: 'Pedidos' },
                  { valor: 15 + i * 3, cor: 'ok', rotulo: 'Pagos' },
                  { valor: 10 + i * 4, cor: i % 2 ? 'warn' : 'err', rotulo: 'Pendentes' },
                ]}
              />
            ))}
          </div>
        </Bloco>

        <Bloco
          titulo="Entrada animada"
          descricao={
            <>
              A barra cresce do zero ao aparecer.{' '}
              <button type="button" className="demo-prog-repetir" onClick={() => setRodada((r) => r + 1)}>
                Repetir
              </button>
            </>
          }
        >
          <div className="demo-prog-pilha" key={rodada}>
            {CORES.map((c, i) => (
              <Progresso key={c} valor={VALORES[i]} cor={c} aparencia="gradiente" entrada rotulo={`Entrada ${c}`} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Etiqueta, marcador e balão">
          <div className="demo-prog-pilha demo-prog-pilha--folga">
            {(
              [
                ['Celulares', 50, 'pri'],
                ['Relógios', 60, 'destaque'],
                ['Camisetas', 70, 'ok'],
              ] as const
            ).map(([etiqueta, v, c]) => (
              <Progresso key={etiqueta} etiqueta={etiqueta} valor={v} cor={c} altura="sm" marcador mostrarValor="balao" />
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Marcos" descricao="Pontos ao longo da trilha; os já atingidos ganham a cor.">
          <div className="demo-prog-pilha demo-prog-pilha--folga-p">
            {CORES.map((c, i) => (
              <Progresso key={c} valor={[50, 60, 70, 80, 90][i]} cor={c} altura="xs" marcos={[25, 50, 75]} rotulo={`Etapas ${c}`} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Pílula na ponta">
          <div className="demo-prog-pilha demo-prog-pilha--folga">
            {(['pri', 'destaque', 'ok'] as const).map((c, i) => (
              <Progresso key={c} valor={[50, 60, 70][i]} cor={c} altura="xs" mostrarValor="pilula" rotulo={`Pílula ${c}`} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Trilha colorida e valor no fim">
          <div className="demo-prog-pilha">
            {[...CORES, 'err' as const].map((c, i) => (
              <Progresso key={c} valor={[10, 20, 40, 60, 80, 100][i]} cor={c} aparencia="gradiente" altura="lg" trilhaColorida mostrarValor="fim" rotulo={`Trilha ${c}`} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Dependências do projeto">
          <div className="demo-prog-pilha">
            <Progresso
              altura="xl"
              mostrarValor="dentro"
              rotulo="Dependências do projeto"
              segmentos={[
                { valor: 25, cor: 'pri', rotulo: 'HTML' },
                { valor: 35, cor: 'destaque', rotulo: 'CSS' },
                { valor: 40, cor: 'err', rotulo: 'JavaScript' },
              ]}
            />
            <div className="demo-prog-legenda">
              {(
                [
                  ['HTML', 25, 'pri'],
                  ['CSS', 35, 'destaque'],
                  ['JavaScript', 40, 'err'],
                ] as const
              ).map(([nome, v, c]) => (
                <div key={nome} className="demo-prog-legenda-item">
                  <span>{nome}</span>
                  <Progresso valor={v} cor={c} altura="xs" mostrarValor="fim" rotulo={nome} />
                </div>
              ))}
            </div>
          </div>
        </Bloco>
      </div>

      <Bloco titulo="Valor dinâmico" descricao="A barra anima ao mudar de valor.">
        <div className="demo-prog-pilha">
          <Progresso valor={envio} cor={envio >= 100 ? 'ok' : 'pri'} altura="lg" aparencia="listrado" animado={envio < 100} mostrarValor="fim" rotulo="Envio do arquivo" />
          <div>
            <GrupoBotoes rotulo="Controle do envio" aparencia="contorno" formato="retangulo" tamanho="pequeno">
              <Botao icone="minus" aria-label="Diminuir 10%" dica="−10%" onClick={() => setEnvio((v) => Math.max(0, v - 10))} />
              <Botao rotulo="Zerar" onClick={() => setEnvio(0)} />
              <Botao icone="plus" aria-label="Aumentar 10%" dica="+10%" onClick={() => setEnvio((v) => Math.min(100, v + 10))} />
            </GrupoBotoes>
          </div>
        </div>
      </Bloco>
    </div>
  );
}
