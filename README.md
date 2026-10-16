# HackSargazo

Landing page de **HackSargazo**, el hackatón sobre el sargazo en la Riviera Maya, organizado por **Women Techmakers Quintana Roo** y **Riviera Maya Tech Builders**.

- **Sitio:** https://jhon-ran.github.io/HackSargazo/
- **Fecha:** febrero de 2027 (por confirmar)
- **Sede:** Cancún y/o Playa del Carmen (por confirmar)
- **Contacto:** hola@rivieramaya.tech · Instagram [@wtm.qroo](https://www.instagram.com/wtm.qroo/) y [@rivieramayatech](https://www.instagram.com/rivieramayatech)

La página sirve para medir el interés de participantes, captar aliados y patrocinadores, y recibir propuestas de retos. Es un sitio estático: HTML, CSS y JavaScript en un solo archivo, sin dependencias ni proceso de compilación.

---

## Contenido del repositorio

```
├── index.html                 Landing page completa (estilos, contenido y scripts)
├── codigo-de-conducta.html    Código de conducta del evento
├── apps-script/Code.gs        Script que guarda los registros en una hoja de Google
├── img/                       Fotos optimizadas (.webp) y originales de Unsplash (.jpg)
├── icons/                     Favicon e íconos para pestañas, iOS y Android (fuente: favicon.svg)
└── README.md
```

## Ver el sitio en tu computadora

No hace falta instalar nada. Cualquiera de estas opciones funciona:

- **Abrir directo:** doble clic en `index.html`.
- **VS Code:** extensión *Live Server* → clic derecho en `index.html` → *Open with Live Server*. Recarga sola al guardar.
- **Terminal:** `python -m http.server` en la carpeta del proyecto y abre http://localhost:8000

## Publicación

El sitio se publica con **GitHub Pages** desde la rama `main`, carpeta raíz. Cada cambio que llega a `main` aparece en el sitio en uno o dos minutos. Puedes revisar el estado en la pestaña **Actions** del repositorio.

---

## Cambios frecuentes

### Fecha, sede y textos que cambian seguido

Casi todo lo que va a cambiar está en un solo lugar: el bloque `CONFIG`, al final de `index.html` (busca `const CONFIG`). No hace falta tocar el HTML.

| Clave | Qué controla | Valor actual |
|---|---|---|
| `dateText` | Fecha corta (encabezado y pie) | `Febrero 2027 · por confirmar` |
| `dateLong` | Fecha en la tabla de formato | `Febrero de 2027. La fecha exacta…` |
| `venueText` | Sede corta (encabezado) | `Cancún y/o Playa del Carmen · por confirmar` |
| `venueLong` | Sede en la tabla de formato | `Cancún y/o Playa del Carmen. La sede…` |
| `faqWhen` | Respuesta a "¿Cuándo y dónde será?" | |
| `r1` … `r6` | Fechas de los 6 pasos de la ruta de participación | `Desde hoy`, `Al confirmar sede y fecha`… |
| `email` | Correo de contacto en toda la página | `hola@rivieramaya.tech` |
| `FORM_ENDPOINT` | URL del Apps Script que guarda los registros | vacío (modo vista previa) |

**Ejemplo:** cuando se confirmen fecha y sede:

```js
dateText: "Sábado 20 de febrero de 2027",
venueText: "Playa del Carmen · Universidad X",
```

### Otros textos

El resto del contenido está escrito directamente en `index.html`. Cada sección tiene un `id` para encontrarla rápido:

| Sección | Busca |
|---|---|
| Encabezado principal | `id="inicio"` |
| El problema y cifras | `id="problema"` |
| Formato (Innovation Week + hackatón) | `id="formato"` |
| Los tres retos y SargaDB | `id="retos"` |
| Por qué participar (beneficios y perfiles) | `id="por-que"` |
| Perfiles de participantes | `id="perfiles"` |
| Ruta de participación | `id="ruta"` |
| Aliados y convocatoria de retos | `id="aliados"` · `id="propon-reto"` |
| Impacto esperado | `id="impacto"` |
| Registro (formularios) | `id="registro"` |
| Preguntas frecuentes | `id="faq"` |
| Organizadores | `id="organizadores"` |

Para agregar una pregunta frecuente, copia un bloque `<details>…</details>` dentro de `id="faq"` y cambia la pregunta y la respuesta.

### Imágenes

1. Usa fotos con licencia libre (por ejemplo, [Unsplash](https://unsplash.com)) o fotos propias con permiso de las personas que aparecen.
2. Conviértelas a **WebP** en dos tamaños (unos 1600 px y 800 px de ancho) para que la página cargue rápido en teléfonos. Por ejemplo, con [Squoosh](https://squoosh.app) o con `cwebp`.
3. Guárdalas en `img/` con nombres descriptivos (`playa-familias-1200.webp`) y agrega `alt` con una descripción en español.
4. Si la foto lo requiere, agrega el crédito en el pie de página (busca `class="credits"`).

### Colores y tipografía

Los colores están definidos como variables al inicio del `<style>` (`--sea`, `--sarg`, `--ink`…), con versiones para modo claro y oscuro. Cambia los valores ahí y se actualizan en toda la página. Las fuentes son Anybody, Instrument Sans y JetBrains Mono, desde Google Fonts.

---

## Formulario de registro

La página tiene dos formularios: **participantes** y **aliados**. El de aliados también sirve para ponentes, mentores y voluntariado, que pueden registrarse como "Persona independiente". Incluye la opción "Proponer un reto", que muestra preguntas adicionales. Los registros se envían a una **hoja de Google** mediante Apps Script.

Mientras `FORM_ENDPOINT` esté vacío, el formulario funciona pero **no guarda nada** y muestra un aviso de vista previa.

### Conectar la hoja de registros (una sola vez)

1. Crea una hoja de Google, por ejemplo "HackSargazo – Registros", y compártela como editor con el resto del equipo organizador.
2. Abre **Extensiones → Apps Script**, borra el contenido y pega `apps-script/Code.gs`. Guarda.
3. **Implementar → Nueva implementación → Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
4. Autoriza los permisos y copia la URL que termina en `/exec`.
5. Pégala en `FORM_ENDPOINT` dentro de `index.html` y sube el cambio.

Cada envío se guarda en una pestaña, `participante` o `aliado`, y las columnas se crean solas. Cada registro de aliado manda además un aviso por correo a la dirección de `NOTIFY_EMAIL`, al inicio del script. Si después agregas un campo al formulario, aparece como columna nueva sin tocar el script.

> **Privacidad:** la hoja contiene datos personales. Compártela solo con el equipo organizador y **nunca subas exportaciones de registros a este repositorio**, que es público.

---

## Cómo colaborar

### Cambios pequeños de texto

Desde github.com: abre el archivo → ícono del lápiz → edita → **Commit changes**. Describe qué cambiaste, por ejemplo "Actualiza fecha y sede".

### Cambios más grandes

1. Crea una rama: `git checkout -b nombre-del-cambio`
2. Haz tus cambios y revísalos en tu computadora.
3. `git commit` y `git push`, y abre un **Pull Request** hacia `main`.
4. Pide que otra persona del equipo lo revise antes de fusionarlo.

### Antes de subir un cambio, revisa

- [ ] La página se ve bien en el **teléfono** (DevTools → modo dispositivo, 375 px) y en escritorio.
- [ ] No hay scroll horizontal.
- [ ] Los enlaces y botones funcionan.
- [ ] Si tocaste el formulario, se envió una prueba y llegó a la hoja.
- [ ] Ninguna información sensible: datos de registros, contraseñas o URLs privadas.

---

## Pendientes por confirmar

- [ ] Fecha y sede definitivas (`CONFIG`)
- [x] Conectar `FORM_ENDPOINT` a la hoja de registros
- [ ] Respuestas de las preguntas frecuentes: edad mínima, comida, premios, propiedad intelectual, acompañamiento a personas sin equipo, Innovation Week obligatoria o no
- [ ] Contacto dedicado para reportes del código de conducta
- [ ] Revisar el código de conducta con los lineamientos de comunidad de Google (Women Techmakers)
- [ ] Logos de aliados confirmados
- [ ] Página de recursos para personas inscritas (incluye acceso a la API de [SargaDB](https://sargadb.org))
- [ ] Definir una licencia para el repositorio

---

## Créditos

- **Organización:** [Women Techmakers Quintana Roo](https://www.instagram.com/wtm.qroo/) y [Riviera Maya Tech Builders](https://www.instagram.com/rivieramayatech).
- **Fotos:** Karl Callwood, Naja Bertolt Jensen, Margo Evardson y Thor Tryggvason, en [Unsplash](https://unsplash.com) ([licencia de Unsplash](https://unsplash.com/license)).
- **Código de conducta:** adaptado del [Hack Code of Conduct](https://hackcodeofconduct.org/) (MIT).
- **Datos del problema:** fuentes citadas al pie de la landing.
- **Tipografías:** [Anybody](https://fonts.google.com/specimen/Anybody), [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) y [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), con licencia SIL Open Font License.
