const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, setDoc } = require("firebase/firestore");

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
  const refW23 = doc(db, "updates", "fiona@oeforgood.com_2026-W23");
  const refW24 = doc(db, "updates", "fiona@oeforgood.com_2026-W24");

  const snapW23 = await getDoc(refW23);
  const snapW24 = await getDoc(refW24);

  const dataW23 = snapW23.data();
  const dataW24 = snapW24.data();

  // Swap: write W23 content to W24 and vice versa, updating weekKey accordingly
  await setDoc(refW24, { ...dataW23, weekKey: "2026-W24" });
  await setDoc(refW23, { ...dataW24, weekKey: "2026-W23" });

  console.log("Swap done!");
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
