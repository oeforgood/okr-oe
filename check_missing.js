const data=require('./okr_backup.json');
const s=data.allSeasons.ete_2026;
const sobjIds=new Set(s.subobjectives.map(x=>x.id));
const missingParents=[...new Set(s.keyresults.map(x=>x.parent))].filter(p=>!sobjIds.has(p)).sort();
console.log('Sous-objectifs manquants:');
missingParents.forEach(p=>{
  const krs=s.keyresults.filter(k=>k.parent===p);
  console.log(p+':', krs.length, 'KRs');
});
console.log('Total:', missingParents.length);
