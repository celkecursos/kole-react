import { Aba, Abas, Avatar, Badge, CabecalhoPagina, Detalhes, ItemLista, Lista } from '../../../src';
import { Bloco, retrato } from '../Bloco';
import { useT } from '../../i18n/useT';

const TEXTOS = [
  'Como um bom atendimento ajuda a vender mais. Clientes satisfeitos voltam, indicam a loja e compram com mais frequência. Pequenos cuidados no pós-venda fazem diferença no fim do mês.',
  'Por que o controle de estoque importa. Sem saber o que entra e o que sai, a loja compra demais o que encalha e de menos o que vende. Um inventário semanal resolve boa parte disso.',
  'Dicas para organizar a equipe. Metas claras, rotina de reuniões curtas e um quadro de tarefas visível ajudam todo mundo a saber o que fazer e quando.',
  'Como planejar promoções sem perder margem. Defina o desconto máximo antes, escolha produtos com estoque alto e acompanhe o resultado dia a dia.',
];

function Texto({ n = 0, paragrafos = 1 }: { n?: number; paragrafos?: number }) {
  return (
    <div className="demo-abas-texto">
      {Array.from({ length: paragrafos }, (_, i) => (
        <p key={i}>{TEXTOS[(n + i) % TEXTOS.length]}</p>
      ))}
    </div>
  );
}

/** As 4 abas de exemplo (Início, Sobre, Serviços, Contato), cada uma com um texto. */
function abasPadrao(icones = false, paragrafos = 1) {
  return [
    ['inicio', 'Início', 'house'],
    ['sobre', 'Sobre', 'info'],
    ['servicos', 'Serviços', 'briefcase'],
    ['contato', 'Contato', 'phone'],
  ].map(([valor, rotulo, icone], i) => (
    <Aba key={valor} valor={valor} rotulo={rotulo} icone={icones ? icone : undefined}>
      <Texto n={i} paragrafos={paragrafos} />
    </Aba>
  ));
}

export function PaginaAbasNavegacao() {
  const { t } = useT();
  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.abas.titulo')} icone="panel-right" trilha />

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.abas.secoes.abasEstaticas')} descricao={t('paginas.abas.textos.soABarraSem')}>
          <Abas variante="classica" rotulo={t('paginas.abas.textos.abasEstaticas')}>
            <Aba valor="ativa" rotulo={t('paginas.abas.textos.ativa')} />
            <Aba valor="link1" rotulo={t('paginas.abas.textos.link')} />
            <Aba valor="link2" rotulo={t('paginas.abas.textos.outroLink')} />
            <Aba valor="desab" rotulo={t('paginas.abas.textos.desabilitada')} desabilitada />
          </Abas>
        </Bloco>
        <Bloco titulo={t('paginas.abas.secoes.pilulasEstaticas')}>
          <Abas variante="pilulas" rotulo={t('paginas.abas.textos.pilulasEstaticas')}>
            <Aba valor="ativa" rotulo={t('paginas.abas.textos.ativa')} />
            <Aba valor="link1" rotulo={t('paginas.abas.textos.link')} />
            <Aba valor="link2" rotulo={t('paginas.abas.textos.outroLink')} />
            <Aba valor="desab" rotulo={t('paginas.abas.textos.desabilitada')} desabilitada />
          </Abas>
        </Bloco>

        <Bloco titulo={t('paginas.abas.secoes.pilulasComBadges')}>
          <Abas variante="pilulas" painel="caixa" rotulo={t('paginas.abas.textos.loja')}>
            <Aba valor="produtos" rotulo={t('paginas.abas.textos.produtos')}>
              <Texto n={0} />
            </Aba>
            <Aba valor="carrinho" rotulo={t('paginas.abas.textos.carrinho')} badge={<Badge cor="err" formato="pilula" rotulo="32" />}>
              <Texto n={1} />
            </Aba>
            <Aba valor="pedidos" rotulo={t('paginas.abas.textos.pedidos')} badge={<Badge cor="ok" formato="pilula" rotulo="4" />}>
              <Texto n={2} />
            </Aba>
            <Aba valor="ofertas" rotulo={t('paginas.abas.textos.ofertas')}>
              <Texto n={3} />
            </Aba>
          </Abas>
        </Bloco>
        <Bloco titulo={t('paginas.abas.secoes.contornoJustificado')} descricao={t('paginas.abas.textos.todasAsAbasCom')}>
          <Abas variante="contorno" alinhamento="justificado" painel="caixa" rotulo={t('paginas.abas.textos.loja')}>
            <Aba valor="produtos" rotulo={t('paginas.abas.textos.produtos')}>
              <Texto n={1} />
            </Aba>
            <Aba valor="carrinho" rotulo={t('paginas.abas.textos.carrinho')} badge={<Badge cor="info" aparencia="suave" rotulo={t('paginas.abas.textos.cheio')} />}>
              <Texto n={2} />
            </Aba>
            <Aba valor="pedidos" rotulo={t('paginas.abas.textos.pedidos')}>
              <Texto n={3} />
            </Aba>
            <Aba valor="ofertas" rotulo={t('paginas.abas.textos.ofertas')} pendentes={7}>
              <Texto n={0} />
            </Aba>
          </Abas>
        </Bloco>

        <Bloco titulo={t('paginas.abas.secoes.centralizadas')}>
          <Abas variante="suave" alinhamento="centro" painel="caixa" rotulo={t('paginas.abas.textos.centralizadas')}>
            {abasPadrao()}
          </Abas>
        </Bloco>
        <Bloco titulo={t('paginas.abas.secoes.aDireita')}>
          <Abas variante="sublinhado" alinhamento="fim" painel="caixa" rotulo={t('paginas.abas.textos.aDireita')}>
            {abasPadrao()}
          </Abas>
        </Bloco>

        <Bloco titulo={t('paginas.abas.secoes.abasNoCabecalho')} descricao={t('paginas.abas.textos.tituloEAbasNa')}>
          <Abas variante="suave" cabecalho={t('paginas.abas.textos.relatorio')} painel="caixa" rotulo={t('paginas.abas.textos.secoesDoRelatorio')}>
            <Aba valor="inicio" rotulo={t('paginas.abas.textos.inicio')}>
              <Texto n={0} paragrafos={2} />
            </Aba>
            <Aba valor="sobre" rotulo={t('paginas.abas.textos.sobre')}>
              <Texto n={1} paragrafos={2} />
            </Aba>
            <Aba valor="servicos" rotulo={t('paginas.abas.textos.servicos')}>
              <Texto n={2} paragrafos={2} />
            </Aba>
          </Abas>
        </Bloco>
        <Bloco titulo={t('paginas.abas.secoes.abasNoRodape')} descricao={t('paginas.abas.textos.aBarraFicaAbaixo')}>
          <Abas variante="contorno" alinhamento="fim" posicaoBarra="base" painel="caixa" rotulo={t('paginas.abas.textos.abasNoRodape')}>
            <Aba valor="inicio" rotulo={t('paginas.abas.textos.inicio')}>
              <Texto n={3} />
            </Aba>
            <Aba valor="sobre" rotulo={t('paginas.abas.textos.sobre')}>
              <Texto n={0} />
            </Aba>
            <Aba valor="servicos" rotulo={t('paginas.abas.textos.servicos')}>
              <Texto n={1} />
            </Aba>
          </Abas>
        </Bloco>

        <Bloco titulo={t('paginas.abas.secoes.abasClassicas')} descricao={t('paginas.abas.textos.aAbaAtivaSe')}>
          <Abas variante="classica" painel="caixa" rotulo={t('paginas.abas.textos.abasClassicas')}>
            {abasPadrao()}
          </Abas>
        </Bloco>
        <Bloco titulo={t('paginas.abas.secoes.justificadas')}>
          <Abas variante="suave" alinhamento="justificado" painel="caixa" rotulo={t('paginas.abas.textos.justificadas')}>
            {abasPadrao()}
          </Abas>
        </Bloco>

        <Bloco titulo={t('paginas.abas.secoes.vertical')}>
          <Abas variante="suave" orientacao="vertical" painel="caixa" rotulo={t('paginas.abas.textos.vertical')}>
            {abasPadrao(false, 2)}
          </Abas>
        </Bloco>
        <Bloco titulo={t('paginas.abas.secoes.verticalComIcones')}>
          <Abas variante="pilulas" orientacao="vertical" painel="caixa" rotulo={t('paginas.abas.textos.verticalComIcones')}>
            {abasPadrao(true, 2)}
          </Abas>
        </Bloco>

        <Bloco titulo={t('paginas.abas.secoes.blocosVerticais')} descricao={t('paginas.abas.textos.iconeEmCimaE')}>
          <Abas variante="blocos" orientacao="vertical" painel="caixa" rotulo={t('paginas.abas.textos.blocosVerticais')}>
            <Aba valor="inicio" rotulo={t('paginas.abas.textos.inicio')} icone="house">
              <Texto n={0} paragrafos={2} />
            </Aba>
            <Aba valor="sobre" rotulo={t('paginas.abas.textos.sobre')} icone="phone">
              <Texto n={1} paragrafos={2} />
            </Aba>
            <Aba valor="servicos" rotulo={t('paginas.abas.textos.servicos')} icone="briefcase">
              <Texto n={2} paragrafos={2} />
            </Aba>
          </Abas>
        </Bloco>
        <Bloco titulo={t('paginas.abas.secoes.contornoVerticalComIcone')}>
          <Abas variante="contorno" orientacao="vertical" iconeAcima painel="caixa" rotulo={t('paginas.abas.textos.equipeEClientes')}>
            <Aba valor="func" rotulo={t('paginas.abas.textos.funcionarios')} icone="map-pin">
              <Texto n={3} paragrafos={2} />
            </Aba>
            <Aba valor="clientes" rotulo={t('paginas.abas.textos.clientes')} icone="users">
              <Texto n={0} paragrafos={2} />
            </Aba>
            <Aba valor="produtos" rotulo={t('paginas.abas.textos.produtos')} icone="package">
              <Texto n={1} paragrafos={2} />
            </Aba>
          </Abas>
        </Bloco>
      </div>

      <Bloco titulo={t('paginas.abas.secoes.segmentado')} descricao={t('paginas.abas.textos.trilhoCinzaComA')}>
        <Abas variante="segmentado" painel="caixa" rotulo={t('paginas.abas.textos.situacaoDosPedidos')}>
          <Aba valor="pedidos" rotulo={t('paginas.abas.textos.pedidos')}>
            <Texto n={0} />
          </Aba>
          <Aba valor="aceitos" rotulo={t('paginas.abas.textos.aceitos')}>
            <Texto n={1} />
          </Aba>
          <Aba valor="recusados" rotulo={t('paginas.abas.textos.recusados')}>
            <Texto n={2} />
          </Aba>
        </Abas>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.abas.secoes.passos')} descricao={t('paginas.abas.textos.circulosNumeradosParaEtapas')}>
          <Abas variante="passos" alinhamento="centro" painel="caixa" rotulo={t('paginas.abas.textos.etapas')}>
            <Aba valor="inicio" rotulo={t('paginas.abas.textos.inicio')}>
              <Texto n={0} />
            </Aba>
            <Aba valor="sobre" rotulo={t('paginas.abas.textos.sobre')}>
              <Texto n={1} />
            </Aba>
            <Aba valor="servicos" rotulo={t('paginas.abas.textos.servicos')}>
              <Texto n={2} />
            </Aba>
          </Abas>
        </Bloco>
        <Bloco titulo={t('paginas.abas.secoes.sublinhadoComIconeAcima')}>
          <Abas variante="sublinhado" alinhamento="justificado" iconeAcima painel="caixa" rotulo={t('paginas.abas.textos.situacaoDaEntrega')}>
            <Aba valor="pedido" rotulo={t('paginas.abas.textos.pedido')} icone="shopping-cart">
              <Texto n={0} />
            </Aba>
            <Aba valor="confirmado" rotulo={t('paginas.abas.textos.confirmado')} icone="circle-check">
              <Texto n={1} />
            </Aba>
            <Aba valor="enviado" rotulo={t('paginas.abas.textos.enviado')} icone="package">
              <Texto n={2} />
            </Aba>
            <Aba valor="entregue" rotulo={t('paginas.abas.textos.entregue')} icone="truck">
              <Texto n={3} />
            </Aba>
          </Abas>
        </Bloco>
      </div>

      <div className="demo-colunas-3">
        <Bloco titulo={t('paginas.abas.secoes.pilulasComIcones')}>
          <Abas variante="pilulas" rotulo={t('paginas.abas.textos.catalogo')}>
            {(
              [
                ['produtos', 'Produtos', 'package'],
                ['vendas', 'Vendas', 'chart-line'],
                ['lucro', 'Lucro', 'wallet'],
                ['despesas', 'Despesas', 'credit-card'],
              ] as const
            ).map(([valor, rotulo, icone], i) => (
              <Aba key={valor} valor={valor} rotulo={rotulo} icone={icone}>
                <Lista>
                  {[
                    ['Relógio de parede', 'Decoração', 'R$ 129,00'],
                    ['Câmera compacta', 'Eletrônicos', 'R$ 1.249,00'],
                    ['Tênis de corrida', 'Calçados', 'R$ 399,00'],
                  ]
                    .slice(i % 2)
                    .map(([nome, cat, preco]) => (
                      <ItemLista key={nome} titulo={nome} fim={<strong>{preco}</strong>}>
                        {cat}
                      </ItemLista>
                    ))}
                </Lista>
              </Aba>
            ))}
          </Abas>
        </Bloco>
        <div className="demo-span-2">
          <Bloco titulo={t('paginas.abas.secoes.verticalComPerfil')}>
            <Abas variante="pilulas" orientacao="vertical" rotulo={t('paginas.abas.textos.conta')}>
              <Aba valor="perfil" rotulo={t('paginas.abas.textos.perfil')} icone="user">
                <div className="demo-abas-perfil">
                  <Avatar nome="Adão Silva" foto={retrato('#1f5fe0', 'A')} formato="quadrado" tamanho="5rem" />
                  <div>
                    <h3>{t('paginas.abas.textos.adaoSilva')}</h3>
                    <Detalhes rotulo={t('paginas.abas.textos.cargo')} valor="Designer de interfaces" disposicao="linha" />
                    <Detalhes rotulo={t('paginas.abas.textos.telefone')} valor="(11) 91234-5678" disposicao="linha" />
                    <Detalhes rotulo={t('paginas.abas.textos.eMail')} valor="adao@exemplo.com" disposicao="linha" />
                  </div>
                </div>
              </Aba>
              <Aba valor="senha" rotulo={t('paginas.abas.textos.senha')} icone="lock">
                <Texto n={1} />
              </Aba>
              <Aba valor="equipe" rotulo={t('paginas.abas.textos.equipe')} icone="users">
                <Texto n={2} />
              </Aba>
              <Aba valor="cobranca" rotulo={t('paginas.abas.textos.cobranca')} icone="credit-card">
                <Texto n={3} />
              </Aba>
              <Aba valor="email" rotulo={t('paginas.abas.textos.eMail')} icone="mail">
                <Texto n={0} />
              </Aba>
            </Abas>
          </Bloco>
        </div>
      </div>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.abas.secoes.cartao')} descricao={t('paginas.abas.textos.aAbaAtivaE')}>
          <Abas variante="cartao" alinhamento="justificado" rotulo={t('paginas.abas.textos.cartao')}>
            {abasPadrao()}
          </Abas>
        </Bloco>
        <Bloco titulo={t('paginas.abas.secoes.segmentadoJustificado')}>
          <Abas variante="segmentado" alinhamento="justificado" painel="caixa" rotulo={t('paginas.abas.textos.segmentadoJustificado')}>
            {abasPadrao()}
          </Abas>
        </Bloco>

        <Bloco titulo={t('paginas.abas.secoes.abasComMenu')} descricao={t('paginas.abas.textos.abasVizinhasComO')}>
          <Abas variante="classica" painel="caixa" rotulo={t('paginas.abas.textos.abasComMenu')}>
            <Aba valor="inicio" rotulo={t('paginas.abas.textos.inicio')}>
              <Texto n={0} />
            </Aba>
            <Aba valor="sobre" rotulo={t('paginas.abas.textos.sobreNos')} grupo="Empresa">
              <Texto n={1} />
            </Aba>
            <Aba valor="equipe" rotulo={t('paginas.abas.textos.equipe')} grupo="Empresa">
              <Texto n={2} />
            </Aba>
            <Aba valor="produtos" rotulo={t('paginas.abas.textos.produtos')}>
              <Texto n={3} />
            </Aba>
            <Aba valor="servicos" rotulo={t('paginas.abas.textos.servicos')} desabilitada />
          </Abas>
        </Bloco>
        <Bloco titulo={t('paginas.abas.secoes.pilulasComMenu')}>
          <Abas variante="pilulas" painel="caixa" rotulo={t('paginas.abas.textos.pilulasComMenu')}>
            <Aba valor="produtos" rotulo={t('paginas.abas.textos.produtos')}>
              <Texto n={3} />
            </Aba>
            <Aba valor="carrinho" rotulo={t('paginas.abas.textos.itens')} grupo="Carrinho">
              <Texto n={0} />
            </Aba>
            <Aba valor="frete" rotulo={t('paginas.abas.textos.frete')} grupo="Carrinho">
              <Texto n={1} />
            </Aba>
            <Aba valor="pedidos" rotulo={t('paginas.abas.textos.pedidos')}>
              <Texto n={2} />
            </Aba>
            <Aba valor="ofertas" rotulo={t('paginas.abas.textos.ofertas')} desabilitada />
          </Abas>
        </Bloco>

        <Bloco titulo={t('paginas.abas.secoes.preencher')} descricao={t('paginas.abas.textos.ocupamALarguraToda')}>
          <Abas variante="pilulas" alinhamento="preencher" rotulo={t('paginas.abas.textos.preencher')}>
            <Aba valor="ativa" rotulo={t('paginas.abas.textos.ativa')} />
            <Aba valor="longo" rotulo={t('paginas.abas.textos.linkBemMaisComprido')} />
            <Aba valor="link" rotulo={t('paginas.abas.textos.link')} />
            <Aba valor="desab" rotulo={t('paginas.abas.textos.desabilitada')} desabilitada />
          </Abas>
        </Bloco>
        <Bloco titulo={t('paginas.abas.secoes.justificado')} descricao={t('paginas.abas.textos.ocupamALarguraToda2')}>
          <Abas variante="pilulas" alinhamento="justificado" rotulo={t('paginas.abas.textos.justificado')}>
            <Aba valor="ativa" rotulo={t('paginas.abas.textos.ativa')} />
            <Aba valor="longo" rotulo={t('paginas.abas.textos.linkBemMaisComprido')} />
            <Aba valor="link" rotulo={t('paginas.abas.textos.link')} />
            <Aba valor="desab" rotulo={t('paginas.abas.textos.desabilitada')} desabilitada />
          </Abas>
        </Bloco>
      </div>

      <Bloco titulo={t('paginas.abas.secoes.responsiva')} descricao={t('paginas.abas.textos.empilhadasNoCelularLado')}>
        <Abas variante="pilulas" orientacao="responsiva" alinhamento="preencher" rotulo={t('paginas.abas.textos.responsiva')}>
          <Aba valor="ativa" rotulo={t('paginas.abas.textos.ativa')} />
          <Aba valor="longo" rotulo={t('paginas.abas.textos.linkBemMaisComprido')} />
          <Aba valor="link" rotulo={t('paginas.abas.textos.link')} />
          <Aba valor="desab" rotulo={t('paginas.abas.textos.desabilitada')} desabilitada />
        </Abas>
      </Bloco>
    </div>
  );
}
