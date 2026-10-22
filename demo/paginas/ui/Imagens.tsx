import { Avatar, CabecalhoPagina, Figura, Foto, Imagem, Status, type Anexo } from '../../../src';
import { Bloco, cena, retrato } from '../Bloco';

const FOTOS: Anexo[] = [
  { nome: 'frente.svg', tamanho: 18_000, tipo: 'image/svg+xml', url: retrato('#0b1a36', 'AP') },
  { nome: 'perfil.svg', tamanho: 17_500, tipo: 'image/svg+xml', url: retrato('#1f5fe0', 'AP') },
  { nome: 'lateral.svg', tamanho: 17_900, tipo: 'image/svg+xml', url: retrato('#f7931e', 'AP') },
];

const IMG = {
  mar: cena('#1f5fe0', '#0b1a36'),
  tarde: cena('#f7931e', '#7a2e0e', '#fff3c4'),
  campo: cena('#4fb3e8', '#15803d'),
  noite: cena('#0b1a36', '#1f2a44', '#e8eef8'),
  rosa: cena('#e879a6', '#5b2140'),
  deserto: cena('#f2c86b', '#a85d1e', '#fff8e1'),
  floresta: cena('#7cc4a0', '#14532d', '#fef3c7'),
};

const TEXTO =
  'Texto de exemplo correndo em volta da imagem. A imagem flutua para o lado e o parágrafo ocupa o espaço que sobra, descendo por baixo dela quando acaba a altura.';

export function PaginaImagens() {
  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Imagens e figuras" icone="image" trilha />

      <div className="demo-colunas-3">
        <Bloco titulo="Imagem responsiva" descricao="Encolhe para caber no container e nunca estoura a largura.">
          <div>
            <Imagem src={IMG.mar} alt="Paisagem azul com sol e morros" proporcao="1 / 1" largura="12.5rem" />
          </div>
        </Bloco>
        <Bloco titulo="Com cantos arredondados" descricao={<>cantos=&quot;arredondado&quot;</>}>
          <div>
            <Imagem src={IMG.tarde} alt="Paisagem ao entardecer" cantos="arredondado" proporcao="1 / 1" largura="12.5rem" />
          </div>
        </Bloco>
        <Bloco titulo="Imagem redonda" descricao={<>cantos=&quot;circulo&quot; com proporção 1 / 1.</>}>
          <div>
            <Imagem src={IMG.campo} alt="Paisagem de campo" cantos="circulo" proporcao="1 / 1" largura="12.5rem" />
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-3">
        <Bloco titulo="Alinhada à esquerda">
          <div className="demo-img-fluxo">
            <Imagem src={IMG.rosa} alt="Paisagem rosada" cantos="arredondado" alinhamento="esquerda" proporcao="1 / 1" largura="8rem" />
            <p>{TEXTO}</p>
          </div>
        </Bloco>
        <Bloco titulo="Centralizada">
          <div>
            <Imagem src={IMG.floresta} alt="Paisagem verde" cantos="arredondado" alinhamento="centro" proporcao="1 / 1" largura="12.5rem" />
          </div>
        </Bloco>
        <Bloco titulo="Alinhada à direita">
          <div className="demo-img-fluxo">
            <Imagem src={IMG.deserto} alt="Paisagem de deserto" cantos="arredondado" alinhamento="direita" proporcao="1 / 1" largura="8rem" />
            <p>{TEXTO}</p>
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-4">
        <div className="demo-span-2">
          <Bloco titulo="Figuras" descricao="Imagem com legenda; a legenda pode alinhar ao início, centro ou fim.">
            <div className="demo-img-fluxo">
              <Figura src={IMG.noite} alt="Paisagem noturna" legenda="Uma legenda para a imagem acima." proporcao="4 / 3" largura="12rem" />
              <Figura
                src={IMG.mar}
                alt="Paisagem azul"
                legenda="Uma legenda para a imagem acima."
                alinhamentoLegenda="fim"
                alinhamento="direita"
                proporcao="4 / 3"
                largura="12rem"
              />
            </div>
          </Bloco>
        </div>
        <Bloco titulo="Miniatura" descricao="Borda fina e respiro em volta.">
          <div>
            <Imagem src={IMG.campo} alt="Paisagem de campo" miniatura proporcao="1 / 1" largura="10rem" />
          </div>
        </Bloco>
        <Bloco titulo="Miniatura redonda">
          <div>
            <Imagem src={IMG.tarde} alt="Paisagem ao entardecer" miniatura cantos="circulo" proporcao="1 / 1" largura="10rem" />
          </div>
        </Bloco>
      </div>

      <Bloco titulo="Recorte em proporção" descricao="A mesma imagem recortada sem distorcer (object-fit: cover).">
        <div className="demo-linha">
          {['1 / 1', '4 / 3', '16 / 9', '3 / 4'].map((p) => (
            <Figura key={p} src={IMG.deserto} alt={`Recorte ${p}`} legenda={p} alinhamentoLegenda="centro" proporcao={p} largura="11rem" />
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo="Avatares" descricao="Iniciais do nome quando não há foto; tom, formato e tamanho.">
          <div className="demo-linha demo-linha--centro">
            <Avatar nome="Ana Pereira" />
            <Avatar nome="Bruno Lima" tom="escuro" />
            <Avatar nome="Carla Dias" formato="quadrado" tamanho="2.5rem" />
            <Avatar nome="Daniel Moreira" foto={retrato('#15803d', 'DM')} tamanho="3rem" />
          </div>
        </Bloco>
        <Bloco titulo="Foto" descricao="Tamanhos sm, md e lg; a do meio é ampliável (abre a galeria com as 3 fotos). Sem foto: avatar com iniciais, ou o conteúdo de semFoto.">
          <div className="demo-linha">
            <Foto nome="Ana Pereira" fotos={FOTOS[0].url} tamanho="sm" />
            <Foto
              nome="Ana Pereira"
              fotos={FOTOS}
              ampliavel
              sobreposto={
                <span style={{ position: 'absolute', left: 6, top: 6 }}>
                  <Status rotulo="3 fotos" severidade="info" />
                </span>
              }
            />
            <Foto nome="Ana Pereira" fotos={FOTOS[2]} tamanho="lg" ampliavel />
            <Foto nome="Bruno Lima" />
            <Foto nome="Carla Dias" semFoto={<span style={{ fontSize: 'var(--fs-caption)', color: 'var(--t4)' }}>Foto indisponível</span>} />
          </div>
        </Bloco>
      </div>
    </div>
  );
}
