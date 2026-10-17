## Context

El proyecto contiene skills y la estructura de OpenSpec; no hay aplicación, dependencias web, repositorio remoto ni despliegue. Ver la motivación en [proposal.md](proposal.md), los límites curriculares en [contexto-curricular.md](contexto-curricular.md) y la evidencia de libros en [correspondencia-libros.md](correspondencia-libros.md).

Se planifica un catálogo de 176 misiones: 16 por cada una de las once áreas/itinerarios. Las nueve áreas comunes aportan 144 y cada alternativa, 16; un recorrido con Religión Católica o Atención Educativa reúne 160. La cobertura semanal se calcula en [calendario-semanal.md](calendario-semanal.md). Los idiomas quedan fijados: Natural Science e Inglés en inglés; todas las demás áreas en español. Es un catálogo propuesto para el trimestre, pendiente de implementación y del cotejo editorial/docente indicado.

## Goals / Non-Goals

**Goals:**

- Una fuente de contenido y lógica que produzca el sitio web y los HTML autocontenidos descargables.
- Misiones configurables por área y calendario, con identidad visual común y criterios de evidencia explícitos.
- Funcionamiento con controles DOM accesibles, progreso local y archivos de intercambio manual.
- Un directorio publicable pequeño, revisable y compatible con la ruta de un proyecto de Pages.

**Non-Goals:**

- En esta fase no se desarrollan ni publican los juegos; solo se entrega planificación y arte conceptual.
- La primera versión no incluye cuentas, sincronización entre dispositivos, recogida automática de respuestas ni clasificación global.
- No se reproducen los libros ni se sustituyen sus licencias digitales, la programación docente o la evaluación oficial.

## Decisions

### 1. Recursos estáticos y generación desde una fuente común

Se propone HTML semántico, CSS y JavaScript sin framework obligatorio. Los contenidos estarán separados en datos revisables, mientras unas plantillas comunes producirán catálogo y actividades. En el modo web se compartirán recursos del mismo sitio; cada descarga integrará código, estilos e imágenes y solo el audio necesario. Ninguna actividad descargable dependerá de cargar JSON con `fetch` desde `file://`.

Se descarta escribir dos versiones independientes de cada juego porque sus correcciones divergirían. También se descarta exigir un servidor de aplicación para las funciones iniciales, ya que Pages no lo ejecuta. La herramienta de construcción concreta se elegirá durante la implementación con el criterio de mínimas dependencias y generación reproducible.

Estructura futura, todavía no creada:

```text
contenidos/          datos y metadatos originales por área
src/                 plantillas, interacción y estilos comunes
assets/              gráficos y audio aprobados para publicación
dist/
  index.html         catálogo
  juegos/            páginas con URL directa
  assets/            recursos compartidos optimizados
  descargas/         un HTML autocontenido por juego
  creditos.html
```

Se publicará exclusivamente `dist/`; nunca la raíz de trabajo con fotos y documentos internos. La revisión incluirá también los archivos versionados y el historial del repositorio público; los documentos privados permanecerán fuera de él, aunque no se desplegaran al sitio. Las rutas se resolverán de forma relativa al sitio, sin exigir rutas absolutas `/assets/` que fallen bajo `/repositorio/`. La primera versión tendrá navegación por páginas reales, sin router que requiera reescrituras del servidor.

### 2. Modelo de contenido, secuencia e idioma

Cada misión tendrá identificador estable, versión, área, semana, fecha inicial/final, título, lengua, objetivo, relación curricular, procedencia editorial, estado de cotejo, duración, elementos de actividad, soluciones/criterios, ayudas y evidencia complementaria. El manifiesto docente indicará qué misiones se muestran y en qué orden. Los identificadores semanales, como MAT-T1-S02, sustituyen a los tres identificadores iniciales: aún no hay partidas publicadas que migrar. El calendario y los dos archivos de datos semanales recogen metadatos de planificación, no bancos de preguntas listos para ejecutar.

Cada semana tendrá acceso propio. Se compartirán mecánicas, pero cambiarán el objetivo concreto, la acción y la evidencia. La primera, la semana del puente de diciembre y la última tendrán micromisiones. Las producciones largas se construirán por etapas; la oferta de diez áreas por recorrido no equivale a exigir todos sus retos en los dos últimos días del trimestre.

Las referencias al currículo y al libro se almacenarán separadas: pertenecer a una unidad editorial no significa que el docente la haya asignado a T1. Para Inglés se toma Starter+U1+U2 de Kids Can! 3 como núcleo provisional. Para Science se toma la primera agrupación de Outside the Box 3, pendiente de cotejo de edición; para Sociales, paisajes y agua. Lengua, Matemáticas y Religión mantienen secuencias originales pendientes de sus índices concretos.

Se centralizarán etiquetas y diálogos para español/inglés. Inglés y Science tendrán `lang="en"`; páginas y ayudas en español declararán su idioma. Profundización Educativa se desarrollará en español. Las adaptaciones conservarán el objetivo y registrarán el tipo de apoyo.

### 3. Interacciones adecuadas a cada área

Las primeras familias serán selección con explicación, relación/ordenación con alternativa de botones, manipulación matemática, taller de composición y misión de actuación presencial. Se utilizarán elementos DOM para instrucciones y controles; un lienzo, si se añade, tendrá una alternativa equivalente. Un mismo cuestionario de opción múltiple no sustituirá la creación, el diálogo o el movimiento.

Las secuencias empezarán por una experiencia cercana o manipulativa, continuarán con práctica breve y terminarán con explicación/evidencia y revisión. Se propondrán agrupamientos por parejas o equipos pequeños con papeles rotatorios. Las instrucciones del alumno serán breves; la guía docente podrá desarrollar el contexto.

El audio se reproducirá tras un toque. Se usarán clips originales/autorizados con transcripción; la síntesis de voz del navegador puede ser una ayuda adicional, sin prometer disponibilidad offline ni una voz inglesa idéntica en todos los dispositivos. No se usará reconocimiento de voz para calificar ni se subirán grabaciones.

### 4. Progreso local y evidencias

El estado usará un prefijo de almacenamiento propio del proyecto y versión, por ejemplo `noria:<repositorio>:v1`, para evitar colisiones entre proyectos alojados bajo un mismo origen de GitHub Pages. En equipos compartidos se elegirá invitado o perfil anónimo antes de recuperar resultados. El apodo no se generará a partir del nombre real.

El resumen exportable contendrá versión de esquema, versión de contenido, misión, lengua, perfil anónimo opcional, primer intento, reintentos, ayudas utilizadas y estado de evidencia complementaria. Las producciones abiertas se conservarán solo si el usuario lo decide y se ofrecerá borrado. No se registrarán diagnósticos, creencias, domicilio, voz o nombres familiares. No se calculará un nivel de capacidad a partir de velocidad.

La importación validará versión, tipos y tamaño antes de ofrecer reemplazar/fusionar; rechazará código, campos desconocidos ejecutables y entradas excesivas. El texto de usuario se mostrará como texto. Los CSV protegerán las celdas que puedan interpretarse como fórmulas. Si no se puede persistir, seguirá funcionando una sesión invitada con descarga del resumen.

La rúbrica distinguirá apoyos de acceso y andamiaje conceptual. Teclado, ampliación o comunicación alternativa no rebajarán por sí solos el logro ni la autonomía. Si una modalidad cambia el objetivo que se puede observar —por ejemplo, transcripción frente a escucha— se registrará y se obtendrá evidencia apropiada, sin sancionar la adaptación.

Se descarta una tabla visible global: requeriría un servicio de estado fuera de Pages. Un servidor estático local distribuye archivos, pero tampoco sincroniza partidas. El modo proyector gestiona turnos en el mismo dispositivo; las tablets permanecen independientes.

### 5. Personajes y recursos

La propuesta visual está en [arte/README.md](arte/README.md), con prompt y PNG originales. Son cuatro identidades y cuatro poses, no ciclos de movimiento. El atlas generado mide 1254×1254; requiere normalización y revisión de márgenes antes de su integración. Se conservará como versión conceptual y la futura versión técnica tendrá recortes y pivotes declarados.

El diálogo y los controles se dibujarán en HTML, nunca dentro del sprite. Los recursos decorativos se ocultarán a lectura asistida; los estados relevantes tendrán explicación textual. La preferencia de movimiento reducido mantendrá poses estáticas. Los cuatro personajes aparecen en todas las áreas y no representan niveles de capacidad.

### 6. Validación y publicación por fases

Primero se revisará la correspondencia con el material. Después se normalizará el arte y se construirá una misión piloto —se propone la de deportes de Inglés o la de números de Matemáticas— para comprobar interacción, accesibilidad y exportación antes de extender las demás. La elección del piloto no requiere terminar todos los bancos de contenido.

Con 176 misiones, el objetivo de publicación es menos de 500 MB incluyendo descargas, manteniendo el máximo de Pages de 1 GB. La primera implementación comparte un atlas de 1,67 MB en el sitio y lo incorpora completo en cada HTML autónomo para ofrecer los cuatro personajes sin conexión. Esta decisión ajusta la previsión a 2,5 MB por descarga, manteniendo el objetivo total; cada excepción a 5 MB se justificará. En la entrega de 32 misiones se han medido 74.757.012 bytes totales y descargas entre 2.276.528 y 2.279.376 bytes. Son medidas iniciales que se repetirán antes de publicar. Si los futuros recursos superan el presupuesto, se optimizarán los recursos de cada misión.

El propietario propuesto ya está identificado: egeagomez. La comprobación autenticada de las sesiones disponibles devuelve escritura falsa en ambos repositorios escolares consultados; véase [comprobacion-github.md](comprobacion-github.md). Hace falta autenticar esa cuenta y elegir repositorio antes del despliegue. Se revisarán licencias concretas y se utilizarán HTTPS y créditos.

La revisión de esta fase comprende coherencia documental, procedencia y validación OpenSpec; las pruebas funcionales y de accesibilidad de navegador corresponden a la implementación futura, porque aún no existen juegos.

## Risks / Trade-offs

- [Índices/temporalización incompletos] → Mantener estado de cotejo por misión y ajustar contenido antes de fijar bancos definitivos; no presentar propuestas como programación del colegio.
- [Normativa de inicio 2026–2027 parcialmente inaccesible] → Verificar el documento íntegro antes de formalizar alineación normativa; no tratar un proyecto de orden como aprobado.
- [Atlas conceptual con margen irregular] → Conservar original y producir versión técnica revisada antes del recorte; no ocultar esta limitación.
- [Almacenamiento local borrado o compartido] → Perfil explícito, invitado, aviso, exportación y borrado; no prometer continuidad entre dispositivos.
- [Uso de archivos locales en iPad] → URL HTTPS como acceso principal y documentación realista de la descarga; verificar Safari en implementación.
- [Audio y peso de descargas] → Clips cortos, carga selectiva, transcripción y medición del paquete; no insertar toda la colección de audio en cada HTML.
- [Confundir clics con destreza] → Evidencia presencial/oral/artística separada y estado pendiente visible; evitar autoevaluación oficial por puntuación.

## Migration Plan

1. Cotejar ediciones y unidades T1; revisar propuesta visual.
2. Implementar recursos comunes y un piloto, conservando las fuentes de contenido.
3. Revisar con evidencias funcionales/accesibilidad y extender a las misiones habilitadas.
4. Construir y revisar `dist/`; confirmar el repositorio de destino y publicar la versión elegida.
5. Registrar la versión publicada y conservar la anterior para volver a desplegarla si aparece un problema.

No existe una aplicación previa que migrar. Las futuras versiones mantendrán identificadores de misión y migrarán o rechazarán de forma explícita los formatos de progreso incompatibles.
