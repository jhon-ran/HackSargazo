/**
 * HackSargazo — receptor de registros de la landing.
 *
 * Instalación (5 minutos):
 * 1. Crea una hoja de Google nueva (p. ej. "HackSargazo – Registros").
 * 2. Menú Extensiones → Apps Script. Borra el contenido y pega este archivo. Guarda.
 * 3. Implementar → Nueva implementación → Tipo: "Aplicación web".
 *      Ejecutar como: Yo   ·   Quién tiene acceso: Cualquier usuario
 * 4. Autoriza los permisos y copia la URL que termina en /exec.
 * 5. En index.html, pega esa URL en CONFIG.FORM_ENDPOINT y sube el cambio al repositorio.
 *
 * Cada envío se guarda en una pestaña: "participante" o "aliado".
 * Las columnas se crean solas según los campos del formulario.
 */

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.website) return ok_(); // honeypot anti-bots

    const tipo = data.tipo_registro === 'aliado' ? 'aliado' : 'participante';
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(tipo) || ss.insertSheet(tipo);

    let headers = sheet.getLastColumn() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      : [];
    Object.keys(data).forEach(function (k) {
      if (headers.indexOf(k) === -1) headers.push(k);
    });
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);

    const row = headers.map(function (h) {
      const v = data[h] === undefined ? '' : String(data[h]);
      return /^[=+\-@]/.test(v) ? "'" + v : v; // evita inyección de fórmulas
    });
    sheet.appendRow(row);
    return ok_();
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('HackSargazo: receptor activo.');
}

function ok_() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
