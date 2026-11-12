import { MenuSuspenso, useToast } from '../../../../src';

export default function Exemplo() {
  const toast = useToast();

  return (
    // dividido: a ação principal fica separada da seta que abre o menu
    <MenuSuspenso
      rotulo="Salvar"
      icone="save"
      dividido
      aoClicarPrincipal={() => toast.ok('Salvo')}
      itens={[
        { id: 'salvar-novo', rotulo: 'Salvar e criar outro' },
        { id: 'salvar-fechar', rotulo: 'Salvar e fechar' },
      ]}
      aoEscolher={(id) => toast.ok(id)}
    />
  );
}
