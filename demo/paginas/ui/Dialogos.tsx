import { useState } from 'react';
import {
  Botao,
  CabecalhoPagina,
  CampoMarcacao,
  CampoSelect,
  CampoTexto,
  Card,
  Detalhes,
  Dialogo,
  Escolha,
  Form,
  FormSecao,
  Status,
  useToast,
  type TamanhoDialogo,
} from '../../../src';
import { Bloco } from '../Bloco';

const TAMANHOS_DIALOGO: { valor: TamanhoDialogo; rotulo: string; largura: string }[] = [
  { valor: 'pequeno', rotulo: 'Pequeno', largura: '28rem (448px)' },
  { valor: 'medio', rotulo: 'Médio', largura: '42rem (672px)' },
  { valor: 'grande', rotulo: 'Grande', largura: '60rem (960px)' },
  { valor: 'full', rotulo: 'Tela cheia', largura: '96% da tela × 90% de altura' },
];

export function PaginaDialogos() {
  const toast = useToast();
  const [detalhes, setDetalhes] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [lateral, setLateral] = useState(false);
  const [dlgTamanho, setDlgTamanho] = useState<TamanhoDialogo | null>(null);
  const [dlgTom, setDlgTom] = useState<'claro' | 'escuro'>('claro');
  const [dlgDispensavel, setDlgDispensavel] = useState(true);
  const dlgAtual = TAMANHOS_DIALOGO.find((t) => t.valor === dlgTamanho);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Diálogos" icone="app-window" trilha />

      <Bloco titulo="Tamanhos, tom e fechamento" descricao="Escolha o tom do cabeçalho e se Esc ou o clique fora fecham; depois abra um dos tamanhos.">
        <div className="demo-linha">
          <Escolha
            rotulo="Tom do cabeçalho"
            opcoes={[
              { valor: 'claro', rotulo: 'Claro' },
              { valor: 'escuro', rotulo: 'Escuro' },
            ]}
            valor={dlgTom}
            aoMudar={setDlgTom}
          />
          <CampoMarcacao aparencia="chave" rotulo="Fechar com Esc ou clique fora" valor={dlgDispensavel} aoMudar={setDlgDispensavel} />
        </div>
        <div className="demo-linha">
          {TAMANHOS_DIALOGO.map((t) => (
            <Botao key={t.valor} rotulo={t.rotulo} icone="app-window" severidade="secundario" onClick={() => setDlgTamanho(t.valor)} />
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo="Detalhes do registro" descricao="Conteúdo só de leitura, com ações no rodapé.">
          <div>
            <Botao rotulo="Ver pedido" icone="shopping-cart" severidade="secundario" onClick={() => setDetalhes(true)} />
          </div>
        </Bloco>
        <Bloco titulo="Formulário em modal" descricao={<>Form com arranjo=&quot;modal&quot;: seções, Cancelar e Salvar prontos.</>}>
          <div>
            <Botao rotulo="Novo produto" icone="plus" severidade="secundario" onClick={() => setFormModal(true)} />
          </div>
        </Bloco>
        <Bloco titulo="Painel lateral" descricao={<>aparencia=&quot;lateral&quot; desliza da direita.</>}>
          <div>
            <Botao rotulo="Notificações" icone="panel-right" severidade="secundario" onClick={() => setLateral(true)} />
          </div>
        </Bloco>
      </div>

      <Dialogo
        aberto={detalhes}
        aoFechar={() => setDetalhes(false)}
        titulo="Detalhes do pedido"
        icone="shopping-cart"
        rodape={
          <>
            <Botao rotulo="Fechar" severidade="secundario" onClick={() => setDetalhes(false)} />
            <Botao rotulo="Editar" icone="pencil" onClick={() => setDetalhes(false)} />
          </>
        }
      >
        <div className="demo-grade">
          <Detalhes rotulo="Pedido" valor="PED-2026-0042" />
          <Detalhes rotulo="Cliente" valor="Mercado Bom Preço" />
          <Detalhes rotulo="Pagamento" valor="Pix" />
          <Detalhes rotulo="Itens" valor="16" />
          <Detalhes rotulo="Entrega" valor="15/11/2026" />
          <Detalhes rotulo="Situação">
            <Status rotulo="Pago" severidade="info" />
          </Detalhes>
        </div>
      </Dialogo>

      <Form
        arranjo="modal"
        aberto={formModal}
        titulo="Novo produto"
        icone="package"
        tamanho="medio"
        aoCancelar={() => setFormModal(false)}
        aoSalvar={() => {
          setFormModal(false);
          toast.ok('Produto salvo');
        }}
      >
        <FormSecao legenda="Dados do produto" icone="package">
          <CampoTexto className="lp-col-2" rotulo="Nome do produto" obrigatorio />
          <CampoSelect
            rotulo="Categoria"
            opcoes={[
              { valor: 'ali', rotulo: 'Alimentos' },
              { valor: 'beb', rotulo: 'Bebidas' },
              { valor: 'lim', rotulo: 'Limpeza' },
            ]}
          />
        </FormSecao>
        <FormSecao legenda="Variações" icone="list" acoes={<Botao rotulo="Adicionar" icone="plus" severidade="secundario" aparencia="texto" />}>
          <CampoTexto className="lp-col-full" rotulo="Tamanho ou sabor" />
        </FormSecao>
      </Form>

      <Dialogo
        aberto={lateral}
        aoFechar={() => setLateral(false)}
        aparencia="lateral"
        tamanho="pequeno"
        titulo="Notificações"
        icone="bell"
        rodape={<Botao rotulo="Marcar todas como lidas" severidade="secundario" onClick={() => setLateral(false)} />}
      >
        <div className="demo-pilha-p">
          {['Pagamento confirmado — PED-2026-0042', 'Novo cliente cadastrado', 'Estoque baixo — Café 500 g', 'Entrega concluída — PED-2026-0038'].map((t, i) => (
            <Card key={t}>
              <div className="demo-card-titulo" style={{ marginBottom: 0 }}>
                {t}
              </div>
              <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--t4)' }}>há {i * 15 + 5} min</span>
            </Card>
          ))}
        </div>
      </Dialogo>

      <Dialogo
        aberto={!!dlgAtual}
        aoFechar={() => setDlgTamanho(null)}
        titulo={`Diálogo ${dlgAtual?.rotulo.toLowerCase() ?? ''}`}
        icone="app-window"
        tamanho={dlgTamanho ?? 'medio'}
        tom={dlgTom}
        dispensavel={dlgDispensavel}
        rodape={
          <>
            <Botao rotulo="Cancelar" severidade="secundario" onClick={() => setDlgTamanho(null)} />
            <Botao rotulo="Confirmar" icone="check" onClick={() => setDlgTamanho(null)} />
          </>
        }
      >
        <div className="demo-pilha-p">
          <code>
            {`<Dialogo tamanho="${dlgTamanho}"${dlgTom === 'escuro' ? ' tom="escuro"' : ''}${dlgDispensavel ? '' : ' dispensavel={false}'} />`}
          </code>
          <div className="demo-grade">
            <Detalhes rotulo="Tamanho" valor={dlgAtual?.rotulo} />
            <Detalhes rotulo="Largura máxima" valor={dlgAtual?.largura} />
            <Detalhes rotulo="Tom" valor={dlgTom === 'escuro' ? 'Escuro' : 'Claro'} />
            <Detalhes rotulo="Esc / clique fora" valor={dlgDispensavel ? 'Fecha' : 'Não fecha'} />
          </div>
        </div>
      </Dialogo>
    </div>
  );
}
