# 📸 Capturas de pantalla

Esta carpeta contiene las capturas usadas en el `README` y la landing estática
(`public/landing.html`). Como el entorno de desarrollo no tiene un navegador
headless para automatizarlas, se capturan **manualmente** (toma ~2 minutos).

## Cómo capturar

1. Levanta la app:
   ```bash
   npm run dev
   ```
2. Abre la URL en el navegador (Chrome recomendado).
3. Toma cada captura y guárdala en esta carpeta con el nombre indicado.
4. (Opcional) Copia las mismas a `public/screenshots/` para que la landing
   estática (`/landing.html`) las muestre.

> Tip: para capturas “limpias” usa el modo dispositivo de DevTools (F12 →
> ícono de móvil). Desktop: ancho ~1280px. Móvil: 390×844 (iPhone 12).

## Archivos esperados

| Archivo | Pantalla / estado | Tamaño sugerido |
| --- | --- | --- |
| `landing.png` | Pantalla de bienvenida (hero + features) | Desktop 1280px |
| `config.png` | Configuración: equipos, lista, distribución por nivel | Desktop |
| `teams.png` | Equipos generados + indicador de equilibrio + sugerencias | Desktop |
| `matches-rr.png` | Enfrentamientos · Todos contra todos | Desktop |
| `bracket.png` | Llaves (eliminación) con campeón 🏆 | Desktop |
| `dark.png` | Cualquier pantalla en **modo oscuro** | Desktop |
| `mobile.png` | Configuración o equipos en **móvil** | 390×844 |

## Datos de demo rápidos

En **Configuración** pulsa **“Elegir participantes”** y usa la lista de fábrica
(o **“Cargar ejemplo”**) para tener jugadores al instante, elige 2–4 equipos y
**“Generar equipos equilibrados”**. Para la llave, ve a *Enfrentamientos* →
*Llaves (eliminación)* y marca ganadores hasta la final.
