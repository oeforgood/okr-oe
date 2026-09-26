const {initializeApp}=require('firebase/app');
const {getFirestore,doc,getDoc,setDoc}=require('firebase/firestore');
const app=initializeApp({apiKey:'AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM',projectId:'okr-oe'});
const db=getFirestore(app);

async function run(){
  const okrSnap=await getDoc(doc(db,'okr','data'));
  const okrData=okrSnap.data();
  const s=okrData.allSeasons.ete_2026;

  const newKRs=s.keyresults.map(k=>{
    // Deduplicate contributors
    const contributors=[...new Set((k.contributors||[]).map(c=>c==='Inès'?'Ines':c))];
    const owner=k.owner==='Inès'?'Ines':k.owner;
    if(JSON.stringify(contributors)!==JSON.stringify(k.contributors)||owner!==k.owner){
      console.log(`  ${k.id}: contributors:${JSON.stringify(k.contributors)}→${JSON.stringify(contributors)}`);
    }
    return {...k,owner,contributors};
  });

  const newData={...okrData,allSeasons:{...okrData.allSeasons,ete_2026:{...s,keyresults:newKRs}}};
  await setDoc(doc(db,'okr','data'),newData);
  console.log('✅ Doublons Inès/Ines nettoyés');
  process.exit(0);
}
run().catch(e=>{console.error('❌',e.message);process.exit(1);});
