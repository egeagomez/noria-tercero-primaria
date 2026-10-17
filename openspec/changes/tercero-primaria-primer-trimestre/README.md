# La Noria de los Descubrimientos — T1 de 3.º

**CEIP Maestro Francisco Martínez Bernal · Molina de Segura · Curso 2026–2027**  
Actualización: 17/10/2026. Personajes: **Nori, Sira, Plumi y Lumo**.

## Propuesta semanal

El catálogo previsto incluye **16 misiones por asignatura/itinerario, 176 en total**. Las nueve áreas comunes aportan 144; cada alternativa de Religión Católica o Atención Educativa aporta 16: **160 por recorrido**. Se conserva una misión distinta para cada una de las 16 franjas entre el 8 de septiembre y el 22 de diciembre de 2026, con micromisiones para las semanas más cortas.

[Ver calendario y justificación](calendario-semanal.md). Las fechas organizan una propuesta adaptable al aula; no son la programación oficial del colegio. Ya está construida la primera versión de **Matemáticas y Lengua: 32 misiones**. [Abrir catálogo local](../../../dist/index.html). Su revisión en navegador queda pendiente.

| Área: abrir sus 16 misiones | Contenidos propuestos | Idioma |
|---|---|---|
| [Lengua Castellana y Literatura](specs/asignaturas/lengua/spec.md) | Comprensión, relato, descripción, revisión, instrucciones, poesía y noticia. | español |
| [Matemáticas](specs/asignaturas/matematicas/spec.md) | Número y cálculo; problemas; propuestas en espiral de geometría, medida, reparto, tiempo y datos. | español |
| [Ciencias de la Naturaleza / Natural Science](specs/asignaturas/science/spec.md) | Organismos vivos, modelos celulares, grupos de seres vivos y vertebrados. | inglés |
| [Ciencias Sociales](specs/asignaturas/sociales/spec.md) | Paisajes, mapas, aguas y conservación de recursos. | español |
| [Lengua Extranjera / English](specs/asignaturas/ingles/spec.md) | Starter, deportes/lugares de U1 y animales/rasgos de U2. | inglés |
| [Educación Plástica y Visual](specs/asignaturas/plastica/spec.md) | Línea, forma, color, textura, composición, viñeta y cartel. | español |
| [Música y Danza](specs/asignaturas/musica/spec.md) | Cualidades del sonido, pulso, patrones, creación e interpretación cooperativa. | español |
| [Educación Física](specs/asignaturas/educacion-fisica/spec.md) | Preparación, control corporal, coordinación, cooperación y expresión. | español |
| [Profundización Educativa](specs/asignaturas/profundizacion/spec.md) | Estrategia, indagación, fuentes y diseño/revisión de un prototipo. | español |
| [Religión Católica](specs/asignaturas/religion/spec.md) | Dignidad, comunidad cristiana, relatos y expresiones culturales/celebraciones. | español |
| [Atención Educativa](specs/asignaturas/atencion-educativa/spec.md) | Acogida, diálogo, acuerdos, responsabilidad y acción de cuidado. | español |

Religión y Atención son alternativas con finalización narrativa equivalente. Los cuatro personajes rotan entre áreas sin representar capacidad o diagnóstico.

## Qué concreta cada misión

Cada una tiene identificador y acceso propios, semana/fechas, objetivo curricular, actividad diferente, criterio u objetivo transversal y evidencia. Las especificaciones incluyen ayudas, ampliación, criterios de revisión y casos de aceptación. El contenido definitivo de cada juego incorporará modelos, soluciones y explicaciones originales.

Ejemplo del desdoblamiento en Matemáticas:

| Semana | Misión | Aprendizaje y evidencia |
|---|---|---|
| S01 | Las cantidades de bienvenida | Relacionar cantidades, numerales y agrupaciones dentro del rango elegido por el docente. Evidencia:Una cantidad representada con objetos y numeral. |
| S02 | El almacén por posiciones | Componer y descomponer cantidades según el valor posicional con rango ajustable. Evidencia:Dos descomposiciones de una misma cantidad. |
| S03 | Las rutas de la recta | Comparar, ordenar y situar números usando referencias en una recta. Evidencia:Recta con tres números situados y una comparación explicada. |
| S04 | El pedido estimado | Estimar y resolver una suma contextualizada mediante estrategias personales. Evidencia:Estimación inicial, solución y explicación de una diferencia. |

El resto de semanas se consulta en la especificación del área. Se comparten mecánicas, pero se concretan otros objetivos, decisiones y producciones: no se rebautiza una misma actividad16veces.

## Correspondencia con los libros

[Ver materiales, índices localizados y límites de cotejo](correspondencia-libros.md). Inglés sigue como propuesta Starter+U1+U2 de Kids Can!3; Science desdobla la primera agrupación de Outside the Box3; Sociales empieza por paisajes y agua. Superletras, EMAT y Religión mantienen propuestas propias pendientes del índice concreto y la temporalización de aula. En Matemáticas los bloques añadidos de medida/geometría/datos se marcan para cotejo por bloque antes de atribuirlos a T1 del libro.

**Idiomas cerrados:** Natural Science e Inglés en inglés; todas las demás áreas en español.

## Personajes y sprites

[Diseño y estados](arte/README.md) · [AtlasPNG](arte/personajes-atlas-v1.png) · [Prompt original](arte/prompt-atlas-v1.txt).

La hoja conceptual contiene16poses transparentes de los cuatro personajes y requiere revisión técnica de márgenes/recortes antes de producción. El nombre definitivo de la lechuza es Plumi. Los diálogos serán textoHTML accesible y traducible.

## GitHub

**Repositorio publicado:** [egeagomez/noria-tercero-primaria](https://github.com/egeagomez/noria-tercero-primaria). La primera versión se subió el 17/10/2026 a la rama `main` con autorización del usuario. Incluye 113 archivos con fuentes, planificación, personajes y los 32 juegos construidos. GitHub Pages permanece pendiente de activación. [Resultado detallado](comprobacion-github.md).

[Estudio de GitHub Pages Free](estudio-github-pages.md): viable para el sitio estático público, con progreso por navegador y exportación manual. El nuevo presupuesto contempla las176misiones y sus descargas, manteniendo el máximo de1GB de Pages. La publicación exige revisar tanto el sitio como el repositorio fuente y su historial.

## Documentación y siguiente entrega

- [Propuesta OpenSpec](proposal.md).
- [Diseño técnico](design.md).
- [Tareas](tasks.md).
- [Contexto curricular](contexto-curricular.md).
- [Contrato de plataforma](specs/plataforma-html/spec.md).
- [Contrato de publicación](specs/publicacion-pages/spec.md).
- [Contrato de sprites](specs/personajes-sprites/spec.md).
- [CalendarioJSON](calendario-semanal.json), [metadatos de Ciencias/Artes](datos-semanales-ciencias-artes.json) y [metadatos de Lengua/Matemáticas/proyectos](datos-semanales-humanidades.json).

La primera versión implementa los recursos comunes y las 16 misiones de Matemáticas y 16 de Lengua, con 32 descargas HTML autónomas. Se construye mediante `npm run build`. Las demás asignaturas conservan sus especificaciones para una fase posterior. Quedan pendientes los recorridos de aceptación en navegador, la revisión técnica definitiva del atlas y el cotejo exacto de los índices señalados. El repositorio ya está publicado; el despliegue de la web con GitHub Pages queda pendiente.

