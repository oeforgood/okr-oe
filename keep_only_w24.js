const { initializeApp } = require("firebase/app");
const { getFirestore, getDocs, collection, doc, setDoc, deleteDoc } = require("firebase/firestore");

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

function getCorrectWeekKey(submittedAt) {
  const date = new Date(submittedAt);
  const dow = date.getDay() || 7;
  let d = new Date(date);
  if (dow === 1) d.setDate(d.getDate() - 7);
  const mon = new Date(d);
  mon.setDate(d.getDate() - ((d.getDay() || 7) - 1));
  const yr = mon.getFullYear();
  const jan1 = new Date(yr, 0, 1);
  const startDow = jan1.getDay() || 7;
  const startW1 = new Date(jan1);
  startW1.setDate(jan1.getDate() + (startDow <= 4 ? 1 - startDow : 8 - startDow));
  const wk = Math.floor((mon - startW1) / 604800000) + 1;
  return `${yr}-W${String(wk).padStart(2, '0')}`;
}

async function run() {
  const snap = await getDocs(collection(db, "updates"));
  let kept = 0, deleted = 0, renamed = 0;

  for (const d of snap.docs) {
    const data = d.data();
    const correctWeek = getCorrectWeekKey(data.submittedAt);

    if (correctWeek !== "2026-W24") {
      // Delete everything that's not W24
      await deleteDoc(doc(db, "updates", d.id));
      deleted++;
    } else {
      // It belongs to W24 - rename if needed
      const correctId = `${data.email}_2026-W24`;
      if (d.id !== correctId) {
        await setDoc(doc(db, "updates", correctId), { ...data, weekKey: "2026-W24" });
        await deleteDoc(doc(db, "updates", d.id));
        console.log(`Renamed: ${d.id} -> ${correctId}`);
        renamed++;
      } else {
        // Already correct ID, just ensure weekKey is right
        if (data.weekKey !== "2026-W24") {
          await setDoc(doc(db, "updates", d.id), { ...data, weekKey: "2026-W24" });
          console.log(`Fixed weekKey: ${d.id}`);
        }
        kept++;
      }
    }
  }

  console.log(`Done! Kept: ${kept}, Renamed: ${renamed}, Deleted: ${deleted}`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
