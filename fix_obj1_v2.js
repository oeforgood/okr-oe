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
  s.subobjectives.filter(x=>x.parent==='1').forEach(x=>console.log(' ', x.id, '"'+x.title+'"'));

  // Remove ALL obj1 sobjs, keep only one 1.1
  const obj1Sobjs = s.subobjectives.filter(x=>x.parent==='1');
  
  // Find the best one (has KRs attached)
  const best = obj1Sobjs.find(s => {
    const id = s.id;
    return data.allSeasons.ete_2026.keyresults.some(k=>k.parent===id);
  }) || obj1Sobjs[0];
  
  console.log('\nGarde:', best.id, '"'+best.title+'"');
  
  // Remove all obj1 sobjs, add back only best as 1.1
  const newSobjs = [
    ...s.subobjectives.filter(x=>x.parent!=='1'),
    {...best, id:'1.1', parent:'1'}
  ];

  // Fix KRs: any KR with parent starting 1. → remap to 1.1.x
  const obj1KRs = s.keyresults.filter(k=>k.parent===best.id || k.parent==='1.1' || k.parent==='1.2');
  const otherKRs = s.keyresults.filter(k=>!['1.1','1.2',best.id].includes(k.parent));
  const newObj1KRs = obj1KRs.map((k,i)=>({...k, parent:'1.1', id:`1.1.${i+1}`}));

  const newKRs = [...otherKRs, ...newObj1KRs];

  console.log('\nAprès - Sobjs obj 1:');
  newSobjs.filter(x=>x.parent==='1').forEach(x=>console.log(' ', x.id, '"'+x.title+'"'));
  console.log('KRs 1.1:', newObj1KRs.map(k=>k.id+' '+k.title.slice(0,30)).join('\n         '));

  const newData = {...data, allSeasons: {...data.allSeasons, ete_2026: {...s, subobjectives:newSobjs, keyresults:newKRs}}};
  await setDoc(doc(db, 'okr', 'data'), newData);
  console.log('\n✅ Corrigé !');
  process.exit(0);
}
run().catch(e => { console.error('❌', e.message); process.exit(1); });
