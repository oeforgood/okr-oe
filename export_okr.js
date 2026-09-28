const {initializeApp}=require('firebase/app');
const {getFirestore,doc,getDoc}=require('firebase/firestore');
const fs=require('fs');
const app=initializeApp({apiKey:'AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM',projectId:'okr-oe'});
const db=getFirestore(app);

async function run(){
  const snap=await getDoc(doc(db,'okr','data'));
  const s=snap.data().allSeasons.ete_2026;

  const rows=[];
  rows.push(['Type','ID','Titre','Parent','Owner','Contributors','Poids','Priorité','Valeur départ','Valeur actuelle','Valeur cible','Valeur révisée','Unité','Stop','Taux avancement']);

  // Objectifs
  (s.objectives||[]).sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true})).forEach(o=>{
    rows.push(['Objectif',o.id,o.title||'','','','',(o.poids||'')+'%',o.priorite||'','','','','','','','']);
  });

  // Sous-objectifs
  (s.subobjectives||[]).sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true})).forEach(o=>{
    rows.push(['Sous-objectif',o.id,o.title||'',o.parent||'',o.owner||'',(o.contributors||[]).join('|'),(o.poids||'')+'%',o.priorite||'','','','','','','','']);
  });

  // KRs
  (s.keyresults||[]).sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true})).forEach(k=>{
    const avancement=k.val_cible&&k.val_cible!==k.val_depart
      ?Math.round((((k.val_actuel||k.val_depart)-k.val_depart)/(k.val_cible-k.val_depart))*100)+'%'
      :'—';
    rows.push([
      'KR',k.id,k.title||'',k.parent||'',
      k.owner||'',(k.contributors||[]).join('|'),
      (k.poids||'')+'%',k.priorite||'',
      k.val_depart||'',k.val_actuel||'',k.val_cible||'',k.val_revise||'',
      k.unite||'',k.stop?'Oui':'Non',avancement
    ]);
  });

  // Convert to CSV
  const csv=rows.map(r=>r.map(v=>{
    const s=String(v||'').replace(/"/g,'""');
    return s.includes(',')||s.includes('"')||s.includes('\n')?`"${s}"`:s;
  }).join(',')).join('\n');

  const filename=`OKR_Ete_2026_${new Date().toISOString().slice(0,10)}.csv`;
  fs.writeFileSync(filename,'\uFEFF'+csv,'utf8'); // BOM pour Excel
  console.log(`✅ Exporté: ${filename} (${rows.length-1} lignes)`);
  process.exit(0);
}
run().catch(e=>{console.error('❌',e.message);process.exit(1);});
