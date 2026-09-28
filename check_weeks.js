const { initializeApp } = require("firebase/app");
const { getFirestore, getDocs, collection } = require("firebase/firestore");

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
  const dow = date.getDay() || 7; // 1=Mon...7=Sun
  // Monday -> previous week
  let d = new Date(date);
  if (dow === 1) d.setDate(d.getDate() - 7);
  // Get Monday of that week
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
  const issues = [];
  
  for (const d of snap.docs) {
    const data = d.data();
    const storedWeek = data.weekKey;
    const correctWeek = getCorrectWeekKey(data.submittedAt);
    if (storedWeek !== correctWeek) {
      const date = new Date(data.submittedAt);
      issues.push({
        id: d.id,
        prenom: data.prenom,
        stored: storedWeek,
        correct: correctWeek,
        submittedOn: date.toLocaleDateString('fr-FR', {weekday:'long',day:'numeric',month:'long',year:'numeric'})
      });
    }
  }
  
  if (issues.length === 0) {
    console.log("✅ Tous les weekKey sont corrects !");
  } else {
    console.log(`⚠️  ${issues.length} document(s) avec mauvais weekKey :`);
    issues.forEach(i => console.log(`  ${i.prenom} | stocké: ${i.stored} | correct: ${i.correct} | soumis: ${i.submittedOn}`));
  }
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
