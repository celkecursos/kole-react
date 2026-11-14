import { useState } from 'react';
import { Botao, CabecalhoPagina, Carregando, Vazio, useConfirmacao, useToast } from '../../../src';
import { Bloco } from '../Bloco';
import { useT } from '../../i18n/useT';

export function PaginaNotificacoes() {
  const { t, tc } = useT();
  const toast = useToast();
  const confirmar = useConfirmacao();
  const [bloqueio, setBloqueio] = useState(false);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.notificacoes.titulo')} icone="bell" trilha />

      <Bloco titulo={t('paginas.notificacoes.secoes.toasts')} descricao={t('paginas.notificacoes.textos.aparecemNoCantoE')}>
        <div className="demo-linha">
          <Botao rotulo={t('paginas.notificacoes.textos.sucesso')} severidade="ok" aparencia="contorno" onClick={() => toast.ok(t('paginas.notificacoes.textos.registroSalvo'), t('paginas.notificacoes.textos.asAlteracoesForamGravadas'))} />
          <Botao rotulo={t('paginas.notificacoes.textos.informacao')} aparencia="contorno" onClick={() => toast.info(t('paginas.notificacoes.textos.sincronizando'))} />
          <Botao rotulo={t('paginas.notificacoes.textos.atencao')} severidade="warn" aparencia="contorno" onClick={() => toast.warn(t('paginas.notificacoes.textos.sessaoExpiraEm5'))} />
          <Botao rotulo={t('paginas.notificacoes.textos.erro')} severidade="err" aparencia="contorno" onClick={() => toast.err(t('paginas.notificacoes.textos.falhaAoSalvar'), t('paginas.notificacoes.textos.tenteNovamente'))} />
          <Botao
            rotulo={t('paginas.notificacoes.textos.semFecharSozinho')}
            severidade="secundario"
            aparencia="contorno"
            onClick={() => toast.mostrar({ severidade: 'info', titulo: t('paginas.notificacoes.textos.importacaoEmAndamento'), detalhe: t('paginas.notificacoes.textos.fecheNoQuandoQuiser'), duracao: 0 })}
          />
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.notificacoes.secoes.confirmacoes')} descricao={t('paginas.notificacoes.textos.useconfirmacaoDevolveUmaPromise')}>
        <div className="demo-linha">
          <Botao
            rotulo={t('paginas.notificacoes.textos.confirmar')}
            severidade="secundario"
            onClick={async () => {
              const ok = await confirmar({ titulo: t('paginas.notificacoes.textos.enviarPedidoAoCliente'), mensagem: t('paginas.notificacoes.textos.oClienteRecebeO'), rotuloAceitar: tc('Enviar') });
              toast.info(ok ? t('paginas.notificacoes.textos.confirmado') : t('paginas.notificacoes.textos.cancelado'));
            }}
          />
          <Botao
            rotulo={t('paginas.notificacoes.textos.confirmarRemover')}
            icone="trash-2"
            severidade="err"
            aparencia="contorno"
            onClick={async () => toast.info((await confirmar.remover({ mensagem: t('paginas.notificacoes.textos.fiatStradaQbx7h42') })) ? t('paginas.notificacoes.textos.removido') : t('paginas.notificacoes.textos.cancelado'))}
          />
          <Botao
            rotulo={t('paginas.notificacoes.textos.confirmarAvisar')}
            icone="info"
            severidade="secundario"
            onClick={() => confirmar.avisar({ titulo: t('paginas.notificacoes.textos.prazoEncerrado'), mensagem: t('paginas.notificacoes.textos.oPeriodoDeRecursos'), severidade: 'warn' })}
          />
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.notificacoes.secoes.carregandoBloqueante')} descricao={t('paginas.notificacoes.textos.cobreATelaInteira')}>
          <div>
            <Botao
              rotulo={t('paginas.notificacoes.textos.processar')}
              icone="refresh-cw"
              severidade="secundario"
              onClick={() => {
                setBloqueio(true);
                setTimeout(() => setBloqueio(false), 1800);
              }}
            />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.notificacoes.secoes.estadoVazio')} descricao={t('paginas.notificacoes.textos.quandoAListaNao')}>
          <Vazio titulo={t('paginas.notificacoes.textos.nenhumItemNoPedido')} descricao={t('paginas.notificacoes.textos.adicioneOsProdutosQue')}>
            <Botao rotulo={t('paginas.notificacoes.textos.adicionarItem')} icone="plus" onClick={() => toast.info(t('paginas.notificacoes.textos.adicionarItem'))} />
          </Vazio>
        </Bloco>
      </div>

      {bloqueio && <Carregando bloqueante mensagem={t('paginas.notificacoes.textos.processando')} />}
    </div>
  );
}
