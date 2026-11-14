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
import { useT } from '../../i18n/useT';

const TAMANHOS_DIALOGO: { valor: TamanhoDialogo; rotulo: string; largura: string }[] = [
  { valor: 'pequeno', rotulo: 'Pequeno', largura: '28rem (448px)' },
  { valor: 'medio', rotulo: 'Médio', largura: '42rem (672px)' },
  { valor: 'grande', rotulo: 'Grande', largura: '60rem (960px)' },
  { valor: 'full', rotulo: 'Tela cheia', largura: '96% da tela × 90% de altura' },
];

export function PaginaDialogos() {
  const { t: tx } = useT();
  const { t } = useT();
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
      <CabecalhoPagina titulo={t('paginas.dialogos.titulo')} icone="app-window" trilha />

      <Bloco titulo={t('paginas.dialogos.secoes.tamanhosTomEFechamento')} descricao={t('paginas.dialogos.textos.escolhaOTomDo')}>
        <div className="demo-linha">
          <Escolha
            rotulo={t('paginas.dialogos.textos.tomDoCabecalho')}
            opcoes={[
              { valor: 'claro', rotulo: t('paginas.dialogos.textos.claro') },
              { valor: 'escuro', rotulo: t('paginas.dialogos.textos.escuro') },
            ]}
            valor={dlgTom}
            aoMudar={setDlgTom}
          />
          <CampoMarcacao aparencia="chave" rotulo={t('paginas.dialogos.textos.fecharComEscOu')} valor={dlgDispensavel} aoMudar={setDlgDispensavel} />
        </div>
        <div className="demo-linha">
          {TAMANHOS_DIALOGO.map((t) => (
            <Botao key={t.valor} rotulo={t.rotulo} icone="app-window" severidade="secundario" onClick={() => setDlgTamanho(t.valor)} />
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.dialogos.secoes.detalhesDoRegistro')} descricao={t('paginas.dialogos.textos.conteudoSoDeLeitura')}>
          <div>
            <Botao rotulo={t('paginas.dialogos.textos.verPedido')} icone="shopping-cart" severidade="secundario" onClick={() => setDetalhes(true)} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.dialogos.secoes.formularioEmModal')} descricao={<>Form com arranjo=&quot;modal&quot;: seções, Cancelar e Salvar prontos.</>}>
          <div>
            <Botao rotulo={t('paginas.dialogos.textos.novoProduto')} icone="plus" severidade="secundario" onClick={() => setFormModal(true)} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.dialogos.secoes.painelLateral')} descricao={<>aparencia=&quot;lateral&quot; desliza da direita.</>}>
          <div>
            <Botao rotulo={t('paginas.dialogos.textos.notificacoes')} icone="panel-right" severidade="secundario" onClick={() => setLateral(true)} />
          </div>
        </Bloco>
      </div>

      <Dialogo
        aberto={detalhes}
        aoFechar={() => setDetalhes(false)}
        titulo={t('paginas.dialogos.textos.detalhesDoPedido')}
        icone="shopping-cart"
        rodape={
          <>
            <Botao rotulo={t('paginas.dialogos.textos.fechar')} severidade="secundario" onClick={() => setDetalhes(false)} />
            <Botao rotulo={t('paginas.dialogos.textos.editar')} icone="pencil" onClick={() => setDetalhes(false)} />
          </>
        }
      >
        <div className="demo-grade">
          <Detalhes rotulo={t('paginas.dialogos.textos.pedido')} valor="PED-2026-0042" />
          <Detalhes rotulo={t('paginas.dialogos.textos.cliente')} valor="Mercado Bom Preço" />
          <Detalhes rotulo={t('paginas.dialogos.textos.pagamento')} valor="Pix" />
          <Detalhes rotulo={t('paginas.dialogos.textos.itens')} valor="16" />
          <Detalhes rotulo={t('paginas.dialogos.textos.entrega')} valor="15/11/2026" />
          <Detalhes rotulo={t('paginas.dialogos.textos.situacao')}>
            <Status rotulo={t('paginas.dialogos.textos.pago')} severidade="info" />
          </Detalhes>
        </div>
      </Dialogo>

      <Form
        arranjo="modal"
        aberto={formModal}
        titulo={t('paginas.dialogos.textos.novoProduto')}
        icone="package"
        tamanho="medio"
        aoCancelar={() => setFormModal(false)}
        aoSalvar={() => {
          setFormModal(false);
          toast.ok(t('paginas.dialogos.textos.produtoSalvo'));
        }}
      >
        <FormSecao legenda={t('paginas.dialogos.secoes.dadosProduto')} icone="package">
          <CampoTexto className="lp-col-2" rotulo={t('paginas.dialogos.textos.nomeDoProduto')} obrigatorio />
          <CampoSelect
            rotulo={t('paginas.dialogos.textos.categoria')}
            opcoes={[
              { valor: 'ali', rotulo: t('paginas.dialogos.textos.alimentos') },
              { valor: 'beb', rotulo: t('paginas.dialogos.textos.bebidas') },
              { valor: 'lim', rotulo: t('paginas.dialogos.textos.limpeza') },
            ]}
          />
        </FormSecao>
        <FormSecao legenda={t('paginas.dialogos.secoes.variacoes')} icone="list" acoes={<Botao rotulo={t('paginas.dialogos.textos.adicionar')} icone="plus" severidade="secundario" aparencia="texto" />}>
          <CampoTexto className="lp-col-full" rotulo={t('paginas.dialogos.textos.tamanhoOuSabor')} />
        </FormSecao>
      </Form>

      <Dialogo
        aberto={lateral}
        aoFechar={() => setLateral(false)}
        aparencia="lateral"
        tamanho="pequeno"
        titulo={t('paginas.dialogos.textos.notificacoes')}
        icone="bell"
        rodape={<Botao rotulo={t('paginas.dialogos.textos.marcarTodasComoLidas')} severidade="secundario" onClick={() => setLateral(false)} />}
      >
        <div className="demo-pilha-p">
          {['Pagamento confirmado — PED-2026-0042', 'Novo cliente cadastrado', 'Estoque baixo — Café 500 g', 'Entrega concluída — PED-2026-0038'].map((t, i) => (
            <Card key={t}>
              <div className="demo-card-titulo" style={{ marginBottom: 0 }}>
                {t}
              </div>
              <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--t4)' }}>{tx('paginas.dialogos.textos.haNMin', { n: i * 15 + 5 })}</span>
            </Card>
          ))}
        </div>
      </Dialogo>

      <Dialogo
        aberto={!!dlgAtual}
        aoFechar={() => setDlgTamanho(null)}
        titulo={t('paginas.dialogos.textos.dialogoV', { v: dlgAtual?.rotulo.toLowerCase() ?? '' })}
        icone="app-window"
        tamanho={dlgTamanho ?? 'medio'}
        tom={dlgTom}
        dispensavel={dlgDispensavel}
        rodape={
          <>
            <Botao rotulo={t('paginas.dialogos.textos.cancelar')} severidade="secundario" onClick={() => setDlgTamanho(null)} />
            <Botao rotulo={t('paginas.dialogos.textos.confirmar')} icone="check" onClick={() => setDlgTamanho(null)} />
          </>
        }
      >
        <div className="demo-pilha-p">
          <code>
            {`<Dialogo tamanho="${dlgTamanho}"${dlgTom === 'escuro' ? ' tom="escuro"' : ''}${dlgDispensavel ? '' : ' dispensavel={false}'} />`}
          </code>
          <div className="demo-grade">
            <Detalhes rotulo={t('paginas.dialogos.textos.tamanho')} valor={dlgAtual?.rotulo} />
            <Detalhes rotulo={t('paginas.dialogos.textos.larguraMaxima')} valor={dlgAtual?.largura} />
            <Detalhes rotulo={t('paginas.dialogos.textos.tom')} valor={dlgTom === 'escuro' ? 'Escuro' : 'Claro'} />
            <Detalhes rotulo={t('paginas.dialogos.textos.escCliqueFora')} valor={dlgDispensavel ? 'Fecha' : 'Não fecha'} />
          </div>
        </div>
      </Dialogo>
    </div>
  );
}
