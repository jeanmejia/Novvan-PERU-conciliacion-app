import { useState } from 'react';
import { GroupedTable, totalsRow, type Cell, type ColKind, type HeadCell } from '../components/GroupedTable';
import { OB_PASAJE, OB_RECARGA, bancosTotal, obAbonosTotal, obMonto, redTotal } from '../lib/totals';
import { addDays, round2, semNumber, sum, weekDates, weekStart } from '../lib/utils';
import { useData } from '../state/DataContext';
import type { ISODate } from '../types';

const SEM = 'bg-sem text-white';
const W = 'bg-white text-slate-900';
const head: HeadCell[][] = [
  [
    { label: 'SEM', rowSpan: 2, className: SEM },
    { label: 'DEL', rowSpan: 2, className: SEM },
    { label: 'AL', rowSpan: 2, className: SEM },
    { label: 'OPERADOR DE BUS', colSpan: 2, className: W },
    { label: 'RED DE RECARGAS', rowSpan: 2, className: W },
    { label: 'RECARGAS VIRTUALES', rowSpan: 2, className: W },
    { label: 'TOTAL SISTEMA', rowSpan: 2, className: W },
    { label: 'ABONOS', rowSpan: 2, className: W },
  ],
  [
    { label: 'VENTA DE PASAJE', className: W },
    { label: 'VENTA DE RECARGAS', className: W },
  ],
];
const cols: ColKind[] = ['text', 'shortDate', 'shortDate', 'money', 'money', 'money', 'money', 'moneyBold', 'money'];

export function Resumen({ day }: { day: ISODate }) {
  const { sales, abonos } = useData();
  const [weeks, setWeeks] = useState(1); // hoy una semana; el selector permite ver varias

  const rows: Cell[][] = Array.from({ length: weeks }, (_, i) => {
    const start = addDays(weekStart(day), i * 7);
    const dates = weekDates(start);
    const inWeek = (f: ISODate) => dates.includes(f);

    const ob = sales.ob.filter((d) => inWeek(d.fecha));
    const pasaje = round2(sum(ob.map((d) => obMonto(d, OB_PASAJE))));
    const recargasOB = round2(sum(ob.map((d) => obMonto(d, OB_RECARGA))));
    const red = round2(sum(sales.red.filter((d) => inWeek(d.fecha)).map(redTotal)));
    const rv = round2(sum(sales.bancos.filter((d) => inWeek(d.fecha)).map(bancosTotal)));
    const abon = round2(
      sum(dates.map((f) => (abonos.red[f] ?? 0) + (abonos.bancos[f] ?? 0) + obAbonosTotal(abonos.ob[f]))),
    );
    // Total sistema = pasaje + recargas OB + red de recargas + recargas virtuales
    return [semNumber(start), dates[0], dates[6], pasaje, recargasOB, red, rv, round2(pasaje + recargasOB + red + rv), abon];
  });

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm">
        Semanas a mostrar
        <select
          value={weeks}
          onChange={(e) => setWeeks(Number(e.target.value))}
          className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
        >
          {[1, 2, 4, 8].map((n) => (
            <option key={n} value={n}>
              {n === 1 ? '1 semana' : `${n} semanas desde la elegida`}
            </option>
          ))}
        </select>
      </label>
      <GroupedTable
        headRows={head}
        cols={cols}
        rows={rows}
        footer={weeks > 1 ? totalsRow('Total', rows, cols) : undefined}
      />
    </div>
  );
}
