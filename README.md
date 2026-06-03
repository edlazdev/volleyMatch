# 🏐 Volley Match

Aplicación web **mobile first** para formar **equipos de vóley equilibrados** según el nivel de los participantes. Registra jugadores, asígnales un nivel y genera automáticamente equipos balanceados con drag & drop, métricas en tiempo real y calendario de enfrentamientos.

## ✨ Características

- **Configuración flexible**: 2 a 5 equipos (6 jugadores por equipo).
- **Algoritmo de balance**: agrupa por nivel, mezcla y reparte en serpentina para equipos parejos.
- **Métricas por equipo**: nivel promedio, nivel total y conteo de jugadores.
- **Indicador de equilibrio** y **sugerencias automáticas de intercambio**.
- **Drag & Drop** (mouse, touch, tablet y teclado) con [dnd-kit](https://dndkit.com).
- **Enfrentamientos** generados automáticamente (round robin).
- **Modo claro / oscuro**.
- **Persistencia automática** en LocalStorage (jugadores, equipos y configuración).

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
│   ├── ui/          # Botones, inputs, cards, badges reutilizables
│   └── dnd/         # Piezas de drag & drop
├── pages/           # ConfigPage, TeamsPage, MatchesPage
├── layouts/         # AppLayout (header, navegación, footer)
├── hooks/           # useTheme, useTeamData, useTeamDnD
├── store/           # Store Zustand + persistencia
├── services/        # Adaptador de LocalStorage
├── utils/           # Algoritmos de balance, matches, helpers
├── types/           # Tipos TypeScript del dominio
├── data/            # Catálogo de niveles y constantes
└── App.tsx
```

## 🧠 Lógica de balance

1. `groupPlayersByLevel()` — agrupa jugadores por nivel (de mayor a menor).
2. `shufflePlayers()` — mezcla aleatoria (Fisher–Yates).
3. `generateTeams()` — reparte en serpentina para equilibrar el nivel total.
4. `calculateTeamMetrics()` — promedio, total y conteo por equipo.
5. `getBalanceSuggestions()` — propone intercambios que reducen la diferencia.
6. `generateMatches()` — round robin de enfrentamientos.

## 📊 Niveles

| Nivel | Descripción      |
| ----- | ---------------- |
| 1     | Principiante     |
| 2     | Básico           |
| 3     | Intermedio       |
| 4     | Intermedio Alto  |
| 5     | Avanzado         |
| 6     | Competitivo      |
