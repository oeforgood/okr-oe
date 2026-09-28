#!/usr/bin/env node
// backup_okr.js - Gestion des backups OKR Calendula
// Usage:
//   node backup_okr.js              → backup manuel local
//   node backup_okr.js list         → liste les backups locaux
//   node backup_okr.js list-firebase → liste les backups Firebase avec diff
//   node backup_okr.js restore [fichier]          → restaure un backup local
//   node backup_okr.js restore-firebase [backupId] → restaure un backup Firebase

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit, deleteDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

const app = initializeApp({
  apiKey: "AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM",
  authDomain: "okr-oe.firebaseapp.com",
  projectId: "okr-oe",
});
const db = getFirestore(app);
const BACKUP_DIR = './okr_backups';
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR);

function summarize(data) {
  const result = {};
  Object.entries(data.allSeasons || {}).forEach(([season, s]) => {
    result[season] = {
      obj: s.objectives?.length || 0,
      sobj: s.subobjectives?.length || 0,
      kr: s.keyresults?.length || 0,
    };
  });
  return result;
}

function diffDetail(prevData, currData) {
  const lines = [];
  const seasons = new Set([
    ...Object.keys(prevData.allSeasons||{}),
    ...Object.keys(currData.allSeasons||{})
  ]);
  
  seasons.forEach(season => {
    const p = prevData.allSeasons?.[season] || {};
    const c = currData.allSeasons?.[season] || {};
    const seasonLines = [];
    
    // Sous-objectifs
    const pSobjs = new Map((p.subobjectives||[]).map(s=>[s.id, s.title]));
    const cSobjs = new Map((c.subobjectives||[]).map(s=>[s.id, s.title]));
    const addedSobjs = [...cSobjs.entries()].filter(([id])=>!pSobjs.has(id));
    const removedSobjs = [...pSobjs.entries()].filter(([id])=>!cSobjs.has(id));
    const renamedSobjs = [...cSobjs.entries()].filter(([id,title])=>pSobjs.has(id)&&pSobjs.get(id)!==title);
    
    addedSobjs.forEach(([id,t])=>seasonLines.push(`    ✅ Sobj ajouté: ${id} "${t}"`));
    removedSobjs.forEach(([id,t])=>seasonLines.push(`    ❌ Sobj supprimé: ${id} "${t}"`));
    renamedSobjs.forEach(([id,t])=>seasonLines.push(`    ✏️  Sobj renommé: ${id} "${pSobjs.get(id)}"→"${t}"`));
    
    // KRs
    const pKRs = new Map((p.keyresults||[]).map(k=>[k.id, k.title]));
    const cKRs = new Map((c.keyresults||[]).map(k=>[k.id, k.title]));
    const addedKRs = [...cKRs.entries()].filter(([id])=>!pKRs.has(id));
    const removedKRs = [...pKRs.entries()].filter(([id])=>!cKRs.has(id));
    const renamedKRs = [...cKRs.entries()].filter(([id,title])=>pKRs.has(id)&&pKRs.get(id)!==title);
    
    addedKRs.forEach(([id,t])=>seasonLines.push(`    ✅ KR ajouté: ${id} "${t}"`));
    removedKRs.forEach(([id,t])=>seasonLines.push(`    ❌ KR supprimé: ${id} "${t}"`));
    renamedKRs.forEach(([id,t])=>seasonLines.push(`    ✏️  KR renommé: ${id} "${pKRs.get(id)}"→"${t}"`));
    
    if (seasonLines.length > 0) {
      lines.push(`  [${season}]`);
      lines.push(...seasonLines);
    }
  });
  
  return lines.length > 0 ? lines.join('\n') : '  (aucun changement)';
}

function diff(prev, curr) {
  const lines = [];
  const seasons = new Set([...Object.keys(prev), ...Object.keys(curr)]);
  seasons.forEach(season => {
    const p = prev[season] || { obj: 0, sobj: 0, kr: 0 };
    const c = curr[season] || { obj: 0, sobj: 0, kr: 0 };
    const changes = [];
    if (p.obj !== c.obj) changes.push(`objectifs: ${p.obj}→${c.obj}`);
    if (p.sobj !== c.sobj) changes.push(`sous-obj: ${p.sobj}→${c.sobj}`);
    if (p.kr !== c.kr) changes.push(`KR: ${p.kr}→${c.kr}`);
    if (changes.length > 0) lines.push(`  ${season}: ${changes.join(', ')}`);
  });
  return lines.length > 0 ? lines.join('\n') : '  (aucun changement)';
}

async function backup() {
  const snap = await getDoc(doc(db, 'okr', 'data'));
  const data = snap.data();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `${BACKUP_DIR}/okr_${timestamp}.json`;
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  fs.writeFileSync(`${BACKUP_DIR}/latest.json`, JSON.stringify(data, null, 2));
  const summary = summarize(data);
  Object.entries(summary).forEach(([s, v]) => {
    console.log(`${s}: ${v.obj} obj, ${v.sobj} sobj, ${v.kr} KR`);
  });
  console.log(`\n✅ Backup local: ${filename}`);
  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.startsWith('okr_') && f.endsWith('.json')).sort().reverse();
  files.slice(20).forEach(f => fs.unlinkSync(`${BACKUP_DIR}/${f}`));
  process.exit(0);
}

function listLocal() {
  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.startsWith('okr_') && f.endsWith('.json')).sort().reverse();
  console.log(`\n=== BACKUPS LOCAUX (${files.length}) ===\n`);
  let prev = null;
  files.forEach(f => {
    const data = JSON.parse(fs.readFileSync(`${BACKUP_DIR}/${f}`, 'utf8'));
    const summary = summarize(data);
    const date = f.replace('okr_', '').replace('.json', '').replace('T', ' ').replace(/-(\d{2})-(\d{2})$/, 'h$1m$2');
    console.log(`📦 ${f}`);
    Object.entries(summary).forEach(([s, v]) => {
      if (v.kr > 0) console.log(`   ${s}: ${v.obj} obj | ${v.sobj} sobj | ${v.kr} KR`);
    });
    if (prev) {
      const d = diffDetail(prev, data);
      if (d !== '  (aucun changement)') console.log(`   🔄 Différences vs backup suivant:\n${d}`);
    }
    prev = data;
    console.log('');
  });
  console.log(`\nPour restaurer: node backup_okr.js restore okr_backups/[nom_du_fichier].json`);
  process.exit(0);
}

async function listFirebase() {
  console.log('\n=== BACKUPS FIREBASE (20 derniers) ===\n');
  const all = await getDocs(query(collection(db, 'okr_backups'), orderBy('_backupAt', 'desc'), limit(20)));
  const docs = all.docs;
  let prev = null;
  docs.forEach(d => {
    const data = d.data();
    const summary = summarize(data);
    const at = data._backupAt ? new Date(data._backupAt).toLocaleString('fr-FR') : d.id;
    console.log(`📦 ID: ${d.id}`);
    console.log(`   Date: ${at}`);
    Object.entries(summary).forEach(([s, v]) => {
      if (v.kr > 0) console.log(`   ${s}: ${v.obj} obj | ${v.sobj} sobj | ${v.kr} KR`);
    });
    if (prev) {
      const dd = diffDetail(prev, data);
      if (dd !== '  (aucun changement)') console.log(`   🔄 Différences vs backup plus récent:\n${dd}`);
      else console.log(`   ✓ Aucun changement vs backup plus récent`);
    }
    prev = data;
    console.log('');
  });
  console.log(`\nPour restaurer: node backup_okr.js restore-firebase [ID]`);
  process.exit(0);
}

async function restore(filename) {
  const file = filename || `${BACKUP_DIR}/latest.json`;
  if (!fs.existsSync(file)) { console.error('❌ Fichier non trouvé:', file); process.exit(1); }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const summary = summarize(data);
  Object.entries(summary).forEach(([s, v]) => console.log(`${s}: ${v.obj} obj, ${v.sobj} sobj, ${v.kr} KR`));
  await setDoc(doc(db, 'okr', 'data'), data);
  console.log(`\n✅ Restauré depuis: ${file}`);
  process.exit(0);
}

async function restoreFirebase(backupId) {
  if (!backupId) { console.error('❌ Fournissez un ID de backup'); process.exit(1); }
  const snap = await getDoc(doc(db, 'okr_backups', backupId));
  if (!snap.exists()) { console.error('❌ Backup non trouvé:', backupId); process.exit(1); }
  const data = snap.data();
  delete data._backupAt;
  delete data._backupId;
  const summary = summarize(data);
  Object.entries(summary).forEach(([s, v]) => console.log(`${s}: ${v.obj} obj, ${v.sobj} sobj, ${v.kr} KR`));
  await setDoc(doc(db, 'okr', 'data'), data);
  console.log(`\n✅ Restauré depuis Firebase: ${backupId}`);
  process.exit(0);
}

const cmd = process.argv[2];
const arg = process.argv[3];

if (cmd === 'list') { listLocal(); }
else if (cmd === 'list-firebase') { listFirebase().catch(e => { console.error('❌', e.message); process.exit(1); }); }
else if (cmd === 'restore') { restore(arg).catch(e => { console.error('❌', e.message); process.exit(1); }); }
else if (cmd === 'restore-firebase') { restoreFirebase(arg).catch(e => { console.error('❌', e.message); process.exit(1); }); }
else { backup().catch(e => { console.error('❌', e.message); process.exit(1); }); }
