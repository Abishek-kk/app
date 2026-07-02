import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { addPdfExport, getCoeAttendanceForDate } from './db';
import { toDisplayDate } from '../utils/date';

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtml(date, rows) {
  const tableRows = rows
    .map((row, index) => {
      const photo = row.image_uri
        ? `<img src="${esc(row.image_uri)}" />`
        : '<span class="muted">No photo</span>';
      const count = row.present_count ?? '<span class="muted">No record</span>';
      return `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${esc(row.name)}</strong><br/><span>${esc(row.incharge || 'Not set')}</span></td>
          <td>${count}</td>
          <td>${photo}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; color: #1F2433; padding: 24px; }
          h1 { color: #14146B; margin: 0 0 6px; font-size: 24px; }
          p { color: #73788A; margin: 0 0 24px; }
          table { border-collapse: collapse; width: 100%; }
          th { background: #14146B; color: white; text-align: left; padding: 10px; }
          td { border-bottom: 1px solid #E2E4EF; padding: 10px; vertical-align: top; }
          img { width: 96px; height: 72px; object-fit: cover; border-radius: 8px; }
          .muted { color: #73788A; }
        </style>
      </head>
      <body>
        <h1>COE Attendance Report &mdash; ${esc(date)}</h1>
        <p>Attendance date: ${esc(toDisplayDate(date))}</p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>COE / Incharge</th>
              <th>Present Count</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody>${tableRows || '<tr><td colspan="4">No COEs found.</td></tr>'}</tbody>
        </table>
      </body>
    </html>
  `;
}

export async function generateAttendancePdf(date) {
  const rows = await getCoeAttendanceForDate(date);
  const { uri } = await Print.printToFileAsync({
    html: buildHtml(date, rows),
    base64: false,
  });

  const directory = `${FileSystem.documentDirectory}pdf_exports/`;
  await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  const fileName = `coe-attendance-${date}-${Date.now()}.pdf`;
  const fileUri = `${directory}${fileName}`;
  await FileSystem.copyAsync({ from: uri, to: fileUri });
  await addPdfExport(fileName, fileUri, date);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/pdf',
      dialogTitle: `COE Attendance ${date}`,
    });
  }

  return { fileName, fileUri };
}
