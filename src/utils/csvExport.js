// src/utils/csvExport.js

export function exportToCSV(data, filename = "export.csv") {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);

  const escapeCell = (value) => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    // Wrap in quotes if it contains commas, quotes, or newlines
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const rows = data.map((row) => headers.map((h) => escapeCell(row[h])).join(","));
  const csvContent = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}