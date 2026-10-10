# VerbQuest · Moon & Sun update

Base verificada: f94a45d029a2a07daf1c75c61a449f26aed0bee0.

## Contenido

- Verbs Translator empieza en español → infinitivo inglés. Selector en la tarjeta de práctica para invertir el sentido; preferencia por cuenta. La prueba inicial y el competitivo usan español → inglés. Las revisiones conservan el sentido de los errores.
- Sinónimos explícitos ampliados, mayúsculas/espacios/tildes opcionales. No se aceptan faltas inglesas mediante coincidencias aproximadas. Dig admite excavar; beat admite superar. Draw se mantiene dibujar/trazar; lie regular e irregular siguen separados.
- El botón inferior de la mascota abre el ranking por XP total de cuentas verificadas EducaRex con competitivo habilitado. No cambia el ranking de temporada ni sus puntos. Empates de XP tienen orden estable por ID.
- Primera visita: seleccionar tres criaturas propias (si se tienen menos, todas). Se muestran al pulsar al jugador, con su evolución, nombre y color. Se puede editar en la tienda. Vender una copia limpia su hueco de exhibición; las demás permanecen.
- Classic Egg: criaturas existentes. Moon Egg: nivel 40. Sun Egg: nivel 80. Todos cuestan 150 VC por criatura, lotes de 1/5/10 sin descuento, capacidad 30, duplicados independientes y venta como antes.
- Cada huevo nuevo contiene cinco especies originales con etapa bebé y final. Probabilidades por huevo: 35%, 30%, 20%, 12%, 3%; rarezas como Classic. Inspiración lunar/gótica y solar; guardianes originales inspirados en el concepto de murciélago lunar y león solar.
- Las quince especies coleccionables aparecen en el catálogo con silueta e interrogación si nunca se han descubierto. No se revela el nombre de las especies pendientes.
- Aviso de instalación solo en móvil, después de 12 segundos en Home sin tutorial ni otro diálogo; separación mínima de tres días por navegador. No se muestra en modo instalado. Botón nativo si el navegador entrega beforeinstallprompt; instrucciones de Safari/Android en los demás casos. La web no puede instalarse automáticamente en iPhone.
- Migración SQL: amplía únicamente la proyección pública (XP, elegibilidad y hasta tres criaturas propias) y valida los desbloqueos de huevos. No expone emails en esa proyección.

## Instalar sin reiniciar partidas

1. Descarga `verbquest-v11.patch` en Descargas. Abre Terminal:

```bash
cd "/Users/aaron_casco/Downloads/verbquest 6"
git status --short
git apply --check "$HOME/Downloads/verbquest-v11.patch"
git apply "$HOME/Downloads/verbquest-v11.patch"
npm ci
npm test
npm run build
```

Si `git apply --check` da error, detente: la base local es distinta. No uses reset, clean ni borres los datos. Facilita el texto del error para adaptar el parche.

2. En Supabase → SQL Editor → New query, pega TODO `supabase-eggs-exhibition.sql` y pulsa Run. Este archivo está incluido en el parche. No pegues de nuevo los SQL antiguos. La migración no hace UPDATE, DELETE ni TRUNCATE de cuentas o partidas.

3. Comprueba localmente con `npm start`, abre http://localhost:4173. La demo local tiene perfiles de navegador: no comparte datos con producción.

4. Cuando esté revisado, sube SOLO los archivos del parche:

```bash
git add app.js data.js translator.js translator.test.mjs collection.js collection.test.mjs pets.js anatomy.js colour-layers.js styles.css translations.js sw.js build.mjs server.mjs package.json eggs.js exhibition.js installation.js update-v11.test.mjs supabase-eggs-exhibition.sql PATCH-V11.md assets/moon-v11.png assets/sun-v11.png
git commit -m "Add translation directions, XP showcase and Moon/Sun eggs"
git push
```

Vercel desplegará al subir a la rama conectada. No cambies el proyecto Supabase ni sus variables de entorno; eso mantiene las mismas cuentas. Tras Ready, recarga la web instalada para recibir la versión nueva.

## Validación

60 pruebas automáticas de proyecto; compilación de producción; navegador Chromium 390×844: traducciones en ambos sentidos, respuesta correcta, selección de tres mascotas, filtrado/orden XP, exhibición pública, compra lunar de cinco, catálogo de quince especies, sin errores JS/desbordamiento horizontal. Revisión de las veinte etapas nuevas con color original y azul. SQL probado en PostgreSQL local (PGlite): preserva filas/revisiones e intentos, filtra email, limita exhibición a copias propias, bloquea huevos sin nivel y admite ejecutar la migración otra vez.

No se ha aplicado el SQL ni desplegado en tus servicios desde este entorno. La comprobación no simula trampas de XP: el sistema heredado todavía confía en XP/monedas enviados por el cliente. Este parche no cambia ese modelo ni concede XP.

## Arte

Atlas nuevos creados con la herramienta integrada de imágenes: `assets/moon-v11.png` y `assets/sun-v11.png`. Instrucciones de arte: cuadrícula de cinco especies por dos etapas; mismo dibujo 2D, contornos oscuros, pigmento primario lunar púrpura / solar dorado, secundario crema / turquesa, fondo transparente, sin accesorios, evolución final diferenciada y legendarias originales. Se mantienen los atlas clásicos.
