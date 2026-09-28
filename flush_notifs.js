const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, query, where, updateDoc, doc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM",
  authDomain: "okr-oe.firebaseapp.com",
  projectId: "okr-oe",
  storageBucket: "okr-oe.firebasestorage.app",
  messagingSenderId: "1092396088784",
  appId: "1:1092396088784:web:245c059a0f397a4bbe4dd5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  // Mark all existing notifications as not pending (deliver them)
  const snap = await getDocs(collection(db, "update_notifications"));
  let count = 0;
  for (const d of snap.docs) {
    const data = d.data();
    // If pending field missing or true, mark as delivered
    if (data.pending !== false) {
      await updateDoc(doc(db, "update_notifications", d.id), { 
        pending: false,
        updatedAt: data.updatedAt || data.submittedAt || Date.now()
      });
      count++;
      console.log("Delivered:", d.id);
    }
  }
  console.log(`Done! ${count} notifications delivered.`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
