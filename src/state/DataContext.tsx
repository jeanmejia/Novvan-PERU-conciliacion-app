import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadSales } from '../data/source';
import { parseOB, parseSimple } from '../lib/abonos';
import type { AbonosOB, ISODate, SalesData } from '../types';

export type AbonosKind = 'red' | 'bancos' | 'ob';

interface Abonos {
  red: Record<ISODate, number>;
  bancos: Record<ISODate, number>;
  ob: Record<ISODate, AbonosOB>;
}
interface Ctx {
  sales: SalesData;
  abonos: Abonos;
  /** Lee el archivo xls/xlsx, lo combina con los abonos existentes y devuelve los días cargados. */
  upload: (kind: AbonosKind, file: File) => Promise<number>;
}

const STORAGE_KEY = 'recaudo:abonos';
const EMPTY: Abonos = { red: {}, bancos: {}, ob: {} };
const Context = createContext<Ctx | null>(null);

function restore(): Abonos {
  try {
    return { ...EMPTY, ...(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') ?? {}) };
  } catch {
    return EMPTY;
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [abonos, setAbonos] = useState<Abonos>(restore);
  const sales = useMemo(loadSales, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(abonos));
    } catch {
      /* sin almacenamiento disponible */
    }
  }, [abonos]);

  const upload: Ctx['upload'] = async (kind, file) => {
    if (kind === 'ob') {
      const p = await parseOB(file);
      setAbonos((a) => ({ ...a, ob: { ...a.ob, ...p } }));
      return Object.keys(p).length;
    }
    const p = await parseSimple(file);
    setAbonos((a) => ({ ...a, [kind]: { ...a[kind], ...p } }));
    return Object.keys(p).length;
  };

  return <Context.Provider value={{ sales, abonos, upload }}>{children}</Context.Provider>;
}

export function useData(): Ctx {
  const c = useContext(Context);
  if (!c) throw new Error('useData requiere <DataProvider>');
  return c;
}
