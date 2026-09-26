const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, doc, setDoc } = require("firebase/firestore");

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

const now = Date.now();
const day = 86400000;

const notifs = [
  {
    fromEmail: "fiona@oeforgood.com",
    fromPrenom: "Fiona",
    managerEmail: "fx@oeforgood.com",
    weekKey: "2026-W23",
    submittedAt: now - 2*day,
    answers: {
      q1: "Finalisation des tests de production sur les essences blanches. Réunion avec l'ESAT pour le planning de l'été.",
      q2: "Préparer le brief pour le nouveau prestataire logistique. Suivre les stocks chez Peguet.",
      q3: "La dégustation avec l'équipe était top — bons retours sur la nouvelle cuvée 😍",
      q4: "J'aurais besoin d'un coup de main sur la partie contractuelle avec ReZip.",
      q5: "Tout roule globalement, je suis bien dans la saison.",
      q7: "😊",
      q8: "Au boulot au moins deux jours"
    },
    read: false
  },
  {
    fromEmail: "julie@oeforgood.com",
    fromPrenom: "Julie",
    managerEmail: "fx@oeforgood.com",
    weekKey: "2026-W22",
    submittedAt: now - 9*day,
    answers: {
      q1: "Avancée sur les travaux du loft — les peintures sont terminées ! Coordination avec les artisans pour la semaine prochaine.",
      q2: "Finaliser la liste des équipements manquants. Prendre RDV avec le plombier.",
      q3: "Voir le loft prendre forme, c'est vraiment motivant pour toute l'équipe 🙂",
      q4: "Non, tout va bien cette semaine.",
      q5: "Je pense qu'on pourrait faire une petite fête d'inauguration fin juillet ?",
      q7: "🙂",
      q8: "Au boulot au moins deux jours"
    },
    read: true,
    readAt: now - 7*day
  },
  {
    fromEmail: "fiona@oeforgood.com",
    fromPrenom: "Fiona",
    managerEmail: "fx@oeforgood.com",
    weekKey: "2026-W22",
    submittedAt: now - 10*day,
    answers: {
      q1: "Suivi de la production chez MP — retards constatés sur 2 références. Escalade en cours.",
      q2: "Relance MP sur les dates fermes. Préparer plan B avec fournisseur alternatif.",
      q3: "Résolution du problème sur les étiquettes — finalement trouvé la solution en interne !",
      q4: "Oui, j'aurais besoin d'aide pour négocier les pénalités de retard avec MP.",
      q5: "Rien de particulier.",
      q7: "😐",
      q8: "Au boulot au moins deux jours"
    },
    read: true,
    readAt: now - 8*day
  }
];

async function seed() {
  for (const notif of notifs) {
    const id = `${notif.fromEmail}_${notif.weekKey}_notif`;
    await setDoc(doc(db, "update_notifications", id), notif);
    console.log("Created:", id);
  }
  console.log("Demo notifications seeded for Fx!");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
