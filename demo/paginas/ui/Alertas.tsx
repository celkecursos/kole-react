import { useState } from 'react';
import { Alerta, Avatar, Botao, CabecalhoPagina, type CorAlerta } from '../../../src';
import { Bloco, retrato } from '../Bloco';

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

const PESSOAS = [
  { nome: 'Ana Pereira', cor: '#1f5fe0' },
  { nome: 'Bruno Lima', cor: '#f7931e' },
  { nome: 'Carla Dias', cor: '#15803d' },
  { nome: 'Daniel Moreira', cor: '#b42318' },
];

export function PaginaAlertas() {
  const [vivos, setVivos] = useState<number[]>([]);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Alertas" icone="triangle-alert" trilha />

      <div className="demo-colunas">
        <Bloco titulo="Padrão">
          {CORES.map((c) => (
            <Alerta key={c.cor} severidade={c.cor} icone={false} mensagem={`Um alerta ${c.nome} simples — confira!`} />
          ))}
        </Bloco>

        <Bloco titulo="Com links">
          {CORES.map((c) => (
            <Alerta key={c.cor} severidade={c.cor} icone={false}>
              Um alerta {c.nome} com <a href="#/ui/alertas">um link de exemplo</a>. Clique se quiser.
            </Alerta>
          ))}
        </Bloco>

        <Bloco titulo="Sólidos">
          {CORES.map((c) => (
            <Alerta key={c.cor} severidade={c.cor} aparencia="solido" icone={false} dispensavel mensagem={`Um alerta sólido ${c.nome} — confira!`} />
          ))}
        </Bloco>

        <Bloco titulo="Contorno">
          {CORES.map((c) => (
            <Alerta key={c.cor} severidade={c.cor} aparencia="contorno" icone={false} dispensavel mensagem={`Um alerta de contorno ${c.nome} — confira!`} />
          ))}
        </Bloco>

        <Bloco titulo="Dispensável" descricao="O “×” tira o alerta da tela.">
          <Alerta severidade="warn" icone={false} dispensavel>
            <strong>Atenção!</strong> Revise os campos de entrega antes de enviar o pedido.
          </Alerta>
        </Bloco>

        <Bloco titulo="Exemplo ao vivo" descricao="Cada clique cria um alerta novo; o “×” remove.">
          <div>
            <Botao rotulo="Mostrar alerta" icone="plus" onClick={() => setVivos((l) => [...l, Date.now()])} />
          </div>
          {vivos.map((id, i) => (
            <Alerta
              key={id}
              severidade="ok"
              icone="circle-check"
              mensagem={`Pedido PED-2026-${String(60 + i).padStart(4, '0')} salvo com sucesso.`}
              aoFechar={() => setVivos((l) => l.filter((x) => x !== id))}
            />
          ))}
        </Bloco>

        <Bloco titulo="Arredondados sólidos">
          {PRINCIPAIS.map((c) => (
            <Alerta key={c.cor} severidade={c.cor} aparencia="solido" formato="pilula" icone={false} dispensavel mensagem={`Um alerta sólido arredondado ${c.nome} — confira!`} />
          ))}
        </Bloco>

        <Bloco titulo="Arredondados de contorno">
          {PRINCIPAIS.map((c) => (
            <Alerta key={c.cor} severidade={c.cor} aparencia="contorno" formato="pilula" icone={false} dispensavel mensagem={`Um alerta de contorno arredondado ${c.nome} — confira!`} />
          ))}
        </Bloco>

        <Bloco titulo="Sólidos com sombras">
          {(['pri', 'destaque'] as const).flatMap((cor) =>
            (['pequena', 'media', 'grande'] as const).map((s) => (
              <Alerta key={cor + s} severidade={cor} aparencia="solido" sombra={s} icone={false} dispensavel mensagem={`Um alerta sólido com sombra ${s}.`} />
            )),
          )}
        </Bloco>

        <Bloco titulo="Padrão com sombras">
          {(['pri', 'destaque'] as const).flatMap((cor) =>
            (['pequena', 'media', 'grande'] as const).map((s) => (
              <Alerta key={cor + s} severidade={cor} sombra={s} icone={false} mensagem={`Um alerta com sombra ${s}.`} />
            )),
          )}
        </Bloco>

        <Bloco titulo="Arredondados padrão">
          {PRINCIPAIS.map((c) => (
            <Alerta key={c.cor} severidade={c.cor} formato="pilula" icone={false} dispensavel mensagem={`Um alerta arredondado ${c.nome} — confira!`} />
          ))}
        </Bloco>

        <Bloco titulo="Arredondados com “×” destacado">
          {PRINCIPAIS.map((c) => (
            <Alerta
              key={c.cor}
              severidade={c.cor}
              formato="pilula"
              icone={false}
              dispensavel
              botaoFechar="circulo"
              mensagem={`Um alerta arredondado ${c.nome} — confira!`}
            />
          ))}
        </Bloco>

        <Bloco titulo="Com ícones">
          <Alerta severidade="pri" mensagem="Um alerta de exemplo com ícone." />
          <Alerta severidade="ok" mensagem="Pagamento confirmado." />
          <Alerta severidade="warn" mensagem="Estoque de café abaixo do mínimo." />
          <Alerta severidade="err" mensagem="Falha ao emitir a nota fiscal." />
        </Bloco>

        <Bloco titulo="Destaque (borda lateral)">
          <Alerta severidade="pri" aparencia="destaque" sombra="pequena" dispensavel mensagem="Um alerta principal com ícone." />
          <Alerta severidade="ok" aparencia="destaque" sombra="pequena" dispensavel mensagem="Um alerta de sucesso com ícone." />
          <Alerta severidade="warn" aparencia="destaque" sombra="pequena" dispensavel mensagem="Um alerta de atenção com ícone." />
          <Alerta severidade="err" aparencia="destaque" sombra="pequena" dispensavel mensagem="Um alerta de erro com ícone." />
        </Bloco>

        <Bloco titulo="Com imagem">
          {PESSOAS.map((p, i) => (
            <Alerta
              key={p.nome}
              severidade={PRINCIPAIS[i].cor}
              formato="pilula"
              dispensavel
              midia={<Avatar nome={p.nome} foto={retrato(p.cor, p.nome[0])} tamanho="1.75rem" />}
              mensagem={`${p.nome} comentou no pedido PED-2026-00${42 + i}.`}
            />
          ))}
        </Bloco>

        <Bloco titulo="Com imagens de tamanhos diferentes">
          {PESSOAS.map((p, i) => (
            <Alerta
              key={p.nome}
              severidade={PRINCIPAIS[i].cor}
              dispensavel
              midia={<Avatar nome={p.nome} foto={retrato(p.cor, p.nome[0])} formato="quadrado" tamanho={`${1.5 + i * 0.5}rem`} />}
              mensagem={`${p.nome} atualizou o cadastro do cliente.`}
            />
          ))}
        </Bloco>
      </div>

      <div className="demo-colunas-4">
        <Alerta
          severidade="pri"
          aparencia="solido"
          titulo="Alerta informativo"
          mensagem="Há uma nova versão da tabela de preços."
          dispensavel
          acoes={
            <>
              <a href="#/ui/alertas">Agora não</a>
              <a href="#/ui/alertas">Abrir</a>
            </>
          }
        />
        <Alerta severidade="destaque" aparencia="solido" titulo="Alerta de destaque" mensagem="Meta do mês atingida em 92%." dispensavel acoes={<a href="#/ui/alertas">Fechar</a>} />
        <Alerta
          severidade="warn"
          aparencia="solido"
          titulo="Alerta de atenção"
          mensagem="3 pedidos sem confirmação de pagamento."
          dispensavel
          acoes={
            <>
              <a href="#/ui/alertas">Ignorar</a>
              <a href="#/pedidos">Ver</a>
            </>
          }
        />
        <Alerta
          severidade="err"
          aparencia="solido"
          titulo="Alerta de erro"
          mensagem="A integração com o banco falhou."
          dispensavel
          acoes={
            <>
              <a href="#/ui/alertas">Fechar</a>
              <a href="#/ui/alertas">Tentar de novo</a>
            </>
          }
        />
        <Alerta
          severidade="pri"
          aparencia="contorno"
          titulo="Alerta informativo"
          mensagem="Há uma nova versão da tabela de preços."
          dispensavel
          acoes={
            <>
              <a href="#/ui/alertas">Agora não</a>
              <a href="#/ui/alertas">Abrir</a>
            </>
          }
        />
        <Alerta severidade="ok" aparencia="contorno" titulo="Alerta de sucesso" mensagem="Backup diário concluído." dispensavel acoes={<a href="#/ui/alertas">Fechar</a>} />
        <Alerta
          severidade="warn"
          aparencia="contorno"
          titulo="Alerta de atenção"
          mensagem="O certificado digital vence em 10 dias."
          dispensavel
          acoes={
            <>
              <a href="#/ui/alertas">Depois</a>
              <a href="#/ui/alertas">Renovar</a>
            </>
          }
        />
        <Alerta
          severidade="err"
          aparencia="contorno"
          titulo="Alerta de erro"
          mensagem="Não foi possível enviar o e-mail ao cliente."
          dispensavel
          acoes={
            <>
              <a href="#/ui/alertas">Fechar</a>
              <a href="#/ui/alertas">Reenviar</a>
            </>
          }
        />
      </div>

      <Bloco titulo="Conteúdo adicional">
        <div className="demo-colunas">
          {(['pri', 'destaque', 'ok', 'warn'] as const).map((cor) => (
            <Alerta key={cor} severidade={cor} aparencia="faixa" icone={false} titulo="Obrigado por avisar." dispensavel>
              Recebemos o relato do problema na emissão do pedido e já estamos analisando.{' '}
              <a href="#/ui/alertas">Acompanhe pelo suporte</a>.
            </Alerta>
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas-4">
        <Alerta
          severidade="pri"
          aparencia="cartao"
          icone="info"
          titulo="Informação"
          mensagem="Este alerta mostra uma informação relacionada à tela."
          dispensavel
          acoes={
            <>
              <Botao rotulo="Recusar" severidade="err" aparencia="contorno" />
              <Botao rotulo="Aceitar" />
            </>
          }
        />
        <Alerta
          severidade="ok"
          aparencia="cartao"
          titulo="Confirmado"
          mensagem="Este alerta confirma que a operação foi concluída."
          dispensavel
          acoes={<Botao rotulo="Fechar" severidade="ok" />}
        />
        <Alerta
          severidade="warn"
          aparencia="cartao"
          titulo="Atenção"
          mensagem="Este alerta avisa sobre algo que precisa de cuidado."
          dispensavel
          acoes={
            <>
              <Botao rotulo="Voltar" severidade="secundario" aparencia="contorno" />
              <Botao rotulo="Continuar" severidade="warn" />
            </>
          }
        />
        <Alerta
          severidade="err"
          aparencia="cartao"
          icone="circle-alert"
          titulo="Erro"
          mensagem="Este alerta avisa sobre uma ação que não pode ser desfeita."
          dispensavel
          acoes={<Botao rotulo="Excluir" icone="trash-2" severidade="err" />}
        />
      </div>
    </div>
  );
}
