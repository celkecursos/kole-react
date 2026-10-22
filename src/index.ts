// Ordem importa: tokens → base → componentes (cada componente importa o próprio CSS).
import './styles/tokens.css';
import './styles/base.css';

// Utilitários
export { cx } from './utils/cx';
export { Icone, registrarIcones, type IconeProp, type IconeProps, type NomeIcone } from './utils/Icone';
export { aplicarMascara, semMascara, MASCARAS, type Mascara } from './utils/mascara';
export type { Severidade, Opcao } from './utils/tipos';
export * from './utils/validadores';
export * from './utils/tiposCampo';
export * from './utils/constantes';
export * from './utils/texto';
export * from './utils/datas';
export * from './utils/entidade';
export * from './utils/anexos';
export * from './utils/jwt';
export * from './utils/severidade';
export * from './utils/senha';
export * from './utils/picklist';

// Provedores
export {
  ProvedorUi,
  ProvedorPreferencias,
  usePreferencias,
  usePreferenciasOpcional,
  type Preferencias,
  type ProvedorPreferenciasProps,
  type Tema,
  type Densidade,
} from './components/Preferencias/Preferencias';
export {
  ProvedorToast,
  useToast,
  Toast,
  type ApiToast,
  type OpcoesToast,
  type ToastProps,
  type CorToast,
  type AparenciaToast,
  type PosicaoToast,
} from './components/Toast/Toast';
export {
  ProvedorConfirmacao,
  useConfirmacao,
  type OpcoesConfirmacao,
  type OpcoesRemocao,
  type OpcoesAviso,
  type Confirmar,
} from './components/Confirmacao/Confirmacao';

// Layout
export {
  Estrutura,
  type EstruturaProps,
  type ItemNav,
  type SecaoNav,
  type Marca,
  type UsuarioEstrutura,
  type ItemMenu,
  type Notificacao,
  type PropsLink,
} from './components/Estrutura/Estrutura';
export { Busca, type BuscaProps, type ItemBusca } from './components/Busca/Busca';
export { CabecalhoPagina, type CabecalhoPaginaProps } from './components/CabecalhoPagina/CabecalhoPagina';
export {
  Trilha,
  useTrilha,
  caminhoNoMenu,
  type TrilhaProps,
  type ItemTrilha,
  type ModeloTrilha,
  type SeparadorTrilha,
} from './components/Trilha/Trilha';
export { BoasVindas, type BoasVindasProps } from './components/BoasVindas/BoasVindas';
export {
  TelaLogin,
  type TelaLoginProps,
  type CredenciaisLogin,
  type ResultadoLogin,
  type ApresentacaoLogin,
} from './components/TelaLogin/TelaLogin';
export { TelaErro, type TelaErroProps } from './components/TelaErro/TelaErro';
export { Abas, Aba, type AbasProps, type AbaProps, type VarianteAbas, type AlinhamentoAbas } from './components/Abas/Abas';
export { Card, GrupoCards, type CardProps, type CorCard } from './components/Card/Card';
export { Recolhivel, type RecolhivelProps } from './components/Recolhivel/Recolhivel';
export { Carrossel, type CarrosselProps, type SlideCarrossel } from './components/Carrossel/Carrossel';
export {
  QuadroArrastavel,
  type QuadroArrastavelProps,
  type ColunaArrastavel,
} from './components/QuadroArrastavel/QuadroArrastavel';
export {
  Acordeao,
  ItemAcordeao,
  type AcordeaoProps,
  type ItemAcordeaoProps,
  type CorAcordeao,
  type VarianteAcordeao,
} from './components/Acordeao/Acordeao';

// Ações
export { Botao, type BotaoProps, type SeveridadeBotao, type AparenciaBotao, type PadroesBotao } from './components/Botao/Botao';
export { AcaoLinha, type AcaoLinhaProps } from './components/AcaoLinha/AcaoLinha';
export {
  GrupoBotoes,
  GrupoAlternancia,
  BarraBotoes,
  type GrupoBotoesProps,
  type GrupoAlternanciaProps,
  type OpcaoAlternancia,
  type BarraBotoesProps,
} from './components/GrupoBotoes/GrupoBotoes';
export { Dica, type DicaProps, type PosicaoDica, type CorDica } from './components/Dica/Dica';
export {
  Balao,
  type BalaoProps,
  type PosicaoBalao,
  type CorBalao,
  type AparenciaBalao,
  type GatilhoBalao,
} from './components/Balao/Balao';
export {
  MenuSuspenso,
  type MenuSuspensoProps,
  type ItemMenuSuspenso,
  type DirecaoMenu,
  type AlinhamentoMenu,
  type FechamentoMenu,
  type PropsGatilhoMenu,
} from './components/MenuSuspenso/MenuSuspenso';

// Formulário
export { Form, FormSecao, type FormProps, type FormSecaoProps, type ItemMenuForm } from './components/Form/Form';
export {
  Campo,
  useCampoIds,
  useValidacaoCampo,
  RevelarCamposCtx,
  MSG_OBRIGATORIO,
  type CampoProps,
  type CampoBaseProps,
} from './components/Campo/Campo';
export {
  CampoTexto,
  CampoCpf,
  CampoCnpj,
  CampoCep,
  CampoTelefone,
  CampoPlaca,
  CampoCpfCnpj,
  CampoRenavam,
  CampoChassi,
  CampoCnh,
  CampoImei,
  type CampoTelefoneProps,
  CampoEmail,
  CampoData,
  CampoHora,
  CampoDataHora,
  CampoMoeda,
  CampoInteiro,
  type CampoTextoProps,
} from './components/CampoTexto/CampoTexto';
export { CampoTextarea, type CampoTextareaProps } from './components/CampoTextarea/CampoTextarea';
export { CampoSenha, type CampoSenhaProps } from './components/CampoSenha/CampoSenha';
export {
  CampoSelect,
  CampoSelectMultiplo,
  type CampoSelectProps,
  type CampoSelectMultiploProps,
} from './components/CampoSelect/CampoSelect';
export {
  CampoUf,
  CampoUfMultiplo,
  CampoTipoPessoa,
  type CampoUfProps,
  type CampoUfMultiploProps,
  type CampoTipoPessoaProps,
} from './components/CampoDominio/CampoDominio';
export { CampoMarcacao, type CampoMarcacaoProps } from './components/CampoMarcacao/CampoMarcacao';
export { Escolha, type EscolhaProps } from './components/Escolha/Escolha';
export { Avaliacao, type AvaliacaoProps } from './components/Avaliacao/Avaliacao';
export { Filtros, type FiltrosProps, type FiltroAplicado } from './components/Filtros/Filtros';
export { Picklist, type PicklistProps } from './components/Picklist/Picklist';
export { CampoBusca, type CampoBuscaProps } from './components/CampoBusca/CampoBusca';
export { CampoCidade, type CampoCidadeProps, type Municipio } from './components/CampoBusca/CampoCidade';
export { useBuscaAssincrona, BUSCA_ATRASO_MS, type OpcoesBuscaAssincrona } from './utils/useBuscaAssincrona';

// Dados
export { Tabela, valorDoCampo, type TabelaProps, type Coluna, type Ordenacao } from './components/Tabela/Tabela';
export { Paginacao, type PaginacaoProps } from './components/Paginacao/Paginacao';
export { Lista, ItemLista, type ListaProps, type ItemListaProps, type CorItemLista } from './components/Lista/Lista';
export { ListaCards, type ListaCardsProps } from './components/ListaCards/ListaCards';
export { Indicador, Indicadores, type IndicadorProps } from './components/Indicador/Indicador';
export { Detalhes, type DetalhesProps } from './components/Detalhes/Detalhes';
export { Status, type StatusProps } from './components/Status/Status';
export { Chip, type ChipProps } from './components/Chip/Chip';
export { Badge, ComBadge, type BadgeProps, type ComBadgeProps, type CorBadge } from './components/Badge/Badge';
export { Avatar, type AvatarProps } from './components/Avatar/Avatar';
export { Placa, type PlacaProps } from './components/Placa/Placa';
export { Citacao, type CitacaoProps, type CorCitacao } from './components/Citacao/Citacao';
export {
  Imagem,
  Figura,
  type ImagemProps,
  type FiguraProps,
  type CantosImagem,
  type AlinhamentoImagem,
} from './components/Imagem/Imagem';

// Feedback
export { Alerta, type AlertaProps, type CorAlerta, type AparenciaAlerta } from './components/Alerta/Alerta';
export { Dialogo, type DialogoProps, type TamanhoDialogo, type AnimacaoDialogo } from './components/Dialogo/Dialogo';
export { BotaoFechar, type BotaoFecharProps } from './components/BotaoFechar/BotaoFechar';
export { Vazio, type VazioProps } from './components/Vazio/Vazio';
export { Skeleton, type SkeletonProps } from './components/Skeleton/Skeleton';
export { Carregando, type CarregandoProps } from './components/Carregando/Carregando';
export { Girador, type GiradorProps, type CorGirador } from './components/Girador/Girador';
export { Progresso, type ProgressoProps, type CorProgresso, type SegmentoProgresso } from './components/Progresso/Progresso';

// Arquivos
export { VisualizadorArquivo, type VisualizadorArquivoProps } from './components/Arquivo/VisualizadorArquivo';
export { DialogoArquivo, type DialogoArquivoProps } from './components/Arquivo/DialogoArquivo';
export { CampoAnexo, type CampoAnexoProps, type CampoAnexoRef } from './components/Arquivo/CampoAnexo';
export { Foto, type FotoProps, type EntradaFoto } from './components/Arquivo/Foto';
