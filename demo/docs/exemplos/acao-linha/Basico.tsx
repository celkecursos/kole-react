import { AcaoLinha, useToast } from '../../../../src';

export default function Exemplo() {
  const toast = useToast();

  return (
    <div className="demo-linha">
      <AcaoLinha icone="eye" rotulo="Visualizar" severidade="pri" onClick={() => toast.info('Visualizar')} />
      <AcaoLinha icone="pencil" rotulo="Editar" severidade="destaque" onClick={() => toast.info('Editar')} />
      <AcaoLinha icone="trash-2" rotulo="Excluir" severidade="err" onClick={() => toast.err('Excluir')} />
      <AcaoLinha icone="download" rotulo="Baixando" carregando />
    </div>
  );
}
