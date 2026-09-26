const {initializeApp}=require('firebase/app');
const {getFirestore,doc,getDoc,setDoc}=require('firebase/firestore');
const app=initializeApp({apiKey:'AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM',projectId:'okr-oe'});
const db=getFirestore(app);

async function run(){
  const snap=await getDoc(doc(db,'okr','data'));
  const data=snap.data();
  const s=data.allSeasons.ete_2026;

  // Check existing obj1 sobjs
  console.log('Sobjs obj 1 avant:');
  s.subobjectives.filter(x=>x.parent==='1').sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true})).forEach(x=>console.log(' ',x.id,x.title));

  // Add new sobj 1.1
  const newSobj = {
    id: "1.1",
    parent: "1",
    title: "Mieux prioriser les clients, prospects et opportunités",
    owner: "Thomas",
    contributors: [],
    poids: 30,
    priorite: "P1"
  };

  // Check 1.1 doesn't already exist
  const existing = s.subobjectives.find(x=>x.id==='1.1');
  if(existing){ console.log('⚠️  1.1 existe déjà:', existing.title); process.exit(1); }

  const newSobjs = [...s.subobjectives, newSobj]
    .sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));

  console.log('\nSobjs obj 1 après:');
  newSobjs.filter(x=>x.parent==='1').forEach(x=>console.log(' ',x.id,x.title));

  const newData={...data,allSeasons:{...data.allSeasons,ete_2026:{...s,subobjectives:newSobjs}}};
  await setDoc(doc(db,'okr','data'),newData);
  console.log('\n✅ Sous-objectif 1.1 ajouté !');
  process.exit(0);
}
run().catch(e=>{console.error('❌',e.message);process.exit(1);});
