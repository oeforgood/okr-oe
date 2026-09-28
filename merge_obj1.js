const {initializeApp}=require('firebase/app');
const {getFirestore,doc,setDoc}=require('firebase/firestore');
const fs=require('fs');

const app=initializeApp({apiKey:"AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM",projectId:"okr-oe"});
const db=getFirestore(app);

async function run(){
  const base=require('./okr_backups/okr_2026-07-08T21-04-10.json');
  const late=require('./okr_backups/okr_2026-07-08T21-15-55.json');
  
  const s=base.allSeasons.ete_2026;
  const sl=late.allSeasons.ete_2026;
  
  // Replace obj1 sobjs and krs with those from 21h15
  const obj1SobjsLate=sl.subobjectives.filter(x=>x.parent==='1');
  const obj1KRsLate=sl.keyresults.filter(x=>x.parent.startsWith('1.'));
  
  // Remove obj1 from base, add from late
  const newSobjs=[...s.subobjectives.filter(x=>x.parent!=='1'),...obj1SobjsLate];
  const newKRs=[...s.keyresults.filter(x=>!x.parent.startsWith('1.')),...obj1KRsLate];
  
  console.log('Sobjs total:', newSobjs.length);
  console.log('KRs total:', newKRs.length);
  console.log('Obj1 sobjs:', obj1SobjsLate.map(x=>x.id+' '+x.title).join(', '));
  console.log('Obj1 KRs:', obj1KRsLate.map(x=>x.id).join(', '));
  
  const newData={...base,allSeasons:{...base.allSeasons,ete_2026:{...s,subobjectives:newSobjs,keyresults:newKRs}}};
  fs.writeFileSync('okr_backups/merged.json',JSON.stringify(newData,null,2));
  
  await setDoc(doc(db,'okr','data'),newData);
  console.log('✅ Merged et restauré');
  process.exit(0);
}
run().catch(e=>{console.error('❌',e.message);process.exit(1);});
