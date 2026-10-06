# Arte v6

Ilustraciones originales generadas a partir de la referencia favorita y adaptadas a la paleta morada/dorada. starters-v6.png: 1254×1254, nueve etapas. collectors-v6.png: 1983×793, diez etapas. El atlas de accesorios de la revisión anterior se ha retirado de esta distribución. Prompts completos en BRIEF-v6.md.

Anclajes individuales de cabeza, ojos, cuello y muñecas en anatomy.js; medición fuente en anchors-v6.json. Son atlas raster, no documentos vectoriales. pets.js separa a partir del atlas las capas de pigmentos, delineado, detalles neutros y partes del cuerpo en tiempo de ejecución. colour-layers.js cambia los tonos preservando diferencias de luminosidad y saturación. Los píxeles de ojos, contornos y detalles neutros están protegidos. El dibujo original no se altera cuando se eligen los colores predeterminados.

Accesorios con transparencia y sombreado propio; el ajuste inicial sigue los anclajes y puede afinarse gratis en el editor con posición, tamaño y giro. Cambiar su tono cuesta 30 VC. Las vistas previas de nuevas evoluciones siguen siendo siluetas.

## Actualización v7
Se mantienen las ilustraciones v6. Solo el pigmento principal puede editarse; ojos y contornos oscuros se conservan. Se amplía la cobertura de tonos claros de Gema y Astra, y verdes de Nimbo. La máscara geométrica de ojos que bloqueaba zonas completas de cara se ha retirado. Accesorios deshabilitados y no renderizados; atlas antiguo retirado de esta distribución.

## Corrección v8
Se aísla el componente principal en el recorte a resolución nativa antes de reescalar; evita que el antialias conecte fragmentos de vecinos en Vesperion y Astralis. Máscara adicional para líneas moradas oscuras, independiente del tono principal elegido. Los atlas fuente conservan sus ilustraciones originales.
