import { useState } from 'react';
import {
  Botao,
  CampoData,
  CampoMoeda,
  CampoSelect,
  CampoTexto,
  Card,
  Dialogo,
  Icone,
  MenuSuspenso,
  Progresso,
  Valor,
  Vazio,
  diasEntre,
  formatarMoeda,
  formatarPercentual,
  somarMoeda,
  tempoRelativo,
  useConfirmacao,
  useToast,
  type CorProgresso,
} from '../../../../src';
import { dia, hoje, novoId, type Meta } from './dados';
import { CabecalhoFinancas, dataBr, useMoeda } from './comum';
import { acoes, useFinancas } from './estado';
import { useT } from '../../../i18n/useT';

const CORES: { valor: CorProgresso; rotulo: string }[] = [
  { valor: 'ok', rotulo: 'Verde' },
  { valor: 'info', rotulo: 'Azul' },
  { valor: 'destaque', rotulo: 'Roxo' },
  { valor: 'warn', rotulo: 'Laranja' },
  { valor: 'pri', rotulo: 'Cor principal' },
];
const ICONES = [
  { valor: 'piggy-bank', rotulo: 'Cofrinho' },
  { valor: 'shield-check', rotulo: 'Proteção' },
  { valor: 'plane', rotulo: 'Viagem' },
  { valor: 'car', rotulo: 'Carro' },
  { valor: 'house', rotulo: 'Casa' },
  { valor: 'graduation-cap', rotulo: 'Estudos' },
  { valor: 'camera', rotulo: 'Equipamento' },
  { valor: 'target', rotulo: 'Alvo' },
];

/** Meses inteiros até o prazo (no mínimo 1). */
const mesesAte = (prazo: string) => Math.max(1, Math.ceil(diasEntre(hoje(), prazo) / 30.44));

function DialogoMeta({ inicial, aoFechar }: { inicial: Meta; aoFechar: () => void }) {
  const toast = useToast();
  const [m, setM] = useState(inicial);
  const [tentou, setTentou] = useState(false);
  const nova = !inicial.nome;
  const erros = {
    nome: !m.nome.trim() ? 'Dê um nome à meta' : undefined,
    alvo: !(m.alvo > 0) ? 'Informe o valor' : undefined,
    prazo: !m.prazo || m.prazo <= dia(0) ? 'Escolha uma data futura' : undefined,
  };
  const salvar = () => {
    setTentou(true);
    if (Object.values(erros).some(Boolean)) return;
    acoes.salvarMeta({ ...m, nome: m.nome.trim() });
    toast.ok(nova ? 'Meta criada' : 'Meta salva', m.nome);
    aoFechar();
  };
  return (
    <Dialogo
      aberto
      aoFechar={aoFechar}
      titulo={nova ? 'Nova meta' : 'Editar meta'}
      icone="target"
      tamanho="pequeno"
      rodape={
        <>
          <Botao rotulo="Cancelar" severidade="secundario" aparencia="contorno" onClick={aoFechar} />
          <Botao rotulo="Salvar" icone="check" onClick={salvar} />
        </>
      }
    >
      <form
        className="fin-form"
        onSubmit={(e) => {
          e.preventDefault();
          salvar();
        }}
      >
        <CampoTexto className="fin-form-inteiro" rotulo="Nome" obrigatorio valor={m.nome} aoMudar={(nome) => setM({ ...m, nome })} erro={tentou ? erros.nome : undefined} autoFocus />
        <CampoMoeda rotulo="Quanto quer juntar" obrigatorio valor={m.alvo || null} aoMudar={(v) => setM({ ...m, alvo: v ?? 0 })} erro={tentou ? erros.alvo : undefined} />
        <CampoMoeda rotulo="Já guardado" valor={m.guardado || null} aoMudar={(v) => setM({ ...m, guardado: v ?? 0 })} />
        <CampoData rotulo="Até quando" obrigatorio valor={m.prazo} aoMudar={(prazo) => setM({ ...m, prazo })} erro={tentou ? erros.prazo : undefined} />
        <CampoSelect rotulo="Ícone" opcoes={ICONES} valor={m.icone} aoMudar={(icone) => icone && setM({ ...m, icone })} />
        <CampoSelect rotulo="Cor" opcoes={CORES} valor={m.cor as CorProgresso} aoMudar={(cor) => cor && setM({ ...m, cor })} />
        <button type="submit" hidden />
      </form>
    </Dialogo>
  );
}

function Guardar({ meta }: { meta: Meta }) {
  const toast = useToast();
  const [valor, setValor] = useState<number | null>(null);
  return (
    <MenuSuspenso rotulo="Guardar" icone="plus" tamanho="pequeno" aparencia="suave" semSeta fechamento="fora" alinhamento="inicio">
      {(fechar) => (
        <form
          className="fin-orc-editar"
          onSubmit={(e) => {
            e.preventDefault();
            if (!valor) return;
            acoes.salvarMeta({ ...meta, guardado: somarMoeda([meta.guardado, valor]) });
            toast.ok('Valor guardado', `${formatarMoeda(valor)} em ${meta.nome}`);
            setValor(null);
            fechar();
          }}
        >
          <CampoMoeda rotulo={`Guardar em ${meta.nome}`} valor={valor} aoMudar={setValor} autoFocus />
          <Botao type="submit" rotulo="Guardar" tamanho="pequeno" disabled={!valor} />
        </form>
      )}
    </MenuSuspenso>
  );
}

export function Metas() {
  const { t } = useT();
  const { espaco, metas } = useFinancas();
  const moeda = useMoeda();
  const confirmar = useConfirmacao();
  const toast = useToast();
  const [editando, setEditando] = useState<Meta | null>(null);
  const lista = metas.filter((m) => m.espaco === espaco);
  const alvo = somarMoeda(lista.map((m) => m.alvo));
  const guardado = somarMoeda(lista.map((m) => Math.min(m.guardado, m.alvo)));
  const porMes = somarMoeda(lista.filter((m) => m.guardado < m.alvo).map((m) => (m.alvo - m.guardado) / mesesAte(m.prazo)));

  const excluir = async (m: Meta) => {
    if (!(await confirmar.remover({ titulo: 'Excluir meta?', mensagem: `"${m.nome}" sai da lista. O dinheiro guardado continua nas contas.`, rotuloAceitar: 'Excluir' }))) return;
    acoes.excluirMeta(m.id);
    toast.ok('Meta excluída', m.nome);
  };
  const nova = () => setEditando({ id: novoId(), espaco, nome: '', icone: 'piggy-bank', cor: 'ok', alvo: 0, guardado: 0, prazo: dia(365) });

  return (
    <div className="demo-pilha">
      <CabecalhoFinancas titulo={t('paginas.finMetas.titulo')} icone="target" semPeriodo acoes={<Botao rotulo="Nova meta" icone="plus" onClick={nova} />}>
        {lista.length > 0 && (
          <p className="fin-metas-resumo">
            <Valor valor={guardado} forte /> guardados de <Valor valor={alvo} centavos={false} /> ({formatarPercentual(alvo ? (guardado / alvo) * 100 : 0, { casas: 0 })}). Para cumprir os prazos,
            guarde cerca de <strong>{moeda(porMes, { centavos: false })} por mês</strong>.
          </p>
        )}
      </CabecalhoFinancas>

      {lista.length === 0 ? (
        <Card>
          <Vazio titulo="Nenhuma meta ainda" descricao="Uma meta ajuda a juntar dinheiro para um objetivo: reserva, viagem, equipamento." icone="target">
            <Botao rotulo="Criar a primeira meta" icone="plus" onClick={nova} />
          </Vazio>
        </Card>
      ) : (
        <div className="fin-grade fin-grade--metas">
          {lista.map((m) => {
            const parte = m.alvo ? Math.min(1, m.guardado / m.alvo) : 0;
            const falta = Math.max(0, m.alvo - m.guardado);
            const meses = mesesAte(m.prazo);
            const pronta = falta === 0;
            return (
              <Card
                key={m.id}
                className="fin-meta"
                ferramentas={
                  <MenuSuspenso
                    icone="ellipsis"
                    aria-label={`Ações de ${m.nome}`}
                    semSeta
                    aparencia="texto"
                    severidade="secundario"
                    tamanho="pequeno"
                    alinhamento="fim"
                    itens={[
                      { id: 'editar', rotulo: 'Editar', icone: 'pencil' },
                      { id: 'excluir', rotulo: 'Excluir', icone: 'trash-2', destrutivo: true },
                    ]}
                    aoEscolher={(id) => (id === 'editar' ? setEditando(m) : excluir(m))}
                  />
                }
                titulo={
                  <span className="fin-meta-titulo">
                    <span className={`fin-meta-ic fin-meta-ic--${m.cor}`} aria-hidden="true">
                      <Icone icone={m.icone} />
                    </span>
                    {m.nome}
                  </span>
                }
              >
                <div className="fin-meta-valores">
                  <Valor valor={m.guardado} tamanho="destaque" />
                  <span>
                    de <Valor valor={m.alvo} centavos={false} />
                  </span>
                </div>
                <Progresso valor={parte * 100} cor={m.cor as CorProgresso} altura="md" mostrarValor="fim" rotulo={`${m.nome}: ${formatarPercentual(parte * 100, { casas: 0 })}`} />
                <dl className="fin-meta-dados">
                  <div>
                    <dt>Prazo</dt>
                    <dd>
                      {dataBr(m.prazo)} <small>({tempoRelativo(m.prazo, hoje())})</small>
                    </dd>
                  </div>
                  <div>
                    <dt>{pronta ? 'Situação' : 'Guardar por mês'}</dt>
                    <dd>{pronta ? <strong className="fin-ok">Meta cumprida</strong> : <Valor valor={falta / meses} forte />}</dd>
                  </div>
                </dl>
                {!pronta && <Guardar meta={m} />}
              </Card>
            );
          })}
        </div>
      )}
      {editando && <DialogoMeta key={editando.id} inicial={editando} aoFechar={() => setEditando(null)} />}
    </div>
  );
}
