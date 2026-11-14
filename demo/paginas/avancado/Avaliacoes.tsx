import { useState } from 'react';
import { Avaliacao, CabecalhoPagina, Icone, useToast } from '../../../src';
import { Bloco } from '../Bloco';
import { useT, type TradutorDemo } from '../../i18n/useT';

const MENSAGENS = (t: TradutorDemo['t']) => ([t('paginas.avaliacoes.textos.muitoRuim'), t('paginas.avaliacoes.textos.ruim'), t('paginas.avaliacoes.textos.regular'), t('paginas.avaliacoes.textos.bom'), t('paginas.avaliacoes.textos.excelente')]);

export function PaginaAvaliacoes() {
  const { t } = useT();
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
      <CabecalhoPagina titulo={t('paginas.avaliacoes.titulo')} icone="star" trilha />

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.avaliacoes.secoes.basica')}>
          <div className="demo-aval">
            <p>{t('paginas.avaliacoes.textos.mostreUmPoucoDe')}<Icone icone="heart" className="demo-aval-coracao" />{t('paginas.avaliacoes.textos.avaliando')}</p>
            <Avaliacao rotulo={t('paginas.avaliacoes.textos.avaliacaoBasica')} valor={basica} aoMudar={setBasica} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.avaliacoes.secoes.meiasEstrelas')} descricao={t('paginas.avaliacoes.textos.comPasso05')}>
          <div className="demo-aval">
            <p>{t('paginas.avaliacoes.textos.naoSeEsquecaDe')}</p>
            <Avaliacao rotulo={t('paginas.avaliacoes.textos.avaliacaoDoProduto')} valor={meia} aoMudar={setMeia} passo={0.5} />
            <code className="demo-util-res">valor: {meia}</code>
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.avaliacoes.secoes.mensagensPorNota')}>
          <div className="demo-aval">
            <p>{t('paginas.avaliacoes.textos.suaAvaliacaoEMuito')}</p>
            <Avaliacao rotulo={t('paginas.avaliacoes.textos.avaliacaoComMensagem')} valor={mensagem} aoMudar={setMensagem} mensagens={MENSAGENS(t)} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.avaliacoes.secoes.salvandoNoServidor')} descricao={t('paginas.avaliacoes.textos.aomudarDevolveUmaPromise')}>
          <div className="demo-aval">
            <p>{t('paginas.avaliacoes.textos.obrigadoPorAvaliar')}</p>
            <Avaliacao
              rotulo={t('paginas.avaliacoes.textos.avaliacaoSalvaNoServidor')}
              valor={servidor}
              textoOcupado={t('paginas.avaliacoes.textos.enviandoSuaNota')}
              aoMudar={(v) =>
                // servidor de mentira: responde em 1,5 s
                new Promise<void>((ok) =>
                  window.setTimeout(() => {
                    setServidor(v);
                    toast.ok(t('paginas.avaliacoes.textos.notaRegistrada'), t('paginas.avaliacoes.textos.vDe5', { v }));
                    ok();
                  }, 1500),
                )
              }
            />
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.avaliacoes.secoes.aoPassarOMouse')} descricao={t('paginas.avaliacoes.textos.aopassarAvisaANota')}>
          <div className="demo-aval">
            <p>{t('paginas.avaliacoes.textos.deASuaNota')}<strong className="demo-aval-num">{passando ?? notaPassar}</strong>
            </p>
            <Avaliacao rotulo={t('paginas.avaliacoes.textos.avaliacaoComEventoDe')} valor={notaPassar} aoMudar={setNotaPassar} aoPassar={setPassando} icone="heart" />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.avaliacoes.secoes.limpar')} descricao={t('paginas.avaliacoes.textos.limpavelMostraOBotao')}>
          <div className="demo-aval">
            <p>{t('paginas.avaliacoes.textos.muitoObrigadoPeloSeu')}</p>
            <Avaliacao rotulo={t('paginas.avaliacoes.textos.avaliacaoQuePodeSer')} valor={limpar} aoMudar={setLimpar} limpavel />
          </div>
        </Bloco>
      </div>

      <Bloco titulo={t('paginas.avaliacoes.secoes.soLeituraComQuantas')} descricao={t('paginas.avaliacoes.textos.aceitaFracoesEx7')}>
        <div className="demo-aval demo-aval--leitura">
          <Avaliacao rotulo={t('paginas.avaliacoes.textos.notaDoFornecedor')} valor={7.5} max={10} somenteLeitura />
          <Avaliacao rotulo={t('paginas.avaliacoes.textos.notaMedia')} valor={3.7} somenteLeitura tamanho="grande" />
          <Avaliacao rotulo={t('paginas.avaliacoes.textos.notaDaEntrega')} valor={4.2} somenteLeitura tamanho="pequeno" />
        </div>
      </Bloco>
    </div>
  );
}
