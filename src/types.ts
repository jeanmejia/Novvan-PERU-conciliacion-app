export type ISODate = string; // 'YYYY-MM-DD'

/** Cantidad (puede no venir informada) y monto en soles. */
export interface Qm {
  cant: number | null;
  monto: number;
}

export interface RedDay {
  fecha: ISODate;
  fullcarga: Qm;
  niubiz: Qm;
  cellpower: Qm;
  tambo: Qm;
}

export type Bank = 'scotiabank' | 'bbva' | 'interbank' | 'bcp';
export interface BancosDay {
  fecha: ISODate;
  tapeados: Record<Bank, Qm>;
  noTapeados: Record<Bank, Qm>;
}

export type OBKey =
  | 'ctgaPasaje'
  | 'ctgaRecarga'
  | 'cjmfRecarga'
  | 'futuroPasaje'
  | 'futuroRecarga'
  | 'nuevaPasaje'
  | 'nuevaRecarga';
export interface OBDay {
  fecha: ISODate;
  v: Record<OBKey, Qm>;
}

export interface SalesData {
  red: RedDay[];
  bancos: BancosDay[];
  ob: OBDay[];
}

/** Abonos de Venta de Recargas OB por operador (CPAB = Futuro Express + Nueva Alternativa). */
export interface AbonosOB {
  ctga: number;
  cjmf: number;
  futuro: number;
  nueva: number;
}
