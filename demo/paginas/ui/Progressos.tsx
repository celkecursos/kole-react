import { useState } from 'react';
import { Botao, CabecalhoPagina, GrupoBotoes, Progresso, type CorProgresso } from '../../../src';
import { Bloco } from '../Bloco';
import { useT } from '../../i18n/useT';

const VALORES = [10, 25, 50, 75, 100];
const CORES: CorProgresso[] = ['pri', 'destaque', 'ok', 'info', 'warn'];
const CORES_2: CorProgresso[] = ['secundario', 'warn', 'info', 'ok', 'err'];

export function PaginaProgressos() {
  const { t } = useT();
  const [rodada, setRodada] = useState(0);
  const [envio, setEnvio] = useState(40);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.progresso.titulo')} icone="chart-column" trilha />

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.progresso.secoes.basico')}>
          <div className="demo-prog-pilha">
            {VALORES.map((v) => (
              <Progresso key={v} valor={v} rotulo={t('paginas.progresso.textos.exemploV', { v })} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.progresso.secoes.cores')}>
          <div className="demo-prog-pilha">
            {CORES_2.map((c, i) => (
              <Progresso key={c} valor={VALORES[i]} cor={c} rotulo={t('paginas.progresso.textos.exemploC', { c })} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.progresso.secoes.listrado')}>
          <div className="demo-prog-pilha">
            {CORES.map((c, i) => (
              <Progresso key={c} valor={VALORES[i]} cor={c} aparencia="listrado" altura="lg" rotulo={t('paginas.progresso.textos.listradoC', { c })} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.progresso.secoes.alturas')} descricao={t('paginas.progresso.textos.xsSmMdPadrao')}>
          <div className="demo-prog-pilha">
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((a, i) => (
              <Progresso key={a} valor={VALORES[i]} altura={a} rotulo={t('paginas.progresso.textos.alturaA', { a })} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.progresso.secoes.listradoAnimado')}>
          <div className="demo-prog-pilha">
            {CORES.map((c, i) => (
              <Progresso key={c} valor={VALORES[i]} cor={c} aparencia="listrado" animado altura="lg" rotulo={t('paginas.progresso.textos.animadoC', { c })} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.progresso.secoes.gradiente')}>
          <div className="demo-prog-pilha">
            {CORES.map((c, i) => (
              <Progresso key={c} valor={VALORES[i]} cor={c} aparencia="gradiente" altura="lg" rotulo={t('paginas.progresso.textos.gradienteC', { c })} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.progresso.secoes.valorDentroDaBarra')}>
          <div className="demo-prog-pilha">
            {CORES.map((c, i) => (
              <Progresso key={c} valor={VALORES[i] === 100 ? 90 : VALORES[i] + 10} cor={c} altura="xl" mostrarValor="dentro" rotulo={t('paginas.progresso.textos.rotuloC', { c })} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.progresso.secoes.variasBarras')} descricao={t('paginas.progresso.textos.segmentosEmpilhadosNaMesma')}>
          <div className="demo-prog-pilha">
            {(['xs', 'sm', 'lg', 'xl'] as const).map((a, i) => (
              <Progresso
                key={a}
                altura={a}
                rotulo={t('paginas.progresso.textos.distribuicao')}
                mostrarValor={a === 'xl' ? 'dentro' : 'nenhum'}
                segmentos={[
                  { valor: 10 + i * 5, cor: 'pri', rotulo: t('paginas.progresso.textos.pedidos') },
                  { valor: 15 + i * 3, cor: 'ok', rotulo: t('paginas.progresso.textos.pagos') },
                  { valor: 10 + i * 4, cor: i % 2 ? 'warn' : 'err', rotulo: t('paginas.progresso.textos.pendentes') },
                ]}
              />
            ))}
          </div>
        </Bloco>

        <Bloco
          titulo={t('paginas.progresso.secoes.entradaAnimada')}
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
              <Progresso key={c} valor={VALORES[i]} cor={c} aparencia="gradiente" entrada rotulo={t('paginas.progresso.textos.entradaC', { c })} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.progresso.secoes.etiquetaMarcadorEBalao')}>
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

        <Bloco titulo={t('paginas.progresso.secoes.marcos')} descricao={t('paginas.progresso.textos.pontosAoLongoDa')}>
          <div className="demo-prog-pilha demo-prog-pilha--folga-p">
            {CORES.map((c, i) => (
              <Progresso key={c} valor={[50, 60, 70, 80, 90][i]} cor={c} altura="xs" marcos={[25, 50, 75]} rotulo={t('paginas.progresso.textos.etapasC', { c })} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.progresso.secoes.pilulaNaPonta')}>
          <div className="demo-prog-pilha demo-prog-pilha--folga">
            {(['pri', 'destaque', 'ok'] as const).map((c, i) => (
              <Progresso key={c} valor={[50, 60, 70][i]} cor={c} altura="xs" mostrarValor="pilula" rotulo={t('paginas.progresso.textos.pilulaC', { c })} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.progresso.secoes.trilhaColoridaEValor')}>
          <div className="demo-prog-pilha">
            {[...CORES, 'err' as const].map((c, i) => (
              <Progresso key={c} valor={[10, 20, 40, 60, 80, 100][i]} cor={c} aparencia="gradiente" altura="lg" trilhaColorida mostrarValor="fim" rotulo={t('paginas.progresso.textos.trilhaC', { c })} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.progresso.secoes.dependenciasDoProjeto')}>
          <div className="demo-prog-pilha">
            <Progresso
              altura="xl"
              mostrarValor="dentro"
              rotulo={t('paginas.progresso.textos.dependenciasDoProjeto')}
              segmentos={[
                { valor: 25, cor: 'pri', rotulo: t('paginas.progresso.textos.html') },
                { valor: 35, cor: 'destaque', rotulo: t('paginas.progresso.textos.css') },
                { valor: 40, cor: 'err', rotulo: t('paginas.progresso.textos.javascript') },
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

      <Bloco titulo={t('paginas.progresso.secoes.valorDinamico')} descricao={t('paginas.progresso.textos.aBarraAnimaAo')}>
        <div className="demo-prog-pilha">
          <Progresso valor={envio} cor={envio >= 100 ? 'ok' : 'pri'} altura="lg" aparencia="listrado" animado={envio < 100} mostrarValor="fim" rotulo={t('paginas.progresso.textos.envioDoArquivo')} />
          <div>
            <GrupoBotoes rotulo={t('paginas.progresso.textos.controleDoEnvio')} aparencia="contorno" formato="retangulo" tamanho="pequeno">
              <Botao icone="minus" aria-label={t('paginas.progresso.textos.diminuir10')} dica="−10%" onClick={() => setEnvio((v) => Math.max(0, v - 10))} />
              <Botao rotulo={t('paginas.progresso.textos.zerar')} onClick={() => setEnvio(0)} />
              <Botao icone="plus" aria-label={t('paginas.progresso.textos.aumentar10')} dica="+10%" onClick={() => setEnvio((v) => Math.min(100, v + 10))} />
            </GrupoBotoes>
          </div>
        </div>
      </Bloco>
    </div>
  );
}
