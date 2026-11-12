import { Botao, useToast } from '../../../../src';

export default function Exemplo() {
  const toast = useToast();

  return (
    <div className="demo-linha">
      <Botao
        rotulo="Sólido, embaixo"
        aparencia="contorno"
        onClick={() => toast.mostrar({ severidade: 'ok', titulo: 'Backup concluído', aparencia: 'solido', posicao: 'base-centro' })}
      />
      {/* duracao: 0 = só fecha no × */}
      <Botao
        rotulo="Fixo até fechar"
        aparencia="contorno"
        onClick={() => toast.mostrar({ severidade: 'warn', titulo: 'Sessão expira em 5 minutos', duracao: 0 })}
      />
      <Botao
        rotulo="Cor da marca"
        aparencia="contorno"
        onClick={() => toast.mostrar({ titulo: 'Novo recurso disponível', cor: 'destaque', icone: 'star', posicao: 'topo-centro' })}
      />
    </div>
  );
}
