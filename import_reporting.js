#!/usr/bin/env node
// ─── IMPORT REPORTING CSV → FIREBASE ─────────────────────────────────────────
const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

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

const CSV_PATH = path.join(__dirname, 'reporting.csv');
const REPORTING_CANALS = ['Autres B2B','B2C','CHR','Export','Grands Comptes','Retail','Régénération'];

const SUBCAT_LABELS = {
  "A1-31":"Autres produits et charges-Subvention",
  "B1-09":"Bar-Charges de personnel","B1-23":"Bar-Outils",
  "C1-15":"Culture et bien-être-Frais de déplacement","C1-18":"Culture et bien-être-Honoraires",
  "F1-07":"Comptabilité-Autres achats et charges externes","F1-09":"Comptabilité-Charges de personnel",
  "F1-10":"Comptabilité-Commissions sur ventes","F1-14":"Comptabilité-Frais bancaires",
  "F1-15":"Comptabilité-Frais de déplacement","F1-18":"Comptabilité-Honoraires",
  "F1-23":"Comptabilité-Outils","F1-31":"Comptabilité-Subvention","F1-36":"Comptabilité-Formations",
  "G1-04":"Frais généraux-Achats non stockés","G1-06":"Frais généraux-Assurance",
  "G1-09":"Frais généraux-Charges de personnel","G1-12":"Frais généraux-Entretiens et réparations",
  "G1-17":"Frais généraux-Frais postaux","G1-18":"Frais généraux-Honoraires",
  "G1-20":"Frais généraux-Impôts","G1-22":"Frais généraux-Locations immobilières",
  "G1-23":"Frais généraux-Outils","G1-30":"Frais généraux-Sous-traitance",
  "I1-11":"Immobilisations-Dotation aux amortissements",
  "J1-18":"Juridique-Honoraires",
  "L1-01":"Logistique-Achat d'emballages","L1-04":"Logistique-Achats non stockés",
  "L1-09":"Logistique-Charges de personnel","L1-12":"Logistique-Entretiens et réparations",
  "L1-15":"Logistique-Frais de déplacement","L1-23":"Logistique-Outils",
  "L1-26":"Logistique-Prestations de services","L1-31":"Logistique-Subvention",
  "M1-15":"Branding-Frais de déplacement","M1-21":"Branding-Impressions",
  "M1-26":"Branding-Prestations de services","M1-AU":"Branding-Autre",
  "M2-04":"Collab-Achats non stockés","M2-AU":"Collab-Autre",
  "M3-27":"Partenariat/Visibilité-Publicité","M3-AU":"Partenariat/Visibilité-Autre",
  "M4-23":"Outils web-Outils","M4-AU":"Outils web-Autre",
  "M6-05":"Impact-Adhésions","M6-26":"Impact-Prestations","M6-AU":"Impact-Autre",
  "M7-05":"B2B-Adhésions","M7-26":"B2B-Prestations","M7-29":"B2B-Salons","M7-AU":"B2B-Autre",
  "M8-09":"Salaires-Charges de personnel","M8-15":"Salaires-Frais de déplacement",
  "M8-31":"Salaires-Subvention","M8-AU":"Salaires-Autre",
  "O1-09":"Régénération-Charges de personnel","O1-13":"Régénération-Etudes",
  "O1-15":"Régénération-Frais de déplacement","O1-31":"Régénération-Subvention",
  "R1-16":"RH-Frais de recrutement","R1-23":"RH-Outils","R1-36":"RH-Formations",
  "S1-03":"Retail-Achats de vin","S1-05":"Retail-Adhésions","S1-09":"Retail-Charges de personnel",
  "S1-10":"Retail-Commissions","S1-15":"Retail-Frais de déplacement","S1-18":"Retail-Honoraires",
  "S1-26":"Retail-Prestations","S1-30":"Retail-Sous-traitance","S1-31":"Retail-Subvention",
  "S1-35":"Retail-Ventes de marchandises","S1-36":"Retail-Formations","S1-AU":"Retail-Autre",
  "S2-04":"CHR-Achats non stockés","S2-05":"CHR-Adhésions","S2-07":"CHR-Autres achats",
  "S2-09":"CHR-Charges de personnel","S2-10":"CHR-Commissions","S2-15":"CHR-Frais de déplacement",
  "S2-18":"CHR-Honoraires","S2-27":"CHR-Publicité","S2-31":"CHR-Subvention",
  "S2-35":"CHR-Ventes de marchandises","S2-36":"CHR-Formations","S2-AU":"CHR-Autre",
  "S3-05":"Export-Adhésions","S3-09":"Export-Charges de personnel","S3-10":"Export-Commissions",
  "S3-15":"Export-Frais de déplacement","S3-18":"Export-Honoraires","S3-26":"Export-Prestations",
  "S3-31":"Export-Subvention","S3-32":"Export-Transport","S3-36":"Export-Formations","S3-AU":"Export-Autre",
  "S4-18":"X canal-Honoraires","S4-23":"X canal-Outils","S4-26":"X canal-Prestations",
  "S4-27":"X canal-Publicité","S4-30":"X canal-Sous-traitance","S4-AU":"X canal-Autre",
  "S5-05":"E-commerce-Adhésions","S5-09":"E-commerce-Charges de personnel","S5-10":"E-commerce-Commissions",
  "S5-23":"E-commerce-Outils","S5-27":"E-commerce-Publicité","S5-AU":"E-commerce-Autre",
  "S6-05":"Grands Comptes-Adhésions","S6-09":"Grands Comptes-Charges de personnel",
  "S6-15":"Grands Comptes-Frais de déplacement","S6-18":"Grands Comptes-Honoraires",
  "S6-21":"Grands Comptes-Impressions","S6-26":"Grands Comptes-Prestations",
  "S6-27":"Grands Comptes-Publicité","S6-35":"Grands Comptes-Ventes de marchandises","S6-AU":"Grands Comptes-Autre",
  "T1-06":"Trésorerie-Assurance","T1-07":"Trésorerie-Autres achats",
  "T1-14":"Trésorerie-Frais bancaires","T1-28":"Trésorerie-Remboursement de prêt",
  "Z1-34":"Ventes-Vente de prestation","Z1-35":"Ventes-Ventes de marchandises",
  "Z2-01":"COGS-Achat d'emballages","Z2-02":"COGS-Achats de matières premières",
  "Z2-03":"COGS-Achats de vin","Z2-25":"COGS-Prestation d'embouteillage",
  "Z2-32":"COGS-Transport","Z2-33":"COGS-Variation des stocks",
};

function parseLine(line) {
  const result = []; let current = '', inQ = false;
  for (const ch of line) {
    if (ch === '"') inQ = !inQ;
    else if (ch === ',' && !inQ) { result.push(current); current = ''; }
    else current += ch;
  }
  result.push(current);
  return result;
}

function parseAmount(s) {
  const clean = String(s||'').replace(/[\u202f\u00a0€ \u2019\u2018''"]/g,'').replace(',','.').trim();
  return parseFloat(clean) || 0;
}

console.log('📂 Lecture du fichier reporting.csv...');
const content = fs.readFileSync(CSV_PATH, 'utf-8').replace(/^\uFEFF/,'');
const lines = content.split('\n');
const rows = [];
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const r = parseLine(lines[i]);
  if (r.length >= 32) rows.push(r);
}
console.log(`   ${rows.length} lignes lues`);

const caData = {};    // { canal: { mKey: amount } }
const caRows = {};    // { canal: [ {tiers, libLigne, facture, compte, libCompte, month, year, amount} ] }
const chargeData = {};
const bilData = {};   // { bfr: {clients,fournisseurs,stocks}, autres: {...}, banques: {banques} }

for (const r of rows) {
  const famille = r[14], compte = r[3], canal = r[37];
  const subcat = r[31];
  let month = parseInt(r[30]), year = parseInt(r[32]);
  // Fallback: extract month/year from date column r[1] (format: d/m/yyyy)
  if (isNaN(month) || month < 1 || month > 12 || isNaN(year)) {
    const dateParts = (r[1]||'').split('/');
    if (dateParts.length === 3) {
      month = parseInt(dateParts[1]); // d/m/yyyy
      year = parseInt(dateParts[2]);
    }
  }
  const amount = parseAmount(r[29]);
  if (r[2]==='AN') continue; // Ignore report à nouveau
  if (isNaN(month) || month < 1 || month > 12) continue;
  if (isNaN(year)) continue;
  const mKey = `${year}-${month}`;

  // CA rows (compte starts with 7)
  if (famille === 'Analytique écritures comptables' && compte.startsWith('7') && REPORTING_CANALS.includes(canal)) {
    if (!caData[canal]) caData[canal] = {};
    caData[canal][mKey] = (caData[canal][mKey] || 0) + amount;
    // Store individual row for tiers breakdown
    if (!caRows[canal]) caRows[canal] = [];
    caRows[canal].push({
      tiers: r[12] || '',
      libLigne: r[8] || '',
      facture: r[10] || '',
      compte: r[3],
      libCompte: r[4] || '',
      month, year, amount
    });
  }

  // Charge rows (compte starts with 6)
  if (famille === 'Analytique écritures comptables' && compte.startsWith('6') && subcat && subcat !== '#N/A') {
    if (!chargeData[subcat]) chargeData[subcat] = { months: {}, rows: [] };
    chargeData[subcat].months[mKey] = (chargeData[subcat].months[mKey] || 0) + amount;
    chargeData[subcat].rows.push({
      date: r[1], compte: r[3], libCompte: r[4],
      tiers: r[12] || '', facture: r[10] || '', libLigne: r[8] || '',
      month, year, amount
    });
  }

  // Balance sheet accounts
  function getBilKey(c) {
    if (c.startsWith('3'))  return { section: 'bfr', key: 'stocks' };
    if (c.startsWith('40')) return { section: 'bfr', key: 'fournisseurs' };
    if (c.startsWith('41') || c.startsWith('49')) return { section: 'bfr', key: 'clients' };
    const p2 = c.slice(0,2);
    if (['10','11','12','13'].includes(p2)) return { section: 'autres', key: 'capitaux' };
    if (['14','15'].includes(p2)) return { section: 'autres', key: 'provisions' };
    if (p2 === '16') return { section: 'autres', key: 'emprunts' };
    if (['17','18','19'].includes(p2)) return { section: 'autres', key: 'participations' };
    if (c.startsWith('2'))  return { section: 'autres', key: 'immobilisations' };
    if (['42','43'].includes(p2)) return { section: 'autres', key: 'dette_sociale' };
    if (p2 === '44') return { section: 'autres', key: 'dette_etat' };
    if (p2 === '45') return { section: 'autres', key: 'comptes_courants' };
    if (['46','47','48'].includes(p2)) return { section: 'autres', key: 'autre' };
    if (c.startsWith('51')) return { section: 'banques', key: 'banques' };
    if (c.startsWith('5') && !c.startsWith('51')) return { section: 'autres', key: 'autre' };
    return null;
  }
  const bilKey = getBilKey(compte);
  if (bilKey) {
    const { section, key } = bilKey;
    if (!bilData[section]) bilData[section] = {};
    if (!bilData[section][key]) bilData[section][key] = { months: {}, rows: [] };
    bilData[section][key].months[mKey] = (bilData[section][key].months[mKey] || 0) + amount;
    bilData[section][key].rows.push({
      date: r[1], compte: r[3], libCompte: r[4] || '',
      tiers: r[12] || '', facture: r[10] || '', libLigne: r[8] || '',
      month, year, amount
    });
  }
}

async function run() {
  const importedAt = new Date().toISOString();
  console.log('☁️  Envoi vers Firebase...');

  await setDoc(doc(db, 'reporting', 'ca'), { caData, caRows, importedAt });
  console.log('   ✓ CA importé (avec détail par tiers)');

  await setDoc(doc(db, 'reporting', 'charges'), { chargeData, importedAt });
  console.log('   ✓ Charges importées');

  await setDoc(doc(db, 'reporting', 'bfr'), { bilData, importedAt });
  console.log('   ✓ Bilan importé (BFR, autres comptes, banques)');

  await setDoc(doc(db, 'reporting', 'meta'), {
    importedAt, subcatLabels: SUBCAT_LABELS, rowCount: rows.length,
  });
  console.log('   ✓ Méta-données importées');

  console.log(`\n✅ Import terminé ! ${rows.length} lignes le ${new Date().toLocaleString('fr-FR')}`);
  process.exit(0);
}

run().catch(e => { console.error('❌ Erreur:', e.message); process.exit(1); });
