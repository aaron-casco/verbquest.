# VerbQuest V12 · Evolución celestial

## Cambios

- Tu mascota muestra las novedades una sola vez por cuenta al volver a Inicio, después del tutorial. Al cerrar o continuar se guarda únicamente la marca de lectura; no se reinician monedas, XP, compras, criaturas, logros ni resultados.

- Lunar y Solar: paletas originales fijas. Se oculta todo el panel lateral de colores; queda la criatura con su botón de evolución. Las clásicas y los iniciales conservan la personalización. Las copias Lunar/Solar que se hubieran recoloreado pasan a mostrar la paleta original.
- Nocti / Noctara: medusa espectral. Mora / Morath: búho lunar. Corvath: cuervo final con alas, cola y detalles más elaborados.
- Selene bebé: nebulosa original inspirada en Cosmog. Leora bebé: núcleo estelar original inspirado en Cosmoem. Se conserva el concepto de sus evoluciones finales.
- SOLO Selene y Leora evolucionan gratis al transcurrir 24 horas desde la adquisición de cada copia. Hay una cuenta atrás; al terminar se habilita el botón para evolucionar. No se transforman automáticamente.
- La fecha de las nuevas copias la establece Supabase. El servidor comprueba la propiedad y el plazo de 24 horas. Cambiar la hora del móvil no permite adelantarse.
- Para copias antiguas, se recupera la fecha de adquisición de su recibo si está disponible. Si no existe una fecha, las 24 horas empiezan al aplicar el SQL. Las copias ya evolucionadas conservan su etapa.
- Revelación celestial de seis segundos, con anillos, luz y transformación. Respeta la preferencia de reducir movimiento y permite cerrar la animación sin perder la evolución guardada.
- Todo el contenido de V11 permanece: traducciones, XP, exhibiciones y tres huevos. No se cambia ningún precio, probabilidad ni premio de ejercicios.

## Instalar

1. Descarga `verbquest-v12.zip` y descomprímelo en Descargas. Debe aparecer una carpeta `verbquest-v12`.
2. En Terminal:

```bash
cd "/Users/aaron_casco/Downloads/verbquest 6"
bash "$HOME/Downloads/verbquest-v12/aplicar.sh"
```

El instalador detecta la V12 anterior, V11 o la base pública f94a45d, comprueba el parche antes de tocar archivos, guarda una copia de los archivos afectados que existan, aplica la versión adecuada y ejecuta npm ci, npm test y npm run build. No publica nada ni reinicia cuentas. Si detecta otra base, se detiene: envía el error y no uses git reset ni borres el proyecto.

3. Copia el SQL completo al portapapeles de tu Mac:

```bash
pbcopy < "$HOME/Downloads/verbquest-v12/supabase-update-v12.sql"
```

En Supabase → SQL Editor → New query, pega y pulsa Run. Este es el ÚNICO SQL que debes ejecutar para esta actualización. Incluye V11 y V12 en una transacción. No ejecutes de nuevo los SQL antiguos. Añade fechas de adquisición y fija colores en las copias Lunar/Solar, conservando monedas, XP, rondas y evoluciones finales. Los perfiles afectados cambian de revisión para impedir que una sesión anterior sobrescriba los metadatos; tras la publicación, recarga la web.

4. Revisa la demo local:

```bash
npm start
```

Abre http://localhost:4173. La demo no utiliza las partidas de Supabase: solo perfiles de este navegador. En producción la evolución utiliza el reloj de servidor; en esta demo local usa el del equipo.

5. Cuando lo hayas revisado y el SQL esté instalado:

```bash
bash "$HOME/Downloads/verbquest-v12/publicar.sh"
```

Este script añade solamente los archivos de la actualización, crea un commit y hace git push. Vercel desplegará si sigue conectado a esa rama del repositorio. Comprueba que el despliegue termina en Ready y recarga la app. No borres datos del sitio: basta recargar.

## Verificación realizada

65 pruebas automáticas de proyecto y compilación de producción. Prueba Chromium móvil 390×844: paneles ocultos para Lunar/Solar, colores fijos incluso si la configuración contiene otro color, personalización clásica conservada, cuenta atrás bloqueada, evolución gratis una sola vez, animación y ausencia de errores JS/desbordamiento horizontal. Prueba PostgreSQL local (PGlite): fechas heredadas, preservación de monedas/XP/rondas/premios y etapas finales, adquisición nueva fechada por servidor, rechazo de fecha manipulada, acceso de otro propietario rechazado y migración repetida sin cambios.

Estas son pruebas locales. No se ha aplicado el SQL ni desplegado en tu proyecto desde este entorno. El instalador y los parches se comprobaron contra las dos bases antes de entregar el paquete.

## Arte

Se editaron los atlas transparentes con la herramienta integrada de imágenes. Referencias: atlas V11 y capturas aportadas. Instrucciones: conservar dibujo 2D y contornos, mantener el Sol/Luna, reemplazar dos comunes lunares y el cuervo final, crear una nebulosa bebé y un núcleo solar; conservar el resto lo más fielmente posible. Archivos: assets/moon-v11.png y assets/sun-v11.png. Se ajustaron sus recortes de cuerpo, alas y tentáculos.
