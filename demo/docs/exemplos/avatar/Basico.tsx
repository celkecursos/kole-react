import { Avatar, ComBadge } from '../../../../src';

const foto = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="#13795b"/><circle cx="48" cy="38" r="18" fill="#fff" fill-opacity=".85"/><rect x="18" y="62" width="60" height="40" rx="20" fill="#fff" fill-opacity=".85"/></svg>')}`;

export default function Exemplo() {
  return (
    <div className="demo-linha">
      <Avatar nome="Ana Paula Souza" foto={foto} />
      {/* sem foto: as iniciais do nome */}
      <Avatar nome="Carlos Lima" />
      <Avatar nome="Beatriz Rocha" tom="escuro" />
      <Avatar nome="Loja Centro" formato="quadrado" tamanho="3rem" />
      <ComBadge conteudo={5} descricao="5 mensagens não lidas">
        <Avatar nome="Diego Alves" />
      </ComBadge>
      <ComBadge ponto cor="ok" posicao="inferior-direita" descricao="Online">
        <Avatar nome="Elisa Martins" foto={foto} />
      </ComBadge>
    </div>
  );
}
