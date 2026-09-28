const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');

const app = initializeApp({
  apiKey: "AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM",
  authDomain: "okr-oe.firebaseapp.com",
  projectId: "okr-oe",
});
const db = getFirestore(app);

async function restore() {
  const data = require('./okr_backup.json');
  const ete = data.allSeasons.ete_2026;

  const existingSobjIds = new Set(ete.subobjectives.map(x => x.id));
  const missingParents = [...new Set(ete.keyresults.map(x => x.parent))]
    .filter(p => !existingSobjIds.has(p)).sort();

  console.log('Sous-objectifs à recréer:', missingParents.length);

  const restoredSobjs = missingParents.map(id => ({
    id,
    parent: id.split('.').slice(0,-1).join('.'),
    title: 'Sous-objectif à renommer',
    poids: 0,
    owner: '',
    priorite: '',
    contributors: []
  }));

  const newSobjs = [...ete.subobjectives, ...restoredSobjs]
    .sort((a,b) => a.id.localeCompare(b.id, undefined, {numeric:true}));

  fs.writeFileSync('okr_backup_before_restore.json', JSON.stringify(data, null, 2));
  console.log('Backup sauvegardé');

  const newData = {
    ...data,
    allSeasons: {
      ...data.allSeasons,
      ete_2026: { ...ete, subobjectives: newSobjs }
    }
  };

  await setDoc(doc(db, 'okr', 'data'), newData);
  console.log('✅ Restauré !', newSobjs.length, 'sous-objectifs dans ete_2026');
  restoredSobjs.forEach(s => console.log(' ', s.id, '→ à renommer'));
  process.exit(0);
}

restore().catch(e => { console.error('❌', e.message); process.exit(1); });
