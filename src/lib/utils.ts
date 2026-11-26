import type { ISODate, Qm } from '../types';

const DAY = 86_400_000;
const DOW = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const pad = (n: number) => String(n).padStart(2, '0');

export const fromISO = (iso: ISODate) => new Date(`${iso}T00:00:00Z`);
export const toISO = (d: Date): ISODate => d.toISOString().slice(0, 10);
export const addDays = (iso: ISODate, n: number): ISODate =>
  toISO(new Date(fromISO(iso).getTime() + n * DAY));
export const todayISO = (): ISODate => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** Lunes de la semana (lunes a domingo) que contiene la fecha. */
export function weekStart(iso: ISODate): ISODate {
  const dow = (fromISO(iso).getUTCDay() + 6) % 7; // lunes = 0
  return addDays(iso, -dow);
}
export const weekDates = (iso: ISODate): ISODate[] =>
  Array.from({ length: 7 }, (_, i) => addDays(weekStart(iso), i));

/**
 * Número de semana (SEM). La semana 1 empieza el primer lunes del año:
 * así SEM 22 = 01–07 jun 2026, como en Formato_CC.xlsx (no es semana ISO).
 */
export function semNumber(iso: ISODate): number {
  const monday = weekStart(iso);
  const year = fromISO(monday).getUTCFullYear();
  const jan1 = `${year}-01-01`;
  const firstMonday = weekStart(jan1) === jan1 ? jan1 : addDays(weekStart(jan1), 7);
  return Math.floor((fromISO(monday).getTime() - fromISO(firstMonday).getTime()) / (7 * DAY)) + 1;
}

export const fmtShort = (iso: ISODate) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};
export const fmtDay = (iso: ISODate) => `${DOW[fromISO(iso).getUTCDay()]} ${fmtShort(iso)}`;
export const fmtMoney = (n: number) =>
  `S/.${n < 0 ? '-' : ''}${Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
export const round2 = (n: number) => Math.round(n * 100) / 100;
export const qm = (x?: Qm): (number | null)[] => [x?.cant ?? null, x?.monto ?? null];
