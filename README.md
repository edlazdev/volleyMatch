# 🏐 Volley Match

Aplicación web **mobile first** para formar **equipos de vóley equilibrados** según el nivel de los participantes. Registra jugadores, asígnales un nivel y genera automáticamente equipos balanceados con drag & drop, métricas en tiempo real y calendario de enfrentamientos.

## ✨ Características

- **Configuración flexible**: 2 a 16 equipos (6 jugadores por equipo) — ideal para torneos.
- **Modo torneo**: enfrentamientos en **todos contra todos** o **llaves de eliminación** con avance hasta el **campeón 🏆** (siembra por nivel y byes automáticos).
- **Niveles con temática de pollito 🐤**: el nivel se representa con esa cantidad de pollitos (1 = 🐤 … 6 = 🐤🐤🐤🐤🐤🐤). El nombre del nivel aparece como tooltip.
- **Arma tu lista** de varias formas:
  - **Elegir participantes** desde un pozo con checkboxes (avisa si faltan para el cupo).
  - **Editar lista por defecto** (CRUD): agregar, editar, eliminar, vaciar (con confirmación) y restaurar.
  - **Importar lista** pegando texto (p. ej. del grupo de WhatsApp): detecta nombres y niveles.
  - **Agregar jugador** a mano.
  - **Añadir a lista por defecto** los jugadores actuales (fusión sin duplicar ni borrar).
- **Algoritmo de balance**: agrupa por nivel, mezcla y reparte en serpentina para equipos parejos.
- **Métricas por equipo**: nivel promedio, nivel total y conteo de jugadores.
- **Indicador de equilibrio** y **sugerencias automáticas de intercambio**.
- **Distribución por nivel** con tarjetas-contador que además **filtran** la lista al tocarlas.
- **Drag & Drop** (mouse, touch, tablet y teclado) con [dnd-kit](https://dndkit.com).
- **Enfrentamientos** generados automáticamente (round robin).
- **Layout responsive**: la lista de jugadores pasa a 2 columnas en tablet/desktop.
- **Modo claro / oscuro**.
- **Persistencia automática** en LocalStorage (jugadores, equipos, configuración y lista por defecto).

## 🧱 Stack

React 18 · TypeScript (estricto) · Vite · Tailwind CSS · Zustand · React Hook Form · dnd-kit · Lucide React.

## 🚀 Cómo ejecutar

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

### Otros scripts

```bash
npm run build     # Compila TypeScript y genera el build de producción
npm run preview   # Sirve el build de producción localmente
npm run lint      # Chequeo de tipos (tsc --noEmit)
```

## 🗂️ Arquitectura

```text
src/
├── components/      # Componentes (UI + dominio + dnd)
│   ├── ui/          # Button, Card, Input, Select, Modal, badges…
│   └── dnd/         # Piezas de drag & drop
├── pages/           # ConfigPage, TeamsPage, MatchesPage
├── layouts/         # AppLayout (header, navegación, footer)
├── hooks/           # useTheme, useTeamData, useTeamDnD
├── store/           # Store Zustand + persistencia
├── services/        # Adaptador de LocalStorage
├── utils/           # Algoritmos de balance, matches, parseo, helpers
├── types/           # Tipos TypeScript del dominio
├── data/            # Catálogo de niveles, roster de fábrica, constantes
└── App.tsx
```

## 🧠 Lógica de balance

1. `groupPlayersByLevel()` — agrupa por nivel (de mayor a menor jerarquía: menor número primero).
2. `shufflePlayers()` — mezcla aleatoria (Fisher–Yates).
3. `generateTeams()` — reparte en serpentina para equilibrar el nivel total.
4. `calculateTeamMetrics()` — promedio, total y conteo por equipo.
5. `getBalanceSuggestions()` — propone intercambios que reducen la diferencia.
6. `generateMatches()` — round robin de enfrentamientos.
7. `buildBracket()` — llave de eliminación simple (siembra por fuerza + byes); `setBracketWinner()` avanza ganadores hasta la copa.

## 🐤 Niveles

> Escala invertida: **1 es el nivel más alto** y 6 el más bajo. El nivel se muestra como esa cantidad de pollitos.

| Nivel | Pollitos          | Descripción      |
| ----- | ----------------- | ---------------- |
| 1     | 🐤                | Competitivo      |
| 2     | 🐤🐤              | Avanzado         |
| 3     | 🐤🐤🐤            | Intermedio Alto  |
| 4     | 🐤🐤🐤🐤          | Intermedio       |
| 5     | 🐤🐤🐤🐤🐤        | Básico           |
| 6     | 🐤🐤🐤🐤🐤🐤      | Principiante     |

## 🔄 Lista por defecto (pozo) vs. participantes

Son **dos listas independientes**:

- **Lista por defecto (pozo)**: tu plantel maestro, editable en *Editar lista por defecto* y persistido.
  - Si nunca la personalizas, se usa una lista de fábrica.
  - Si la vacías (con confirmación), se respeta vacía al refrescar.
  - *Añadir a lista por defecto* fusiona jugadores nuevos sin borrar a nadie.
- **Participantes** (*Jugadores registrados*): quiénes juegan hoy (máximo `equipos × 6`), elegidos del pozo, importados o agregados a mano.

## 🧭 Flujo recomendado

1. Elige la **cantidad de equipos**.
2. **Arma tu lista**: *Elegir participantes* (o *Importar* / *Agregar*).
3. Ajusta niveles y revisa la **distribución por nivel**.
4. **Genera los equipos** equilibrados y reorganiza con **drag & drop**.
5. Mira los **enfrentamientos** (round robin).

---

Hecho por [edlazdev](https://github.com/edlazdev).
