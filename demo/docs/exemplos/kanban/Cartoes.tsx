import { CartaoKanban, MenuSuspenso, Progresso, useToast } from '../../../../src';

// datas a partir de hoje, no formato AAAA-MM-DD
const dia = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const capa = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="280"><rect width="640" height="280" fill="#4fb3e8"/><circle cx="470" cy="100" r="44" fill="#ffd27a"/><path d="M0 220 C160 150 300 190 640 170 L640 280 L0 280Z" fill="#15803d"/></svg>')}`;

export default function Exemplo() {
  const toast = useToast();
  return (
    <div className="demo-grade-2">
      <CartaoKanban
        titulo="Layout da página inicial"
        descricao="Faixa principal, destaques de produto e depoimentos."
        capa={capa}
        etiquetas={[
          { rotulo: 'Design', cor: 'graf-4' },
          { rotulo: 'Urgente', cor: 'warn' },
        ]}
        prioridade="critica"
        vencimento={dia(-1)}
        subtarefas={{ feitas: 2, total: 4 }}
        anexos={3}
        comentarios={2}
        responsaveis={[{ nome: 'Ana Souza' }, { nome: 'Bruno Lima' }, { nome: 'Carla Mendes' }, { nome: 'Diego Rocha' }]}
        aoAbrir={() => toast.info('Abrir o detalhe do cartão')}
        acoes={
          <MenuSuspenso
            icone="ellipsis"
            aria-label="Ações do cartão"
            semSeta
            aparencia="texto"
            severidade="secundario"
            tamanho="pequeno"
            alinhamento="fim"
            itens={[
              { id: 'editar', rotulo: 'Editar', icone: 'pencil' },
              { id: 'excluir', rotulo: 'Excluir', icone: 'trash-2', destrutivo: true },
            ]}
            aoEscolher={(id) => toast.info(`Ação: ${id}`)}
          />
        }
      />
      <CartaoKanban
        titulo="Carrinho e checkout"
        etiquetas={[{ rotulo: 'Front-end', cor: 'pri' }]}
        prioridade="alta"
        vencimento={dia(0)}
        subtarefas={{ feitas: 3, total: 3 }}
        responsaveis={[{ nome: 'Bruno Lima' }]}
        cor="info"
      />
      <CartaoKanban titulo="Identidade visual" vencimento={dia(-6)} concluido responsaveis={[{ nome: 'Elisa Prado' }]} />
      {/* versão CRM: o espaço `extra` recebe o que o seu negócio precisar */}
      <CartaoKanban
        titulo="Integração com o ERP"
        prioridade="alta"
        vencimento={dia(3)}
        responsaveis={[{ nome: 'Fábio Nunes' }]}
        extra={
          <div className="demo-negocio">
            <span>Distribuidora Litoral</span>
            <strong>R$ 46.000</strong>
            <Progresso valor={75} altura="xs" cor="ok" rotulo="Chance de fechar" />
            <small>75% de chance</small>
          </div>
        }
      />
    </div>
  );
}
