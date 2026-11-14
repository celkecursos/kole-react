import { useState } from 'react';
import {
  Botao,
  CabecalhoPagina,
  CampoEmail,
  CampoMarcacao,
  CampoSenha,
  MenuSuspenso,
  useToast,
  type ItemMenuSuspenso,
  type SeveridadeBotao,
} from '../../../src';
import { Bloco } from '../Bloco';
import { useT, type TradutorDemo } from '../../i18n/useT';

const ACOES = (t: TradutorDemo['t']): ItemMenuSuspenso[] => ([
  { id: 'acao', rotulo: t('paginas.menus.textos.acao') },
  { id: 'outra', rotulo: t('paginas.menus.textos.outraAcao') },
  { id: 'mais', rotulo: t('paginas.menus.textos.maisAlgumaCoisa') },
]);

const ACOES_SEPARADAS = (t: TradutorDemo['t']): ItemMenuSuspenso[] => ([...ACOES(t), { tipo: 'divisor' }, { id: 'separado', rotulo: t('paginas.menus.textos.linkSeparado') }]);

const CORES = (t: TradutorDemo['t']): Array<{ cor: SeveridadeBotao; rotulo: string }> => ([
  { cor: 'pri', rotulo: t('paginas.menus.textos.primario') },
  { cor: 'secundario', rotulo: t('paginas.menus.textos.secundario') },
  { cor: 'ok', rotulo: t('paginas.menus.textos.sucesso') },
  { cor: 'info', rotulo: t('paginas.menus.textos.info') },
  { cor: 'warn', rotulo: t('paginas.menus.textos.aviso') },
  { cor: 'err', rotulo: t('paginas.menus.textos.perigo') },
]);

export function PaginaMenusSuspensos() {
  const { t } = useT();
  const toast = useToast();
  const escolher = (id: string) => toast.info(t('paginas.menus.textos.itemEscolhido'), id);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.menus.titulo')} icone="chevron-down" trilha />

      <Bloco titulo={t('paginas.menus.secoes.menuSuspenso')} descricao={t('paginas.menus.textos.oGatilhoPodeSer')}>
        <div className="demo-linha">
          <MenuSuspenso rotulo={t('paginas.menus.textos.botaoComMenu')} formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
          <MenuSuspenso rotulo={t('paginas.menus.textos.linkComMenu')} severidade="secundario" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
          <MenuSuspenso rotulo={t('paginas.menus.textos.opcoes')} aparencia="texto" itens={ACOES(t)} aoEscolher={escolher} />
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.menus.secoes.botoesSolidos')}>
          <div className="demo-linha">
            {CORES(t).map((c) => (
              <MenuSuspenso key={c.cor} rotulo={c.rotulo} severidade={c.cor} formato="retangulo" itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.pilula')} descricao={t('paginas.menus.textos.formatoPadraoDoBotao')}>
          <div className="demo-linha">
            {CORES(t).map((c) => (
              <MenuSuspenso key={c.cor} rotulo={c.rotulo} severidade={c.cor} itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.contorno')}>
          <div className="demo-linha">
            {CORES(t).map((c) => (
              <MenuSuspenso key={c.cor} rotulo={c.rotulo} severidade={c.cor} aparencia="contorno" formato="retangulo" itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.contornoEmPilula')}>
          <div className="demo-linha">
            {CORES(t).map((c) => (
              <MenuSuspenso key={c.cor} rotulo={c.rotulo} severidade={c.cor} aparencia="contorno" itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.botaoDividido')} descricao={t('paginas.menus.textos.aAcaoPrincipalFica')}>
          <div className="demo-linha">
            {CORES(t).map((c) => (
              <MenuSuspenso
                key={c.cor}
                dividido
                rotulo={c.rotulo}
                severidade={c.cor}
                formato="retangulo"
                itens={ACOES_SEPARADAS(t)}
                aoEscolher={escolher}
                aoClicarPrincipal={() => toast.ok(c.rotulo, t('paginas.menus.textos.acaoPrincipal'))}
              />
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.tamanhos')}>
          <div className="demo-linha demo-linha--centro">
            <MenuSuspenso rotulo={t('paginas.menus.textos.botaoGrande')} tamanho="grande" formato="retangulo" itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
            <MenuSuspenso dividido rotulo={t('paginas.menus.textos.grandeDividido')} severidade="secundario" tamanho="grande" formato="retangulo" itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
          </div>
          <div className="demo-linha demo-linha--centro">
            <MenuSuspenso rotulo={t('paginas.menus.textos.botaoPequeno')} tamanho="pequeno" formato="retangulo" itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
            <MenuSuspenso dividido rotulo={t('paginas.menus.textos.pequenoDividido')} severidade="secundario" tamanho="pequeno" formato="retangulo" itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-4">
        <Bloco titulo={t('paginas.menus.secoes.paraCima')}>
          <div className="demo-linha">
            <MenuSuspenso rotulo={t('paginas.menus.textos.paraCima')} direcao="cima" formato="retangulo" itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
            <MenuSuspenso dividido rotulo={t('paginas.menus.textos.dividido')} direcao="cima" severidade="info" formato="retangulo" itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.paraADireita')}>
          <div className="demo-linha">
            <MenuSuspenso rotulo={t('paginas.menus.textos.direita')} direcao="direita" formato="retangulo" itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
            <MenuSuspenso dividido rotulo={t('paginas.menus.textos.dividido')} direcao="direita" severidade="info" formato="retangulo" itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.paraAEsquerda')}>
          <div className="demo-linha">
            <MenuSuspenso rotulo={t('paginas.menus.textos.esquerda')} direcao="esquerda" formato="retangulo" itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
            <MenuSuspenso dividido rotulo={t('paginas.menus.textos.dividido')} direcao="esquerda" severidade="info" formato="retangulo" itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.itemAtivo')} descricao={t('paginas.menus.textos.marcaAOpcaoAtual')}>
          <div>
            <MenuSuspenso
              rotulo={t('paginas.menus.textos.ordenar')}
              icone="arrow-up-down"
              formato="retangulo"
              itens={[
                { id: 'recentes', rotulo: t('paginas.menus.textos.maisRecentes'), ativo: true },
                { id: 'antigos', rotulo: t('paginas.menus.textos.maisAntigos') },
                { id: 'valor', rotulo: t('paginas.menus.textos.maiorValor') },
              ]}
              aoEscolher={escolher}
            />
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.menus.secoes.itemDesabilitado')} descricao={t('paginas.menus.textos.segueVisivelMasNao')}>
          <div>
            <MenuSuspenso
              rotulo={t('paginas.menus.textos.pedido')}
              formato="retangulo"
              itens={[
                { id: 'editar', rotulo: t('paginas.menus.textos.editar') },
                { id: 'faturar', rotulo: t('paginas.menus.textos.faturar'), desabilitado: true },
                { id: 'cancelar', rotulo: t('paginas.menus.textos.cancelar') },
              ]}
              aoEscolher={escolher}
            />
          </div>
        </Bloco>
        <div className="demo-span-2">
          <Bloco titulo={t('paginas.menus.secoes.fechamento')} descricao={t('paginas.menus.textos.escolheSeOMenu')}>
            <div className="demo-linha">
              <MenuSuspenso rotulo={t('paginas.menus.textos.padrao')} formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
              <MenuSuspenso rotulo={t('paginas.menus.textos.cliqueFora')} fechamento="fora" severidade="secundario" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
              <MenuSuspenso rotulo={t('paginas.menus.textos.cliqueDentro')} fechamento="dentro" severidade="info" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
              <MenuSuspenso rotulo={t('paginas.menus.textos.manual')} fechamento="manual" severidade="warn" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
            </div>
          </Bloco>
        </div>
        <Bloco titulo={t('paginas.menus.secoes.comFormulario')} descricao={t('paginas.menus.textos.painelLivreFechaSo')}>
          <div className="demo-linha">
            <MenuSuspenso rotulo={t('paginas.menus.textos.entrar')} icone="log-in" severidade="secundario" formato="retangulo" fechamento="fora" larguraMenu="17rem">
              {(fechar) => (
                <form
                  className="demo-menu-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.ok(t('paginas.menus.textos.entrou'), email || t('paginas.menus.textos.semEMail'));
                    fechar();
                  }}
                >
                  <CampoEmail rotulo={t('paginas.menus.textos.eMail')} valor={email} aoMudar={setEmail} />
                  <CampoSenha rotulo={t('paginas.menus.textos.senha')} valor={senha} aoMudar={setSenha} />
                  <CampoMarcacao rotulo={t('paginas.menus.textos.lembrarDeMim')} valor={lembrar} aoMudar={setLembrar} />
                  <Botao type="submit" rotulo={t('paginas.menus.textos.entrar')} formato="retangulo" bloco />
                  <div className="demo-menu-form-rodape">
                    <a href="#/ui/menus">{t('paginas.menus.textos.novoPorAquiCadastre')}</a>
                    <a href="#/ui/menus">{t('paginas.menus.textos.esqueceuASenha')}</a>
                  </div>
                </form>
              )}
            </MenuSuspenso>
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-4">
        <Bloco titulo={t('paginas.menus.secoes.centralizado')} descricao={t('paginas.menus.textos.oPainelAbreCentrado')}>
          <div>
            <MenuSuspenso rotulo={t('paginas.menus.textos.centralizado')} alinhamento="centro" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.centralizadoParaCima')}>
          <div>
            <MenuSuspenso rotulo={t('paginas.menus.textos.paraCima')} direcao="cima" alinhamento="centro" severidade="secundario" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.itensLinkOuBotao')} descricao={t('paginas.menus.textos.itemComHrefVira')}>
          <div>
            <MenuSuspenso
              rotulo={t('paginas.menus.textos.menu')}
              severidade="info"
              formato="retangulo"
              itens={[
                { id: 'painel', rotulo: t('paginas.menus.textos.irAoPainel'), icone: 'house', href: '#/' },
                { id: 'perfil', rotulo: t('paginas.menus.textos.meuPerfil'), icone: 'user', href: '#/perfil' },
                { tipo: 'divisor' },
                { id: 'copiar', rotulo: t('paginas.menus.textos.copiarLink'), icone: 'copy', extra: 'Ctrl+C' },
                { id: 'excluir', rotulo: t('paginas.menus.textos.excluir'), icone: 'trash-2', destrutivo: true },
              ]}
              aoEscolher={escolher}
            />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.deslocamentoEReferencia')} descricao={t('paginas.menus.textos.afastaOPainelOu')}>
          <div className="demo-linha">
            <MenuSuspenso rotulo={t('paginas.menus.textos.deslocado')} deslocamento={[10, 20]} formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
            <MenuSuspenso dividido rotulo={t('paginas.menus.textos.referencia')} referencia="pai" severidade="info" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-4">
        <div className="demo-span-3">
          <Bloco titulo={t('paginas.menus.secoes.alinhamento')} descricao={t('paginas.menus.textos.inicioPadraoFimOu')}>
            <div className="demo-linha">
              <MenuSuspenso rotulo={t('paginas.menus.textos.inicio')} formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
              <MenuSuspenso rotulo={t('paginas.menus.textos.alinhadoADireita')} alinhamento="fim" severidade="secundario" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
              <MenuSuspenso rotulo={t('paginas.menus.textos.inicioFimNaTela')} alinhamentoTelaGrande="fim" severidade="info" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
              <MenuSuspenso rotulo={t('paginas.menus.textos.fimInicioNaTela')} alinhamento="fim" alinhamentoTelaGrande="inicio" severidade="warn" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
              <MenuSuspenso rotulo={t('paginas.menus.textos.esquerda')} direcao="esquerda" severidade="ok" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
              <MenuSuspenso rotulo={t('paginas.menus.textos.direita')} direcao="direita" severidade="err" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
              <MenuSuspenso rotulo={t('paginas.menus.textos.paraCima')} direcao="cima" severidade="destaque" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
            </div>
          </Bloco>
        </div>
        <Bloco titulo={t('paginas.menus.secoes.painelEscuro')}>
          <div>
            <MenuSuspenso
              rotulo={t('paginas.menus.textos.menuEscuro')}
              severidade="escuro"
              formato="retangulo"
              escuro
              itens={[
                { id: 'acao', rotulo: t('paginas.menus.textos.acao'), ativo: true },
                { id: 'outra', rotulo: t('paginas.menus.textos.outraAcao') },
                { id: 'mais', rotulo: t('paginas.menus.textos.maisAlgumaCoisa') },
                { tipo: 'divisor' },
                { id: 'separado', rotulo: t('paginas.menus.textos.linkSeparado') },
              ]}
              aoEscolher={escolher}
            />
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-3">
        <Bloco titulo={t('paginas.menus.secoes.painelAlinhadoADireita')}>
          <div>
            <MenuSuspenso rotulo={t('paginas.menus.textos.alinhadoADireita')} alinhamento="fim" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.responsivoFimNaTela')} descricao={t('paginas.menus.textos.inicioNoCelularFim')}>
          <div>
            <MenuSuspenso rotulo={t('paginas.menus.textos.responsivo')} alinhamentoTelaGrande="fim" severidade="secundario" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.responsivoInicioNaTela')} descricao={t('paginas.menus.textos.fimNoCelularInicio')}>
          <div>
            <MenuSuspenso rotulo={t('paginas.menus.textos.responsivo')} alinhamento="fim" alinhamentoTelaGrande="inicio" severidade="info" formato="retangulo" itens={ACOES(t)} aoEscolher={escolher} />
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.menus.secoes.paineisColoridos')} descricao={t('paginas.menus.textos.oItemEmFoco')}>
          <div className="demo-linha">
            {CORES(t).map((c) => (
              <MenuSuspenso key={c.cor} rotulo={c.rotulo} severidade={c.cor} cor={c.cor} formato="retangulo" itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.fantasma')} descricao={t('paginas.menus.textos.contornoDiscretoQueSe')}>
          <div className="demo-linha">
            {CORES(t).map((c) => (
              <MenuSuspenso key={c.cor} rotulo={c.rotulo} severidade={c.cor} aparencia="fantasma" formato="retangulo" itens={ACOES_SEPARADAS(t)} aoEscolher={escolher} />
            ))}
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-4">
        <Bloco titulo={t('paginas.menus.secoes.textoNaoInterativo')} descricao={t('paginas.menus.textos.linhaDeTextoQue')}>
          <div>
            <MenuSuspenso rotulo={t('paginas.menus.textos.menu')} formato="retangulo" itens={[{ tipo: 'texto', rotulo: t('paginas.menus.textos.textoDoMenu') }, ...ACOES(t)]} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.titulos')} descricao={t('paginas.menus.textos.rotulamGruposDeAcoes')}>
          <div>
            <MenuSuspenso
              rotulo={t('paginas.menus.textos.menu')}
              severidade="secundario"
              formato="retangulo"
              itens={[{ tipo: 'titulo', rotulo: t('paginas.menus.textos.tituloDoGrupo') }, ...ACOES(t), { tipo: 'titulo', rotulo: t('paginas.menus.textos.outroGrupo') }, { id: 'arquivar', rotulo: t('paginas.menus.textos.arquivar') }]}
              aoEscolher={escolher}
            />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.divisores')}>
          <div>
            <MenuSuspenso
              rotulo={t('paginas.menus.textos.menu')}
              severidade="info"
              formato="retangulo"
              itens={[{ tipo: 'titulo', rotulo: t('paginas.menus.textos.titulo') }, ...ACOES_SEPARADAS(t)]}
              aoEscolher={escolher}
            />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.menus.secoes.textoLivre')} descricao={t('paginas.menus.textos.qualquerConteudoDentroDo')}>
          <div>
            <MenuSuspenso rotulo={t('paginas.menus.textos.sobre')} icone="info" aparencia="contorno" formato="retangulo" larguraMenu="16rem">
              <div className="demo-menu-texto">
                <p>{t('paginas.menus.textos.umTextoDeExemplo')}</p>
                <p>{t('paginas.menus.textos.eAquiMaisUm')}</p>
              </div>
            </MenuSuspenso>
          </div>
        </Bloco>
      </div>
    </div>
  );
}
