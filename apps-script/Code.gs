/** @OnlyCurrentDoc */

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
 * Cada registro de aliado manda un aviso por correo a NOTIFY_EMAIL.
 *
 * Si cambias este script: Implementar → Administrar implementaciones → Editar (lápiz)
 * → Versión: "Nueva versión" → Implementar. Así la URL /exec no cambia.
 */

// Correo(s) que reciben el aviso de cada aliado nuevo. Separa varios con comas.
const NOTIFY_EMAIL = 'jhonnatan.rangel@gmail.com,yslen.glez@gmail.com,hola@rivieramaya.tech';

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

    if (tipo === 'aliado' && NOTIFY_EMAIL) notifyAliado_(data, ss.getUrl());
    return ok_();
  } finally {
    lock.releaseLock();
  }
}

function notifyAliado_(d, sheetUrl) {
  const lines = [
    'Organización: ' + (d.organizacion || ''),
    'Tipo: ' + (d.tipo || ''),
    'Contacto: ' + (d.nombre || '') + (d.cargo ? ' (' + d.cargo + ')' : ''),
    'Correo: ' + (d.correo || ''),
    'Teléfono: ' + (d.telefono || '—'),
    'Cómo quiere participar: ' + (d.apoyo || '—'),
  ];
  if (d.reto_problema) {
    lines.push('', 'Reto propuesto: ' + d.reto_problema,
      'Eje: ' + (d.reto_eje || '—'), 'Datos: ' + (d.reto_datos || '—'));
  }
  if (d.mensaje) lines.push('', 'Mensaje: ' + d.mensaje);
  lines.push('', 'Ver todos los registros: ' + sheetUrl);
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: d.correo || undefined,
      subject: 'HackSargazo · Nuevo aliado: ' + (d.organizacion || 'sin nombre'),
      body: lines.join('\n'),
    });
  } catch (err) {
    console.error('No se pudo enviar el aviso: ' + err);
  }
}

function doGet() {
  return ContentService.createTextOutput('HackSargazo: receptor activo.');
}

function ok_() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
