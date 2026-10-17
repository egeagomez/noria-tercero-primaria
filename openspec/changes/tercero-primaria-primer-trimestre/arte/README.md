# La Noria de los Descubrimientos — propuesta visual v1

Recurso de preproducción creado con la herramienta integrada `image_gen`; el prompt original de generación está en [prompt-atlas-v1.txt](prompt-atlas-v1.txt). El nombre definitivo de la lechuza es **Plumi**, ajustado a petición del usuario después de generar la imagen; el prompt conserva su identificador provisional como registro de procedencia. El bitmap no contiene nombres. Archivo: [personajes-atlas-v1.png](personajes-atlas-v1.png), PNG RGBA de 1254 × 1254 píxeles, con canal alfa real (rango 0–255). No se ha modificado la imagen generada.

## Mundo e hilo conductor

En una huerta ficticia inspirada en Molina de Segura, una noria imaginaria mueve un jardín de descubrimientos. Cada misión aporta una idea, una historia, una creación o una solución que el grupo comparte. Las áreas son distintos caminos del mismo mapa. El trimestre termina con una exposición cooperativa, sin eliminar personajes, perder vidas ni competir por rapidez.

Las referencias locales sirven de ambientación: no se representan el plano real del colegio ni monumentos específicos como si hubieran sido verificados. Las recompensas reconocen explorar, explicar y revisar; nunca convierten las calificaciones o el apoyo educativo en categorías de personajes.

## Personajes

| Personaje | Identidad visual | Personalidad y función |
|---|---|---|
| Nori | Robot verde azulado, cara crema, detalles terracota, emblema de rueda | Se pregunta cómo funcionan las cosas; explica pasos y aprende de sus errores. |
| Sira | Nutria marrón, pañuelo turquesa, bolsa mostaza | Explora y cuida el entorno; anima a observar y colaborar. |
| Plumi | Lechuza crema y canela, chaleco verde, bandolera | Escucha, inventa relatos y propone formas diferentes de expresar ideas. |
| Lumo | Luciérnaga dorada, cuerpo turquesa, alas claras | Hace preguntas cortas, propone patrones y celebra los descubrimientos. |

Todos aparecen en todas las asignaturas y hablan el idioma del módulo. No hay un personaje «para alumnos que van lentos» ni profesiones asignadas por género. El texto del diálogo se dibujará en HTML, fuera del bitmap, para permitir traducción y lectura asistida.

## Lectura del atlas

| Fila, de arriba abajo | Columna 1 | Columna 2 | Columna 3 | Columna 4 |
|---|---|---|---|---|
| Nori | Reposo | Explica | Piensa | Celebra |
| Sira | Reposo | Explica | Piensa | Celebra |
| Plumi | Reposo | Explica | Piensa | Celebra |
| Lumo | Reposo | Explica | Piensa | Celebra |

Son **16 poses discretas**, no fotogramas de una animación de caminar. Cada estado tiene un nombre estable: `idle`, `explain`, `think`, `celebrate`.

## Integración inicial y preparación futura

La hoja mantiene las cuatro identidades y sus estados, sin texto incrustado. Se ha comprobado su tamaño, RGBA y presencia de transparencia. La generación no respetó una dimensión divisible entre cuatro: la cuadrícula teórica mide 313,5 píxeles por celda. Los contornos y márgenes son aproximados, con pequeñas irregularidades de borde y posibles extremos próximos a la celda vecina; **no es aún un atlas técnico validado para recorte automático**.

La implementación inicial conserva el PNG original y utiliza CSS `background-size: 400% 400%`, con posiciones 0%, 33,333333%, 66,666667% y 100% para filas y columnas. Así evita suponer recortes enteros de 313 píxeles. Los diálogos permanecen en HTML; si falta la imagen, su texto y el nombre accesible siguen disponibles.

El archivo sigue siendo una primera versión visual. Antes de considerarlo atlas técnico definitivo: ajustar márgenes, revisar especialmente alas y brazos extendidos, normalizar dimensiones y pivotes, comprobar halos sobre fondos claro/oscuro y obtener recortes/atlas final. La identidad y las cuatro poses por personaje se han revisado en el atlas completo; la revisión de las 16 celdas dentro del navegador queda pendiente porque esta sesión no dispone de navegador conectado.

La animación se añadirá solo si tiene una función clara. El modo de movimiento reducido mantendrá poses estáticas; la celebración se mostrará también mediante texto y nunca interrumpirá la lectura.
