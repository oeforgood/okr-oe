/**
 * import_updates_csv2.js  — version sans firebase-admin
 * Utilise le SDK Firebase Web via fetch direct sur l'API REST Firestore.
 *
 * Usage :
 *   node import_updates_csv2.js updates.csv
 *
 * Prérequis : aucune dépendance npm supplémentaire (utilise fetch natif de Node 18+)
 *
 * ⚠️  Remplacez FIREBASE_TOKEN ci-dessous par votre token d'accès.
 *     Pour l'obtenir : dans le terminal, lancez d'abord :
 *       npx firebase login
 *       npx firebase-tools login:ci
 *     Copiez le token affiché et collez-le ci-dessous.
 */

// ── À REMPLIR ───────────────────────────────────────────────────────────────
// Option A : coller directement votre clé API Web (pas la clé privée Admin)
// Elle est visible dans Firebase Console → Paramètres → Général → Votre application Web
const API_KEY     = 'AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM';  // déjà dans App.js !
const PROJECT_ID  = 'okr-oe';
// ────────────────────────────────────────────────────────────────────────────

const fs = require('fs');

const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const MOOD_MAP = {
  '😊':'😊','🙂':'🙂','😐':'😐','😕':'😕','😩':'😩',
  '😞':'😕',
};

function dateToTs(str) {
  if (!str || !str.trim()) return Date.now();
  str = str.trim();
  const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    return new Date(`${y}-${mo.padStart(2,'0')}-${d.padStart(2,'0')}T12:00:00Z`).getTime();
  }
  const ts = Date.parse(str);
  return isNaN(ts) ? Date.now() : ts;
}

function normalizeWeekKey(wk) {
  return wk.replace(/-W(\d)$/, '-W0$1');
}

function parseCSV(text) {
  const rows = [];
  let header = null, inQuote = false, cell = '', row = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i+1];
    if (inQuote) {
      if (ch==='"'&&next==='"'){cell+='"';i++;}
      else if(ch==='"'){inQuote=false;}
      else{cell+=ch;}
    } else {
      if(ch==='"'){inQuote=true;}
      else if(ch===','){row.push(cell.trim());cell='';}
      else if(ch==='\n'||(ch==='\r'&&next==='\n')){
        if(ch==='\r')i++;
        row.push(cell.trim());cell='';
        if(!header){header=row;}
        else if(row.length>=2){
          const obj={};
          header.forEach((h,idx)=>{obj[h]=row[idx]??'';});
          rows.push(obj);
        }
        row=[];
      } else{cell+=ch;}
    }
  }
  if(cell||row.length){
    row.push(cell.trim());
    if(header&&row.length>=2){
      const obj={};
      header.forEach((h,idx)=>{obj[h]=row[idx]??'';});
      rows.push(obj);
    }
  }
  return rows;
}

// Convertit un objet JS en document Firestore (format REST)
function toFirestore(obj) {
  function convertVal(v) {
    if (v === null || v === undefined) return {nullValue: null};
    if (typeof v === 'boolean') return {booleanValue: v};
    if (typeof v === 'number') return Number.isInteger(v) ? {integerValue: String(v)} : {doubleValue: v};
    if (typeof v === 'string') return {stringValue: v};
    if (typeof v === 'object') {
      const fields = {};
      for (const [k, val] of Object.entries(v)) fields[k] = convertVal(val);
      return {mapValue: {fields}};
    }
    return {stringValue: String(v)};
  }
  const fields = {};
  for (const [k, v] of Object.entries(obj)) fields[k] = convertVal(v);
  return {fields};
}

async function upsertDoc(collection, docId, data) {
  const url = `${BASE_URL}/${collection}/${docId}?key=${API_KEY}`;
  const body = JSON.stringify(toFirestore(data));
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err.slice(0,200)}`);
  }
}

async function run() {
  const CSV_FILE = process.argv[2] || 'updates.csv';
  const text = fs.readFileSync(CSV_FILE, 'utf-8').replace(/^\uFEFF/,'');
  const rows = parseCSV(text);
  console.log(`📋 ${rows.length} lignes lues\n`);

  let ok=0, skip=0, err=0;
  for (const row of rows) {
    const email   = (row.email||'').trim().toLowerCase();
    const weekKey = normalizeWeekKey((row.weekKey||'').trim());
    if (!email || !/^\d{4}-W\d{2}$/.test(weekKey)) {
      console.warn(`⚠️  Ignoré: email="${email}" weekKey="${weekKey}"`);
      skip++; continue;
    }
    const submittedAt = dateToTs(row.submittedAt);
    const answers = {};
    for (let i=1;i<=8;i++){
      const val=(row[`q${i}`]||'').trim();
      if(val) answers[`q${i}`] = i===7 ? (MOOD_MAP[val]||val) : val;
    }
    const docId = `${email}_${weekKey}`;
    const data  = {email, prenom:(row.prenom||'').trim(), weekKey, submittedAt, answers, locked:false};
    try {
      await upsertDoc('updates', docId, data);
      console.log(`✅  ${docId}`);
      ok++;
    } catch(e) {
      console.error(`❌  ${docId}: ${e.message}`);
      err++;
    }
  }
  console.log(`\n📊  ${ok} importés · ${skip} ignorés · ${err} erreurs`);
}

run();
