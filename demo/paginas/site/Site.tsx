import { useEffect, useState, type ReactNode } from 'react';
import { Zap } from 'lucide-react';
import {
  Aba,
  Abas,
  Acordeao,
  Alerta,
  Avatar,
  Badge,
  Botao,
  CabecalhoSecao,
  CampoEmail,
  CampoPesquisa,
  CampoSelect,
  CampoTelefone,
  CampoTextarea,
  CampoTexto,
  Card,
  CardConteudo,
  CardDepoimento,
  CardPlano,
  CardRecurso,
  ConteudoArtigo,
  DestaqueSite,
  EstruturaSite,
  FaixaChamada,
  FaixaNumeros,
  FiltroPilulas,
  ItemAcordeao,
  ListaNumerada,
  Newsletter,
  Paginacao,
  RodapeSite,
  SecaoSite,
  SumarioPagina,
  Trilha,
  Vazio,
} from '../../../src';
import { AtendimentoSite } from './AtendimentoSite';
import { useT, type TradutorDemo } from '../../i18n/useT';
import { rico } from '../../i18n/rico';

/*
 * Páginas modelo de site institucional genérico (EstruturaSite), com os textos
 * de exemplo do modelo: troque "Sua Marca" e os textos pelos da empresa.
 * Dados fixos, para o teste visual.
 */

const MARCA = 'Sua Marca';

/** Marca do modelo: quadrado marinho, losango azul e ponto laranja (SVG, sem arquivo). */
const LOGO = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><defs><clipPath id="m"><rect width="36" height="36" rx="10"/></clipPath></defs><g clip-path="url(#m)"><rect width="36" height="36" fill="#0b1a36"/><rect x="18" y="18" width="22" height="22" rx="6" fill="#1f5fe0" transform="rotate(45 29 29)"/></g><circle cx="18" cy="18" r="5" fill="#ff9a2e"/></svg>',
)}`;

const NAV = (t: TradutorDemo['t']) => ([
  { rotulo: t('paginas.site.textos.home'), rota: '/site' },
  { rotulo: t('paginas.site.textos.sobre'), rota: '/site/sobre' },
  { rotulo: t('paginas.site.textos.servicos'), rota: '/site/servicos' },
  { rotulo: t('paginas.site.textos.blog'), rota: '/site/blog' },
  { rotulo: t('paginas.site.textos.contato'), rota: '/site/contato' },
]);

interface Post {
  cat: string;
  titulo: string;
  data: string;
}

const POSTS = (t: TradutorDemo['t']): Post[] => ((
  [
    [t('paginas.site.textos.guias'), t('paginas.site.textos.comoDarOPrimeiro'), '05/11/2026'],
    [t('paginas.site.textos.novidades'), t('paginas.site.textos.oQueMudouNa'), '03/11/2026'],
    [t('paginas.site.textos.dicas'), '7 dicas simples para aproveitar melhor o seu tempo', '30/10/2026'],
    [t('paginas.site.textos.cases'), t('paginas.site.textos.comoUmClienteReduziu'), '27/10/2026'],
    [t('paginas.site.textos.guias'), t('paginas.site.textos.checklistCompletoAntesDe'), '22/10/2026'],
    [t('paginas.site.textos.dicas'), t('paginas.site.textos.errosComunsEComo'), '18/10/2026'],
    [t('paginas.site.textos.novidades'), t('paginas.site.textos.novosCanaisDeAtendimento'), '14/10/2026'],
    [t('paginas.site.textos.cases'), t('paginas.site.textos.dePlanilhasAResultados'), '09/10/2026'],
    [t('paginas.site.textos.guias'), t('paginas.site.textos.comoEscolherOPlano'), '03/10/2026'],
    [t('paginas.site.textos.dicas'), t('paginas.site.textos.organizeASemanaEm'), '29/09/2026'],
    [t('paginas.site.textos.novidades'), t('paginas.site.textos.agendaDeEventosDo'), '24/09/2026'],
    [t('paginas.site.textos.cases'), t('paginas.site.textos.atendimentoMaisRapidoCom'), '19/09/2026'],
  ] as const
).map(([cat, titulo, data]) => ({ cat, titulo, data })));

/** Área de imagem do modelo (listrada, com legenda), para trocar pela foto de verdade. */
function Imagem({ legenda, proporcao, className }: { legenda?: string; proporcao?: string; className?: string }) {
  return (
    <div className={`demo-site-img ${className ?? ''}`} style={proporcao ? { aspectRatio: proporcao } : undefined} aria-hidden="true">
      {legenda}
    </div>
  );
}

/** Link interno da demo (rotas em `#hash`, para o Ctrl+clique abrir a página certa). */
function LinkDemo({ rota, children }: { rota: string; children: ReactNode }) {
  return (
    <a className="demo-site-link" href={`#${rota}`}>
      {children}
    </a>
  );
}

export function PaginaSite({ rota, navegar }: { rota: string; navegar: (rota: string) => void }) {
  const { t } = useT();
  // página nova começa do topo (o site rola a janela, não um painel)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [rota]);
  const paginas: Record<string, ReactNode> = {
    '/site/inicio-claro': <Home navegar={navegar} faixa="claro" />,
    '/site/sobre': <Sobre />,
    '/site/servicos': <Servicos navegar={navegar} />,
    '/site/blog': <Blog />,
    '/site/blog/post': <PostCompleto />,
    '/site/blog/post-lateral': <PostComLateral />,
    '/site/contato': <Contato />,
    '/site/termos': <Termos />,
    '/site/privacidade': <Privacidade />,
    '/site/cookies': <Cookies />,
  };

  return (
    <EstruturaSite
      marca={{ nome: MARCA, href: '/site', logo: LOGO }}
      nav={NAV(t)}
      rotaAtual={rota}
      // rotas da demo ficam no #hash: o link de verdade aponta para "#/site/…"
      renderLink={(p) => (
        <a href={`#${p.href}`} className={p.className} onClick={p.onClick} aria-current={p['aria-current']}>
          {p.children}
        </a>
      )}
      aviso={
        <>
          <b>Novidade:</b> conheça a nova versão do nosso serviço. <a href="#/site/blog">Saiba mais →</a>
        </>
      }
      avisoLateral={
        <>
          <span>(11) 0000-0000</span>
          <span>{t('paginas.site.textos.contatoSuamarcaCom')}</span>
        </>
      }
      acoes={
        <>
          <Botao rotulo={t('paginas.site.textos.entrar')} severidade="secundario" aparencia="contorno" onClick={() => navegar('/login')} />
          <Botao rotulo={t('paginas.site.textos.faleConosco')} onClick={() => navegar('/site/contato')} />
        </>
      }
      rodape={
        <RodapeSite
          nome={MARCA}
          descricao={t('paginas.site.textos.umaFraseQueResume')}
          extra={<Newsletter aparencia="linha" rotuloBotao={t('paginas.site.textos.assinar')} aoInscrever={() => undefined} />}
          colunas={[
            { titulo: t('paginas.site.textos.navegacao'), links: NAV(t) },
            {
              titulo: t('paginas.site.textos.legal'),
              links: [
                { rotulo: t('paginas.site.textos.termosDeUso'), rota: '/site/termos' },
                { rotulo: t('paginas.site.textos.politicaDePrivacidade'), rota: '/site/privacidade' },
                { rotulo: t('paginas.site.textos.cookies'), rota: '/site/cookies' },
              ],
            },
          ]}
          copyright={`© 2026 ${MARCA}. Todos os direitos reservados.`}
          redes={[
            { rotulo: t('paginas.site.textos.instagram'), rota: '/site' },
            { rotulo: t('paginas.site.textos.linkedin'), rota: '/site' },
            { rotulo: t('paginas.site.textos.youtube'), rota: '/site' },
          ]}
        />
      }
    >
      {paginas[rota] ?? <Home navegar={navegar} faixa="escuro" />}
      <AtendimentoSite navegar={navegar} />
    </EstruturaSite>
  );
}

/* ---------------- Home ---------------- */

const TITULO_HOME = (t: TradutorDemo['t']) => (t('paginas.site.textos.umaFraseForteQue'));
const TEXTO_HOME = (t: TradutorDemo['t']) => (t('paginas.site.textos.umParagrafoCurtoExplicando'));

const DIFERENCIAIS = (t: TradutorDemo['t']) => ([
  { icone: <Zap />, titulo: t('paginas.site.textos.rapidoDeComecar'), texto: t('paginas.site.textos.expliqueEmUmaFrase') },
  { icone: 'shield', titulo: t('paginas.site.textos.seguroEConfiavel'), texto: t('paginas.site.textos.faleDeGarantiasCertificacoes') },
  { icone: 'chart-line', titulo: t('paginas.site.textos.resultadosMedidos'), texto: t('paginas.site.textos.mostreComoOCliente') },
  { icone: 'users', titulo: t('paginas.site.textos.equipeEspecializada'), texto: t('paginas.site.textos.destaqueAExperienciaDas') },
  { icone: 'clock', titulo: t('paginas.site.textos.atendimentoAgil'), texto: t('paginas.site.textos.prazosDeRespostaE') },
  { icone: 'message-square', titulo: t('paginas.site.textos.suporteHumano'), texto: t('paginas.site.textos.canaisDeContatoE') },
] as const);

const FAQ = (t: TradutorDemo['t']) => ([
  [t('paginas.site.textos.comoFuncionaOAtendimento'), t('paginas.site.textos.expliqueAquiOPasso')],
  [t('paginas.site.textos.quaisSaoAsFormas'), t('paginas.site.textos.listeAsFormasAceitas')],
  [t('paginas.site.textos.possoCancelarQuandoQuiser'), t('paginas.site.textos.descrevaAPoliticaDe')],
  [t('paginas.site.textos.vocesAtendemEmTodo'), t('paginas.site.textos.informeAAreaDe')],
]);

function Home({ navegar, faixa }: { navegar: (rota: string) => void; faixa: 'escuro' | 'claro' }) {
  const { t } = useT();
  const botoes = (
    <div className="demo-linha">
      <Botao rotulo={t('paginas.site.textos.comecarAgora')} tamanho="grande" severidade={faixa === 'escuro' ? 'destaque' : 'pri'} onClick={() => navegar('/site/contato')} />
      <Botao rotulo={t('paginas.site.textos.verServicos')} tamanho="grande" severidade="secundario" aparencia="contorno" onClick={() => navegar('/site/servicos')} />
    </div>
  );
  return (
    <>
      {faixa === 'escuro' ? (
        <DestaqueSite
          selo={t('paginas.site.textos.seuSloganOuNovidade')}
          titulo={TITULO_HOME(t)}
          realce="negócio"
          descricao={TEXTO_HOME(t)}
          lateral={
            <div className="demo-site-hero-midia">
              <div className="demo-site-hero-fundo" aria-hidden="true" />
              <Imagem legenda={t('paginas.site.textos.imagemPrincipalMockupDo')} proporcao="5 / 4" className="demo-site-img--escura" />
              <div className="demo-site-hero-selo">
                <span className="demo-site-hero-selo-ic" aria-hidden="true">
                  ✓
                </span>
                <span>{rico(t('paginas.site.textos.destaqueRapido'))}<span>{t('paginas.site.textos.umDiferencialEmUma')}</span>
                </span>
              </div>
            </div>
          }
        >
          {botoes}
          <FaixaNumeros
            aparencia="simples"
            rotulo={t('paginas.site.textos.numerosDaEmpresa')}
            itens={[
              { valor: '+1.200', rotulo: t('paginas.site.textos.clientesAtendidos') },
              { valor: '4,9/5', rotulo: t('paginas.site.textos.avaliacaoMedia') },
              { valor: '10 anos', rotulo: t('paginas.site.textos.deMercado') },
            ]}
          />
        </DestaqueSite>
      ) : (
        <DestaqueSite
          aparencia="claro"
          selo={t('paginas.site.textos.seuSloganOuNovidade')}
          titulo={TITULO_HOME(t)}
          realce="negócio"
          descricao={TEXTO_HOME(t)}
          midia={<Imagem legenda={t('paginas.site.textos.imagemPrincipalMockupDo')} proporcao="16 / 7" />}
        >
          {botoes}
        </DestaqueSite>
      )}

      <SecaoSite espaco="compacto" rotulo={t('paginas.site.textos.clientes')}>
        <div className="demo-site-logos">
          <span>{t('paginas.site.textos.quemJaConfiaNa')}</span>
          <ul>
            {['LOGO 1', 'LOGO 2', 'LOGO 3', 'LOGO 4', 'LOGO 5', 'LOGO 6'].map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </SecaoSite>

      <SecaoSite rotulo={t('paginas.site.textos.diferenciais')}>
        <CabecalhoSecao
          sobretitulo={t('paginas.site.textos.diferenciais')}
          titulo={t('paginas.site.textos.porQueEscolherA', { MARCA })}
          descricao={t('paginas.site.textos.listeOsPrincipaisBeneficios')}
        />
        <div className="demo-site-grade demo-site-grade--300">
          {DIFERENCIAIS(t).map((d) => (
            <CardRecurso key={d.titulo} icone={d.icone} titulo={d.titulo}>
              {d.texto}
            </CardRecurso>
          ))}
        </div>
      </SecaoSite>

      <SecaoSite rotulo={t('paginas.site.textos.comoFunciona')}>
        <div className="demo-site-dividido">
          <Imagem legenda={t('paginas.site.textos.fotoDaEquipeAmbiente')} proporcao="4 / 3" />
          <div className="demo-pilha">
            <CabecalhoSecao sobretitulo={t('paginas.site.textos.comoFunciona')} titulo={t('paginas.site.textos.doPrimeiroContatoAo')} />
            <ListaNumerada
              rotulo={t('paginas.site.textos.passos')}
              itens={[
                { titulo: t('paginas.site.textos.contatoInicial'), descricao: t('paginas.site.textos.oClienteContaO') },
                { titulo: t('paginas.site.textos.propostaSobMedida'), descricao: t('paginas.site.textos.voceApresentaASolucao') },
                { titulo: t('paginas.site.textos.entregaEAcompanhamento'), descricao: t('paginas.site.textos.oTrabalhoERealizado') },
              ]}
            />
          </div>
        </div>
      </SecaoSite>

      <SecaoSite espaco="compacto" rotulo={t('paginas.site.textos.numeros')}>
        <FaixaNumeros
          rotulo={t('paginas.site.textos.numerosDaEmpresa')}
          itens={[
            { valor: '1.200', sufixo: '+', rotulo: t('paginas.site.textos.clientesAtendidos') },
            { valor: '98', sufixo: '%', rotulo: t('paginas.site.textos.deSatisfacao') },
            { valor: '24', sufixo: 'h', rotulo: t('paginas.site.textos.paraPrimeiraResposta') },
            { valor: '10', rotulo: t('paginas.site.textos.anosDeExperiencia') },
          ]}
        />
      </SecaoSite>

      <SecaoSite rotulo={t('paginas.site.textos.depoimentos')}>
        <CabecalhoSecao sobretitulo={t('paginas.site.textos.depoimentos')} titulo={t('paginas.site.textos.oQueDizemOs')} />
        <div className="demo-site-grade demo-site-grade--320">
          <CardDepoimento texto={t('paginas.site.textos.espacoParaUmDepoimento')} nome="Nome do Cliente" cargo="Cargo · Empresa" />
          <CardDepoimento texto={t('paginas.site.textos.outroDepoimentoCurtoDestacando')} nome="Nome do Cliente" cargo="Cargo · Empresa" />
          <CardDepoimento texto={t('paginas.site.textos.umTerceiroDepoimentoReforcando')} nome="Nome do Cliente" cargo="Cargo · Empresa" nota={4} />
        </div>
      </SecaoSite>

      <SecaoSite rotulo={t('paginas.site.textos.blog')}>
        <CabecalhoSecao sobretitulo={t('paginas.site.textos.blog')} titulo={t('paginas.site.textos.conteudosRecentes')} acao={<LinkDemo rota="/site/blog">{t('paginas.site.textos.verTodos')}</LinkDemo>} />
        <div className="demo-site-grade demo-site-grade--300">
          {POSTS(t).slice(0, 3).map((p) => (
            <CardConteudo
              key={p.titulo}
              href="/site/blog/post"
              midia={<Imagem legenda={t('paginas.site.textos.imagemDoPost')} />}
              etiquetas={
                <>
                  <Badge cor="pri" aparencia="suave" formato="pilula" rotulo={p.cat} />
                  <span>{p.data}</span>
                </>
              }
              titulo={p.titulo}
            />
          ))}
        </div>
      </SecaoSite>

      <SecaoSite largura="estreita" rotulo={t('paginas.site.textos.perguntasFrequentes')}>
        <CabecalhoSecao sobretitulo={t('paginas.site.textos.duvidas')} titulo={t('paginas.site.textos.perguntasFrequentes')} alinhamento="centro" />
        <Acordeao icone="mais" padraoAbertos={['0']}>
          {FAQ(t).map(([p, r], i) => (
            <ItemAcordeao key={p} valor={String(i)} titulo={p}>
              {r}
            </ItemAcordeao>
          ))}
        </Acordeao>
      </SecaoSite>

      <SecaoSite espaco="amplo" rotulo={t('paginas.site.textos.contato')}>
        <FaixaChamada
          titulo={t('paginas.site.textos.prontoParaComecarFale')}
          descricao={t('paginas.site.textos.umaLinhaDeReforco')}
          acoes={
            <>
              <Botao rotulo={t('paginas.site.textos.solicitarContato')} tamanho="grande" severidade="destaque" onClick={() => navegar('/site/contato')} />
              <Botao rotulo={t('paginas.site.textos.verPlanos')} tamanho="grande" aparencia="contorno" onClick={() => navegar('/site/servicos')} />
            </>
          }
        />
      </SecaoSite>
    </>
  );
}

/* ---------------- Sobre ---------------- */

function CabecalhoPaginaSite({ atual, titulo, descricao }: { atual: string; titulo: string; descricao?: string }) {
  const { t } = useT();
  return (
    <SecaoSite fundo="superficie" rotulo={atual}>
      <Trilha itens={[{ rotulo: t('paginas.site.textos.home'), rota: '/site', icone: 'house' }, { rotulo: atual }]} />
      <CabecalhoSecao nivel={1} tamanho="pagina" titulo={titulo} descricao={descricao} />
    </SecaoSite>
  );
}

function Sobre() {
  const { t } = useT();
  return (
    <>
      <CabecalhoPaginaSite
        atual={t('paginas.site.textos.sobre')}
        titulo={t('paginas.site.textos.umaFraseSobreA', { MARCA })}
        descricao={t('paginas.site.textos.conteEmPoucasLinhas')}
      />
      <SecaoSite rotulo={t('paginas.site.textos.nossaHistoria')}>
        <div className="demo-site-dividido">
          <div className="demo-site-texto">
            <h2>{t('paginas.site.textos.nossaHistoria')}</h2>
            <p>{t('paginas.site.textos.esteBlocoEPara')}</p>
            <p>{t('paginas.site.textos.umSegundoParagrafoPode')}</p>
            <FaixaNumeros
              aparencia="cartoes"
              rotulo={t('paginas.site.textos.aEmpresaEmNumeros')}
              itens={[
                { valor: '10', rotulo: t('paginas.site.textos.anos') },
                { valor: '1.200', sufixo: '+', rotulo: t('paginas.site.textos.clientes2') },
                { valor: '25', rotulo: t('paginas.site.textos.pessoas') },
              ]}
            />
          </div>
          <Imagem legenda={t('paginas.site.textos.fotoInstitucional')} proporcao="1" />
        </div>
      </SecaoSite>
      <SecaoSite espaco="compacto" rotulo={t('paginas.site.textos.nossosValores')}>
        <CabecalhoSecao titulo={t('paginas.site.textos.nossosValores')} />
        <div className="demo-site-grade demo-site-grade--260">
          {[
            ['Transparência', 'Comunicação clara em todas as etapas.'],
            ['Qualidade', 'Cuidado com cada detalhe da entrega.'],
            ['Proximidade', 'Atendimento humano e acessível.'],
            ['Evolução', 'Melhoria contínua do que fazemos.'],
          ].map(([t, d], i) => (
            <CardRecurso key={t} numero={String(i + 1).padStart(2, '0')} titulo={t}>
              {d}
            </CardRecurso>
          ))}
        </div>
      </SecaoSite>
      <SecaoSite espaco="amplo" rotulo={t('paginas.site.textos.equipe')}>
        <CabecalhoSecao titulo={t('paginas.site.textos.equipe')} />
        <div className="demo-site-grade demo-site-grade--220">
          {['Fundador(a)', 'Diretor(a) de Operações', 'Atendimento', 'Marketing'].map((cargo) => (
            <CardConteudo key={cargo} className="demo-site-pessoa" midia={<Imagem legenda={t('paginas.site.textos.foto')} />} titulo={t('paginas.site.textos.nomeSobrenome')} resumo={cargo} />
          ))}
        </div>
      </SecaoSite>
    </>
  );
}

/* ---------------- Serviços e planos ---------------- */

const PLANOS = (t: TradutorDemo['t']) => ([
  { nome: t('paginas.site.textos.basico'), descricao: t('paginas.site.textos.paraQuemEstaComecando'), mensal: '49', anual: '39', itens: [t('paginas.site.textos.recursoEssencial1'), t('paginas.site.textos.recursoEssencial2'), t('paginas.site.textos.suportePorEMail'), '1 usuário'] },
  {
    nome: t('paginas.site.textos.profissional'),
    descricao: t('paginas.site.textos.paraNegociosEmCrescimento'),
    mensal: '99',
    anual: '79',
    itens: [t('paginas.site.textos.tudoDoBasico'), t('paginas.site.textos.recursoAvancado1'), t('paginas.site.textos.recursoAvancado2'), t('paginas.site.textos.suportePrioritario'), t('paginas.site.textos.ate5Usuarios')],
    destaque: true,
  },
  { nome: t('paginas.site.textos.empresa'), descricao: t('paginas.site.textos.paraEquipesMaiores'), mensal: '199', anual: '159', itens: [t('paginas.site.textos.tudoDoProfissional'), t('paginas.site.textos.integracoesPersonalizadas'), t('paginas.site.textos.gerenteDeConta'), t('paginas.site.textos.usuariosIlimitados')] },
]);

function Servicos({ navegar }: { navegar: (rota: string) => void }) {
  const { t } = useT();
  const [cobranca, setCobranca] = useState('mensal');
  const anual = cobranca === 'anual';
  return (
    <>
      <DestaqueSite
        topo={<Trilha itens={[{ rotulo: t('paginas.site.textos.home'), rota: '/site', icone: 'house' }, { rotulo: t('paginas.site.textos.servicos') }]} />}
        titulo={t('paginas.site.textos.servicosEPlanosPara')}
        descricao={t('paginas.site.textos.apresenteOQueVoce')}
      />
      <SecaoSite rotulo={t('paginas.site.textos.servicos')}>
        <div className="demo-site-grade demo-site-grade--340">
          {(
            [
              ['package', 'Serviço ou produto 1'],
              ['pencil', 'Serviço ou produto 2'],
              ['chart-line', 'Serviço ou produto 3'],
              ['message-square', 'Serviço ou produto 4'],
            ] as const
          ).map(([icone, titulo]) => (
            <CardRecurso key={titulo} formato="horizontal" icone={icone} titulo={titulo} acao={<LinkDemo rota="/site/contato">{t('paginas.site.textos.saibaMais')}</LinkDemo>}>{t('paginas.site.textos.descricaoCurtaDoQue')}</CardRecurso>
          ))}
        </div>
      </SecaoSite>
      <SecaoSite espaco="amplo" rotulo={t('paginas.site.textos.planos')}>
        <CabecalhoSecao titulo={t('paginas.site.textos.planos')} descricao={t('paginas.site.textos.escolhaOQueFaz')} alinhamento="centro" />
        <div className="demo-site-centro">
          <Abas variante="segmentado" ativa={cobranca} aoMudar={setCobranca} rotulo={t('paginas.site.textos.cobranca')}>
            <Aba valor="mensal" rotulo={t('paginas.site.textos.mensal')} />
            <Aba valor="anual" rotulo={t('paginas.site.textos.anual20')} />
          </Abas>
        </div>
        <div className="demo-site-grade demo-site-grade--300 demo-site-planos">
          {PLANOS(t).map((p) => (
            <CardPlano
              key={p.nome}
              nome={p.nome}
              descricao={p.descricao}
              preco={anual ? p.anual : p.mensal}
              periodo={anual ? '/mês, cobrado anual' : '/mês'}
              itens={p.itens}
              destaque={p.destaque}
              acao={
                <Botao
                  rotulo={t('paginas.site.textos.assinarNome', { nome: p.nome })}
                  bloco
                  tamanho="grande"
                  severidade={p.destaque ? 'destaque' : 'secundario'}
                  aparencia={p.destaque ? 'solido' : 'contorno'}
                  onClick={() => navegar('/site/contato')}
                />
              }
            />
          ))}
        </div>
      </SecaoSite>
    </>
  );
}

/* ---------------- Blog ---------------- */

const POR_PAGINA = 6;

function Blog() {
  const { t } = useT();
  const [termo, setTermo] = useState('');
  const [busca, setBusca] = useState('');
  const [cat, setCat] = useState('Todos');
  const [pagina, setPagina] = useState(1);
  const filtrados = POSTS(t).slice(1).filter((p) => (cat === 'Todos' || p.cat === cat) && (!busca || p.titulo.toLowerCase().includes(busca.toLowerCase())));
  const visiveis = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  return (
    <>
      <SecaoSite fundo="superficie" rotulo={t('paginas.site.textos.filtrosDoBlog')}>
        <Trilha itens={[{ rotulo: t('paginas.site.textos.home'), rota: '/site', icone: 'house' }, { rotulo: t('paginas.site.textos.blog') }]} />
        <CabecalhoSecao
          nivel={1}
          tamanho="pagina"
          titulo={t('paginas.site.textos.blog')}
          acao={
            <CampoPesquisa
              valor={termo}
              aoMudar={setTermo}
              aoPesquisar={(t) => {
                setBusca(t);
                setPagina(1);
              }}
              placeholder={t('paginas.site.textos.pesquisarNoBlog')}
            />
          }
        />
        <FiltroPilulas
          rotulo={t('paginas.site.textos.categoria')}
          disposicao="rolar"
          valor={cat}
          aoMudar={(c) => {
            setCat(c);
            setPagina(1);
          }}
          opcoes={['Todos', 'Guias', 'Dicas', 'Novidades', 'Cases'].map((c) => ({ valor: c, rotulo: c }))}
        />
      </SecaoSite>
      <SecaoSite espaco="amplo" rotulo={t('paginas.site.textos.posts')}>
        <div className="demo-site-lista-lateral">
          <div className="demo-pilha">
            <CardConteudo
              formato="horizontal"
              nivel={2}
              href="/site/blog/post-lateral"
              midia={<Imagem legenda={t('paginas.site.textos.imagemEmDestaque')} />}
              etiquetas={
                <>
                  <Badge cor="destaque" formato="pilula" rotulo={t('paginas.site.textos.destaque')} />
                  <Badge cor="pri" aparencia="suave" formato="pilula" rotulo={POSTS(t)[0].cat} />
                </>
              }
              titulo={t('paginas.site.textos.tituloDoPostEm')}
              resumo={t('paginas.site.textos.resumoDoConteudoEm')}
              rodape="Nome do autor · 05/11/2026 · 6 min de leitura"
            />
            {visiveis.length ? (
              <div className="demo-site-grade demo-site-grade--260">
                {visiveis.map((p) => (
                  <CardConteudo
                    key={p.titulo}
                    href="/site/blog/post"
                    midia={<Imagem />}
                    etiquetas={
                      <>
                        <span className="demo-site-cat-tx">{p.cat}</span>
                        <span>{p.data}</span>
                      </>
                    }
                    titulo={p.titulo}
                  />
                ))}
              </div>
            ) : (
              <Vazio titulo={t('paginas.site.textos.nenhumPostNestaCategoria')} icone="file-text" />
            )}
            {filtrados.length > POR_PAGINA && <Paginacao total={filtrados.length} pagina={pagina} tamanho={POR_PAGINA} aoMudarPagina={setPagina} />}
          </div>
          <LateralBlog />
        </div>
      </SecaoSite>
    </>
  );
}

/* ---------------- Post (sem e com coluna lateral) ---------------- */

const TRILHA_POST = (t: TradutorDemo['t']) => ([{ rotulo: t('paginas.site.textos.home'), rota: '/site', icone: 'house' as const }, { rotulo: t('paginas.site.textos.blog'), rota: '/site/blog' }, { rotulo: t('paginas.site.textos.guias') }]);

function CabecalhoPost() {
  const { t } = useT();
  return (
    <>
      <Trilha itens={TRILHA_POST(t)} />
      <CabecalhoSecao nivel={1} tamanho="pagina" titulo={t('paginas.site.textos.tituloDoPostEm')} descricao={t('paginas.site.textos.linhaFinaQueResume')} />
      <div className="demo-site-autor">
        <Avatar nome="Nome do Autor" tamanho="2.5rem" />
        <span>{rico(t('paginas.site.textos.nomeDoAutor'))}<span>{t('paginas.site.textos.t051120266')}</span>
        </span>
      </div>
    </>
  );
}

function TextoPost({ className }: { className?: string }) {
  const { t } = useT();
  return (
    <ConteudoArtigo className={className}>
      <p>{t('paginas.site.textos.primeiroParagrafoDoArtigo')}</p>
      <h2>{t('paginas.site.textos.umSubtituloParaOrganizar')}</h2>
      <p>{t('paginas.site.textos.textoCorridoCom')}<a href="#/site/blog">{t('paginas.site.textos.links')}</a>{rico(t('paginas.site.textos.negritoEListasO'))}</p>
      <ul>
        <li>{t('paginas.site.textos.itemDeListaCom')}</li>
        <li>{t('paginas.site.textos.outroItemCurto')}</li>
        <li>{t('paginas.site.textos.umTerceiroItemPara')}</li>
      </ul>
      <blockquote>{t('paginas.site.textos.umaCitacaoOuDestaque')}</blockquote>
      <p>{t('paginas.site.textos.paragrafoDeConclusaoCom')}</p>
      <div className="demo-site-tags">
        {['guia', 'iniciantes', 'produtividade'].map((t) => (
          <Badge key={t} cor="neutral" aparencia="suave" formato="pilula" rotulo={`#${t}`} />
        ))}
      </div>
    </ConteudoArtigo>
  );
}

function LeiaTambem() {
  const { t } = useT();
  return (
    <SecaoSite espaco="amplo" rotulo={t('paginas.site.textos.leiaTambem')}>
      <CabecalhoSecao titulo={t('paginas.site.textos.leiaTambem')} />
      <div className="demo-site-grade demo-site-grade--280">
        {POSTS(t).slice(0, 3).map((p) => (
          <CardConteudo key={p.titulo} href="/site/blog/post" etiquetas={<span className="demo-site-cat-tx">{p.cat}</span>} titulo={p.titulo} />
        ))}
      </div>
    </SecaoSite>
  );
}

/** Coluna da direita do blog: newsletter, mais lidos e banner (a mesma da listagem). */
function LateralBlog() {
  const { t } = useT();
  return (
    <aside className="demo-site-lateral" aria-label={t('paginas.site.textos.maisDoBlog')}>
      <Newsletter descricao={t('paginas.site.textos.umEMailPor')} aoInscrever={() => undefined} />
      <Card titulo={t('paginas.site.secoes.maisLidos')}>
        <ListaNumerada tamanho="compacto" rotulo={t('paginas.site.textos.maisLidos')} itens={POSTS(t).slice(1, 5).map((p) => ({ titulo: p.titulo, href: '/site/blog/post' }))} />
      </Card>
      <Imagem legenda={t('paginas.site.textos.banner')} proporcao="4 / 3" className="demo-site-img--tracejada" />
    </aside>
  );
}

/** Post sem coluna lateral: cabeçalho, capa e texto na mesma coluna de leitura, centralizada. */
function PostCompleto() {
  const { t } = useT();
  return (
    <article>
      <SecaoSite espaco="compacto" rotulo={t('paginas.site.textos.cabecalhoDoPost')} className="demo-site-post">
        <CabecalhoPost />
      </SecaoSite>
      <div className="demo-site-capa">
        <Imagem legenda={t('paginas.site.textos.imagemDeCapa')} proporcao="21 / 9" />
      </div>
      <SecaoSite rotulo={t('paginas.site.textos.textoDoPost')}>
        <TextoPost />
      </SecaoSite>
      <LeiaTambem />
    </article>
  );
}

/** Post com a coluna da direita do blog: o texto fica na coluna da esquerda, alinhado a ela. */
function PostComLateral() {
  const { t } = useT();
  return (
    <>
      <SecaoSite espaco="amplo" rotulo={t('paginas.site.textos.post')}>
        <div className="demo-site-lista-lateral">
          <article className="demo-site-post-coluna">
            <CabecalhoPost />
            <Imagem legenda={t('paginas.site.textos.imagemDeCapa')} proporcao="16 / 9" />
            <TextoPost className="demo-site-post-texto" />
          </article>
          <LateralBlog />
        </div>
      </SecaoSite>
      <LeiaTambem />
    </>
  );
}

/* ---------------- Contato ---------------- */

function Contato() {
  const { t } = useT();
  const [enviado, setEnviado] = useState(false);
  const [f, setF] = useState({ nome: '', email: '', telefone: '', assunto: 'orcamento' as string | null, mensagem: '' });
  return (
    <>
      <CabecalhoPaginaSite atual={t('paginas.site.textos.contato')} titulo={t('paginas.site.textos.faleComAGente')} descricao={t('paginas.site.textos.respondemosEmAteUm')} />
      <SecaoSite espaco="amplo" rotulo={t('paginas.site.textos.formularioDeContato')}>
        <div className="demo-site-lista-lateral">
          <Card className="demo-site-form">
            {enviado ? (
              <Vazio titulo={t('paginas.site.textos.mensagemEnviada')} descricao={t('paginas.site.textos.retornaremosEmBrevePelo')} icone="circle-check">
                <Botao rotulo={t('paginas.site.textos.enviarOutra')} severidade="secundario" aparencia="contorno" onClick={() => setEnviado(false)} />
              </Vazio>
            ) : (
              <form
                className="demo-site-form-grade"
                onSubmit={(e) => {
                  e.preventDefault();
                  setEnviado(true);
                }}
              >
                <CampoTexto rotulo={t('paginas.site.textos.nome')} placeholder={t('paginas.site.textos.seuNome')} valor={f.nome} aoMudar={(nome) => setF({ ...f, nome })} />
                <CampoEmail rotulo={t('paginas.site.textos.eMail')} placeholder={t('paginas.site.textos.voceEmailCom')} valor={f.email} aoMudar={(email) => setF({ ...f, email })} />
                <CampoTelefone rotulo={t('paginas.site.textos.telefone')} valor={f.telefone} aoMudar={(telefone) => setF({ ...f, telefone })} />
                <CampoSelect
                  rotulo={t('paginas.site.textos.assunto')}
                  valor={f.assunto}
                  aoMudar={(assunto) => setF({ ...f, assunto })}
                  opcoes={[
                    { valor: 'orcamento', rotulo: t('paginas.site.textos.orcamento') },
                    { valor: 'suporte', rotulo: t('paginas.site.textos.suporte') },
                    { valor: 'parcerias', rotulo: t('paginas.site.textos.parcerias') },
                    { valor: 'outro', rotulo: t('paginas.site.textos.outro') },
                  ]}
                />
                <CampoTextarea className="demo-site-form-cheio" rotulo={t('paginas.site.textos.mensagem')} placeholder={t('paginas.site.textos.comoPodemosAjudar')} valor={f.mensagem} aoMudar={(mensagem) => setF({ ...f, mensagem })} />
                <div className="demo-site-form-pe">
                  <span>{t('paginas.site.textos.aoEnviarVoceConcorda')}</span>
                  <Botao rotulo={t('paginas.site.textos.enviarMensagem')} tamanho="grande" type="submit" />
                </div>
              </form>
            )}
          </Card>
          <aside className="demo-site-lateral" aria-label={t('paginas.site.textos.outrosCanais')}>
            <CardRecurso formato="horizontal" icone="phone" sobretitulo={t('paginas.site.textos.telefoneWhatsapp')} titulo="(11) 0000-0000" />
            <CardRecurso formato="horizontal" icone="mail" sobretitulo={t('paginas.site.textos.eMail')} titulo={t('paginas.site.textos.contatoSuamarcaCom')} />
            <CardRecurso formato="horizontal" icone="map-pin" sobretitulo={t('paginas.site.textos.endereco')} titulo={t('paginas.site.textos.ruaExemplo123Cidade')} />
            <Imagem legenda={t('paginas.site.textos.mapa')} proporcao="4 / 3" />
          </aside>
        </div>
      </SecaoSite>
    </>
  );
}

/* ---------------- Páginas legais (termos, privacidade, cookies) ---------------- */

interface SecaoLegal {
  id: string;
  titulo: string;
  conteudo: ReactNode;
}

/** Modelo das páginas legais: sumário ao lado, aviso de texto de exemplo e seções numeradas. */
function PaginaLegal({ atual, titulo, atualizacao, introducao, secoes }: { atual: string; titulo: string; atualizacao: string; introducao: ReactNode; secoes: SecaoLegal[] }) {
  const { t } = useT();
  const numeradas = secoes.map((s, i) => ({ ...s, rotulo: `${i + 1}. ${s.titulo}` }));
  return (
    <>
      <CabecalhoPaginaSite atual={atual} titulo={titulo} descricao={t('paginas.site.textos.ultimaAtualizacaoAtualizacaoEm', { atualizacao, atualizacao2: atualizacao })} />
      <SecaoSite espaco="amplo" rotulo={t('paginas.site.textos.textoTitulo', { titulo })}>
        <div className="demo-site-termos">
          <aside className="demo-site-termos-sumario">
            <SumarioPagina itens={numeradas} />
          </aside>
          <ConteudoArtigo className="demo-site-termos-texto">
            <Alerta
              severidade="warn"
              titulo={t('paginas.site.textos.textoDeExemplo')}
              mensagem={t('paginas.site.textos.esteEUmModelo')}
            />
            {introducao}
            {numeradas.map((s) => (
              <section key={s.id} className="demo-site-legal-secao" aria-labelledby={s.id}>
                <h2 id={s.id}>{s.rotulo}</h2>
                {s.conteudo}
              </section>
            ))}
          </ConteudoArtigo>
        </div>
      </SecaoSite>
    </>
  );
}

// recebe o `t` de quem usa: o texto fica no dicionário
const contatoLegal = (t: TradutorDemo['t']) => (
  <p>{t('paginas.site.textos.duvidas2')}<a href="#/site/contato">{t('paginas.site.textos.faleComAGente2')}</a>{t('paginas.site.textos.escrevaParaContatoSuamarca')}</p>
);

function Termos() {
  const { t } = useT();
  return (
    <PaginaLegal
      atual={t('paginas.site.textos.termosDeUso2')}
      titulo={t('paginas.site.textos.termosDeUso2')}
      atualizacao="05/11/2026"
      introducao={
        <p>{t('paginas.site.textos.estesTermosDeUso')}<b>{MARCA}</b>{t('paginas.site.textos.leiaComAtencaoAo')}</p>
      }
      secoes={[
        {
          id: 'aceitacao',
          titulo: t('paginas.site.textos.aceitacaoDosTermos'),
          conteudo: (
            <>
              <p>{t('paginas.site.textos.aoCriarUmaConta')}<a href="#/site/privacidade">{t('paginas.site.textos.politicaDePrivacidade')}</a>{t('paginas.site.textos.seNaoConcordarNao')}</p>
              <p>{t('paginas.site.textos.quemUsaOsServicos')}</p>
            </>
          ),
        },
        {
          id: 'definicoes',
          titulo: t('paginas.site.textos.definicoes'),
          conteudo: (
            <ul>
              <li>{rico(t('paginas.site.textos.servicosOSiteOs', { MARCA }))}</li>
              <li>{rico(t('paginas.site.textos.usuarioAPessoaQue'))}</li>
              <li>{rico(t('paginas.site.textos.contaOCadastroPessoal'))}</li>
            </ul>
          ),
        },
        {
          id: 'cadastro',
          titulo: t('paginas.site.textos.cadastroEConta'),
          conteudo: (
            <>
              <p>{t('paginas.site.textos.paraAlgumasFuncoesE')}</p>
              <p>{t('paginas.site.textos.sePerceberQualquerUso', { MARCA })}</p>
            </>
          ),
        },
        {
          id: 'uso',
          titulo: t('paginas.site.textos.usoPermitido'),
          conteudo: (
            <>
              <p>{t('paginas.site.textos.voceSeComprometeA')}</p>
              <ol>
                <li>{t('paginas.site.textos.tentarAcessarAreasContas')}</li>
                <li>{t('paginas.site.textos.enviarConteudoIlegalOfensivo')}</li>
                <li>{t('paginas.site.textos.copiarRevenderOuExplorar')}</li>
                <li>{t('paginas.site.textos.usarRobosOuProgramas')}</li>
              </ol>
            </>
          ),
        },
        {
          id: 'pagamentos',
          titulo: t('paginas.site.textos.pagamentosECancelamento'),
          conteudo: (
            <>
              <p>{t('paginas.site.textos.osPrecosAsFormas')}<a href="#/site/servicos">{t('paginas.site.textos.servicosEPlanos')}</a>{t('paginas.site.textos.asAssinaturasSaoRenovadas')}</p>
              <p>{t('paginas.site.textos.vocePodeCancelarQuando')}</p>
            </>
          ),
        },
        {
          id: 'propriedade',
          titulo: t('paginas.site.textos.propriedadeIntelectual'),
          conteudo: <p>{t('paginas.site.textos.marcasLogotiposTextosImagens', { MARCA })}</p>,
        },
        {
          id: 'dados',
          titulo: t('paginas.site.textos.privacidadeEDadosPessoais'),
          conteudo: (
            <p>{t('paginas.site.textos.tratamosOsDadosPessoais')}<a href="#/site/privacidade">{t('paginas.site.textos.politicaDePrivacidade')}</a>{t('paginas.site.textos.oUsoDeCookies')}<a href="#/site/cookies">{t('paginas.site.textos.politicaDeCookies')}</a>.
            </p>
          ),
        },
        {
          id: 'responsabilidade',
          titulo: t('paginas.site.textos.limitacaoDeResponsabilidade'),
          conteudo: (
            <p>{t('paginas.site.textos.trabalhamosParaManterOs', { MARCA })}</p>
          ),
        },
        {
          id: 'alteracoes',
          titulo: t('paginas.site.textos.alteracoesDestesTermos'),
          conteudo: <p>{t('paginas.site.textos.estesTermosPodemMudar')}</p>,
        },
        {
          id: 'foro',
          titulo: t('paginas.site.textos.leiAplicavelEForo'),
          conteudo: <p>{t('paginas.site.textos.estesTermosSeguemAs')}</p>,
        },
        { id: 'contato', titulo: t('paginas.site.textos.contato'), conteudo: contatoLegal(t) },
      ]}
    />
  );
}

function Privacidade() {
  const { t } = useT();
  return (
    <PaginaLegal
      atual={t('paginas.site.textos.politicaDePrivacidade')}
      titulo={t('paginas.site.textos.politicaDePrivacidade')}
      atualizacao="05/11/2026"
      introducao={
        <p>{t('paginas.site.textos.estaPoliticaExplicaComo')}<b>{MARCA}</b>{t('paginas.site.textos.coletaUsaGuardaE')}</p>
      }
      secoes={[
        {
          id: 'controlador',
          titulo: t('paginas.site.textos.quemCuidaDosSeus'),
          conteudo: (
            <p>{t('paginas.site.textos.aMarcaEA', { MARCA })}</p>
          ),
        },
        {
          id: 'coleta',
          titulo: t('paginas.site.textos.dadosQueColetamos'),
          conteudo: (
            <ul>
              <li>{rico(t('paginas.site.textos.queVoceInformaNome'))}</li>
              <li>{rico(t('paginas.site.textos.deUsoPaginasVisitadas'))}</li>
              <li>{rico(t('paginas.site.textos.dePagamentoTratadosPelo'))}</li>
            </ul>
          ),
        },
        {
          id: 'finalidade',
          titulo: t('paginas.site.textos.paraQueUsamosOs'),
          conteudo: (
            <ol>
              <li>{t('paginas.site.textos.prestarOsServicosContratados')}</li>
              <li>{t('paginas.site.textos.enviarComunicacoesSobreA')}</li>
              <li>{t('paginas.site.textos.cumprirObrigacoesLegaisComo')}</li>
              <li>{t('paginas.site.textos.manterOsServicosSeguros')}</li>
            </ol>
          ),
        },
        {
          id: 'bases',
          titulo: t('paginas.site.textos.basesLegais'),
          conteudo: <p>{t('paginas.site.textos.tratamosOsDadosCom')}</p>,
        },
        {
          id: 'compartilhamento',
          titulo: t('paginas.site.textos.compartilhamento'),
          conteudo: <p>{t('paginas.site.textos.compartilhamosDadosSoCom')}</p>,
        },
        {
          id: 'guarda',
          titulo: t('paginas.site.textos.guardaESeguranca'),
          conteudo: <p>{t('paginas.site.textos.guardamosOsDadosPelo')}</p>,
        },
        {
          id: 'direitos',
          titulo: t('paginas.site.textos.seusDireitos'),
          conteudo: (
            <>
              <p>{t('paginas.site.textos.pelaLgpdVocePode')}</p>
              <ul>
                <li>{t('paginas.site.textos.aConfirmacaoDeQue')}</li>
                <li>{t('paginas.site.textos.aCorrecaoDeDados')}</li>
                <li>{t('paginas.site.textos.aExclusaoDosDados')}</li>
                <li>{t('paginas.site.textos.aPortabilidadeParaOutro')}</li>
                <li>{t('paginas.site.textos.informacoesSobreComQuem')}</li>
              </ul>
              <blockquote>{t('paginas.site.textos.paraExercerSeusDireitos')}</blockquote>
            </>
          ),
        },
        {
          id: 'cookies-privacidade',
          titulo: t('paginas.site.textos.cookies'),
          conteudo: (
            <p>{t('paginas.site.textos.usamosCookiesParaO')}<a href="#/site/cookies">{t('paginas.site.textos.politicaDeCookies')}</a>.
            </p>
          ),
        },
        {
          id: 'alteracoes-privacidade',
          titulo: t('paginas.site.textos.alteracoesDestaPolitica'),
          conteudo: <p>{t('paginas.site.textos.estaPoliticaPodeMudar')}</p>,
        },
        { id: 'contato-privacidade', titulo: t('paginas.site.textos.contato'), conteudo: contatoLegal(t) },
      ]}
    />
  );
}

function Cookies() {
  const { t } = useT();
  return (
    <PaginaLegal
      atual={t('paginas.site.textos.politicaDeCookies')}
      titulo={t('paginas.site.textos.politicaDeCookies')}
      atualizacao="05/11/2026"
      introducao={
        <p>{t('paginas.site.textos.estaPoliticaExplicaO')}<b>{MARCA}</b>{t('paginas.site.textos.usaEComoVoce')}<a href="#/site/privacidade">{t('paginas.site.textos.politicaDePrivacidade')}</a>.
        </p>
      }
      secoes={[
        {
          id: 'o-que-sao',
          titulo: t('paginas.site.textos.oQueSaoCookies'),
          conteudo: <p>{t('paginas.site.textos.cookiesSaoPequenosArquivos')}</p>,
        },
        {
          id: 'tipos',
          titulo: t('paginas.site.textos.cookiesQueUsamos'),
          conteudo: (
            <ul>
              <li>{rico(t('paginas.site.textos.necessariosMantemASessao'))}</li>
              <li>{rico(t('paginas.site.textos.deDesempenhoMedemDe'))}</li>
              <li>{rico(t('paginas.site.textos.deMarketingMostramAnuncios'))}</li>
            </ul>
          ),
        },
        {
          id: 'terceiros',
          titulo: t('paginas.site.textos.cookiesDeTerceiros'),
          conteudo: <p>{t('paginas.site.textos.algumasFerramentasDeMedicao')}</p>,
        },
        {
          id: 'controle',
          titulo: t('paginas.site.textos.comoControlarOsCookies'),
          conteudo: (
            <>
              <p>{t('paginas.site.textos.vocePodeAceitarOu')}</p>
              <p>{t('paginas.site.textos.tambemEPossivelApagar')}</p>
            </>
          ),
        },
        {
          id: 'prazo',
          titulo: t('paginas.site.textos.porQuantoTempo'),
          conteudo: <p>{t('paginas.site.textos.osCookiesDeSessao')}</p>,
        },
        {
          id: 'alteracoes-cookies',
          titulo: t('paginas.site.textos.alteracoesDestaPolitica'),
          conteudo: <p>{t('paginas.site.textos.estaPoliticaPodeMudar2')}</p>,
        },
        { id: 'contato-cookies', titulo: t('paginas.site.textos.contato'), conteudo: contatoLegal(t) },
      ]}
    />
  );
}
