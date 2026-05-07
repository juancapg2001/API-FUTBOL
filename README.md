Aquí tienes el contenido del README.md en formato de texto estándar ("normal") para que solo tengas que copiar y pegar. He mantenido los iconos y la estructura limpia para que se vea profesional en GitHub o cualquier otro lector de Markdown.

🏅 PLAYER CARD
La enciclopedia visual definitiva del deporte
Este proyecto es una aplicación web moderna diseñada para entusiastas del deporte. Permite buscar cualquier jugador del mundo y visualizar una ficha técnica interactiva que adapta su diseño visual según el protagonista.

🚀 Características Principales
🎨 Dynamic Theming (Color Automático)
La interfaz no es estática. Gracias a la Canvas API, el sistema analiza la fotografía del jugador en tiempo real, extrae el color dominante y reconfigura las variables de CSS (--player-accent). Esto hace que los botones, anillos y detalles cambien para combinar con el equipo o uniforme del jugador.

🌍 Biografía Inteligente ES/EN
El sistema de datos prioriza el contenido en español (strDescriptionES). Si la traducción no existe en la API, conmuta automáticamente a la versión en inglés (strDescriptionEN), indicando siempre al usuario el idioma que está leyendo.

🏆 Gestión Completa de Datos
Hero Section: Nombre, deporte, edad, nacionalidad y posición.

Bio: Datos técnicos como altura, peso, lugar de nacimiento y dorsal.

Trofeos: Listado de honores ganados agrupados por importancia.

Historial: Línea de tiempo visual (Timeline) con todos los clubes anteriores del deportista.

🛠️ Tecnologías Utilizadas
HTML5: Estructura semántica.

CSS3: Neobrutalismo suave, animaciones cubic-bezier y diseño responsivo.

JavaScript (ES6+): Consumo de API REST, promesas y procesamiento de imágenes.

API: TheSportsDB (v1).

📸 Estructura del Código
El proyecto se divide en tres pilares fundamentales:

index.html: Contiene el buscador y las secciones de la ficha (Bio, Trofeos, Historial) organizadas por pestañas.

style.css: Define la identidad visual, incluyendo el fondo animado con orbes y las animaciones de entrada (popIn).

app.js: Gestiona los 3 flujos de datos:

Búsqueda de jugador (searchplayers.php).

Consulta de honores (lookuphonours.php).

Historial de equipos (lookupformerteams.php).

📥 Instalación
Clona este repositorio o descarga los archivos.

Abre el archivo index.html en tu navegador.

Nota: Debido a que el sistema de color dinámico lee datos de píxeles de una imagen externa, es recomendable usar un servidor local (como Live Server en VS Code) para evitar posibles bloqueos de CORS en algunos navegadores.

👨‍💻 Autor
[Juan Carlos Pavón Godoy]
Desarrollador Web & Fanático del Deporte
