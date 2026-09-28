const {initializeApp}=require('firebase/app');
const {getFirestore,doc,getDoc,setDoc}=require('firebase/firestore');
const app=initializeApp({apiKey:'AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM',projectId:'okr-oe'});
const db=getFirestore(app);
async function run(){
  const snap=await getDoc(doc(db,'app_config','main'));
  const data=snap.data();
  const members=data.teamMembers;
  if(members.find(m=>m.email?.includes('ines'))){console.log('Inès déjà présente');process.exit(0);}
  members.push({prenom:'Inès',email:'ines@oeforgood.com',managerEmail:'',role:'teammate'});
  await setDoc(doc(db,'app_config','main'),{teamMembers:members},{merge:true});
  console.log('✅ Inès ajoutée');
  process.exit(0);
}
run().catch(e=>{console.error('❌',e.message);process.exit(1);});
