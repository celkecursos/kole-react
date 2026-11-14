export const docsAcoes = {
  botao: {
    titulo: 'Botão',
    textos: {
      resumo: 'Dispara uma ação. Tem oito cores, seis aparências, três tamanhos, ícone, estado de carregando e modo alternância.',
      useUmaUnicaAcao: 'Use uma única ação `pri` sólida por área da tela; as demais em `contorno`, `suave` ou `texto`.',
      botaoSoComIcone: 'Botão só com ícone precisa de `aria-label` (o nome que o leitor de tela anuncia) e de `dica` (o balão para quem enxerga).',
      oPadraoEType: 'O padrão é `type="button"`: dentro de um formulário, passe `type="submit"` no botão que envia.',
      comCarregandoOBotao: 'Com `carregando`, o botão continua focável e recusa o clique (`aria-busy`), em vez de sumir do foco como no `disabled`.',
      paraPadronizarVariosBotoes: 'Para padronizar vários botões de uma vez (cor, tamanho), use o `GrupoBotoes`.',
      aPropSeveridadeEscolhe: 'A prop `severidade` escolhe a cor. O padrão é `pri`, o azul de ação.',
      aPropAparenciaMuda: 'A prop `aparencia` muda o peso visual sem trocar a cor.',
      qualquerIconeDoLucide: 'Qualquer ícone do Lucide pelo nome. `iconeDestacado` coloca o ícone num segmento mais escuro.',
      descricao: 'Cores, aparências, ícone e carregando',
    },
    secoes: {
      basico: 'Básico',
      cores: 'Cores',
      aparencias: 'Aparências',
      tamanhosEFormato: 'Tamanhos e formato',
      comIcone: 'Com ícone',
      carregandoDesabilitadoEAlternancia: 'Carregando, desabilitado e alternância',
    },
  },
  grupoBotoes: {
    titulo: 'Grupo de botões',
    textos: {
      resumo: 'Botões colados num bloco (GrupoBotoes), alinhados numa barra (BarraBotoes) ou funcionando como seletor (GrupoAlternancia).',
      semprePasseRotuloVira: 'Sempre passe `rotulo`: vira o nome do grupo para leitor de tela (`role="group"`).',
      grupoalternanciaRecebeOpcoesValor: '`GrupoAlternancia` recebe `opcoes`, `valor` e `aoMudar`; com `multiplo`, o valor é uma lista. Cada botão marca `aria-pressed`.',
      paraEscolherUmaOpcao: 'Para escolher uma opção num formulário, a `Escolha` tem rótulo, erro e validação de campo.',
      osBotoesDeDentro: 'Os botões de dentro herdam `severidade`, `aparencia`, `formato` e `tamanho`, e cada um pode sobrescrever.',
      descricao: 'Botões colados, barra e alternância',
    },
    secoes: { grupo: 'Grupo', alternancia: 'Alternância', barraDeBotoes: 'Barra de botões' },
  },
  menuSuspenso: {
    titulo: 'Menu suspenso',
    textos: {
      resumo: 'Um botão que abre uma lista de ações. Aceita títulos, divisores, atalhos, links e o modo dividido.',
      abreComCliqueEnter: 'Abre com clique, Enter ou seta para baixo; as setas percorrem os itens e Esc fecha devolvendo o foco ao botão.',
      itemComHrefVira: 'Item com `href` vira link. `tipo: \'titulo\'` e `tipo: \'divisor\'` organizam listas longas.',
      paraUmGatilhoProprio: 'Para um gatilho próprio (avatar, card), use a prop `gatilho`, que recebe as props de acessibilidade para espalhar no elemento.',
      descricao: 'Lista de ações num botão',
    },
    secoes: { basico: 'Básico', botaoDividido: 'Botão dividido' },
  },
  acaoLinha: {
    titulo: 'Ação de linha',
    textos: {
      resumo: 'Botão só com ícone para as ações de cada linha de uma tabela ou lista: visualizar, editar, excluir.',
      useDentroDaProp: 'Use dentro da prop `acoes` da `Tabela`, que reserva a última coluna para elas.',
      oRotuloEObrigatorio: 'O `rotulo` é obrigatório: vira o nome acessível e a dica do botão.',
      mantenhaAMesmaOrdem: 'Mantenha a mesma ordem e as mesmas cores em todas as telas (ver, editar, excluir).',
      descricao: 'Ícone de ação em tabelas',
    },
    secoes: { basico: 'Básico' },
  },
  botaoFechar: {
    titulo: 'Botão fechar',
    textos: {
      resumo: 'O × padrão de diálogos, cards, alertas e painéis, com nome acessível e área de toque adequada.',
      oRotuloPadraoFechar: 'O `rotulo` (padrão "Fechar") vira o `aria-label`; troque quando houver mais de um na tela ("Fechar aviso").',
      dialogoCardEAlerta: '`Dialogo`, `Card` e `Alerta` já trazem o próprio botão: use este só em componentes do app.',
      descricao: 'O × de cards e painéis',
    },
    secoes: { variantes: 'Variantes' },
  },
};
