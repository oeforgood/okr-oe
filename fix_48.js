const {initializeApp}=require('firebase/app');
const {getFirestore,doc,getDoc,setDoc}=require('firebase/firestore');
const app=initializeApp({apiKey:'AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM',projectId:'okr-oe'});
const db=getFirestore(app);
async function run(){
  const snap=await getDoc(doc(db,'okr','data'));
  const data=snap.data();
  const s=data.allSeasons.ete_2026;
  const seen=new Set();
  const newSobjs=s.subobjectives.filter(x=>{
    if(seen.has(x.id))return false;
    seen.add(x.id);
    return true;
  });
  console.log('Avant:', s.subobjectives.length, '→ Après:', newSobjs.length);
  await setDoc(doc(db,'okr','data'),{...data,allSeasons:{...data.allSeasons,ete_2026:{...s,subobjectives:newSobjs}}});
  console.log('✅ Doublon 4.8 supprimé');
  process.exit(0);
}
run().catch(e=>{console.error('❌',e.message);process.exit(1);});
