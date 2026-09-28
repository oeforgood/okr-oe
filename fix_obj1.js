const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

const app = initializeApp({
  apiKey: "AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM",
  projectId: "okr-oe",
});
const db = getFirestore(app);

async function run() {
  const snap = await getDoc(doc(db, 'okr', 'data'));
  const data = snap.data();
  const s = data.allSeasons.ete_2026;

  console.log('Avant - Sobjs obj 1:');
  s.subobjectives.filter(x=>x.parent==='1').forEach(x=>console.log(' ', x.id, x.title));
  console.log('Avant - KRs 1.x:', s.keyresults.filter(k=>k.parent.startsWith('1.')).map(k=>k.id).join(', '));

  // Rename 1.2 → 1.1 and update KRs accordingly
  const newSobjs = s.subobjectives.map(x => {
    if (x.id === '1.2') return {...x, id: '1.1'};
    return x;
  });

  const newKRs = s.keyresults.map(k => {
    if (k.parent === '1.2') {
      const suffix = k.id.slice('1.2'.length); // e.g. ".1" → "1.1.1"
      return {...k, parent: '1.1', id: '1.1' + suffix};
    }
    return k;
  });

  console.log('\nAprès - Sobjs obj 1:');
  newSobjs.filter(x=>x.parent==='1').forEach(x=>console.log(' ', x.id, x.title));
  console.log('Après - KRs 1.x:', newKRs.filter(k=>k.parent.startsWith('1.')).map(k=>k.id).join(', '));

  const newData = {...data, allSeasons: {...data.allSeasons, ete_2026: {...s, subobjectives: newSobjs, keyresults: newKRs}}};
  await setDoc(doc(db, 'okr', 'data'), newData);
  console.log('\n✅ Corrigé !');
  process.exit(0);
}
run().catch(e => { console.error('❌', e.message); process.exit(1); });
