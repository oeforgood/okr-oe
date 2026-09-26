const {initializeApp}=require('firebase/app');
const {getFirestore,collection,getDocs}=require('firebase/firestore');
const app=initializeApp({apiKey:'AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM',projectId:'okr-oe'});
const db=getFirestore(app);

async function run(){
  const now=Date.now();
  const oneDayAgo=now-24*60*60*1000;

  // Check update_notifications
  console.log('=== UPDATE_NOTIFICATIONS (récentes) ===');
  const uSnap=await getDocs(collection(db,'update_notifications'));
  uSnap.docs
    .filter(d=>{const data=d.data();return data.fromPrenom==='Thomas'||data.fromEmail?.includes('thomas');})
    .forEach(d=>{
      const data=d.data();
      console.log('\nID:', d.id);
      console.log('From:', data.fromPrenom, data.fromEmail);
      console.log('To (manager):', data.managerEmail);
      console.log('Pending:', data.pending);
      console.log('SubmittedAt:', data.submittedAt?new Date(data.submittedAt).toLocaleString('fr-FR'):'—');
    });

  // Check teammate_notifications
  console.log('\n=== TEAMMATE_NOTIFICATIONS (récentes) ===');
  const tSnap=await getDocs(collection(db,'teammate_notifications'));
  const recent=tSnap.docs
    .filter(d=>{
      const data=d.data();
      const created=data.createdAt||0;
      return created>oneDayAgo || d.id.includes('thomas') || data.title?.toLowerCase().includes('thomas') || data.fromPrenom?.toLowerCase().includes('thomas');
    });
  
  if(recent.length===0) console.log('Aucune notif récente liée à Thomas');
  recent.forEach(d=>{
    const data=d.data();
    console.log('\nID:', d.id);
    console.log('To:', data.toEmail);
    console.log('From:', data.fromPrenom);
    console.log('Title:', data.title);
    console.log('CreatedAt:', data.createdAt?new Date(data.createdAt).toLocaleString('fr-FR'):'—');
  });

  process.exit(0);
}
run().catch(e=>{console.error('❌',e.message);process.exit(1);});
