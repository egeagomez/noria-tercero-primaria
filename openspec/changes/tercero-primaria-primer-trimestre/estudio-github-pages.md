# Viabilidad de GitHub Pages para los juegos

Consulta: 17 de octubre de 2026. Dictamen: viable para un catálogo de juegos HTML/CSS/JavaScript ejecutados en el navegador.

## Plan gratuito y límites verificados

GitHub Free permite Pages desde repositorios públicos. El sitio publicado tiene un máximo de 1 GB; el repositorio fuente tiene una recomendación de 1 GB. El tráfico tiene un límite flexible de 100 GB/mes. Hay un límite flexible de 10 construcciones/hora, que no se aplica al publicar con un flujo personalizado de GitHub Actions. Un despliegue caduca si supera 10 minutos. El servicio no está destinado a alojar negocios de comercio electrónico o SaaS comercial. [Fuente oficial: límites de Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

Los procesos que utilicen ejecutores estándar de GitHub Actions en repositorios públicos son gratuitos. Evitar ejecutores grandes de pago y retención innecesaria de artefactos. [Fuente oficial: facturación de Actions](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

## Encaje técnico

Pages publica archivos estáticos y admite una URL de proyecto del tipo `https://usuario.github.io/repositorio/`. Se diseña un catálogo para todas las áreas dentro de un solo sitio. [Fuente oficial: funcionamiento y tipos de sitio](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

**Consecuencia de arquitectura:** la lógica del juego, las ayudas y las correcciones se ejecutarán en el navegador. Pages por sí solo no aporta cuentas de alumnado, bases de datos, ejecución PHP/Python ni una sala multijugador que sincronice respuestas. Compartir la misma URL o red wifi tampoco sincroniza dispositivos. Un servidor HTTP de archivos, incluido `python -m http.server`, distribuye contenido pero tampoco añade ese canal de sincronización.

Se proponen sesiones individuales o por parejas y modo proyector con turnos. El progreso se guarda solo en ese navegador, con apodo opcional no derivado del nombre. Exportación manual JSON/CSV y fichas de observación permiten al docente reunir evidencias. La exportación no es una recogida automática ni un marcador compartido.

## Publicidad y privacidad del contenido

El sitio será accesible públicamente; una pantalla con contraseña implementada solo en JavaScript no constituye control de acceso. Las páginas admiten HTTPS. [Fuente oficial: HTTPS y visibilidad](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).

Publicar únicamente juegos y recursos: nunca listados de alumnado, nombres, imágenes personales, exportaciones de progreso ni credenciales. La revisión abarcará también los archivos versionados y el historial del repositorio público. Las tablas de correspondencia de apodos, si el centro las usa fuera del juego, se conservarán fuera del repositorio. El propio proveedor puede registrar direcciones IP por seguridad; la aplicación propuesta no añadirá analítica ni rastreadores. [Fuente oficial: datos de visitas](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## Presupuesto propuesto, no límites de GitHub

| Recurso | Objetivo de diseño |
|---|---|
| Catálogo inicial | Menos de 2 MB sin precargar todos los juegos |
| Juego descargable autocontenido | Preferiblemente menos de 5 MB; justificar excepciones con audio |
| Sitio T1 completo | Objetivo menor de 500 MB, incluidas las 176 descargas; previsión de 2,5 MB por descarga |
| Solicitudes externas durante juego | Cero tras cargar los recursos locales |
| Sonido | Solo a petición; clips cortos, texto equivalente |

Ejemplo orientativo: 100 alumnos × 20 sesiones/mes × 5 MB por sesión ≈ 10 GB/mes. Es una estimación de transferencia, no un límite de alumnos simultáneos ni una garantía de disponibilidad; la caché y el tamaño real cambian el consumo.

## Publicación propuesta

En la fase de implementación se creará un directorio de salida con `index.html`, `juegos/`, `assets/`, créditos y descargas. Las rutas serán relativas para funcionar bajo el nombre del repositorio. Se propondrá publicar ese directorio mediante Pages; el repositorio y su propietario siguen pendientes. Antes de publicar se revisarán rutas, tamaños y archivos incluidos. La reversión consistirá en volver a desplegar la versión anterior. Este estudio no crea un repositorio ni publica contenido.

## Licencias de materiales

GitHub Free es un plan de alojamiento, no una licencia de reutilización de los contenidos. La licencia del código y la del material docente se decidirán por separado antes de publicar; opciones a valorar: MIT para código original y CC BY 4.0 para material docente original. Se documentará autoría/procedencia de sprites y recursos. No se copiarán ilustraciones ni textos de editoriales sin permiso. Si se incorporan pictogramas u otros recursos externos, se comprobará la licencia concreta y sus condiciones antes de añadirlos; no se presupone que todo uso escolar permita redistribución pública.
