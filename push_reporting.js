#!/usr/bin/env node
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const data = require('./reporting_data.json');

const app = initializeApp({
  apiKey: "AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM",
  authDomain: "okr-oe.firebaseapp.com",
  projectId: "okr-oe",
  storageBucket: "okr-oe.firebasestorage.app",
  messagingSenderId: "1092396088784",
  appId: "1:1092396088784:web:245c059a0f397a4bbe4dd5"
});
const db = getFirestore(app);

async function run() {
  const importedAt = new Date().toISOString();
  console.log('☁️  Envoi vers Firebase...');

  await setDoc(doc(db,'reporting','ca'), { caData: data.caData, caRows: data.caRows, importedAt });
  console.log('   ✓ CA');

  if(Object.keys(data.chargeData).length > 5) {
    await setDoc(doc(db,'reporting','charges'), { chargeData: data.chargeData, importedAt });
    console.log(`   ✓ Charges (${Object.keys(data.chargeData).length} sous-catégories)`);
  } else {
    console.log('   ⚠️  Charges ignorées');
  }

  await setDoc(doc(db,'reporting','bfr'), { bilData: data.bilData, importedAt });
  console.log('   ✓ Bilan');

  // Push bilan entry docs
  let count = 0;
  for (const [path, entryData] of Object.entries(data.bilEntriesDocs || {})) {
    const [col, docId] = path.split('/');
    await setDoc(doc(db, col, docId), { entries: entryData, importedAt });
    count++;
  }
  console.log(`   ✓ Écritures bilan (${count} documents)`);

  // Push charge entry docs
  count = 0;
  for (const [path, entryData] of Object.entries(data.chargeEntriesDocs || {})) {
    const [col, docId] = path.split('/');
    await setDoc(doc(db, col, docId), { entries: entryData, importedAt });
    count++;
  }
  console.log(`   ✓ Écritures charges (${count} documents)`);

  console.log('\n✅ Import terminé !');
  process.exit(0);
}
run().catch(e=>{ console.error('❌', e.message); process.exit(1); });
