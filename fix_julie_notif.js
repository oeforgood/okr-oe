const { initializeApp } = require("firebase/app");
const { getFirestore, doc, updateDoc } = require("firebase/firestore");

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
  // Julie submitted Monday -> should be immediate, fix pending flag
  await updateDoc(doc(db, "update_notifications", "julie@oeforgood.com_2026-W24_notif"), {
    pending: false,
    updatedAt: 1781512866473 // her submittedAt
  });
  console.log("Julie W24 notification delivered!");
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
