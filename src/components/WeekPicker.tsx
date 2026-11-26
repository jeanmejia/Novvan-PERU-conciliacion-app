import type { ISODate } from '../types';
import { addDays, fmtShort, semNumber, weekDates } from '../lib/utils';

const btn =
  'rounded border border-slate-300 bg-white px-3 py-1 text-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sem';

export function WeekPicker({ day, onChange }: { day: ISODate; onChange: (d: ISODate) => void }) {
  const dates = weekDates(day);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button className={btn} aria-label="Semana anterior" onClick={() => onChange(addDays(day, -7))}>
        ‹
      </button>
      <label className="flex items-center gap-2 text-sm">
        Buscar semana del día
        <input
          type="date"
          value={day}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          className="rounded border border-slate-300 bg-white px-2 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-sem"
        />
      </label>
      <button className={btn} aria-label="Semana siguiente" onClick={() => onChange(addDays(day, 7))}>
        ›
      </button>
      <span className="text-sm font-medium text-slate-700">
        SEM {semNumber(day)}: {fmtShort(dates[0])} al {fmtShort(dates[6])}
      </span>
    </div>
  );
}
