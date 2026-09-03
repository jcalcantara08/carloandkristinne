/**
 * CSV export. The feature the couple will actually use, because the caterer
 * wants a list and not a login.
 */

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  // A leading =, +, - or @ is executed as a formula by Excel and Sheets.
  // Prefix with a quote so a guest cannot inject one through a name field.
  const guarded = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${guarded.replace(/"/g, '""')}"`;
}

export function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const header = columns.map(cell).join(",");
  const body = rows.map((row) => columns.map((column) => cell(row[column])).join(",")).join("\r\n");
  // A BOM so Excel opens UTF-8 correctly on Windows.
  return `﻿${header}\r\n${body}\r\n`;
}

export function csvResponse(csv: string, filename: string): Response {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
