const fs=require('fs');
const b=require('./okr_backups/okr_2026-07-08T21-04-10.json').allSeasons.ete_2026;
const c=require('./okr_backups/latest.json').allSeasons.ete_2026;

let bOut='';
b.subobjectives.sort((a,x)=>a.id.localeCompare(x.id,undefined,{numeric:true})).forEach(s=>bOut+='SOBJ '+s.id+' | '+s.title+'\n');
b.keyresults.sort((a,x)=>a.id.localeCompare(x.id,undefined,{numeric:true})).forEach(k=>bOut+='KR '+k.id+' | '+k.title+'\n');

let cOut='';
c.subobjectives.sort((a,x)=>a.id.localeCompare(x.id,undefined,{numeric:true})).forEach(s=>cOut+='SOBJ '+s.id+' | '+s.title+'\n');
c.keyresults.sort((a,x)=>a.id.localeCompare(x.id,undefined,{numeric:true})).forEach(k=>cOut+='KR '+k.id+' | '+k.title+'\n');

const bSet=new Set(bOut.split('\n'));
const cSet=new Set(cOut.split('\n'));

let diff='=== DANS BACKUP 21h04 MAIS PAS DANS FIREBASE ===\n';
bOut.split('\n').filter(l=>l&&!cSet.has(l)).forEach(l=>diff+=l+'\n');
diff+='\n=== DANS FIREBASE MAIS PAS DANS BACKUP 21h04 ===\n';
cOut.split('\n').filter(l=>l&&!bSet.has(l)).forEach(l=>diff+=l+'\n');

console.log(diff);
fs.writeFileSync('diff_okr.txt',diff);
