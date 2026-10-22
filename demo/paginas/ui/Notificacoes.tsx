import { useState } from 'react';
import { Botao, CabecalhoPagina, Carregando, Vazio, useConfirmacao, useToast } from '../../../src';
import { Bloco } from '../Bloco';

export function PaginaNotificacoes() {
  const toast = useToast();
  const confirmar = useConfirmacao();
  const [bloqueio, setBloqueio] = useState(false);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Notificações" icone="bell" trilha />

      <Bloco titulo="Toasts" descricao="Aparecem no canto e somem sozinhos; o × fecha antes.">
        <div className="demo-linha">
          <Botao rotulo="Sucesso" severidade="ok" aparencia="contorno" onClick={() => toast.ok('Registro salvo', 'As alterações foram gravadas.')} />
          <Botao rotulo="Informação" aparencia="contorno" onClick={() => toast.info('Sincronizando…')} />
          <Botao rotulo="Atenção" severidade="warn" aparencia="contorno" onClick={() => toast.warn('Sessão expira em 5 minutos')} />
          <Botao rotulo="Erro" severidade="err" aparencia="contorno" onClick={() => toast.err('Falha ao salvar', 'Tente novamente.')} />
          <Botao
            rotulo="Sem fechar sozinho"
            severidade="secundario"
            aparencia="contorno"
            onClick={() => toast.mostrar({ severidade: 'info', titulo: 'Importação em andamento', detalhe: 'Feche no × quando quiser.', duracao: 0 })}
          />
        </div>
      </Bloco>

      <Bloco titulo="Confirmações" descricao="useConfirmacao() devolve uma Promise com a resposta.">
        <div className="demo-linha">
          <Botao
            rotulo="confirmar()"
            severidade="secundario"
            onClick={async () => {
              const ok = await confirmar({ titulo: 'Enviar pedido ao cliente?', mensagem: 'O cliente recebe o resumo por e-mail.', rotuloAceitar: 'Enviar' });
              toast.info(ok ? 'Confirmado' : 'Cancelado');
            }}
          />
          <Botao
            rotulo="confirmar.remover()"
            icone="trash-2"
            severidade="err"
            aparencia="contorno"
            onClick={async () => toast.info((await confirmar.remover({ mensagem: '"Fiat Strada QBX-7H42" será removido definitivamente.' })) ? 'Removido' : 'Cancelado')}
          />
          <Botao
            rotulo="confirmar.avisar()"
            icone="info"
            severidade="secundario"
            onClick={() => confirmar.avisar({ titulo: 'Prazo encerrado', mensagem: 'O período de recursos terminou ontem.', severidade: 'warn' })}
          />
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo="Carregando bloqueante" descricao="Cobre a tela inteira enquanto a operação roda.">
          <div>
            <Botao
              rotulo="Processar"
              icone="refresh-cw"
              severidade="secundario"
              onClick={() => {
                setBloqueio(true);
                setTimeout(() => setBloqueio(false), 1800);
              }}
            />
          </div>
        </Bloco>
        <Bloco titulo="Estado vazio" descricao="Quando a lista não tem nada para mostrar.">
          <Vazio titulo="Nenhum item no pedido" descricao="Adicione os produtos que o cliente comprou.">
            <Botao rotulo="Adicionar item" icone="plus" onClick={() => toast.info('Adicionar item')} />
          </Vazio>
        </Bloco>
      </div>

      {bloqueio && <Carregando bloqueante mensagem="Processando" />}
    </div>
  );
}
