import { useState, useEffect, useRef, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, collection, addDoc, getDocs, query, where, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAVa77pRT0-ALIa3CKEULmZXxPG8V90uCM",
  authDomain: "okr-oe.firebaseapp.com",
  projectId: "okr-oe",
  storageBucket: "okr-oe.firebasestorage.app",
  messagingSenderId: "1092396088784",
  appId: "1:1092396088784:web:245c059a0f397a4bbe4dd5"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

// ─── INITIAL DATA ──────────────────────────────────────────────────────────────
const SPRING26={objectives:[{id:"1",title:"Aller chercher du chiffre d'affaires sur d'autres canaux",etp:0.2,owner:"Thomas",priorite:"P1",contributors:[]},{id:"2",title:"Fiabiliser la production et monter d'un cran en supply",etp:0.1,owner:"Fiona",priorite:"P1",contributors:[]},{id:"3",title:"Adopter le loft et s'y sentir bien",etp:0.1,owner:"Julie",priorite:"P2",contributors:[]},{id:"4",title:"Se mettre en position sereine pour la pérénité d'Oé",etp:0.35,owner:"Fx",priorite:"P1",contributors:[]},{id:"5",title:"Gérer le domaine et la FSDO",etp:0.05,owner:"Fx",priorite:"P2",contributors:[]},{id:"6",title:"Prioriser les grands comptes RHF les plus ROIstes",etp:0.37,owner:"Christelle",priorite:"P1",contributors:[]},{id:"7",title:"Accélérer notre activité RETAIL en GMS",etp:0.22,owner:"Christelle",priorite:"P1",contributors:[]},{id:"8",title:"Aligner notre vision et piloter nos actions sales",etp:0.22,owner:"Christelle",priorite:"P1",contributors:[]},{id:"9",title:"Marketing : Déployer une stratégie de communication 360° cohérente et structurée au service de la croissance commerciale",etp:0.2,owner:"Juliette",priorite:"P1",contributors:[]},{id:"10",title:"Communauté : Structurer et activer une communauté engagée au service de l'impact positif et du développement de la marque et du B2B",etp:0.15,owner:"Juliette",priorite:"P1",contributors:[]},{id:"11",title:"Export : Réaliser des avancées significatives sur les principaux marchés cibles en priorisant le développement des distributeurs existants",etp:0.05,owner:"Claire",priorite:"P1",contributors:[]}],subobjectives:[{id:"1.1",parent:"1",title:"Ouvrir le canal Commandes Groupées et lancer les premières commandes Groopay",poids:70.0,owner:"Thomas",priorite:"P1",contributors:[]},{id:"1.2",parent:"1",title:"Se mettre au carré sur les market places et les activer",poids:30.0,owner:"Fiona",priorite:"P1",contributors:[]},{id:"2.1",parent:"2",title:"Fiabiliser la production des essences",poids:30.0,owner:"Fiona",priorite:"P1",contributors:[]},{id:"2.2",parent:"2",title:"Fiabiliser les dates de réalisation de production chez MP",poids:30.0,owner:"Fiona",priorite:"P2",contributors:[]},{id:"2.3",parent:"2",title:"Avancer avec la coallition des acteurs du vin et ReZip",poids:20.0,owner:"Julie",priorite:"P2",contributors:[]},{id:"2.4",parent:"2",title:"Poursuivre et fortifier notre collaboration avec l'ESAT",poids:10.0,owner:"Julie",priorite:"P2",contributors:[]},{id:"2.5",parent:"2",title:"Nettoyer les stocks chez Peguet",poids:10.0,owner:"Julie",priorite:"P2",contributors:[]},{id:"3.1",parent:"3",title:"Les travaux au loft : en finir une fois pour toutes !",poids:100.0,owner:"Julie",priorite:"P2",contributors:[]},{id:"4.1",parent:"4",title:"Se donner les moyens de réaliser la marge objectif en 2026",poids:33.3,owner:"Fx",priorite:"P1",contributors:[]},{id:"4.2",parent:"4",title:"Avancer dans notre plan d'étalement de dettes",poids:33.3,owner:"Fx",priorite:"P1",contributors:[]},{id:"4.3",parent:"4",title:"Sécuriser Oé en termes de trésorerie sur 2026-2027",poids:33.3,owner:"Fx",priorite:"P1",contributors:[]},{id:"5.1",parent:"5",title:"Donner une nouvelle impulsion au plan de régénération du DOCSP",poids:60.0,owner:"Fx",priorite:"P2",contributors:[]},{id:"5.2",parent:"5",title:"Retrapper le juridique de la FSDO",poids:30.0,owner:"Fx",priorite:"P2",contributors:[]},{id:"5.3",parent:"5",title:"Organiser les vendanges au Domaine",poids:10.0,owner:"Fx",priorite:"P3",contributors:[]},{id:"6.1",parent:"6",title:"Accélérer Episaveurs – Développer pipeline et sécuriser volumes",poids:20.0,owner:"Christelle",priorite:"P1",contributors:[]},{id:"6.2",parent:"6",title:"Sécuriser France Boissons – Pérenniser accords et promotions",poids:15.0,owner:"Claire",priorite:"P1",contributors:[]},{id:"6.3",parent:"6",title:"Optimiser potentiel Maison Richard – Développer ventes et présence",poids:15.0,owner:"Thomas",priorite:"P1",contributors:[]},{id:"6.4",parent:"6",title:"Pérenniser Pain Quotidien – Consolider déploiement international",poids:10.0,owner:"Claire",priorite:"P1",contributors:[]},{id:"6.5",parent:"6",title:"Traiter Grands Comptes directs à potentiel",poids:10.0,owner:"Christelle",priorite:"P1",contributors:[]},{id:"6.6",parent:"6",title:"Cibler distributeurs régionaux existants – Sécuriser les volumes et réactiver terrain",poids:10.0,owner:"Christelle",priorite:"P1",contributors:[]},{id:"6.7",parent:"6",title:"Traiter top clients CHR directs – Fidéliser et étendre gamme premium",poids:10.0,owner:"Christelle",priorite:"P2",contributors:[]},{id:"6.8",parent:"6",title:"Nous déployer en Cash & Carry",poids:10.0,owner:"Christelle",priorite:"P2",contributors:[]},{id:"7.1",parent:"7",title:"Carrefour – Déployer et animer les magasins clés",poids:15.0,owner:"Christelle",priorite:"P1",contributors:[]},{id:"7.2",parent:"7",title:"ITM, U, Monoprix – Assurer couverture régionale et promotion",poids:15.0,owner:"Christelle",priorite:"P1",contributors:[]},{id:"7.3",parent:"7",title:"Leclerc & Franprix – Développer les magasins VIP",poids:10.0,owner:"Christelle",priorite:"P3",contributors:[]},{id:"7.4",parent:"7",title:"Enseignes prioritaires – visibilité & MEA",poids:5.0,owner:"Christelle",priorite:"P1",contributors:[]},{id:"7.5",parent:"7",title:"Renforcer la bascule Reuse / Réemploi",poids:10.0,owner:"Christelle",priorite:"P1",contributors:[]},{id:"7.6",parent:"7",title:"GSS – Sécuriser et développer positions",poids:15.0,owner:"Christelle",priorite:"P1",contributors:[]},{id:"7.7",parent:"7",title:"Cavistes - Pousser les acteurs majeurs",poids:15.0,owner:"Christelle",priorite:"P1",contributors:[]},{id:"7.8",parent:"7",title:"Hard Discount - Focuser sur le leader",poids:5.0,owner:"Thomas",priorite:"P3",contributors:[]},{id:"7.9",parent:"7",title:"Marketplaces - Optimiser les ventes et destockage",poids:10.0,owner:"Christelle",priorite:"P1",contributors:[]},{id:"8.1",parent:"8",title:"Stratégie & alignement – Suivi feuille de route par canal (Retail, RHF, GC RHF)",poids:20.0,owner:"Christelle",priorite:"P1",contributors:[]},{id:"8.2",parent:"8",title:"Stratégie terrain sales tous canaux - Repenser l'organisation (agents/alternants/CDIs/mutualisation)",poids:20.0,owner:"Christelle",priorite:"P1",contributors:[]},{id:"8.3",parent:"8",title:"Road map Trade Marketing - Aligner et anticiper les temps forts S2 2026-2027",poids:15.0,owner:"Christelle",priorite:"P3",contributors:[]},{id:"8.4",parent:"8",title:"Optimisation discours commercial",poids:15.0,owner:"Christelle",priorite:"P1",contributors:[]},{id:"8.5",parent:"8",title:"KPI & pilotage – Fiabiliser tableaux de bord internes et reporting Hubspot",poids:15.0,owner:"Christelle",priorite:"P1",contributors:[]},{id:"8.6",parent:"8",title:"Collaboration support – Suivi actions partagées avec équipes support",poids:15.0,owner:"Christelle",priorite:"P1",contributors:[]},{id:"9.1",parent:"9",title:"Renforcer la prospection et la fidélisation B2B grâce à des contenus, outils et communications ciblées",poids:20.0,owner:"Juliette",priorite:"P1",contributors:[]},{id:"9.2",parent:"9",title:"B2B organiser les salons et animations 2026/2027 : WineParis et ReUse",poids:5.0,owner:"Guillemette",priorite:"P1",contributors:[]},{id:"9.3",parent:"9",title:"Assurer le succès des lancements produits B2B grâce à un plan de communication et des PLV adaptées",poids:20.0,owner:"Juliette",priorite:"P2",contributors:[]},{id:"9.4",parent:"9",title:"Déployer le plan de communication Printemps/Été pour assurer visibilité, cohérence et suivi des actions Brand & B2C",poids:25.0,owner:"Guillemette",priorite:"P1",contributors:[]},{id:"9.5",parent:"9",title:"Repenser et améliorer le site Oé pour offrir une expérience utilisateur fluide et engageante",poids:25.0,owner:"Guillemette",priorite:"P1",contributors:[]},{id:"9.6",parent:"9",title:"Réaliser l'inventaire complet des supports de communication et marketing Oé",poids:5.0,owner:"Guillemette",priorite:"P3",contributors:[]},{id:"10.1",parent:"10",title:"Valider, structurer et lancer le Campus Oé comme outil d'engagement et de formation de la communauté B2B",poids:20.0,owner:"Juliette",priorite:"P1",contributors:[]},{id:"10.2",parent:"10",title:"Développer et activer la communauté Oé en augmentant le recrutement et l'engagement via des communications, un programme de parrainage et des expériences dédiées",poids:15.0,owner:"Guillemette",priorite:"P2",contributors:[]},{id:"10.3",parent:"10",title:"Déployer une communication régulière pour soutenir la visibilité et l'engagement du Commando Monop'",poids:25.0,owner:"Guillemette",priorite:"P1",contributors:[]},{id:"10.4",parent:"10",title:"Créer et activer des opportunités commerciales via les commandes groupées auprès de 50 entreprises",poids:40.0,owner:"Guillemette",priorite:"P1",contributors:[]},{id:"11.1",parent:"11",title:"US : reprendre le développement commercial tout en boostant l'activité avec nos distributeurs existants",poids:12.0,owner:"Claire",priorite:"P2",contributors:[]},{id:"11.2",parent:"11",title:"Allemagne: valider notre choix de distributeur",poids:12.0,owner:"Claire",priorite:"P1",contributors:[]},{id:"11.3",parent:"11",title:"UK : déployer Oé sur le marché",poids:12.0,owner:"Claire",priorite:"P1",contributors:[]},{id:"11.4",parent:"11",title:"Alimenter en nouveaux clients la zone DK/DE/BE/UK/NL pour consolider (ou trouver) notre distribueur",poids:14.0,owner:"Claire",priorite:"P1",contributors:[]},{id:"11.5",parent:"11",title:"Danemark: reprise des échanges en vue de confirmer un distributeur",poids:8.0,owner:"Claire",priorite:"P1",contributors:[]},{id:"11.6",parent:"11",title:"Marchés monopolistiques",poids:8.0,owner:"Claire",priorite:"P1",contributors:[]},{id:"11.7",parent:"11",title:"Support / passation congé maternité",poids:7.0,owner:"Claire",priorite:"P2",contributors:[]},{id:"11.8",parent:"11",title:"Autres marchés",poids:7.0,owner:"Claire",priorite:"P2",contributors:[]},{id:"11.9",parent:"11",title:"Belgique : assurer la croissance des sell-out Oé en vue d'obtenir une nouvelle commande distributeur",poids:10.0,owner:"Claire",priorite:"P2",contributors:[]},{id:"11.10",parent:"11",title:"Finlande: anticiper la suite",poids:10.0,owner:"Claire",priorite:"P2",contributors:[]}],keyresults:[{id:"1.1.1",parent:"1.1",title:"Mettre à jour toutes les infos",poids:10.0,owner:"Juliette",priorite:"",stop:false,contributors:["Fiona"],val_depart:0.0,val_actuel:1.0,val_revise:1.0,val_cible:1.0,unite:"%",taux:100,taux_land:100},{id:"1.1.2",parent:"1.1",title:"Nous poser en équipe et lister les cibles d'Ambassadeurs",poids:10.0,owner:"Thomas",priorite:"",stop:false,contributors:[],val_depart:0.0,val_actuel:1.0,val_revise:1.0,val_cible:1.0,unite:"oui/non",taux:100.0,taux_land:100.0},{id:"1.1.3",parent:"1.1",title:"Définir le bon fonctionnement, argumentaire, visuels, guide Groopay simplifié",poids:10.0,owner:"Thomas",priorite:"",stop:false,contributors:["Guillemette"],val_depart:0.0,val_actuel:1.0,val_revise:1.0,val_cible:1.0,unite:"%",taux:100,taux_land:100},{id:"1.1.4",parent:"1.1",title:"Valider ensemble le bon fontionnement commercial futur et l'équation économique liée",poids:10.0,owner:"Thomas",priorite:"",stop:false,contributors:["Fx"],val_depart:0.0,val_actuel:1.0,val_revise:1.0,val_cible:1.0,unite:"oui/non",taux:100.0,taux_land:100.0},{id:"1.1.5",parent:"1.1",title:'Contacter 30 "Ambassadeurs"',poids:20.0,owner:"Thomas",priorite:"STOP",stop:true,contributors:["Guillemette"],val_depart:0.0,val_actuel:5.0,val_revise:5.0,val_cible:30.0,unite:"nb",taux:16.7,taux_land:16.7},{id:"1.1.6",parent:"1.1",title:"Générer d'ici fin juin 3 commandes groupées minimum",poids:30.0,owner:"Thomas",priorite:"",stop:false,contributors:["Guillemette"],val_depart:0.0,val_actuel:1.0,val_revise:3.0,val_cible:3.0,unite:"nb",taux:33.3,taux_land:100},{id:"1.1.7",parent:"1.1",title:"Formaliser un retour d'expérience structuré après les premières ventes pour préparer la saison suivante.",poids:10.0,owner:"Thomas",priorite:"",stop:false,contributors:["Fx"],val_depart:0.0,val_actuel:0.0,val_revise:1.0,val_cible:1.0,unite:"oui/non",taux:0.0,taux_land:100.0}],people:["Christelle","Claire","Fiona","Fx","Gareth","Guillemette","Julie","Juliette","Maxime","Thomas"]};

const SEASONS=[
  {key:"printemps_2026",label:"Printemps ☘️ 2026",start:"2026-04-01",end:"2026-06-30"},
  {key:"ete_2026",label:"Été ☀️ 2026",start:"2026-07-01",end:"2026-09-30"},
  {key:"automne_2026",label:"Automne 🍂 2026",start:"2026-10-01",end:"2026-12-31"},
  {key:"hiver_2027",label:"Hiver ❄️ 2027",start:"2027-01-01",end:"2027-03-31"},
  {key:"printemps_2027",label:"Printemps 🌸 2027",start:"2027-04-01",end:"2027-06-30"},
  {key:"ete_2027",label:"Été 🌞 2027",start:"2027-07-01",end:"2027-09-30"},
  {key:"automne_2027",label:"Automne 🍁 2027",start:"2027-10-01",end:"2027-12-31"},
];

const OWNER_EMAIL = "fx@oeforgood.com";
const ALLOWED_DOMAIN = "oeforgood.com";
const OBJ_BG=["#dbeafe","#dcfce7","#fce7f3","#fef3c7","#ede9fe","#ffedd5","#e0f2fe","#f0fdf4","#fdf4ff","#fff7ed","#ecfdf5"];
const OBJ_TX=["#1e40af","#166534","#9d174d","#92400e","#5b21b6","#9a3412","#075985","#14532d","#701a75","#7c2d12","#064e3b"];
const P_BG=["#dbeafe","#dcfce7","#fce7f3","#fef3c7","#ede9fe","#ffedd5","#e0f2fe","#f0fdf4","#fdf4ff","#fff7ed","#ecfdf5","#e0f2fe"];
const P_TX=["#1e40af","#166534","#9d174d","#92400e","#5b21b6","#9a3412","#075985","#14532d","#701a75","#7c2d12","#064e3b","#075985"];
const INITIALS_MAP={Christelle:"Ch",Claire:"Cl",Fiona:"Fi",Fx:"Fx",Gareth:"Ga",Guillemette:"Gu",Julie:"Ju",Juliette:"Jt",Maxime:"Ma",Thomas:"Th"};
const ADMIN_PWD="Okr-FxH-1971";
const SALVE_GAP_MS=30*60*1000;

const DEFAULT_QUESTIONS=[
  {id:"q1",text:"Sur quoi tu t'es focusé(e) cette semaine ? *",type:"textarea",confidentiel:false},
  {id:"q2",text:"Quels sont tes plans et priorités pour la semaine prochaine, notamment pour bien atteindre les Key-Results de tes OKR ? *",type:"textarea",confidentiel:false},
  {id:"q3",text:"Qu'est-ce qui t'a donné le plus de joie cette semaine ? 😍 *",type:"textarea",confidentiel:false},
  {id:"q4",text:"Est-ce que tu as besoin d'aide sur certaines parties ? *",type:"textarea",confidentiel:false},
  {id:"q5",text:"Est-ce que tu as autre chose que tu voudrais partager ? *",type:"textarea",confidentiel:false},
  {id:"q6",text:"Souhaites-tu rajouter quelque chose confidentiellement ?",type:"textarea",confidentiel:true,note:"Seul ton référent verra ta réponse et celle-ci ne sera pas archivée."},
  {id:"q7",text:"Comment tu t'es senti(e) cette semaine ? *",type:"mood",confidentiel:false},
  {id:"q8",text:"La semaine prochaine : je suis ? *",type:"presence",confidentiel:false},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function ini(name){return INITIALS_MAP[name]||(name||"?").slice(0,2).toUpperCase()}
function pBg(name,people){const i=(people||[]).indexOf(name)%12;return P_BG[i<0?0:i]}
function pTx(name,people){const i=(people||[]).indexOf(name)%12;return P_TX[i<0?0:i]}
function progColor(v){return v>=80?"#2d6a4f":v>=50?"#b5680f":"#c0392b"}
function progColorRel(v,avg){return v>avg?"#2d6a4f":v>avg-10?"#b5680f":"#c0392b"}
function rnd(v){return Math.round(v*10)/10}
function getSeasonInfo(key){return SEASONS.find(s=>s.key===key)||SEASONS[0]}
function getSeasonProgress(key){
  const s=getSeasonInfo(key);
  const start=new Date(s.start),end=new Date(s.end),now=new Date();
  if(now<=start)return 0;if(now>=end)return 100;
  return Math.round((now-start)/(end-start)*100);
}
function makeFreshSeason(people){return{objectives:[],subobjectives:[],keyresults:[],people:[...people]};}
function calcSobj(sobjId,krs){
  const a=krs.filter(k=>k.parent===sobjId&&k.poids>0);
  const tw=a.reduce((s,k)=>s+k.poids,0);if(!tw)return 0;
  return a.reduce((s,k)=>s+k.taux*k.poids,0)/tw;
}
function calcObj(objId,sobjs,krs){
  const ss=sobjs.filter(s=>s.parent===objId);
  const tw=ss.reduce((s,o)=>s+o.poids,0);if(!tw)return 0;
  return ss.reduce((s,o)=>s+calcSobj(o.id,krs)*o.poids,0)/tw;
}
function calcWeightedAvg(objectives,sobjs,krs){
  const totalETP=objectives.reduce((s,o)=>s+(o.etp||0),0);if(!totalETP)return 0;
  return objectives.reduce((s,o)=>s+calcObj(o.id,sobjs,krs)*(o.etp||0),0)/totalETP;
}
function calcTaux(dep,act,cib,u){
  if(u==="oui/non")return act>=1?100:0;
  const sp=cib-dep;if(!sp)return act>=cib?100:0;
  return Math.max(0,Math.min(100,(act-dep)/sp*100));
}
function fmtV(v,u){
  if(u==="oui/non")return v>=1?"ok":"0";
  if(u==="€")return v>=1000?(v/1000).toFixed(1)+"k€":v+"€";
  if(u==="%"){if(v<=1&&v>0)return Math.round(v*100)+"%";return Math.round(v)+"%";}
  return v%1===0?String(v):v.toFixed(1);
}
function toEditVal(v,u){if(u==="%"){if(v<=1&&v>0)return Math.round(v*100);return Math.round(v);}return v;}
function fromEditVal(v,u){const n=parseFloat(v)||0;if(u==="%"){return n;}return n;}
function formatDate(ts){
  const d=new Date(ts);
  const day=d.getDate(),month=d.toLocaleString("fr-FR",{month:"short"});
  const h=String(d.getHours()).padStart(2,"0"),m=String(d.getMinutes()).padStart(2,"0");
  return `${day} ${month} ${h}h${m}`;
}

// Week key: "YYYY-WNN"
function getWeekKey(date){
  const d=new Date(date);
  // Use ISO week: Thursday of the week determines the year
  const thu=new Date(d);
  thu.setDate(d.getDate()-(d.getDay()||7)+4); // Thursday of current week
  const yr=thu.getFullYear();
  const jan4=new Date(yr,0,4); // Jan 4 is always in week 1
  const wk=Math.round(((thu-jan4)/86400000+jan4.getDay()||7)/7)+1;
  // Simpler: use the Monday-based calculation
  const dow=d.getDay()||7; // 1=Mon...7=Sun
  const mon=new Date(d);mon.setDate(d.getDate()-dow+1);
  const yr2=mon.getFullYear();
  const startOfYear=new Date(yr2,0,1);
  const startDow=startOfYear.getDay()||7;
  const startOfWeek1=new Date(yr2,0,1+(startDow<=4?1-startDow:8-startDow));
  const wk2=Math.floor((mon-startOfWeek1)/604800000)+1;
  return `${yr2}-W${String(wk2).padStart(2,"0")}`;
}
function getWeekBounds(weekKey){
  const [yr,wStr]=weekKey.split("-W");
  const jan1=new Date(+yr,0,1);
  const daysToMon=((8-jan1.getDay())%7)||7;
  const mon=new Date(jan1);mon.setDate(jan1.getDate()+daysToMon+(+wStr-2)*7);
  const fri=new Date(mon);fri.setDate(mon.getDate()+4);
  return{mon,fri};
}
function getUpdateWeekKey(){
  // Mon = previous week, Tue = blocked, Wed-Sun = current week
  const now=new Date();
  const dow=now.getDay();
  if(dow===2)return null; // Tuesday blocked
  if(dow===1){
    const prev=new Date(now);prev.setDate(now.getDate()-7);
    return getWeekKey(prev);
  }
  return getWeekKey(now);
}
function isUpdateLocked(){
  // Locked (non modifiable) if already submitted: Friday after 15h
  const now=new Date();
  const dow=now.getDay();
  if(dow===5&&now.getHours()>=15)return true;
  return false;
}
function isUpdateDeadlinePassed(){
  // Can no longer submit at all: Monday after 23h59
  // i.e. Tuesday = blocked (handled by weekKey=null)
  return false; // handled by weekKey===null for Tuesday
}
function isUpdateFinalizable(){
  return !isUpdateLocked();
}
function fmtWeekLabel(weekKey){
  const{mon,fri}=getWeekBounds(weekKey);
  const sameMonth=mon.getMonth()===fri.getMonth();
  if(sameMonth)return `lundi ${mon.getDate()} au vendredi ${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"long"})}`;
  return `lundi ${mon.getDate()} ${mon.toLocaleString("fr-FR",{month:"long"})} au vendredi ${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"long"})}`;
}
function getDaysInMonth(year,month){return new Date(year,month+1,0).getDate();}
function getFirstDayOfMonth(year,month){let d=new Date(year,month,1).getDay();return d===0?6:d-1;}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────
function Avatar({name,people,size=22}){
  const bg=pBg(name,people||[]),tx=pTx(name,people||[]);
  return <div title={name} style={{width:size,height:size,borderRadius:"50%",background:bg,color:tx,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:size<20?7:8,fontWeight:600,flexShrink:0,border:"1.5px solid white"}}>{ini(name)}</div>;
}
function AvatarRow({owner,contribs=[],people}){
  const others=contribs.filter(c=>c&&c!==owner);
  return <div style={{display:"flex",alignItems:"center",gap:4}}>
    <Avatar name={owner} people={people}/>
    {others.length>0&&<><span style={{fontSize:10,color:"#c5c0b8"}}>+</span>
    <div style={{display:"flex"}}>{others.map((p,i)=><div key={p} style={{marginLeft:i?-5:0}}><Avatar name={p} people={people}/></div>)}</div></>}
  </div>;
}
function Bar({v,w=200,h=10,label}){
  const c=progColor(v);
  return <div style={{display:"flex",alignItems:"center",gap:10}}>
    {label&&<span style={{fontSize:11,color:"#6b6560",minWidth:180,flexShrink:0}}>{label}</span>}
    <div style={{flex:1,height:h,background:"#e2ddd6",borderRadius:5,overflow:"hidden",minWidth:w}}>
      <div style={{width:`${Math.min(v,100)}%`,height:"100%",background:c,borderRadius:5,transition:"width .4s"}}/>
    </div>
  </div>;
}
function SmallBar({v,w=56,h=4}){
  const c=progColor(v);
  return <div style={{display:"flex",alignItems:"center",gap:6}}>
    <div style={{width:w,height:h,background:"#e2ddd6",borderRadius:3,overflow:"hidden"}}>
      <div style={{width:`${Math.min(v,100)}%`,height:"100%",background:c,borderRadius:3}}/>
    </div>
    <span style={{fontSize:12,fontWeight:600,color:c,minWidth:32,textAlign:"right",fontFamily:"monospace"}}>{Math.round(v)}%</span>
  </div>;
}
function Modal({title,children,onClose,onSave,onDelete,saveLabel="Enregistrer",wide=false}){
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:"#fff",borderRadius:12,padding:24,width:"90%",maxWidth:wide?700:540,maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box"}}>
      <div style={{fontSize:16,fontWeight:600,marginBottom:18}}>{title}</div>
      {children}
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:20}}>
        {onDelete&&<button onClick={onDelete} style={{marginRight:"auto",fontSize:13,fontWeight:500,background:"#fdecea",color:"#c0392b",border:"1px solid #fca5a5",padding:"7px 14px",borderRadius:6,cursor:"pointer"}}>Supprimer</button>}
        <button onClick={onClose} style={{fontSize:13,color:"#6b6560",border:"1px solid #e2ddd6",padding:"7px 14px",borderRadius:6,cursor:"pointer",background:"none"}}>Annuler</button>
        <button onClick={onSave} style={{fontSize:13,fontWeight:500,background:"#2d6a4f",color:"#fff",padding:"7px 18px",borderRadius:6,cursor:"pointer",border:"none"}}>{saveLabel}</button>
      </div>
    </div>
  </div>;
}
const INP={width:"100%",fontFamily:"inherit",fontSize:13,border:"1px solid #e2ddd6",borderRadius:6,padding:"7px 10px",outline:"none",boxSizing:"border-box"};
const LBL={display:"block",fontSize:12,fontWeight:500,color:"#6b6560",marginBottom:5};
function Field({label,children,style={}}){return <div style={{marginBottom:14,...style}}><label style={LBL}>{label}</label>{children}</div>}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({onLogin,error}){
  return <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#f0fdf4 0%,#dcfce7 50%,#f5f3ef 100%)",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{background:"#fff",borderRadius:16,padding:48,maxWidth:400,width:"90%",textAlign:"center",boxShadow:"0 4px 32px rgba(0,0,0,.1)"}}>
      <div style={{fontSize:40,marginBottom:8}}>🌼</div>
      <div style={{fontSize:28,fontWeight:700,color:"#2d6a4f",marginBottom:4}}>Calendula</div>
      <div style={{fontSize:14,color:"#6b6560",marginBottom:32}}>Outil de pilotage OKR & Updates Oé</div>
      <button onClick={onLogin} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,width:"100%",padding:"13px 20px",background:"#fff",border:"2px solid #e2ddd6",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:500,color:"#1a1814",transition:"border-color .2s"}}
        onMouseEnter={e=>e.currentTarget.style.borderColor="#2d6a4f"}
        onMouseLeave={e=>e.currentTarget.style.borderColor="#e2ddd6"}>
        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Se connecter avec Google
      </button>
      {error&&<p style={{marginTop:16,fontSize:12,color:"#c0392b",background:"#fdecea",padding:"8px 12px",borderRadius:6}}>{error}</p>}
      <p style={{marginTop:24,fontSize:11,color:"#9e9890"}}>Accès réservé aux membres de l'équipe Oé<br/>(@oeforgood.com)</p>
    </div>
  </div>;
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function get26Weeks(myUpdates){
  const now = new Date();
  const currentWk = getWeekKey(now);
  const weeks = [];
  for(let i=25; i>=0; i--){
    const d = new Date(now);
    d.setDate(now.getDate() - i*7);
    const wk = getWeekKey(d);
    const {mon,fri} = getWeekBounds(wk);
    const update = myUpdates.find(u=>u.weekKey===wk);
    let status = "none";
    if(update){
      const submDay = new Date(update.submittedAt).getDay();
      status = submDay===1 ? "late" : "done";
    }
    if(!update && wk===currentWk) status = "pending";
    weeks.push({wk,mon,fri,status,update,isCurrentWeek:wk===currentWk});
  }
  return weeks;
}

const DOT_COLORS = {
  done:    {bg:"#2d6a4f", border:"#2d6a4f"},
  late:    {bg:"#f59e0b", border:"#f59e0b"},
  none:    {bg:"#fca5a5", border:"#ef4444"},
  pending: {bg:"#e2ddd6", border:"#c5c0b8"},
};

function WeekDots({myUpdates, clickable=false, onClickUpdate}){
  const weeks = get26Weeks(myUpdates);
  const [hov,setHov]=useState(null);
  return <div style={{position:"relative",display:"flex",gap:4,flexWrap:"nowrap",alignItems:"center"}}>
    {hov!==null&&weeks[hov]&&(()=>{
      const w=weeks[hov];
      const sameM2=w.mon.getMonth()===w.fri.getMonth();
      const tip=sameM2
        ?`Semaine du lundi ${w.mon.getDate()} au vendredi ${w.fri.getDate()} ${w.fri.toLocaleString("fr-FR",{month:"long"})}`
        :`Semaine du lundi ${w.mon.getDate()} ${w.mon.toLocaleString("fr-FR",{month:"long"})} au vendredi ${w.fri.getDate()} ${w.fri.toLocaleString("fr-FR",{month:"long"})}`;
      const pct=hov/Math.max(weeks.length-1,1)*100;
      return <div style={{position:"absolute",top:-26,left:`${pct}%`,transform:"translateX(-50%)",background:"#1a1814",color:"#fff",fontSize:10,padding:"3px 8px",borderRadius:4,whiteSpace:"nowrap",zIndex:10,pointerEvents:"none"}}>{tip}</div>;
    })()}
    {weeks.map((w,i)=>{
      const c = DOT_COLORS[w.status];
      return <div key={i}
        onClick={()=>clickable&&w.update&&onClickUpdate&&onClickUpdate(w)}
        onMouseEnter={()=>setHov(i)}
        onMouseLeave={()=>setHov(null)}
        style={{
          width:14,height:14,borderRadius:"50%",
          background:c.bg,border:`1.5px solid ${c.border}`,
          flexShrink:0,
          cursor:clickable&&w.update?"pointer":"default",
          transition:"transform .1s",
          boxSizing:"border-box",
        }}
      />;
    })}
  </div>;
}

function UpdateStreakWithCurve({myUpdates, allUpdates=[], clickable=false, onClickUpdate, onGoUpdate, showDots=true}){
  const MOOD_SCORE = {"😊":5,"🙂":4,"😐":3,"😕":2,"😩":1};
  const now = new Date();
  const currentWkKey = getWeekKey(now);
  const currentDone = myUpdates.find(u=>u.weekKey===currentWkKey);

  const weeks = [];
  for(let i=25;i>=0;i--){
    const d=new Date(now);d.setDate(now.getDate()-i*7);
    const wk=getWeekKey(d);
    const {mon,fri}=getWeekBounds(wk);
    const update=myUpdates.find(u=>u.weekKey===wk);
    let status="none";
    if(update){const submDay=new Date(update.submittedAt).getDay();status=submDay===1?"late":"done";}
    if(!update&&wk===currentWkKey)status="pending";
    const wkUpdates=allUpdates.filter(u=>u.weekKey===wk&&u.answers?.q7);
    const scores=wkUpdates.map(u=>MOOD_SCORE[u.answers.q7]||3);
    const avg=scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:null;
    weeks.push({wk,mon,fri,status,update,isCurrentWeek:wk===currentWkKey,avg,count:scores.length});
  }

  const DOT_C={done:{bg:"#2d6a4f"},late:{bg:"#facc15"},none:{bg:"#ef4444"},pending:{bg:"#e2ddd6"}};
  const fmtD=d=>`${d.getDate()} ${d.toLocaleString("fr-FR",{month:"long"})}`;
  const fmtDShort=d=>`${d.getDate()} ${d.toLocaleString("fr-FR",{month:"short"})}`;

  // SVG dimensions
  const W=560,DOT_Y=10,CURVE_TOP=30,CURVE_H=90,AXIS_H=18,pad=7;
  const dotSpacing=(W-2*pad)/(weeks.length-1);
  const dotX=i=>pad+i*dotSpacing;
  const minV=1,maxV=5;
  const curveY=v=>CURVE_TOP+CURVE_H-((v-minV)/(maxV-minV))*CURVE_H;
  const validPts=weeks.map((w,i)=>({...w,i})).filter(w=>w.avg!==null);
  const pathD=validPts.map((w,j)=>`${j===0?"M":"L"}${dotX(w.i).toFixed(1)},${curveY(w.avg).toFixed(1)}`).join(" ");
  const colorForAvg=v=>v>=4?"#2d6a4f":v>=2.5?"#f59e0b":"#ef4444";
  const totalH=CURVE_TOP+CURVE_H+AXIS_H+2;

  // Month separators: find where month changes between weeks (skip first and last partial months)
  const monthSeps=[];
  const monthLabels=[];
  for(let i=1;i<weeks.length;i++){
    const prev=weeks[i-1].mon,cur=weeks[i].mon;
    if(cur.getMonth()!==prev.getMonth()){
      const x=dotX(i);
      monthSeps.push({x,i});
      // Label goes in the middle of the month span
      // Find end of this month
      let end=i;
      while(end<weeks.length-1&&weeks[end+1].mon.getMonth()===cur.getMonth())end++;
      // Only label if full month (not first partial, not last partial = current month)
      const isCurrentMonth=cur.getMonth()===new Date().getMonth()&&cur.getFullYear()===new Date().getFullYear();
      if(!isCurrentMonth&&end<weeks.length-1){
        const midX=(dotX(i)+dotX(end))/2;
        const label=cur.toLocaleString("fr-FR",{month:"long"});
        monthLabels.push({x:midX,label,i});
      }
    }
  }

  const [hoveredDot,setHoveredDot]=useState(null);
  return <div style={{position:"relative"}}>
    {hoveredDot!==null&&weeks[hoveredDot]&&(()=>{
      const w=weeks[hoveredDot];
      const sameM2=w.mon.getMonth()===w.fri.getMonth();
      const tip=sameM2
        ?`Semaine du lundi ${w.mon.getDate()} au vendredi ${w.fri.getDate()} ${w.fri.toLocaleString("fr-FR",{month:"long"})}`
        :`Semaine du lundi ${w.mon.getDate()} ${w.mon.toLocaleString("fr-FR",{month:"long"})} au vendredi ${w.fri.getDate()} ${w.fri.toLocaleString("fr-FR",{month:"long"})}`;
      const xPct=dotX(hoveredDot)/W*100;
      return <div style={{position:"absolute",top:-28,left:`${xPct}%`,transform:"translateX(-50%)",background:"#1a1814",color:"#fff",fontSize:10,padding:"3px 8px",borderRadius:4,whiteSpace:"nowrap",zIndex:10,pointerEvents:"none"}}>{tip}</div>;
    })()}
    <svg width="100%" viewBox={`0 0 ${W} ${totalH}`} style={{display:"block",overflow:"visible"}}>
      {/* Month separator lines */}
      {monthSeps.map((s,i)=><line key={i} x1={s.x} x2={s.x} y1={0} y2={CURVE_TOP+CURVE_H} stroke="#d5d0ca" strokeWidth="0.5"/>)}
      {/* Month labels on X axis */}
      {monthLabels.map((m,i)=><text key={i} x={m.x} y={totalH-2} fontSize="8" fill="#9e9890" textAnchor="middle">{m.label}</text>)}
      {/* Dots row */}
      {showDots&&weeks.map((w,i)=>{
        const c=DOT_C[w.status];
        return <circle key={i} cx={dotX(i)} cy={DOT_Y} r="5"
          fill={c.bg} stroke="#fff" strokeWidth="1.5"
          style={{cursor:clickable&&w.update?"pointer":"default"}}
          onMouseEnter={()=>setHoveredDot(i)}
          onMouseLeave={()=>setHoveredDot(null)}
          onClick={()=>clickable&&w.update&&onClickUpdate&&onClickUpdate(w)}/>;
      })}
      {/* Grid lines for curve */}
      {[1,2,3,4,5].map(v=><line key={v} x1={pad} x2={W-pad} y1={curveY(v)} y2={curveY(v)} stroke="#f0ede8" strokeWidth="0.8"/>)}
      {/* Y labels */}
      {[{v:5,l:"😊"},{v:3,l:"😐"},{v:1,l:"😩"}].map(({v,l})=>
        <text key={v} x={2} y={curveY(v)+4} fontSize="8" fill="#9e9890">{l}</text>
      )}
      {/* Curve */}
      {validPts.length>=2&&<path d={pathD} fill="none" stroke="#2d6a4f" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>}
      {/* Curve dots */}
      {validPts.map((w,j)=><circle key={j} cx={dotX(w.i)} cy={curveY(w.avg)} r="2.5" fill={colorForAvg(w.avg)} stroke="#fff" strokeWidth="1">
        <title>{`Mood moyen : ${w.avg.toFixed(1)}/5 (${w.count} réponses)`}</title>
      </circle>)}
    </svg>
    {/* Legend */}
    {showDots&&<div style={{display:"flex",gap:16,marginTop:6,fontSize:11,color:"#9e9890"}}>
      <span><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#2d6a4f",marginRight:4,verticalAlign:"middle"}}/>Fait en semaine</span>
      <span><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#facc15",marginRight:4,verticalAlign:"middle"}}/>Fait le lundi</span>
      <span><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#ef4444",marginRight:4,verticalAlign:"middle"}}/>Non fait</span>
      <span style={{marginLeft:"auto"}}>Courbe : mood équipe</span>
    </div>}
  </div>;
}

function UpdateStreak({myUpdates, allUpdates=[], onGoUpdate}){
  return <UpdateStreakWithCurve myUpdates={myUpdates} allUpdates={allUpdates} clickable={false} onGoUpdate={onGoUpdate}/>;
}

function NotifDetail({notif}){
  const answers=notif?.answers||{};
  const moodVal=answers.q7||"";
  const visibleQs=DEFAULT_QUESTIONS.filter(q=>answers[q.id]);
  return <div>
    {moodVal&&<div style={{fontSize:28,marginBottom:12}}>{moodVal}</div>}
    {visibleQs.map(q=>{
      const val=answers[q.id];if(!val)return null;
      if(q.type==="mood")return null;
      if(q.type==="presence")return <div key={q.id} style={{marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:600,color:"#9e9890",marginBottom:3}}>{q.text.replace(" *","")}</div>
        <div style={{fontSize:13,background:"#f5f3ef",borderRadius:6,padding:"5px 10px"}}>{val}</div>
      </div>;
      return <div key={q.id} style={{marginBottom:10,background:q.confidentiel?"#fdf4ff":"transparent",padding:q.confidentiel?"6px 10px":"0",borderRadius:q.confidentiel?6:0}}>
        <div style={{fontSize:11,fontWeight:600,color:q.confidentiel?"#a21caf":"#9e9890",marginBottom:3}}>{q.confidentiel?"🔒 ":""}{q.text.replace(" *","")}</div>
        <div style={{fontSize:13,whiteSpace:"pre-wrap",color:"#1a1814"}}>{val}</div>
      </div>;
    })}
  </div>;
}

function MessagesPanel({managerNotifs,teammateNotifs=[],onReadNotif,teamMember,myUpdates=[]}){
  const [selected,setSelected]=useState(null);
  // Include manager notifs (update notifications) + system messages
  // System messages: Monday morning greeting, season prep reminder
  const now=new Date();
  const GREETINGS=[
    {id:"g1",text:"🌅 Belle semaine en perspective !",content:"Bonjour ! Une nouvelle semaine commence — que ce soit une semaine productive, riche en échanges et en avancées sur tes OKR. N'hésite pas à partager tes priorités via ton Update. Bonne semaine à toi ! 🌼"},
    {id:"g2",text:"☀️ Prêt(e) à démarrer fort ?",content:"Salut ! C'est reparti pour une semaine. Prends un moment pour clarifier tes priorités, avance sur tes Key Results, et pense à compléter ton Update. Tu assures ! 💪"},
    {id:"g3",text:"🌿 C'est lundi, c'est Calendula !",content:"Nouvelle semaine, nouvelles opportunités ! Pense à consulter les OKR de ton équipe et à planifier tes actions. Et n'oublie pas ton Update hebdomadaire pour garder tout le monde aligné. 🌼"},
    {id:"g4",text:"🎯 Focus et sérénité pour cette semaine !",content:"Bonjour ! Avant de te lancer dans le sprint de la semaine, prends deux minutes pour te poser : quelles sont tes 3 priorités ? Comment est-ce que tu contribues aux OKR d'Oé ? Belle semaine à toi ! ✨"},
  ];
  const dow=now.getDay();
  const weekNum=Math.ceil(now.getDate()/7);
  const greeting=dow===1?GREETINGS[weekNum%GREETINGS.length]:null;

  // Season prep message: Tuesday between 14th-20th of month 3 of season
  const SEASON_MONTHS={printemps_2026:6,ete_2026:9,automne_2026:12,hiver_2027:3,printemps_2027:6,ete_2027:9,automne_2027:12};
  const NEXT_SEASON_LABELS={printemps_2026:"Été 2026",ete_2026:"Automne 2026",automne_2026:"Hiver 2027",hiver_2027:"Printemps 2027",printemps_2027:"Été 2027",ete_2027:"Automne 2027",automne_2027:"Hiver 2028"};
  let seasonPrepMsg=null;
  // Find current season
  const SEASONS_KEYS=["printemps_2026","ete_2026","automne_2026","hiver_2027","printemps_2027","ete_2027","automne_2027"];
  const curSeasonKey=SEASONS_KEYS.find(k=>{const s=getSeasonInfo(k);return now>=new Date(s.start)&&now<=new Date(s.end);})||"printemps_2026";
  const prepMonth=SEASON_MONTHS[curSeasonKey];
  if(prepMonth&&now.getMonth()+1===prepMonth&&now.getDate()>=14&&now.getDate()<=20&&now.getDay()===2){
    const nextLabel=NEXT_SEASON_LABELS[curSeasonKey]||"la prochaine saison";
    seasonPrepMsg={id:"season_prep",text:`🗓️ Préparation des OKR — ${nextLabel}`,
      content:`Salut ${teamMember?.prenom||""} ! La saison touche à sa fin et il est temps de préparer tes OKR pour ${nextLabel}. Prends le temps de réfléchir à tes objectifs, de les discuter avec ton référent, et de les saisir dans Calendula. Une bonne préparation, c'est la clé d'une saison réussie ! Tu peux le faire 🌼`};
  }

  // Build all messages: system first, then notifs (newest first)
  // On Monday, check previous week's update; otherwise check current week
  const currentWkKey2=getUpdateWeekKey()||getWeekKey(now);
  const updateDone=myUpdates.find(u=>u.weekKey===currentWkKey2);
  const reminderMsgs=[];

  // Monday morning: remind if no update yet
  if(dow===1&&now.getHours()>=8&&!updateDone){
    reminderMsgs.push({id:"mon_reminder",title:"🌅 Pense à faire ton Update de la semaine !",
      content:`Bonjour ${teamMember?.prenom||""} ! C'est lundi, dernière chance pour compléter ton Update de la semaine passée. Prends 5 minutes pour partager tes avancées — ça aide tout le monde à rester aligné. À toi de jouer ! 🌼`});
  }

  // Friday reminders
  if(dow===5){
    if(!updateDone){
      reminderMsgs.push({id:"fri_update",title:"⏰ Pense à faire ton Update avant 15h !",
        content:`C'est vendredi ! Tu as jusqu'à 15h pour compléter ton Update de la semaine. Partage tes avancées et priorités — ça ne prend que quelques minutes. 🌼`});
    }
  }

  const systemMsgs=[];
  if(greeting)systemMsgs.push({id:greeting.id,title:greeting.text,content:greeting.content,date:now,read:true,isSystem:true});
  if(seasonPrepMsg)systemMsgs.push({id:seasonPrepMsg.id,title:seasonPrepMsg.text,content:seasonPrepMsg.content,date:now,read:true,isSystem:true});
  // Tuesday 7h: if update not done by Monday, remind manager (shown as system msg for manager)
  // This is shown to the user themselves as a heads-up that their manager was notified
  if(dow===2&&now.getHours()>=7&&!updateDone){
    reminderMsgs.push({id:"tue_late",title:"⚠️ Ton Update n'a pas été fait lundi",
      content:`Ton référent a été notifié que ton Update de la semaine n'a pas encore été complété. N'oublie pas de le faire dès que possible — les Updates hebdomadaires sont importants pour le suivi de l'équipe ! 🌼`});
  }
  reminderMsgs.forEach(m=>systemMsgs.push({...m,date:now,read:false,isSystem:true}));

  const notifMsgs=managerNotifs
    .filter(n=>!n.pending) // only show delivered notifications
    .map(n=>{
      const{mon,fri}=getWeekBounds(n.weekKey);
      const fmtD=d=>`${d.getDate()} ${d.toLocaleString("fr-FR",{month:"long"})}`;
      // Use updatedAt if available (last modification), otherwise submittedAt
      const msgDate=new Date(n.updatedAt||n.submittedAt);
      return{id:n.id,title:`Nouvel Update de ${n.fromPrenom}`,content:null,notif:n,date:msgDate,read:n.read,isSystem:false,fromPrenom:n.fromPrenom,weekLabel:(mon.getMonth()===fri.getMonth()?`lundi ${mon.getDate()} au vendredi ${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"long"})}`:`lundi ${mon.getDate()} ${mon.toLocaleString("fr-FR",{month:"long"})} au vendredi ${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"long"})}`)};
    }).sort((a,b)=>b.date-a.date);

  // Teammate notifications (manager read your update)
  const tmMsgs=teammateNotifs.map(n=>({
    id:n.id,title:n.title||`${n.fromPrenom} a vu ton Update`,content:n.message,
    date:new Date(n.createdAt),read:n.read,isSystem:true,isTmNotif:true,tmNotifId:n.id,
  }));

  const allMsgs=[...systemMsgs,...tmMsgs,...notifMsgs].sort((a,b)=>b.date-a.date);

  return <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2ddd6",marginBottom:16,boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
    <div style={{padding:"12px 18px",borderBottom:"1px solid #f0ede8",fontSize:12,fontWeight:600,color:"#6b6560",textTransform:"uppercase",letterSpacing:".05em"}}>
      Messages {notifMsgs.filter(m=>!m.read).length>0&&<span style={{background:"#2d6a4f",color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,marginLeft:6,fontWeight:500}}>{notifMsgs.filter(m=>!m.read).length}</span>}
    </div>
    <div style={{maxHeight:140,overflowY:"auto",padding:"6px 0"}}>
      {allMsgs.length===0&&<div style={{padding:"16px 18px",fontSize:13,color:"#9e9890",textAlign:"center"}}>Aucun message</div>}
       {allMsgs.map(msg=><div key={msg.id} onClick={()=>{
         setSelected(msg);
         // Auto-mark notif as read and notify teammate when opening
         if(!msg.isSystem&&msg.notif&&!msg.notif.read){onReadNotif&&onReadNotif(msg.notif);}
         if(msg.isTmNotif&&!msg.read){updateDoc(doc(db,"teammate_notifications",msg.tmNotifId),{read:true}).catch(()=>{});}
       }}
         style={{display:"flex",alignItems:"center",gap:10,padding:"7px 18px",cursor:"pointer",borderBottom:"1px solid #f8f7f5",background:"transparent"}}
         onMouseEnter={e=>e.currentTarget.style.background="#f8f7f5"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
         {!msg.read?<span style={{width:8,height:8,borderRadius:"50%",background:"#2d6a4f",flexShrink:0,display:"inline-block"}}/>:<span style={{width:8,flexShrink:0}}/>}
         <span style={{fontSize:11,color:msg.read?"#c5c0b8":"#9e9890",minWidth:90,flexShrink:0}}>{msg.date.toLocaleDateString("fr-FR",{day:"2-digit",month:"short"})} {msg.date.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</span>
         <span style={{fontSize:13,color:msg.read?"#c5c0b8":"#1a1814",fontWeight:msg.read?400:500,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textDecoration:msg.read?"line-through":"none"}}>{msg.title}</span>
       </div>)}
     </div>
    {selected&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
      <div style={{background:"#fff",borderRadius:12,padding:24,width:"90%",maxWidth:520,maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4,flexWrap:"wrap"}}>
          <span style={{fontSize:15,fontWeight:600}}>{selected.title}</span>
          {!selected.isSystem&&selected.notif&&<span style={{fontSize:11,color:"#c0392b",marginLeft:"auto",textAlign:"right"}}>{selected.notif.fromPrenom} a été informé(e) que tu as vu son Update.</span>}
        </div>
        <div style={{fontSize:11,color:"#9e9890",marginBottom:4}}>{selected.date.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})} à {selected.date.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</div>
        {!selected.isSystem&&selected.notif?.weekKey&&<div style={{fontSize:11,color:"#9e9890",marginBottom:18}}>Semaine du {fmtWeekLabel(selected.notif.weekKey)}</div>}
        {selected.isSystem&&<div style={{marginBottom:14}}/>}
        {selected.isSystem
          ?<div style={{fontSize:13,color:"#1a1814",lineHeight:1.6}}>{selected.content}</div>
          :<NotifDetail notif={selected.notif} onRead={()=>{onReadNotif&&onReadNotif(selected.notif);setSelected(null);}}/>
        }

      </div>
    </div>}
  </div>;
}

function Dashboard({currentUser,teamMember,onGoOKR,onGoUpdate,myUpdates,allUpdates,managerNotifs,teammateNotifs=[],onReadNotif,okrData,isAdmin,onOpenSettings}){
  const {objectives=[],subobjectives=[],keyresults=[],seasonKey="printemps_2026"}=okrData||{};
  const avgProg=calcWeightedAvg(objectives,subobjectives,keyresults);
  const totalKR=keyresults.length,doneKR=keyresults.filter(k=>k.taux>=100).length;
  const myPrenom=teamMember?.prenom;
  const myKRs=keyresults.filter(k=>k.owner===myPrenom||k.contributors?.includes(myPrenom));
  const myKRDone=myKRs.filter(k=>k.taux>=100).length;

  // Personal weighted progress: weight = KR_poids * sobj_poids * obj_etp
  // Owner-only KRs for personal progress (not contributor)
  const myKRsOwned=useMemo(()=>keyresults.filter(k=>k.owner===myPrenom),[keyresults,myPrenom]);
  const myKRDoneOwned=useMemo(()=>myKRsOwned.filter(k=>k.taux>=100).length,[myKRsOwned]);
  const myPersonalProg=useMemo(()=>{
    let totalW=0,weightedSum=0;
    myKRsOwned.filter(k=>k.poids>0).forEach(kr=>{
      const sobj=subobjectives.find(s=>s.id===kr.parent);
      const obj=objectives.find(o=>o.id===sobj?.parent);
      // Even if sobj/obj not found, still count the KR with flat weight
      const sobjPoids=sobj?sobj.poids:100;
      const objEtp=obj?Math.max(obj.etp||0,0.01):1;
      const w=kr.poids*(sobjPoids/100)*objEtp;
      const taux=parseFloat(kr.taux)||0;
      totalW+=w;
      weightedSum+=taux*w;
    });
    return totalW>0?Math.round(weightedSum/totalW*10)/10:0;
  },[myKRsOwned,subobjectives,objectives]);

  const weekKey=getUpdateWeekKey();
  const todayUpdate=weekKey?myUpdates.find(u=>u.weekKey===weekKey):null;
  const unread=managerNotifs.filter(n=>!n.read);

  return <div style={{minHeight:"100vh",background:"#f5f3ef",fontFamily:"system-ui,sans-serif"}}>
    <div style={{background:"rgba(245,243,239,.95)",borderBottom:"1px solid #e2ddd6",padding:"10px 20px",display:"flex",alignItems:"center",gap:12}}>
      <span style={{fontSize:18,fontWeight:700,color:"#2d6a4f",letterSpacing:"-.3px"}}>🌼 Calendula</span>
      <div style={{flex:1}}/>
      <span style={{fontSize:13,color:"#6b6560"}}>{teamMember?.prenom}</span>
      {isAdmin&&<button onClick={onOpenSettings} title="Paramètres" style={{width:32,height:32,borderRadius:8,border:"1px solid #e2ddd6",background:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#6b6560",fontSize:16}}
        onMouseEnter={e=>e.currentTarget.style.background="#f5f3ef"} onMouseLeave={e=>e.currentTarget.style.background="none"}>⚙️</button>}
      <button onClick={()=>signOut(auth)} style={{fontSize:12,color:"#9e9890",background:"none",border:"1px solid #e2ddd6",borderRadius:6,padding:"4px 10px",cursor:"pointer"}}>Déconnexion</button>
    </div>

    <div style={{maxWidth:1100,margin:"0 auto",padding:"16px 16px 60px"}}>


      {/* Season banners */}
      <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:16}}>
        <SeasonBanner seasonKey={seasonKey||"printemps_2026"} avgProg={avgProg} totalKR={totalKR} doneKR={doneKR}/>
        {myKRsOwned.length>0&&<PersonalBanner prog={myPersonalProg} doneKR={myKRDoneOwned} totalKR={myKRsOwned.length} label={myPrenom||"Moi"} marginBottom={0} avgProg={avgProg}/>}
      </div>

      {/* KPIs */}
      {/* Update card + buttons row */}
      <div style={{display:"grid",gridTemplateColumns:"160px 1fr 1fr",gap:12,marginBottom:16,alignItems:"stretch"}}>
        {/* Update cette semaine card */}
        <div style={{background:"#fff",borderRadius:10,padding:"14px 16px",border:"1px solid #e2ddd6",boxShadow:"0 1px 3px rgba(0,0,0,.06)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
          <div style={{fontSize:10,color:"#9e9890",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em",fontWeight:500}}>Update cette semaine</div>
          {todayUpdate
            ?<div style={{fontSize:44,lineHeight:1,marginBottom:4}}>{todayUpdate.answers?.q7||"✅"}</div>
            :<button onClick={onGoUpdate} style={{marginTop:4,padding:"7px 10px",background:"#fef3c7",border:"1px solid #f59e0b",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:500,color:"#92400e",textAlign:"center",width:"100%"}}>
              ⏳ Compléter
            </button>}
          <div style={{fontSize:10,color:"#9e9890",marginTop:4}}>
            {todayUpdate?"Mood de la semaine":weekKey===null?"Mardi : bloqué":"À compléter"}
          </div>
        </div>
        {/* Big buttons */}
        <button onClick={onGoOKR} style={{padding:"16px 20px",background:"#fff",color:"#1a1814",border:"1px solid #e2ddd6",borderRadius:10,cursor:"pointer",textAlign:"left",boxShadow:"0 1px 3px rgba(0,0,0,.06)",transition:"box-shadow .15s,transform .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,.1)";e.currentTarget.style.transform="translateY(-1px)";}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.06)";e.currentTarget.style.transform="none";}}>
          <div style={{fontSize:22,marginBottom:6}}>📊</div>
          <div style={{fontSize:14,fontWeight:500,color:"#1a1814",marginBottom:3,fontFamily:"system-ui,sans-serif"}}>Mettre à jour les OKR</div>
          <div style={{fontSize:11,color:"#9e9890"}}>Suivre l'avancement de la saison</div>
        </button>
        <button onClick={onGoUpdate} style={{padding:"16px 20px",background:"#fff",color:"#1a1814",border:"1px solid #e2ddd6",borderRadius:10,cursor:"pointer",textAlign:"left",boxShadow:"0 1px 3px rgba(0,0,0,.06)",transition:"box-shadow .15s,transform .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,.1)";e.currentTarget.style.transform="translateY(-1px)";}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.06)";e.currentTarget.style.transform="none";}}>
          <div style={{fontSize:22,marginBottom:6}}>✍️</div>
          <div style={{fontSize:14,fontWeight:500,color:"#1a1814",marginBottom:3,fontFamily:"system-ui,sans-serif"}}>Mes Updates</div>
          <div style={{fontSize:11,color:"#9e9890"}}>Partager mes priorités de la semaine</div>
        </button>
      </div>

      {/* Messages panel */}
      <MessagesPanel managerNotifs={managerNotifs} teammateNotifs={teammateNotifs} onReadNotif={onReadNotif} teamMember={teamMember} myUpdates={myUpdates}/>

      {/* Update streak */}
      <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2ddd6",padding:"16px 20px",marginBottom:16,boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
        <div style={{fontSize:12,fontWeight:600,color:"#6b6560",textTransform:"uppercase",letterSpacing:".05em",marginBottom:12}}>Mood de l'équipe</div>
        <UpdateStreakWithCurve myUpdates={myUpdates} allUpdates={allUpdates} clickable={false} onGoUpdate={onGoUpdate} showDots={false}/>
      </div>


    </div>

  </div>;
}

function UpdateCalendar({myUpdates,onView}){
  const now=new Date();
  const yr=now.getFullYear(),mo=now.getMonth();
  const days=getDaysInMonth(yr,mo),firstDay=getFirstDayOfMonth(yr,mo);
  const cells=Array(firstDay).fill(null).concat(Array.from({length:days},(_,i)=>i+1));
  return <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
    {["L","M","M","J","V","S","D"].map((d,i)=><div key={i} style={{textAlign:"center",fontSize:10,fontWeight:600,color:"#9e9890",padding:"4px 0"}}>{d}</div>)}
    {cells.map((day,i)=>{
      if(!day)return <div key={i}/>;
      const date=new Date(yr,mo,day);
      const wk=getWeekKey(date);
      const update=myUpdates.find(u=>u.weekKey===wk);
      const isMon=date.getDay()===1;
      return <div key={i} onClick={()=>update&&isMon&&onView(update)}
        style={{aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",fontSize:12,fontWeight:500,cursor:update&&isMon?"pointer":"default",background:update&&isMon?"#2d6a4f":"transparent",color:update&&isMon?"#fff":"#1a1814",border:isMon&&!update?"1px dashed #e2ddd6":"none"}}>
        {day}
        {update&&!isMon&&<div style={{width:5,height:5,borderRadius:"50%",background:"#2d6a4f",position:"absolute",marginTop:14}}/>}
      </div>;
    })}
  </div>;
}

function UpdateViewModal({notif,onClose,onRead}){
  const u=notif.updateData||notif;
  const weekLabel=notif.weekKey?fmtWeekLabel(notif.weekKey):"";
  const answers=u.answers||u.updateData?.answers||{};
  const moodVal=answers.q7||"";
  // Show questions in DEFAULT_QUESTIONS order, skip q7 (shown in title), include q6 if present
  const visibleQs=DEFAULT_QUESTIONS.filter(q=>q.id!=="q7"&&answers[q.id]);
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:"#fff",borderRadius:12,padding:28,width:"90%",maxWidth:580,maxHeight:"85vh",overflowY:"auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
        <div style={{fontSize:16,fontWeight:600}}>Update de {notif.fromPrenom}</div>
        {moodVal&&<span style={{fontSize:26,lineHeight:1}}>{moodVal}</span>}
      </div>
      <div style={{fontSize:12,color:"#9e9890",marginBottom:20}}>Semaine du {weekLabel}</div>
      {visibleQs.map(q=>{
        const val=answers[q.id];
        if(!val)return null;
        if(q.type==="presence")return <div key={q.id} style={{marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:600,color:"#9e9890",marginBottom:4}}>{q.text.replace(" *","")}</div>
          <div style={{fontSize:13,background:"#f5f3ef",borderRadius:6,padding:"6px 10px"}}>{val}</div>
        </div>;
        return <div key={q.id} style={{marginBottom:14,background:q.confidentiel?"#fdf4ff":"transparent",padding:q.confidentiel?"8px 10px":"0",borderRadius:q.confidentiel?6:0,border:q.confidentiel?"1px solid #e9d5ff":"none"}}>
          <div style={{fontSize:11,fontWeight:600,color:q.confidentiel?"#a21caf":"#9e9890",marginBottom:4}}>
            {q.confidentiel?"🔒 ":""}{q.text.replace(" *","").replace(" ?","").trim()+" ?"}
          </div>
          <div style={{fontSize:13,whiteSpace:"pre-wrap",color:"#1a1814"}}>{val}</div>
        </div>;
      })}
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:20,borderTop:"1px solid #e2ddd6",paddingTop:16}}>
        <button onClick={onClose} style={{fontSize:13,color:"#6b6560",border:"1px solid #e2ddd6",padding:"7px 14px",borderRadius:6,cursor:"pointer",background:"none"}}>Fermer</button>
        {!notif.isOwn&&!notif.read&&<button onClick={onRead} style={{fontSize:13,fontWeight:500,background:"#2d6a4f",color:"#fff",padding:"7px 18px",borderRadius:6,cursor:"pointer",border:"none"}}>✓ Marquer comme lu</button>}
      </div>
    </div>
  </div>;
}

// ─── UPDATE QUESTIONNAIRE ─────────────────────────────────────────────────────
const MOODS=["😊","🙂","😐","😕","😩"];
const PRESENCES=["Au boulot au moins deux jours","En congés","À l'école"];

function UpdatePage({teamMember,questions,onSubmit,onDelete,onBack,myUpdates}){
  const weekKey=getUpdateWeekKey();
  const existing=weekKey?myUpdates.find(u=>u.weekKey===weekKey):null;
  const [answers,setAnswers]=useState(existing?.answers||{});
  // Show as submitted only if existing update exists (regardless of lock)
  // User can still submit even after 15h if they haven't submitted yet
  const [submitted,setSubmitted]=useState(!!existing);
  const [viewUpdate,setViewUpdate]=useState(null);
  const [selectedWeek,setSelectedWeek]=useState(null);

  if(!weekKey)return <div style={{minHeight:"100vh",background:"#f5f3ef",display:"flex",flexDirection:"column"}}>
    <TopBar onBack={onBack} title="Mes Updates"/>
    <div style={{display:"flex",flex:1,alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
      <div style={{fontSize:48}}>🚫</div>
      <div style={{fontSize:16,fontWeight:600,color:"#1a1814"}}>Pas d'update le mardi</div>
      <div style={{fontSize:13,color:"#9e9890"}}>L'update se complète le lundi (semaine passée) ou du mercredi au vendredi (semaine en cours).</div>
    </div>
  </div>;



  const{mon,fri}=getWeekBounds(weekKey);
  const fmtD=d=>`${d.getDate()} ${d.toLocaleString("fr-FR",{month:"long"})}`;
  const weekLabel=`lundi ${fmtD(mon)} au vendredi ${fmtD(fri)}`;

  function upd(qid,val){setAnswers(p=>({...p,[qid]:val}));}
  async function handleSubmit(){
    const now=new Date(),dow=now.getDay(),h=now.getHours();
    // Notify immediately: Monday, or Fri after 15h, Sat, Sun
    // Pending (wait for Fri 15h): Wed, Thu, Fri before 15h
    const notifyNow=dow===1||(dow===5&&h>=15)||dow===6||dow===0;
    await onSubmit({weekKey,answers,prenom:teamMember.prenom,email:teamMember.email,managerEmail:teamMember.managerEmail,submittedAt:Date.now(),notifyManager:notifyNow});
    setSubmitted(true);
  }

  // Monthly calendar
  const now=new Date();

  return <div style={{minHeight:"100vh",background:"#f5f3ef",fontFamily:"system-ui,sans-serif"}}>
    <TopBar onBack={onBack} title="Mes Updates" left={<span style={{fontSize:16,fontWeight:700,color:"#2d6a4f",cursor:"pointer"}} onClick={onBack}>🌼 Calendula</span>}/>
    <div style={{maxWidth:680,margin:"0 auto",padding:"24px 16px 60px"}}>

      {/* 26-week dots */}
      <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2ddd6",padding:"16px 20px",marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
        <div style={{fontSize:12,fontWeight:600,color:"#6b6560",textTransform:"uppercase",letterSpacing:".05em",marginBottom:12}}>Mes updates ces 6 derniers mois</div>
        <WeekDots myUpdates={myUpdates} clickable={true} onClickUpdate={w=>setSelectedWeek(w)}/>
        <div style={{display:"flex",gap:16,marginTop:10,fontSize:11,color:"#9e9890"}}>
          <span><span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:"#2d6a4f",marginRight:4,verticalAlign:"middle"}}/>Fait en semaine</span>
          <span><span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:"#facc15",marginRight:4,verticalAlign:"middle"}}/>Fait le lundi</span>
          <span><span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:"#fca5a5",marginRight:4,verticalAlign:"middle"}}/>Non fait</span>
        </div>
      </div>

      <div style={{fontSize:13,color:"#6b6560",marginBottom:16}}>Semaine du {weekLabel}</div>

      {submitted?<div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:10,padding:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <span style={{fontSize:24}}>✅</span>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:"#166534"}}>Update enregistré !</div>
            <div style={{fontSize:12,color:"#6b6560"}}>{isUpdateLocked()?"Non modifiable (délai vendredi 15h dépassé).":"Modifiable jusqu'au vendredi 15h."}</div>
          </div>
          {!isUpdateLocked()&&<button onClick={()=>setSubmitted(false)} style={{marginLeft:"auto",fontSize:12,color:"#1d4ed8",background:"none",border:"1px solid #1d4ed8",borderRadius:6,padding:"5px 12px",cursor:"pointer"}}>Modifier</button>}
        </div>
        {/* Show answers read-only */}
        <div style={{display:"flex",flexDirection:"column",gap:10,opacity:0.85}}>
          {(questions||DEFAULT_QUESTIONS).filter(q=>answers[q.id]).map(q=>{
            const val=answers[q.id];
            if(q.type==="mood")return <div key={q.id} style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:11,color:"#9e9890",flex:1}}>{q.text.replace(" *","")}</span><span style={{fontSize:22}}>{val}</span></div>;
            if(q.type==="presence")return <div key={q.id}><span style={{fontSize:11,color:"#9e9890"}}>{q.text.replace(" *","")}</span><div style={{fontSize:12,background:"#fff",borderRadius:6,padding:"4px 8px",marginTop:3}}>{val}</div></div>;
            return <div key={q.id} style={{background:q.confidentiel?"#fdf4ff":"#fff",borderRadius:6,padding:"8px 10px",border:"1px solid #e2ddd6"}}>
              <div style={{fontSize:10,fontWeight:600,color:q.confidentiel?"#a21caf":"#9e9890",marginBottom:3}}>{q.confidentiel?"🔒 ":""}{q.text.replace(" *","")}</div>
              <div style={{fontSize:12,whiteSpace:"pre-wrap",color:"#1a1814"}}>{val}</div>
            </div>;
          })}
        </div>
      </div>:!weekKey?<div style={{textAlign:"center",padding:32,color:"#9e9890"}}>Pas d'update possible aujourd'hui.</div>:<>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {(questions||DEFAULT_QUESTIONS).map(q=>{
            if(q.type==="mood")return <div key={q.id} style={{background:"#fff",borderRadius:10,border:"1px solid #e2ddd6",padding:"16px 20px"}}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:12,color:"#1a1814"}}>{q.text}</div>
              <div style={{display:"flex",gap:12}}>
                {MOODS.map(m=><button key={m} onClick={()=>upd(q.id,m)} style={{fontSize:28,background:answers[q.id]===m?"#f0fdf4":"none",border:answers[q.id]===m?"2px solid #2d6a4f":"2px solid transparent",borderRadius:10,padding:"6px 10px",cursor:"pointer",transition:"all .15s"}}>{m}</button>)}
              </div>
            </div>;
            if(q.type==="presence")return <div key={q.id} style={{background:"#fff",borderRadius:10,border:"1px solid #e2ddd6",padding:"16px 20px"}}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:12,color:"#1a1814"}}>{q.text}</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {PRESENCES.map(p=><label key={p} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"8px 12px",borderRadius:8,border:`1px solid ${answers[q.id]===p?"#2d6a4f":"#e2ddd6"}`,background:answers[q.id]===p?"#f0fdf4":"#fff"}}>
                  <input type="radio" checked={answers[q.id]===p} onChange={()=>upd(q.id,p)} style={{accentColor:"#2d6a4f"}}/><span style={{fontSize:13}}>{p}</span>
                </label>)}
              </div>
            </div>;
            return <div key={q.id} style={{background:q.confidentiel?"#fdf4ff":"#fff",borderRadius:10,border:`1px solid ${q.confidentiel?"#d946ef":"#e2ddd6"}`,padding:"14px 18px"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:q.confidentiel&&q.note?6:10}}>
                <div style={{fontSize:13,fontWeight:500,color:"#1a1814",flex:1}}>{q.text}</div>
                {q.confidentiel&&<span style={{fontSize:10,background:"#fdf4ff",color:"#a21caf",border:"1px solid #d946ef",borderRadius:10,padding:"2px 7px",flexShrink:0}}>🔒 Confidentiel</span>}
              </div>
              {q.confidentiel&&q.note&&<div style={{fontSize:11,color:"#9e9890",marginBottom:10,fontStyle:"italic"}}>{q.note}</div>}
              <textarea value={answers[q.id]||""} onChange={e=>upd(q.id,e.target.value)} rows={3}
                style={{...INP,resize:"vertical",fontFamily:"inherit",fontSize:13}}
                placeholder={q.confidentiel?"Ta réponse restera confidentielle…":"Ta réponse…"}/>
            </div>;
          })}
        </div>
        {(()=>{
          const requiredQs=(questions||DEFAULT_QUESTIONS).filter(q=>q.type==="textarea"&&!q.confidentiel||(q.type==="mood"||q.type==="presence"));
          const allFilled=requiredQs.every(q=>answers[q.id]&&String(answers[q.id]).trim().length>0);
          return <div style={{display:"flex",gap:10,marginTop:20}}>
            <button onClick={async()=>{
              if(!window.confirm("Supprimer définitivement cet update ?"))return;
              await onDelete&&onDelete(weekKey);
              setAnswers({});setSubmitted(false);
            }} style={{padding:"10px 14px",background:"#fff",color:"#c0392b",border:"1px solid #fca5a5",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:500}}>
              🗑️ Supprimer mon Update
            </button>
            <button onClick={allFilled?handleSubmit:undefined} style={{flex:1,padding:"10px 18px",background:allFilled?"#fff":"#f5f3ef",color:allFilled?"#2d6a4f":"#c5c0b8",border:`1px solid ${allFilled?"#2d6a4f":"#e2ddd6"}`,borderRadius:8,cursor:allFilled?"pointer":"not-allowed",fontSize:13,fontWeight:500,transition:"all .15s"}}>
              🔐 Je bloque ces paroles.
            </button>
          </div>;
        })()}
      </>}
    </div>
    {selectedWeek&&<UpdateViewModal notif={{updateData:selectedWeek.update,fromPrenom:teamMember?.prenom,weekKey:selectedWeek.wk,isOwn:true}} onClose={()=>setSelectedWeek(null)} onRead={()=>setSelectedWeek(null)}/>}
  </div>;
}

function TopBar({onBack,title,extra,left}){
  return <div style={{background:"rgba(245,243,239,.95)",borderBottom:"1px solid #e2ddd6",padding:"10px 20px",display:"flex",alignItems:"center",gap:12}}>
    {left||<button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#6b6560",display:"flex",alignItems:"center",gap:4,padding:"2px 6px",borderRadius:6}}
      onMouseEnter={e=>e.currentTarget.style.background="#e2ddd6"}
      onMouseLeave={e=>e.currentTarget.style.background="none"}>
      🌼 Calendula
    </button>}
    <div style={{flex:1,textAlign:"center"}}>
      <span style={{fontSize:15,fontWeight:600,color:"#1a1814"}}>{title}</span>
    </div>
    {extra||<div style={{width:80}}/>}
  </div>;
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function UpdatesHistoryTab(){
  const [allUpdates,setAllUpdates]=useState([]);
  const [allNotifs,setAllNotifs]=useState([]);
  const [allTmNotifs,setAllTmNotifs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [filterPrenom,setFilterPrenom]=useState("");
  const [filterWeek,setFilterWeek]=useState("");
  const [expanded,setExpanded]=useState({});

  useEffect(()=>{
    let done=0;
    const check=()=>{done++;if(done===3)setLoading(false);};
    const u1=onSnapshot(collection(db,"updates"),(snap)=>{
      setAllUpdates(snap.docs.map(d=>({id:d.id,...d.data()})));check();
    });
    const u2=onSnapshot(collection(db,"update_notifications"),(snap)=>{
      setAllNotifs(snap.docs.map(d=>({id:d.id,...d.data()})));check();
    });
    const u3=onSnapshot(collection(db,"teammate_notifications"),(snap)=>{
      setAllTmNotifs(snap.docs.map(d=>({id:d.id,...d.data()})));check();
    });
    return()=>{u1();u2();u3();};
  },[]);

  const prenoms=[...new Set(allUpdates.map(u=>u.prenom).filter(Boolean))].sort();
  const weeks=[...new Set(allUpdates.map(u=>u.weekKey).filter(Boolean))].sort().reverse();

  const filtered=allUpdates
    .filter(u=>!filterPrenom||u.prenom===filterPrenom)
    .filter(u=>!filterWeek||u.weekKey===filterWeek)
    .sort((a,b)=>(b.weekKey||"").localeCompare(a.weekKey||""));

  const fmtTs=ts=>ts?new Date(ts).toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}):"—";

  return <div>
    {/* Filters */}
    <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
      <select value={filterPrenom} onChange={e=>setFilterPrenom(e.target.value)} style={{...INP,width:"auto",fontSize:12}}>
        <option value="">Toute l'équipe</option>
        {prenoms.map(p=><option key={p}>{p}</option>)}
      </select>
      <select value={filterWeek} onChange={e=>setFilterWeek(e.target.value)} style={{...INP,width:"auto",fontSize:12}}>
        <option value="">Toutes les semaines</option>
        {weeks.map(w=>{const{mon,fri}=getWeekBounds(w);const sameM=mon.getMonth()===fri.getMonth();const label=sameM?`${w} · lundi ${mon.getDate()} au vendredi ${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"long"})}`:`${w} · lundi ${mon.getDate()} ${mon.toLocaleString("fr-FR",{month:"short"})} au vendredi ${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"short"})}`;return <option key={w} value={w}>{label}</option>;})}
      </select>
      <span style={{fontSize:12,color:"#9e9890",alignSelf:"center"}}>{filtered.length} update{filtered.length>1?"s":""}</span>
    </div>

    {loading?<div style={{textAlign:"center",padding:32,color:"#9e9890"}}>Chargement…</div>
    :<div style={{display:"flex",flexDirection:"column",gap:8}}>
      {filtered.map(u=>{
        const notif=allNotifs.find(n=>n.fromEmail===u.email&&n.weekKey===u.weekKey);
        const tmNotif=allTmNotifs.find(n=>n.toEmail===u.email&&n.weekKey===u.weekKey);
        const isOpen=expanded[u.id];
        const{mon,fri}=getWeekBounds(u.weekKey||"2026-W01");
        const sameM=mon.getMonth()===fri.getMonth();
        const weekLabel=sameM?`lundi ${mon.getDate()} au vendredi ${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"long"})}`:`lundi ${mon.getDate()} ${mon.toLocaleString("fr-FR",{month:"short"})} au vendredi ${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"short"})}`;

        return <div key={u.id} style={{border:"1px solid #e2ddd6",borderRadius:8,overflow:"hidden"}}>
          {/* Header row */}
          <div onClick={()=>setExpanded(p=>({...p,[u.id]:!p[u.id]}))}
            style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"#f8f7f5",cursor:"pointer"}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:pBg(u.prenom,prenoms),color:pTx(u.prenom,prenoms),display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,flexShrink:0}}>{ini(u.prenom)}</div>
            <div style={{flex:1}}>
              <span style={{fontSize:13,fontWeight:500,color:"#1a1814"}}>{u.prenom}</span>
              <span style={{fontSize:11,color:"#9e9890",marginLeft:10}}>{weekLabel}</span>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
              {u.answers?.q7&&<span style={{fontSize:16}}>{u.answers.q7}</span>}
              <span style={{fontSize:11,color:"#9e9890"}}>{fmtTs(u.updatedAt||u.submittedAt)}</span>
              {/* Notif status */}
              {notif?<span style={{fontSize:10,background:notif.read?"#f0fdf4":"#fef3c7",color:notif.read?"#166534":"#92400e",border:`1px solid ${notif.read?"#86efac":"#fcd34d"}`,borderRadius:10,padding:"1px 7px"}}>
                {notif.read?`Lu ${fmtTs(notif.readAt)}`:"Notif envoyée"}
              </span>:<span style={{fontSize:10,color:"#c5c0b8",border:"1px solid #e2ddd6",borderRadius:10,padding:"1px 7px"}}>Pas de notif</span>}
              <span style={{fontSize:11,color:"#9e9890",transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</span>
            </div>
          </div>
          {/* Expanded content */}
          {isOpen&&<div style={{padding:"14px 16px",borderTop:"1px solid #e2ddd6"}}>
            {/* Notif details */}
            <div style={{background:"#f8f7f5",borderRadius:6,padding:"8px 12px",marginBottom:12,fontSize:11,color:"#6b6560"}}>
              <div style={{fontWeight:600,marginBottom:4,color:"#1a1814"}}>📬 Messages liés</div>
              {notif
                ?<div style={{display:"flex",flexDirection:"column",gap:3}}>
                  <div>• Notif envoyée au référent : {fmtTs(notif.updatedAt||notif.submittedAt)} {notif.pending?"(en attente)":""}</div>
                  <div>• Lue par le référent : {notif.read?fmtTs(notif.readAt):"Non encore lue"}</div>
                  {tmNotif&&<div>• Confirmation envoyée à {u.prenom} : {fmtTs(tmNotif.createdAt)} {tmNotif.read?`· vue le ${fmtTs(tmNotif.readAt||tmNotif.createdAt)}`:"· pas encore vue"}</div>}
                </div>
                :<div>Aucune notification envoyée (pas de référent ou délai non dépassé)</div>
              }
              {notif?.confidentiel&&<div style={{marginTop:6,padding:"6px 8px",background:"#fdf4ff",borderRadius:4,border:"1px solid #e9d5ff"}}>
                <span style={{fontSize:10,color:"#a21caf",fontWeight:600}}>🔒 Message confidentiel : </span>
                <span style={{color:"#1a1814"}}>{notif.confidentiel}</span>
              </div>}
            </div>
            {/* Answers */}
            {DEFAULT_QUESTIONS.filter(q=>u.answers?.[q.id]).map(q=>{
              const val=u.answers[q.id];
              if(q.type==="mood")return <div key={q.id} style={{marginBottom:8,display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:10,color:"#9e9890",flex:1}}>{q.text.replace(" *","")}</span><span style={{fontSize:20}}>{val}</span></div>;
              if(q.type==="presence")return <div key={q.id} style={{marginBottom:8}}><div style={{fontSize:10,color:"#9e9890",marginBottom:2}}>{q.text.replace(" *","")}</div><div style={{fontSize:12,background:"#f5f3ef",borderRadius:4,padding:"3px 8px"}}>{val}</div></div>;
              return <div key={q.id} style={{marginBottom:8,background:q.confidentiel?"#fdf4ff":"#f8f7f5",borderRadius:6,padding:"6px 10px",border:q.confidentiel?"1px solid #e9d5ff":"none"}}>
                <div style={{fontSize:10,fontWeight:600,color:q.confidentiel?"#a21caf":"#9e9890",marginBottom:3}}>{q.confidentiel?"🔒 ":""}{q.text.replace(" *","")}</div>
                <div style={{fontSize:12,whiteSpace:"pre-wrap",color:"#1a1814"}}>{val}</div>
              </div>;
            })}
          </div>}
        </div>;
      })}
      {filtered.length===0&&<div style={{textAlign:"center",padding:32,color:"#9e9890",fontSize:13}}>Aucun update trouvé.</div>}
    </div>}
  </div>;
}


// ─── REPORTING TAB ────────────────────────────────────────────────────────────

const REPORTING_CANALS = ['Autres B2B','B2C','CHR','Export','Grands Comptes','Retail','Régénération'];
const CANAL_MARGIN = {'Régénération': 1.0};
const DEFAULT_CANAL_MARGIN = 0.263;

const CODE_TO_CATEGORY = {
  A1:'Autres produits et charges', B1:'Bar', C1:'Culture et bien-être',
  F1:'Comptabilité', G1:'Frais généraux', I1:'Immobilisations corporelles et incorporelles',
  J1:'Juridique', L1:'Logistique', M1:'Marketing', M2:'Marketing', M3:'Marketing',
  M4:'Marketing', M6:'Marketing', M7:'Marketing', M8:'Marketing',
  O1:'Programme Oé pour la régénération', R1:'Ressources humaines',
  S1:'Sales', S2:'Sales', S3:'Sales', S4:'Sales', S5:'Sales', S6:'Sales',
  T1:'Frais financiers', Z1:'Ventes', Z2:'COGS',
};

const DEFAULT_CAT_TYPE = {
  'Marketing':'charges_expl','Sales':'charges_expl','Ressources humaines':'charges_expl',
  'Juridique':'charges_expl','Comptabilité':'charges_expl','Logistique':'charges_expl',
  'Culture et bien-être':'charges_expl','Programme Oé pour la régénération':'charges_expl',
  'Bar':'charges_expl','Frais généraux':'charges_expl','Autres produits et charges':'charges_expl',
  'Frais financiers':'autres_charges','Immobilisations corporelles et incorporelles':'autres_charges',
  'COGS':'cogs','Ventes':'ventes',
};

const CATEGORIES_ORDER = [
  'Marketing','Sales','Ressources humaines','Juridique','Comptabilité','Logistique',
  'Culture et bien-être','Programme Oé pour la régénération','Bar','Frais généraux',
  'Autres produits et charges','Frais financiers','Immobilisations corporelles et incorporelles',
  'COGS','Ventes',
];

const MONTHS_FR = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];

function parseAmount(s) {
  if (!s) return 0;
  const clean = String(s).replace(/[\u202f\u00a0€ ]/g,'').replace(',','.').trim();
  return parseFloat(clean) || 0;
}

function fmt(v) {
  if (v === 0 || v === null || v === undefined) return '—';
  return new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(v);
}

function parseCSV(text) {
  const lines = text.split('\n');
  function parseLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === ',' && !inQuotes) { result.push(current); current = ''; }
      else { current += ch; }
    }
    result.push(current);
    return result;
  }
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const parsed = parseLine(lines[i]);
    if (parsed.length >= 32) rows.push(parsed);
  }
  return { headers: headerRow, rows };
}

function buildReportData(rows, catTypes) {
  // CA rows: col O (14) = "Analytique écritures comptables", col D (3) starts with 7, AL (37) in real canals
  const caRows = rows.filter(r => r[14]==='Analytique écritures comptables' && r[3].startsWith('7') && REPORTING_CANALS.includes(r[37]));
  // Charge rows: col O (14) = "Analytique écritures comptables", col D (3) starts with 6, AF (31) valid
  const chargeRows = rows.filter(r => r[14]==='Analytique écritures comptables' && r[3].startsWith('6') && r[31] && r[31]!=='#N/A');
  
  // Find last month with data
  const allMonths = [...new Set([...caRows,...chargeRows].map(r=>parseInt(r[30])).filter(m=>m>0&&m<=12))];
  const lastMonth = allMonths.length ? Math.max(...allMonths) : 0;
  
  // Unassigned codes
  const unassigned = new Set();
  chargeRows.forEach(r => {
    const code = r[31].slice(0,2);
    const cat = CODE_TO_CATEGORY[code];
    if (!cat || !catTypes[cat]) unassigned.add(r[31].slice(0,2));
  });

  // Build CA by canal by month
  const caByCanal = {};
  REPORTING_CANALS.forEach(c => { caByCanal[c] = Array(12).fill(0); });
  caRows.forEach(r => {
    const m = parseInt(r[30]) - 1;
    const canal = r[37];
    if (m >= 0 && m < 12 && caByCanal[canal]) caByCanal[canal][m] += parseAmount(r[29]);
  });

  // Build charges by category by subcategory by month + detail rows
  const chargeData = {}; // cat -> subcat -> month[] + rows[]
  chargeRows.forEach(r => {
    const code = r[31].slice(0,2);
    const cat = CODE_TO_CATEGORY[code] || 'Non affecté';
    const subcat = r[31];
    const type = catTypes[cat] || 'charges_expl';
    if (!chargeData[type]) chargeData[type] = {};
    if (!chargeData[type][cat]) chargeData[type][cat] = {};
    if (!chargeData[type][cat][subcat]) chargeData[type][cat][subcat] = { months: Array(12).fill(0), rows: [] };
    const m = parseInt(r[30]) - 1;
    if (m >= 0 && m < 12) {
      const val = parseAmount(r[29]);
      chargeData[type][cat][subcat].months[m] += val;
      // Detail row: exclude if col O=analytique AND col D starts with 6 or 7 (P&L)
      // Wait - the exclusion was already applied (we already filter col D starts with 6)
      // For detail: show all charge rows
      chargeData[type][cat][subcat].rows.push({
        date: r[1], compte: r[3], libCompte: r[4], tiers: r[12],
        facture: r[10], libLigne: r[8], month: parseInt(r[30])-1, amount: parseAmount(r[29])
      });
    }
  });

  return { caByCanal, chargeData, lastMonth, unassigned: [...unassigned] };
}

function SumRow({ label, months, lastMonth, bold=false, color='#1a1814', bg='transparent', indent=0, onClick, isOpen, children }) {
  const total = months.reduce((a,b)=>a+b,0);
  const ytd = months.slice(0, lastMonth).reduce((a,b)=>a+b,0);
  return <>
    <tr onClick={onClick} style={{cursor:onClick?'pointer':'default', background:bg}}>
      <td style={{padding:'6px 8px 6px '+(8+indent*16)+'px', fontSize:12, fontWeight:bold?600:400, color, whiteSpace:'nowrap', position:'sticky', left:0, background:bg||'#fff', zIndex:1, borderBottom:'1px solid #f0ede8'}}>
        {onClick && <span style={{display:'inline-block',width:14,transform:isOpen?'rotate(90deg)':'none',transition:'transform .15s',color:'#9e9890',marginRight:4}}>▶</span>}
        {label}
      </td>
      {months.map((v,i)=><td key={i} style={{padding:'6px 10px',fontSize:11,textAlign:'right',color:v<0?'#c0392b':v>0?'#1a1814':'#c5c0b8',fontFamily:'monospace',borderBottom:'1px solid #f0ede8',display:i>=lastMonth&&i<11?'none':'table-cell'}}>{fmt(v)}</td>)}
      <td style={{padding:'6px 10px',fontSize:11,textAlign:'right',fontFamily:'monospace',fontWeight:600,color:ytd<0?'#c0392b':'#2d6a4f',borderBottom:'1px solid #f0ede8',borderLeft:'2px solid #e2ddd6'}}>{fmt(ytd)}</td>
      <td style={{padding:'6px 10px',fontSize:11,textAlign:'right',fontFamily:'monospace',fontWeight:bold?600:400,color:total<0?'#c0392b':'#1a1814',borderBottom:'1px solid #f0ede8',borderLeft:'1px solid #e2ddd6'}}>{fmt(total)}</td>
    </tr>
    {isOpen && children}
  </>;
}

function DetailRows({ rows, months, lastMonth, monthActive }) {
  // Group by month then by compte
  const byMonth = {};
  rows.forEach(r => {
    if (!byMonth[r.month]) byMonth[r.month] = [];
    byMonth[r.month].push(r);
  });
  return <>
    {Object.entries(byMonth).sort(([a],[b])=>+a-+b).map(([m,mrs])=>{
      const mIdx = parseInt(m);
      if (mIdx >= lastMonth) return null;
      if (!monthActive[mIdx]) return null;
      return mrs.sort((a,b)=>a.compte.localeCompare(b.compte)).map((r,i)=><tr key={m+'-'+i} style={{background:'#fafaf8'}}>
        <td style={{padding:'4px 8px 4px 64px',fontSize:10,color:'#6b6560',borderBottom:'1px solid #f8f7f5',position:'sticky',left:0,background:'#fafaf8',zIndex:1}}>
          {r.date} · {r.compte} · {r.libCompte} · {r.tiers||'—'} · {r.facture||'—'} · {r.libLigne}
        </td>
        {months.map((_,i)=><td key={i} style={{padding:'4px 10px',fontSize:10,textAlign:'right',fontFamily:'monospace',color:r.amount<0?'#c0392b':'#1a1814',borderBottom:'1px solid #f8f7f5',display:i>=lastMonth&&i<11?'none':'table-cell'}}>
          {i===mIdx?fmt(r.amount):''}
        </td>)}
        <td style={{borderBottom:'1px solid #f8f7f5',borderLeft:'2px solid #e2ddd6'}}/>
        <td style={{borderBottom:'1px solid #f8f7f5',borderLeft:'1px solid #e2ddd6'}}/>
      </tr>);
    })}
  </>;
}

function ReportingTab({ onSaveCatTypes, savedCatTypes }) {
  const [csvData, setCsvData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [catTypes, setCatTypes] = useState(savedCatTypes || DEFAULT_CAT_TYPE);
  const [activeTab, setActiveTab] = useState('report'); // report | params
  const [expanded, setExpanded] = useState({});
  const [monthActive, setMonthActive] = useState(Array(12).fill(true));
  const fileRef = useRef(null);

  const reportData = useMemo(() => csvData ? buildReportData(csvData.rows, catTypes) : null, [csvData, catTypes]);
  const { caByCanal={}, chargeData={}, lastMonth=0, unassigned=[] } = reportData || {};

  // CA totals
  const caMonths = Array(12).fill(0);
  Object.values(caByCanal).forEach(arr => arr.forEach((v,i) => caMonths[i]+=v));

  // Marge brute
  const mbByCanal = {};
  Object.entries(caByCanal).forEach(([canal, arr]) => {
    const rate = CANAL_MARGIN[canal] ?? DEFAULT_CANAL_MARGIN;
    mbByCanal[canal] = arr.map(v => v * rate);
  });
  const mbMonths = Array(12).fill(0);
  Object.values(mbByCanal).forEach(arr => arr.forEach((v,i) => mbMonths[i]+=v));

  // Charges expl totals
  const getGroupMonths = (type) => {
    const months = Array(12).fill(0);
    const cats = chargeData[type] || {};
    Object.values(cats).forEach(subcats => Object.values(subcats).forEach(d => d.months.forEach((v,i)=>months[i]+=v)));
    return months;
  };
  const chargesExplMonths = getGroupMonths('charges_expl');
  const autresChargesMonths = getGroupMonths('autres_charges');

  // EBITDA & Résultat net
  const ebitdaMonths = mbMonths.map((v,i) => v + chargesExplMonths[i]);
  const resultatMonths = ebitdaMonths.map((v,i) => v + autresChargesMonths[i]);

  const months12 = Array(12).fill(0);
  const toggle = (key) => setExpanded(p => ({...p, [key]: !p[key]}));

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = ev => { setCsvData(parseCSV(ev.target.result)); };
    reader.readAsText(file, 'UTF-8');
  }

  function renderChargeGroup(type, label, groupMonths) {
    const cats = chargeData[type] || {};
    const orderedCats = CATEGORIES_ORDER.filter(c => cats[c] && (catTypes[c]==='charges_expl'?type==='charges_expl':catTypes[c]===type));
    return <>
      <SumRow label={label} months={groupMonths} lastMonth={lastMonth} bold bg='#f0fdf4'
        onClick={()=>toggle(type)} isOpen={expanded[type]}>
        {orderedCats.map(cat => {
          const catMonths = Array(12).fill(0);
          Object.values(cats[cat]||{}).forEach(d => d.months.forEach((v,i)=>catMonths[i]+=v));
          const catKey = type+'-'+cat;
          return <SumRow key={cat} label={cat} months={catMonths} lastMonth={lastMonth} indent={1} bg='#f8fffe'
            onClick={()=>toggle(catKey)} isOpen={expanded[catKey]}>
            {Object.entries(cats[cat]||{}).sort(([a],[b])=>a.localeCompare(b)).map(([subcat,d])=>{
              const subcatKey = catKey+'-'+subcat;
              return <SumRow key={subcat} label={subcat} months={d.months} lastMonth={lastMonth} indent={2} bg='#fbfffd'
                onClick={()=>toggle(subcatKey)} isOpen={expanded[subcatKey]}>
                <DetailRows rows={d.rows} months={months12} lastMonth={lastMonth} monthActive={monthActive}/>
              </SumRow>;
            })}
          </SumRow>;
        })}
      </SumRow>
    </>;
  }

  return <div>
    {/* Tabs */}
    <div style={{display:'flex',gap:8,marginBottom:16}}>
      {[{k:'report',l:'📊 Tableau de reporting'},{k:'params',l:'⚙️ Paramétrage catégories'}].map(t=>
        <button key={t.k} onClick={()=>setActiveTab(t.k)} style={{padding:'6px 14px',borderRadius:6,border:`1px solid ${activeTab===t.k?'#2d6a4f':'#e2ddd6'}`,background:activeTab===t.k?'#2d6a4f':'#fff',color:activeTab===t.k?'#fff':'#6b6560',cursor:'pointer',fontSize:12,fontWeight:500}}>
          {t.l}
        </button>
      )}
    </div>

    {activeTab==='params' && <div>
      <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Affectation des catégories</div>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
        <thead><tr style={{background:'#f5f3ef'}}>
          {['Catégorie','Type'].map(h=><th key={h} style={{padding:'8px 12px',textAlign:'left',fontWeight:600,color:'#6b6560',borderBottom:'1px solid #e2ddd6'}}>{h}</th>)}
        </tr></thead>
        <tbody>
          {CATEGORIES_ORDER.map(cat=><tr key={cat} style={{borderBottom:'1px solid #f0ede8'}}>
            <td style={{padding:'7px 12px'}}>{cat}</td>
            <td style={{padding:'7px 12px'}}>
              <select value={catTypes[cat]||'charges_expl'} onChange={e=>{const n={...catTypes,[cat]:e.target.value};setCatTypes(n);onSaveCatTypes&&onSaveCatTypes(n);}} style={{fontSize:12,border:'1px solid #e2ddd6',borderRadius:4,padding:'3px 8px'}}>
                <option value="charges_expl">Charges d'exploitation</option>
                <option value="autres_charges">Autres charges</option>
                <option value="cogs">COGS</option>
                <option value="ventes">Ventes</option>
              </select>
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>}

    {activeTab==='report' && <>
      {/* File import */}
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
        <button onClick={()=>fileRef.current?.click()} style={{padding:'7px 16px',background:'#2d6a4f',color:'#fff',border:'none',borderRadius:6,cursor:'pointer',fontSize:12,fontWeight:500}}>
          📂 Importer un CSV
        </button>
        <input ref={fileRef} type="file" accept=".csv" style={{display:'none'}} onChange={handleFile}/>
        {fileName&&<span style={{fontSize:11,color:'#6b6560'}}>{fileName}</span>}
      </div>

      {unassigned.length>0&&<div style={{background:'#fef3c7',border:'1px solid #fcd34d',borderRadius:8,padding:'10px 14px',marginBottom:14,fontSize:12,color:'#92400e'}}>
        ⚠️ Codes analytiques non affectés : <strong>{unassigned.join(', ')}</strong> — Allez dans "Paramétrage catégories" pour les affecter.
      </div>}

      {!csvData?<div style={{textAlign:'center',padding:40,color:'#9e9890',fontSize:13}}>Importez un fichier CSV pour afficher le reporting.</div>:<>
        {/* Month toggles */}
        <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
          <span style={{fontSize:11,color:'#9e9890',marginRight:4}}>Détail écritures par mois :</span>
          {MONTHS_FR.slice(0,lastMonth).map((m,i)=><button key={i} onClick={()=>setMonthActive(p=>p.map((v,j)=>j===i?!v:v))}
            style={{padding:'3px 10px',borderRadius:12,border:`1px solid ${monthActive[i]?'#2d6a4f':'#e2ddd6'}`,background:monthActive[i]?'#2d6a4f':'#fff',color:monthActive[i]?'#fff':'#9e9890',cursor:'pointer',fontSize:11}}>
            {m}
          </button>)}
        </div>

        {/* Table */}
        <div style={{overflowX:'auto',borderRadius:8,border:'1px solid #e2ddd6'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
            <thead>
              <tr style={{background:'#f5f3ef'}}>
                <th style={{padding:'8px 12px',textAlign:'left',fontSize:11,fontWeight:600,color:'#6b6560',position:'sticky',left:0,background:'#f5f3ef',zIndex:2,minWidth:220}}>Ligne</th>
                {MONTHS_FR.map((m,i)=><th key={i} style={{padding:'8px 10px',textAlign:'right',fontSize:11,fontWeight:600,color:'#6b6560',display:i>=lastMonth&&i<11?'none':'table-cell'}}>{m}</th>)}
                <th style={{padding:'8px 10px',textAlign:'right',fontSize:11,fontWeight:600,color:'#2d6a4f',borderLeft:'2px solid #e2ddd6',whiteSpace:'nowrap'}}>YTD</th>
                <th style={{padding:'8px 10px',textAlign:'right',fontSize:11,fontWeight:600,color:'#1a1814',borderLeft:'1px solid #e2ddd6'}}>Total</th>
              </tr>
            </thead>
            <tbody>
              {/* CA */}
              <SumRow label="Chiffre d'Affaires" months={caMonths} lastMonth={lastMonth} bold bg='#fff' onClick={()=>toggle('ca')} isOpen={expanded['ca']}>
                {REPORTING_CANALS.map(canal=><SumRow key={canal} label={canal} months={caByCanal[canal]||months12} lastMonth={lastMonth} indent={1} bg='#f8f7f5'/>)}
              </SumRow>
              {/* Marge brute */}
              <SumRow label="Marge Brute" months={mbMonths} lastMonth={lastMonth} bold bg='#eff8f4' onClick={()=>toggle('mb')} isOpen={expanded['mb']}>
                {REPORTING_CANALS.map(canal=><SumRow key={canal} label={canal} months={mbByCanal[canal]||months12} lastMonth={lastMonth} indent={1} bg='#f4fbf8'/>)}
              </SumRow>
              {/* Charges expl */}
              {renderChargeGroup('charges_expl', "Charges d'exploitation", chargesExplMonths)}
              {/* EBITDA */}
              <SumRow label="EBITDA" months={ebitdaMonths} lastMonth={lastMonth} bold bg='#fffbeb' color={ebitdaMonths.reduce((a,b)=>a+b,0)<0?'#c0392b':'#2d6a4f'}/>
              {/* Autres charges */}
              {renderChargeGroup('autres_charges', "Autres charges", autresChargesMonths)}
              {/* Résultat net */}
              <SumRow label="Résultat net" months={resultatMonths} lastMonth={lastMonth} bold bg='#f5f3ef' color={resultatMonths.reduce((a,b)=>a+b,0)<0?'#c0392b':'#2d6a4f'}/>
            </tbody>
          </table>
        </div>
      </>}
    </>}
  </div>;
}

function SettingsPage({onBack,currentUser,teamMembers,onSaveMembers,questions,onSaveQuestions,catTypes,onSaveCatTypes}){
  const [members,setMembers]=useState(teamMembers.map(m=>({...m})));
  const [newPrenom,setNewPrenom]=useState("");
  const [newManager,setNewManager]=useState("");
  const [tab,setTab]=useState("members");
  const [qs,setQs]=useState(questions||DEFAULT_QUESTIONS);
  const [saved,setSaved]=useState(false);

  function addMember(){
    if(!newPrenom.trim())return;
    const email=`${newPrenom.toLowerCase().trim()}@oeforgood.com`;
    if(members.find(m=>m.email===email))return;
    setMembers(p=>[...p,{prenom:newPrenom.trim(),email,managerEmail:newManager||"",role:"teammate"}]);
    setNewPrenom("");setNewManager("");
  }
  function removeMember(email){
    if(email===OWNER_EMAIL)return;
    if(!window.confirm("Supprimer ce membre ?"))return;
    setMembers(p=>p.filter(m=>m.email!==email));
  }
  function setRole(email,role){
    if(email===OWNER_EMAIL)return;
    setMembers(p=>p.map(m=>m.email===email?{...m,role}:m));
  }
  function setManager(email,managerEmail){
    setMembers(p=>p.map(m=>m.email===email?{...m,managerEmail}:m));
  }
  function save(){
    onSaveMembers(members);
    onSaveQuestions&&onSaveQuestions(qs);
    setSaved(true);setTimeout(()=>setSaved(false),1800);
  }

  return <div style={{minHeight:"100vh",background:"#f5f3ef",fontFamily:"system-ui,sans-serif"}}>
    <TopBar onBack={onBack} title="⚙️ Paramètres"/>
    <div style={{maxWidth:800,margin:"0 auto",padding:"24px 16px 60px"}}>
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        {([{k:"members",l:"👥 Membres & rôles"},...(currentUser?.email===OWNER_EMAIL?[{k:"questions",l:"❓ Questions Update"},{k:"history",l:"📋 Historique Updates"},{k:"reporting",l:"📈 Reporting financier"}]:[])]).map(t=><button key={t.k} onClick={()=>setTab(t.k)}
          style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${tab===t.k?"#2d6a4f":"#e2ddd6"}`,background:tab===t.k?"#2d6a4f":"#fff",color:tab===t.k?"#fff":"#6b6560",cursor:"pointer",fontSize:13,fontWeight:500}}>
          {t.l}
        </button>)}
      </div>

      {tab==="members"&&<>
        <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2ddd6",padding:"18px 20px",marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Ajouter un membre</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:10,alignItems:"end"}}>
            <div><label style={LBL}>Prénom</label><input style={INP} value={newPrenom} onChange={e=>setNewPrenom(e.target.value)} placeholder="ex: Marie" onKeyDown={e=>e.key==="Enter"&&addMember()}/></div>
            <div><label style={LBL}>Manager</label><select style={INP} value={newManager} onChange={e=>setNewManager(e.target.value)}>
              <option value="">— Aucun —</option>
              {members.map(m=><option key={m.email} value={m.email}>{m.prenom}</option>)}
            </select></div>
            <button onClick={addMember} style={{padding:"7px 16px",background:"#2d6a4f",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:500,marginBottom:1}}>Ajouter</button>
          </div>
        </div>
        <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2ddd6",overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:"#f5f3ef"}}>
              {["Prénom","Email","Manager","Rôle",""].map(h=><th key={h} style={{fontSize:11,fontWeight:600,color:"#9e9890",textTransform:"uppercase",letterSpacing:".05em",padding:"10px 14px",textAlign:"left",borderBottom:"1px solid #e2ddd6"}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {members.map(m=><tr key={m.email} style={{borderBottom:"1px solid #f0ede8"}}>
                <td style={{padding:"10px 14px",fontSize:13,fontWeight:500}}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar name={m.prenom} people={members.map(x=>x.prenom)} size={26}/>{m.prenom}{m.email===OWNER_EMAIL&&<span style={{fontSize:10,background:"#fef3c7",color:"#92400e",borderRadius:10,padding:"1px 6px"}}>Propriétaire</span>}</div></td>
                <td style={{padding:"10px 14px",fontSize:12,color:"#6b6560"}}>{m.email}</td>
                <td style={{padding:"10px 14px"}}>
                  {m.email!==OWNER_EMAIL?<select value={m.managerEmail||""} onChange={e=>setManager(m.email,e.target.value)} style={{...INP,fontSize:12}}>
                    <option value="">— Aucun —</option>
                    {members.filter(x=>x.email!==m.email).map(x=><option key={x.email} value={x.email}>{x.prenom}</option>)}
                  </select>:<span style={{fontSize:12,color:"#9e9890"}}>—</span>}
                </td>
                <td style={{padding:"10px 14px"}}>
                  {m.email===OWNER_EMAIL
                    ?<span style={{fontSize:12,color:"#9e9890"}}>Propriétaire</span>
                    :<select value={m.role||"teammate"} onChange={e=>setRole(m.email,e.target.value)} style={{...INP,fontSize:12}}>
                      <option value="admin">Admin</option><option value="teammate">Teammate actif</option><option value="inactive">Teammate inactif</option>
                    </select>}
                </td>
                <td style={{padding:"10px 14px"}}>
                  {m.email!==OWNER_EMAIL&&<button onClick={()=>removeMember(m.email)} style={{fontSize:12,color:"#c0392b",background:"#fdecea",border:"1px solid #fca5a5",borderRadius:6,padding:"4px 10px",cursor:"pointer"}}>Retirer</button>}
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </>}

      {tab==="questions"&&(
        <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2ddd6",padding:"18px 20px"}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Questions de l'Update hebdomadaire</div>
          {qs.map((q,i)=>(
            <div key={q.id} style={{marginBottom:14,padding:"12px",background:"#f8f7f5",borderRadius:8,border:"1px solid #e2ddd6"}}>
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <span style={{fontSize:11,fontFamily:"monospace",color:"#9e9890",marginTop:3,minWidth:24}}>{i+1}.</span>
                <div style={{flex:1}}>
                  <input style={{...INP,fontSize:13,marginBottom:8}} value={q.text} onChange={e=>setQs(p=>p.map((x,j)=>j===i?{...x,text:e.target.value}:x))}/>
                  <div style={{display:"flex",gap:16,alignItems:"center"}}>
                    <label style={{fontSize:12,color:"#6b6560"}}>Type :
                      <select value={q.type} onChange={e=>setQs(p=>p.map((x,j)=>j===i?{...x,type:e.target.value}:x))} style={{fontSize:12,border:"1px solid #e2ddd6",borderRadius:4,padding:"2px 6px",marginLeft:4}}>
                        <option value="textarea">Texte libre</option>
                        <option value="mood">Humeur (smileys)</option>
                        <option value="presence">Présence</option>
                      </select>
                    </label>
                    <label style={{fontSize:12,color:"#6b6560",display:"flex",alignItems:"center",gap:4}}>
                      <input type="checkbox" checked={!!q.confidentiel} onChange={e=>setQs(p=>p.map((x,j)=>j===i?{...x,confidentiel:e.target.checked}:x))} style={{accentColor:"#a21caf"}}/>
                      Confidentiel (manager uniquement)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="history"&&<UpdatesHistoryTab/>}
      {tab==="reporting"&&<ReportingTab onSaveCatTypes={onSaveCatTypes} savedCatTypes={catTypes}/>}

      {tab!=="history"&&<><button onClick={save} style={{marginTop:20,padding:"12px 28px",background:"#2d6a4f",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:600}}>
        💾 Enregistrer
      </button>
      {saved&&<span style={{marginLeft:12,fontSize:13,color:"#2d6a4f"}}>✓ Sauvegardé !</span>}</>}
    </div>
  </div>;
}

// ─── OKR MODALS (unchanged) ───────────────────────────────────────────────────
function ObjModal({obj,isNew,people,isAdmin,onClose,onSave,onDelete,onLock,onUnlock,onUnlockRequest}){
  const locked=obj?.locked||false;
  const [f,setF]=useState(obj?{...obj}:{title:"",owner:"",etp:0.1,priorite:"P1",contributors:[]});
  function upd(k,v){setF(p=>({...p,[k]:v}))}
  function save(){if(!f.title.trim())return;onSave({...f,etp:+f.etp});}
  return <Modal title={isNew?"Nouvel objectif":locked?"Objectif verrouillé 🔒":"Modifier l'objectif"} onClose={onClose} onSave={!locked?save:onClose} onDelete={!isNew&&!locked?onDelete:null} saveLabel={locked?"Fermer":"Enregistrer"}>
    <Field label="Titre"><input style={INP} value={f.title} onChange={e=>upd("title",e.target.value)} disabled={locked}/></Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
      <Field label="Propriétaire"><select style={INP} value={f.owner} onChange={e=>upd("owner",e.target.value)} disabled={locked}>
        <option value="">—</option>{people.map(p=><option key={p}>{p}</option>)}
      </select></Field>
      <Field label="ETP"><input style={INP} type="number" step="0.05" min="0" value={f.etp} onChange={e=>upd("etp",e.target.value)} disabled={locked}/></Field>
      <Field label="Priorité"><select style={INP} value={f.priorite} onChange={e=>upd("priorite",e.target.value)} disabled={locked}>
        {["P1","P2","P3"].map(p=><option key={p}>{p}</option>)}
      </select></Field>
    </div>
    {!isNew&&<div style={{marginTop:8,paddingTop:16,borderTop:"1px solid #e2ddd6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <span style={{fontSize:12,color:"#6b6560"}}>{locked?"Cet objectif est verrouillé.":"Verrouiller empêche toute modification."}</span>
      {locked
        ?<button onClick={isAdmin?onUnlock:undefined} style={{fontSize:12,fontWeight:500,background:isAdmin?"#fef3c7":"#f5f3ef",color:isAdmin?"#92400e":"#c5c0b8",border:`1px solid ${isAdmin?"#f59e0b":"#e2ddd6"}`,padding:"5px 12px",borderRadius:6,cursor:isAdmin?"pointer":"not-allowed",opacity:isAdmin?1:0.6}}>🔓 Déverrouiller</button>
        :<button onClick={onLock} style={{fontSize:12,fontWeight:500,background:"#f5f3ef",color:"#6b6560",border:"1px solid #e2ddd6",padding:"5px 12px",borderRadius:6,cursor:"pointer"}}>🔒 Verrouiller</button>}
    </div>}
  </Modal>;
}
function SobjModal({sobj,isNew,parentObjId,people,subobjectives,onClose,onSave,onDelete}){
  const [f,setF]=useState(sobj?{...sobj}:{title:"",owner:"",poids:0,priorite:"P1"});
  function upd(k,v){setF(p=>({...p,[k]:v}))}
  function save(){
    if(!f.title.trim())return;
    if(isNew){const siblings=subobjectives.filter(s=>s.parent===parentObjId);const totalW=siblings.reduce((s,x)=>s+x.poids,0);if(totalW>=100){alert(`La somme des poids atteint déjà ${Math.round(totalW)}%.`);return;}}
    onSave({...f,poids:+f.poids});
  }
  return <Modal title={isNew?"Nouveau sous-objectif":"Modifier le sous-objectif"} onClose={onClose} onSave={save} onDelete={!isNew?onDelete:null}>
    <Field label="Titre"><input style={INP} value={f.title} onChange={e=>upd("title",e.target.value)}/></Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Propriétaire"><select style={INP} value={f.owner} onChange={e=>upd("owner",e.target.value)}>
        <option value="">—</option>{people.map(p=><option key={p}>{p}</option>)}
      </select></Field>
      <Field label="Poids (%)"><input style={INP} type="number" step="5" min="0" max="100" value={f.poids} onChange={e=>upd("poids",e.target.value)}/></Field>
    </div>
  </Modal>;
}
function KRModal({kr,sobjId,people,keyresults,onClose,onSave,onDelete,locked}){
  const isNew=!kr;
  const [f,setF]=useState(kr?{...kr,_actuel:toEditVal(kr.val_actuel,kr.unite),_revise:kr.val_revise!==kr.val_cible?toEditVal(kr.val_revise,kr.unite):""}:{title:"",owner:"",contributors:[],poids:0,unite:"%",val_depart:0,_actuel:0,_revise:"",val_cible:1,stop:false,priorite:""});
  function upd(k,v){setF(p=>({...p,[k]:v}))}
  function togC(p){setF(prev=>{const has=prev.contributors.includes(p);return{...prev,contributors:has?prev.contributors.filter(c=>c!==p):[...prev.contributors,p]}});}
  function save(){
    if(!f.title.trim())return;
    if(isNew){const sib=keyresults.filter(k=>k.parent===sobjId);const tw=sib.reduce((s,x)=>s+x.poids,0)+(+f.poids);if(tw>100){alert(`Somme des poids dépasserait 100%.`);return;}}
    const dep=fromEditVal(f.val_depart,f.unite),act=fromEditVal(f._actuel,f.unite),cib=fromEditVal(f.val_cible,f.unite),rev=f._revise===""?cib:fromEditVal(f._revise,f.unite);
    onSave({...f,val_depart:dep,val_actuel:act,val_cible:cib,val_revise:rev,poids:+f.poids,taux:rnd(calcTaux(dep,act,cib,f.unite)),taux_land:rnd(calcTaux(dep,rev,cib,f.unite))});
  }
  const readonlyStruct=locked&&!isNew;
  const uniteSuffix=f.unite==="%"?" (en %)":f.unite==="€"?" (€)":f.unite==="nb"?" (nb)":"";
  return <Modal title={isNew?"Nouveau KR":"Mettre à jour le KR"} onClose={onClose} onSave={save} onDelete={!isNew&&!locked?onDelete:null}>
    <Field label="Titre"><input style={INP} value={f.title} onChange={e=>upd("title",e.target.value)} disabled={readonlyStruct}/></Field>
    {!readonlyStruct&&<>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Field label="Propriétaire"><select style={INP} value={f.owner} onChange={e=>upd("owner",e.target.value)}>
          <option value="">—</option>{people.map(p=><option key={p}>{p}</option>)}
        </select></Field>
        <Field label="Poids (%)"><input style={INP} type="number" step="5" min="0" max="100" value={f.poids} onChange={e=>upd("poids",e.target.value)}/></Field>
      </div>
      <Field label="Contributeurs"><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{people.map(p=><label key={p} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer"}}>
        <input type="checkbox" checked={f.contributors.includes(p)||p===f.owner} onChange={()=>p!==f.owner&&togC(p)} style={{accentColor:"#2d6a4f"}}/>{p}
      </label>)}</div></Field>
      <Field label="Unité"><select style={INP} value={f.unite} onChange={e=>upd("unite",e.target.value)}>
        {["%","nb","€","oui/non"].map(u=><option key={u}>{u}</option>)}
      </select></Field>
    </>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:14}}>
      <div><label style={LBL}>Départ{uniteSuffix}</label><input style={INP} type="number" step="any" value={toEditVal(f.val_depart,f.unite)} onChange={e=>upd("val_depart",e.target.value)} disabled={readonlyStruct}/></div>
      <div><label style={LBL}>Actuelle{uniteSuffix}</label><input style={INP} type="number" step="any" value={f._actuel} onChange={e=>upd("_actuel",e.target.value)}/></div>
      <div><label style={LBL}>Cible initiale{uniteSuffix}</label><input style={INP} type="number" step="any" value={toEditVal(f.val_cible,f.unite)} onChange={e=>upd("val_cible",e.target.value)} disabled={readonlyStruct}/></div>
      <div><label style={LBL}>Cible révisée{uniteSuffix}</label><input style={INP} type="number" step="any" value={f._revise} onChange={e=>upd("_revise",e.target.value)} placeholder="—"/></div>
    </div>
    <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,cursor:"pointer"}}>
      <input type="checkbox" checked={!!f.stop} onChange={e=>upd("stop",e.target.checked)} style={{accentColor:"#c0392b"}}/>Marquer STOP
    </label>
    {readonlyStruct&&<p style={{fontSize:11,color:"#b5680f",marginTop:8}}>⚠️ Objectif verrouillé — seules valeur actuelle, cible révisée et STOP sont modifiables.</p>}
  </Modal>;
}
function UnlockModal({objTitle,onClose,onUnlock}){
  const [pwd,setPwd]=useState(""),err=useRef(false);
  const [e,setE]=useState(false);
  function check(){if(pwd===ADMIN_PWD){onUnlock()}else{setE(true);setPwd("");}}
  return <Modal title="Déverrouiller l'objectif" onClose={onClose} onSave={check} saveLabel="Déverrouiller">
    <p style={{fontSize:13,color:"#6b6560",marginBottom:16}}>Objectif : <strong>{objTitle}</strong><br/>Saisissez le mot de passe administrateur.</p>
    <Field label="Mot de passe"><input style={INP} type="password" value={pwd} onChange={e=>{setPwd(e.target.value);setE(false);}} onKeyDown={e=>e.key==="Enter"&&check()} autoFocus/></Field>
    {e&&<p style={{fontSize:12,color:"#c0392b",marginTop:-8}}>Mot de passe incorrect.</p>}
  </Modal>;
}

// ─── OKR SUB-COMPONENTS ───────────────────────────────────────────────────────
function SobjSection({sobj,krs,people,objLocked,onEditKR,onAddKR,onEditSobj,collapsed,toggle}){
  const open=!collapsed[sobj.id];
  const prog=calcSobj(sobj.id,krs);
  const myKRs=krs.filter(k=>k.parent===sobj.id&&k.title);
  const sobjKRtotalW=myKRs.reduce((s,k)=>s+k.poids,0);
  const warnW=myKRs.length>0&&Math.round(sobjKRtotalW)!==100;
  const cell={padding:"7px 8px",borderBottom:"1px solid #eae7e1",verticalAlign:"middle",fontSize:12};
  const mono={fontFamily:"monospace",fontSize:11};
  return <div style={{borderBottom:"1px solid #e2ddd6"}}>
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 16px 9px 28px"}}>
      <div onClick={()=>toggle(sobj.id)} style={{display:"flex",alignItems:"center",gap:8,flex:1,cursor:"pointer",userSelect:"none"}}>
        <div style={{flex:1,fontSize:13,fontWeight:500,color:"#1a1814"}}>
          <span style={{fontFamily:"monospace",fontSize:11,color:"#9e9890",marginRight:6}}>{sobj.id}</span>{sobj.title}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <span style={{fontSize:10,color:"#9e9890",border:"1px solid #e2ddd6",padding:"1px 7px",borderRadius:20,fontFamily:"monospace"}}>{sobj.poids}%</span>
        {sobj.owner&&<div style={{display:"flex",alignItems:"center",gap:3}}><Avatar name={sobj.owner} people={people} size={18}/><span style={{fontSize:11,color:"#6b6560"}}>{sobj.owner}</span></div>}
        <SmallBar v={prog}/>
        {warnW&&<span style={{fontSize:10,color:"#b5680f",background:"#fef3c7",border:"1px solid #f59e0b",borderRadius:4,padding:"1px 5px"}}>⚠ {Math.round(sobjKRtotalW)}%</span>}
        {!objLocked&&<button onClick={()=>onEditSobj(sobj)} style={{width:22,height:22,borderRadius:5,border:"none",background:"none",cursor:"pointer",color:"#9e9890"}}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>}
        <span onClick={()=>toggle(sobj.id)} style={{fontSize:11,color:"#9e9890",cursor:"pointer",display:"inline-block",transform:open?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</span>
      </div>
    </div>
    {open&&<div style={{background:"#f8f7f5",overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
        <thead><tr style={{background:"#eae7e1"}}>
          {["Key Result","Propriétaire / Contributeurs","Poids","Départ","Actuel","Cible","Avancement",""].map(h=>
            <th key={h} style={{fontSize:10,fontWeight:500,color:"#9e9890",textTransform:"uppercase",letterSpacing:".06em",padding:"6px 8px",textAlign:"left",borderBottom:"1px solid #e2ddd6",whiteSpace:"nowrap"}}>{h}</th>)}
        </tr></thead>
        <tbody>
          {myKRs.map(kr=>{
            const p=kr.taux,col=progColor(p),hasRevise=kr.val_revise!==kr.val_cible;
            return <tr key={kr.id} style={{opacity:kr.stop?0.5:1}}
              onMouseEnter={e=>{for(const td of e.currentTarget.cells)td.style.background="#f0ede8"}}
              onMouseLeave={e=>{for(const td of e.currentTarget.cells)td.style.background=""}}>
              <td style={{...cell,maxWidth:200}}>
                <div style={{fontSize:10,color:"#9e9890",fontFamily:"monospace"}}>{kr.id}</div>
                <div style={{fontSize:12,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{kr.title}</div>
                {kr.stop&&<span style={{display:"inline-block",fontSize:9,fontWeight:600,background:"#fdecea",color:"#c0392b",padding:"1px 5px",borderRadius:3,marginTop:2}}>STOP</span>}
              </td>
              <td style={cell}><AvatarRow owner={kr.owner} contribs={kr.contributors} people={people}/></td>
              <td style={{...cell,...mono}}>{kr.poids}%</td>
              <td style={{...cell,...mono,color:"#9e9890"}}>{fmtV(kr.val_depart,kr.unite)}<span style={{fontSize:9,background:"#e8e4de",padding:"1px 4px",borderRadius:3,marginLeft:3}}>{kr.unite}</span></td>
              <td style={{...cell,...mono,fontWeight:600}}>{fmtV(kr.val_actuel,kr.unite)}</td>
              <td style={{...cell,...mono}}>
                {hasRevise?<><span style={{textDecoration:"line-through",color:"#9e9890",marginRight:5}}>{fmtV(kr.val_cible,kr.unite)}</span><span style={{color:kr.val_revise<kr.val_cible?"#b5680f":"#2d6a4f",fontWeight:600}}>{fmtV(kr.val_revise,kr.unite)}</span></>
                :<span style={{color:"#9e9890"}}>{fmtV(kr.val_cible,kr.unite)}</span>}
              </td>
              <td style={cell}><div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:48,height:4,background:"#e2ddd6",borderRadius:2,overflow:"hidden"}}><div style={{width:`${Math.min(p,100)}%`,height:"100%",background:col,borderRadius:2}}/></div>
                <span style={{fontSize:11,fontWeight:600,color:col,fontFamily:"monospace",minWidth:26}}>{Math.round(p)}%</span>
              </div></td>
              <td style={cell}><button onClick={()=>onEditKR(kr)} style={{width:22,height:22,borderRadius:5,border:"none",background:"none",cursor:"pointer",color:"#9e9890"}}>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button></td>
            </tr>;
          })}
          {!objLocked&&<tr><td colSpan={8} style={{padding:"5px 8px",borderBottom:"none"}}>
            <button onClick={()=>onAddKR(sobj.id)} style={{fontSize:11,color:"#9e9890",background:"none",border:"none",cursor:"pointer",padding:"3px 6px",borderRadius:4}}
              onMouseEnter={e=>{e.currentTarget.style.color="#2d6a4f";e.currentTarget.style.background="#d8f3dc"}}
              onMouseLeave={e=>{e.currentTarget.style.color="#9e9890";e.currentTarget.style.background="none"}}>+ Ajouter un KR</button>
          </td></tr>}
        </tbody>
      </table>
    </div>}
  </div>;
}

function SeasonBanner({seasonKey,avgProg,totalKR,doneKR}){
  const info=getSeasonInfo(seasonKey),timeProg=getSeasonProgress(seasonKey);
  const start=new Date(info.start),end=new Date(info.end);
  const fmt=d=>d.toLocaleDateString("fr-FR",{day:"numeric",month:"short"});
  const col=progColor(avgProg),krCol=progColor(doneKR/Math.max(totalKR,1)*100);
  return <div style={{background:"#fff",border:"1px solid #e2ddd6",borderRadius:10,padding:"14px 20px",marginBottom:14,display:"flex",alignItems:"center",gap:20,flexWrap:"nowrap",overflow:"hidden"}}>
    <div style={{flexShrink:0,textAlign:"center",width:100}}>
      <div style={{fontSize:52,fontWeight:700,fontFamily:"monospace",color:col,lineHeight:1}}>{Math.round(avgProg)}%</div>
      <div style={{fontSize:10,color:"#9e9890",marginTop:3,textTransform:"uppercase",letterSpacing:".06em"}}>Avancement global</div>
    </div>
    <div style={{width:1,background:"#e2ddd6",alignSelf:"stretch",flexShrink:0}}/>
    <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:12,fontWeight:500,color:"#1a1814"}}>{info.label}</span>
        <span style={{fontSize:11,color:"#9e9890"}}>{fmt(start)} → {fmt(end)}</span>
      </div>
      <Bar v={avgProg} label="Avancement total des OKR" w={0}/>
      <Bar v={timeProg} label="Avancement de la saison" w={0}/>
    </div>
    <div style={{width:1,background:"#e2ddd6",alignSelf:"stretch",flexShrink:0}}/>
    <div style={{flexShrink:0,textAlign:"center",width:90}}>
      <div style={{fontSize:22,fontWeight:600,fontFamily:"monospace",color:krCol}}>{doneKR}/{totalKR}</div>
      <div style={{fontSize:10,color:"#9e9890",marginTop:2}}>KR complétés</div>
    </div>
  </div>;
}

function PersonalBanner({prog,doneKR,totalKR,label,marginBottom=8,avgProg=0}){
  const col=progColorRel(prog,avgProg),krCol=progColorRel(doneKR/Math.max(totalKR,1)*100,avgProg);
  return <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:10,padding:"14px 20px",marginBottom,display:"flex",alignItems:"center",gap:20,flexWrap:"nowrap",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
    <div style={{flexShrink:0,textAlign:"center",width:100}}>
      <div style={{fontSize:52,fontWeight:700,fontFamily:"monospace",color:col,lineHeight:1}}>{Math.round(prog)}%</div>
      <div style={{fontSize:10,color:"#6b6560",marginTop:3,textTransform:"uppercase",letterSpacing:".06em"}}>{label}</div>
    </div>
    <div style={{width:1,background:"#86efac",alignSelf:"stretch",flexShrink:0}}/>
    <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:10}}>
      <Bar v={prog} label="Mon avancement" w={0}/>
    </div>
    <div style={{width:1,background:"#86efac",alignSelf:"stretch",flexShrink:0}}/>
    <div style={{flexShrink:0,textAlign:"center",width:90}}>
      <div style={{fontSize:22,fontWeight:600,fontFamily:"monospace",color:krCol}}>{doneKR}/{totalKR}</div>
      <div style={{fontSize:10,color:"#6b6560",marginTop:2}}>KR complétés</div>
    </div>
  </div>;
}

function detectSalves(logs){
  if(!logs.length)return[];
  const sorted=[...logs].sort((a,b)=>a.timestamp-b.timestamp);
  const salves=[];
  let cur=[sorted[0]];
  for(let i=1;i<sorted.length;i++){
    const sameUser=sorted[i].owner===sorted[i-1].owner;
    const withinGap=sorted[i].timestamp-sorted[i-1].timestamp<=SALVE_GAP_MS;
    if(sameUser&&withinGap){cur.push(sorted[i]);}
    else{salves.push(cur);cur=[sorted[i]];}
  }
  salves.push(cur);
  return salves.map(mods=>({
    mods,
    owner:mods[0].owner||"?",
    start:mods[0].timestamp,
    end:mods[mods.length-1].timestamp,
    count:mods.length,
  })).reverse();
}
function JournalModal({seasonKey,onClose,isAdmin,currentPrenom}){
  const [logs,setLogs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [expanded,setExpanded]=useState({});
  useEffect(()=>{
    const unsub=onSnapshot(collection(db,"okr_log"),(snap)=>{
      const all=snap.docs.map(d=>({id:d.id,...d.data()}));
      setLogs(all.filter(l=>l.seasonKey===seasonKey));
      setLoading(false);
    },(e)=>{console.error(e);setLoading(false);});
    return()=>unsub();
  },[seasonKey]);
  const allSalves=detectSalves(logs);
  const salves=isAdmin?allSalves:allSalves.filter(s=>s.owner===currentPrenom);
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:"#fff",borderRadius:12,padding:24,width:"90%",maxWidth:900,maxHeight:"85vh",overflowY:"auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div style={{fontSize:16,fontWeight:600}}>Historique des modifications</div>
        <button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",fontSize:20,color:"#9e9890"}}>×</button>
      </div>
      {loading?<p style={{color:"#9e9890",fontSize:13}}>Chargement...</p>
      :salves.length===0?<p style={{color:"#9e9890",fontSize:13}}>Aucune modification enregistrée.</p>
      :<div style={{display:"flex",flexDirection:"column",gap:6}}>
        {salves.map((salve,si)=>{
          const isOpen=expanded[si];
          return <div key={si} style={{border:"1px solid #e2ddd6",borderRadius:8,overflow:"hidden"}}>
            <div onClick={()=>setExpanded(p=>({...p,[si]:!p[si]}))} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"#f8f7f5",cursor:"pointer"}}>
              <span style={{fontSize:12,color:"#9e9890",minWidth:120}}>{formatDate(salve.end)}</span>
              <span style={{fontSize:13,fontWeight:500,color:"#2d6a4f",flex:1}}>{salve.owner}</span>
              <span style={{fontSize:12,color:"#9e9890"}}>{salve.count} modif{salve.count>1?"s":""}</span>
              <span style={{fontSize:11,color:"#9e9890",transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</span>
            </div>
            {isOpen&&<div style={{padding:"10px 14px",borderTop:"1px solid #e2ddd6"}}>
              {salve.mods.map((m,mi)=><div key={mi} style={{fontSize:12,color:"#6b6560",marginBottom:6,display:"flex",gap:8,alignItems:"flex-start"}}>
                <span style={{fontFamily:"monospace",fontSize:11,color:"#9e9890",flexShrink:0,minWidth:50}}>{m.itemId}</span>
                <div>
                  <span style={{fontWeight:500,color:"#1a1814"}}>{m.itemTitle||m.itemId}</span>
                  {m.changes&&m.changes.map((c,ci)=><span key={ci} style={{marginLeft:8,color:"#9e9890"}}>
                    {c.field}: <span style={{textDecoration:"line-through"}}>{String(c.before).slice(0,20)}</span> → <span style={{color:"#2d6a4f"}}>{String(c.after).slice(0,20)}</span>
                  </span>)}
                </div>
              </div>)}
            </div>}
          </div>;
        })}
      </div>}
    </div>
  </div>;
}
function ImportObjModal({allSeasons,currentSeasonKey,people,onClose,onImport}){
  const otherSeasons=Object.entries(allSeasons).filter(([k,v])=>k!==currentSeasonKey&&v.objectives&&v.objectives.length>0);
  const [fromKey,setFromKey]=useState(otherSeasons[0]?.[0]||"");
  const [objId,setObjId]=useState(""),mode=useState("obj");
  const [_mode,setMode]=mode;
  const fromSeason=useMemo(()=>allSeasons[fromKey]||{},[fromKey,allSeasons]);
  const fromObjs=useMemo(()=>fromSeason.objectives||[],[fromSeason]);
  const fromSobjs=useMemo(()=>fromSeason.subobjectives||[],[fromSeason]);
  const fromKRs=useMemo(()=>fromSeason.keyresults||[],[fromSeason]);
  useEffect(()=>{if(fromObjs.length>0)setObjId(fromObjs[0].id);else setObjId("");},[fromKey,fromObjs]);
  function doImport(){
    if(!objId)return;const obj=fromObjs.find(o=>o.id===objId);if(!obj)return;
    onImport({obj,sobjs:fromSobjs.filter(s=>s.parent===objId),krs:fromKRs.filter(k=>k.parent.startsWith(objId+'.')),mode:_mode});
  }
  if(otherSeasons.length===0)return <Modal title="Importer un objectif" onClose={onClose} onSave={onClose} saveLabel="Fermer"><p style={{fontSize:13,color:"#6b6560"}}>Aucune autre saison disponible.</p></Modal>;
  return <Modal title="Importer un objectif" onClose={onClose} onSave={doImport} saveLabel="Importer">
    <Field label="Depuis quelle saison ?"><select style={INP} value={fromKey} onChange={e=>setFromKey(e.target.value)}>{otherSeasons.map(([k])=><option key={k} value={k}>{SEASONS.find(s=>s.key===k)?.label||k}</option>)}</select></Field>
    <Field label="Quel objectif ?"><select style={INP} value={objId} onChange={e=>setObjId(e.target.value)}>{fromObjs.map(o=><option key={o.id} value={o.id}>{o.id} — {o.title}</option>)}</select></Field>
    <Field label="Que souhaitez-vous importer ?">
      <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:4}}>
        {[{v:"obj",l:"L'objectif uniquement"},{v:"sobjs",l:"L'objectif et ses sous-objectifs"},{v:"all",l:"L'objectif, sous-objectifs et KR (valeurs remises à zéro)"}].map(opt=><label key={opt.v} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"8px 12px",borderRadius:8,border:`1px solid ${_mode===opt.v?"#2d6a4f":"#e2ddd6"}`,background:_mode===opt.v?"#f0fdf4":"#fff"}}>
          <input type="radio" name="mode" value={opt.v} checked={_mode===opt.v} onChange={()=>setMode(opt.v)} style={{accentColor:"#2d6a4f"}}/><span style={{fontSize:13}}>{opt.l}</span>
        </label>)}
      </div>
    </Field>
  </Modal>;
}

// ─── OKR PAGE ─────────────────────────────────────────────────────────────────
function OKRPage({onBack,currentUser,teamMember,isAdmin,teamMembers=[]}){
  const [seasonKey,setSeasonKey]=useState("printemps_2026");
  const [showJournal,setShowJournal]=useState(false);
  const [allSeasons,setAllSeasons]=useState({"printemps_2026":{...JSON.parse(JSON.stringify(SPRING26))}});
  const [collObj,setCollObj]=useState({});
  const [collSobj,setCollSobj]=useState({});
  const [filterP,setFilterP]=useState("");
  const [modal,setModal]=useState(null);
  const [saved,setSaved]=useState(false);
  const [loaded,setLoaded]=useState(false);

  const season=allSeasons[seasonKey]||allSeasons["printemps_2026"];
  const{objectives,subobjectives,keyresults}=season;
  // Use active team members from Firebase instead of static season people
  const people=teamMembers.length>0
    ? teamMembers.filter(m=>m.role!=="inactive").map(m=>m.prenom).sort()
    : (season.people||[]);

  useEffect(()=>{
    const ref=doc(db,"okr","data");
    const unsub=onSnapshot(ref,(snap)=>{
      if(snap.exists()){const d=snap.data();if(d.allSeasons)setAllSeasons(d.allSeasons);if(d.seasonKey)setSeasonKey(d.seasonKey);if(d.collObj)setCollObj(d.collObj||{});if(d.collSobj)setCollSobj(d.collSobj||{});}
      setLoaded(true);
    },(e)=>{console.error(e);setLoaded(true);});
    return()=>unsub();
  },[]);

  const allSeasonsRef=useRef(allSeasons);useEffect(()=>{allSeasonsRef.current=allSeasons;},[allSeasons]);
  const seasonKeyRef=useRef(seasonKey);useEffect(()=>{seasonKeyRef.current=seasonKey;},[seasonKey]);

  function persist(aS){
    setDoc(doc(db,"okr","data"),{allSeasons:aS,seasonKey:seasonKeyRef.current,collObj,collSobj})
      .then(()=>{setSaved(true);setTimeout(()=>setSaved(false),1800);}).catch(e=>console.error(e));
  }
  async function logChange(type,itemId,itemTitle,owner,changes){
    // owner here = connected user's prenom
    try{await addDoc(collection(db,"okr_log"),{type,itemId,itemTitle,owner:teamMember?.prenom||owner,changes,seasonKey:seasonKeyRef.current,timestamp:Date.now()});}catch(e){console.error(e);}
  }
  function updateSeason(patch){
    const cur=allSeasonsRef.current[seasonKeyRef.current]||{};
    const next={...allSeasonsRef.current,[seasonKeyRef.current]:{...cur,...patch}};
    allSeasonsRef.current=next;setAllSeasons(next);persist(next);
  }
  function switchSeason(key){
    let next=allSeasonsRef.current;
    if(!next[key]){next={...next,[key]:makeFreshSeason(people)};allSeasonsRef.current=next;setAllSeasons(next);}
    seasonKeyRef.current=key;
    setSeasonKey(key);setFilterP("");
    setDoc(doc(db,"okr","data"),{allSeasons:next,seasonKey:key,collObj,collSobj}).catch(e=>console.error(e));
  }
  function toggleObj(id){setCollObj(c=>{const n={...c,[id]:!c[id]};setDoc(doc(db,"okr","data"),{allSeasons:allSeasonsRef.current,seasonKey:seasonKeyRef.current,collObj:n,collSobj:collSobj}).catch(e=>console.error(e));return n;});}
  function toggleSobj(id){setCollSobj(c=>{const n={...c,[id]:!c[id]};setDoc(doc(db,"okr","data"),{allSeasons:allSeasonsRef.current,seasonKey:seasonKeyRef.current,collObj,collSobj:n}).catch(e=>console.error(e));return n;});}
  function lockObj(id){updateSeason({objectives:objectives.map(o=>o.id===id?{...o,locked:true}:o)});setModal(null);}
  function unlockObj(id){updateSeason({objectives:objectives.map(o=>o.id===id?{...o,locked:false}:o)});setModal(null);}
  function handleObjSave(data){
    const{_id,_isNew,...obj}=data;
    const objs=allSeasonsRef.current[seasonKeyRef.current]?.objectives||[];
    let next;
    if(_isNew){const newId=String(objs.length+1);next=[...objs,{id:newId,...obj,contributors:[],locked:false}];}
    else{const prev=objs.find(o=>o.id===_id);next=objs.map(o=>o.id===_id?{...o,...obj}:o);if(prev){const ch=[];if(prev.title!==obj.title)ch.push({field:"Titre",before:prev.title,after:obj.title});if(prev.etp!==obj.etp)ch.push({field:"ETP",before:prev.etp,after:obj.etp});if(ch.length)logChange("Objectif",_id,obj.title,obj.owner,ch);}}
    updateSeason({objectives:next});setModal(null);
  }
  function handleObjDel(id){
    if(!window.confirm("Supprimer cet objectif ?"))return;
    const sobjIds=subobjectives.filter(s=>s.parent===id).map(s=>s.id);
    updateSeason({objectives:objectives.filter(o=>o.id!==id),subobjectives:subobjectives.filter(s=>s.parent!==id),keyresults:keyresults.filter(k=>!sobjIds.includes(k.parent))});setModal(null);
  }
  function handleSobjSave(data){
    const{_id,_isNew,_parentObjId,...sobj}=data;
    let next;
    if(_isNew){const sib=subobjectives.filter(s=>s.parent===_parentObjId);next=[...subobjectives,{id:`${_parentObjId}.${sib.length+1}`,parent:_parentObjId,...sobj,contributors:[]}];}
    else next=subobjectives.map(s=>s.id===_id?{...s,...sobj}:s);
    updateSeason({subobjectives:next});setModal(null);
  }
  function handleSobjDel(id){if(!window.confirm("Supprimer ce sous-objectif ?"))return;updateSeason({subobjectives:subobjectives.filter(s=>s.id!==id),keyresults:keyresults.filter(k=>k.parent!==id)});setModal(null);}
  function handleKRSave(data){
    const{_id,_sobjId,...kr}=data;
    const krs=allSeasonsRef.current[seasonKeyRef.current]?.keyresults||[];
    let nextKRs;
    if(_id){const prev=krs.find(k=>k.id===_id);nextKRs=krs.map(k=>k.id===_id?{...k,...kr}:k);if(prev){
      // Only log when parent objective is locked
      const _sobj=allSeasonsRef.current[seasonKeyRef.current]?.subobjectives?.find(s=>s.id===kr.parent);
      const _obj=allSeasonsRef.current[seasonKeyRef.current]?.objectives?.find(o=>o.id===_sobj?.parent);
      if(_obj?.locked){const ch=[];if(prev.val_actuel!==kr.val_actuel)ch.push({field:"Valeur actuelle",before:prev.val_actuel,after:kr.val_actuel});if(prev.val_revise!==kr.val_revise)ch.push({field:"Cible réévaluée",before:prev.val_revise,after:kr.val_revise});if(prev.stop!==kr.stop)ch.push({field:"STOP",before:prev.stop?"Oui":"Non",after:kr.stop?"Oui":"Non"});if(ch.length)logChange("KR",_id,kr.title,kr.owner,ch);}
    }}
    else{const sib=krs.filter(k=>k.parent===_sobjId);nextKRs=[...krs,{id:`${_sobjId}.${sib.length+1}`,parent:_sobjId,priorite:"",...kr}];}
    updateSeason({keyresults:nextKRs});setModal(null);
  }
  function handleKRDel(id){if(!window.confirm("Supprimer ce KR ?"))return;updateSeason({keyresults:keyresults.filter(k=>k.id!==id)});setModal(null);}
  function handleImport({obj,sobjs,krs,mode}){
    const curObjs=allSeasonsRef.current[seasonKeyRef.current]?.objectives||[];
    const curSobjs=allSeasonsRef.current[seasonKeyRef.current]?.subobjectives||[];
    const curKRs=allSeasonsRef.current[seasonKeyRef.current]?.keyresults||[];
    const newObjId=String(curObjs.length+1);
    const newObj={...obj,id:newObjId,locked:false,taux:0,taux_land:0};
    let newSobjs=[],newKRs=[];
    if(mode==="sobjs"||mode==="all")newSobjs=sobjs.map(s=>({...s,id:`${newObjId}.${s.id.split('.')[1]}`,parent:newObjId,taux:0,taux_land:0}));
    if(mode==="all")newKRs=krs.map(k=>{const parts=k.id.split('.');return{...k,id:`${newObjId}.${parts[1]}.${parts[2]}`,parent:`${newObjId}.${parts[1]}`,val_actuel:0,val_revise:k.val_cible,taux:0,taux_land:0};});
    updateSeason({objectives:[...curObjs,newObj],subobjectives:[...curSobjs,...newSobjs],keyresults:[...curKRs,...newKRs]});setModal(null);
  }

  const allLocked=objectives.length>0&&objectives.every(o=>!!o.locked);
  const visObjs=filterP?objectives.filter(o=>o.owner===filterP||subobjectives.filter(s=>s.parent===o.id).some(s=>s.owner===filterP||keyresults.filter(k=>k.parent===s.id).some(k=>k.owner===filterP||k.contributors.includes(filterP)))):objectives;
  const totalKR=keyresults.length,doneKR=keyresults.filter(k=>k.taux>=100).length,avgProg=calcWeightedAvg(objectives,subobjectives,keyresults);

  if(!loaded)return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:200,color:"#9e9890",fontSize:13}}>Chargement…</div>;

  return <div style={{fontFamily:"system-ui,sans-serif",background:"#f5f3ef",minHeight:"100vh",color:"#1a1814"}}>
    <div style={{background:"rgba(245,243,239,.95)",borderBottom:"1px solid #e2ddd6",padding:"10px 20px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",position:"relative"}}>
      <span style={{fontSize:16,fontWeight:700,color:"#2d6a4f",letterSpacing:"-.2px",cursor:"pointer"}} onClick={onBack}>🌼 Calendula</span>
      <div style={{position:"absolute",left:0,right:0,textAlign:"center",pointerEvents:"none"}}>
        <span style={{fontSize:16,fontWeight:600,color:"#1a1814",letterSpacing:"-.2px"}}>OKR Oé</span>
      </div>
      <div style={{flex:1}}/>
      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <select value={seasonKey} onChange={e=>switchSeason(e.target.value)} style={{fontFamily:"inherit",fontSize:13,fontWeight:500,border:"1px solid #e2ddd6",background:"#fff",borderRadius:20,padding:"4px 14px",outline:"none",cursor:"pointer",color:"#1b4332"}}>
          {SEASONS.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        {allLocked&&<span style={{fontSize:16}}>🔒</span>}
        <button onClick={()=>setShowJournal(true)} title="Historique des modifications" style={{width:28,height:28,border:"1px solid #e2ddd6",borderRadius:6,background:"none",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",color:"#6b6560"}}
          onMouseEnter={e=>e.currentTarget.style.background="#f5f3ef"} onMouseLeave={e=>e.currentTarget.style.background="none"}>🕐</button>
        <select value={filterP} onChange={e=>setFilterP(e.target.value)} style={{fontFamily:"inherit",fontSize:12,border:"1px solid #e2ddd6",background:"#fff",borderRadius:6,padding:"5px 10px",outline:"none",cursor:"pointer"}}>
          <option value="">Toute l'équipe</option>{people.map(p=><option key={p}>{p}</option>)}
        </select>
      </div>
    </div>

    <div style={{maxWidth:1100,margin:"0 auto",padding:"0 16px 60px"}}>
      <div style={{padding:"16px 0 0"}}>
        <SeasonBanner seasonKey={seasonKey} avgProg={avgProg} totalKR={totalKR} doneKR={doneKR}/>
        {filterP&&(()=>{
          // Owner-only for personal progress
          const fKRsOwned=keyresults.filter(k=>k.owner===filterP);
          const fDone=fKRsOwned.filter(k=>k.taux>=100).length;
          let totalW=0,weightedSum=0;
          fKRsOwned.filter(k=>k.poids>0).forEach(kr=>{
            const sobj=subobjectives.find(s=>s.id===kr.parent);
            const obj=objectives.find(o=>o.id===sobj?.parent);
            const sobjPoids=sobj?sobj.poids:100;
            const objEtp=obj?Math.max(obj.etp||0,0.01):1;
            const w=kr.poids*(sobjPoids/100)*objEtp;
            const taux=parseFloat(kr.taux)||0;
            totalW+=w;weightedSum+=taux*w;
          });
          const fProg=totalW>0?Math.round(weightedSum/totalW*10)/10:0;
          return <PersonalBanner prog={fProg} doneKR={fDone} totalKR={fKRsOwned.length} label={filterP} marginBottom={0} avgProg={avgProg}/>;
        })()}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:20}}>
        {visObjs.length===0&&<div style={{textAlign:"center",padding:32,color:"#9e9890",fontSize:13}}>Aucun objectif.</div>}
        {visObjs.map((obj,idx)=>{
          const prog=calcObj(obj.id,subobjectives,keyresults);
          const open=!collObj[obj.id],objLocked=!!obj.locked;
          const sobjs=subobjectives.filter(s=>s.parent===obj.id);
          const visSobjs=filterP?sobjs.filter(s=>s.owner===filterP||keyresults.filter(k=>k.parent===s.id).some(k=>k.owner===filterP||k.contributors.includes(filterP))):sobjs;
          const sobjTotalW=sobjs.reduce((s,o)=>s+o.poids,0),warnSobj=sobjs.length>0&&Math.round(sobjTotalW)!==100;
          return <div key={obj.id} style={{background:"#fff",border:`1px solid ${objLocked?"#f59e0b":"#e2ddd6"}`,borderRadius:10,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,.07)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px",cursor:"pointer",userSelect:"none"}}
              onClick={()=>toggleObj(obj.id)} onMouseEnter={e=>e.currentTarget.style.background="#f5f3ef"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:28,height:28,borderRadius:8,background:OBJ_BG[idx%11],color:OBJ_TX[idx%11],display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,flexShrink:0}}>{obj.id}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:500}}>{obj.title}</div>
                {obj.owner&&<div style={{fontSize:11,color:"#6b6560",marginTop:2}}>Propriétaire : {obj.owner}</div>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                {obj.etp>0&&<span style={{fontSize:11,background:"#f5f3ef",border:"1px solid #e2ddd6",padding:"2px 8px",borderRadius:20,color:"#6b6560"}}>{obj.etp} ETP</span>}
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:80,height:5,background:"#e2ddd6",borderRadius:3,overflow:"hidden"}}><div style={{width:`${Math.min(prog,100)}%`,height:"100%",background:progColor(prog),borderRadius:3}}/></div>
                  <span style={{fontSize:12,fontWeight:600,color:progColor(prog),minWidth:32,textAlign:"right",fontFamily:"monospace"}}>{Math.round(prog)}%</span>
                </div>
                {warnSobj&&<span style={{fontSize:10,color:"#b5680f",background:"#fef3c7",border:"1px solid #f59e0b",borderRadius:4,padding:"1px 5px"}}>⚠ {Math.round(sobjTotalW)}%</span>}
                <button onClick={e=>{e.stopPropagation();setModal({type:"obj",item:obj,isNew:false});}}
                  style={{width:24,height:24,borderRadius:5,border:"none",background:"none",cursor:"pointer",color:objLocked?"#f59e0b":"#9e9890"}}>
                  {objLocked?<span style={{fontSize:16}}>🔒</span>:<svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
                </button>
                <span style={{fontSize:11,color:"#9e9890",display:"inline-block",transform:open?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</span>
              </div>
            </div>
            {open&&<div style={{borderTop:"1px solid #e2ddd6"}}>
              {visSobjs.map(sobj=><SobjSection key={sobj.id} sobj={sobj} krs={keyresults} people={people} objLocked={objLocked}
                onEditKR={kr=>setModal({type:"kr",item:kr,sobjId:kr.parent,locked:objLocked})}
                onAddKR={sid=>setModal({type:"kr",item:null,sobjId:sid,locked:objLocked})}
                onEditSobj={s=>setModal({type:"sobj",item:s,isNew:false,parentObjId:obj.id})}
                collapsed={collSobj} toggle={toggleSobj}/>)}
              {!objLocked&&<button onClick={()=>setModal({type:"sobj",item:null,isNew:true,parentObjId:obj.id})}
                style={{fontSize:11,color:"#9e9890",background:"none",border:"none",borderTop:"1px dashed #e2ddd6",width:"100%",padding:"8px 28px",textAlign:"left",cursor:"pointer"}}>
                + Ajouter un sous-objectif
              </button>}
            </div>}
          </div>;
        })}
        {!allLocked&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <button onClick={()=>setModal({type:"obj",item:null,isNew:true})} style={{fontSize:13,color:"#2d6a4f",background:"#d8f3dc",border:"1px dashed #2d6a4f",borderRadius:10,padding:"12px",textAlign:"center",cursor:"pointer"}}>+ Ajouter un objectif</button>
          <button onClick={()=>setModal({type:"import"})} style={{fontSize:13,color:"#1d4ed8",background:"#eff6ff",border:"1px dashed #1d4ed8",borderRadius:10,padding:"12px",textAlign:"center",cursor:"pointer"}}>↓ Importer d'une saison</button>
        </div>}
      </div>
    </div>

    {modal?.type==="obj"&&<ObjModal obj={modal.item} isNew={modal.isNew} people={people} isAdmin={isAdmin} onClose={()=>setModal(null)} onSave={d=>handleObjSave({...d,_id:modal.item?.id,_isNew:modal.isNew})} onDelete={()=>handleObjDel(modal.item.id)} onLock={()=>lockObj(modal.item.id)} onUnlock={()=>{unlockObj(modal.item.id);}} onUnlockRequest={()=>setModal({type:"unlock",item:modal.item})}/>}
    {modal?.type==="sobj"&&<SobjModal sobj={modal.item} isNew={modal.isNew} parentObjId={modal.parentObjId} people={people} subobjectives={subobjectives} onClose={()=>setModal(null)} onSave={d=>handleSobjSave({...d,_id:modal.item?.id,_isNew:modal.isNew,_parentObjId:modal.parentObjId})} onDelete={()=>handleSobjDel(modal.item.id)}/>}
    {modal?.type==="kr"&&<KRModal kr={modal.item} sobjId={modal.sobjId} people={people} keyresults={keyresults} locked={modal.locked} onClose={()=>setModal(null)} onSave={d=>handleKRSave({...d,_id:modal.item?.id,_sobjId:modal.sobjId})} onDelete={()=>handleKRDel(modal.item.id)}/>}
    {modal?.type==="import"&&<ImportObjModal allSeasons={allSeasons} currentSeasonKey={seasonKey} people={people} onClose={()=>setModal(null)} onImport={handleImport}/>}
    {showJournal&&<JournalModal seasonKey={seasonKey} onClose={()=>setShowJournal(false)} isAdmin={isAdmin} currentPrenom={teamMember?.prenom}/>}
    {modal?.type==="unlock"&&<UnlockModal objTitle={modal.item?.title} onClose={()=>setModal(null)} onUnlock={()=>unlockObj(modal.item.id)}/>}
    {saved&&<div style={{position:"fixed",bottom:20,right:20,background:"#2d6a4f",color:"#fff",fontSize:12,fontWeight:500,padding:"8px 16px",borderRadius:20,boxShadow:"0 2px 8px rgba(0,0,0,.2)",zIndex:200,pointerEvents:"none"}}>✓ Sauvegardé</div>}
  </div>;
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App(){
  const [authUser,setAuthUser]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [authError,setAuthError]=useState("");
  const [page,setPage]=useState("dashboard"); // dashboard | okr | update | settings
  const [teamMembers,setTeamMembers]=useState([]);
  const [questions,setQuestions]=useState(DEFAULT_QUESTIONS);
  const [catTypes,setCatTypes]=useState(DEFAULT_CAT_TYPE);
  const [myUpdates,setMyUpdates]=useState([]);
  const [allUpdates,setAllUpdates]=useState([]);
  const [managerNotifs,setManagerNotifs]=useState([]);
  const [teammateNotifs,setTeammateNotifs]=useState([]);
  const [appLoaded,setAppLoaded]=useState(false);
  const [okrData,setOkrData]=useState({objectives:[],subobjectives:[],keyresults:[]});

  // Firebase auth listener
  useEffect(()=>{
    const unsub=onAuthStateChanged(auth,(user)=>{setAuthUser(user);setAuthLoading(false);});
    return()=>unsub();
  },[]);

  // Load app config from Firestore when logged in
  useEffect(()=>{
    if(!authUser)return;
    const email=authUser.email;
    if(!email.endsWith("@"+ALLOWED_DOMAIN)){setAuthError("Accès refusé. Seuls les membres Oé peuvent se connecter.");signOut(auth);return;}

    // Load team members & questions
    const unsub=onSnapshot(doc(db,"app_config","main"),(snap)=>{
      if(snap.exists()){
        const d=snap.data();
        if(d.teamMembers)setTeamMembers(d.teamMembers);
        if(d.questions)setQuestions(d.questions);
        if(d.catTypes)setCatTypes(d.catTypes);
      } else {
        // Init with defaults
        const defaultMembers=[
          {prenom:"Fx",email:"fx@oeforgood.com",managerEmail:"",role:"owner"},
          {prenom:"Thomas",email:"thomas@oeforgood.com",managerEmail:"fx@oeforgood.com",role:"admin"},
          {prenom:"Claire",email:"claire@oeforgood.com",managerEmail:"thomas@oeforgood.com",role:"teammate"},
          {prenom:"Christelle",email:"christelle@oeforgood.com",managerEmail:"thomas@oeforgood.com",role:"teammate"},
          {prenom:"Fiona",email:"fiona@oeforgood.com",managerEmail:"fx@oeforgood.com",role:"teammate"},
          {prenom:"Julie",email:"julie@oeforgood.com",managerEmail:"fx@oeforgood.com",role:"teammate"},
          {prenom:"Juliette",email:"juliette@oeforgood.com",managerEmail:"thomas@oeforgood.com",role:"teammate"},
          {prenom:"Guillemette",email:"guillemette@oeforgood.com",managerEmail:"thomas@oeforgood.com",role:"teammate"},
          {prenom:"Gareth",email:"gareth@oeforgood.com",managerEmail:"thomas@oeforgood.com",role:"teammate"},
          {prenom:"Maxime",email:"maxime@oeforgood.com",managerEmail:"christelle@oeforgood.com",role:"teammate"},
        ];
        setTeamMembers(defaultMembers);
        setDoc(doc(db,"app_config","main"),{teamMembers:defaultMembers,questions:DEFAULT_QUESTIONS});
      }
      setAppLoaded(true);
    });

    // Load OKR data for dashboard
    const unsubOkr=onSnapshot(doc(db,"okr","data"),(snap)=>{if(snap.exists()&&snap.data().allSeasons){const d=snap.data();const sk=d.seasonKey||"printemps_2026";const s=d.allSeasons[sk]||{};setOkrData({objectives:s.objectives||[],subobjectives:s.subobjectives||[],keyresults:s.keyresults||[],seasonKey:sk});}});

    return()=>{unsub();unsubOkr();};
  },[authUser]);

  // Load my updates & manager notifications
  useEffect(()=>{
    if(!authUser||!teamMembers.length)return;
    const me=teamMembers.find(m=>m.email===authUser.email);
    if(!me)return;

    // My updates + all updates for mood curve
    const unsubUpdates=onSnapshot(collection(db,"updates"),(snap)=>{
      const all=snap.docs.map(d=>({id:d.id,...d.data()}));
      setMyUpdates(all.filter(u=>u.email===authUser.email));
      setAllUpdates(all);
    });

    // Flush pending notifications when app opens after Friday 15h
    if(isUpdateLocked()){
      const flushPending=async()=>{
        try{
          const snap=await getDocs(query(collection(db,"update_notifications"),where("pending","==",true)));
          for(const d of snap.docs){
            await updateDoc(doc(db,"update_notifications",d.id),{pending:false,updatedAt:d.data().updatedAt||d.data().submittedAt});
          }
        }catch(e){console.error("flush pending:",e);}
      };
      flushPending();
    }

    // Notifications for manager: updates from my direct reports
    const myReports=teamMembers.filter(m=>m.managerEmail===authUser.email);
    let unsubNotifs=()=>{};
    if(myReports.length>0){
      unsubNotifs=onSnapshot(collection(db,"update_notifications"),(snap)=>{
        const all=snap.docs.map(d=>({id:d.id,...d.data()}));
        setManagerNotifs(all.filter(n=>n.managerEmail===authUser.email).sort((a,b)=>b.submittedAt-a.submittedAt));
      });
    }

    // Listen for teammate notifications (manager read your update)
    const unsubTmNotifs=onSnapshot(collection(db,"teammate_notifications"),(snap)=>{
      const all=snap.docs.map(d=>({id:d.id,...d.data()}));
      setTeammateNotifs(all.filter(n=>n.toEmail===authUser.email).sort((a,b)=>b.createdAt-a.createdAt));
    });

    return()=>{unsubUpdates();unsubNotifs();unsubTmNotifs();};
  },[authUser,teamMembers]);

  const currentTeamMember=useMemo(()=>teamMembers.find(m=>m.email===authUser?.email),[teamMembers,authUser]);
  const isAdmin=currentTeamMember?.role==="admin"||currentTeamMember?.role==="owner";

  async function handleLogin(){
    try{
      setAuthError("");
      const result=await signInWithPopup(auth,provider);
      if(!result.user.email.endsWith("@"+ALLOWED_DOMAIN)){
        await signOut(auth);
        setAuthError("Accès refusé. Seuls les membres @oeforgood.com peuvent se connecter.");
      }
    }catch(e){setAuthError("Erreur de connexion. Réessayez.");}
  }

  async function handleUpdateSubmit(updateData){
    const me=currentTeamMember;
    // Save update with updatedAt timestamp
    const weekDocId=`${authUser.email}_${updateData.weekKey}`;
    const updateWithMeta={...updateData,email:authUser.email,prenom:me?.prenom,updatedAt:Date.now()};
    await setDoc(doc(db,"updates",weekDocId),updateWithMeta);

    // Create/update notification for manager
    if(me?.managerEmail){
      const notifId=`${authUser.email}_${updateData.weekKey}_notif`;
      const answersWithoutConfidential={...updateData.answers};
      const confidentiel=updateData.answers?.q6||null;
      delete answersWithoutConfidential.q6;
      const notifData={
        fromEmail:authUser.email,fromPrenom:me?.prenom,managerEmail:me?.managerEmail,
        weekKey:updateData.weekKey,submittedAt:updateData.submittedAt,
        updatedAt:Date.now(),
        answers:answersWithoutConfidential,confidentiel,
        read:false,readAt:null,
        pending:!isUpdateLocked(), // pending = not yet delivered to manager
      };
      await setDoc(doc(db,"update_notifications",notifId),notifData);

      // Save "read" notification for the teammate (for when manager reads)
      // This is stored as a separate collection for teammate notifications
    }
  }

  async function handleDeleteUpdate(weekKey){
    if(!authUser)return;
    const docId=`${authUser.email}_${weekKey}`;
    try{
      await deleteDoc(doc(db,"updates",docId));
      const notifId=`${authUser.email}_${weekKey}_notif`;
      try{await deleteDoc(doc(db,"update_notifications",notifId));}catch(e){}
    }catch(e){console.error(e);}
  }

  async function handleReadNotif(notif){
    const now=Date.now();
    // Mark as read
    await updateDoc(doc(db,"update_notifications",notif.id),{read:true,readAt:now});
    // Send notification to teammate that manager read their update
    const{mon,fri}=getWeekBounds(notif.weekKey);
    const fmtD=d=>`${d.getDate()} ${d.toLocaleString("fr-FR",{month:"long"})}`;
    const sameM=mon.getMonth()===fri.getMonth();
    const weekLabel=sameM?`semaine du lundi ${mon.getDate()} au vendredi ${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"long"})}`:`semaine du lundi ${mon.getDate()} ${mon.toLocaleString("fr-FR",{month:"long"})} au vendredi ${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"long"})}`;
    const managerPrenom=currentTeamMember?.prenom;
    // Store as a teammate_notification readable by the teammate
    const tmNotifId=`${notif.fromEmail}_${notif.weekKey}_read`;
    await setDoc(doc(db,"teammate_notifications",tmNotifId),{
      toEmail:notif.fromEmail,
      fromPrenom:managerPrenom,
      weekKey:notif.weekKey,
      title:`${managerPrenom} a vu ton Update`,
      message:`${managerPrenom} a lu ton Update de la ${weekLabel}.`,
      createdAt:now,
      read:false,
    });
  }

  async function handleSaveMembers(members){
    await setDoc(doc(db,"app_config","main"),{teamMembers:members,questions},);
    setTeamMembers(members);
  }
  async function handleSaveQuestions(qs){
    await setDoc(doc(db,"app_config","main"),{teamMembers,questions:qs,catTypes});
    setQuestions(qs);
  }
  async function handleSaveCatTypes(ct){
    await setDoc(doc(db,"app_config","main"),{teamMembers,questions,catTypes:ct});
    setCatTypes(ct);
  }

  if(authLoading)return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5f3ef",fontFamily:"system-ui"}}>
    <div style={{textAlign:"center"}}><div style={{fontSize:32,marginBottom:8}}>🍾</div><div style={{color:"#9e9890",fontSize:13}}>Chargement…</div></div>
  </div>;

  if(!authUser)return <LoginPage onLogin={handleLogin} error={authError}/>;

  if(!appLoaded)return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5f3ef",fontFamily:"system-ui"}}>
    <div style={{textAlign:"center"}}><div style={{fontSize:32,marginBottom:8}}>🍾</div><div style={{color:"#9e9890",fontSize:13}}>Chargement de l'espace…</div></div>
  </div>;

  // Check if user is allowed
  if(!currentTeamMember&&authUser){
    return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5f3ef",fontFamily:"system-ui"}}>
      <div style={{textAlign:"center",background:"#fff",borderRadius:12,padding:32,maxWidth:400}}>
        <div style={{fontSize:32,marginBottom:8}}>🚫</div>
        <div style={{fontSize:16,fontWeight:600,marginBottom:8}}>Compte non autorisé</div>
        <div style={{fontSize:13,color:"#6b6560",marginBottom:16}}>Votre compte ({authUser.email}) n'est pas encore autorisé. Contactez un administrateur Oé.</div>
        <button onClick={()=>signOut(auth)} style={{fontSize:13,color:"#c0392b",background:"#fdecea",border:"1px solid #fca5a5",borderRadius:6,padding:"7px 14px",cursor:"pointer"}}>Se déconnecter</button>
      </div>
    </div>;
  }

  if(page==="okr")return <OKRPage onBack={()=>setPage("dashboard")} currentUser={authUser} teamMember={currentTeamMember} isAdmin={isAdmin} teamMembers={teamMembers}/>;
  if(page==="update")return <UpdatePage teamMember={currentTeamMember} questions={questions} onSubmit={handleUpdateSubmit} onDelete={handleDeleteUpdate} onBack={()=>setPage("dashboard")} myUpdates={myUpdates}/>;
  if(page==="settings"&&isAdmin)return <SettingsPage onBack={()=>setPage("dashboard")} currentUser={authUser} teamMembers={teamMembers} onSaveMembers={handleSaveMembers} questions={questions} onSaveQuestions={handleSaveQuestions} catTypes={catTypes} onSaveCatTypes={handleSaveCatTypes}/>;

  return <Dashboard
    currentUser={authUser}
    teamMember={currentTeamMember}
    onGoOKR={()=>setPage("okr")}
    onGoUpdate={()=>setPage("update")}
    onGoSettings={()=>setPage("settings")}
    myUpdates={myUpdates}
    allUpdates={allUpdates}
    managerNotifs={managerNotifs}
    teammateNotifs={teammateNotifs}
    onReadNotif={handleReadNotif}
    okrData={okrData}
    isAdmin={isAdmin}
    onOpenSettings={()=>setPage("settings")}
  />;
}
