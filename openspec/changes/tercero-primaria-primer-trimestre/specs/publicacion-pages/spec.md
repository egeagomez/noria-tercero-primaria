## Purpose

Permitir la publicación futura del catálogo y sus juegos como sitio estático compatible con GitHub Pages Free, incluyendo navegación y recursos bajo la ruta de un repositorio.

## ADDED Requirements

### Requirement: Publicación estática con rutas de proyecto

El resultado publicable SHALL consistir en HTML, CSS, JavaScript y recursos estáticos. Todas las rutas internas SHALL funcionar desde `https://usuario.github.io/repositorio/`, sin exigir dominio propio, backend ni reescrituras de rutas. Cada juego SHALL poder abrirse mediante enlace directo y regresar al catálogo.

#### Scenario: Entrada directa desde un enlace compartido
- **WHEN** se abre una misión bajo la ruta de un repositorio de Pages
- **THEN** se cargan sus imágenes, scripts y estilos y funciona el regreso al catálogo

### Requirement: Compatibilidad con condiciones de GitHub Free

La propuesta de publicación SHALL usar un repositorio público y SHALL mantener el sitio bajo el máximo publicado de 1 GB. Antes de publicar SHALL informar del límite flexible de 100 GB/mes y de los límites de construcción aplicables según el método elegido, con enlace a la documentación oficial. Para las 176 misiones, el objetivo del proyecto SHALL ser menor de 500 MB incluyendo descargas; SHALL medirse el total real y justificarse cada excepción al presupuesto de tamaño de juego.

#### Scenario: Preparación de la publicación
- **WHEN** se revisa una versión candidata
- **THEN** se mide el directorio de salida, se comprueban rutas y se muestra el resultado de la revisión antes del despliegue

### Requirement: Directorio público separado de los documentos de trabajo

La publicación SHALL incluir únicamente recursos aprobados para el alumnado, ayudas docentes públicas y créditos. SHALL excluir fotos aportadas por el usuario, archivos de trabajo privados, referencias con datos personales, listados de alumnos, exportaciones locales y credenciales tanto del sitio publicado como de los archivos versionados y el historial del repositorio público. Excluir un archivo de `dist/` SHALL NOT tratarse como protección de otros archivos del repositorio fuente. SHALL aplicar HTTPS y no incorporar una falsa contraseña de acceso solo en JavaScript.

#### Scenario: Construcción del sitio
- **WHEN** se prepara el directorio publicable
- **THEN** los materiales de planificación quedan fuera del sitio, los archivos privados quedan fuera del repositorio público y su historial, y una lista permite revisar ambos ámbitos antes de publicar

### Requirement: Despliegue identificado y reversión

La configuración SHALL identificar propietario egeagomez, repositorio, método de publicación y versión antes de desplegar. SHALL comprobar identidad autenticada y permiso de escritura sobre el destino; un perfil público accesible no SHALL considerarse prueba de autorización técnica. SHALL permitir volver a una versión anterior sin borrar los datos locales de los dispositivos. El estado de publicación SHALL mostrarse como pendiente hasta que exista una URL real comprobada.

#### Scenario: Proyecto todavía sin repositorio remoto
- **WHEN** se consulta el estado de entrega de esta propuesta
- **THEN** se indica «publicación pendiente» sin inventar una URL o afirmar un despliegue realizado
