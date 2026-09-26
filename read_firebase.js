
const data=require('./okr_backups/latest.json');
const s=data.allSeasons.ete_2026;
const fs=require('fs');

const fbObjs=Object.fromEntries(s.objectives.map(o=>[o.id,o.title]));
const fbSobjs=Object.fromEntries(s.subobjectives.map(o=>[o.id,o.title]));
const fbKrs=Object.fromEntries(s.keyresults.map(k=>[k.id,k.title]));

fs.writeFileSync('firebase_okr_data.json', JSON.stringify({fbObjs,fbSobjs,fbKrs}));
console.log("Done - firebase_okr_data.json créé");
