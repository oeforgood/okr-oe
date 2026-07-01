import React, { useState, useEffect, useRef, useMemo } from "react";
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
  // weekKey rules:
  // Mon           → WN-1 (last chance, locked once submitted)
  // Tue           → null (blocked, no update possible)
  // Wed and after → WN (new week opens)
  // Fri <15h      → WN-1 still (within the WN-1 fill window... wait)
  //
  // Correct interpretation:
  // The "fill window" for WN-1 is: from Wed of WN-1 to Mon of WN
  // So: Wed WN-1, Thu WN-1, Fri WN-1 (<15h) → WN-1
  //     Fri WN-1 ≥15h, Sat, Sun, Mon WN → WN-1 but locked if submitted
  //     Tue WN → null
  //     Wed WN and beyond → WN
  //
  // In terms of day of week relative to NOW:
  // Mon(1) → WN-1
  // Tue(2) → null
  // Wed(3), Thu(4), Fri(5), Sat(6), Sun(0) → WN-1 of the CURRENT calendar week
  //   i.e. the week that started last Monday
  //
  // Wait - "mercredi et après weekKey = N" means:
  // After Tuesday of WN → WN becomes the active weekKey
  // So: Wed WN, Thu WN, Fri WN, Sat WN, Sun WN, Mon WN → WN-1
  //     Tue WN → null
  //     Wed WN+1 → WN (new cycle)
  //
  // Simpler: weekKey = week of the PREVIOUS Monday always, EXCEPT:
  // - Tuesday → null
  // - Wednesday → the week starting YESTERDAY (last Monday was 6 days ago... no)
  //
  // Let me re-read the rule:
  // "jusqu'à vendredi 15h de N-1, weekkey = N-1"  → Mon/Tue/Wed/Thu/Fri<15h all refer to WN-1
  // "de vendredi 15h à lundi, weekkey = N-1 but locked if submitted"
  // "mardi = pas d'update"
  // "mercredi et après weekkey = N"
  //
  // So the CYCLE is:
  // Wed WN-1 → first day you can fill WN-1 (weekKey = WN-1 = previous week)
  // ...
  // Mon WN → last day to fill WN-1
  // Tue WN → blocked
  // Wed WN → NOW weekKey switches to WN (which was "current" week)
  //
  // Implementation: always return WN-1 except Tue(null) and Wed+(return WN)
  // But Wed onwards means: the week starting THIS Monday (5 days ago on Wed)
  // No wait: on Wednesday June 25, WN = week of June 23-27
  // WN-1 = week of June 16-20
  // weekKey should be WN = 2026-W26 on Wednesday June 25
  
  const now = new Date();
  const dow = now.getDay(); // 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
  
  if(dow===2) return null; // Tuesday: blocked
  
  // Get WN-1 monday (last week's monday)
  const wn1Mon = new Date(now);
  wn1Mon.setDate(now.getDate() - (dow===0?13:dow===1?7:dow+6));
  const wkN1 = getWeekKey(wn1Mon);
  
  // Get WN monday (this week's monday)  
  const wnMon = new Date(now);
  wnMon.setDate(now.getDate() - (dow===0?6:dow-1));
  const wkN = getWeekKey(wnMon);
  
  // Wednesday(3), Thursday(4), Friday(5), Saturday(6), Sunday(0) after Tuesday → WN
  // Monday(1) → WN-1
  if(dow===1) return wkN1; // Monday: WN-1
  return wkN; // Wed-Sun: WN
}

function isUpdateLocked(submitted){
  const now=new Date();
  const dow=now.getDay();
  // Tuesday = always locked (no editing)
  if(dow===2)return true;
  // Locked if submitted AND past Friday 15h (Fri>=15h, Sat, Sun, Mon)
  if(!submitted)return false;
  if(dow===5&&now.getHours()>=15)return true; // Fri after 15h
  if(dow===6||dow===0||dow===1)return true;   // Sat, Sun, Mon
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

function toDateStr(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
 function get26Weeks(myUpdates, email){
  const now = new Date();
  const currentWk = getWeekKey(now);
  const weeks = [];
  for(let i=25; i>=0; i--){
    const d = new Date(now);
    d.setDate(now.getDate() - i*7);
    const wk = getWeekKey(d);
    const {mon,fri} = getWeekBounds(wk);
    const update = myUpdates.find(u=>u.weekKey===wk);
    const monStr = toDateStr(mon);
    const declared = email && (window._absences||[]).find(a=>
      a.email===email && monStr>=a.dateFrom && monStr<=a.dateTo
    );
    let status = "none";
    if(declared){ status = "absent"; }
    else if(update){
      const submDay = new Date(update.submittedAt).getDay();
      status = submDay===1 ? "late" : "done";
    } else if(wk===currentWk){ status = "pending"; }
    weeks.push({wk,mon,fri,status,update,isCurrentWeek:wk===currentWk,declared});
  }
  return weeks;
}


const DOT_COLORS = {
  done:    {bg:"#2d6a4f", border:"#2d6a4f"},
  late:    {bg:"#f59e0b", border:"#f59e0b"},
  none:    {bg:"#fca5a5", border:"#ef4444"},
  pending: {bg:"#e2ddd6", border:"#c5c0b8"},
  absent:  {bg:"#e2ddd6", border:"#c5c0b8"},
};

function WeekDots({myUpdates, clickable=false, onClickUpdate, dotSize=14, email, hideCurrentWeek=false}){
  const weeks = get26Weeks(myUpdates, email);
  const [hov,setHov]=useState(null);
  return <div style={{position:"relative",display:"flex",gap:0,flexWrap:"nowrap",alignItems:"center"}}>
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
      const MOOD_SCORE={'😊':5,'🙂':4,'😐':3,'😕':2,'😩':1};
      const isCurWk=w.status!=='none'&&w.isCurrentWeek;
      let emoji;
      if(w.declared){emoji=w.declared.type;}
      else if(w.status==='done'||w.status==='late'){emoji=(hideCurrentWeek&&w.isCurrentWeek)?'🫥':(w.update?.answers?.q7||'😐');}
      else{emoji='🫥';}
      const opacity=(w.status==='none'||w.status==='absent'||w.status==='pending'||w.declared)?0.35:1;
      // Vertical offset based on mood: each level = 5px shift (mood 3 = center)
      const score=MOOD_SCORE[emoji]||3;
      const translateY=(3-score)*5; // mood5=-10px (top), mood1=+10px (bottom)
      return <div key={i}
        onClick={()=>clickable&&w.update&&onClickUpdate&&onClickUpdate(w)}
        onMouseEnter={()=>setHov(i)}
        onMouseLeave={()=>setHov(null)}
        style={{
          width:31,height:31,display:"flex",alignItems:"center",justifyContent:"center",
          flexShrink:0,cursor:clickable&&w.update?"pointer":"default",
          fontSize:22,lineHeight:1,opacity,
        }}>
        {emoji}
      </div>;
    })}
  </div>;
}

function UpdateStreakWithCurve({myUpdates, allUpdates=[], clickable=false, onClickUpdate, onGoUpdate, showDots=true, nWeeks=26, curveHeight=64, fillContainer=false, stretchHeight=false}){
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
  const W=340,DOT_Y=4,CURVE_TOP=0,CURVE_H=Math.max(curveHeight-12,50),AXIS_H=0,pad=4;
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
  return <div style={{position:"relative",width:"100%",height:stretchHeight?"100%":undefined,overflow:"hidden"}}>
    {hoveredDot!==null&&weeks[hoveredDot]&&(()=>{
      const w=weeks[hoveredDot];
      const sameM2=w.mon.getMonth()===w.fri.getMonth();
      const tip=sameM2
        ?`Semaine du lundi ${w.mon.getDate()} au vendredi ${w.fri.getDate()} ${w.fri.toLocaleString("fr-FR",{month:"long"})}`
        :`Semaine du lundi ${w.mon.getDate()} ${w.mon.toLocaleString("fr-FR",{month:"long"})} au vendredi ${w.fri.getDate()} ${w.fri.toLocaleString("fr-FR",{month:"long"})}`;
      const xPct=dotX(hoveredDot)/W*100;
      return <div style={{position:"absolute",top:-28,left:`${xPct}%`,transform:"translateX(-50%)",background:"#1a1814",color:"#fff",fontSize:10,padding:"3px 8px",borderRadius:4,whiteSpace:"nowrap",zIndex:10,pointerEvents:"none"}}>{tip}</div>;
    })()}
    <svg width="100%" height={curveHeight} viewBox={`0 0 ${W} ${totalH}`} preserveAspectRatio="none" style={{display:"block",overflow:"hidden"}}>
      {/* Month separator lines */}
      {monthSeps.map((s,i)=><line key={i} x1={s.x} x2={s.x} y1={0} y2={CURVE_H} stroke="#e2ddd6" strokeWidth="0.5" strokeDasharray="2,2"/>)}
      {/* Month labels overlaid at bottom of curve */}
      {monthLabels.map((m,i)=>{
        const short=m.label.slice(0,3).toUpperCase().replace('É','É').replace('Û','Û');
        return <text key={i} x={m.x} y={curveY(1.2)} fontSize="10" fill="#b5b0a8" textAnchor="middle" fontWeight="500" style={{pointerEvents:"none"}}>{short}</text>;
      })}
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

      {/* Curve */}
      {validPts.length>=2&&<path d={pathD} fill="none" stroke="#2d6a4f" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>}
      {/* Curve dots */}
      {validPts.map((w,j)=><circle key={j} cx={dotX(w.i)} cy={curveY(w.avg)} r="2.5" fill={colorForAvg(w.avg)} stroke="#fff" strokeWidth="1">
        <title>{`Mood moyen : ${w.avg.toFixed(1)}/5 (${w.count} réponses)`}</title>
      </circle>)}
    </svg>

  </div>;
}

function UpdateStreak({myUpdates, allUpdates=[], onGoUpdate}){
  return <UpdateStreakWithCurve myUpdates={myUpdates} allUpdates={allUpdates} clickable={false} onGoUpdate={onGoUpdate}/>;
}

function NotifDetail({notif, teamMember, teamMembers=[]}) {
  const answers=notif?.answers||{};
  const moodVal=answers.q7||"";
  // q6 visible if viewer is author's manager
  const viewerEmail=teamMember?.email;
  const authorEmail=notif?.fromEmail||notif?.email;
  const isManager=!!(viewerEmail&&authorEmail&&
    teamMembers.find(m=>m.email===authorEmail&&m.managerEmail===viewerEmail));
  const visibleQs=DEFAULT_QUESTIONS.filter(q=>answers[q.id]&&(q.id!=='q6'||isManager));
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

function MessagesPanel({managerNotifs,teammateNotifs=[],onReadNotif,teamMember,teamMembers=[],myUpdates=[]}){
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

  return <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2ddd6",boxShadow:"0 1px 3px rgba(0,0,0,.06)",display:"flex",flexDirection:"column",height:145,overflow:"hidden"}}>
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
         style={{display:"flex",alignItems:"center",gap:10,padding:"3px 18px",cursor:"pointer",borderBottom:"1px solid #f8f7f5",background:"transparent"}}
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
          :<NotifDetail notif={selected.notif} teamMember={teamMember} teamMembers={teamMembers||[]} onRead={()=>{onReadNotif&&onReadNotif(selected.notif);setSelected(null);}}/>
        }

      </div>
    </div>}
  </div>;
}

function ReportingBanner({onGoReporting}) {
  const [caData, setCaData] = useState(null);
  const [caRows, setCaRows] = useState({});
  const [expandedCanal,setExpandedCanal]=useState({});
  const [expandedTiers,setExpandedTiers]=useState({});
  const [chargeData, setChargeData] = useState(null);
  const [importedAt, setImportedAt] = useState(null);

  useEffect(()=>{
    const u1=onSnapshot(doc(db,'reporting','ca'),(snap)=>{if(snap.exists()){setCaData(snap.data().caData);const cr=snap.data().caRows||{};console.log('caRows keys:',Object.keys(cr));setCaRows(cr);}});
    const u2=onSnapshot(doc(db,'reporting','charges'),(snap)=>{if(snap.exists())setChargeData(snap.data().chargeData);});
    const u3=onSnapshot(doc(db,'reporting','meta'),(snap)=>{if(snap.exists())setImportedAt(snap.data().importedAt);});
    return()=>{u1();u2();u3();};
  },[]);

  if (!caData) return null;

  // Compute YTD from CA data
  const REPORTING_CANALS_ALL = ['E-commerce B2C','CHR','Grands Comptes','Retail','Export','Autres B2B','Régénération'];
  const CANAL_CSV_MAP2 = {'E-commerce B2C':'B2C','CHR':'CHR','Grands Comptes':'Grands Comptes','Retail':'Retail','Export':'Export','Autres B2B':'Autres B2B','Régénération':'Régénération'};
  const CANAL_MARGIN2 = {'E-commerce B2C':0.270,'CHR':0.293,'Grands Comptes':0.266,'Retail':0.292,'Export':0.231,'Autres B2B':0.225,'Régénération':1.0};

  function sumYTD(dataByKey) {
    return Object.entries(dataByKey||{}).reduce((s,[,v])=>s+v,0);
  }

  let caYTD = 0, mbYTD = 0;
  REPORTING_CANALS_ALL.forEach(canal => {
    const csvKey = CANAL_CSV_MAP2[canal]||canal;
    const canalData = caData[csvKey]||{};
    const canalTotal = Object.values(canalData).reduce((a,b)=>a+b,0);
    caYTD += canalTotal;
    mbYTD += canalTotal * (CANAL_MARGIN2[canal]||0.263);
  });

  let chargesExplYTD = 0, autresChargesYTD = 0;
  if (chargeData) {
    Object.entries(chargeData).forEach(([subcat, data]) => {
      const total = Object.values(data.months||{}).reduce((a,b)=>a+b,0);
      // Simple: use Z2 = COGS, T1/I1 = autres, rest = charges expl
      const code = subcat.slice(0,2);
      if(['T1','I1'].includes(code)) autresChargesYTD += total;
      else if(!['Z1','Z2'].includes(code)) chargesExplYTD += total;
    });
  }

  const ebitdaYTD = mbYTD + chargesExplYTD;
  const resultatYTD = ebitdaYTD + autresChargesYTD;
  const mbPct = caYTD ? mbYTD/caYTD*100 : 0;

  function fmtK(v) {
    if (!v) return '—';
    return new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0}).format(Math.round(v/1000))+'k';
  }

  const ebitdaCol = ebitdaYTD >= 0 ? '#2d6a4f' : '#c0392b';
  const resultatCol = resultatYTD >= 0 ? '#2d6a4f' : '#c0392b';

  const items = [
    {label:"CA YTD",val:caYTD,col:"#1a1814"},
    {label:"Marge Brute",val:mbYTD,col:"#2d6a4f"},
    {label:"Charges expl.",val:Math.abs(chargesExplYTD),col:"#b5680f"},
    {label:"EBITDA",val:ebitdaYTD,col:ebitdaCol},
    {label:"Trésorerie",val:303000,col:"#1d4ed8"},
  ];

  return (
    <div style={{background:"#fff",border:"1px solid #e2ddd6",borderRadius:10,padding:"14px 20px",
      display:"flex",alignItems:"center",gap:0,boxShadow:"0 1px 3px rgba(0,0,0,.04)",marginBottom:4}}>
      {items.map((item,i)=><>
        <div key={item.label} style={{flex:1,textAlign:"center",padding:"0 12px"}}>
          <div style={{fontSize:26,fontWeight:700,color:item.col,lineHeight:1,fontFamily:"monospace"}}>{fmtK(item.val)}</div>
          <div style={{fontSize:9,color:"#9e9890",marginTop:3,textTransform:"uppercase",letterSpacing:".05em"}}>{item.label}</div>
        </div>
        {i<4&&<div key={"sep"+i} style={{width:1,background:"#e2ddd6",alignSelf:"stretch",flexShrink:0}}/>}
      </>)}
      <div style={{width:1,background:"#e2ddd6",alignSelf:"stretch",flexShrink:0}}/>
      {/* Button as 6th item */}
      <div style={{flex:1,textAlign:"center",padding:"0 12px"}}>
        <button onClick={onGoReporting}
          style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",
            background:"#2d6a4f",color:"#fff",border:"none",borderRadius:8,
            cursor:"pointer",fontSize:12,fontWeight:500,
            transition:"opacity .15s"}}
          onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          📈 Voir le Reporting
        </button>
      </div>
    </div>
  );
}

function FeedbackBox({currentUser, teamMember}) {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  async function send() {
    if (!text.trim()) return;
    await addDoc(collection(db, 'feedback'), {
      from: teamMember?.prenom || currentUser?.email || 'Anonyme',
      email: currentUser?.email || '',
      message: text.trim(),
      createdAt: Date.now(),
      read: false,
    });
    setText('');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div style={{background:"#fff",border:"1px solid #e2ddd6",borderRadius:10,padding:"10px 14px",
      boxShadow:"0 1px 3px rgba(0,0,0,.06)",display:"flex",flexDirection:"column",gap:6,height:145,boxSizing:"border-box"}}>
      <div style={{fontSize:12,fontWeight:600,color:"#6b6560",textTransform:"uppercase",letterSpacing:".05em"}}>
        💡 Idées & corrections
      </div>
      <div style={{fontSize:11,color:"#9e9890",lineHeight:1.4}}>
        Suggestions d'amélioration ou corrections pour 🌼 Calendula
      </div>
      <textarea
        value={text}
        onChange={e=>setText(e.target.value)}
        rows={2}
        placeholder="Ton idée ou correction…"
        style={{fontSize:12,border:"1px solid #e2ddd6",borderRadius:6,padding:"6px 8px",
          fontFamily:"inherit",resize:"none",outline:"none",color:"#1a1814",flex:1,minHeight:0}}
      />
      {sent
        ? <div style={{fontSize:11,color:"#2d6a4f",fontWeight:500,textAlign:"center"}}>✓ Envoyé !</div>
        : <button onClick={send} disabled={!text.trim()}
            style={{padding:"6px 12px",background:text.trim()?"#2d6a4f":"#f5f3ef",
              color:text.trim()?"#fff":"#c5c0b8",border:"none",borderRadius:6,
              cursor:text.trim()?"pointer":"not-allowed",fontSize:11,fontWeight:500,
              transition:"all .15s"}}>
            Envoyer
          </button>
      }
    </div>
  );
}

function Dashboard({currentUser,teamMember,teamMembers=[],onGoOKR,onGoUpdate,onGoReporting,myUpdates,allUpdates,managerNotifs,teammateNotifs=[],onReadNotif,okrData,isAdmin,onOpenSettings}){
  const {objectives=[],subobjectives=[],keyresults=[],seasonKey:_sk}=okrData||{};
  const seasonKey=okrData?.seasonKey||"printemps_2026";
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

      {/* ── TOP: Notifications + Feedback ── */}
      <div style={{display:"grid",gridTemplateColumns:"3fr 1fr",gap:12,marginBottom:16,alignItems:"stretch"}}>
        <MessagesPanel managerNotifs={managerNotifs} teammateNotifs={teammateNotifs} onReadNotif={onReadNotif} teamMember={teamMember} teamMembers={teamMembers} myUpdates={myUpdates}/>
        <FeedbackBox currentUser={currentUser} teamMember={teamMember}/>
      </div>

      {/* ── SECTION OKR ── pleine largeur */}
      <div style={{display:"flex",flexDirection:"column",gap:2,marginBottom:16}}>
        <SeasonBanner seasonKey={seasonKey||"printemps_2026"} avgProg={avgProg} totalKR={totalKR} doneKR={doneKR}/>
        {/* Personal banner with OKR button inside */}
        {myKRsOwned.length>0&&(()=>{
          const col=progColorRel(myPersonalProg,avgProg);
          const krCol=progColorRel(myKRDoneOwned/Math.max(myKRsOwned.length,1)*100,avgProg);
          return <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:10,padding:"14px 20px",
            display:"flex",alignItems:"center",gap:20,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
            {/* Left: % */}
            <div style={{flexShrink:0,textAlign:"center",width:100}}>
              <div style={{fontSize:52,fontWeight:700,fontFamily:"monospace",color:col,lineHeight:1}}>{Math.round(myPersonalProg)}%</div>
              <div style={{fontSize:10,color:"#6b6560",marginTop:3,textTransform:"uppercase",letterSpacing:".06em"}}>{myPrenom||"Moi"}</div>
            </div>
            <div style={{width:1,background:"#86efac",alignSelf:"stretch",flexShrink:0}}/>
            {/* Middle: bar + OKR button */}
            <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:8}}>
              <Bar v={myPersonalProg} label="Mon avancement" w={0}/>
              <div style={{display:"flex",justifyContent:"flex-end"}}>
                <button onClick={onGoOKR} style={{
                  display:"flex",alignItems:"center",gap:8,padding:"6px 16px",
                  background:"#2d6a4f",color:"#fff",border:"none",borderRadius:8,
                  cursor:"pointer",fontSize:12,fontWeight:500,
                  transition:"opacity .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  <span>📊</span> Aller aux OKR et mettre à jour
                </button>
              </div>
            </div>
            <div style={{width:1,background:"#86efac",alignSelf:"stretch",flexShrink:0}}/>
            {/* Right: KR */}
            <div style={{flexShrink:0,textAlign:"center",width:90}}>
              <div style={{fontSize:22,fontWeight:600,fontFamily:"monospace",color:krCol}}>{myKRDoneOwned}/{myKRsOwned.length}</div>
              <div style={{fontSize:10,color:"#6b6560",marginTop:2}}>KR complétés</div>
            </div>
          </div>;
        })()}
      </div>

      {/* ── SECTION UPDATES ── pleine largeur */}
      {(()=>{
        const MOOD_SCORE={"😊":5,"🙂":4,"😐":3,"😕":2,"😩":1};
        const MOOD_FROM_SCORE=s=>s>=4.5?"😊":s>=3.5?"🙂":s>=2.5?"😐":s>=1.5?"😕":"😩";
        const now=new Date();
        // lastWkKey = calendar week 7 days ago
        const _7daysAgo=new Date(now);_7daysAgo.setDate(now.getDate()-7);
        const lastWkKey=getWeekKey(_7daysAgo);
        // curWkKey = current calendar week (always based on Monday of this week)
        const _thisMon=new Date(now);
        const _dow=_thisMon.getDay()||7;
        _thisMon.setDate(_thisMon.getDate()-_dow+1);
        const curWkKey=getWeekKey(_thisMon);
        const activeTeam=(teamMembers||[]).filter(m=>m.role!=="inactive"&&m.email);
        const activeCount=activeTeam.length||10;

        // Team updates sorted by submittedAt
        const teamLastWk=[...allUpdates].filter(u=>u.weekKey===lastWkKey).sort((a,b)=>a.submittedAt-b.submittedAt);
        // Only show current week updates after Friday 15h (locked)
        const curWkVisible=(()=>{const now=new Date();const dow=now.getDay();return dow===6||dow===0||dow===1||(dow===5&&now.getHours()>=15);})();
        const teamCurWk=curWkVisible?[...allUpdates].filter(u=>u.weekKey===curWkKey).sort((a,b)=>a.submittedAt-b.submittedAt):[];

        // Build last week full list: done members + absent members
        const doneLastWkEmails=new Set(teamLastWk.map(u=>u.email));
        const lastWkMon=_7daysAgo;
        const curWkMonRef=_thisMon;
        const isAbsentDeclared=(email,refDate)=>(window._absences||[]).some(a=>a.email===email&&toDateStr(refDate)>=a.dateFrom&&toDateStr(refDate)<=a.dateTo);
        const absentLastWk=activeTeam.filter(m=>(!doneLastWkEmails.has(m.email))||m.forceAbsent||m.forceMat||isAbsentDeclared(m.email,lastWkMon));
        const doneCurWkEmails=new Set(teamCurWk.map(u=>u.email));
        const absentCurWk=activeTeam.filter(m=>(!doneCurWkEmails.has(m.email))||m.forceAbsent||m.forceMat||isAbsentDeclared(m.email,curWkMonRef));
        // Remove forceMat/forceAbsent from done lists
        const teamLastWkFiltered=teamLastWk.filter(u=>!activeTeam.find(m=>m.email===u.email&&(m.forceMat||m.forceAbsent))&&!isAbsentDeclared(u.email,lastWkMon));
        const teamCurWkFiltered=teamCurWk.filter(u=>!activeTeam.find(m=>m.email===u.email&&(m.forceMat||m.forceAbsent))&&!isAbsentDeclared(u.email,curWkMonRef));

        const teamMoodScores=teamLastWk.filter(u=>u.answers?.q7).map(u=>MOOD_SCORE[u.answers.q7]||3);
        const teamMoodAvg=teamMoodScores.length?teamMoodScores.reduce((a,b)=>a+b,0)/teamMoodScores.length:null;

        // My personal data
        const myLastWkUpdate=myUpdates.find(u=>u.weekKey===lastWkKey);
        const myCurWkUpdate=myUpdates.find(u=>u.weekKey===curWkKey);
        const myMoodDisplay=myCurWkUpdate?.answers?.q7||myLastWkUpdate?.answers?.q7||null;
        const myMoodLastWk=myLastWkUpdate?.answers?.q7||null;
        const myMoodLabel=myCurWkUpdate?"cette semaine":"sem. passée";
        const my13Weeks=Array.from({length:13},(_,i)=>{
          const d=new Date(now);d.setDate(now.getDate()-(12-i)*7);
          const wk=getWeekKey(d);
          const u=myUpdates.find(x=>x.weekKey===wk);
          const{mon,fri}=getWeekBounds(wk);
          return{wk,u,mon,fri};
        });
        // Exclude weeks where user indicated absence from denominator
        // Completion rate: only the 12 past weeks (exclude current week = index 12)
        const my12PastWeeks=my13Weeks.slice(0,12);
        const myActiveWeeks=my12PastWeeks.filter(w=>{
          const declaredAbs=(window._absences||[]).find(a=>
            a.email===teamMember?.email&&toDateStr(w.mon)>=a.dateFrom&&toDateStr(w.mon)<=a.dateTo
          );
          return !declaredAbs;
        });
        const myUpdateCount=my13Weeks.filter(w=>w.u).length;
        const myCompletionRate=myActiveWeeks.length>0?Math.round(my12PastWeeks.filter(w=>w.u&&myActiveWeeks.includes(w)).length/myActiveWeeks.length*100):100;


  // Get absence icon for a teammate based on forceAbsent/forceMat flags or previous week's q8 answer
  function getAbsenceIcon(email, prenom, refDate) {
    const member = (teamMembers||[]).find(m => m.email === email);
    const checkDate = refDate || new Date();
    // Check declared absences
    const declaredAbs = (window._absences||[]).find(a=>
      a.email===email && toDateStr(checkDate)>=a.dateFrom && toDateStr(checkDate)<=a.dateTo
    );
    if (declaredAbs) return declaredAbs.type;
    if (member?.forceMat) return '🤰';
    if (member?.forceAbsent) {
      const mo = checkDate.getMonth() + 1;
      return ((mo >= 12 && checkDate.getDate() >= 15) || mo <= 4) ? '🎿' : '🌴';
    }
    // q8 is filled in WN-2 to announce absence for WN-1
    // Use refDate (checkDate) to find WN-2 relative to the week being checked
    const wn2Date=new Date(checkDate);
    wn2Date.setDate(checkDate.getDate()-7); // go back one more week to WN-2
    const wn2Key=getWeekKey(wn2Date);
    const prevUpdate = allUpdates.find(u => u.email === email && u.weekKey === wn2Key);
    const q8 = prevUpdate?.answers?.q8 || '';
    if (q8.includes('école') || q8.includes('École')) return '🎓';
    if (q8.includes('congés') || q8.includes('vacances')) {
      const mo = checkDate.getMonth() + 1;
      return ((mo >= 12 && checkDate.getDate() >= 15) || mo <= 4) ? '🎿' : '🌴';
    }
    return '🫥';
  }

        function SmileysOrdered({done,absent,size=22,hideMood=false}){
          const [hov,setHov]=useState(null);
          const [pos,setPos]=useState({x:0,y:0});
          // Absents = ceux avec 🤰/🎓/🌴/🎿 (forceMat, forceAbsent, ou q8 congés/école)
          const absentEmails=new Set(absent.map(m=>m.email));
          const realAbsents=absent.filter(m=>{
            const icon=getAbsenceIcon(m.email,m.prenom);
            return icon!=='🫥';
          });
          const realAbsentEmails=new Set(realAbsents.map(m=>m.email));
          // Sort: 🤰 first, then others
          const absentSorted=[...realAbsents].sort((a,b)=>{
            const aFirst=(a.forceMat)?0:1;
            const bFirst=(b.forceMat)?0:1;
            return aFirst-bFirst;
          });
          const absentItems=absentSorted.map(m=>({key:'a'+m.email,emoji:getAbsenceIcon(m.email,m.prenom),name:m.prenom,isAbsent:true}));
          // Done (excl. real absents), sorted by submittedAt
          const doneItems=done.filter(u=>!realAbsentEmails.has(u.email)).sort((a,b)=>a.submittedAt-b.submittedAt).map(u=>({key:'d'+u.email,emoji:hideMood?'🫥':(u.answers?.q7||"😐"),name:u.prenom,isAbsent:false}));
          // Not done = present actifs qui n'ont ni soumis ni sont absents → 🫥
          const doneEmails=new Set(done.map(u=>u.email));
          // notDone = actifs, non absents réels (🤰🎓🌴🎿), non complétés
          const notDoneItems=(teamMembers||[]).filter(m=>
            m.role!=="inactive"&&m.email&&
            !realAbsentEmails.has(m.email)&&
            !doneEmails.has(m.email)
          ).map(m=>({key:'n'+m.email,emoji:"🫥",name:m.prenom,isAbsent:false,notDone:true}));
          const all=[...absentItems,...doneItems,...notDoneItems];
          return <div style={{display:"flex",gap:2,flexWrap:"wrap",alignItems:"center"}}>
            {hov&&<div style={{position:"fixed",left:pos.x+10,top:pos.y-28,background:"#1a1814",color:"#fff",
              fontSize:10,padding:"2px 8px",borderRadius:4,whiteSpace:"nowrap",zIndex:9999,pointerEvents:"none"}}>{hov}</div>}
            {all.map(item=><span key={item.key} style={{fontSize:size,lineHeight:1,cursor:"default",
              opacity:item.isAbsent?0.8:item.notDone?0.5:1}}
              onMouseEnter={e=>{setHov(item.name);setPos({x:e.clientX,y:e.clientY});}}
              onMouseMove={e=>setPos({x:e.clientX,y:e.clientY})}
              onMouseLeave={()=>setHov(null)}>
              {item.emoji}
            </span>)}
          </div>;
        }

        function SmileysWithAbsents({done,absent,size=20}){
          const [hov,setHov]=useState(null);
          return <div style={{display:"flex",gap:3,flexWrap:"wrap",alignItems:"center",position:"relative"}}>
            {hov&&<div style={{position:"absolute",top:-22,left:0,background:"#1a1814",color:"#fff",
              fontSize:10,padding:"2px 8px",borderRadius:4,whiteSpace:"nowrap",zIndex:10,pointerEvents:"none"}}>{hov}</div>}
            {done.map((u,i)=><span key={"d"+i} style={{fontSize:size,lineHeight:1,cursor:"default"}}
              onMouseEnter={()=>setHov(u.prenom)} onMouseLeave={()=>setHov(null)}>
              {u.answers?.q7||"😐"}
            </span>)}
            {absent.map((m,i)=><span key={"a"+i} style={{fontSize:size,lineHeight:1,cursor:"default",opacity:0.7}}
              onMouseEnter={()=>setHov(m.prenom)} onMouseLeave={()=>setHov(null)}>{getAbsenceIcon(m.email,m.prenom)}</span>)}
          </div>;
        }

        function My13Smileys(){
          const [hov,setHov]=useState(null);
          const [pos,setPos]=useState({x:0,y:0});
          // Get icon for week (mood or absence icon)
          const getWeekIcon=(w)=>{
            if(w.u?.answers?.q7) return w.u.answers.q7;
            const member=(teamMembers||[]).find(m=>m.email===teamMember?.email);
            if(teamMember?.email==='claire@oeforgood.com') return '🤰';
            if(member?.forceMat) return '🤰';
            if(member?.forceAbsent){const mo=w.mon.getMonth()+1;return((mo>=12&&w.mon.getDate()>=15)||mo<=4)?'🎿':'🌴';}
            return '🫥';
          };
          return <div style={{display:"flex",gap:2,flexWrap:"nowrap",alignItems:"flex-end"}}>
            {hov&&<div style={{position:"fixed",left:pos.x+10,top:pos.y-28,background:"#1a1814",color:"#fff",
              fontSize:10,padding:"2px 8px",borderRadius:4,whiteSpace:"nowrap",zIndex:9999,pointerEvents:"none"}}>{hov}</div>}
            {my13Weeks.map((w,i)=>{
              const isLast=i===12;
              const icon=getWeekIcon(w);
              const sameM=w.mon.getMonth()===w.fri.getMonth();
              const tip=sameM?`Semaine du ${w.mon.getDate()} au ${w.fri.getDate()} ${w.fri.toLocaleString("fr-FR",{month:"long"})}`:`Semaine du ${w.mon.getDate()} ${w.mon.toLocaleString("fr-FR",{month:"short"})} au ${w.fri.getDate()} ${w.fri.toLocaleString("fr-FR",{month:"short"})}`;
              return <span key={i} style={{
                fontSize:isLast?44:22,
                lineHeight:1,
                cursor:"default",
                opacity:(w.u||isLast)?1:0.45,
                display:"inline-block",
                verticalAlign:"bottom",
              }}
                onMouseEnter={e=>{setHov(tip);setPos({x:e.clientX,y:e.clientY});}}
                onMouseMove={e=>setPos({x:e.clientX,y:e.clientY})}
                onMouseLeave={()=>setHov(null)}>{icon}</span>;
            })}
          </div>;
        }

        const todayUpdate=weekKey?myUpdates.find(u=>u.weekKey===weekKey):null;

        return <>
          {/* Updates section: 2/3 team + 1/3 perso, 320px tall */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:12,marginBottom:20}}>
          {/* Team Updates banner */}
          <div style={{background:"#fff",border:"1px solid #e2ddd6",borderRadius:10,padding:"14px 20px",
            display:"flex",alignItems:"stretch",gap:12,
            boxShadow:"0 1px 3px rgba(0,0,0,.04)",height:220,boxSizing:"border-box",overflow:"hidden"}}>
            {/* Left: team mood avg + ratio */}
            <div style={{flexShrink:0,textAlign:"center",width:90,display:"flex",flexDirection:"column",justifyContent:"center",gap:6}}>
              <div style={{fontSize:60,lineHeight:1}}>{teamMoodAvg?MOOD_FROM_SCORE(teamMoodAvg):"—"}</div>
               <div style={{height:10}}/>
              {(()=>{
                // Use getAbsenceIcon to detect all absences (declared + forceMat + q8 from WN-2)
                const presentTeam2=activeTeam.filter(m=>{
                  const icon=getAbsenceIcon(m.email,m.prenom,_7daysAgo);
                  return icon==='🫥'; // Only count truly non-absent members
                });
                const num=teamLastWk.filter(u=>presentTeam2.some(m=>m.email===u.email)).length;
                const denom=presentTeam2.length||activeCount;
                const krCol=num>=denom?"#2d6a4f":"#b5680f";
                return <div style={{textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:600,fontFamily:"monospace",color:krCol,lineHeight:1}}>{num}/{denom}</div>
                  <div style={{fontSize:10,color:"#9e9890",marginTop:2}}>updates sem. passée</div>
                </div>;
              })()}
            </div>
            <div style={{width:1,background:"#e2ddd6",flexShrink:0}}/>
            {/* Middle: smileys last week + this week */}
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:6,justifyContent:"center",minWidth:0}}>
              <div>
                <div style={{fontSize:9,color:"#9e9890",marginBottom:2,textTransform:"uppercase",letterSpacing:".05em",fontWeight:500}}>
                  Sem. passée {(()=>{const{mon,fri}=getWeekBounds(lastWkKey);const sameM=mon.getMonth()===fri.getMonth();return sameM?`${mon.getDate()}–${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"short"})}`:`${mon.getDate()} ${mon.toLocaleString("fr-FR",{month:"short"})}–${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"short"})}`;})()}
                </div>
                <SmileysOrdered done={teamLastWkFiltered} absent={absentLastWk} size={22}/>
              </div>
              <div>
                <div style={{fontSize:9,color:"#9e9890",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em",fontWeight:500}}>
                  Sem. en cours {(()=>{const{mon,fri}=getWeekBounds(curWkKey);const sameM=mon.getMonth()===fri.getMonth();return sameM?`${mon.getDate()}–${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"short"})}`:`${mon.getDate()} ${mon.toLocaleString("fr-FR",{month:"short"})}–${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"short"})}`;})()}
                </div>
                <SmileysOrdered done={teamCurWkFiltered} absent={absentCurWk} size={22} hideMood={!curWkVisible}/>
              </div>
            </div>
            {/* Right: mood curve - tall */}
            <div style={{flex:"0 0 340px",alignSelf:"stretch",overflow:"hidden"}}>
              <UpdateStreakWithCurve myUpdates={myUpdates} allUpdates={allUpdates} clickable={false} showDots={false} nWeeks={26} curveHeight={192}/>
            </div>
            {/* Old ratio removed - now in left panel */}

          </div>
          {/* Personal Updates banner - 320px */}
          <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:10,padding:"14px 20px",
            display:"flex",alignItems:"stretch",gap:12,flexDirection:"column",justifyContent:"space-between",
            boxShadow:"0 1px 3px rgba(0,0,0,.04)",height:220,boxSizing:"border-box",overflow:"hidden"}}>
            {/* Perso: vertical layout for 320px height */}
            {/* Top: mood + name */}
            <div style={{display:"flex",alignItems:"center",gap:12,paddingBottom:12,borderBottom:"1px solid #86efac"}}>
              <div style={{fontSize:60,lineHeight:1}}>{myMoodDisplay||"🫥"}</div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:"#1a1814"}}>{myPrenom}</div>
                <div style={{fontSize:9,color:"#6b6560",textTransform:"uppercase",letterSpacing:".05em"}}>Semaine passée</div>
              </div>
              <div style={{marginLeft:"auto",textAlign:"right"}}>
                <div style={{fontSize:24,fontWeight:700,color:myCompletionRate>=80?"#2d6a4f":myCompletionRate>=50?"#b5680f":"#c0392b"}}>{myCompletionRate}%</div>
                <div style={{fontSize:9,color:"#6b6560"}}>complétion 13 sem.</div>
              </div>
            </div>
            {/* Middle: 13 smileys */}
            <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:6}}>
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                <div style={{fontSize:9,color:"#6b6560",textTransform:"uppercase",letterSpacing:".05em",fontWeight:500,lineHeight:1,paddingBottom:2}}>Mes 13 dernières semaines</div>
                <My13Smileys/>
              </div>
            </div>
            {/* Bottom: button */}
            <div style={{paddingTop:12,borderTop:"1px solid #86efac"}}>
              <button onClick={onGoUpdate}
                style={{width:"100%",padding:"8px 14px",background:"#2d6a4f",color:"#fff",border:"none",
                  borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:500,
                  transition:"opacity .15s",textAlign:"center"}}
                onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                ✍️ Aller aux updates et compléter
              </button>
              {todayUpdate&&<div style={{fontSize:10,color:"#166534",textAlign:"center",marginTop:4}}>✓ Update complété cette semaine</div>}
            </div>
          </div>
          </div>{/* end updates 2/3+1/3 grid */}
        </>;
      })()}

      {/* ── SECTION REPORTING ── pleine largeur */}
      {(()=>{
        const reportingData=window._reportingCache||null;
        // Load from Firebase if not cached
        return <ReportingBanner onGoReporting={onGoReporting}/>;
      })()}



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

function UpdateViewModal({notif,onClose,onRead,teamMembers=[]}){
  const u=notif.updateData||notif;
  const weekLabel=notif.weekKey?fmtWeekLabel(notif.weekKey):"";
  const answers=u.answers||u.updateData?.answers||{};
  const moodVal=answers.q7||"";
  // Show questions in DEFAULT_QUESTIONS order, skip q7 (shown in title)
  // q6 visible only if own update or viewer is the manager
  const isOwn=notif.isOwn!==false;
  const viewerEmail=notif.teamMember?.email;
  const authorEmail=notif.authorEmail||notif.fromEmail||notif.email;
  // viewer is manager if the author's manager field = viewerEmail
  const isManager=!!(viewerEmail&&authorEmail&&teamMembers&&
    teamMembers.find(m=>m.email===authorEmail&&m.managerEmail===viewerEmail));
  const canSeeQ6=isOwn||isManager;
  const visibleQs=DEFAULT_QUESTIONS.filter(q=>q.id!=="q7"&&answers[q.id]&&(q.id!=="q6"||canSeeQ6));
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
const MOODS=["😩","😕","😐","🙂","😊"];
const PRESENCES=["Au boulot au moins deux jours","En congés","À l'école"];

function TeamUpdatesSection({allUpdates, teamMembers=[], teamMember, onSelectWeek}) {
  const WEEKS = 13;
  const now = new Date();

  // Build 13-week keys
  const weekKeys = Array.from({length:WEEKS},(_,i)=>{
    const d=new Date(now); d.setDate(now.getDate()-(WEEKS-1-i)*7);
    return getWeekKey(d);
  });

  // Sort teammates: self first, then direct reports, then others
  const myEmail = teamMember?.email;
  const teammates = teamMembers.filter(m=>m.role!=="inactive"&&m.email&&m.email!==myEmail);
  const myReports = teammates.filter(m=>m.managerEmail===myEmail);
  const others = teammates.filter(m=>m.managerEmail!==myEmail);
  const ordered = [...myReports, ...others];

  // Build update lookup: email+weekKey → update
  const lookup = {};
  allUpdates.forEach(u=>{ lookup[`${u.email}_${u.weekKey}`]=u; });

  function getDotColor(update, weekKey) {
    if (!update) return '#e2ddd6'; // grey = not done
    const sub = new Date(update.submittedAt);
    const {fri} = getWeekBounds(weekKey);
    const fridayEvening = new Date(fri); fridayEvening.setHours(15,0,0,0);
    if (sub <= fridayEvening) return '#2d6a4f'; // green = on time
    return '#f59e0b'; // orange = late (submitted after friday 15h)
  }

  return (
    <div style={{marginTop:16,background:"#fff",border:"1px solid #e2ddd6",borderRadius:10,padding:"16px 20px"}}>
      <div style={{fontSize:12,fontWeight:600,color:"#6b6560",textTransform:"uppercase",letterSpacing:".05em",marginBottom:14}}>
        Updates de l'équipe — 13 dernières semaines
      </div>
      {/* Header: week labels */}
      <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:8}}>
        <div style={{width:120,flexShrink:0}}/>
        {weekKeys.map((wk,i)=>{
          const {mon}=getWeekBounds(wk);
          const isLast=i===WEEKS-1;
          return <div key={wk} style={{flex:1,textAlign:"center",fontSize:isLast?9:8,
            color:isLast?"#2d6a4f":"#c5c0b8",fontWeight:isLast?600:400}}>
            {mon.getDate()}/{mon.getMonth()+1}
          </div>;
        })}
      </div>
      {/* Each teammate row */}
      {ordered.map((m,rowIdx)=>{
        const isReport=m.managerEmail===myEmail;
        return (
          <div key={m.email} style={{display:"flex",alignItems:"center",gap:0,
            padding:"5px 0",borderTop:rowIdx===myReports.length&&rowIdx>0?"2px dashed #e2ddd6":
            rowIdx>0?"1px solid #f5f3ef":"none"}}>
            {/* Name */}
            <div style={{width:120,flexShrink:0,display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:11,fontWeight:isReport?600:400,color:isReport?"#1a1814":"#6b6560",
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.prenom}</span>
              {isReport&&<span style={{fontSize:9,color:"#9e9890"}}>↳</span>}
            </div>
            {/* Dots */}
            {weekKeys.map((wk,i)=>{
              const update=lookup[`${m.email}_${wk}`];
              const col=getDotColor(update,wk);
              const isLast=i===WEEKS-1;
              return <div key={wk} style={{flex:1,display:"flex",justifyContent:"center",alignItems:"center"}}>
                <div onClick={update?()=>onSelectWeek(wk,update,m.prenom,false):undefined}
                  style={{width:isLast?14:10,height:isLast?14:10,borderRadius:"50%",
                    background:col,cursor:update?"pointer":"default",
                    boxShadow:isLast?"0 0 0 2px #fff, 0 0 0 3px "+col:"none",
                    transition:"transform .1s"}}
                  onMouseEnter={e=>{if(update)e.currentTarget.style.transform="scale(1.3)";}}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                  title={update?`${m.prenom} — ${fmtWeekLabel(wk)}`:`Pas d'update`}
                />
              </div>;
            })}
          </div>
        );
      })}
      {/* Legend */}
      <div style={{display:"flex",gap:16,marginTop:12,fontSize:11,color:"#9e9890"}}>
        <span><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#2d6a4f",marginRight:4}}/> Dans les temps</span>
        <span><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#f59e0b",marginRight:4}}/> En retard</span>
        <span><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#e2ddd6",marginRight:4}}/> Non complété</span>
      </div>
    </div>
  );
}

function UpdatePage({teamMember,questions,onSubmit,onDelete,onBack,myUpdates,allUpdates=[],teamMembers=[]}){
  const _rawWeekKey=getUpdateWeekKey();
  // On Tuesday weekKey is null - use last week for display purposes (read-only)
  const weekKey=_rawWeekKey||(()=>{const d=new Date();d.setDate(d.getDate()-8);return getWeekKey(d);})();
  const isTuesdayReadOnly=!_rawWeekKey;
  const existing=weekKey?myUpdates.find(u=>u.weekKey===weekKey):null;
  const [answers,setAnswers]=useState(existing?.answers||{});
  const [showTeam,setShowTeam]=useState(false);
  // Show as submitted only if existing update exists (regardless of lock)
  // User can still submit even after 15h if they haven't submitted yet
  const [submitted,setSubmitted]=useState(!!existing);
  const [viewUpdate,setViewUpdate]=useState(null);
  const [selectedWeek,setSelectedWeek]=useState(null);



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
    {isTuesdayReadOnly&&<div style={{background:"#fef3c7",borderBottom:"1px solid #f59e0b",padding:"8px 20px",fontSize:12,color:"#92400e",textAlign:"center"}}>
      📅 Mardi : pas de saisie d'update aujourd'hui — consultation uniquement.
    </div>}
    <div style={{maxWidth:1000,margin:"0 auto",padding:"24px 16px 60px"}}>

      {/* 26-week dots - integrated team view */}
      <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2ddd6",padding:"16px 20px",marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
        {/* Header row: title + button */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:600,color:"#6b6560",textTransform:"uppercase",letterSpacing:".05em"}}>Mes updates ces 6 derniers mois</div>
          <button onClick={()=>setShowTeam(p=>!p)}
            style={{fontSize:11,fontWeight:500,padding:"4px 12px",borderRadius:7,cursor:"pointer",
              background:showTeam?"#2d6a4f":"#fff",color:showTeam?"#fff":"#6b6560",
              border:`1px solid ${showTeam?"#2d6a4f":"#e2ddd6"}`,transition:"all .15s",
              display:"flex",alignItems:"center",gap:5}}>
            {showTeam?"✕ Masquer":"👥 Voir l'équipe"}
          </button>
        </div>
        {/* My dots row */}
        <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:1}}>
          <div style={{width:90,flexShrink:0,fontSize:11,fontWeight:600,color:"#1a1814",paddingRight:8}}>
            {teamMember?.prenom||"Moi"}
          </div>
          {(()=>{const now=new Date();const dow=now.getDay();const hide=!(dow===6||dow===0||dow===1||(dow===5&&now.getHours()>=15));return <WeekDots myUpdates={myUpdates} clickable={true} onClickUpdate={w=>setSelectedWeek(w)} dotSize={14} gap={0} email={teamMember?.email} hideCurrentWeek={hide}/>;})()}
        </div>
        {/* Team rows */}
        {showTeam&&<>
          {(()=>{
            const myEmail=teamMember?.email;
            const active=teamMembers.filter(m=>m.role!=="inactive"&&m.email&&m.email!==myEmail);
            const reports=active.filter(m=>m.managerEmail===myEmail);
            const others=active.filter(m=>m.managerEmail!==myEmail);
            const ordered=[...reports,...others];
            const now2=new Date();const dow2=now2.getDay();const hideCur=!(dow2===6||dow2===0||dow2===1||(dow2===5&&now2.getHours()>=15));
            const allWeeks=get26Weeks([]);const weeks=hideCur?allWeeks.slice(0,-1):allWeeks;
            const lookup={};
            allUpdates.forEach(u=>{lookup[`${u.email}_${u.weekKey}`]=u;});
            return ordered.map((m,rowIdx)=>{
              const isReport=m.managerEmail===myEmail;
               return <div key={m.email} style={{display:"flex",alignItems:"center",gap:0,
                 marginTop:1,padding:"0"}}>
                 <div style={{width:90,flexShrink:0,paddingRight:8,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                   {isReport
                     ?<span style={{display:"inline-block",background:"#2d6a4f",color:"#fff",
                         fontSize:11,fontWeight:600,borderRadius:20,padding:"2px 9px",
                         whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:86}}>{m.prenom}</span>
                     :<span style={{fontSize:11,color:"#6b6560"}}>{m.prenom}</span>}
                 </div>
                <div style={{display:"flex",gap:0,flexWrap:"nowrap",alignItems:"center"}}>
                  {weeks.map((w,wi)=>{
                    const update=lookup[`${m.email}_${w.wk}`];
                    const declaredAbsW=(window._absences||[]).find(a=>
                      a.email===m.email&&toDateStr(w.mon)>=a.dateFrom&&toDateStr(w.mon)<=a.dateTo
                    );
                     let emoji=null;
                     // Read q8 from WN-2 to detect WN-1 absence
                     const prevWkDate_=new Date(w.mon);prevWkDate_.setDate(w.mon.getDate()-7);
                     const prevWk2_=getWeekKey(prevWkDate_);
                     const prevU2_=allUpdates.find(u=>u.email===m.email&&u.weekKey===prevWk2_);
                     const q8_=prevU2_?.answers?.q8||'';
                     if(declaredAbsW){emoji=declaredAbsW.type;}
                     else if(q8_.includes('école')||q8_.includes('École')){emoji='🎓';}
                     else if(q8_.includes('congés')){const mo=w.mon.getMonth()+1;emoji=((mo>=12&&w.mon.getDate()>=15)||mo<=4)?'🎿':'🌴';}
                     else if(update){emoji=(hideCur&&wi===weeks.length-1)?'🫥':(update.answers?.q7||'😐');}
                     else{emoji='🫥';}
                    return <div key={wi} onClick={update?()=>setSelectedWeek({wk:w.wk,update,prenom:m.prenom,isOwn:false,authorEmail:m.email}):undefined}
                      style={{width:31,height:31,flexShrink:0,display:"flex",alignItems:"center",
                        justifyContent:"center",cursor:update?"pointer":"default",fontSize:22,lineHeight:1,
                        opacity:(!update&&emoji==='🫥')?0.35:1}}>
                      {emoji}
                    </div>;
                  })}
                </div>
              </div>;
            });
          })()}
        </>}

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
    {selectedWeek&&<UpdateViewModal notif={{updateData:selectedWeek.update,fromPrenom:selectedWeek.prenom||teamMember?.prenom,weekKey:selectedWeek.wk,isOwn:selectedWeek.isOwn,teamMember:teamMember,authorEmail:selectedWeek.authorEmail}} onClose={()=>setSelectedWeek(null)} onRead={()=>setSelectedWeek(null)} teamMembers={teamMembers}/>}

  {/* Team updates toggle */}

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

const DEFAULT_SUBCAT_LABELS = {
  "A1-31": "Subvention",
  "B1-09": "Charges de personnel",
  "B1-23": "Outils",
  "C1-15": "Frais de déplacement",
  "C1-18": "Honoraires",
  "F1-07": "Autres achats et charges externes",
  "F1-09": "Charges de personnel",
  "F1-10": "Commissions sur ventes",
  "F1-14": "Frais bancaires",
  "F1-15": "Frais de déplacement",
  "F1-18": "Honoraires",
  "F1-23": "Outils",
  "F1-31": "Subvention",
  "F1-36": "Formations",
  "G1-04": "Achats non stockés de matière et fournitures",
  "G1-06": "Assurance",
  "G1-09": "Charges de personnel",
  "G1-12": "Entretiens et réparations",
  "G1-17": "Frais postaux et de télécommunications",
  "G1-18": "Honoraires",
  "G1-20": "Impôts, taxes et versements assimilés",
  "G1-22": "Locations immobilières",
  "G1-23": "Outils",
  "G1-30": "Sous-traitance",
  "I1-11": "Dotation aux amortissements",
  "J1-18": "Honoraires",
  "L1-01": "Achat d'emballages",
  "L1-04": "Achats non stockés de matière et fournitures",
  "L1-09": "Charges de personnel",
  "L1-12": "Entretiens et réparations",
  "L1-15": "Frais de déplacement",
  "L1-23": "Outils",
  "L1-26": "Prestations de services",
  "L1-31": "Subvention",
  "M1-01": "Branding · Achat d'emballages",
  "M1-04": "Branding · Achats non stockés",
  "M1-15": "Branding · Frais de déplacement",
  "M1-21": "Branding · Impressions de supports",
  "M1-24": "Branding · PLV",
  "M1-26": "Branding · Prestations de services",
  "M1-AU": "Branding · Autre",
  "M2-04": "Collab · Achats non stockés",
  "M2-AU": "Collab · Autre",
  "M3-27": "Partenariat/Visibilité · Publicité",
  "M3-AU": "Partenariat/Visibilité · Autre",
  "M4-23": "Outils web · Outils",
  "M4-AU": "Outils web · Autre",
  "M6-05": "Impact · Adhésions et concours",
  "M6-26": "Impact · Prestations de services",
  "M6-AU": "Impact · Autre",
  "M7-05": "B2B · Adhésions et concours",
  "M7-26": "B2B · Prestations de services",
  "M7-29": "B2B · Salons",
  "M7-AU": "B2B · Autre",
  "M8-09": "Salaires et déplacements · Charges de personnel",
  "M8-15": "Salaires et déplacements · Frais de déplacement",
  "M8-31": "Salaires et déplacements · Subvention",
  "M8-AU": "Salaires et déplacements · Autre",
  "O1-09": "Charges de personnel",
  "O1-13": "Etudes et recherches",
  "O1-15": "Frais de déplacement",
  "O1-31": "Subvention",
  "R1-16": "Frais de recrutement",
  "R1-23": "Outils",
  "R1-36": "Formations",
  "S1-03": "Retail · Achats de vin en vrac",
  "S1-05": "Retail · Adhésions et concours",
  "S1-09": "Retail · Charges de personnel",
  "S1-10": "Retail · Commissions sur ventes",
  "S1-15": "Retail · Frais de déplacement",
  "S1-18": "Retail · Honoraires",
  "S1-26": "Retail · Prestations de services",
  "S1-30": "Retail · Sous-traitance",
  "S1-31": "Retail · Subvention",
  "S1-35": "Retail · Ventes de marchandises",
  "S1-36": "Retail · Formations",
  "S1-AU": "Retail · Autre",
  "S2-04": "CHR · Achats non stockés",
  "S2-05": "CHR · Adhésions et concours",
  "S2-07": "CHR · Autres achats et charges",
  "S2-09": "CHR · Charges de personnel",
  "S2-10": "CHR · Commissions sur ventes",
  "S2-15": "CHR · Frais de déplacement",
  "S2-18": "CHR · Honoraires",
  "S2-27": "CHR · Publicité",
  "S2-31": "CHR · Subvention",
  "S2-35": "CHR · Ventes de marchandises",
  "S2-36": "CHR · Formations",
  "S2-AU": "CHR · Autre",
  "S3-05": "Export · Adhésions et concours",
  "S3-09": "Export · Charges de personnel",
  "S3-10": "Export · Commissions sur ventes",
  "S3-15": "Export · Frais de déplacement",
  "S3-18": "Export · Honoraires",
  "S3-26": "Export · Prestations de services",
  "S3-31": "Export · Subvention",
  "S3-32": "Export · Transport",
  "S3-36": "Export · Formations",
  "S3-AU": "Export · Autre",
  "S4-18": "X canal · Honoraires",
  "S4-23": "X canal · Outils",
  "S4-26": "X canal · Prestations de services",
  "S4-27": "X canal · Publicité",
  "S4-30": "X canal · Sous-traitance",
  "S4-AU": "X canal · Autre",
  "S5-05": "E-commerce · Adhésions et concours",
  "S5-09": "E-commerce · Charges de personnel",
  "S5-10": "E-commerce · Commissions sur ventes",
  "S5-23": "E-commerce · Outils",
  "S5-27": "E-commerce · Publicité",
  "S5-AU": "E-commerce · Autre",
  "S6-05": "Grands Comptes · Adhésions et concours",
  "S6-09": "Grands Comptes · Charges de personnel",
  "S6-15": "Grands Comptes · Frais de déplacement",
  "S6-18": "Grands Comptes · Honoraires",
  "S6-21": "Grands Comptes · Impressions de supports",
  "S6-26": "Grands Comptes · Prestations de services",
  "S6-27": "Grands Comptes · Publicité",
  "S6-35": "Grands Comptes · Ventes de marchandises",
  "S6-AU": "Grands Comptes · Autre",
  "T1-06": "Assurance",
  "T1-07": "Autres achats et charges externes",
  "T1-14": "Frais bancaires",
  "T1-28": "Remboursement de prêt et OS",
  "Z1-34": "Vente de prestation de services",
  "Z1-35": "Ventes de marchandises",
  "Z2-01": "Achat d'emballages",
  "Z2-02": "Achats de matières premières",
  "Z2-03": "Achats de vin en vrac",
  "Z2-25": "Prestation d'embouteillage",
  "Z2-32": "Transport",
  "Z2-33": "Variation des stocks"
};

const REPORTING_CANALS = ['E-commerce B2C','CHR','Grands Comptes','Retail','Export','Autres B2B','Régénération'];
const CANAL_CSV_MAP = {'E-commerce B2C':'B2C','CHR':'CHR','Grands Comptes':'Grands Comptes','Retail':'Retail','Export':'Export','Autres B2B':'Autres B2B','Régénération':'Régénération'};
const CANAL_MARGIN = {
  'E-commerce B2C': 0.270,
  'CHR': 0.293,
  'Grands Comptes': 0.266,
  'Retail': 0.292,
  'Export': 0.231,
  'Autres B2B': 0.225,
  'Régénération': 1.0,
};
const DEFAULT_CANAL_MARGIN = 0.263;
const MONTHS_FR = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];

const DEFAULT_CODE_TO_CAT = {
  A1:'Autres produits et charges',B1:'Bar',C1:'Culture et bien-être',
  F1:'Comptabilité',G1:'Frais généraux',I1:'Immobilisations corporelles et incorporelles',
  J1:'Juridique',L1:'Logistique',M1:'Marketing',M2:'Marketing',M3:'Marketing',
  M4:'Marketing',M6:'Marketing',M7:'Marketing',M8:'Marketing',
  O1:'Programme Oé pour la régénération',R1:'Ressources humaines',
  S1:'Sales',S2:'Sales',S3:'Sales',S4:'Sales',S5:'Sales',S6:'Sales',
  T1:'Frais financiers',Z1:'Ventes',Z2:'COGS',
};
const CODE_TO_CATEGORY = DEFAULT_CODE_TO_CAT;

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

function fmtAmount(v, inKeur) {
  if (v === 0 || v === null || v === undefined) return '—';
  if (inKeur) return new Intl.NumberFormat('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1}).format(v/1000);
  return new Intl.NumberFormat('fr-FR',{minimumFractionDigits:0,maximumFractionDigits:0}).format(v);
}
function fmtDetail(v) {
  if (!v && v!==0) return '—';
  return new Intl.NumberFormat('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(v);
}
function fmtPct(v) {
  return new Intl.NumberFormat('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1}).format(v*100)+'%';
}

function ReportingRow({label, months, lastMonth, bold=false, highlight=false, isTotal=false,
  indent=0, onClick, isOpen, inKeur, children, dotActive, onToggleDot}) {
  const ytd = months.slice(0,lastMonth).reduce((a,b)=>a+b,0);
  const total = months.reduce((a,b)=>a+b,0);
  const col = total < 0 ? '#c0392b' : total > 0 ? '#166534' : '#9e9890';
  const bg = isTotal ? '#f0fdf4' : highlight ? '#f8f7f5' : 'transparent';
  const cell = {padding:'5px 4px',fontSize:11,textAlign:'right',fontFamily:'system-ui,sans-serif',fontVariantNumeric:'tabular-nums',width:44,minWidth:44,maxWidth:44,
    borderBottom:'1px solid #f0ede8',whiteSpace:'nowrap'};
  return <>
    <tr onClick={onClick} style={{cursor:onClick?'pointer':'default',background:bg,
      borderTop:isTotal?'2px solid #e2ddd6':'none'}}>
      <td style={{padding:`5px 6px 5px ${6+indent*12}px`,fontSize:11,fontWeight:bold?600:400,
        position:'sticky',left:0,background:bg||'#fff',zIndex:1,
        borderBottom:'1px solid #f0ede8',minWidth:220,maxWidth:220,width:220,
        overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:4}}>
          {onClick&&<span style={{fontSize:9,color:'#9e9890',flexShrink:0,
            transform:isOpen?'rotate(90deg)':'none',transition:'transform .15s',display:'inline-block'}}>▶</span>}
          <span>{label}</span>
        </div>
      </td>
      {months.map((v,i)=>{
        const isEmpty = i >= lastMonth;
        const c = v<0?'#c0392b':v>0?'#1a1814':'#c5c0b8';
        return <>
          {i===lastMonth&&<td key="ytd" style={{...cell,borderLeft:'2px solid #2d6a4f',borderRight:'2px solid #2d6a4f',
            color:ytd<0?'#c0392b':'#166534',fontWeight:600,background:'#f0fdf4'}}>
            {fmtAmount(ytd,inKeur)}
          </td>}
          <td key={i} style={{...cell,color:isEmpty?'#c5c0b8':c,
            background:isEmpty?'#fafafa':'transparent'}}>
            {isEmpty ? '—' : fmtAmount(v,inKeur)}
          </td>
        </>;
      })}
      {lastMonth===12&&<td key="ytd" style={{...cell,borderLeft:'2px solid #2d6a4f',
        color:ytd<0?'#c0392b':'#166534',fontWeight:600,background:'#f0fdf4'}}>
        {fmtAmount(ytd,inKeur)}
      </td>}
      <td style={{...cell,borderLeft:'1px solid #e2ddd6',fontWeight:bold?600:400,color:col}}>
        {fmtAmount(total,inKeur)}
      </td>
    </tr>
    {isOpen&&children}
  </>;
}

function DetailEcritures({rows, lastMonth, monthActive, isAU=false}) {
  // For AU buckets, sort by subcat code (stored in row.subcat if set), then month, then compte
  const sorted = [...rows].filter(r=>r.month<=lastMonth&&monthActive[r.month-1])
    .sort((a,b)=>{
      if(isAU){const sc=(a.subcat||'').localeCompare(b.subcat||'');if(sc!==0)return sc;}
      return a.month-b.month||a.compte.localeCompare(b.compte);
    });
  return <>
    {sorted.map((r,i)=>{
      const label=`${isAU&&r.subcat?r.subcat+' · ':''}${r.libLigne||'—'} · ${r.tiers||'—'} · ${r.facture||'—'} · ${r.compte} · ${r.libCompte}`;
      return <tr key={i} style={{background:'#fafaf8'}}>
      <td style={{padding:'3px 4px 3px 40px',fontSize:10,color:'#6b6560',
        position:'sticky',left:0,background:'#fafaf8',zIndex:1,
        borderBottom:'1px solid #f5f5f3',width:220,minWidth:220,maxWidth:220,
        overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
        cursor:'default'}}
        onMouseEnter={e=>{
          const el=document.createElement('div');
          el.id='rtip';
          el.style.cssText='position:fixed;background:#1a1814;color:#fff;font-size:11px;padding:4px 10px;border-radius:5px;z-index:9999;pointer-events:none;max-width:600px;white-space:normal;line-height:1.4;box-shadow:0 2px 8px rgba(0,0,0,.3)';
          el.textContent=label;
          document.body.appendChild(el);
          const rect=e.currentTarget.getBoundingClientRect();
          el.style.left=Math.min(rect.left,window.innerWidth-620)+'px';
          el.style.top=(rect.top-el.offsetHeight-4)+'px';
        }}
        onMouseLeave={()=>{const el=document.getElementById('rtip');if(el)el.remove();}}>
        {label}
      </td>
      {Array(12).fill(0).map((_,i)=>{
        const isThisMonth = i===r.month-1;
        return <>
          {i===lastMonth&&<td key="ytd" style={{borderBottom:'1px solid #f5f5f3',borderLeft:'2px solid #2d6a4f',borderRight:'2px solid #2d6a4f',background:'#f0fdf4'}}/>}
          <td key={i} style={{padding:'3px 10px',fontSize:10,textAlign:'right',
            fontFamily:'system-ui,sans-serif',borderBottom:'1px solid #f5f5f3',
            color:r.amount<0?'#c0392b':'#1a1814',background:i>=lastMonth?'#fafafa':'transparent'}}>
            {isThisMonth && i<lastMonth ? fmtDetail(r.amount) : ''}
          </td>
        </>;
      })}
      {lastMonth===12&&<td style={{borderBottom:'1px solid #f5f5f3',borderLeft:'2px solid #2d6a4f',background:'#f0fdf4'}}/>}
      <td style={{borderBottom:'1px solid #f5f5f3',borderLeft:'1px solid #e2ddd6'}}/>
    </tr>;
    })}
  </>;
}

function SubcatsDnD({codeMap, setCodeMap, onSaveCodeMap, subcatLabels, knownSubcats=new Set(), customLabels={}, setCustomLabels, catTypes, onSaveCatTypes, activeSubcats={}, onToggleSubcat, chargeData={}, lastMonth=5}) {
  const [editingKey, setEditingKey] = useState(null);
  const [editVal, setEditVal] = useState('');

  // Group full subcategory codes (e.g. M1-04) by category code prefix (e.g. M1 -> Marketing)
  const byCategory = {};
  const uncat = [];
  // Collect all known subcats from DEFAULT_SUBCAT_LABELS + knownSubcats from data
  const allSubcatCodes = new Set([...Object.keys(DEFAULT_SUBCAT_LABELS), ...(knownSubcats||new Set())]);
  
  [...allSubcatCodes].sort().forEach(subcat => {
    const prefix = subcat.slice(0,2);
    const cat = codeMap[prefix];
    if (cat) { if (!byCategory[cat]) byCategory[cat] = []; byCategory[cat].push(subcat); }
    else uncat.push(subcat);
  });

  function saveLabel(key, val) {
    const n = {...customLabels, [key]: val};
    setCustomLabels(n);
    setEditingKey(null);
  }
  function resetLabel(key) {
    const n = {...customLabels};
    delete n[key];
    setCustomLabels(n);
  }

  const [collapsedCats, setCollapsedCats] = useState({});
  const toggleCat = cat => setCollapsedCats(p=>({...p,[cat]:!p[cat]}));

  return (
    <div>
      {uncat.filter((v,i,a)=>a.indexOf(v)===i).length > 0 && <div style={{background:'#fdecea',border:'1px solid #fca5a5',borderRadius:8,padding:'8px 14px',marginBottom:16,fontSize:12,color:'#c0392b'}}>
        ⚠️ Codes non affectés : <strong>{[...new Set(uncat.map(s=>s.slice(0,2)))].join(', ')}</strong>
      </div>}

      <div style={{ display: 'flex', flexDirection:'column', gap: 8 }}>
        {CATEGORIES_ORDER.map(cat => {
          const subcats = [...new Set(byCategory[cat]||[])].filter(s=>knownSubcats?.has(s));
          const isCollapsed = collapsedCats[cat];
          const typeLabel = catTypes[cat]==='charges_expl'?"Charges d'exploitation":catTypes[cat]==='autres_charges'?"Autres charges":catTypes[cat]==='cogs'?"COGS":"Ventes";
          // Compute monthly avg for display
          return <div key={cat} style={{borderRadius:10,border:'1px solid #e2ddd6',background:'#fafaf8',overflow:'hidden'}}>
            {/* Category header - clickable */}
            <div onClick={()=>toggleCat(cat)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 16px',cursor:'pointer',background:'#f5f3ef',userSelect:'none'}}
              onMouseEnter={e=>e.currentTarget.style.background='#ede9e3'}
              onMouseLeave={e=>e.currentTarget.style.background='#f5f3ef'}>
              <span style={{fontSize:12,transform:isCollapsed?'rotate(-90deg)':'rotate(0deg)',transition:'transform .2s',color:'#9e9890',display:'inline-block'}}>▾</span>
              <span style={{fontSize:13,fontWeight:600,color:'#1a1814',flex:1}}>{cat}</span>
              <span style={{fontSize:11,color:'#9e9890'}}>{subcats.length} sous-cat{subcats.length>1?'s':''}</span>
              <span style={{fontSize:11,color:'#6b6560',background:'#fff',border:'1px solid #e2ddd6',padding:'2px 10px',borderRadius:10}}>{typeLabel}</span>
            </div>
            {/* Subcategories grid - 3 columns */}
            {!isCollapsed&&<div style={{padding:'12px 16px'}}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridAutoFlow: 'column', gridTemplateRows: `repeat(${Math.ceil((subcats.filter(s=>knownSubcats?.has(s)).length)/3)}, auto)`, gap: 6 }}>
              {subcats.map(subcat => {
                const hasData = knownSubcats?.has(subcat);
                if (!hasData) return null; // Hide subcats with no transactions
                
                // Compute monthly average
                const subcatMonths = chargeData?.[subcat]?.months || {};
                const subcatTotal = Object.values(subcatMonths).reduce((a,b)=>a+b,0);
                const subcatCount = Object.keys(subcatMonths).filter(k=>parseInt(k.split('-')[1])<=lastMonth).length||1;
                const monthlyAvg = subcatTotal / subcatCount;
                
                const defaultLbl = DEFAULT_SUBCAT_LABELS[subcat];
                const currentLbl = subcatLabels[subcat] || (defaultLbl ? '' : '— À nommer —');
                const isCustom = !!customLabels[subcat];
                const isNew = !defaultLbl && hasData;
                const isActive = activeSubcats[subcat] !== false;
                
                return <div key={subcat} style={{
                  background:'#fff',borderRadius:6,border:'1px solid #e2ddd6',
                  padding:'5px 8px',
                  display:'flex',alignItems:'center',gap:6,
                  opacity:isActive?1:0.6,
                }}>
                  <span style={{fontSize:10,fontWeight:600,color:'#2d6a4f',fontFamily:'monospace',flexShrink:0,minWidth:40}}>{subcat}</span>
                  {editingKey===subcat
                    ?<input autoFocus value={editVal}
                        onChange={e=>setEditVal(e.target.value)}
                        onBlur={()=>saveLabel(subcat,editVal)}
                        onKeyDown={e=>{if(e.key==='Enter')saveLabel(subcat,editVal);if(e.key==='Escape')setEditingKey(null);}}
                        style={{flex:1,fontSize:10,border:'1px solid #2d6a4f',borderRadius:4,padding:'2px 4px',outline:'none'}}/>
                    :<span onClick={()=>{setEditingKey(subcat);setEditVal(currentLbl||defaultLbl||'');}}
                        style={{flex:1,fontSize:10,color:isNew?'#c0392b':'#6b6560',cursor:'pointer'}}
                        title="Cliquer pour modifier le libellé">
                        {currentLbl||defaultLbl||'— À nommer —'}
                      </span>}
                  {isCustom&&<span title="Libellé modifié — cliquer pour restaurer l'original" onClick={()=>resetLabel(subcat)}
                    style={{fontSize:9,color:'#f59e0b',cursor:'pointer',flexShrink:0}}>↩</span>}
                  {isNew&&<span style={{fontSize:9,color:'#c0392b',flexShrink:0}}>NEW</span>}
                  <span style={{fontSize:9,color:'#9e9890',flexShrink:0}}>
                    {new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0}).format(Math.abs(monthlyAvg)/1000)}k/m
                  </span>
                  {/* Active/inactive toggle dot */}
                  <span title={isActive?"Désactiver (sera regroupé dans XX-AU)":"Activer"}
                    onClick={()=>onToggleSubcat&&onToggleSubcat(subcat)}
                    style={{width:8,height:8,borderRadius:'50%',
                      background:isActive?'#2d6a4f':'#c5c0b8',flexShrink:0,cursor:'pointer',
                      border:`1px solid ${isActive?'#2d6a4f':'#e2ddd6'}`,display:'inline-block'}}/>
                </div>;
              })}
              {subcats.length===0&&<span style={{fontSize:11,color:'#c5c0b8',fontStyle:'italic'}}>Aucune sous-catégorie</span>}
              </div>
            </div>}
          </div>;
        })}
      </div>
    </div>
  );
}

function ReportingTab({onSaveCatTypes, savedCatTypes, savedCodeMap, onSaveCodeMap, savedCustomLabels={}, onSaveCustomLabels, readOnly=false}) {
  const [caData, setCaData] = useState(null);
  const [caRows, setCaRows] = useState({});
  const [expandedCanal,setExpandedCanal]=useState({});
  const [expandedTiers,setExpandedTiers]=useState({});
  const [chargeData, setChargeData] = useState(null);
  const [subcatLabels, setSubcatLabels] = useState({});
  const [importedAt, setImportedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [catTypes, setCatTypes] = useState(savedCatTypes || DEFAULT_CAT_TYPE);
  const [codeMap, setCodeMap] = useState(savedCodeMap || DEFAULT_CODE_TO_CAT);
  const [customLabels, setCustomLabels] = useState(savedCustomLabels||{});  // user-edited labels
  const [activeSubcats, setActiveSubcats] = useState({});  // false = inactive (merged into XX-AU)
  
  // Merge: customLabels override DEFAULT_SUBCAT_LABELS
  const effectiveLabels = useMemo(()=>({...DEFAULT_SUBCAT_LABELS, ...customLabels}),[customLabels]);
  
  // All known subcats from data
  const knownSubcats = useMemo(()=>{
    if(!chargeData) return new Set();
    return new Set(Object.keys(chargeData));
  },[chargeData]);
  const [activeTab, setActiveTab] = useState('report');
  const [expanded, setExpanded] = useState({});
  const [monthActive, setMonthActive] = useState(Array(12).fill(true));
  const [inKeur, setInKeur] = useState(true);

  useEffect(()=>{
    const u1=onSnapshot(doc(db,'reporting','ca'),(snap)=>{if(snap.exists()){setCaData(snap.data().caData);const cr=snap.data().caRows||{};console.log('caRows keys:',Object.keys(cr));setCaRows(cr);}});
    const u2=onSnapshot(doc(db,'reporting','charges'),(snap)=>{if(snap.exists())setChargeData(snap.data().chargeData);});
    const u3=onSnapshot(doc(db,'reporting','meta'),(snap)=>{
      if(snap.exists()){
        setSubcatLabels(snap.data().subcatLabels||{});
        setImportedAt(snap.data().importedAt);
        if(snap.data().activeSubcats) setActiveSubcats(snap.data().activeSubcats);
      }
      setLoading(false);
    });
    return()=>{u1();u2();u3();};
  },[]);
  
  async function saveActiveSubcats(a){
    await updateDoc(doc(db,'reporting','meta'),{activeSubcats:a}).catch(()=>{});
    setActiveSubcats(a);
  }

  // Detect last month with data
  const lastMonth = useMemo(()=>{
    if (!caData && !chargeData) return 5;
    const months = new Set();
    if (caData) Object.values(caData).forEach(cm=>Object.keys(cm).forEach(k=>{const m=parseInt(k.split('-')[1]);if(m)months.add(m);}));
    if (chargeData) Object.values(chargeData).forEach(d=>Object.keys(d.months||{}).forEach(k=>{const m=parseInt(k.split('-')[1]);if(m)months.add(m);}));
    return months.size ? Math.max(...months) : 5;
  },[caData,chargeData]);

  // Build month arrays (12 months + 1 YTD slot = 13 cols)
  function getMonthArray(dataByKey) {
    const arr = Array(12).fill(0);
    if (!dataByKey) return arr;
    Object.entries(dataByKey).forEach(([k,v])=>{const m=parseInt(k.split('-')[1])-1;if(m>=0&&m<12)arr[m]+=v;});
    return arr;
  }

  // CA
  const caByCanal = useMemo(()=>{
    const res={};
    REPORTING_CANALS.forEach(c=>{
      const csvKey=CANAL_CSV_MAP[c]||c;
      res[c]=getMonthArray(caData?.[csvKey]);
    });
    return res;
  },[caData]);
  const caTotal = useMemo(()=>Array(12).fill(0).map((_,i)=>REPORTING_CANALS.reduce((s,c)=>s+(caByCanal[c]?.[i]||0),0)),[caByCanal]);

  // Marge brute - use actual canal rates
  const mbByCanal = useMemo(()=>{
    const res={};
    REPORTING_CANALS.forEach(c=>{const rate=CANAL_MARGIN[c]??DEFAULT_CANAL_MARGIN;res[c]=(caByCanal[c]||[]).map(v=>v*rate);});
    return res;
  },[caByCanal]);
  // MB total = sum of (CA per canal * rate per canal)
  const mbTotal = useMemo(()=>Array(12).fill(0).map((_,i)=>REPORTING_CANALS.reduce((s,c)=>s+(mbByCanal[c]?.[i]||0),0)),[mbByCanal]);

  // Unassigned codes
  const unassigned = useMemo(()=>{
    if(!chargeData) return [];
    const ua=new Set();
    Object.keys(chargeData).forEach(subcat=>{
      const code=subcat.slice(0,2);
      const cat=codeMap[code];
      if(!cat||!catTypes[cat]) ua.add(code);
    });
    return [...ua];
  },[chargeData,codeMap,catTypes]);

  // Charge data by type > category > subcat
  const chargeByType = useMemo(()=>{
    if(!chargeData) return {};
    const res={};
    Object.entries(chargeData).forEach(([subcat,data])=>{
      const code=subcat.slice(0,2);
      const cat=codeMap[code]||'Non affecté';
      const type=catTypes[cat]||'charges_expl';
      if(!res[type]) res[type]={};
      if(!res[type][cat]) res[type][cat]={};
      
      // If subcat is inactive, merge into XX-AU bucket
      const isActive = activeSubcats[subcat] !== false; // default true
      const targetSubcat = isActive ? subcat : `${code}-AU`;
      
      if(!res[type][cat][targetSubcat]) res[type][cat][targetSubcat]={months:Array(12).fill(0),rows:[],isAU:!isActive};
      const months=getMonthArray(data.months);
      months.forEach((v,i)=>res[type][cat][targetSubcat].months[i]+=v);
      // Store rows with subcat code for AU buckets sorting
      const rowsWithSubcat=(data.rows||[]).map(r=>({...r,subcat:isActive?undefined:subcat}));
      res[type][cat][targetSubcat].rows=(res[type][cat][targetSubcat].rows||[]).concat(rowsWithSubcat);
    });
    return res;
  },[chargeData,codeMap,catTypes,activeSubcats]);

  function getGroupTotal(type) {
    const cats=chargeByType[type]||{};
    return Array(12).fill(0).map((_,i)=>Object.values(cats).reduce((s,subcats)=>s+Object.values(subcats).reduce((s2,d)=>s2+(d.months[i]||0),0),0));
  }

  const chargesExpl = useMemo(()=>getGroupTotal('charges_expl'),[chargeByType]);
  const autresCharges = useMemo(()=>getGroupTotal('autres_charges'),[chargeByType]);
  const ebitda = useMemo(()=>mbTotal.map((v,i)=>v+chargesExpl[i]),[mbTotal,chargesExpl]);
  const resultat = useMemo(()=>ebitda.map((v,i)=>v+autresCharges[i]),[ebitda,autresCharges]);

  const toggle = k => setExpanded(p=>({...p,[k]:!p[k]}));

  // 13 col header: 12 months + YTD slot inserted after lastMonth
  const headerCols = [...Array(12).keys()].map(i=>i).reduce((acc,i)=>{
    acc.push(i);
    if(i===lastMonth-1) acc.push('ytd');
    return acc;
  },[]);
  if(lastMonth===0) headerCols.unshift('ytd');

  function renderGroup(type, label) {
    const cats=chargeByType[type]||{};
    const groupMonths=getGroupTotal(type);
    const ordCats=CATEGORIES_ORDER.filter(c=>cats[c]&&catTypes[c]===type);
    return <ReportingRow key={type} label={label} months={groupMonths} lastMonth={lastMonth}
      bold bg='#f0fdf4' inKeur={inKeur} onClick={()=>toggle(type)} isOpen={expanded[type]}>
      {ordCats.map(cat=>{
        const catMonths=Array(12).fill(0).map((_,i)=>Object.values(cats[cat]||{}).reduce((s,d)=>s+(d.months[i]||0),0));
        const catKey=type+'-'+cat;
        return <ReportingRow key={cat} label={cat} months={catMonths} lastMonth={lastMonth}
          indent={1} inKeur={inKeur} onClick={()=>toggle(catKey)} isOpen={expanded[catKey]}>
          {Object.entries(cats[cat]||{}).sort(([a],[b])=>a.localeCompare(b)).map(([subcat,d])=>{
            const subcatKey=catKey+'-'+subcat;
            const label2=`${subcat} · ${effectiveLabels[subcat]||subcatLabels[subcat]||''}`;
            return <ReportingRow key={subcat} label={label2} months={d.months} lastMonth={lastMonth}
              indent={2} inKeur={inKeur} onClick={()=>toggle(subcatKey)} isOpen={expanded[subcatKey]}>
              <DetailEcritures rows={d.rows} lastMonth={lastMonth} monthActive={monthActive} isAU={d.isAU}/>
            </ReportingRow>;
          })}
        </ReportingRow>;
      })}
    </ReportingRow>;
  }

  return <div>
    {/* Tabs */}
    <div style={{display:'flex',gap:8,marginBottom:16}}>
      {(readOnly?[{k:'report',l:'📊 Tableau'}]:[{k:'report',l:'📊 Tableau'},{k:'subcats',l:'⚙️'}]).map(t=>
        <button key={t.k} onClick={()=>setActiveTab(t.k)} title={t.k==='subcats'?'Paramétrage':undefined}
          style={{padding:'5px 12px',borderRadius:6,border:`1px solid ${activeTab===t.k?'#2d6a4f':'#e2ddd6'}`,
            background:activeTab===t.k?'#2d6a4f':'#fff',color:activeTab===t.k?'#fff':'#6b6560',
            cursor:'pointer',fontSize:12,fontWeight:500}}>
          {t.l}
        </button>
      )}
    </div>



    {/* Subcats tab - drag and drop */}
    {activeTab==='subcats'&&<SubcatsDnD codeMap={codeMap} setCodeMap={setCodeMap} onSaveCodeMap={onSaveCodeMap} subcatLabels={effectiveLabels} knownSubcats={knownSubcats} customLabels={customLabels} setCustomLabels={(cl)=>{setCustomLabels(cl);onSaveCustomLabels&&onSaveCustomLabels(cl);}} catTypes={catTypes} onSaveCatTypes={onSaveCatTypes} activeSubcats={activeSubcats} onToggleSubcat={(k)=>{const n={...activeSubcats,[k]:activeSubcats[k]===false};saveActiveSubcats(n);}} chargeData={chargeData} lastMonth={lastMonth}/>}

    {/* Report tab */}
    {activeTab==='report'&&<>
      {/* Header bar */}
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12,flexWrap:'wrap'}}>
        {importedAt&&<span style={{fontSize:11,color:'#9e9890'}}>
          Données au {new Date(importedAt).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})} à {new Date(importedAt).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
        </span>}
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:11,color:'#9e9890'}}>Affichage :</span>
          <button onClick={()=>setInKeur(false)} style={{padding:'3px 10px',borderRadius:10,border:`1px solid ${!inKeur?'#2d6a4f':'#e2ddd6'}`,background:!inKeur?'#2d6a4f':'#fff',color:!inKeur?'#fff':'#6b6560',cursor:'pointer',fontSize:11}}>€</button>
          <button onClick={()=>setInKeur(true)} style={{padding:'3px 10px',borderRadius:10,border:`1px solid ${inKeur?'#2d6a4f':'#e2ddd6'}`,background:inKeur?'#2d6a4f':'#fff',color:inKeur?'#fff':'#6b6560',cursor:'pointer',fontSize:11}}>k€</button>
        </div>
      </div>

      {/* Unassigned alert */}
      {unassigned.length>0&&<div style={{background:'#fef3c7',border:'1px solid #fcd34d',borderRadius:8,padding:'8px 14px',marginBottom:12,fontSize:12,color:'#92400e'}}>
        ⚠️ Codes non affectés : <strong>{unassigned.join(', ')}</strong> — Allez dans l'onglet "Sous-catégories".
      </div>}

      {loading?<div style={{textAlign:'center',padding:40,color:'#9e9890',fontSize:13}}>
        Chargement des données…
      </div>:!caData&&!chargeData?<div style={{textAlign:'center',padding:40}}>
        <div style={{fontSize:32,marginBottom:8}}>📂</div>
        <div style={{fontSize:14,fontWeight:500,color:'#1a1814',marginBottom:8}}>Aucune donnée importée</div>
        <div style={{fontSize:12,color:'#9e9890'}}>Lancez <code style={{background:'#f5f3ef',padding:'2px 6px',borderRadius:4}}>node import_reporting.js</code> dans le dossier Calendula.</div>
      </div>:<div style={{overflowX:'auto',borderRadius:10,border:'1px solid #e2ddd6',boxShadow:'0 1px 3px rgba(0,0,0,.06)'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:900}}>
          <thead>
            <tr style={{background:'#f5f3ef'}}>
              <th style={{padding:'8px 6px',textAlign:'left',fontSize:11,fontWeight:600,color:'#6b6560',
                position:'sticky',left:0,background:'#f5f3ef',zIndex:2,
                width:220,minWidth:220,maxWidth:220,borderBottom:'1px solid #e2ddd6'}}>
                Ligne P&L
              </th>
              {MONTHS_FR.map((m,i)=><>
                {i===lastMonth&&<th key="ytd" style={{padding:'8px 8px',textAlign:'right',fontSize:11,fontWeight:700,
                  color:'#2d6a4f',borderLeft:'2px solid #2d6a4f',borderRight:'2px solid #2d6a4f',
                  background:'#f0fdf4',borderBottom:'1px solid #e2ddd6',whiteSpace:'nowrap',width:44}}>YTD</th>}
                <th key={i} style={{padding:'8px 8px',textAlign:'right',fontSize:11,fontWeight:600,
                  color:i<lastMonth?'#1a1814':'#c5c0b8',borderBottom:'1px solid #e2ddd6',
                  background:i<lastMonth?'transparent':'#fafafa',whiteSpace:'nowrap',width:44}}>
                  {m}
                  {i<lastMonth&&<span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',
                    background:monthActive[i]?'#2d6a4f':'#c5c0b8',marginLeft:6,cursor:'pointer',verticalAlign:'middle'}}
                    onClick={()=>setMonthActive(p=>p.map((v,j)=>j===i?!v:v))}/>}
                </th>
              </>)}
              {lastMonth===12&&<th key="ytd" style={{padding:'8px 8px',textAlign:'right',fontSize:11,fontWeight:700,
                color:'#2d6a4f',borderLeft:'2px solid #2d6a4f',background:'#f0fdf4',
                borderBottom:'1px solid #e2ddd6',whiteSpace:'nowrap',width:44}}>YTD</th>}
              <th style={{padding:'8px 8px',textAlign:'right',fontSize:11,fontWeight:600,
                color:'#6b6560',borderLeft:'1px solid #e2ddd6',borderBottom:'1px solid #e2ddd6',width:44}}>Total</th>
            </tr>
          </thead>
          <tbody>
            <ReportingRow label="Chiffre d'Affaires" months={caTotal} lastMonth={lastMonth} bold inKeur={inKeur} onClick={()=>toggle('ca')} isOpen={expanded['ca']}>
              {REPORTING_CANALS.map(c=>{
                const csvKey=CANAL_CSV_MAP[c]||c;
                const canalRowsData=caRows[csvKey]||[];
                const tierMap={};
                canalRowsData.forEach(r=>{
                  const t=r.tiers||'—';
                  if(!tierMap[t])tierMap[t]=0;
                  tierMap[t]+=r.amount;
                });
                const tiers=Object.entries(tierMap).sort((a,b)=>b[1]-a[1]);
                const fmtVal=v=>inKeur?((v/1000).toFixed(1)+'k'):(v.toLocaleString('fr-FR',{minimumFractionDigits:0,maximumFractionDigits:0})+'€');
                return <ReportingRow key={c} label={c} months={caByCanal[c]||Array(12).fill(0)} lastMonth={lastMonth} indent={1} inKeur={inKeur}
                  onClick={()=>setExpandedCanal(p=>({...p,[`ca_${c}`]:!p[`ca_${c}`]}))}
                  isOpen={expandedCanal[`ca_${c}`]}>
                  {tiers.length===0&&<tr><td colSpan={lastMonth+3} style={{padding:'4px 36px',fontSize:10,color:'#9e9890',fontStyle:'italic'}}>Aucune donnée — relancez l'import</td></tr>}
                  {tiers.map(([tName,tTotal])=>(
                    <tr key={tName} style={{background:'#f0fff8'}}>
                      <td style={{padding:'3px 8px 3px 40px',fontSize:10,position:'sticky',left:0,background:'#f0fff8',zIndex:1,borderBottom:'1px solid #e8f5ee',color:'#1a1814'}}>
                        {tName}
                      </td>
                      <td colSpan={lastMonth+3} style={{padding:'3px 8px',fontSize:10,textAlign:'right',color:'#2d6a4f',fontWeight:500,fontFamily:'monospace',borderBottom:'1px solid #e8f5ee'}}>
                        {fmtVal(tTotal)}
                      </td>
                    </tr>
                  ))}
                </ReportingRow>;
              })}
            </ReportingRow>
            <ReportingRow label="Marge Brute" months={mbTotal} lastMonth={lastMonth} bold inKeur={inKeur} highlight onClick={()=>toggle('mb')} isOpen={expanded['mb']}>
              {REPORTING_CANALS.map(c=>{
                const rate=CANAL_MARGIN[c]??DEFAULT_CANAL_MARGIN;
                return <tr key={c} style={{background:'#f8fffd'}}>
                  <td style={{padding:'5px 8px 5px 22px',fontSize:11,fontWeight:400,
                    position:'sticky',left:0,background:'#f8fffd',zIndex:1,
                    borderBottom:'1px solid #f0ede8',minWidth:280}}>
                    <span style={{color:'#9e9890',marginRight:4}}>▸</span>{c}
                  </td>
                  {Array(12).fill(0).map((_,i)=>{
                    const isEmpty=i>=lastMonth;
                    return <React.Fragment key={i}>
                      {i===lastMonth&&<td style={{padding:'5px 8px',fontSize:11,textAlign:'right',
                        fontFamily:'system-ui,sans-serif',borderBottom:'1px solid #f0ede8',width:44,
                        borderLeft:'2px solid #2d6a4f',borderRight:'2px solid #2d6a4f',background:'#f0fdf4',
                        fontWeight:600,color:'#166534'}}>{fmtPct(rate)}</td>}
                      <td style={{padding:'5px 8px',fontSize:11,textAlign:'right',
                        fontFamily:'system-ui,sans-serif',borderBottom:'1px solid #f0ede8',width:44,
                        color:isEmpty?'#c5c0b8':'#166534',background:isEmpty?'#fafafa':'transparent'}}>
                        {isEmpty?'—':fmtPct(rate)}
                      </td>
                    </React.Fragment>;
                  })}
                  {lastMonth===12&&<td style={{padding:'5px 8px',fontSize:11,textAlign:'right',width:44,
                    borderLeft:'2px solid #2d6a4f',background:'#f0fdf4',borderBottom:'1px solid #f0ede8',
                    fontWeight:600,color:'#166534'}}>{fmtPct(rate)}</td>}
                  <td style={{padding:'5px 8px',fontSize:11,textAlign:'right',width:44,
                    borderLeft:'1px solid #e2ddd6',borderBottom:'1px solid #f0ede8',color:'#166534'}}>
                    {fmtPct(rate)}
                  </td>
                </tr>;
              })}
            </ReportingRow>
            <ReportingRow label="EBITDA" months={ebitda} lastMonth={lastMonth} bold isTotal inKeur={inKeur}/>
            {renderGroup('autres_charges',"Autres charges")}
            <ReportingRow label="Résultat net" months={resultat} lastMonth={lastMonth} bold isTotal inKeur={inKeur}/>
          </tbody>
        </table>
      </div>}
    </>}
  </div>;
}


function ReportingParamsTab({codeMap, onSaveCodeMap, customSubcatLabels={}, onSaveCustomSubcatLabels, catTypes, onSaveCatTypes}) {
  const [chargeData, setChargeData] = useState(null);
  const [activeSubcats, setActiveSubcats] = useState({});
  const [localCodeMap, setLocalCodeMap] = useState(codeMap || DEFAULT_CODE_TO_CAT);
  const [localCustomLabels, setLocalCustomLabels] = useState(customSubcatLabels || {});

  useEffect(()=>{
    const u1 = onSnapshot(doc(db,'reporting','charges'),(snap)=>{if(snap.exists())setChargeData(snap.data().chargeData);});
    const u2 = onSnapshot(doc(db,'reporting','meta'),(snap)=>{if(snap.exists()&&snap.data().activeSubcats)setActiveSubcats(snap.data().activeSubcats);});
    return()=>{u1();u2();};
  },[]);

  const knownSubcats = useMemo(()=>new Set(chargeData?Object.keys(chargeData):Object.keys(DEFAULT_SUBCAT_LABELS)),[chargeData]);
  const effectiveLabels = useMemo(()=>({...DEFAULT_SUBCAT_LABELS,...localCustomLabels}),[localCustomLabels]);

  async function saveActiveSubcats(a) {
    await updateDoc(doc(db,'reporting','meta'),{activeSubcats:a}).catch(()=>{});
    setActiveSubcats(a);
  }

  return <SubcatsDnD
    codeMap={localCodeMap}
    setCodeMap={cm=>{setLocalCodeMap(cm);onSaveCodeMap&&onSaveCodeMap(cm);}}
    onSaveCodeMap={onSaveCodeMap}
    subcatLabels={effectiveLabels}
    knownSubcats={knownSubcats}
    customLabels={localCustomLabels}
    setCustomLabels={cl=>{setLocalCustomLabels(cl);onSaveCustomSubcatLabels&&onSaveCustomSubcatLabels(cl);}}
    catTypes={catTypes}
    onSaveCatTypes={onSaveCatTypes}
    activeSubcats={activeSubcats}
    onToggleSubcat={k=>{const n={...activeSubcats,[k]:activeSubcats[k]===false};saveActiveSubcats(n);}}
    chargeData={chargeData}
    lastMonth={5}/>;
}

function FeedbackAdminTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const unsub = onSnapshot(collection(db,'feedback'),(snap)=>{
      setItems(snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>b.createdAt-a.createdAt));
      setLoading(false);
    });
    return()=>unsub();
  },[]);

  async function markRead(id) {
    await updateDoc(doc(db,'feedback',id),{read:true});
  }
  async function deleteItem(id) {
    if(!window.confirm('Supprimer ce feedback ?'))return;
    await deleteDoc(doc(db,'feedback',id));
  }

  const unread = items.filter(i=>!i.read).length;

  return <div>
    <div style={{fontSize:13,fontWeight:600,color:"#1a1814",marginBottom:14}}>
      Feedbacks & idées d'amélioration
      {unread>0&&<span style={{marginLeft:10,background:"#2d6a4f",color:"#fff",fontSize:11,
        borderRadius:10,padding:"2px 8px"}}>{unread} nouveau{unread>1?"x":""}</span>}
    </div>
    {loading?<div style={{color:"#9e9890",fontSize:13}}>Chargement…</div>
    :items.length===0?<div style={{color:"#9e9890",fontSize:13}}>Aucun feedback pour l'instant.</div>
    :<div style={{display:"flex",flexDirection:"column",gap:8}}>
      {items.map(item=><div key={item.id} style={{background:item.read?"#f8f7f5":"#fff",
        border:`1px solid ${item.read?"#e2ddd6":"#2d6a4f"}`,borderRadius:8,padding:"12px 16px",
        opacity:item.read?0.7:1}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <span style={{fontSize:12,fontWeight:600,color:"#1a1814"}}>{item.from}</span>
          <span style={{fontSize:11,color:"#9e9890"}}>{new Date(item.createdAt).toLocaleDateString("fr-FR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</span>
          <div style={{marginLeft:"auto",display:"flex",gap:6}}>
            {!item.read&&<button onClick={()=>markRead(item.id)}
              style={{fontSize:11,color:"#2d6a4f",background:"none",
                border:"1px solid #2d6a4f",borderRadius:4,padding:"2px 8px",cursor:"pointer"}}>
              ✓ Lu
            </button>}
            <button onClick={()=>deleteItem(item.id)}
              style={{fontSize:11,color:"#c0392b",background:"none",
                border:"1px solid #fca5a5",borderRadius:4,padding:"2px 8px",cursor:"pointer"}}>
              🗑️
            </button>
          </div>
        </div>
        <div style={{fontSize:13,color:"#1a1814",whiteSpace:"pre-wrap"}}>{item.message}</div>
      </div>)}
    </div>}
  </div>;
}

function AbsencesTab({teamMembers=[]}) {
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({email:'', type:'vacances', dateFrom:'', dateTo:''});

  // Derive vacation emoji from end date: 🌴 if Apr 15 – Nov 30, 🎿 otherwise
  function vacEmoji(dateTo) {
    if (!dateTo) return '🌴';
    const d = new Date(dateTo);
    const mo = d.getMonth() + 1, day = d.getDate();
    if ((mo > 4 || (mo === 4 && day >= 15)) && mo < 12) return '🌴';
    if (mo <= 4 || mo === 12) return '🎿';
    return '🌴';
  }

  function getEmoji() {
    if (form.type === 'vacances') return vacEmoji(form.dateTo);
    if (form.type === 'école') return '🎓';
    if (form.type === 'maternité') return '🤰';
    return '🌴';
  }

  const ABSENCE_LABELS = {vacances:'Congés / Vacances', école:'École / Formation', maternité:'Congé maternité'};

  useEffect(()=>{
    const unsub = onSnapshot(doc(db,'app_config','absences'),(snap)=>{
      if(snap.exists()) setAbsences(snap.data().list||[]);
      else setAbsences([]);
      setLoading(false);
    });
    return()=>unsub();
  },[]);

  async function saveAbsences(list) {
    await setDoc(doc(db,'app_config','absences'),{list});
    window._absences = list;
    setAbsences(list);
  }

  async function addAbsence() {
    if(!form.email||!form.dateFrom||!form.dateTo) return;
    const emoji = getEmoji();
    const entry = {id:Date.now().toString(), email:form.email, type:emoji, label:ABSENCE_LABELS[form.type], dateFrom:form.dateFrom, dateTo:form.dateTo};
    await saveAbsences([...absences, entry]);
    setForm({email:'', type:'vacances', dateFrom:'', dateTo:''});
  }

  async function removeAbsence(id) {
    await saveAbsences(absences.filter(a=>a.id!==id));
  }

  const activeMembers = teamMembers.filter(m=>m.role!=='inactive'&&m.email);
  const inp = {fontSize:11,border:'1px solid #e2ddd6',borderRadius:6,padding:'4px 8px',fontFamily:'inherit',outline:'none',background:'#fff',width:'100%',boxSizing:'border-box'};
  const sorted = [...absences].sort((a,b)=>b.dateTo.localeCompare(a.dateTo));
  const canAdd = form.email && form.dateFrom && form.dateTo;

  return <div>
    {/* New absence form at top */}
    <div style={{background:'#f8f7f5',borderRadius:8,border:'1px solid #e2ddd6',padding:'14px',marginBottom:16}}>
      <div style={{fontSize:11,fontWeight:600,color:'#6b6560',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:10}}>Nouvelle absence</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:8}}>
        <div style={{display:'flex',flexDirection:'column',gap:3}}>
          <label style={{fontSize:10,color:'#9e9890'}}>Teammate</label>
          <select value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} style={inp}>
            <option value="">— Choisir —</option>
            {activeMembers.map(m=><option key={m.email} value={m.email}>{m.prenom}</option>)}
          </select>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:3}}>
          <label style={{fontSize:10,color:'#9e9890'}}>Type</label>
          <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={inp}>
            <option value="vacances">🌴/🎿 Congés / Vacances</option>
            <option value="école">🎓 École / Formation</option>
            <option value="maternité">🤰 Congé maternité</option>
          </select>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:3}}>
          <label style={{fontSize:10,color:'#9e9890'}}>Du</label>
          <input type="date" value={form.dateFrom} onChange={e=>setForm(p=>({...p,dateFrom:e.target.value}))} style={inp}/>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:3}}>
          <label style={{fontSize:10,color:'#9e9890'}}>Au</label>
          <input type="date" value={form.dateTo} onChange={e=>setForm(p=>({...p,dateTo:e.target.value}))} style={inp}/>
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        {form.dateTo&&form.type==='vacances'&&<span style={{fontSize:18}}>{vacEmoji(form.dateTo)}</span>}
        <button onClick={addAbsence} disabled={!canAdd}
          style={{flex:1,padding:'7px',background:canAdd?'#2d6a4f':'#e2ddd6',color:canAdd?'#fff':'#9e9890',
            border:'none',borderRadius:6,cursor:canAdd?'pointer':'not-allowed',fontSize:12,fontWeight:500}}>
          ✓ Valider
        </button>
      </div>
    </div>

    {/* List sorted by dateTo desc */}
    {loading?<div style={{color:'#9e9890',fontSize:12}}>Chargement…</div>
    :sorted.length===0?<div style={{color:'#c5c0b8',fontSize:12,fontStyle:'italic'}}>Aucune absence déclarée.</div>
    :<div style={{display:'flex',flexDirection:'column',gap:5}}>
      {sorted.map(a=>{
        const mem=activeMembers.find(x=>x.email===a.email);
        const dFrom=new Date(a.dateFrom).toLocaleDateString('fr-FR',{day:'numeric',month:'short'});
        const dTo=new Date(a.dateTo).toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'});
        return <div key={a.id} style={{display:'flex',alignItems:'center',gap:8,
          background:'#fff',border:'1px solid #e2ddd6',borderRadius:7,padding:'8px 12px'}}>
          <span style={{fontSize:18,flexShrink:0}}>{a.type}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600,color:'#1a1814'}}>{mem?.prenom||a.email}</div>
            <div style={{fontSize:10,color:'#9e9890'}}>{a.label||''} · {dFrom} → {dTo}</div>
          </div>
          <button onClick={()=>removeAbsence(a.id)}
            style={{fontSize:10,color:'#c0392b',background:'none',border:'1px solid #fca5a5',
              borderRadius:5,padding:'2px 8px',cursor:'pointer',flexShrink:0}}>🗑️</button>
        </div>;
      })}
    </div>}
  </div>;
}

function SettingsPage({onBack,currentUser,teamMembers,onSaveMembers,questions,onSaveQuestions,catTypes,onSaveCatTypes,codeMap,onSaveCodeMap,customSubcatLabels,onSaveCustomSubcatLabels}){
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
  function toggleForce(email,field){
    const updated=members.map(m=>m.email===email?{...m,[field]:!m[field]}:m);
    setMembers(updated);
    onSaveMembers&&onSaveMembers(updated);
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
    <div style={{maxWidth:1100,margin:"0 auto",padding:"16px 16px 60px"}}>
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        {([{k:"members",l:"👥 Membres & rôles"},...(currentUser?.email===OWNER_EMAIL?[{k:"questions",l:"❓ Questions Update"},{k:"history",l:"📋 Historique Updates"},{k:"feedback",l:"💡 Feedback"},{k:"reporting_params",l:"⚙️ Reporting"}]:[])]).map(t=><button key={t.k} onClick={()=>setTab(t.k)}
          style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${tab===t.k?"#2d6a4f":"#e2ddd6"}`,background:tab===t.k?"#2d6a4f":"#fff",color:tab===t.k?"#fff":"#6b6560",cursor:"pointer",fontSize:13,fontWeight:500}}>
          {t.l}
        </button>)}
      </div>

      {tab==="members"&&<div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:16,alignItems:"start"}}>
        <div>{/* LEFT COL */}
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
                  {m.email!==OWNER_EMAIL&&<button onClick={()=>removeMember(m.email)} style={{fontSize:14,color:"#c0392b",background:"none",border:"none",cursor:"pointer",fontWeight:700,lineHeight:1,padding:"0 4px"}}>×</button>}
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>

        </div>{/* end left col */}

        {/* RIGHT COL: Absences */}
        <div>
          <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2ddd6",padding:"16px 20px"}}>
            <div style={{fontSize:12,fontWeight:600,color:"#6b6560",textTransform:"uppercase",letterSpacing:".05em",marginBottom:14}}>🌴 Absences déclarées</div>
            <AbsencesTab teamMembers={members}/>
          </div>
        </div>
      </div>}

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
      {tab==="feedback"&&<FeedbackAdminTab/>}
      {tab==="reporting_params"&&<ReportingParamsTab
          codeMap={codeMap} onSaveCodeMap={onSaveCodeMap}
          customSubcatLabels={customSubcatLabels} onSaveCustomSubcatLabels={onSaveCustomSubcatLabels}
          catTypes={catTypes} onSaveCatTypes={onSaveCatTypes}/>}


      {tab!=="history"&&tab!=="reporting"&&<><button onClick={save} style={{marginTop:20,padding:"12px 28px",background:"#2d6a4f",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:600}}>
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
function ReportingPagePublic({onBack, catTypes, codeMap, customSubcatLabels={}}) {
  return <div style={{minHeight:"100vh",background:"#f5f3ef",fontFamily:"system-ui,sans-serif"}}>
    <TopBar onBack={onBack} title="Reporting financier"/>
    <div style={{maxWidth:1100,margin:"0 auto",padding:"16px 16px 60px"}}>
      <ReportingTab onSaveCatTypes={null} savedCatTypes={catTypes} savedCodeMap={codeMap}
        onSaveCodeMap={null} savedCustomLabels={customSubcatLabels} onSaveCustomLabels={null} readOnly={true}/>
    </div>
  </div>;
}

export default function App(){
  const [authUser,setAuthUser]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [authError,setAuthError]=useState("");
  const [page,setPage]=useState("dashboard"); // dashboard | okr | update | settings
  const [teamMembers,setTeamMembers]=useState([]);
  const [questions,setQuestions]=useState(DEFAULT_QUESTIONS);
  const [catTypes,setCatTypes]=useState(DEFAULT_CAT_TYPE);
  const [codeMap,setCodeMap]=useState(CODE_TO_CATEGORY);
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

  // Load declared absences globally
  useEffect(()=>{
    const unsubAbs = onSnapshot(doc(db,'app_config','absences'),(snap)=>{
      window._absences = snap.exists() ? (snap.data().list||[]) : [];
    });
    return()=>unsubAbs();
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
        if(d.codeMap)setCodeMap(d.codeMap);
        if(d.customSubcatLabels)setCustomSubcatLabels(d.customSubcatLabels);
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
    const unsubOkr=onSnapshot(doc(db,"okr","data"),(snap)=>{if(snap.exists()&&snap.data().allSeasons){const d=snap.data();const curSk=(()=>{
  const n=new Date();
  // Find the season whose date range contains today
  const idx=SEASONS.findIndex(s=>n>=new Date(s.start)&&n<=new Date(s.end));
  if(idx<0)return "printemps_2026";
  const s=SEASONS[idx];
  const startDate=new Date(s.start);
  // Don't switch to new season until the 15th of its first month
  const switchDate=new Date(startDate.getFullYear(),startDate.getMonth(),15);
  if(n<switchDate&&idx>0){
    return SEASONS[idx-1].key; // use previous season
  }
  return s.key;
})();const s=d.allSeasons[curSk]||{};setOkrData({objectives:s.objectives||[],subobjectives:s.subobjectives||[],keyresults:s.keyresults||[],seasonKey:curSk});}});

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

    // Flush pending notifications when manager opens app on Mon, Fri>=15h, Sat, Sun
    const shouldFlush=(()=>{const now=new Date();const dow=now.getDay();return dow===1||dow===6||dow===0||(dow===5&&now.getHours()>=15);})();
    if(shouldFlush){
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
        // Immediate delivery: Mon, or Fri>=15h, Sat, Sun
        // Pending (flush at app open): Wed, Thu, Fri<15h
        pending:(()=>{
          const now=new Date();const dow=now.getDay();
          if(dow===1||dow===6||dow===0)return false; // Mon/Sat/Sun → immediate
          if(dow===5&&now.getHours()>=15)return false; // Fri>=15h → immediate
          return true; // Wed/Thu/Fri<15h → pending
        })(),
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
    await setDoc(doc(db,"app_config","main"),{teamMembers,questions,catTypes:ct,codeMap});
    setCatTypes(ct);
  }
  async function handleSaveCodeMap(cm){
    await setDoc(doc(db,"app_config","main"),{teamMembers,questions,catTypes,codeMap:cm,customSubcatLabels});
    setCodeMap(cm);
  }
  const [customSubcatLabels,setCustomSubcatLabels]=useState({});
  async function handleSaveCustomLabels(cl){
    await setDoc(doc(db,"app_config","main"),{teamMembers,questions,catTypes,codeMap,customSubcatLabels:cl});
    setCustomSubcatLabels(cl);
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
  if(page==="update")return <UpdatePage teamMember={currentTeamMember} questions={questions} onSubmit={handleUpdateSubmit} onDelete={handleDeleteUpdate} onBack={()=>setPage("dashboard")} myUpdates={myUpdates} allUpdates={allUpdates} teamMembers={teamMembers}/>;
  if(page==="reporting")return <ReportingPagePublic onBack={()=>setPage("dashboard")} catTypes={catTypes} codeMap={codeMap} customSubcatLabels={customSubcatLabels}/>;
  if(page==="reporting")return <ReportingPagePublic onBack={()=>setPage("dashboard")} catTypes={catTypes} codeMap={codeMap} customSubcatLabels={customSubcatLabels}/>;
  if(page==="settings"&&isAdmin)return <SettingsPage onBack={()=>setPage("dashboard")} currentUser={authUser} teamMembers={teamMembers} onSaveMembers={handleSaveMembers} questions={questions} onSaveQuestions={handleSaveQuestions} catTypes={catTypes} onSaveCatTypes={handleSaveCatTypes} codeMap={codeMap} onSaveCodeMap={handleSaveCodeMap} customSubcatLabels={customSubcatLabels} onSaveCustomSubcatLabels={handleSaveCustomLabels}/>;

  return <Dashboard
    currentUser={authUser}
    teamMember={currentTeamMember}
    teamMembers={teamMembers}
    onGoReporting={()=>setPage("reporting")}
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
