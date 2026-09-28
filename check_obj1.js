const {initializeApp}=require('firebase/app');
const {getFirestore,doc,getDoc,collection,getDocs,query,orderBy,limit}=require('firebase/firestore');
const app=initializeApp({apiKey:'AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM',projectId:'okr-oe'});
const db=getFirestore(app);

function showObj1(label, s){
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${label}`);
  console.log('═'.repeat(60));
  const sobjs=s.subobjectives.filter(x=>x.parent==='1').sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));
  const krs=s.keyresults.filter(k=>k.parent.startsWith('1.')).sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));
  console.log(`Sobjs (${sobjs.length}):`);
  sobjs.forEach(x=>console.log(`  ${x.id} | ${x.title}`));
  console.log(`KRs (${krs.length}):`);
  krs.forEach(k=>console.log(`  ${k.id} | parent:${k.parent} | ${k.title.slice(0,50)}`));
}

async function run(){
  // Current Firebase
  const snap=await getDoc(doc(db,'okr','data'));
  showObj1('FIREBASE ACTUEL', snap.data().allSeasons.ete_2026);

  // Last 6 backups
  const all=await getDocs(query(collection(db,'okr_backups'),orderBy('_backupAt','desc'),limit(6)));
  for(const d of all.docs){
    const data=d.data();
    const at=data._backupAt?new Date(data._backupAt).toLocaleString('fr-FR'):d.id;
    showObj1(`BACKUP: ${d.id} (${at})`, data.allSeasons.ete_2026);
  }
  process.exit(0);
}
run().catch(e=>{console.error('❌',e.message);process.exit(1);});
