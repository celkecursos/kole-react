import { MenuSuspenso, useToast, type ItemMenuSuspenso } from '../../../../src';

const ITENS: ItemMenuSuspenso[] = [
  { tipo: 'titulo', rotulo: 'Pedido' },
  { id: 'duplicar', rotulo: 'Duplicar', icone: 'copy' },
  { id: 'imprimir', rotulo: 'Imprimir', icone: 'printer', extra: 'Ctrl P' },
  { tipo: 'divisor' },
  { id: 'excluir', rotulo: 'Excluir', icone: 'trash-2' },
];

export default function Exemplo() {
  const toast = useToast();
  const escolher = (id: string) => toast.info(`Escolheu: ${id}`);

  return (
    <div className="demo-linha">
      <MenuSuspenso rotulo="Ações" itens={ITENS} aoEscolher={escolher} />
      <MenuSuspenso rotulo="Opções" aparencia="contorno" severidade="secundario" itens={ITENS} aoEscolher={escolher} />
      {/* só ícone: dê nome com aria-label */}
      <MenuSuspenso icone="ellipsis-vertical" aria-label="Mais ações" aparencia="texto" semSeta itens={ITENS} aoEscolher={escolher} />
    </div>
  );
}
