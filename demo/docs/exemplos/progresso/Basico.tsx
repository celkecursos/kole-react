import { Progresso } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-pilha">
      <Progresso rotulo="Envio dos arquivos" valor={42} mostrarValor="fim" />
      <Progresso rotulo="Meta do mês" valor={78} cor="ok" altura="lg" mostrarValor="dentro" marcos={[50, 100]} />
      <Progresso rotulo="Importação" valor={65} cor="destaque" aparencia="listrado" animado mostrarValor="balao" />
      {/* segmentos: várias partes na mesma barra */}
      <Progresso
        rotulo="Espaço usado"
        max={100}
        segmentos={[
          { valor: 35, cor: 'pri', rotulo: 'Documentos' },
          { valor: 20, cor: 'ok', rotulo: 'Imagens' },
          { valor: 10, cor: 'warn', rotulo: 'Outros' },
        ]}
      />
    </div>
  );
}
