const {initializeApp}=require('firebase/app');
const {getFirestore,doc,getDoc,setDoc}=require('firebase/firestore');
const app=initializeApp({apiKey:'AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM',projectId:'okr-oe'});
const db=getFirestore(app);

async function run(){
  // 1. Fix app_config: Inès → Ines
  const configSnap=await getDoc(doc(db,'app_config','main'));
  const config=configSnap.data();
  const newMembers=config.teamMembers.map(m=>
    m.email==='ines@oeforgood.com'?{...m,prenom:'Ines'}:m
  );
  await setDoc(doc(db,'app_config','main'),{teamMembers:newMembers},{merge:true});
  console.log('✅ app_config: Inès → Ines');

  // 2. Fix OKR data
  const okrSnap=await getDoc(doc(db,'okr','data'));
  const okrData=okrSnap.data();
  const s=okrData.allSeasons.ete_2026;

  const newKRs=s.keyresults.map(k=>{
    let changed=false;
    // Fix contributors: Inès → Ines (just in case)
    let contributors=(k.contributors||[]).map(c=>{
      if(c==='Inès'){changed=true;return 'Ines';}
      return c;
    });
    // Fix owner: empty + Ines sole or first contributor → set owner to Ines
    let owner=k.owner||'';
    if(!owner && contributors.includes('Ines')){
      owner='Ines';
      changed=true;
    }
    if(k.owner==='Inès'){owner='Ines';changed=true;}
    if(changed){
      console.log(`  ${k.id}: owner:"${k.owner}"→"${owner}" contributors:${JSON.stringify(k.contributors)}→${JSON.stringify(contributors)}`);
    }
    return changed?{...k,owner,contributors}:k;
  });

  const newData={...okrData,allSeasons:{...okrData.allSeasons,
    ete_2026:{...s,keyresults:newKRs}
  }};
  await setDoc(doc(db,'okr','data'),newData);
  console.log('✅ OKR: Ines corrigée comme owner/contributor');
  process.exit(0);
}
run().catch(e=>{console.error('❌',e.message);process.exit(1);});
