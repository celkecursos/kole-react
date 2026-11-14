import { useState } from 'react';
import { Alerta, Avatar, Botao, CabecalhoPagina, type CorAlerta } from '../../../src';
import { Bloco, retrato } from '../Bloco';
import { useT, type TradutorDemo } from '../../i18n/useT';
import { rico } from '../../i18n/rico';

const CORES: { cor: CorAlerta; nome: string }[] = [
  { cor: 'pri', nome: 'principal' },
  { cor: 'destaque', nome: 'de destaque' },
  { cor: 'ok', nome: 'de sucesso' },
  { cor: 'err', nome: 'de erro' },
  { cor: 'warn', nome: 'de atenção' },
  { cor: 'info', nome: 'informativo' },
  { cor: 'neutral', nome: 'neutro' },
];

const PRINCIPAIS = CORES.filter((c) => ['pri', 'destaque', 'warn', 'err'].includes(c.cor));

const PESSOAS = (t: TradutorDemo['t']) => ([
  { nome: t('paginas.alertas.textos.anaPereira'), cor: '#1f5fe0' },
  { nome: t('paginas.alertas.textos.brunoLima'), cor: '#f7931e' },
  { nome: t('paginas.alertas.textos.carlaDias'), cor: '#15803d' },
  { nome: t('paginas.alertas.textos.danielMoreira'), cor: '#b42318' },
]);

export function PaginaAlertas() {
  const { t, tc } = useT();
  const [vivos, setVivos] = useState<number[]>([]);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.alertas.titulo')} icone="triangle-alert" trilha />

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.alertas.secoes.padrao')}>
          {CORES.map((c) => (
            <Alerta key={c.cor} severidade={c.cor} icone={false} mensagem={t('paginas.alertas.textos.umAlertaNomeSimples', { nome: c.nome })} />
          ))}
        </Bloco>

        <Bloco titulo={t('paginas.alertas.secoes.comLinks')}>
          {CORES.map((c) => (
            <Alerta key={c.cor} severidade={c.cor} icone={false}>{t('paginas.alertas.textos.umAlertaNomeCom', { nome: c.nome })}<a href="#/ui/alertas">{t('paginas.alertas.textos.umLinkDeExemplo')}</a>{t('paginas.alertas.textos.cliqueSeQuiser')}</Alerta>
          ))}
        </Bloco>

        <Bloco titulo={t('paginas.alertas.secoes.solidos')}>
          {CORES.map((c) => (
            <Alerta key={c.cor} severidade={c.cor} aparencia="solido" icone={false} dispensavel mensagem={t('paginas.alertas.textos.umAlertaSolidoNome', { nome: c.nome })} />
          ))}
        </Bloco>

        <Bloco titulo={t('paginas.alertas.secoes.contorno')}>
          {CORES.map((c) => (
            <Alerta key={c.cor} severidade={c.cor} aparencia="contorno" icone={false} dispensavel mensagem={t('paginas.alertas.textos.umAlertaDeContorno', { nome: c.nome })} />
          ))}
        </Bloco>

        <Bloco titulo={t('paginas.alertas.secoes.dispensavel')} descricao={t('paginas.alertas.textos.oTiraOAlerta')}>
          <Alerta severidade="warn" icone={false} dispensavel>{rico(t('paginas.alertas.textos.atencaoReviseOsCampos'))}</Alerta>
        </Bloco>

        <Bloco titulo={t('paginas.alertas.secoes.exemploAoVivo')} descricao={t('paginas.alertas.textos.cadaCliqueCriaUm')}>
          <div>
            <Botao rotulo={t('paginas.alertas.textos.mostrarAlerta')} icone="plus" onClick={() => setVivos((l) => [...l, Date.now()])} />
          </div>
          {vivos.map((id, i) => (
            <Alerta
              key={id}
              severidade="ok"
              icone="circle-check"
              mensagem={t('paginas.alertas.textos.pedidoPed2026Valor', { valor: String(60 + i).padStart(4, '0') })}
              aoFechar={() => setVivos((l) => l.filter((x) => x !== id))}
            />
          ))}
        </Bloco>

        <Bloco titulo={t('paginas.alertas.secoes.arredondadosSolidos')}>
          {PRINCIPAIS.map((c) => (
            <Alerta key={c.cor} severidade={c.cor} aparencia="solido" formato="pilula" icone={false} dispensavel mensagem={t('paginas.alertas.textos.umAlertaSolidoArredondado', { nome: c.nome })} />
          ))}
        </Bloco>

        <Bloco titulo={t('paginas.alertas.secoes.arredondadosDeContorno')}>
          {PRINCIPAIS.map((c) => (
            <Alerta key={c.cor} severidade={c.cor} aparencia="contorno" formato="pilula" icone={false} dispensavel mensagem={t('paginas.alertas.textos.umAlertaDeContorno2', { nome: c.nome })} />
          ))}
        </Bloco>

        <Bloco titulo={t('paginas.alertas.secoes.solidosComSombras')}>
          {(['pri', 'destaque'] as const).flatMap((cor) =>
            (['pequena', 'media', 'grande'] as const).map((s) => (
              <Alerta key={cor + s} severidade={cor} aparencia="solido" sombra={s} icone={false} dispensavel mensagem={t('paginas.alertas.textos.umAlertaSolidoCom', { s })} />
            )),
          )}
        </Bloco>

        <Bloco titulo={t('paginas.alertas.secoes.padraoComSombras')}>
          {(['pri', 'destaque'] as const).flatMap((cor) =>
            (['pequena', 'media', 'grande'] as const).map((s) => (
              <Alerta key={cor + s} severidade={cor} sombra={s} icone={false} mensagem={t('paginas.alertas.textos.umAlertaComSombra', { s })} />
            )),
          )}
        </Bloco>

        <Bloco titulo={t('paginas.alertas.secoes.arredondadosPadrao')}>
          {PRINCIPAIS.map((c) => (
            <Alerta key={c.cor} severidade={c.cor} formato="pilula" icone={false} dispensavel mensagem={t('paginas.alertas.textos.umAlertaArredondadoNome', { nome: c.nome })} />
          ))}
        </Bloco>

        <Bloco titulo={t('paginas.alertas.secoes.arredondadosComDestacado')}>
          {PRINCIPAIS.map((c) => (
            <Alerta
              key={c.cor}
              severidade={c.cor}
              formato="pilula"
              icone={false}
              dispensavel
              botaoFechar="circulo"
              mensagem={t('paginas.alertas.textos.umAlertaArredondadoNome', { nome: c.nome })}
            />
          ))}
        </Bloco>

        <Bloco titulo={t('paginas.alertas.secoes.comIcones')}>
          <Alerta severidade="pri" mensagem={t('paginas.alertas.textos.umAlertaDeExemplo')} />
          <Alerta severidade="ok" mensagem={t('paginas.alertas.textos.pagamentoConfirmado')} />
          <Alerta severidade="warn" mensagem={t('paginas.alertas.textos.estoqueDeCafeAbaixo')} />
          <Alerta severidade="err" mensagem={t('paginas.alertas.textos.falhaAoEmitirA')} />
        </Bloco>

        <Bloco titulo={t('paginas.alertas.secoes.destaqueBordaLateral')}>
          <Alerta severidade="pri" aparencia="destaque" sombra="pequena" dispensavel mensagem={t('paginas.alertas.textos.umAlertaPrincipalCom')} />
          <Alerta severidade="ok" aparencia="destaque" sombra="pequena" dispensavel mensagem={t('paginas.alertas.textos.umAlertaDeSucesso')} />
          <Alerta severidade="warn" aparencia="destaque" sombra="pequena" dispensavel mensagem={t('paginas.alertas.textos.umAlertaDeAtencao')} />
          <Alerta severidade="err" aparencia="destaque" sombra="pequena" dispensavel mensagem={t('paginas.alertas.textos.umAlertaDeErro')} />
        </Bloco>

        <Bloco titulo={t('paginas.alertas.secoes.comImagem')}>
          {PESSOAS(t).map((p, i) => (
            <Alerta
              key={p.nome}
              severidade={PRINCIPAIS[i].cor}
              formato="pilula"
              dispensavel
              midia={<Avatar nome={tc(p.nome)} foto={retrato(p.cor, p.nome[0])} tamanho="1.75rem" />}
              mensagem={t('paginas.alertas.textos.nomeComentouNoPedido', { nome: p.nome, v: 42 + i })}
            />
          ))}
        </Bloco>

        <Bloco titulo={t('paginas.alertas.secoes.comImagensDeTamanhos')}>
          {PESSOAS(t).map((p, i) => (
            <Alerta
              key={p.nome}
              severidade={PRINCIPAIS[i].cor}
              dispensavel
              midia={<Avatar nome={tc(p.nome)} foto={retrato(p.cor, p.nome[0])} formato="quadrado" tamanho={`${1.5 + i * 0.5}rem`} />}
              mensagem={t('paginas.alertas.textos.nomeAtualizouOCadastro', { nome: p.nome })}
            />
          ))}
        </Bloco>
      </div>

      <div className="demo-colunas-4">
        <Alerta
          severidade="pri"
          aparencia="solido"
          titulo={t('paginas.alertas.textos.alertaInformativo')}
          mensagem={t('paginas.alertas.textos.haUmaNovaVersao')}
          dispensavel
          acoes={
            <>
              <a href="#/ui/alertas">{t('paginas.alertas.textos.agoraNao')}</a>
              <a href="#/ui/alertas">{t('paginas.alertas.textos.abrir')}</a>
            </>
          }
        />
        <Alerta severidade="destaque" aparencia="solido" titulo={t('paginas.alertas.textos.alertaDeDestaque')} mensagem={t('paginas.alertas.textos.metaDoMesAtingida')} dispensavel acoes={<a href="#/ui/alertas">{t('paginas.alertas.textos.fechar')}</a>} />
        <Alerta
          severidade="warn"
          aparencia="solido"
          titulo={t('paginas.alertas.textos.alertaDeAtencao')}
          mensagem={t('paginas.alertas.textos.t3PedidosSemConfirmacao')}
          dispensavel
          acoes={
            <>
              <a href="#/ui/alertas">{t('paginas.alertas.textos.ignorar')}</a>
              <a href="#/pedidos">{t('paginas.alertas.textos.ver')}</a>
            </>
          }
        />
        <Alerta
          severidade="err"
          aparencia="solido"
          titulo={t('paginas.alertas.textos.alertaDeErro')}
          mensagem={t('paginas.alertas.textos.aIntegracaoComO')}
          dispensavel
          acoes={
            <>
              <a href="#/ui/alertas">{t('paginas.alertas.textos.fechar')}</a>
              <a href="#/ui/alertas">{t('paginas.alertas.textos.tentarDeNovo')}</a>
            </>
          }
        />
        <Alerta
          severidade="pri"
          aparencia="contorno"
          titulo={t('paginas.alertas.textos.alertaInformativo')}
          mensagem={t('paginas.alertas.textos.haUmaNovaVersao')}
          dispensavel
          acoes={
            <>
              <a href="#/ui/alertas">{t('paginas.alertas.textos.agoraNao')}</a>
              <a href="#/ui/alertas">{t('paginas.alertas.textos.abrir')}</a>
            </>
          }
        />
        <Alerta severidade="ok" aparencia="contorno" titulo={t('paginas.alertas.textos.alertaDeSucesso')} mensagem={t('paginas.alertas.textos.backupDiarioConcluido')} dispensavel acoes={<a href="#/ui/alertas">{t('paginas.alertas.textos.fechar')}</a>} />
        <Alerta
          severidade="warn"
          aparencia="contorno"
          titulo={t('paginas.alertas.textos.alertaDeAtencao')}
          mensagem={t('paginas.alertas.textos.oCertificadoDigitalVence')}
          dispensavel
          acoes={
            <>
              <a href="#/ui/alertas">{t('paginas.alertas.textos.depois')}</a>
              <a href="#/ui/alertas">{t('paginas.alertas.textos.renovar')}</a>
            </>
          }
        />
        <Alerta
          severidade="err"
          aparencia="contorno"
          titulo={t('paginas.alertas.textos.alertaDeErro')}
          mensagem={t('paginas.alertas.textos.naoFoiPossivelEnviar')}
          dispensavel
          acoes={
            <>
              <a href="#/ui/alertas">{t('paginas.alertas.textos.fechar')}</a>
              <a href="#/ui/alertas">{t('paginas.alertas.textos.reenviar')}</a>
            </>
          }
        />
      </div>

      <Bloco titulo={t('paginas.alertas.secoes.conteudoAdicional')}>
        <div className="demo-colunas">
          {(['pri', 'destaque', 'ok', 'warn'] as const).map((cor) => (
            <Alerta key={cor} severidade={cor} aparencia="faixa" icone={false} titulo={t('paginas.alertas.textos.obrigadoPorAvisar')} dispensavel>{t('paginas.alertas.textos.recebemosORelatoDo')}<a href="#/ui/alertas">{t('paginas.alertas.textos.acompanhePeloSuporte')}</a>.
            </Alerta>
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas-4">
        <Alerta
          severidade="pri"
          aparencia="cartao"
          icone="info"
          titulo={t('paginas.alertas.textos.informacao')}
          mensagem={t('paginas.alertas.textos.esteAlertaMostraUma')}
          dispensavel
          acoes={
            <>
              <Botao rotulo={t('paginas.alertas.textos.recusar')} severidade="err" aparencia="contorno" />
              <Botao rotulo={t('paginas.alertas.textos.aceitar')} />
            </>
          }
        />
        <Alerta
          severidade="ok"
          aparencia="cartao"
          titulo={t('paginas.alertas.textos.confirmado')}
          mensagem={t('paginas.alertas.textos.esteAlertaConfirmaQue')}
          dispensavel
          acoes={<Botao rotulo={t('paginas.alertas.textos.fechar')} severidade="ok" />}
        />
        <Alerta
          severidade="warn"
          aparencia="cartao"
          titulo={t('paginas.alertas.textos.atencao')}
          mensagem={t('paginas.alertas.textos.esteAlertaAvisaSobre')}
          dispensavel
          acoes={
            <>
              <Botao rotulo={t('paginas.alertas.textos.voltar')} severidade="secundario" aparencia="contorno" />
              <Botao rotulo={t('paginas.alertas.textos.continuar')} severidade="warn" />
            </>
          }
        />
        <Alerta
          severidade="err"
          aparencia="cartao"
          icone="circle-alert"
          titulo={t('paginas.alertas.textos.erro')}
          mensagem={t('paginas.alertas.textos.esteAlertaAvisaSobre2')}
          dispensavel
          acoes={<Botao rotulo={t('paginas.alertas.textos.excluir')} icone="trash-2" severidade="err" />}
        />
      </div>
    </div>
  );
}
