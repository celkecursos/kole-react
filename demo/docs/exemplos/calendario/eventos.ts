import type { EventoCalendario } from '../../../../src';

/** Eventos em volta de hoje (o teste visual fixa o relógio, então saem sempre iguais). */
export function eventosExemplo(): EventoCalendario[] {
  const h = new Date();
  const em = (dias: number, hora = 0, min = 0) => new Date(h.getFullYear(), h.getMonth(), h.getDate() + dias, hora, min);
  return [
    { id: 1, titulo: 'Reunião de vendas', inicio: em(0, 9), fim: em(0, 10), cor: 'pri', categoria: 'Reunião' },
    { id: 2, titulo: 'Visita · Mercado Bom Preço', inicio: em(0, 9, 30), fim: em(0, 11), cor: 'graf-4', categoria: 'Visita' },
    { id: 3, titulo: 'Entrega · Padaria Pão Dourado', inicio: em(1, 14), fim: em(1, 16), cor: 'ok', categoria: 'Entrega' },
    { id: 4, titulo: 'Promoção de Pix', inicio: em(-1), fim: em(1, 23, 59), diaInteiro: true, cor: 'graf-2', categoria: 'Marketing' },
    { id: 5, titulo: 'Prazo · boletos', inicio: em(3), diaInteiro: true, cor: 'err', categoria: 'Financeiro' },
    { id: 6, titulo: 'Treinamento da equipe', inicio: em(-2, 13), fim: em(-2, 17), cor: 'pri', categoria: 'Reunião' },
  ];
}
