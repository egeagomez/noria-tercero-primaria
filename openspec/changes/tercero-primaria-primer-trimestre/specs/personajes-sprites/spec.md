## Purpose

Mantener un hilo narrativo original y compartido entre todas las áreas mediante personajes coherentes, diálogos accesibles y recursos gráficos registrados antes de su integración.

## ADDED Requirements

### Requirement: Cuatro guías originales y una narrativa compartida

Los juegos SHALL situarse en «La Noria de los Descubrimientos», un entorno ficticio inspirado en la huerta de Molina de Segura. SHALL incluir Nori, robot; Sira, nutria; Plumi, lechuza; y Lumo, luciérnaga. Sus roles SHALL rotar entre áreas, sin asignar un personaje a un diagnóstico o un nivel de rendimiento. La narrativa SHALL premiar descubrir, explicar y colaborar sin exigir completar todos los itinerarios.

#### Scenario: Cambio de asignatura
- **WHEN** se pasa de Lengua a Natural Science
- **THEN** se reconocen los mismos personajes y mundo, y el diálogo cambia al idioma del módulo sin perder la identidad visual

### Requirement: Estados visuales consistentes

Cada personaje SHALL disponer de reposo, explicación, reflexión y celebración, identificados como `idle`, `explain`, `think` y `celebrate`. El recurso SHALL conservar proporciones, vestuario, identidad y escala coherentes. Los sprites SHALL tener transparencia real, no un fondo ajedrezado dibujado. SHALL NOT presentarse una hoja de poses como si fuera un ciclo de animación fluido.

#### Scenario: Respuesta que requiere revisión
- **WHEN** aparece una pista para revisar una respuesta
- **THEN** el personaje puede usar reflexión o explicación y el diálogo transmite la pista sin gesto de burla o castigo

### Requirement: Diálogo independiente de la imagen

Los textos, nombres y controles SHALL ser elementos accesibles fuera del bitmap y SHALL estar disponibles en el idioma del módulo. Los sprites decorativos SHALL poder ocultarse sin perder instrucciones. Los estados SHALL acompañarse de información textual cuando transmitan algo necesario.

#### Scenario: Imagen no disponible o lectura asistida
- **WHEN** el sprite no carga o se utiliza un lector de pantalla
- **THEN** el nombre, la instrucción y la acción siguen siendo comprensibles y el alumno puede continuar

### Requirement: Revisión y registro previo a producción

Antes de integrar los sprites SHALL existir una revisión de identidad, transparencia, bordes, márgenes y pivotes sobre fondos claros/oscuros. El atlas de preproducción SHALL conservarse junto a su prompt y descripción. El atlas técnico final SHALL declarar dimensiones reales, recortes y estado de validación; SHALL NOT suponerse que la cuadrícula generada tiene celdas enteras o que todos los márgenes son correctos.

#### Scenario: Atlas conceptual de tamaño no divisible
- **WHEN** la hoja generada mide 1254 × 1254 con cuatro filas y columnas
- **THEN** se identifica como propuesta visual y se programa su normalización antes de cualquier recorte automático de producción
