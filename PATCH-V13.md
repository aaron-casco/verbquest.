# VerbQuest V13 · Guía y moderación de criaturas

- Aviso convertido en visita guiada por la mascota: huevos, niveles 40/80, botón inferior del ranking, selección de tres criaturas o todas si tienes menos, y ranking de clase. Se puede continuar más tarde; solo se marca como completada al finalizar. Quien leyó el aviso V12 recibe esta guía nueva una vez.
- Los huevos tienen ilustraciones vectoriales con contornos y paletas acordes a las criaturas.
- Moderador → Editar persona → Ver y evolucionar todas sus criaturas. Funciona también para tu cuenta. Cada pulsación avanza una etapa gratis, incluidos los legendarios sin esperar 24 horas. Requiere confirmación. Supabase verifica tu identidad de moderador; el resto no puede saltar el temporizador.
- No reinicia cuentas ni cambia monedas, XP, compras, logros, puntuaciones ni participación. Una evolución manual modifica solo la etapa de la copia elegida y el compañero activo si corresponde. La migración conserva las paletas y fechas V12 y no borra criaturas.

## Instalación

1. Descomprime verbquest-v13.zip en Descargas (carpeta verbquest-v13).
2. En Terminal del Mac:

```bash
cd "/Users/aaron_casco/Downloads/verbquest 6"
bash "$HOME/Downloads/verbquest-v13/aplicar.sh"
pbcopy < "$HOME/Downloads/verbquest-v13/supabase-update-v13.sql"
```

3. En Supabase → SQL Editor → New query: pega con ⌘V el contenido SQL copiado y pulsa Run. El comando pbcopy va en Terminal, no en Supabase. Usa únicamente este SQL combinado para este paquete. Es repetible y conserva los perfiles; añade la función de evolución del moderador.
4. Puedes probar con npm start y http://localhost:4173. El panel local es una demo, no cambia cuentas públicas.
5. Para publicar desde Terminal:

```bash
bash "$HOME/Downloads/verbquest-v13/publicar.sh"
```

El instalador detecta base pública, V11, V12 original o V12 con aviso. Si los archivos no coinciden se detiene sin aplicar. Guarda copia de los archivos existentes, ejecuta las pruebas y construye la web. El script de publicación sube solo los archivos del paquete a GitHub. Si Vercel está conectado a ese repositorio, espera al despliegue Ready y recarga la web.

No se ha desplegado desde este entorno: la instalación y publicación se realizan con los pasos anteriores. No uses reset ni borres el almacenamiento de usuarios.
