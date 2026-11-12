import { Badge, Botao } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-pilha-p">
      <h3 style={{ margin: 0 }}>
        Relatórios <Badge rotulo="Novo" cor="destaque" tamanho="herdar" />
      </h3>
      <div className="demo-linha">
        {/* `inverso` = badge claro dentro de um botão sólido da mesma cor */}
        <Botao rotulo="Mensagens">
          Mensagens <Badge rotulo="4" aparencia="inverso" />
        </Botao>
      </div>
    </div>
  );
}
