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

function replaceTomek(obj) {
  if (typeof obj === "string") return obj === "Tomek" ? "Thomas" : obj;
  if (Array.isArray(obj)) return obj.map(replaceTomek);
  if (obj && typeof obj === "object") {
    const result = {};
    for (const [k, v] of Object.entries(obj)) result[k] = replaceTomek(v);
    return result;
  }
  return obj;
}

async function migrate() {
  const ref = doc(db, "okr", "data");
  const snap = await getDoc(ref);
  if (!snap.exists()) { console.log("No OKR data found"); process.exit(0); }
  const data = snap.data();
  const fixed = replaceTomek(data);
  await setDoc(ref, fixed);
  console.log("Migration complete: Tomek -> Thomas in all OKR data");
  process.exit(0);
}

migrate().catch(e => { console.error(e); process.exit(1); });
