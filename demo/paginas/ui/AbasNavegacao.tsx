import { Aba, Abas, Avatar, Badge, CabecalhoPagina, Detalhes, ItemLista, Lista } from '../../../src';
import { Bloco, retrato } from '../Bloco';

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
  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Abas e navegação" icone="panel-right" trilha />

      <div className="demo-colunas">
        <Bloco titulo="Abas estáticas" descricao="Só a barra, sem painel.">
          <Abas variante="classica" rotulo="Abas estáticas">
            <Aba valor="ativa" rotulo="Ativa" />
            <Aba valor="link1" rotulo="Link" />
            <Aba valor="link2" rotulo="Outro link" />
            <Aba valor="desab" rotulo="Desabilitada" desabilitada />
          </Abas>
        </Bloco>
        <Bloco titulo="Pílulas estáticas">
          <Abas variante="pilulas" rotulo="Pílulas estáticas">
            <Aba valor="ativa" rotulo="Ativa" />
            <Aba valor="link1" rotulo="Link" />
            <Aba valor="link2" rotulo="Outro link" />
            <Aba valor="desab" rotulo="Desabilitada" desabilitada />
          </Abas>
        </Bloco>

        <Bloco titulo="Pílulas com badges">
          <Abas variante="pilulas" painel="caixa" rotulo="Loja">
            <Aba valor="produtos" rotulo="Produtos">
              <Texto n={0} />
            </Aba>
            <Aba valor="carrinho" rotulo="Carrinho" badge={<Badge cor="err" formato="pilula" rotulo="32" />}>
              <Texto n={1} />
            </Aba>
            <Aba valor="pedidos" rotulo="Pedidos" badge={<Badge cor="ok" formato="pilula" rotulo="4" />}>
              <Texto n={2} />
            </Aba>
            <Aba valor="ofertas" rotulo="Ofertas">
              <Texto n={3} />
            </Aba>
          </Abas>
        </Bloco>
        <Bloco titulo="Contorno justificado" descricao="Todas as abas com a mesma largura.">
          <Abas variante="contorno" alinhamento="justificado" painel="caixa" rotulo="Loja">
            <Aba valor="produtos" rotulo="Produtos">
              <Texto n={1} />
            </Aba>
            <Aba valor="carrinho" rotulo="Carrinho" badge={<Badge cor="info" aparencia="suave" rotulo="Cheio" />}>
              <Texto n={2} />
            </Aba>
            <Aba valor="pedidos" rotulo="Pedidos">
              <Texto n={3} />
            </Aba>
            <Aba valor="ofertas" rotulo="Ofertas" pendentes={7}>
              <Texto n={0} />
            </Aba>
          </Abas>
        </Bloco>

        <Bloco titulo="Centralizadas">
          <Abas variante="suave" alinhamento="centro" painel="caixa" rotulo="Centralizadas">
            {abasPadrao()}
          </Abas>
        </Bloco>
        <Bloco titulo="À direita">
          <Abas variante="sublinhado" alinhamento="fim" painel="caixa" rotulo="À direita">
            {abasPadrao()}
          </Abas>
        </Bloco>

        <Bloco titulo="Abas no cabeçalho" descricao="Título e abas na mesma linha.">
          <Abas variante="suave" cabecalho="Relatório" painel="caixa" rotulo="Seções do relatório">
            <Aba valor="inicio" rotulo="Início">
              <Texto n={0} paragrafos={2} />
            </Aba>
            <Aba valor="sobre" rotulo="Sobre">
              <Texto n={1} paragrafos={2} />
            </Aba>
            <Aba valor="servicos" rotulo="Serviços">
              <Texto n={2} paragrafos={2} />
            </Aba>
          </Abas>
        </Bloco>
        <Bloco titulo="Abas no rodapé" descricao="A barra fica abaixo do painel.">
          <Abas variante="contorno" alinhamento="fim" posicaoBarra="base" painel="caixa" rotulo="Abas no rodapé">
            <Aba valor="inicio" rotulo="Início">
              <Texto n={3} />
            </Aba>
            <Aba valor="sobre" rotulo="Sobre">
              <Texto n={0} />
            </Aba>
            <Aba valor="servicos" rotulo="Serviços">
              <Texto n={1} />
            </Aba>
          </Abas>
        </Bloco>

        <Bloco titulo="Abas clássicas" descricao="A aba ativa se funde com a linha do painel.">
          <Abas variante="classica" painel="caixa" rotulo="Abas clássicas">
            {abasPadrao()}
          </Abas>
        </Bloco>
        <Bloco titulo="Justificadas">
          <Abas variante="suave" alinhamento="justificado" painel="caixa" rotulo="Justificadas">
            {abasPadrao()}
          </Abas>
        </Bloco>

        <Bloco titulo="Vertical">
          <Abas variante="suave" orientacao="vertical" painel="caixa" rotulo="Vertical">
            {abasPadrao(false, 2)}
          </Abas>
        </Bloco>
        <Bloco titulo="Vertical com ícones">
          <Abas variante="pilulas" orientacao="vertical" painel="caixa" rotulo="Vertical com ícones">
            {abasPadrao(true, 2)}
          </Abas>
        </Bloco>

        <Bloco titulo="Blocos verticais" descricao="Ícone em cima e seta apontando para o painel.">
          <Abas variante="blocos" orientacao="vertical" painel="caixa" rotulo="Blocos verticais">
            <Aba valor="inicio" rotulo="Início" icone="house">
              <Texto n={0} paragrafos={2} />
            </Aba>
            <Aba valor="sobre" rotulo="Sobre" icone="phone">
              <Texto n={1} paragrafos={2} />
            </Aba>
            <Aba valor="servicos" rotulo="Serviços" icone="briefcase">
              <Texto n={2} paragrafos={2} />
            </Aba>
          </Abas>
        </Bloco>
        <Bloco titulo="Contorno vertical com ícone acima">
          <Abas variante="contorno" orientacao="vertical" iconeAcima painel="caixa" rotulo="Equipe e clientes">
            <Aba valor="func" rotulo="Funcionários" icone="map-pin">
              <Texto n={3} paragrafos={2} />
            </Aba>
            <Aba valor="clientes" rotulo="Clientes" icone="users">
              <Texto n={0} paragrafos={2} />
            </Aba>
            <Aba valor="produtos" rotulo="Produtos" icone="package">
              <Texto n={1} paragrafos={2} />
            </Aba>
          </Abas>
        </Bloco>
      </div>

      <Bloco titulo="Segmentado" descricao="Trilho cinza com a aba ativa destacada.">
        <Abas variante="segmentado" painel="caixa" rotulo="Situação dos pedidos">
          <Aba valor="pedidos" rotulo="Pedidos">
            <Texto n={0} />
          </Aba>
          <Aba valor="aceitos" rotulo="Aceitos">
            <Texto n={1} />
          </Aba>
          <Aba valor="recusados" rotulo="Recusados">
            <Texto n={2} />
          </Aba>
        </Abas>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo="Passos" descricao="Círculos numerados, para etapas.">
          <Abas variante="passos" alinhamento="centro" painel="caixa" rotulo="Etapas">
            <Aba valor="inicio" rotulo="Início">
              <Texto n={0} />
            </Aba>
            <Aba valor="sobre" rotulo="Sobre">
              <Texto n={1} />
            </Aba>
            <Aba valor="servicos" rotulo="Serviços">
              <Texto n={2} />
            </Aba>
          </Abas>
        </Bloco>
        <Bloco titulo="Sublinhado com ícone acima">
          <Abas variante="sublinhado" alinhamento="justificado" iconeAcima painel="caixa" rotulo="Situação da entrega">
            <Aba valor="pedido" rotulo="Pedido" icone="shopping-cart">
              <Texto n={0} />
            </Aba>
            <Aba valor="confirmado" rotulo="Confirmado" icone="circle-check">
              <Texto n={1} />
            </Aba>
            <Aba valor="enviado" rotulo="Enviado" icone="package">
              <Texto n={2} />
            </Aba>
            <Aba valor="entregue" rotulo="Entregue" icone="truck">
              <Texto n={3} />
            </Aba>
          </Abas>
        </Bloco>
      </div>

      <div className="demo-colunas-3">
        <Bloco titulo="Pílulas com ícones">
          <Abas variante="pilulas" rotulo="Catálogo">
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
          <Bloco titulo="Vertical com perfil">
            <Abas variante="pilulas" orientacao="vertical" rotulo="Conta">
              <Aba valor="perfil" rotulo="Perfil" icone="user">
                <div className="demo-abas-perfil">
                  <Avatar nome="Adão Silva" foto={retrato('#1f5fe0', 'A')} formato="quadrado" tamanho="5rem" />
                  <div>
                    <h3>Adão Silva</h3>
                    <Detalhes rotulo="Cargo" valor="Designer de interfaces" disposicao="linha" />
                    <Detalhes rotulo="Telefone" valor="(11) 91234-5678" disposicao="linha" />
                    <Detalhes rotulo="E-mail" valor="adao@exemplo.com" disposicao="linha" />
                  </div>
                </div>
              </Aba>
              <Aba valor="senha" rotulo="Senha" icone="lock">
                <Texto n={1} />
              </Aba>
              <Aba valor="equipe" rotulo="Equipe" icone="users">
                <Texto n={2} />
              </Aba>
              <Aba valor="cobranca" rotulo="Cobrança" icone="credit-card">
                <Texto n={3} />
              </Aba>
              <Aba valor="email" rotulo="E-mail" icone="mail">
                <Texto n={0} />
              </Aba>
            </Abas>
          </Bloco>
        </div>
      </div>

      <div className="demo-colunas">
        <Bloco titulo="Cartão" descricao="A aba ativa e o painel na mesma cor.">
          <Abas variante="cartao" alinhamento="justificado" rotulo="Cartão">
            {abasPadrao()}
          </Abas>
        </Bloco>
        <Bloco titulo="Segmentado justificado">
          <Abas variante="segmentado" alinhamento="justificado" painel="caixa" rotulo="Segmentado justificado">
            {abasPadrao()}
          </Abas>
        </Bloco>

        <Bloco titulo="Abas com menu" descricao="Abas vizinhas com o mesmo grupo viram uma aba com menu suspenso.">
          <Abas variante="classica" painel="caixa" rotulo="Abas com menu">
            <Aba valor="inicio" rotulo="Início">
              <Texto n={0} />
            </Aba>
            <Aba valor="sobre" rotulo="Sobre nós" grupo="Empresa">
              <Texto n={1} />
            </Aba>
            <Aba valor="equipe" rotulo="Equipe" grupo="Empresa">
              <Texto n={2} />
            </Aba>
            <Aba valor="produtos" rotulo="Produtos">
              <Texto n={3} />
            </Aba>
            <Aba valor="servicos" rotulo="Serviços" desabilitada />
          </Abas>
        </Bloco>
        <Bloco titulo="Pílulas com menu">
          <Abas variante="pilulas" painel="caixa" rotulo="Pílulas com menu">
            <Aba valor="produtos" rotulo="Produtos">
              <Texto n={3} />
            </Aba>
            <Aba valor="carrinho" rotulo="Itens" grupo="Carrinho">
              <Texto n={0} />
            </Aba>
            <Aba valor="frete" rotulo="Frete" grupo="Carrinho">
              <Texto n={1} />
            </Aba>
            <Aba valor="pedidos" rotulo="Pedidos">
              <Texto n={2} />
            </Aba>
            <Aba valor="ofertas" rotulo="Ofertas" desabilitada />
          </Abas>
        </Bloco>

        <Bloco titulo="Preencher" descricao="Ocupam a largura toda; cada aba cresce conforme o rótulo.">
          <Abas variante="pilulas" alinhamento="preencher" rotulo="Preencher">
            <Aba valor="ativa" rotulo="Ativa" />
            <Aba valor="longo" rotulo="Link bem mais comprido" />
            <Aba valor="link" rotulo="Link" />
            <Aba valor="desab" rotulo="Desabilitada" desabilitada />
          </Abas>
        </Bloco>
        <Bloco titulo="Justificado" descricao="Ocupam a largura toda, todas do mesmo tamanho.">
          <Abas variante="pilulas" alinhamento="justificado" rotulo="Justificado">
            <Aba valor="ativa" rotulo="Ativa" />
            <Aba valor="longo" rotulo="Link bem mais comprido" />
            <Aba valor="link" rotulo="Link" />
            <Aba valor="desab" rotulo="Desabilitada" desabilitada />
          </Abas>
        </Bloco>
      </div>

      <Bloco titulo="Responsiva" descricao="Empilhadas no celular, lado a lado a partir de 36rem.">
        <Abas variante="pilulas" orientacao="responsiva" alinhamento="preencher" rotulo="Responsiva">
          <Aba valor="ativa" rotulo="Ativa" />
          <Aba valor="longo" rotulo="Link bem mais comprido" />
          <Aba valor="link" rotulo="Link" />
          <Aba valor="desab" rotulo="Desabilitada" desabilitada />
        </Abas>
      </Bloco>
    </div>
  );
}
