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

const ACOES: ItemMenuSuspenso[] = [
  { id: 'acao', rotulo: 'Ação' },
  { id: 'outra', rotulo: 'Outra ação' },
  { id: 'mais', rotulo: 'Mais alguma coisa' },
];

const ACOES_SEPARADAS: ItemMenuSuspenso[] = [...ACOES, { tipo: 'divisor' }, { id: 'separado', rotulo: 'Link separado' }];

const CORES: Array<{ cor: SeveridadeBotao; rotulo: string }> = [
  { cor: 'pri', rotulo: 'Primário' },
  { cor: 'secundario', rotulo: 'Secundário' },
  { cor: 'ok', rotulo: 'Sucesso' },
  { cor: 'info', rotulo: 'Info' },
  { cor: 'warn', rotulo: 'Aviso' },
  { cor: 'err', rotulo: 'Perigo' },
];

export function PaginaMenusSuspensos() {
  const toast = useToast();
  const escolher = (id: string) => toast.info('Item escolhido', id);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Menus suspensos" icone="chevron-down" trilha />

      <Bloco titulo="Menu suspenso" descricao="O gatilho pode ser um botão ou ter cara de link (aparência texto).">
        <div className="demo-linha">
          <MenuSuspenso rotulo="Botão com menu" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
          <MenuSuspenso rotulo="Link com menu" severidade="secundario" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
          <MenuSuspenso rotulo="Opções" aparencia="texto" itens={ACOES} aoEscolher={escolher} />
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo="Botões sólidos">
          <div className="demo-linha">
            {CORES.map((c) => (
              <MenuSuspenso key={c.cor} rotulo={c.rotulo} severidade={c.cor} formato="retangulo" itens={ACOES_SEPARADAS} aoEscolher={escolher} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Pílula" descricao="Formato padrão do botão.">
          <div className="demo-linha">
            {CORES.map((c) => (
              <MenuSuspenso key={c.cor} rotulo={c.rotulo} severidade={c.cor} itens={ACOES_SEPARADAS} aoEscolher={escolher} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Contorno">
          <div className="demo-linha">
            {CORES.map((c) => (
              <MenuSuspenso key={c.cor} rotulo={c.rotulo} severidade={c.cor} aparencia="contorno" formato="retangulo" itens={ACOES_SEPARADAS} aoEscolher={escolher} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Contorno em pílula">
          <div className="demo-linha">
            {CORES.map((c) => (
              <MenuSuspenso key={c.cor} rotulo={c.rotulo} severidade={c.cor} aparencia="contorno" itens={ACOES_SEPARADAS} aoEscolher={escolher} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Botão dividido" descricao="A ação principal fica separada da seta que abre o menu.">
          <div className="demo-linha">
            {CORES.map((c) => (
              <MenuSuspenso
                key={c.cor}
                dividido
                rotulo={c.rotulo}
                severidade={c.cor}
                formato="retangulo"
                itens={ACOES_SEPARADAS}
                aoEscolher={escolher}
                aoClicarPrincipal={() => toast.ok(c.rotulo, 'Ação principal')}
              />
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Tamanhos">
          <div className="demo-linha demo-linha--centro">
            <MenuSuspenso rotulo="Botão grande" tamanho="grande" formato="retangulo" itens={ACOES_SEPARADAS} aoEscolher={escolher} />
            <MenuSuspenso dividido rotulo="Grande dividido" severidade="secundario" tamanho="grande" formato="retangulo" itens={ACOES_SEPARADAS} aoEscolher={escolher} />
          </div>
          <div className="demo-linha demo-linha--centro">
            <MenuSuspenso rotulo="Botão pequeno" tamanho="pequeno" formato="retangulo" itens={ACOES_SEPARADAS} aoEscolher={escolher} />
            <MenuSuspenso dividido rotulo="Pequeno dividido" severidade="secundario" tamanho="pequeno" formato="retangulo" itens={ACOES_SEPARADAS} aoEscolher={escolher} />
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-4">
        <Bloco titulo="Para cima">
          <div className="demo-linha">
            <MenuSuspenso rotulo="Para cima" direcao="cima" formato="retangulo" itens={ACOES_SEPARADAS} aoEscolher={escolher} />
            <MenuSuspenso dividido rotulo="Dividido" direcao="cima" severidade="info" formato="retangulo" itens={ACOES_SEPARADAS} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo="Para a direita">
          <div className="demo-linha">
            <MenuSuspenso rotulo="Direita" direcao="direita" formato="retangulo" itens={ACOES_SEPARADAS} aoEscolher={escolher} />
            <MenuSuspenso dividido rotulo="Dividido" direcao="direita" severidade="info" formato="retangulo" itens={ACOES_SEPARADAS} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo="Para a esquerda">
          <div className="demo-linha">
            <MenuSuspenso rotulo="Esquerda" direcao="esquerda" formato="retangulo" itens={ACOES_SEPARADAS} aoEscolher={escolher} />
            <MenuSuspenso dividido rotulo="Dividido" direcao="esquerda" severidade="info" formato="retangulo" itens={ACOES_SEPARADAS} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo="Item ativo" descricao="Marca a opção atual (aria-current).">
          <div>
            <MenuSuspenso
              rotulo="Ordenar"
              icone="arrow-up-down"
              formato="retangulo"
              itens={[
                { id: 'recentes', rotulo: 'Mais recentes', ativo: true },
                { id: 'antigos', rotulo: 'Mais antigos' },
                { id: 'valor', rotulo: 'Maior valor' },
              ]}
              aoEscolher={escolher}
            />
          </div>
        </Bloco>

        <Bloco titulo="Item desabilitado" descricao="Segue visível, mas não pode ser escolhido.">
          <div>
            <MenuSuspenso
              rotulo="Pedido"
              formato="retangulo"
              itens={[
                { id: 'editar', rotulo: 'Editar' },
                { id: 'faturar', rotulo: 'Faturar', desabilitado: true },
                { id: 'cancelar', rotulo: 'Cancelar' },
              ]}
              aoEscolher={escolher}
            />
          </div>
        </Bloco>
        <div className="demo-span-2">
          <Bloco titulo="Fechamento" descricao="Escolhe se o menu fecha ao escolher um item, ao clicar fora, nos dois ou só pelo botão (e Esc).">
            <div className="demo-linha">
              <MenuSuspenso rotulo="Padrão" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
              <MenuSuspenso rotulo="Clique fora" fechamento="fora" severidade="secundario" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
              <MenuSuspenso rotulo="Clique dentro" fechamento="dentro" severidade="info" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
              <MenuSuspenso rotulo="Manual" fechamento="manual" severidade="warn" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
            </div>
          </Bloco>
        </div>
        <Bloco titulo="Com formulário" descricao="Painel livre; fecha só por fora ou ao enviar.">
          <div className="demo-linha">
            <MenuSuspenso rotulo="Entrar" icone="log-in" severidade="secundario" formato="retangulo" fechamento="fora" larguraMenu="17rem">
              {(fechar) => (
                <form
                  className="demo-menu-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.ok('Entrou', email || '(sem e-mail)');
                    fechar();
                  }}
                >
                  <CampoEmail rotulo="E-mail" valor={email} aoMudar={setEmail} />
                  <CampoSenha rotulo="Senha" valor={senha} aoMudar={setSenha} />
                  <CampoMarcacao rotulo="Lembrar de mim" valor={lembrar} aoMudar={setLembrar} />
                  <Botao type="submit" rotulo="Entrar" formato="retangulo" bloco />
                  <div className="demo-menu-form-rodape">
                    <a href="#/ui/menus">Novo por aqui? Cadastre-se</a>
                    <a href="#/ui/menus">Esqueceu a senha?</a>
                  </div>
                </form>
              )}
            </MenuSuspenso>
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-4">
        <Bloco titulo="Centralizado" descricao="O painel abre centrado no botão.">
          <div>
            <MenuSuspenso rotulo="Centralizado" alinhamento="centro" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo="Centralizado para cima">
          <div>
            <MenuSuspenso rotulo="Para cima" direcao="cima" alinhamento="centro" severidade="secundario" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo="Itens link ou botão" descricao="Item com href vira link; sem href, botão.">
          <div>
            <MenuSuspenso
              rotulo="Menu"
              severidade="info"
              formato="retangulo"
              itens={[
                { id: 'painel', rotulo: 'Ir ao painel', icone: 'house', href: '#/' },
                { id: 'perfil', rotulo: 'Meu perfil', icone: 'user', href: '#/perfil' },
                { tipo: 'divisor' },
                { id: 'copiar', rotulo: 'Copiar link', icone: 'copy', extra: 'Ctrl+C' },
                { id: 'excluir', rotulo: 'Excluir', icone: 'trash-2', destrutivo: true },
              ]}
              aoEscolher={escolher}
            />
          </div>
        </Bloco>
        <Bloco titulo="Deslocamento e referência" descricao="Afasta o painel, ou ancora no grupo inteiro.">
          <div className="demo-linha">
            <MenuSuspenso rotulo="Deslocado" deslocamento={[10, 20]} formato="retangulo" itens={ACOES} aoEscolher={escolher} />
            <MenuSuspenso dividido rotulo="Referência" referencia="pai" severidade="info" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-4">
        <div className="demo-span-3">
          <Bloco titulo="Alinhamento" descricao="Início (padrão), fim ou centro; e as direções.">
            <div className="demo-linha">
              <MenuSuspenso rotulo="Início" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
              <MenuSuspenso rotulo="Alinhado à direita" alinhamento="fim" severidade="secundario" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
              <MenuSuspenso rotulo="Início · fim na tela grande" alinhamentoTelaGrande="fim" severidade="info" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
              <MenuSuspenso rotulo="Fim · início na tela grande" alinhamento="fim" alinhamentoTelaGrande="inicio" severidade="warn" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
              <MenuSuspenso rotulo="Esquerda" direcao="esquerda" severidade="ok" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
              <MenuSuspenso rotulo="Direita" direcao="direita" severidade="err" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
              <MenuSuspenso rotulo="Para cima" direcao="cima" severidade="destaque" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
            </div>
          </Bloco>
        </div>
        <Bloco titulo="Painel escuro">
          <div>
            <MenuSuspenso
              rotulo="Menu escuro"
              severidade="escuro"
              formato="retangulo"
              escuro
              itens={[
                { id: 'acao', rotulo: 'Ação', ativo: true },
                { id: 'outra', rotulo: 'Outra ação' },
                { id: 'mais', rotulo: 'Mais alguma coisa' },
                { tipo: 'divisor' },
                { id: 'separado', rotulo: 'Link separado' },
              ]}
              aoEscolher={escolher}
            />
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-3">
        <Bloco titulo="Painel alinhado à direita">
          <div>
            <MenuSuspenso rotulo="Alinhado à direita" alinhamento="fim" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo="Responsivo: fim na tela grande" descricao="Início no celular; fim a partir de 64rem.">
          <div>
            <MenuSuspenso rotulo="Responsivo" alinhamentoTelaGrande="fim" severidade="secundario" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo="Responsivo: início na tela grande" descricao="Fim no celular; início a partir de 64rem.">
          <div>
            <MenuSuspenso rotulo="Responsivo" alinhamento="fim" alinhamentoTelaGrande="inicio" severidade="info" formato="retangulo" itens={ACOES} aoEscolher={escolher} />
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas">
        <Bloco titulo="Painéis coloridos" descricao="O item em foco e o ativo ganham a cor do painel.">
          <div className="demo-linha">
            {CORES.map((c) => (
              <MenuSuspenso key={c.cor} rotulo={c.rotulo} severidade={c.cor} cor={c.cor} formato="retangulo" itens={ACOES_SEPARADAS} aoEscolher={escolher} />
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Fantasma" descricao="Contorno discreto que se preenche no hover.">
          <div className="demo-linha">
            {CORES.map((c) => (
              <MenuSuspenso key={c.cor} rotulo={c.rotulo} severidade={c.cor} aparencia="fantasma" formato="retangulo" itens={ACOES_SEPARADAS} aoEscolher={escolher} />
            ))}
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-4">
        <Bloco titulo="Texto não interativo" descricao="Linha de texto que não recebe clique nem foco.">
          <div>
            <MenuSuspenso rotulo="Menu" formato="retangulo" itens={[{ tipo: 'texto', rotulo: 'Texto do menu' }, ...ACOES]} aoEscolher={escolher} />
          </div>
        </Bloco>
        <Bloco titulo="Títulos" descricao="Rotulam grupos de ações.">
          <div>
            <MenuSuspenso
              rotulo="Menu"
              severidade="secundario"
              formato="retangulo"
              itens={[{ tipo: 'titulo', rotulo: 'Título do grupo' }, ...ACOES, { tipo: 'titulo', rotulo: 'Outro grupo' }, { id: 'arquivar', rotulo: 'Arquivar' }]}
              aoEscolher={escolher}
            />
          </div>
        </Bloco>
        <Bloco titulo="Divisores">
          <div>
            <MenuSuspenso
              rotulo="Menu"
              severidade="info"
              formato="retangulo"
              itens={[{ tipo: 'titulo', rotulo: 'Título' }, ...ACOES_SEPARADAS]}
              aoEscolher={escolher}
            />
          </div>
        </Bloco>
        <Bloco titulo="Texto livre" descricao="Qualquer conteúdo dentro do painel.">
          <div>
            <MenuSuspenso rotulo="Sobre" icone="info" aparencia="contorno" formato="retangulo" larguraMenu="16rem">
              <div className="demo-menu-texto">
                <p>Um texto de exemplo que corre livre dentro do menu suspenso.</p>
                <p>E aqui mais um parágrafo de exemplo.</p>
              </div>
            </MenuSuspenso>
          </div>
        </Bloco>
      </div>
    </div>
  );
}
