import type { SalesData } from '../types';
import { mockSales } from './mock';

/**
 * Único punto de entrada de las ventas.
 * Reemplazar por la consulta al SSAF para Red de recargas, RV Bancos y
 * Venta de Recargas OB. En Venta de Recargas OB no se debe incluir MDS.
 */
export const loadSales = (): SalesData => mockSales;
