import type { AbonosOB, BancosDay, OBDay, OBKey, RedDay } from '../types';
import { round2, sum } from './utils';

export const RETAILERS = [
  ['FULLCARGA', 'fullcarga'],
  ['NIUBIZ', 'niubiz'],
  ['CELL POWER', 'cellpower'],
  ['TAMBO', 'tambo'],
] as const;

export const BANKS = [
  ['SCOTIABANK', 'scotiabank'],
  ['BBVA', 'bbva'],
  ['INTERBANK', 'interbank'],
  ['BCP', 'bcp'],
] as const;

// Orden de columnas de Venta de Recargas OB (igual que el Excel)
export const OB_KEYS: OBKey[] = [
  'ctgaPasaje', 'ctgaRecarga', 'cjmfRecarga',
  'futuroPasaje', 'futuroRecarga', 'nuevaPasaje', 'nuevaRecarga',
];
export const OB_PASAJE: OBKey[] = ['ctgaPasaje', 'futuroPasaje', 'nuevaPasaje'];
export const OB_RECARGA: OBKey[] = ['ctgaRecarga', 'cjmfRecarga', 'futuroRecarga', 'nuevaRecarga'];

export const redTotal = (d: RedDay) => round2(sum(RETAILERS.map(([, k]) => d[k].monto)));

/** Igual que Formato_CC.xlsx: TOTAL SISTEMA de RV Bancos suma solo los TAPEADOS. */
export const bancosTotal = (d: BancosDay) => round2(sum(BANKS.map(([, k]) => d.tapeados[k].monto)));

export const obMonto = (d: OBDay, keys: OBKey[] = OB_KEYS) =>
  round2(sum(keys.map((k) => d.v[k].monto)));

export const obAbonosTotal = (a?: AbonosOB) => (a ? round2(a.ctga + a.cjmf + a.futuro + a.nueva) : 0);
