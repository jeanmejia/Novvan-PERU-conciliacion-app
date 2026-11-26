# Control de recargas y abonos

React + TypeScript + Tailwind CSS (Vite). Cuatro vistas sin login: Resumen, Red de recargas, RV Bancos y Venta de Recargas OB, con el formato de `Formato_CC.xlsx`.

## Uso
```bash
npm install
npm run dev
```

## Dónde conectar los datos
- Ventas: `src/data/source.ts` (`loadSales`). Hoy devuelve datos de ejemplo del Excel; reemplazar por el SSAF (Venta de Recargas OB sin MDS).
- Abonos: se suben desde cada vista (.xls/.xlsx) y se guardan en el navegador (`localStorage`).
  - Red de recargas y RV Bancos: columnas `FECHA` (fecha del abono) y `MONTO`.
  - Venta de Recargas OB: columnas `FECHA`, `CTGA`, `CJMF`, `FUTURO EXPRESS`, `NUEVA ALTERNATIVA`.

## Criterios tomados del Excel (confirmar)
- SEM: la semana 1 empieza el primer lunes del año (SEM 22 = 01–07 jun 2026).
- RV Bancos: TOTAL SISTEMA suma solo los TAPEADOS (como la fórmula del Excel).
- Resumen: TOTAL SISTEMA = pasaje + recargas OB + red de recargas + recargas virtuales (`src/views/Resumen.tsx`).
- DIF = total de ventas − total de abonos.
