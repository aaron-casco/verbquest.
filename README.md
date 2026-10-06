# VerbQuest — revisión v8

Nueva versión para revisar antes de actualizar la web pública. La publicación anterior sigue en https://verbquest-aaron-demo.tribuiagenius.chatgpt.site; esta revisión no se ha desplegado.

## Abrir en el ordenador

Descomprime el ZIP y abre una terminal en la carpeta `verbquest`. Detén cualquier versión anterior con Control+C. Necesitas Node.js instalado.

```bash
npm ci
npm start
```

Abre http://localhost:4173. No abras `index.html` directamente. Conserva la terminal abierta. Los perfiles y compras existentes se conservan usando el mismo navegador y dirección.

El panel de **revisión local** aparece al entrar desde localhost en el ordenador que ejecuta el servidor. Permite probar cambios de temporada y premios. No se habilita en direcciones públicas o de red. Esto sirve para revisar la interfaz; no representa una cuenta de moderador de producción.

## Cambios v8

Se conservan los 19 diseños aprobados y la personalización solo del color principal. Cada dibujo se aísla antes de reducirlo para evitar fragmentos de criaturas vecinas; las líneas moradas oscuras están protegidas del recoloreado. Catálogo: criaturas no descubiertas en silueta negra con interrogación blanca. Aperturas de 1/5/10 por 150/750/1500 VC, sin descuento, con una animación común para el lote. La cruz salta la animación y muestra resultados; desde ahí puedes vender cada criatura o guardar el resto. Venta individual o múltiple, siempre con monedas; eliminación sin devolución retirada. Colección máxima de 30, con comprobación de huecos y saldo antes de comprar. Iniciales y compañero activo protegidos.

## Funciones existentes

- Diecinueve ilustraciones: Lumio, guardián de fuego; Nyx, reptil acuático; Bruma, ave del bosque. Las tres etapas tienen anatomías y siluetas diferentes.
- Colores independientes por regiones, conservando ojos y contornos, con rellenos sólidos. La paleta no tiñe indiscriminadamente toda la imagen. Carga única del atlas, recortes limpios y caché limitada a 60 variantes.
- Pulsera y amuleto ajustados por especie y etapa. Los accesorios adquiridos antes se conservan. Colores y accesorios disponibles en evolución final, con vista previa antes de pagar.
- La primera práctica de cada juego dura siete verbos; la primera ruleta, cinco. Después, todos los verbos del examen seleccionado. Un acierto de práctica da 5 VC; la introducción perfecta de siete preguntas da 35 VC, sin bonus fijo. Repaso: 2 VC/acierto.
- Competitivo: Memoria activa, Portal correcto, Cadena y Cazafallos, una pregunta por verbo, sin ruleta. Pantalla de salida, cuenta atrás y cronómetro. Se limpia la selección entre preguntas. Más aciertos gana; el tiempo desempata.
- Premios locales con importe y motivo, pendientes hasta que se recogen. Animación y abono exactamente una vez, conservados tras recarga.
- Avisos de exámenes y práctica, calendario descargable con cuatro fechas y avisos a una semana y un día; sistema Push de servidor incluido para la siguiente publicación con servidor.

## Exámenes

| Examen (2026) | Intervalo | Entradas |
|---|---|---:|
| 7 octubre | Be–Drive | 25 |
| 14 octubre | Eat–Lend | 28 |
| 21 octubre | Let–Shoot | 25 |
| 28 octubre | Show–Write | 27 |

105 entradas de la lista escrita por Aarón. `begin` corrige el dictado «beigin». `lie` tiene dos sentidos: tumbarse (lie–lay–lain) y mentir (lie–lied–lied). `wake up` conserva sus dos palabras.

Cada simulacro incluye todas las filas, una forma dada y dos casillas por completar. Clásico, aleatorio y perfecto; también simulacro de los 105 verbos. Hasta tres casillas incorrectas o vacías aprueba; cuatro suspende. Perfecto exige cero.

La corrección acepta variantes válidas, mayúsculas y separadores: was / were, was were, was or were. No acepta palabras ajenas ni elimina faltas ortográficas. Los distractores cercanos pueden ser inventados; nunca se añaden a la lista de estudio.

## Guía y Verbito

La mascota señala los controles y bloquea los otros durante la guía; se puede salir explícitamente. Explica prácticas, monedas, tienda, evoluciones y Verbito. Los juegos recién desbloqueados muestran instrucciones y una introducción corta.

Verbito es una biblioteca, no un chatbot. Selecciona los verbos estudiados y consulta su uso o tres ejemplos de cada forma (nueve por verbo). Puedes cambiar de función conservando la selección. Corregir errores usa solamente los fallos de la última ronda terminada.

## Monedas

Sin bonus por finalizar ni monedas por partidas abandonadas. Competitivo y simulacro no dan monedas automáticamente. Los premios son decisiones del moderador.

Juegos: gratis, 40, 70, 100 y 140 VC. Competitivo: 100 VC. Evoluciones: 150 y 350 VC. Color principal: 40 VC; personalizado: 100 VC. Cambiar de inicial: 700 VC. Renombrar es gratis.

## Avisos

`npm start` ejecuta también el servidor Push. Al pulsar Permitir avisos y aceptar el permiso, el navegador se suscribe; el servidor guarda el dispositivo y preferencias. A partir de las 18:00 de Madrid revisa recordatorios cada minuto. Prioriza el examen y limita la entrega a un aviso diario por dispositivo. No manda práctica diaria si ya completaste una ronda ese día. El service worker muestra mensajes incluso con la página cerrada. Se puede cancelar la suscripción en Ajustes.

Las claves privadas y suscripciones se guardan en `.runtime/push.json`, fuera de los archivos servidos, con permisos restrictivos. La cookie de dispositivo es HttpOnly, SameSite=Strict y solo se crea al activar avisos. Las rutas de escritura comprueban el origen. Se admite exclusivamente servicios Push de Apple, Google y Mozilla. Una suscripción caducada se retira. Los errores transitorios se reintentan.

**El servidor debe permanecer activo y tener salida a esos servicios; al publicar necesita HTTPS y almacenamiento persistente.** La web pública actual y una publicación de solo `dist/` no ejecutan este servidor. No se ha confirmado la entrega en un teléfono físico ni con servicios externos desde este entorno. En iPhone, instala la web en la pantalla de inicio antes de solicitar permisos. La configuración y alarmas finales del calendario dependen de la app de calendario del usuario.

Los avisos por adelantamientos en un ranking compartido quedan pendientes de conectar las cuentas y la clase. La opción se muestra desactivada para no prometer envíos inexistentes.

## Tu cuenta de moderador al publicar

Aarón ha elegido indicar el correo al publicar. No se asigna administrador al primer registro ni por escribir «Aarón» o un correo en la pantalla.

Antes de abrirlo a la clase se necesitan cuentas verificadas y una base de datos compartida. En el servidor se asociará el identificador de tu cuenta verificada al rol `moderator`; los demás recibirán `student`. El permiso acompaña a tu cuenta aunque juegues normalmente. Cada operación para dar premios, cambiar temporada o gestionar alumnos debe comprobar ese rol en el servidor. El navegador no decide ni puede cambiarlo. Los premios deberán tener identificadores únicos y abono transaccional en esa base de datos.

El sitio actual permite acceso público; una autenticación con ChatGPT puede identificar una cuenta y proporcionar su correo verificado. Si se quiere acceso por correo/contraseña independiente, hay que conectar un proveedor de autenticación compatible. Este ZIP todavía no integra cuentas ni ranking compartidos: el formulario de demo no guarda ni comprueba contraseñas, y nunca debe presentarse como registro real.

No habilites el panel de revisión en producción. `VERBQUEST_DISABLE_REVIEW=1` lo desactiva también en localhost. En un despliegue Node con HTTPS usa `VERBQUEST_HTTPS=1` para que la cookie Push sea Secure, y `VAPID_SUBJECT` para el sitio o correo de contacto. El despliegue actual de Sites es estático; la integración con identidad, persistencia y ejecución de avisos es la fase previa necesaria para publicar la versión con cuentas reales. No basta con volver a subir el frontend.

## Comprobaciones

```bash
npm test
npm run build
```

`dist/` contiene la revisión estática. El servidor Node y sus secretos no se copian allí. El ZIP incluye código, imágenes y capturas de perfiles ficticios; no contiene claves, suscripciones ni datos de alumnos. Ver `VERIFICACION.md` y `PLAN-DE-PRUEBA.md`.

Referencias: [MDN Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API), [Apple Web Push](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers), [web-push](https://github.com/web-push-libs/web-push).


## Versión 5
Celebraciones al completar rondas, comprar y recoger premios; reducción de movimiento respetada. Ocho criaturas, 19 etapas; evoluciones ocultas antes de comprarlas. Colores por capas que conservan sombras y luces. Solo color principal editable; conserva los tonos originales de las demás zonas.

Descubrimientos 150 VC, con duplicados independientes. Probabilidades fijas 35/30/20/12/3. Venta según rareza 80/120/200/300 VC; iniciales y criatura activa protegidas. Solo venta; selección múltiple y límite de 30 criaturas.

Ruleta: cinco grupos por examen; todos los 105 verbos en veinte grupos o 25 aleatorios en cinco grupos. Grupos equilibrados y reorganizados cada ronda. La introducción conserva cinco verbos. Recompensas de práctica y repaso sin cambios.

Revisa `PLAN-DE-PRUEBA.md`. Preparación de publicación y verificador del correo administrador `acascog01@educarex.es` en `PUBLICACION.md`; todavía no conecta cuentas reales ni base de datos compartida.
