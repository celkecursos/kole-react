import { useEffect, useRef, useState } from 'react';

/** Espera padrão entre a última tecla e a busca (ms). */
export const BUSCA_ATRASO_MS = 300;

export interface OpcoesBuscaAssincrona<T> {
  /** A busca é do módulo: termo → registros. */
  buscar: (termo: string) => Promise<T[]>;
  /** Só busca enquanto `true` (ex.: painel aberto). Ao ligar, busca na hora, sem espera. */
  ativo?: boolean;
  /** Mínimo de caracteres; abaixo dele limpa sem chamar a API. */
  minimo?: number;
  atraso?: number;
}

/**
 * Busca remota com espera de digitação e descarte de resposta velha: só a
 * requisição MAIS RECENTE escreve o resultado ("ab" que volta depois de
 * "abc" é ignorada). Erro da API vira lista vazia.
 */
export function useBuscaAssincrona<T>({ buscar, ativo = true, minimo = 0, atraso = BUSCA_ATRASO_MS }: OpcoesBuscaAssincrona<T>) {
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(false);
  const seq = useRef(0);
  const buscarRef = useRef(buscar);
  buscarRef.current = buscar;
  const estavaAtivo = useRef(false);

  useEffect(() => {
    if (!ativo) {
      estavaAtivo.current = false;
      seq.current++;
      setCarregando(false);
      return;
    }
    const primeira = !estavaAtivo.current;
    estavaAtivo.current = true;
    if (termo.trim().length < minimo) {
      seq.current++;
      setResultados([]);
      setCarregando(false);
      return;
    }
    const minha = ++seq.current;
    setCarregando(true);
    const t = setTimeout(
      () => {
        buscarRef
          .current(termo.trim())
          .then((r) => minha === seq.current && setResultados(r))
          .catch(() => minha === seq.current && setResultados([]))
          .finally(() => minha === seq.current && setCarregando(false));
      },
      primeira ? 0 : atraso,
    );
    return () => clearTimeout(t);
  }, [termo, ativo, minimo, atraso]);

  // desmontou: nenhuma promessa pendente escreve mais
  useEffect(() => () => void seq.current++, []);

  return { termo, setTermo, resultados, carregando };
}
