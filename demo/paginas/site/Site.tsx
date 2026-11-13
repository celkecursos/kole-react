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

const NAV = [
  { rotulo: 'Home', rota: '/site' },
  { rotulo: 'Sobre', rota: '/site/sobre' },
  { rotulo: 'Serviços', rota: '/site/servicos' },
  { rotulo: 'Blog', rota: '/site/blog' },
  { rotulo: 'Contato', rota: '/site/contato' },
];

interface Post {
  cat: string;
  titulo: string;
  data: string;
}

const POSTS: Post[] = (
  [
    ['Guias', 'Como dar o primeiro passo: um guia prático para iniciantes', '05/11/2026'],
    ['Novidades', 'O que mudou na nova versão do nosso serviço', '03/11/2026'],
    ['Dicas', '7 dicas simples para aproveitar melhor o seu tempo', '30/10/2026'],
    ['Cases', 'Como um cliente reduziu custos em poucas semanas', '27/10/2026'],
    ['Guias', 'Checklist completo antes de contratar um fornecedor', '22/10/2026'],
    ['Dicas', 'Erros comuns e como evitá-los no dia a dia', '18/10/2026'],
    ['Novidades', 'Novos canais de atendimento para você', '14/10/2026'],
    ['Cases', 'De planilhas a resultados: a virada de um cliente', '09/10/2026'],
    ['Guias', 'Como escolher o plano certo para a sua empresa', '03/10/2026'],
    ['Dicas', 'Organize a semana em quinze minutos', '29/09/2026'],
    ['Novidades', 'Agenda de eventos do próximo trimestre', '24/09/2026'],
    ['Cases', 'Atendimento mais rápido com uma rotina simples', '19/09/2026'],
  ] as const
).map(([cat, titulo, data]) => ({ cat, titulo, data }));

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
      nav={NAV}
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
          <span>contato@suamarca.com</span>
        </>
      }
      acoes={
        <>
          <Botao rotulo="Entrar" severidade="secundario" aparencia="contorno" onClick={() => navegar('/login')} />
          <Botao rotulo="Fale conosco" onClick={() => navegar('/site/contato')} />
        </>
      }
      rodape={
        <RodapeSite
          nome={MARCA}
          descricao="Uma frase que resume o que a empresa faz e para quem."
          extra={<Newsletter aparencia="linha" rotuloBotao="Assinar" aoInscrever={() => undefined} />}
          colunas={[
            { titulo: 'Navegação', links: NAV },
            {
              titulo: 'Legal',
              links: [
                { rotulo: 'Termos de Uso', rota: '/site/termos' },
                { rotulo: 'Política de Privacidade', rota: '/site/privacidade' },
                { rotulo: 'Cookies', rota: '/site/cookies' },
              ],
            },
          ]}
          copyright={`© 2026 ${MARCA}. Todos os direitos reservados.`}
          redes={[
            { rotulo: 'Instagram', rota: '/site' },
            { rotulo: 'LinkedIn', rota: '/site' },
            { rotulo: 'YouTube', rota: '/site' },
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

const TITULO_HOME = 'Uma frase forte que diz o que o seu negócio resolve.';
const TEXTO_HOME = 'Um parágrafo curto explicando para quem é, o que entrega e por que vale a pena. Troque pelo texto da sua empresa, loja, escritório ou projeto.';

const DIFERENCIAIS = [
  { icone: <Zap />, titulo: 'Rápido de começar', texto: 'Explique em uma frase como é simples dar o primeiro passo.' },
  { icone: 'shield', titulo: 'Seguro e confiável', texto: 'Fale de garantias, certificações ou cuidados com o cliente.' },
  { icone: 'chart-line', titulo: 'Resultados medidos', texto: 'Mostre como o cliente acompanha o que foi entregue.' },
  { icone: 'users', titulo: 'Equipe especializada', texto: 'Destaque a experiência das pessoas por trás do serviço.' },
  { icone: 'clock', titulo: 'Atendimento ágil', texto: 'Prazos de resposta e disponibilidade de horários.' },
  { icone: 'message-square', titulo: 'Suporte humano', texto: 'Canais de contato e como o cliente é acompanhado.' },
] as const;

const FAQ = [
  ['Como funciona o atendimento?', 'Explique aqui o passo a passo do atendimento, prazos e canais disponíveis.'],
  ['Quais são as formas de pagamento?', 'Liste as formas aceitas: cartão, boleto, Pix, transferência ou outras.'],
  ['Posso cancelar quando quiser?', 'Descreva a política de cancelamento de forma clara e direta.'],
  ['Vocês atendem em todo o Brasil?', 'Informe a área de atuação ou se o atendimento é online.'],
];

function Home({ navegar, faixa }: { navegar: (rota: string) => void; faixa: 'escuro' | 'claro' }) {
  const botoes = (
    <div className="demo-linha">
      <Botao rotulo="Começar agora" tamanho="grande" severidade={faixa === 'escuro' ? 'destaque' : 'pri'} onClick={() => navegar('/site/contato')} />
      <Botao rotulo="Ver serviços" tamanho="grande" severidade="secundario" aparencia="contorno" onClick={() => navegar('/site/servicos')} />
    </div>
  );
  return (
    <>
      {faixa === 'escuro' ? (
        <DestaqueSite
          selo="Seu slogan ou novidade aqui"
          titulo={TITULO_HOME}
          realce="negócio"
          descricao={TEXTO_HOME}
          lateral={
            <div className="demo-site-hero-midia">
              <div className="demo-site-hero-fundo" aria-hidden="true" />
              <Imagem legenda="imagem principal / mockup do produto" proporcao="5 / 4" className="demo-site-img--escura" />
              <div className="demo-site-hero-selo">
                <span className="demo-site-hero-selo-ic" aria-hidden="true">
                  ✓
                </span>
                <span>
                  <b>Destaque rápido</b>
                  <span>Um diferencial em uma linha</span>
                </span>
              </div>
            </div>
          }
        >
          {botoes}
          <FaixaNumeros
            aparencia="simples"
            rotulo="Números da empresa"
            itens={[
              { valor: '+1.200', rotulo: 'clientes atendidos' },
              { valor: '4,9/5', rotulo: 'avaliação média' },
              { valor: '10 anos', rotulo: 'de mercado' },
            ]}
          />
        </DestaqueSite>
      ) : (
        <DestaqueSite
          aparencia="claro"
          selo="Seu slogan ou novidade aqui"
          titulo={TITULO_HOME}
          realce="negócio"
          descricao={TEXTO_HOME}
          midia={<Imagem legenda="imagem principal / mockup do produto" proporcao="16 / 7" />}
        >
          {botoes}
        </DestaqueSite>
      )}

      <SecaoSite espaco="compacto" rotulo="Clientes">
        <div className="demo-site-logos">
          <span>Quem já confia na gente</span>
          <ul>
            {['LOGO 1', 'LOGO 2', 'LOGO 3', 'LOGO 4', 'LOGO 5', 'LOGO 6'].map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </SecaoSite>

      <SecaoSite rotulo="Diferenciais">
        <CabecalhoSecao
          sobretitulo="Diferenciais"
          titulo={`Por que escolher a ${MARCA}`}
          descricao="Liste os principais benefícios. Cada card aceita um ícone, um título curto e uma frase de apoio."
        />
        <div className="demo-site-grade demo-site-grade--300">
          {DIFERENCIAIS.map((d) => (
            <CardRecurso key={d.titulo} icone={d.icone} titulo={d.titulo}>
              {d.texto}
            </CardRecurso>
          ))}
        </div>
      </SecaoSite>

      <SecaoSite rotulo="Como funciona">
        <div className="demo-site-dividido">
          <Imagem legenda="foto da equipe / ambiente / produto" proporcao="4 / 3" />
          <div className="demo-pilha">
            <CabecalhoSecao sobretitulo="Como funciona" titulo="Do primeiro contato ao resultado em três passos" />
            <ListaNumerada
              rotulo="Passos"
              itens={[
                { titulo: 'Contato inicial', descricao: 'O cliente conta o que precisa por formulário, WhatsApp ou telefone.' },
                { titulo: 'Proposta sob medida', descricao: 'Você apresenta a solução, os prazos e os valores.' },
                { titulo: 'Entrega e acompanhamento', descricao: 'O trabalho é realizado e acompanhado até o resultado.' },
              ]}
            />
          </div>
        </div>
      </SecaoSite>

      <SecaoSite espaco="compacto" rotulo="Números">
        <FaixaNumeros
          rotulo="Números da empresa"
          itens={[
            { valor: '1.200', sufixo: '+', rotulo: 'clientes atendidos' },
            { valor: '98', sufixo: '%', rotulo: 'de satisfação' },
            { valor: '24', sufixo: 'h', rotulo: 'para primeira resposta' },
            { valor: '10', rotulo: 'anos de experiência' },
          ]}
        />
      </SecaoSite>

      <SecaoSite rotulo="Depoimentos">
        <CabecalhoSecao sobretitulo="Depoimentos" titulo="O que dizem os clientes" />
        <div className="demo-site-grade demo-site-grade--320">
          <CardDepoimento texto="Espaço para um depoimento real de cliente, com duas ou três linhas falando do resultado obtido." nome="Nome do Cliente" cargo="Cargo · Empresa" />
          <CardDepoimento texto="Outro depoimento curto destacando atendimento, rapidez ou qualidade da entrega." nome="Nome do Cliente" cargo="Cargo · Empresa" />
          <CardDepoimento texto="Um terceiro depoimento reforçando confiança e recomendação do serviço." nome="Nome do Cliente" cargo="Cargo · Empresa" nota={4} />
        </div>
      </SecaoSite>

      <SecaoSite rotulo="Blog">
        <CabecalhoSecao sobretitulo="Blog" titulo="Conteúdos recentes" acao={<LinkDemo rota="/site/blog">Ver todos →</LinkDemo>} />
        <div className="demo-site-grade demo-site-grade--300">
          {POSTS.slice(0, 3).map((p) => (
            <CardConteudo
              key={p.titulo}
              href="/site/blog/post"
              midia={<Imagem legenda="imagem do post" />}
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

      <SecaoSite largura="estreita" rotulo="Perguntas frequentes">
        <CabecalhoSecao sobretitulo="Dúvidas" titulo="Perguntas frequentes" alinhamento="centro" />
        <Acordeao icone="mais" padraoAbertos={['0']}>
          {FAQ.map(([p, r], i) => (
            <ItemAcordeao key={p} valor={String(i)} titulo={p}>
              {r}
            </ItemAcordeao>
          ))}
        </Acordeao>
      </SecaoSite>

      <SecaoSite espaco="amplo" rotulo="Contato">
        <FaixaChamada
          titulo="Pronto para começar? Fale com a nossa equipe hoje."
          descricao="Uma linha de reforço com a principal promessa ou condição especial."
          acoes={
            <>
              <Botao rotulo="Solicitar contato" tamanho="grande" severidade="destaque" onClick={() => navegar('/site/contato')} />
              <Botao rotulo="Ver planos" tamanho="grande" aparencia="contorno" onClick={() => navegar('/site/servicos')} />
            </>
          }
        />
      </SecaoSite>
    </>
  );
}

/* ---------------- Sobre ---------------- */

function CabecalhoPaginaSite({ atual, titulo, descricao }: { atual: string; titulo: string; descricao?: string }) {
  return (
    <SecaoSite fundo="superficie" rotulo={atual}>
      <Trilha itens={[{ rotulo: 'Home', rota: '/site', icone: 'house' }, { rotulo: atual }]} />
      <CabecalhoSecao nivel={1} tamanho="pagina" titulo={titulo} descricao={descricao} />
    </SecaoSite>
  );
}

function Sobre() {
  return (
    <>
      <CabecalhoPaginaSite
        atual="Sobre"
        titulo={`Uma frase sobre a missão e a história da ${MARCA}.`}
        descricao="Conte em poucas linhas quando começou, o que motivou e onde quer chegar."
      />
      <SecaoSite rotulo="Nossa história">
        <div className="demo-site-dividido">
          <div className="demo-site-texto">
            <h2>Nossa história</h2>
            <p>Este bloco é para um texto mais longo sobre a trajetória: fundação, primeiros clientes, marcos importantes e o que mudou ao longo do tempo.</p>
            <p>Um segundo parágrafo pode falar sobre o jeito de trabalhar, a cultura da equipe e o compromisso com quem é atendido.</p>
            <FaixaNumeros
              aparencia="cartoes"
              rotulo="A empresa em números"
              itens={[
                { valor: '10', rotulo: 'anos' },
                { valor: '1.200', sufixo: '+', rotulo: 'clientes' },
                { valor: '25', rotulo: 'pessoas' },
              ]}
            />
          </div>
          <Imagem legenda="foto institucional" proporcao="1" />
        </div>
      </SecaoSite>
      <SecaoSite espaco="compacto" rotulo="Nossos valores">
        <CabecalhoSecao titulo="Nossos valores" />
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
      <SecaoSite espaco="amplo" rotulo="Equipe">
        <CabecalhoSecao titulo="Equipe" />
        <div className="demo-site-grade demo-site-grade--220">
          {['Fundador(a)', 'Diretor(a) de Operações', 'Atendimento', 'Marketing'].map((cargo) => (
            <CardConteudo key={cargo} className="demo-site-pessoa" midia={<Imagem legenda="foto" />} titulo="Nome Sobrenome" resumo={cargo} />
          ))}
        </div>
      </SecaoSite>
    </>
  );
}

/* ---------------- Serviços e planos ---------------- */

const PLANOS = [
  { nome: 'Básico', descricao: 'Para quem está começando', mensal: '49', anual: '39', itens: ['Recurso essencial 1', 'Recurso essencial 2', 'Suporte por e-mail', '1 usuário'] },
  {
    nome: 'Profissional',
    descricao: 'Para negócios em crescimento',
    mensal: '99',
    anual: '79',
    itens: ['Tudo do Básico', 'Recurso avançado 1', 'Recurso avançado 2', 'Suporte prioritário', 'Até 5 usuários'],
    destaque: true,
  },
  { nome: 'Empresa', descricao: 'Para equipes maiores', mensal: '199', anual: '159', itens: ['Tudo do Profissional', 'Integrações personalizadas', 'Gerente de conta', 'Usuários ilimitados'] },
];

function Servicos({ navegar }: { navegar: (rota: string) => void }) {
  const [cobranca, setCobranca] = useState('mensal');
  const anual = cobranca === 'anual';
  return (
    <>
      <DestaqueSite
        topo={<Trilha itens={[{ rotulo: 'Home', rota: '/site', icone: 'house' }, { rotulo: 'Serviços' }]} />}
        titulo="Serviços e planos para cada necessidade."
        descricao="Apresente o que você oferece. Funciona para produtos, consultorias, cursos, assinaturas ou serviços locais."
      />
      <SecaoSite rotulo="Serviços">
        <div className="demo-site-grade demo-site-grade--340">
          {(
            [
              ['package', 'Serviço ou produto 1'],
              ['pencil', 'Serviço ou produto 2'],
              ['chart-line', 'Serviço ou produto 3'],
              ['message-square', 'Serviço ou produto 4'],
            ] as const
          ).map(([icone, titulo]) => (
            <CardRecurso key={titulo} formato="horizontal" icone={icone} titulo={titulo} acao={<LinkDemo rota="/site/contato">Saiba mais →</LinkDemo>}>
              Descrição curta do que está incluso e para quem é indicado.
            </CardRecurso>
          ))}
        </div>
      </SecaoSite>
      <SecaoSite espaco="amplo" rotulo="Planos">
        <CabecalhoSecao titulo="Planos" descricao="Escolha o que faz mais sentido para você." alinhamento="centro" />
        <div className="demo-site-centro">
          <Abas variante="segmentado" ativa={cobranca} aoMudar={setCobranca} rotulo="Cobrança">
            <Aba valor="mensal" rotulo="Mensal" />
            <Aba valor="anual" rotulo="Anual · −20%" />
          </Abas>
        </div>
        <div className="demo-site-grade demo-site-grade--300 demo-site-planos">
          {PLANOS.map((p) => (
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
                  rotulo={`Assinar ${p.nome}`}
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
  const [termo, setTermo] = useState('');
  const [busca, setBusca] = useState('');
  const [cat, setCat] = useState('Todos');
  const [pagina, setPagina] = useState(1);
  const filtrados = POSTS.slice(1).filter((p) => (cat === 'Todos' || p.cat === cat) && (!busca || p.titulo.toLowerCase().includes(busca.toLowerCase())));
  const visiveis = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  return (
    <>
      <SecaoSite fundo="superficie" rotulo="Filtros do blog">
        <Trilha itens={[{ rotulo: 'Home', rota: '/site', icone: 'house' }, { rotulo: 'Blog' }]} />
        <CabecalhoSecao
          nivel={1}
          tamanho="pagina"
          titulo="Blog"
          acao={
            <CampoPesquisa
              valor={termo}
              aoMudar={setTermo}
              aoPesquisar={(t) => {
                setBusca(t);
                setPagina(1);
              }}
              placeholder="Pesquisar no blog"
            />
          }
        />
        <FiltroPilulas
          rotulo="Categoria"
          disposicao="rolar"
          valor={cat}
          aoMudar={(c) => {
            setCat(c);
            setPagina(1);
          }}
          opcoes={['Todos', 'Guias', 'Dicas', 'Novidades', 'Cases'].map((c) => ({ valor: c, rotulo: c }))}
        />
      </SecaoSite>
      <SecaoSite espaco="amplo" rotulo="Posts">
        <div className="demo-site-lista-lateral">
          <div className="demo-pilha">
            <CardConteudo
              formato="horizontal"
              nivel={2}
              href="/site/blog/post-lateral"
              midia={<Imagem legenda="imagem em destaque" />}
              etiquetas={
                <>
                  <Badge cor="destaque" formato="pilula" rotulo="Destaque" />
                  <Badge cor="pri" aparencia="suave" formato="pilula" rotulo={POSTS[0].cat} />
                </>
              }
              titulo="Título do post em destaque, com uma promessa clara para o leitor"
              resumo="Resumo do conteúdo em duas linhas, para chamar o clique e situar o assunto."
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
              <Vazio titulo="Nenhum post nesta categoria ainda." icone="file-text" />
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

const TRILHA_POST = [{ rotulo: 'Home', rota: '/site', icone: 'house' as const }, { rotulo: 'Blog', rota: '/site/blog' }, { rotulo: 'Guias' }];

function CabecalhoPost() {
  return (
    <>
      <Trilha itens={TRILHA_POST} />
      <CabecalhoSecao nivel={1} tamanho="pagina" titulo="Título do post em destaque, com uma promessa clara para o leitor" descricao="Linha fina que resume o artigo e ajuda no SEO." />
      <div className="demo-site-autor">
        <Avatar nome="Nome do Autor" tamanho="2.5rem" />
        <span>
          <b>Nome do autor</b>
          <span>05/11/2026 · 6 min de leitura</span>
        </span>
      </div>
    </>
  );
}

function TextoPost({ className }: { className?: string }) {
  return (
    <ConteudoArtigo className={className}>
      <p>Primeiro parágrafo do artigo. A área de leitura tem largura limitada (cerca de 70 caracteres por linha) para manter o texto confortável em qualquer tela.</p>
      <h2>Um subtítulo para organizar o conteúdo</h2>
      <p>
        Texto corrido com <a href="#/site/blog">links</a>, <b>negrito</b> e listas. O mesmo estilo serve para páginas institucionais como termos de uso e
        política de privacidade.
      </p>
      <ul>
        <li>Item de lista com um ponto importante</li>
        <li>Outro item curto</li>
        <li>Um terceiro item para fechar</li>
      </ul>
      <blockquote>Uma citação ou destaque que vale a pena ressaltar no meio do texto.</blockquote>
      <p>Parágrafo de conclusão com uma chamada para a próxima ação do leitor.</p>
      <div className="demo-site-tags">
        {['guia', 'iniciantes', 'produtividade'].map((t) => (
          <Badge key={t} cor="neutral" aparencia="suave" formato="pilula" rotulo={`#${t}`} />
        ))}
      </div>
    </ConteudoArtigo>
  );
}

function LeiaTambem() {
  return (
    <SecaoSite espaco="amplo" rotulo="Leia também">
      <CabecalhoSecao titulo="Leia também" />
      <div className="demo-site-grade demo-site-grade--280">
        {POSTS.slice(0, 3).map((p) => (
          <CardConteudo key={p.titulo} href="/site/blog/post" etiquetas={<span className="demo-site-cat-tx">{p.cat}</span>} titulo={p.titulo} />
        ))}
      </div>
    </SecaoSite>
  );
}

/** Coluna da direita do blog: newsletter, mais lidos e banner (a mesma da listagem). */
function LateralBlog() {
  return (
    <aside className="demo-site-lateral" aria-label="Mais do blog">
      <Newsletter descricao="Um e-mail por semana com os melhores conteúdos." aoInscrever={() => undefined} />
      <Card titulo="Mais lidos">
        <ListaNumerada tamanho="compacto" rotulo="Mais lidos" itens={POSTS.slice(1, 5).map((p) => ({ titulo: p.titulo, href: '/site/blog/post' }))} />
      </Card>
      <Imagem legenda="banner" proporcao="4 / 3" className="demo-site-img--tracejada" />
    </aside>
  );
}

/** Post sem coluna lateral: cabeçalho, capa e texto na mesma coluna de leitura, centralizada. */
function PostCompleto() {
  return (
    <article>
      <SecaoSite espaco="compacto" rotulo="Cabeçalho do post" className="demo-site-post">
        <CabecalhoPost />
      </SecaoSite>
      <div className="demo-site-capa">
        <Imagem legenda="imagem de capa" proporcao="21 / 9" />
      </div>
      <SecaoSite rotulo="Texto do post">
        <TextoPost />
      </SecaoSite>
      <LeiaTambem />
    </article>
  );
}

/** Post com a coluna da direita do blog: o texto fica na coluna da esquerda, alinhado a ela. */
function PostComLateral() {
  return (
    <>
      <SecaoSite espaco="amplo" rotulo="Post">
        <div className="demo-site-lista-lateral">
          <article className="demo-site-post-coluna">
            <CabecalhoPost />
            <Imagem legenda="imagem de capa" proporcao="16 / 9" />
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
  const [enviado, setEnviado] = useState(false);
  const [f, setF] = useState({ nome: '', email: '', telefone: '', assunto: 'orcamento' as string | null, mensagem: '' });
  return (
    <>
      <CabecalhoPaginaSite atual="Contato" titulo="Fale com a gente" descricao="Respondemos em até um dia útil. Escolha o canal que preferir." />
      <SecaoSite espaco="amplo" rotulo="Formulário de contato">
        <div className="demo-site-lista-lateral">
          <Card className="demo-site-form">
            {enviado ? (
              <Vazio titulo="Mensagem enviada!" descricao="Retornaremos em breve pelo e-mail informado." icone="circle-check">
                <Botao rotulo="Enviar outra" severidade="secundario" aparencia="contorno" onClick={() => setEnviado(false)} />
              </Vazio>
            ) : (
              <form
                className="demo-site-form-grade"
                onSubmit={(e) => {
                  e.preventDefault();
                  setEnviado(true);
                }}
              >
                <CampoTexto rotulo="Nome" placeholder="Seu nome" valor={f.nome} aoMudar={(nome) => setF({ ...f, nome })} />
                <CampoEmail rotulo="E-mail" placeholder="voce@email.com" valor={f.email} aoMudar={(email) => setF({ ...f, email })} />
                <CampoTelefone rotulo="Telefone" valor={f.telefone} aoMudar={(telefone) => setF({ ...f, telefone })} />
                <CampoSelect
                  rotulo="Assunto"
                  valor={f.assunto}
                  aoMudar={(assunto) => setF({ ...f, assunto })}
                  opcoes={[
                    { valor: 'orcamento', rotulo: 'Orçamento' },
                    { valor: 'suporte', rotulo: 'Suporte' },
                    { valor: 'parcerias', rotulo: 'Parcerias' },
                    { valor: 'outro', rotulo: 'Outro' },
                  ]}
                />
                <CampoTextarea className="demo-site-form-cheio" rotulo="Mensagem" placeholder="Como podemos ajudar?" valor={f.mensagem} aoMudar={(mensagem) => setF({ ...f, mensagem })} />
                <div className="demo-site-form-pe">
                  <span>Ao enviar, você concorda com a Política de Privacidade.</span>
                  <Botao rotulo="Enviar mensagem" tamanho="grande" type="submit" />
                </div>
              </form>
            )}
          </Card>
          <aside className="demo-site-lateral" aria-label="Outros canais">
            <CardRecurso formato="horizontal" icone="phone" sobretitulo="Telefone / WhatsApp" titulo="(11) 0000-0000" />
            <CardRecurso formato="horizontal" icone="mail" sobretitulo="E-mail" titulo="contato@suamarca.com" />
            <CardRecurso formato="horizontal" icone="map-pin" sobretitulo="Endereço" titulo="Rua Exemplo, 123 · Cidade/UF" />
            <Imagem legenda="mapa" proporcao="4 / 3" />
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
  const numeradas = secoes.map((s, i) => ({ ...s, rotulo: `${i + 1}. ${s.titulo}` }));
  return (
    <>
      <CabecalhoPaginaSite atual={atual} titulo={titulo} descricao={`Última atualização: ${atualizacao} · Em vigor a partir de ${atualizacao}`} />
      <SecaoSite espaco="amplo" rotulo={`Texto: ${titulo}`}>
        <div className="demo-site-termos">
          <aside className="demo-site-termos-sumario">
            <SumarioPagina itens={numeradas} />
          </aside>
          <ConteudoArtigo className="demo-site-termos-texto">
            <Alerta
              severidade="warn"
              titulo="Texto de exemplo"
              mensagem="Este é um modelo para mostrar a página. Troque pelo texto da sua empresa e revise com um advogado antes de publicar."
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

const CONTATO_LEGAL = (
  <p>
    Dúvidas: <a href="#/site/contato">fale com a gente</a>, escreva para contato@suamarca.com ou ligue para (11) 0000-0000.
  </p>
);

function Termos() {
  return (
    <PaginaLegal
      atual="Termos de uso"
      titulo="Termos de uso"
      atualizacao="05/11/2026"
      introducao={
        <p>
          Estes Termos de uso regulam o acesso e o uso do site, dos aplicativos e dos serviços da <b>{MARCA}</b>. Leia com atenção: ao usar qualquer um deles,
          você declara que leu, entendeu e concorda com as regras abaixo.
        </p>
      }
      secoes={[
        {
          id: 'aceitacao',
          titulo: 'Aceitação dos termos',
          conteudo: (
            <>
              <p>
                Ao criar uma conta ou usar os serviços, você aceita estes termos e a <a href="#/site/privacidade">Política de Privacidade</a>. Se não concordar,
                não use os serviços.
              </p>
              <p>Quem usa os serviços em nome de uma empresa declara ter poderes para aceitar estes termos em nome dela.</p>
            </>
          ),
        },
        {
          id: 'definicoes',
          titulo: 'Definições',
          conteudo: (
            <ul>
              <li>
                <b>Serviços:</b> o site, os aplicativos e tudo o que a {MARCA} oferece por eles.
              </li>
              <li>
                <b>Usuário:</b> a pessoa que acessa ou usa os serviços, com ou sem cadastro.
              </li>
              <li>
                <b>Conta:</b> o cadastro pessoal e intransferível que dá acesso às áreas restritas.
              </li>
            </ul>
          ),
        },
        {
          id: 'cadastro',
          titulo: 'Cadastro e conta',
          conteudo: (
            <>
              <p>Para algumas funções é preciso criar uma conta com dados verdadeiros e atualizados. Você é responsável por manter sua senha em segredo e por tudo o que for feito com a sua conta.</p>
              <p>Se perceber qualquer uso indevido, avise a {MARCA} pelos canais de contato. Podemos suspender contas com dados falsos ou uso que viole estes termos.</p>
            </>
          ),
        },
        {
          id: 'uso',
          titulo: 'Uso permitido',
          conteudo: (
            <>
              <p>Você se compromete a usar os serviços de forma lícita e a não:</p>
              <ol>
                <li>tentar acessar áreas, contas ou sistemas sem autorização;</li>
                <li>enviar conteúdo ilegal, ofensivo ou que viole direitos de terceiros;</li>
                <li>copiar, revender ou explorar os serviços sem autorização por escrito;</li>
                <li>usar robôs ou programas que sobrecarreguem ou prejudiquem os serviços.</li>
              </ol>
            </>
          ),
        },
        {
          id: 'pagamentos',
          titulo: 'Pagamentos e cancelamento',
          conteudo: (
            <>
              <p>
                Os preços, as formas de pagamento e os prazos de cada plano aparecem na página de <a href="#/site/servicos">Serviços e planos</a>. As assinaturas
                são renovadas automaticamente no fim de cada período, até que você cancele.
              </p>
              <p>
                Você pode cancelar quando quiser, pela sua conta ou pelos nossos canais. Nas compras feitas pela internet, vale o direito de arrependimento de 7
                dias previsto no Código de Defesa do Consumidor.
              </p>
            </>
          ),
        },
        {
          id: 'propriedade',
          titulo: 'Propriedade intelectual',
          conteudo: <p>Marcas, logotipos, textos, imagens e programas dos serviços pertencem à {MARCA} ou a quem os licenciou. O uso dos serviços não transfere a você nenhum desses direitos.</p>,
        },
        {
          id: 'dados',
          titulo: 'Privacidade e dados pessoais',
          conteudo: (
            <p>
              Tratamos os dados pessoais de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), como explica a{' '}
              <a href="#/site/privacidade">Política de Privacidade</a>. O uso de cookies está na <a href="#/site/cookies">Política de Cookies</a>.
            </p>
          ),
        },
        {
          id: 'responsabilidade',
          titulo: 'Limitação de responsabilidade',
          conteudo: (
            <p>
              Trabalhamos para manter os serviços disponíveis e seguros, mas eles podem passar por interrupções para manutenção ou por motivos fora do nosso
              controle. A {MARCA} não responde por danos causados por mau uso da conta ou por serviços de terceiros ligados aos nossos.
            </p>
          ),
        },
        {
          id: 'alteracoes',
          titulo: 'Alterações destes termos',
          conteudo: <p>Estes termos podem mudar. Avisaremos as mudanças importantes por e-mail ou por um aviso no site, com antecedência razoável. Continuar usando os serviços depois disso significa aceitar a nova versão.</p>,
        },
        {
          id: 'foro',
          titulo: 'Lei aplicável e foro',
          conteudo: <p>Estes termos seguem as leis brasileiras. Fica eleito o foro da comarca do domicílio do usuário para resolver qualquer questão sobre eles.</p>,
        },
        { id: 'contato', titulo: 'Contato', conteudo: CONTATO_LEGAL },
      ]}
    />
  );
}

function Privacidade() {
  return (
    <PaginaLegal
      atual="Política de Privacidade"
      titulo="Política de Privacidade"
      atualizacao="05/11/2026"
      introducao={
        <p>
          Esta política explica como a <b>{MARCA}</b> coleta, usa, guarda e protege os seus dados pessoais, de acordo com a Lei Geral de Proteção de Dados
          (LGPD, Lei nº 13.709/2018), e como você exerce os seus direitos.
        </p>
      }
      secoes={[
        {
          id: 'controlador',
          titulo: 'Quem cuida dos seus dados',
          conteudo: (
            <p>
              A {MARCA} é a controladora dos dados tratados nos serviços. O encarregado pelo tratamento de dados (DPO) atende pelo e-mail
              privacidade@suamarca.com.
            </p>
          ),
        },
        {
          id: 'coleta',
          titulo: 'Dados que coletamos',
          conteudo: (
            <ul>
              <li>
                <b>Que você informa:</b> nome, e-mail, telefone e as mensagens dos formulários.
              </li>
              <li>
                <b>De uso:</b> páginas visitadas, data e hora de acesso, endereço IP, navegador e dispositivo.
              </li>
              <li>
                <b>De pagamento:</b> tratados pelo meio de pagamento escolhido; não guardamos o número completo do cartão.
              </li>
            </ul>
          ),
        },
        {
          id: 'finalidade',
          titulo: 'Para que usamos os dados',
          conteudo: (
            <ol>
              <li>prestar os serviços contratados e o atendimento;</li>
              <li>enviar comunicações sobre a conta e, com a sua autorização, novidades;</li>
              <li>cumprir obrigações legais, como as fiscais;</li>
              <li>manter os serviços seguros e prevenir fraudes.</li>
            </ol>
          ),
        },
        {
          id: 'bases',
          titulo: 'Bases legais',
          conteudo: <p>Tratamos os dados com base na execução de contrato, no cumprimento de obrigação legal, no legítimo interesse e, quando necessário, no seu consentimento, que pode ser retirado a qualquer momento.</p>,
        },
        {
          id: 'compartilhamento',
          titulo: 'Compartilhamento',
          conteudo: <p>Compartilhamos dados só com quem nos ajuda a prestar os serviços (hospedagem, pagamento, envio de e-mail), sempre com contrato e para as mesmas finalidades, ou quando a lei ou uma autoridade exigir. Não vendemos dados pessoais.</p>,
        },
        {
          id: 'guarda',
          titulo: 'Guarda e segurança',
          conteudo: <p>Guardamos os dados pelo tempo necessário para as finalidades acima ou pelo prazo que a lei exigir. Usamos conexão criptografada, controle de acesso e cópias de segurança para protegê-los.</p>,
        },
        {
          id: 'direitos',
          titulo: 'Seus direitos',
          conteudo: (
            <>
              <p>Pela LGPD, você pode pedir a qualquer momento:</p>
              <ul>
                <li>a confirmação de que tratamos seus dados e o acesso a eles;</li>
                <li>a correção de dados incompletos ou desatualizados;</li>
                <li>a exclusão dos dados tratados com o seu consentimento;</li>
                <li>a portabilidade para outro fornecedor;</li>
                <li>informações sobre com quem compartilhamos os dados.</li>
              </ul>
              <blockquote>Para exercer seus direitos, escreva para privacidade@suamarca.com. Respondemos em até 15 dias.</blockquote>
            </>
          ),
        },
        {
          id: 'cookies-privacidade',
          titulo: 'Cookies',
          conteudo: (
            <p>
              Usamos cookies para o site funcionar e, com a sua autorização, para medir o uso. Os detalhes estão na <a href="#/site/cookies">Política de Cookies</a>.
            </p>
          ),
        },
        {
          id: 'alteracoes-privacidade',
          titulo: 'Alterações desta política',
          conteudo: <p>Esta política pode mudar. A data da última atualização fica no alto da página, e as mudanças importantes são avisadas por e-mail ou por um aviso no site.</p>,
        },
        { id: 'contato-privacidade', titulo: 'Contato', conteudo: CONTATO_LEGAL },
      ]}
    />
  );
}

function Cookies() {
  return (
    <PaginaLegal
      atual="Política de Cookies"
      titulo="Política de Cookies"
      atualizacao="05/11/2026"
      introducao={
        <p>
          Esta política explica o que são cookies, quais a <b>{MARCA}</b> usa e como você pode controlá-los. Ela completa a{' '}
          <a href="#/site/privacidade">Política de Privacidade</a>.
        </p>
      }
      secoes={[
        {
          id: 'o-que-sao',
          titulo: 'O que são cookies',
          conteudo: <p>Cookies são pequenos arquivos que o site guarda no seu navegador para lembrar informações entre uma visita e outra, como a sua sessão ou o tema escolhido.</p>,
        },
        {
          id: 'tipos',
          titulo: 'Cookies que usamos',
          conteudo: (
            <ul>
              <li>
                <b>Necessários:</b> mantêm a sessão, a segurança e as suas preferências. Sem eles o site não funciona e, por isso, não dependem de autorização.
              </li>
              <li>
                <b>De desempenho:</b> medem, de forma agregada, quais páginas são mais visitadas, para melhorar o site.
              </li>
              <li>
                <b>De marketing:</b> mostram anúncios mais relevantes em outros sites. Só são usados com a sua autorização.
              </li>
            </ul>
          ),
        },
        {
          id: 'terceiros',
          titulo: 'Cookies de terceiros',
          conteudo: <p>Algumas ferramentas de medição e de anúncios usam cookies próprios. Elas seguem as políticas dos seus fornecedores, que recomendamos consultar.</p>,
        },
        {
          id: 'controle',
          titulo: 'Como controlar os cookies',
          conteudo: (
            <>
              <p>Você pode aceitar ou recusar os cookies que não são necessários no aviso que aparece na primeira visita, e mudar a escolha quando quiser.</p>
              <p>Também é possível apagar ou bloquear cookies nas configurações do navegador. Bloquear os necessários pode impedir partes do site de funcionar.</p>
            </>
          ),
        },
        {
          id: 'prazo',
          titulo: 'Por quanto tempo',
          conteudo: <p>Os cookies de sessão somem quando você fecha o navegador. Os demais duram até 12 meses, ou até você apagá-los.</p>,
        },
        {
          id: 'alteracoes-cookies',
          titulo: 'Alterações desta política',
          conteudo: <p>Esta política pode mudar quando passarmos a usar novas ferramentas. A data da última atualização fica no alto da página.</p>,
        },
        { id: 'contato-cookies', titulo: 'Contato', conteudo: CONTATO_LEGAL },
      ]}
    />
  );
}
