/**
 * import_updates_csv.js
 * Importe les updates depuis le CSV Calendula vers Firebase.
 *
 * Usage :
 *   node import_updates_csv.js updates.csv
 *
 * Prérequis :
 *   npm install firebase-admin
 *   Fichier serviceAccountKey.json dans le même dossier
 *   (Firebase Console → Paramètres → Comptes de service → Générer une clé)
 */

const fs   = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// ── Config ─────────────────────────────────────────────────────────────────
const CSV_FILE        = process.argv[2] || 'updates.csv';
const SERVICE_ACCOUNT = path.join(__dirname, 'serviceAccountKey.json');

// Mapping emoji non-standard → emoji app
const MOOD_MAP = {
  '😊': '😊', '🙂': '🙂', '😐': '😐', '😕': '😕', '😩': '😩',
  '😞': '😕',   // emoji absent du barème → on l'arrondit à 😕
};

// ── Init Firebase ───────────────────────────────────────────────────────────
if (!fs.existsSync(SERVICE_ACCOUNT)) {
  console.error('❌  serviceAccountKey.json introuvable.');
  process.exit(1);
}
admin.initializeApp({
  credential: admin.credential.cert(require(SERVICE_ACCOUNT)),
  projectId: 'okr-oe',
});
const db = admin.firestore();

// ── Helpers ─────────────────────────────────────────────────────────────────

/** "DD/MM/YYYY" → timestamp ms (midi UTC pour éviter les décalages TZ) */
function dateToTs(str) {
  if (!str || !str.trim()) return Date.now();
  str = str.trim();
  // Format DD/MM/YYYY
  const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    return new Date(`${y}-${mo.padStart(2,'0')}-${d.padStart(2,'0')}T12:00:00Z`).getTime();
  }
  // Format YYYY-MM-DD (au cas où)
  const ts = Date.parse(str);
  return isNaN(ts) ? Date.now() : ts;
}

/** "2026-W3" → "2026-W03" */
function normalizeWeekKey(wk) {
  return wk.replace(/-W(\d)$/, '-W0$1');
}

/** Parse CSV simple (gère les guillemets et sauts de ligne dans les cellules) */
function parseCSV(text) {
  const rows = [];
  let header = null;
  let inQuote = false;
  let cell = '';
  let row = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuote) {
      if (ch === '"' && next === '"') { cell += '"'; i++; }
      else if (ch === '"') { inQuote = false; }
      else { cell += ch; }
    } else {
      if (ch === '"') { inQuote = true; }
      else if (ch === ',') { row.push(cell.trim()); cell = ''; }
      else if (ch === '\n' || (ch === '\r' && next === '\n')) {
        if (ch === '\r') i++;
        row.push(cell.trim()); cell = '';
        if (!header) { header = row; }
        else if (row.length >= 2) {
          const obj = {};
          header.forEach((h, idx) => { obj[h] = row[idx] ?? ''; });
          rows.push(obj);
        }
        row = [];
      } else { cell += ch; }
    }
  }
  // Dernière ligne sans \n
  if (cell || row.length) {
    row.push(cell.trim());
    if (header && row.length >= 2) {
      const obj = {};
      header.forEach((h, idx) => { obj[h] = row[idx] ?? ''; });
      rows.push(obj);
    }
  }
  return rows;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function run() {
  const text = fs.readFileSync(CSV_FILE, 'utf-8').replace(/^\uFEFF/, ''); // strip BOM
  const rows = parseCSV(text);
  console.log(`📋 ${rows.length} lignes lues depuis ${CSV_FILE}\n`);

  let ok = 0, skip = 0, err = 0;

  for (const row of rows) {
    const email   = (row.email   || '').trim().toLowerCase();
    const weekKey = normalizeWeekKey((row.weekKey || '').trim());

    if (!email || !weekKey || !/^\d{4}-W\d{2}$/.test(weekKey)) {
      console.warn(`⚠️  Ignoré (email/weekKey invalide):`, { email, weekKey });
      skip++; continue;
    }

    const submittedAt = dateToTs(row.submittedAt);

    // Construire answers
    const answers = {};
    for (let i = 1; i <= 8; i++) {
      const val = (row[`q${i}`] || '').trim();
      if (val) {
        answers[`q${i}`] = i === 7 ? (MOOD_MAP[val] || val) : val;
      }
    }

    const docId = `${email}_${weekKey}`;
    const data  = {
      email,
      prenom:      (row.prenom || '').trim(),
      weekKey,
      submittedAt,
      answers,
      locked:      false,
    };

    try {
      await db.collection('updates').doc(docId).set(data);
      console.log(`✅  ${docId}  (${new Date(submittedAt).toLocaleDateString('fr-FR')})`);
      ok++;
    } catch (e) {
      console.error(`❌  ${docId} :`, e.message);
      err++;
    }
  }

  console.log(`\n📊  ${ok} importés · ${skip} ignorés · ${err} erreurs`);
  process.exit(err > 0 ? 1 : 0);
}

run();
