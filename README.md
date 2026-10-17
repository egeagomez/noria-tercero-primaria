# La Noria de los Descubrimientos

Materiales originales para 3.º de Primaria del CEIP Maestro Francisco Martínez Bernal, Molina de Segura (Murcia). Curso 2026–2027.

Repositorio: [egeagomez/noria-tercero-primaria](https://github.com/egeagomez/noria-tercero-primaria).

## Abrir los juegos

Abre [el catálogo](dist/index.html) en el navegador. Incluye **16 misiones de Matemáticas y 16 de Lengua** con Nori, Sira, Plumi y Lumo. Cada misión tiene actividades, pistas, una creación abierta y un registro de observación para el docente.

En [dist/descargas](dist/descargas) están las 32 versiones HTML autónomas, con imágenes, estilos y código incorporados. Se pueden guardar y abrir sin conexión. El audio opcional depende de una voz local del dispositivo; el texto siempre está disponible.

Para servirlo en este ordenador:

```sh
npm run build
npm start
```

Abre `http://127.0.0.1:4173`. Requiere Node.js; no hay dependencias npm. `npm run build` reconstruye `dist` desde `src` y `contenidos` y rechaza datos incompletos. Puedes editar los JSON para ajustar contenidos y reconstruir.

## Planificación de todas las asignaturas

[Especificaciones del primer trimestre](openspec/changes/tercero-primaria-primer-trimestre/README.md): 16 semanas por área o itinerario, **176 misiones especificadas**. Religión y Atención Educativa son alternativas: 160 misiones por recorrido completo. Las otras áreas todavía tienen especificaciones; el catálogo muestra las 32 misiones implementadas.

Natural Science e Inglés se plantean en inglés. Todas las demás áreas, en español. La temporalización es una propuesta curricular propia. Sigue pendiente cotejar los índices concretos y la programación de EMAT, Superletras y Religión; no se afirma que todos los bloques coincidan con el primer libro.

## Mochila local

Invitado conserva la sesión de la pestaña. Los apodos positivos permiten perfiles en un navegador compartido: elegir el apodo correcto antes de jugar. No se solicitan nombres, fechas de nacimiento, correo ni cuentas infantiles. No hay sincronización de dispositivos, backend, analítica ni clasificación por velocidad.

La mochila exporta e importa JSON y ofrece un resumen CSV. Las creaciones, respuestas y observaciones son locales; los archivos exportados se deben conservar en privado. Las actividades abiertas necesitan observación docente. Las ayudas de acceso y el apoyo para resolver el contenido se describen por separado.

## GitHub Pages

[Viabilidad y límites de Pages Free](openspec/changes/tercero-primaria-primer-trimestre/estudio-github-pages.md) y [comprobación de acceso a egeagomez](openspec/changes/tercero-primaria-primer-trimestre/comprobacion-github.md).

La primera versión está subida al repositorio público `egeagomez/noria-tercero-primaria`, rama `main`, con autorización del usuario. Incluye fuentes, especificaciones, recursos visuales y las 32 misiones con sus descargas autónomas. El contenido estático de `dist` está preparado para GitHub Pages, que todavía no se ha activado. La cuenta se autentica mediante Git Credential Manager; las credenciales no forman parte del proyecto. Las herramientas locales de `.agents` permanecen fuera del repositorio. Nunca publicar mochilas exportadas ni datos del alumnado; revisar también el repositorio y su historial.

## Estado y recursos

La construcción genera 32 juegos y 32 HTML autónomos. Se revisaron los contenidos y el código por inspección. No se han ejecutado pruebas automatizadas ni completado una revisión visual en navegador: esta sesión no dispone de ningún navegador conectado. La comprobación en iPad y Android queda pendiente.

El atlas original generado con IA se integra mediante celdas CSS fraccionarias, conservando su PNG. Es una primera versión visual; márgenes, halos y pivotes requieren revisión técnica antes de considerarlo un atlas definitivo. [Personajes y procedencia](openspec/changes/tercero-primaria-primer-trimestre/arte/README.md).

Los textos y gráficos didácticos son originales. No se reproducen páginas ni ejercicios de editoriales. La publicación del repositorio no otorga una licencia abierta de redistribución: su elección sigue pendiente del titular.
