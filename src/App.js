import React, { useState, useEffect, useRef, useMemo } from "react";
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE = 'Calendula';
const EMAILJS_TEMPLATE = 'template_p9o0yz2';
const EMAILJS_KEY = 'fM4M-dqj2372G9wj5';

function sendNotifEmail(toEmail, toName, title) {
  if (!toEmail) return;
  emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
    to_email: toEmail,
    to_name: toName || toEmail,
    from_name: 'Calendula',
    message: title,
    reply_to: 'fx@oeforgood.com',
  }, EMAILJS_KEY).catch(e => console.warn('EmailJS error:', e));
}
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, collection, addDoc, getDocs, getDoc, query, where, updateDoc, deleteDoc } from "firebase/firestore";
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
function ini(name){const s=(name||'?');return INITIALS_MAP[name]||(s[0].toUpperCase()+(s[1]||'').toLowerCase())}
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
  return a.reduce((s,k)=>s+calcTaux(k.val_depart,k.val_actuel,k.val_cible,k.unite)*k.poids,0)/tw;
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
  // For %: normalize to same scale
  // If cible<=1 but actuel>1, actuel is in 0-100 scale → convert to 0-1
  let d=dep,a=act,c=cib;
  if(u==="%"&&c>0&&c<=1&&a>1){a=a/100;d=d/100;}
  // If cible>1 and actuel<=1, actuel is in 0-1 scale → convert to 0-100
  if(u==="%"&&c>1&&a<=1&&a>0){a=a*100;d=d*100;}
  const sp=c-d;if(!sp)return a>=c?100:0;
  return Math.max(0,Math.min(100,(a-d)/sp*100));
}
function fmtV(v,u){
  if(u==="oui/non")return v>=1?"ok":"0";
  if(u==="€")return v>=1000?(v/1000).toFixed(1)+"k€":v+"€";
  if(u==="%"){if(v<=1&&v>0)return Math.round(v*100)+"%";return Math.round(v)+"%";}
  return v%1===0?String(v):v.toFixed(1);
}
function toEditVal(v,u){if(u==="%"){if(v<=1&&v>0)return Math.round(v*100);return Math.round(v);}return v;}
function fromEditVal(v,u){const n=parseFloat(v)||0;if(u==="%"){return n/100;}return n;}
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
function Modal({title,children,onClose,onSave,onDelete,onDuplicate,saveLabel="Enregistrer",wide=false}){
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:"#fff",borderRadius:12,padding:24,width:"90%",maxWidth:wide?700:540,maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box"}}>
      <div style={{fontSize:16,fontWeight:600,marginBottom:18}}>{title}</div>
      {children}
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:20}}>
        {onDelete&&<button onClick={onDelete} style={{marginRight:"auto",fontSize:13,fontWeight:500,background:"#fdecea",color:"#c0392b",border:"1px solid #fca5a5",padding:"7px 14px",borderRadius:6,cursor:"pointer"}}>Supprimer</button>}
        {onDuplicate&&<button onClick={onDuplicate} style={{marginRight:"auto",fontSize:13,fontWeight:500,background:"#f0f4ff",color:"#2563eb",border:"1px solid #bfdbfe",padding:"7px 14px",borderRadius:6,cursor:"pointer"}}>⧉ Dupliquer</button>}
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
  const minV=2,maxV=5.2;
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
        return <text key={i} x={m.x} y={CURVE_TOP+CURVE_H-4} fontSize="9" fill="#b5b0a8" textAnchor="middle" fontWeight="500" dominantBaseline="auto" style={{pointerEvents:"none"}}>{short}</text>;
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

function NotifDetail({notif, teamMember, teamMembers=[], onSendMessage}) {
  const answers=notif?.answers||{};
  const moodVal=answers.q7||"";
  // q6 visible if viewer is author's manager
  const viewerEmail=teamMember?.email;
  const authorEmail=notif?.fromEmail||notif?.email;
  const isManager=!!(viewerEmail&&authorEmail&&
    teamMembers.find(m=>m.email===authorEmail&&m.managerEmail===viewerEmail));
  const allQs=notif?.weekQuestions||DEFAULT_QUESTIONS;
  const visibleQs=allQs.filter(q=>answers[q.id]&&(q.id!=='q6'||isManager));
  const [replyText,setReplyText]=useState('');
  const [replySent,setReplySent]=useState(false);
  async function sendReply(){
    if(!replyText.trim()||!onSendMessage)return;
    const managerPrenom=teamMember?.prenom||'Ton référent';
    const toEmail=authorEmail;
    const toPrenom=teamMembers.find(m=>m.email===toEmail)?.prenom||'';
    await onSendMessage(toEmail, toPrenom, `${managerPrenom} a répondu à ton update`, replyText.trim());
    sendNotifEmail(toEmail, toPrenom, `${managerPrenom} a répondu à ton update`);
    setReplySent(true);
    setTimeout(()=>{setReplyText('');setReplySent(false);},2000);
  }
  return <div>
    {moodVal&&<div style={{fontSize:28,marginBottom:8}}>{moodVal}</div>}
    {visibleQs.map(q=>{
      const val=answers[q.id];if(!val)return null;
      if(q.type==="mood")return null;
      if(q.type==="presence")return <div key={q.id} style={{marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:600,color:"#9e9890",marginBottom:3}}>{q.text.replace(" *","")}</div>
        <div style={{fontSize:13,background:"#f5f3ef",borderRadius:6,padding:"5px 10px"}}>{typeof val==="object"?(val?.krIds||[]).join(', '):val}</div>
      </div>;
      if(q.type==="okr"&&val?.krIds){
        const krIds=val.krIds||[];
        const seasonKRs=(window._okrSeasons&&val.seasonKey?window._okrSeasons[val.seasonKey]?.keyresults:null)||[];
        return <div key={q.id} style={{marginBottom:10,background:"#fff",borderRadius:6,border:"1px solid #e2ddd6",padding:"8px 10px"}}>
          <div style={{fontSize:11,fontWeight:600,color:"#9e9890",marginBottom:6}}>{q.text.replace(" *","")}</div>
          {krIds.map(id=>{
            const kr=seasonKRs.find(k=>k.id===id);
            const contribs=kr?.contributors||[];
            return <div key={id} style={{fontSize:12,color:"#1a1814",padding:"3px 0",display:"flex",alignItems:"center",gap:6}}>
              ✅ <span style={{fontFamily:"monospace",color:"#9e9890",fontSize:11}}>{id}</span>
              <span>{kr?.title||id}</span>
              {contribs.map(c=><span key={c} title={c} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:18,height:18,borderRadius:"50%",background:pBg(c),color:"#fff",fontSize:8,fontWeight:600}}>{ini(c)}</span>)}
            </div>;
          })}
        </div>;
      }
      if(q.type==="okr"&&val?.krIds){
        const krIds=val.krIds||[];
        const seasonKRs=(window._okrSeasons&&val.seasonKey?window._okrSeasons[val.seasonKey]?.keyresults:null)||[];
        return <div key={q.id} style={{background:"#fff",borderRadius:6,border:"1px solid #e2ddd6",padding:"8px 10px"}}>
          <div style={{fontSize:11,fontWeight:600,color:"#9e9890",marginBottom:4}}>{q.text.replace(" *","")}</div>
          {krIds.map(id=>{const kr=seasonKRs.find(k=>k.id===id);return <div key={id} style={{fontSize:12,color:"#1a1814",padding:"2px 0"}}>✅ <span style={{fontFamily:"monospace",color:"#9e9890",marginRight:4}}>{id}</span>{kr?.title||''}{(()=>{const avs=(kr?.contributors||[]).filter(c=>c!==kr?.owner);return avs.length>0?<span style={{display:"inline-flex",marginLeft:4,border:"2px solid #fff"}}>{avs.map((c,i)=><span key={c} title={c} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,borderRadius:"50%",background:pBg(c,teamMembers?.map?.(m=>m.prenom)),color:"#6b6560",fontSize:9,fontWeight:600,marginLeft:i===0?0:-6,border:"2px solid #fff"}}>{ini(c)}</span>)}</span>:null;})()}</div>;})}
        </div>;
      }
      return <div key={q.id} style={{marginBottom:10,background:q.confidentiel?"#fdf4ff":"transparent",padding:q.confidentiel?"6px 10px":"0",borderRadius:q.confidentiel?6:0}}>
        <div style={{fontSize:11,fontWeight:600,color:q.confidentiel?"#a21caf":"#9e9890",marginBottom:3}}>{q.confidentiel?"🔒 ":""}{q.text.replace(" *","")}</div>
        <div style={{fontSize:13,whiteSpace:"pre-wrap",color:"#1a1814"}}>{typeof val==="object"?(val?.krIds||[]).join(', '):val}</div>
      </div>;
    })}
    {isManager&&<div style={{marginTop:16,borderTop:"1px solid #e2ddd6",paddingTop:16}}>
      <div style={{fontSize:12,fontWeight:600,color:"#6b6560",marginBottom:8}}>💬 Répondre à l'update</div>
      <textarea value={replyText} onChange={e=>setReplyText(e.target.value)}
        rows={3} style={{width:"100%",border:"1px solid #e2ddd6",borderRadius:6,padding:"8px 10px",fontSize:13,boxSizing:"border-box",resize:"vertical",fontFamily:"inherit"}}
        placeholder="Écris ta réponse…"/>
      <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
        <button onClick={sendReply} disabled={!replyText.trim()||replySent}
          style={{fontSize:13,fontWeight:500,background:"#2d6a4f",color:"#fff",padding:"7px 18px",borderRadius:6,cursor:"pointer",border:"none",opacity:!replyText.trim()||replySent?0.6:1}}>
          {replySent?"✓ Envoyé !":"Envoyer"}
        </button>
      </div>
    </div>}
  </div>;
}

function MessagesPanel({managerNotifs,teammateNotifs=[],onReadNotif,teamMember,teamMembers=[],myUpdates=[],allUpdates=[],onSendMessage}){
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
      const updateData=allUpdates.find(u=>u.email===n.fromEmail&&u.weekKey===n.weekKey);
      return{id:n.id,title:`Nouvel Update de ${n.fromPrenom}`,content:null,notif:{...n,answers:n.answers||updateData?.answers||{},fromEmail:n.fromEmail||updateData?.email},date:msgDate,read:n.read,isSystem:false,fromPrenom:n.fromPrenom,weekLabel:(mon.getMonth()===fri.getMonth()?`lundi ${mon.getDate()} au vendredi ${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"long"})}`:`lundi ${mon.getDate()} ${mon.toLocaleString("fr-FR",{month:"long"})} au vendredi ${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"long"})}`)};
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
      <div style={{background:"#fff",borderRadius:12,padding:24,width:"95%",maxWidth:900,maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4,flexWrap:"wrap"}}>
          <span style={{fontSize:15,fontWeight:600}}>{selected.title}</span>
          {!selected.isSystem&&selected.notif&&<span style={{fontSize:11,color:"#c0392b",marginLeft:"auto",textAlign:"right"}}>{selected.notif.fromPrenom} a été informé(e) que tu as vu son Update.</span>}
        </div>
        <div style={{fontSize:11,color:"#9e9890",marginBottom:4}}>{selected.date.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})} à {selected.date.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</div>
        {!selected.isSystem&&selected.notif?.weekKey&&<div style={{fontSize:11,color:"#9e9890",marginBottom:18}}>Semaine du {fmtWeekLabel(selected.notif.weekKey)}</div>}
        {selected.isSystem&&<div style={{marginBottom:14}}/>}
        {selected.isSystem
          ?<div style={{fontSize:13,color:"#1a1814",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{selected.content}</div>
          :<NotifDetail notif={selected.notif} teamMember={teamMember} teamMembers={teamMembers||[]} onSendMessage={onSendMessage} onRead={()=>{onReadNotif&&onReadNotif(selected.notif);setSelected(null);}}/>
        }

      </div>
    </div>}
  </div>;
}

function Bsv3Banner({onGoBsv3}) {
  const [bsv3ImportedAt, setBsv3ImportedAt] = useState(null);
  useEffect(()=>{
    getDocs(collection(db,'bsv3_data')).then(snap=>{
      if(!snap.empty){
        const at=snap.docs[0]?.data()?.importedAt||null;
        setBsv3ImportedAt(at);
      }
    }).catch(()=>{});
  },[]);
  const [bsv3Rows, setBsv3Rows] = useState([]);
  const [bsv3Year, setBsv3Year] = useState(null);
  useEffect(()=>{
    getDocs(collection(db,'bsv3_data')).then(snap=>{
      if(!snap.empty){
        let all=[];let at=null;
        snap.docs.sort((a,b)=>a.id.localeCompare(b.id)).forEach(d=>{
          const data=d.data();all=all.concat(data.rows||[]);
          if(!at)at=data.importedAt;
        });
        setBsv3ImportedAt(at);
        const importDate=at?new Date(at):new Date();
        const yr=importDate.getMonth()===0?importDate.getFullYear()-1:importDate.getFullYear();
        setBsv3Year(yr);
        const valid=all.filter(r=>r['Année Emission']===String(yr)&&!['CASIER-OE','COIFFE-OE','CONTENANT BOUTEILLE'].includes(r['Contenant+Appelation/Robe'])&&r['Canal']);
        setBsv3Rows(valid);
      }
    }).catch(()=>{});
  },[]);

  // Compute KPIs
  // All BSv3 rows (all years) for N-1
  const [bsv3AllRows,setBsv3AllRows]=React.useState([]);
  // Load ALL years for N-1 comparison
  React.useEffect(()=>{
    getDocs(collection(db,'bsv3_data')).then(snap=>{
      if(!snap.empty){
        let all=[];
        snap.docs.sort((a,b)=>a.id.localeCompare(b.id)).forEach(d=>all=all.concat(d.data().rows||[]));
        setBsv3AllRows(all);
      }
    }).catch(()=>{});
  },[]);

  const bsv3CA=bsv3Rows.reduce((s,r)=>s+parseBsv3Amt(r['Montant HT']),0);
  const bsv3Marge=bsv3Rows.reduce((s,r)=>s+parseBsv3Amt(r['Marge brute']),0);
  const bsv3Taux=bsv3CA?bsv3Marge/bsv3CA:null;
  const maxMonth=bsv3Rows.length?Math.max(...bsv3Rows.map(r=>parseInt(r['Mois Emission'])||0)):0;
  const prevYear=bsv3Year?bsv3Year-1:null;

  // Last month taux
  const lastMonthRows=bsv3Rows.filter(r=>parseInt(r['Mois Emission'])===maxMonth);
  const lastMonthAgg=aggBsv3(lastMonthRows);
  // 6M rolling from last month
  let roll6=[];
  for(let dm=0;dm<6;dm++){
    let m=maxMonth-dm,y=bsv3Year;if(m<=0){m+=12;y--;}
    roll6=roll6.concat(bsv3AllRows.filter(r=>r['Mois Emission']===String(m)&&r['Année Emission']===String(y)&&!BSV3_EXCLUDE_PRODUITS.has(r['Contenant+Appelation/Robe'])));
  }
  const roll6Taux=aggBsv3(roll6).taux;
  const lastMonthArrow=lastMonthAgg.taux!=null&&roll6Taux!=null?(lastMonthAgg.taux>roll6Taux?'↑':'↓'):null;

  // N-1 YTD marge
  // N-1: load from bsv3AllRows (all years are stored)
  const prevYearRows=bsv3AllRows.filter(r=>r['Année Emission']===String(prevYear)&&!['CASIER-OE','COIFFE-OE','CONTENANT BOUTEILLE'].includes(r['Contenant+Appelation/Robe']));
  const prevYtdRows=prevYearRows.filter(r=>parseInt(r['Mois Emission'])<=maxMonth);
  const bsv3MargeN1=prevYtdRows.reduce((s,r)=>s+parseBsv3Amt(r['Marge brute']),0);
  const bsv3VarMarge=bsv3Marge-bsv3MargeN1;

  const fmtK=v=>{if(!v&&v!==0)return '—';const abs=Math.abs(v);const s=abs>=1000?(abs/1000).toFixed(0)+'k€':abs.toFixed(0)+'€';return (v<0?'-':'')+s;};
  const fmtPctB=v=>v!=null?(v*100).toFixed(1)+'%':'—';
  const items=[
    {label:"CA YTD",val:bsv3CA||null,col:"#1a1814",fmt:fmtK},
    {label:"Marge YTD",val:bsv3Marge||null,col:bsv3Marge<0?"#c0392b":"#1a1814",fmt:fmtK},
    {label:`Taux ${MOIS_LABELS[maxMonth]||''}`,val:lastMonthAgg.taux,col:lastMonthArrow==='↑'?"#2d6a4f":lastMonthArrow==='↓'?"#c0392b":"#1a1814",fmt:v=>`${fmtPctB(v)}${lastMonthArrow?` ${lastMonthArrow}`:''}`,arrow:lastMonthArrow},
    {label:"Taux YTD",val:bsv3Taux,col:bsv3Taux!=null&&bsv3Taux<0?"#c0392b":"#1a1814",fmt:fmtPctB},
    {label:"Var. Marge N-1",val:bsv3VarMarge,col:bsv3VarMarge<0?"#c0392b":"#2d6a4f",fmt:v=>v>=0?'+'+fmtK(v):fmtK(v)},
  ];
  return (
    <div style={{background:"#fff",border:"1px solid #e2ddd6",borderRadius:10,padding:"14px 20px",
      display:"flex",alignItems:"center",gap:0,boxShadow:"0 1px 3px rgba(0,0,0,.04)",marginBottom:4}}>
      {items.map((item,i)=><React.Fragment key={i}>
        <div style={{flex:1,textAlign:"center",padding:"0 12px"}}>
          <div style={{fontSize:26,fontWeight:700,color:item.val!=null?item.col:"#9e9890",lineHeight:1,fontFamily:"monospace"}}>{item.val!=null?(item.fmt||String)(item.val):'—'}</div>
          <div style={{fontSize:9,color:"#9e9890",marginTop:3,textTransform:"uppercase",letterSpacing:".05em"}}>{item.label}</div>
        </div>
        {i<4&&<div key={"sep"+i} style={{width:1,background:"#e2ddd6",alignSelf:"stretch",flexShrink:0}}/>}
      </React.Fragment>)}
      <div style={{width:1,background:"#e2ddd6",alignSelf:"stretch",flexShrink:0}}/>
      <div style={{flex:1,textAlign:"center",padding:"0 12px"}}>
        <button onClick={onGoBsv3}
          style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",
            background:"#2d6a4f",color:"#fff",border:"none",borderRadius:8,
            cursor:"pointer",fontSize:12,fontWeight:500,minWidth:140,
            transition:"opacity .15s"}}
          onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          📊 Base Sales v3
        </button>
        {bsv3ImportedAt&&<div style={{fontSize:9,color:"#c5c0b8",marginTop:4,textAlign:'center'}}>
          mis à jour le {new Date(bsv3ImportedAt).toLocaleDateString('fr-FR')}
        </div>}
      </div>
    </div>
  );
}

function ReportingBanner({onGoReporting}) {
  const [caData, setCaData] = useState(null);
  const [chargeData, setChargeData] = useState(null);
  const [bfrBanner, setBfrBanner] = useState(null);
  const [importedAt, setImportedAt] = useState(null);
  const [liveCanalMargin, setLiveCanalMargin] = useState(null);

  useEffect(()=>{
    const u1=onSnapshot(doc(db,'reporting','ca'),(snap)=>{if(snap.exists()){setCaData(snap.data().caData);}});
    const u2=onSnapshot(doc(db,'reporting','charges'),(snap)=>{if(snap.exists())setChargeData(snap.data().chargeData);});
    const u3b=onSnapshot(doc(db,'reporting','bfr'),(snap)=>{if(snap.exists())setBfrBanner(snap.data().bilData);});
    const u3=onSnapshot(doc(db,'reporting','meta'),(snap)=>{if(snap.exists()){if(snap.data().importedAt)setImportedAt(snap.data().importedAt);if(snap.data().canalMargin)setLiveCanalMargin(snap.data().canalMargin);}});
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
  const effectiveMargin = liveCanalMargin || {};
  REPORTING_CANALS_ALL.forEach(canal => {
    const csvKey = CANAL_CSV_MAP2[canal]||canal;
    const canalData = caData[csvKey]||{};
    const canalTotal = Object.values(canalData).reduce((a,b)=>a+b,0);
    caYTD += canalTotal;
    const defaultRate = CANAL_MARGIN2[canal]??0.263;
    const rates = effectiveMargin[canal];
    // caData keys are "YYYY-MM" format
    Object.entries(canalData).forEach(([key, caVal])=>{
      const month = parseInt((key.split('-')[1]||key));
      const rate = (rates && typeof rates[month]==='number') ? rates[month] : defaultRate;
      mbYTD += caVal * rate;
    });
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
    {label:"Trésorerie",val:(()=>{
      const rows=bfrBanner?.banques?.banques?.rows||[];
      let startBal=0;
      rows.forEach(r=>Object.values(r.an||{}).forEach(v=>startBal-=v));
      const months=bfrBanner?.banques?.banques?.months||{};
      const arr=Array(12).fill(0);
      Object.entries(months).forEach(([k,v])=>{const m=parseInt(k.split('-')[1])-1;if(m>=0&&m<12)arr[m]-=v;});
      // Find last month with data
      let lastM=0;
      Object.keys(months).forEach(k=>{const m=parseInt(k.split('-')[1]);if(m>lastM)lastM=m;});
      let cum=startBal;
      for(let m=0;m<lastM;m++) cum+=arr[m];
      return cum;
    })(),col:"#1d4ed8"},
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
            cursor:"pointer",fontSize:12,fontWeight:500,minWidth:140,
            transition:"opacity .15s"}}
          onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          📈 Voir le Reporting
        </button>
        {importedAt&&<div style={{fontSize:9,color:"#c5c0b8",marginTop:4,textAlign:'center'}}>
          mis à jour le {new Date(importedAt).toLocaleDateString('fr-FR')}
        </div>}
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

function Dashboard({currentUser,teamMember,teamMembers=[],onGoOKR,onGoUpdate,onGoReporting,onGoBsv3,myUpdates,allUpdates,managerNotifs,teammateNotifs=[],onReadNotif,okrData,isAdmin,onOpenSettings,onChangeSeasonKey,onSendMessage,absencesList=[]}){
  const {objectives=[],subobjectives=[],keyresults=[],seasonKey:_sk}=okrData||{};
  const seasonKey=okrData?.seasonKey||"printemps_2026";
  const isOwner=currentUser?.email===OWNER_EMAIL;
  const avgProg=calcWeightedAvg(objectives,subobjectives,keyresults);
  const totalKR=keyresults.length,doneKR=keyresults.filter(k=>k.taux>=100).length;
  const myPrenom=teamMember?.prenom;
  const myKRs=keyresults.filter(k=>k.owner===myPrenom);
  const myKRDone=myKRs.filter(k=>calcTaux(k.val_depart,k.val_actuel,k.val_cible,k.unite)>=100).length;

  // Personal weighted progress: weight = KR_poids * sobj_poids * obj_etp
  // Owner-only KRs for personal progress (not contributor)
  const myKRsOwned=useMemo(()=>keyresults.filter(k=>k.owner===myPrenom),[keyresults,myPrenom]);
  const myKRDoneOwned=useMemo(()=>myKRsOwned.filter(k=>calcTaux(k.val_depart,k.val_actuel,k.val_cible,k.unite)>=100).length,[myKRsOwned]);
  const myPersonalProg=useMemo(()=>{
    let totalW=0,weightedSum=0;
    myKRsOwned.filter(k=>k.poids>0).forEach(kr=>{
      const sobj=subobjectives.find(s=>s.id===kr.parent);
      const obj=objectives.find(o=>o.id===sobj?.parent);
      // Even if sobj/obj not found, still count the KR with flat weight
      const sobjPoids=sobj?sobj.poids:100;
      const objEtp=obj?Math.max(obj.etp||0,0.01):1;
      const w=kr.poids*(sobjPoids/100)*objEtp;
      const taux=calcTaux(kr.val_depart,kr.val_actuel,kr.val_cible,kr.unite)||0;
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
        <MessagesPanel managerNotifs={managerNotifs} teammateNotifs={teammateNotifs} onReadNotif={onReadNotif} teamMember={teamMember} teamMembers={teamMembers} myUpdates={myUpdates} allUpdates={allUpdates} onSendMessage={onSendMessage}/>
        <FeedbackBox currentUser={currentUser} teamMember={teamMember}/>
      </div>

      {/* ── SECTION OKR ── pleine largeur */}
      <div style={{display:"flex",flexDirection:"column",gap:2,marginBottom:16}}>
        {(()=>{
          const col=progColor(avgProg);
          const colPerso=progColorRel(myPersonalProg,avgProg);
          const krCol=progColor(doneKR/Math.max(totalKR,1)*100);
          const krColPerso=progColorRel(myKRDoneOwned/Math.max(myKRsOwned.length,1)*100,avgProg);
          const info=getSeasonInfo(seasonKey||"printemps_2026");
          const timeProg=getSeasonProgress(seasonKey||"printemps_2026");
          const start=new Date(info.start),end=new Date(info.end);
          const fmt=d=>d.toLocaleDateString("fr-FR",{day:"numeric",month:"short"});
          return <div style={{background:"#fff",border:"1px solid #86efac",borderRadius:10,padding:"14px 20px",
            display:"flex",alignItems:"center",gap:20,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
            {/* Left: % global + % perso */}
            <div style={{flexShrink:0,textAlign:"center",width:80}}>
              <div style={{fontSize:42,fontWeight:700,fontFamily:"monospace",color:col,lineHeight:1}}>{Math.round(avgProg)}%</div>
              <div style={{fontSize:9,color:"#9e9890",marginTop:1,textTransform:"uppercase",letterSpacing:".05em"}}>Équipe</div>
              {myKRsOwned.length>0&&<><div style={{fontSize:32,fontWeight:700,fontFamily:"monospace",color:colPerso,lineHeight:1,marginTop:4}}>{Math.round(myPersonalProg)}%</div>
              <div style={{fontSize:9,color:"#9e9890",marginTop:1,textTransform:"uppercase",letterSpacing:".05em"}}>{myPrenom}</div></>}
            </div>
            <div style={{width:1,background:"#e2ddd6",alignSelf:"stretch",flexShrink:0}}/>
            {/* Center: season + bars */}
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  {isOwner&&(()=>{const allKeys=["printemps_2026","ete_2026","automne_2026","hiver_2027","printemps_2027","ete_2027","automne_2027"];const idx2=allKeys.indexOf(seasonKey||"printemps_2026");return <><button onClick={idx2>0?()=>onChangeSeasonKey&&onChangeSeasonKey(allKeys[idx2-1]):undefined} style={{background:"none",border:"none",cursor:idx2>0?"pointer":"default",fontSize:14,color:idx2>0?"#2d6a4f":"#c5c0b8",padding:"0 2px"}}>←</button></>;})()} 
                  <span style={{fontSize:12,fontWeight:500,color:"#1a1814"}}>{info.label}</span>
                  {isOwner&&(()=>{const allKeys=["printemps_2026","ete_2026","automne_2026","hiver_2027","printemps_2027","ete_2027","automne_2027"];const idx2=allKeys.indexOf(seasonKey||"printemps_2026");return <><button onClick={idx2<allKeys.length-1?()=>onChangeSeasonKey&&onChangeSeasonKey(allKeys[idx2+1]):undefined} style={{background:"none",border:"none",cursor:idx2<allKeys.length-1?"pointer":"default",fontSize:14,color:idx2<allKeys.length-1?"#2d6a4f":"#c5c0b8",padding:"0 2px"}}>→</button></>;})()} 
                </div>
                <span style={{fontSize:11,color:"#9e9890"}}>{fmt(start)} → {fmt(end)}</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                <Bar v={avgProg} label="Avancement total des OKR" w={0}/>
                <Bar v={timeProg} label="Avancement de la saison" w={0}/>
                {myKRsOwned.length>0&&<Bar v={myPersonalProg} label="Mon avancement" w={0}/>}
              </div>
            </div>
            <div style={{width:1,background:"#e2ddd6",alignSelf:"stretch",flexShrink:0}}/>
            {/* Right: KR counts + button */}
            <div style={{flexShrink:0,textAlign:"center",minWidth:120}}>
              <div style={{fontSize:22,fontWeight:700,color:krCol,fontFamily:"monospace"}}>{doneKR}/{totalKR}</div>
              <div style={{fontSize:9,color:"#6b6560",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>KR complétés</div>
              <button onClick={onGoOKR} style={{display:"block",width:"100%",padding:"7px 12px",background:"#2d6a4f",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:500,marginBottom:6,transition:"opacity .15s"}}
                onMouseEnter={e=>e.currentTarget.style.opacity=".85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                🎯 Aller aux OKR
              </button>
              {myKRsOwned.length>0&&<><div style={{fontSize:18,fontWeight:700,color:krColPerso,fontFamily:"monospace"}}>{myKRDoneOwned}/{myKRsOwned.length}</div><div style={{fontSize:9,color:"#6b6560",textTransform:"uppercase",letterSpacing:".05em"}}>mes KR</div></>}
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
        // Absences count as completed
        const isAbsenceWeek=(w)=>{
          const declaredAbs=(window._absences||[]).find(a=>a.email===teamMember?.email&&toDateStr(w.mon)>=a.dateFrom&&toDateStr(w.mon)<=a.dateTo);
          const member=(teamMembers||[]).find(m=>m.email===teamMember?.email);
          return !!(declaredAbs||member?.forceAbsent||member?.forceMat||(teamMember?.email==='claire@oeforgood.com'));
        };
        const myCompletionRate=my12PastWeeks.length>0?Math.round(my12PastWeeks.filter(w=>w.u||isAbsenceWeek(w)).length/my12PastWeeks.length*100):100;


  // Get absence icon for a teammate based on forceAbsent/forceMat flags or previous week's q8 answer
   function getAbsenceIcon(email, prenom, refDate) {
     const member = (teamMembers||[]).find(m => m.email === email);
     const checkDate = refDate || new Date();
     const declaredAbs = (window._absences||[]).find(a=>
       a.email===email && toDateStr(checkDate)>=a.dateFrom && toDateStr(checkDate)<=a.dateTo
     );
     if (declaredAbs) return declaredAbs.type;
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

        function SmileysOrdered({done,absent,size=22,hideMood=false,refDate}){
          const [hov,setHov]=useState(null);
          const [pos,setPos]=useState({x:0,y:0});
          // Absents = ceux avec 🤰/🎓/🌴/🎿 (forceMat, forceAbsent, ou q8 congés/école)
          const absentEmails=new Set(absent.map(m=>m.email));
          const realAbsents=absent.filter(m=>{
            const icon=getAbsenceIcon(m.email,m.prenom,refDate);
            return icon!=='🫥';
          });
          const realAbsentEmails=new Set(realAbsents.map(m=>m.email));
          // Sort: 🤰 first, then others
          const absentSorted=[...realAbsents].sort((a,b)=>{
            const aFirst=(a.forceMat)?0:1;
            const bFirst=(b.forceMat)?0:1;
            return aFirst-bFirst;
          });
          const absentItems=absentSorted.map(m=>({key:'a'+m.email,emoji:getAbsenceIcon(m.email,m.prenom,refDate),name:m.prenom,isAbsent:true}));
          // Done (excl. real absents), sorted by submittedAt
          // Also check declared absences for done members
          const doneAbsentItems=done.filter(u=>!realAbsentEmails.has(u.email)).filter(u=>{
            const icon=getAbsenceIcon(u.email,u.prenom,refDate);
            return icon!=='🫥';
          }).map(u=>({key:'da'+u.email,emoji:getAbsenceIcon(u.email,u.prenom,refDate),name:u.prenom,isAbsent:true}));
          const doneAbsentEmails=new Set(doneAbsentItems.map(i=>i.key.slice(2)));
          const doneItems=done.filter(u=>!realAbsentEmails.has(u.email)&&!doneAbsentEmails.has(u.email)).sort((a,b)=>a.submittedAt-b.submittedAt).map(u=>({key:'d'+u.email,emoji:hideMood?'🫥':(u.answers?.q7||"😐"),name:u.prenom,isAbsent:false}));
          // Not done = present actifs qui n'ont ni soumis ni sont absents → 🫥
          const doneEmails=new Set(done.map(u=>u.email));
          // notDone = actifs, non absents réels (🤰🎓🌴🎿), non complétés
          const notDoneItems=(teamMembers||[]).filter(m=>
            m.role!=="inactive"&&m.email&&
            !realAbsentEmails.has(m.email)&&
            !doneEmails.has(m.email)
          ).map(m=>({key:'n'+m.email,emoji:"🫥",name:m.prenom,isAbsent:false,notDone:true}));
          const all=[...absentItems,...doneAbsentItems,...doneItems,...notDoneItems];
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
            // Check ponctual absences from absencesList
            const monStr=toDateStr(w.mon);
            const abs=(window._absences||[]).find(a=>a.email===teamMember?.email&&monStr>=a.dateFrom&&monStr<=a.dateTo);
            if(abs){
              if(abs.type==='mat') return '🤰';
              if(abs.type==='school') return '🎓';
              return '🌴';
            }
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
                opacity:(w.u||isLast||(icon!=='🫥'))?1:0.45,
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
            boxShadow:"0 1px 3px rgba(0,0,0,.04)",height:180,boxSizing:"border-box",overflow:"hidden"}}>
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
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:4,justifyContent:"center",minWidth:0}}>
              <div>
                <div style={{fontSize:9,color:"#9e9890",marginBottom:2,textTransform:"uppercase",letterSpacing:".05em",fontWeight:500}}>
                  Sem. passée {(()=>{const{mon,fri}=getWeekBounds(lastWkKey);const sameM=mon.getMonth()===fri.getMonth();return sameM?`${mon.getDate()}–${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"short"})}`:`${mon.getDate()} ${mon.toLocaleString("fr-FR",{month:"short"})}–${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"short"})}`;})()}
                </div>
                <SmileysOrdered done={teamLastWkFiltered} absent={absentLastWk} size={22} refDate={_7daysAgo}/>
              </div>
              <div>
                <div style={{fontSize:9,color:"#9e9890",marginBottom:2,textTransform:"uppercase",letterSpacing:".05em",fontWeight:500}}>
                  Sem. en cours {(()=>{const{mon,fri}=getWeekBounds(curWkKey);const sameM=mon.getMonth()===fri.getMonth();return sameM?`${mon.getDate()}–${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"short"})}`:`${mon.getDate()} ${mon.toLocaleString("fr-FR",{month:"short"})}–${fri.getDate()} ${fri.toLocaleString("fr-FR",{month:"short"})}`;})()}
                </div>
                <SmileysOrdered done={teamCurWkFiltered} absent={absentCurWk} size={22} hideMood={!curWkVisible} refDate={_thisMon}/>
              </div>
            </div>
            {/* Right: mood curve - tall */}
            <div style={{flex:"0 0 340px",alignSelf:"stretch",overflow:"hidden",height:"100%"}}>
              <UpdateStreakWithCurve myUpdates={myUpdates} allUpdates={allUpdates} clickable={false} showDots={false} nWeeks={26} curveHeight={152} stretchHeight={true}/>
            </div>
            {/* Old ratio removed - now in left panel */}

          </div>
          {/* Personal Updates banner - 320px */}
          <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:10,padding:"10px 16px",
            display:"flex",flexDirection:"column",gap:0,
            boxShadow:"0 1px 3px rgba(0,0,0,.04)",height:180,boxSizing:"border-box",overflow:"hidden"}}>
            {/* Top: mood + name + completion */}
            <div style={{display:"flex",alignItems:"center",gap:10,paddingBottom:6}}>
              <div style={{fontSize:52,lineHeight:1,flexShrink:0}}>{myMoodDisplay||"🫥"}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:"#1a1814"}}>{myPrenom}</div>
                <div style={{fontSize:9,color:"#6b6560",textTransform:"uppercase",letterSpacing:".05em"}}>Semaine passée</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:22,fontWeight:700,color:myCompletionRate>=80?"#2d6a4f":myCompletionRate>=50?"#b5680f":"#c0392b"}}>{myCompletionRate}%</div>
                <div style={{fontSize:9,color:"#6b6560"}}>complétion 13 sem.</div>
              </div>
            </div>
            {/* Separator */}
            <div style={{height:1,background:"#86efac",margin:"2px 0 4px 0"}}/>
            {/* 13 smileys + label inline, last emoji big */}
            <div style={{flex:1,display:"flex",alignItems:"flex-start",gap:6,minHeight:0}}>
              <div style={{fontSize:9,color:"#6b6560",textTransform:"uppercase",letterSpacing:".05em",fontWeight:500,whiteSpace:"nowrap",paddingTop:2,flexShrink:0}}>Mes 13<br/>dernières<br/>semaines</div>
              <div style={{flex:1,display:"flex",alignItems:"flex-start",flexWrap:"nowrap",gap:0,overflow:"hidden"}}>
                <My13Smileys/>
              </div>
            </div>
            {/* Separator */}
            <div style={{height:1,background:"#86efac",margin:"4px 0 6px 0"}}/>
            {/* Bottom: button */}
            <div>
              <button onClick={onGoUpdate}
                style={{width:"100%",padding:"6px 14px",background:"#2d6a4f",color:"#fff",border:"none",
                  borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:500,
                  transition:"opacity .15s",textAlign:"center"}}
                onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                ✍️ Aller aux updates et compléter
              </button>
              {todayUpdate&&<div style={{fontSize:10,color:"#166534",textAlign:"center",marginTop:2}}>✓ Update enregistré</div>}
            </div>
          </div>
          </div>{/* end updates 2/3+1/3 grid */}
        </>;
      })()}
