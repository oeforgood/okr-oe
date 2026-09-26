const {initializeApp}=require('firebase/app');
const {getFirestore,collection,getDocs,query,where,deleteDoc,doc,getDoc}=require('firebase/firestore');
const app=initializeApp({apiKey:'AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM',projectId:'okr-oe'});
const db=getFirestore(app);
async function run(){
  const configSnap=await getDoc(doc(db,'app_config','main'));
  const maxime=configSnap.data().teamMembers.find(m=>m.prenom==='Maxime');
  console.log('Maxime:', maxime?.email);
  const snap=await getDocs(query(collection(db,'updates'),where('email','==',maxime?.email)));
  console.log('Updates trouvés:', snap.size);
  snap.docs.forEach(d=>console.log(' ',d.id));
  for(const d of snap.docs) await deleteDoc(d.ref);
  const notifSnap=await getDocs(query(collection(db,'update_notifications'),where('fromEmail','==',maxime?.email)));
  console.log('Notifs trouvées:', notifSnap.size);
  for(const d of notifSnap.docs) await deleteDoc(d.ref);
  console.log('✅ Supprimés');
  process.exit(0);
}
run().catch(e=>{console.error('❌',e.message);process.exit(1);});
