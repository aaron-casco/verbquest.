# GitHub y Vercel · versión 5

El proyecto está preparado para importar un repositorio en Vercel: `npm run build`, salida `dist`, configuración en `vercel.json`. No requiere modificar los juegos.

## Subir a GitHub
Crea un repositorio privado o público y sube este código, sin `node_modules`, `dist`, datos privados ni archivos `.env`. Desde una copia nueva: `git init`, `git add .`, `git commit -m "VerbQuest v8"`, conecta el remoto de tu repositorio y ejecuta `git push`. No cambies el remoto interno de la copia de revisión.

## Vercel
Importa el repositorio en Vercel. La configuración incluida selecciona la compilación y carpeta correctas. Vercel puede publicar la demo estática desde este punto.

## Cuenta de Aarón
El administrador reservado es **acascog01@educarex.es**. `api/admin-session.mjs` comprueba el token con Supabase, exige correo confirmado y compara el correo en el servidor. No concede privilegios por escribir ese correo en la demo ni por modificar el navegador.

Para activar cuentas reales hay que conectar un proyecto Supabase (URL y clave pública en las variables de Vercel), registro/inicio de sesión del frontend y base de datos compartida con reglas de acceso. El verificador está preparado; la demo actual conserva perfiles, compras y clasificación en este navegador. No existe todavía una cuenta real vinculada ni administración compartida. El panel local sigue siendo una herramienta de revisión y no se publica abierto.

Las operaciones de premios, cambios de temporada y bloqueo deberán comprobar este permiso en el servidor antes de escribir en la base de datos. No deben confiar en el rol del frontend. Las notificaciones push necesitan también almacenamiento persistente y programación en el servidor; la demo estática no los sustituye.
