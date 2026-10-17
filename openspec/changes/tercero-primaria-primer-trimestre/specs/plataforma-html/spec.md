## Purpose

Definir una experiencia común de juegos educativos HTML accesibles y utilizables por alumnado de tercero, con evidencias formativas y progreso estrictamente local.

## ADDED Requirements

### Requirement: Catálogo semanal por área

El catálogo SHALL ofrecer al menos dieciséis misiones por área/itinerario, identificadas con las semanas S01–S16 del calendario compartido. Cada misión SHALL tener acceso propio y el docente SHALL poder reubicarla sin borrar su identificador o bloquear las demás. SHALL distinguir las misiones disponibles de asignaturas todavía no implementadas y no mostrar enlaces a juegos inexistentes.

#### Scenario: Disponibilidad semanal
- **WHEN** se abre una asignatura implementada
- **THEN** se pueden consultar y abrir sus dieciséis misiones con semana, objetivo y estado de progreso local

### Requirement: Catálogo por área y programación elegida

El catálogo SHALL mostrar área, misión, objetivo, idioma y duración aproximada. El docente SHALL poder ordenar, ocultar o habilitar misiones según su programación. Natural Science e Inglés SHALL usar inglés como idioma principal; todas las demás áreas, incluida Profundización Educativa, SHALL usar español según los materiales aportados y la indicación del usuario. Religión Católica y Atención Educativa SHALL ser itinerarios alternativos elegidos por el docente, sin exigir completar ambos ni mostrar públicamente elecciones individuales.

#### Scenario: Elección de un área
- **WHEN** se abre el catálogo para el primer trimestre
- **THEN** se muestran las misiones habilitadas con su idioma y un acceso directo; no se bloquean por no haber jugado otras áreas

#### Scenario: Idioma conforme al material
- **WHEN** se abre Natural Science, Inglés o cualquier otra área del catálogo
- **THEN** Natural Science e Inglés muestran consignas, ayudas y diálogos en inglés, y el resto los muestra en español

### Requirement: Juego ejecutable en navegador y descarga autónoma

Cada juego SHALL poder abrirse desde su URL de Pages y SHALL disponer de una descarga HTML autocontenida con los recursos necesarios. El juego descargado SHALL funcionar sin peticiones de red tras abrirlo en un navegador compatible. El catálogo web SHALL usar recursos locales al sitio y no depender de servicios externos para completar misiones. Las limitaciones al abrir archivos locales en iPad SHALL documentarse y SHALL ofrecerse la URL HTTPS como acceso principal.

#### Scenario: Recurso descargado sin conexión
- **WHEN** se abre el HTML descargado en un navegador de escritorio compatible sin red
- **THEN** funcionan actividad, imágenes y ayudas incluidas, y se avisa si el navegador impide guardar progreso

### Requirement: Autonomía, pistas y elección de dificultad

El juego SHALL seguir una secuencia de exploración, práctica, evidencia y revisión. SHALL permitir recorrido ordinario, apoyo y ampliación elegidos manualmente. SHALL permitir pausas, reintentos y salida sin pérdida de acceso; un error SHALL dar información útil, sin quitar vidas ni ridiculizar al alumno. El temporizador SHALL estar desactivado inicialmente y SHALL poder pausarse o quitarse cuando se habilite.

#### Scenario: Error y reintento
- **WHEN** se responde erróneamente a una actividad cerrada
- **THEN** aparece una pista vinculada al contenido y se puede revisar la respuesta sin penalización por velocidad

### Requirement: Acceso por teclado, tacto y lectura asistida

La experiencia SHALL ofrecer texto base de al menos 18 px, controles táctiles de al menos 44 × 44 px, ampliación hasta 200 %, contraste de texto normal de al menos 4,5:1 y foco visible. SHALL funcionar a 320 px de anchura y en orientación horizontal/vertical sin impedir la actividad. Todo arrastre SHALL tener alternativa mediante selección y botones. SHALL usar HTML semántico, idioma declarado y cambios de idioma identificados; imágenes informativas SHALL tener alternativa textual. Sonidos SHALL activarse por acción del usuario y tener representación equivalente. El modo de movimiento reducido SHALL eliminar animaciones no esenciales. La información SHALL comunicarse también mediante texto o forma, no solo color. Los textos SHALL ser breves y presentar una instrucción principal cada vez.

#### Scenario: Actividad de ordenar sin arrastre
- **WHEN** el alumno usa únicamente teclado o botones de selección
- **THEN** puede seleccionar, mover, confirmar y corregir los mismos elementos que con arrastre

#### Scenario: Audio no disponible
- **WHEN** el navegador bloquea sonido o el alumno activa la alternativa visual
- **THEN** se puede completar una actividad equivalente y el registro distingue esa adaptación de una prueba de escucha

### Requirement: Progreso local sin identificación personal

El juego SHALL funcionar sin cuenta ni nombre real. Un apodo opcional SHALL elegirse o generarse de manera independiente de nombres reales. El progreso SHALL quedarse en el navegador, con selección explícita de perfil anónimo en dispositivos compartidos. SHALL ofrecer continuar como invitado, borrar datos y exportar/importar un fichero local validado. SHALL informar que otro dispositivo o navegador no recibe ese progreso automáticamente. Si el almacenamiento falla, SHALL permitir seguir jugando y descargar el resumen. SHALL NOT subir resultados, grabaciones ni datos de menores a GitHub u otro servicio.

#### Scenario: Cambio de alumno en tablet compartida
- **WHEN** comienza una nueva sesión
- **THEN** se ofrece invitado o selección explícita de un perfil anónimo, sin atribuir automáticamente resultados del usuario anterior

#### Scenario: Exportación mal formada
- **WHEN** se intenta importar un fichero desconocido o inválido
- **THEN** se rechaza con un mensaje claro sin sobrescribir el progreso y sin ejecutar contenido del fichero

### Requirement: Evaluación formativa y observación complementaria

El resumen SHALL distinguir primer intento, reintentos, ayudas y evidencias docentes pendientes. SHALL separar interacción oral, expresión escrita abierta, creación artística, interpretación musical, actividad corporal y convivencia de respuestas autocorregibles. SHALL permitir exportar una síntesis local JSON/CSV sin convertirla en calificación oficial. El docente SHALL poder observar tres descriptores de logro y anotar una mejora pendiente. El tiempo de respuesta SHALL NOT utilizarse como equivalente de aprendizaje.

#### Scenario: Resultado parcial
- **WHEN** termina una misión con parte digital y actuación presencial
- **THEN** el resumen conserva ambos tipos de evidencia separados y muestra pendiente la actuación todavía no observada

#### Scenario: Adaptación de acceso y logro
- **WHEN** un alumno utiliza teclado, ampliación, comunicación alternativa u otro apoyo de acceso
- **THEN** ese uso no rebaja por sí solo su logro ni su autonomía; se registra separado del andamiaje conceptual y, si cambia el objetivo observado, se obtiene una evidencia adecuada mediante otra modalidad

### Requirement: Uso individual, por parejas y con proyector

El producto SHALL admitir una partida local individual o por parejas y un modo proyector con turnos en un mismo dispositivo. SHALL explicar que abrir la misma URL en varias tablets no crea una sala sincronizada ni un marcador global. SHALL NOT simular una recepción en tiempo real de respuestas que no se está realizando.

#### Scenario: Clase con varias tablets
- **WHEN** diez tablets abren el mismo juego
- **THEN** cada una tiene su sesión independiente; el docente puede reunir resúmenes manualmente y no ve un marcador agregado inexistente
