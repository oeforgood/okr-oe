const {initializeApp}=require('firebase/app');
const {getFirestore,doc,getDoc,setDoc}=require('firebase/firestore');
const app=initializeApp({apiKey:'AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM',projectId:'okr-oe'});
const db=getFirestore(app);
async function run(){
  const snap=await getDoc(doc(db,'okr','data'));
  const data=snap.data();
  const s=data.allSeasons.ete_2026;
  const newKR={
    id:'2.2.3',parent:'2.2',
    title:'Trois parcours d\'automatisation HubSpot sont actifs (lead entrant, prospection, client existant).',
    owner:'Thomas',contributors:[],poids:0,
    val_depart:0,val_actuel:0,val_cible:1,val_revise:1,
    unite:'oui/non',stop:false,priorite:''
  };
  const newKRs=[...s.keyresults,newKR];
  await setDoc(doc(db,'okr','data'),{...data,allSeasons:{...data.allSeasons,ete_2026:{...s,keyresults:newKRs}}});
  console.log('✅ KR 2.2.3 ajouté');
  process.exit(0);
}
run().catch(e=>{console.error('❌',e.message);process.exit(1);});
