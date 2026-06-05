// Generador temporal de mockups (SVG -> PNG) para docs/screenshots.
// Uso: npm i -D @resvg/resvg-js && node scripts/gen-mockups.mjs
import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const OUT = ['docs/screenshots', 'public/screenshots'];
for (const d of OUT) fs.mkdirSync(d, { recursive: true });

const FONT = 'Inter, system-ui, Segoe UI, Roboto, sans-serif';
const LV = {
  A: ['#fecdd3', '#9f1239'], B: ['#fed7aa', '#9a3412'], C: ['#fde68a', '#92400e'],
  D: ['#99f6e4', '#115e59'], E: ['#bae6fd', '#075985'], F: ['#e2e8f0', '#334155'],
};
const ACCENTS = [['#327dff', '#38bdf8'], ['#8b5cf6', '#d946ef'], ['#10b981', '#14b8a6'], ['#f59e0b', '#f97316']];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const r = (x, y, w, h, rx, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const tx = (x, y, s, size, fill, weight = 600, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;

function theme(dark) {
  return dark
    ? { bg: '#020617', card: '#0f172a', border: '#1e293b', text: '#f1f5f9', sub: '#94a3b8', soft: '#1e293b' }
    : { bg: '#f8fafc', card: '#ffffff', border: '#e2e8f0', text: '#0f172a', sub: '#64748b', soft: '#f1f5f9' };
}

function header(t, w) {
  return `
  ${r(0, 0, w, 64, 0, t.card)}
  ${r(24, 16, 32, 32, 10, '#1b5cf5')}
  <g transform="translate(31,23)" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="9" r="8.5"/><path d="M9 .5a12 12 0 0 0 0 17 12 12 0 0 0 0-17"/><path d="M.5 9h17"/></g>
  ${tx(66, 38, 'VolleyMatch', 17, t.text, 800)}
  ${r(w - 150, 16, 56, 32, 10, t.soft)}${tx(w - 122, 37, 'ES', 13, t.sub, 700, 'middle')}
  ${r(w - 84, 16, 32, 32, 10, t.soft)}
  ${r(0, 63, w, 1, 0, t.border)}`;
}

function levelBadge(x, y, letter) {
  const [bg, fg] = LV[letter];
  return `${r(x, y, 26, 20, 7, bg)}${tx(x + 13, y + 14, letter, 12, fg, 800, 'middle')}`;
}

function frame(w, h, dark, inner) {
  const t = theme(dark);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="${FONT}">
  ${r(0, 0, w, h, 0, t.bg)}${header(t, w)}${inner(t)}</svg>`;
}

// ---------- TEAMS ----------
function teams(dark = false) {
  const w = 1280, h = 860;
  return frame(w, h, dark, (t) => {
    let s = '';
    s += tx(40, 110, dark ? 'Equipos generados' : 'Equipos generados', 24, t.text, 800);
    s += r(w - 280, 90, 110, 34, 10, t.soft) + tx(w - 225, 112, 'Reiniciar', 12, t.sub, 700, 'middle');
    s += r(w - 160, 90, 120, 34, 10, '#1b5cf5') + tx(w - 100, 112, 'Regenerar', 12, '#fff', 700, 'middle');
    // balance indicator
    s += r(40, 140, w - 80, 64, 16, t.card, `stroke="${t.border}"`);
    s += r(56, 156, 32, 32, 9, t.soft) + tx(72, 178, '⚖', 16, '#10b981', 700, 'middle');
    s += tx(100, 168, 'Buen equilibrio', 14, '#10b981', 700);
    s += tx(100, 188, 'Diferencia de nivel total: 2', 12, t.sub, 500);
    s += r(w - 320, 168, 264, 8, 4, t.soft) + r(w - 320, 168, 185, 8, 4, '#327dff');
    // team cards
    const names = ['Equipo 1', 'Equipo 2', 'Equipo 3'];
    const rosters = [
      [['Giorgino', 'A'], ['Ricky', 'B'], ['Kathy', 'C'], ['Anasely', 'D'], ['Maria', 'E'], ['Gilda', 'F']],
      [['Denilson', 'A'], ['Carlos', 'B'], ['karina', 'C'], ['Karol', 'D'], ['Luz', 'E'], ['Danixa', 'F']],
      [['Alex', 'A'], ['Paolo', 'B'], ['Samantha', 'C'], ['Leydi', 'D'], ['Helen', 'E'], ['Kiana', 'F']],
    ];
    const cw = 386, gap = 24, x0 = 40, y0 = 232;
    names.forEach((nm, i) => {
      const x = x0 + i * (cw + gap);
      const [c1, c2] = ACCENTS[i];
      s += `<defs><linearGradient id="g${i}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>`;
      s += r(x, y0, cw, 540, 16, t.card, `stroke="${t.border}"`);
      s += `<path d="M${x},${y0 + 16} q0,-16 16,-16 h${cw - 32} q16,0 16,16 v74 h-${cw} z" fill="url(#g${i})"/>`;
      s += tx(x + 18, y0 + 32, nm, 16, '#fff', 800);
      ['Prom 3.5', 'Total 21', 'Jug 6/6'].forEach((m, k) => {
        const mx = x + 14 + k * ((cw - 28) / 3);
        s += r(mx, y0 + 46, (cw - 28) / 3 - 8, 30, 8, '#ffffff', 'fill-opacity="0.18"') + tx(mx + ((cw - 28) / 3 - 8) / 2, y0 + 66, m, 12, '#fff', 700, 'middle');
      });
      rosters[i].forEach(([pn, lv], k) => {
        const ry = y0 + 96 + k * 70;
        s += r(x + 14, ry, cw - 28, 56, 12, t.bg, `stroke="${t.border}"`);
        s += tx(x + 28, ry + 34, pn, 14, t.text, 600);
        s += levelBadge(x + cw - 86, ry + 18, lv);
        s += tx(x + cw - 42, ry + 35, '⇄', 16, t.sub, 700, 'middle');
      });
    });
    return s;
  });
}

// ---------- CONFIG ----------
function config(dark = false, w = 1280) {
  const h = 900;
  return frame(w, h, dark, (t) => {
    let s = '';
    const cardW = w - 80;
    // teams count
    s += r(40, 92, cardW, 120, 16, t.card, `stroke="${t.border}"`);
    s += tx(60, 124, 'Cantidad de equipos', 15, t.text, 800);
    s += tx(60, 146, 'Hasta 6 jugadores por equipo (pueden ser menos, pero parejos).', 12, t.sub, 500);
    s += r(w - 150, 104, 90, 26, 13, '#eef6ff') + tx(w - 105, 121, 'máx. 18', 12, '#1b5cf5', 800, 'middle');
    s += r(60, 160, cardW - 40, 40, 12, t.soft);
    s += r(66, 166, 44, 28, 8, t.card) + tx(88, 185, '–', 18, t.text, 800, 'middle');
    s += tx(w / 2, 186, '3 equipos', 18, t.text, 800, 'middle');
    s += r(w - 110, 166, 44, 28, 8, t.card) + tx(w - 88, 185, '+', 18, t.text, 800, 'middle');
    // arma tu lista
    s += r(40, 228, cardW, 96, 16, t.card, `stroke="${t.border}"`);
    s += tx(60, 258, 'Arma tu lista', 15, t.text, 800);
    ['Elegir participantes', 'Editar lista por defecto', 'Importar lista'].forEach((b, i) => {
      const bx = 60 + i * 250;
      const prim = i === 0;
      s += r(bx, 274, 232, 34, 10, prim ? '#1b5cf5' : t.soft) + tx(bx + 116, 296, b, 12, prim ? '#fff' : t.text, 700, 'middle');
    });
    // counter + progress
    s += r(40, 340, cardW, 92, 16, t.card, `stroke="${t.border}"`);
    s += tx(60, 372, 'Jugadores registrados', 14, t.text, 700);
    s += tx(w - 60, 372, '18 / 18', 14, t.text, 800, 'end');
    s += r(60, 386, cardW - 40, 8, 4, t.soft) + r(60, 386, cardW - 40, 8, 4, '#10b981');
    s += tx(60, 418, '¡Listo! 6 jugadores por equipo en 3 equipos.', 12, '#10b981', 600);
    // distribution
    s += r(40, 448, cardW, 150, 16, t.card, `stroke="${t.border}"`);
    s += tx(60, 478, 'Distribución por nivel · toca un nivel para filtrar', 13, t.sub, 600);
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach((lv, i) => {
      const bw = (cardW - 40 - 50) / 6;
      const bx = 60 + i * (bw + 10);
      const [bg, fg] = LV[lv];
      s += r(bx, 494, bw, 86, 14, t.bg, `stroke="${t.border}"`);
      s += r(bx + bw / 2 - 13, 506, 26, 22, 8, bg) + tx(bx + bw / 2, 522, lv, 12, fg, 800, 'middle');
      s += tx(bx + bw / 2, 556, '3', 22, t.text, 800, 'middle');
      s += tx(bx + bw / 2, 574, ['Competitivo','Avanzado','Int. Alto','Intermedio','Básico','Principiante'][i], 8.5, t.sub, 600, 'middle');
    });
    // CTA
    s += r(40, h - 78, cardW, 50, 14, '#1b5cf5') + tx(w / 2, h - 47, '✨  Generar equipos equilibrados', 16, '#fff', 800, 'middle');
    return s;
  });
}

// ---------- MATCHES (round robin) ----------
function matches(dark = false) {
  const w = 1280, h = 720;
  return frame(w, h, dark, (t) => {
    let s = '';
    s += tx(40, 110, 'Enfrentamientos', 24, t.text, 800);
    s += tx(40, 134, 'Todos contra todos · 3 partidos', 12, t.sub, 500);
    s += r(40, 152, w - 80, 44, 12, t.soft);
    s += r(46, 158, (w - 92) / 2, 32, 9, t.card) + tx(46 + (w - 92) / 4, 179, 'Todos contra todos', 13, '#1b5cf5', 800, 'middle');
    s += tx(46 + (w - 92) * 0.75, 179, 'Llaves (eliminación)', 13, t.sub, 600, 'middle');
    const pairs = [['Equipo 1', 'Equipo 2'], ['Equipo 1', 'Equipo 3'], ['Equipo 2', 'Equipo 3']];
    pairs.forEach(([a, b], i) => {
      const y = 220 + i * 90;
      s += r(40, y, w - 80, 72, 16, t.card, `stroke="${t.border}"`);
      s += `<circle cx="70" cy="${y + 36}" r="6" fill="#327dff"/>`;
      s += tx(330, y + 33, a, 16, t.text, 800, 'end');
      s += tx(330, y + 52, 'Prom. 3.5', 11, t.sub, 500, 'end');
      s += r(w / 2 - 26, y + 22, 52, 28, 9, dark ? '#fff' : '#0f172a') + tx(w / 2, y + 41, 'VS', 13, dark ? '#0f172a' : '#fff', 800, 'middle');
      s += tx(w - 330, y + 33, b, 16, t.text, 800, 'start');
      s += tx(w - 330, y + 52, 'Prom. 3.3', 11, t.sub, 500, 'start');
      s += `<circle cx="${w - 70}" cy="${y + 36}" r="6" fill="#10b981"/>`;
    });
    return s;
  });
}

// ---------- BRACKET ----------
function bracket(dark = false) {
  const w = 1280, h = 720;
  return frame(w, h, dark, (t) => {
    let s = '';
    s += tx(40, 110, 'Enfrentamientos', 24, t.text, 800);
    s += tx(40, 134, 'Llave de eliminación hasta la copa', 12, t.sub, 500);
    s += r(40, 152, w - 80, 44, 12, t.soft);
    s += tx(46 + (w - 92) / 4, 179, 'Todos contra todos', 13, t.sub, 600, 'middle');
    s += r(46 + (w - 92) / 2, 158, (w - 92) / 2, 32, 9, t.card) + tx(46 + (w - 92) * 0.75, 179, 'Llaves (eliminación)', 13, '#1b5cf5', 800, 'middle');
    const cols = [
      { title: 'Cuartos de final', n: 4 },
      { title: 'Semifinales', n: 2 },
      { title: 'Final', n: 1 },
    ];
    const colW = 250, x0 = 50, top = 230, areaH = 420;
    cols.forEach((c, ci) => {
      const x = x0 + ci * (colW + 30);
      s += tx(x + colW / 2, top - 12, c.title, 12, t.sub, 800, 'middle');
      for (let k = 0; k < c.n; k++) {
        const slot = areaH / c.n;
        const y = top + k * slot + slot / 2 - 34;
        s += r(x, y, colW, 68, 12, t.card, `stroke="${t.border}"`);
        const win = (ci >= 1 && k === 0) || ci === 2;
        s += r(x, y, colW, 33, 12, ci === 0 ? t.bg : (win ? '#ecfdf5' : t.bg));
        s += tx(x + 14, y + 21, ci === 0 ? `Equipo ${k * 2 + 1}` : (win ? 'Equipo 1' : 'Equipo ?'), 12, win ? '#047857' : t.text, win ? 800 : 600);
        s += tx(x + 14, y + 54, ci === 0 ? `Equipo ${k * 2 + 2}` : 'Equipo ?', 12, t.text, 600);
        s += r(x, y + 34, colW, 1, 0, t.border);
      }
    });
    // champion
    const cx = x0 + 3 * (colW + 30);
    s += tx(cx + 110, top - 12, 'Campeón', 12, '#f59e0b', 800, 'middle');
    s += r(cx, top + areaH / 2 - 70, 220, 140, 18, dark ? '#1c1407' : '#fffbeb', `stroke="#f59e0b" stroke-width="2"`);
    s += `<circle cx="${cx + 110}" cy="${top + areaH / 2 - 26}" r="26" fill="#f59e0b"/>`;
    s += tx(cx + 110, top + areaH / 2 - 18, '🏆', 24, '#fff', 700, 'middle');
    s += tx(cx + 110, top + areaH / 2 + 22, '¡Campeón!', 11, '#b45309', 800, 'middle');
    s += tx(cx + 110, top + areaH / 2 + 44, 'Equipo 1', 16, t.text, 800, 'middle');
    return s;
  });
}

const jobs = [
  ['config.png', config(false)],
  ['teams.png', teams(false)],
  ['matches-rr.png', matches(false)],
  ['bracket.png', bracket(false)],
  ['dark.png', teams(true)],
  ['mobile.png', config(false, 430)],
];

for (const [name, svg] of jobs) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: name === 'mobile.png' ? 430 : 1280 }, font: { loadSystemFonts: true } }).render().asPng();
  for (const d of OUT) fs.writeFileSync(`${d}/${name}`, png);
  console.log('✓', name, png.length, 'bytes');
}
