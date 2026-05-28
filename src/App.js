import { useState, useEffect, useCallback } from "react";

const SPRING26={"objectives":[{"id":"1","title":"Aller chercher du chiffre d'affaires sur d'autres canaux","etp":0.2,"owner":"Tomek","priorite":"P1","contributors":[]},{"id":"2","title":"Fiabiliser la production et monter d'un cran en supply","etp":0.1,"owner":"Fiona","priorite":"P1","contributors":[]},{"id":"3","title":"Adopter le loft et s'y sentir bien","etp":0.1,"owner":"Julie","priorite":"P2","contributors":[]},{"id":"4","title":"Se mettre en position sereine pour la pérénité d'Oé","etp":0.35,"owner":"Fx","priorite":"P1","contributors":[]},{"id":"5","title":"Gérer le domaine et la FSDO","etp":0.05,"owner":"Fx","priorite":"P2","contributors":[]},{"id":"6","title":"Prioriser les grands comptes RHF les plus ROIstes","etp":0.37,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"7","title":"Accélérer notre activité RETAIL en GMS","etp":0.22,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"8","title":"Aligner notre vision et piloter nos actions sales","etp":0.22,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"9","title":"Marketing : Déployer une stratégie de communication 360° cohérente et structurée au service de la croissance commerciale","etp":0.2,"owner":"Juliette","priorite":"P1","contributors":[]},{"id":"10","title":"Communauté : Structurer et activer une communauté engagée au service de l’impact positif et du développement de la marque et du B2B","etp":0.15,"owner":"Juliette","priorite":"P1","contributors":[]},{"id":"11","title":"Export : Réaliser des avancées significatives sur les principaux marchés cibles en priorisant le développement des distributeurs existants","etp":0.05,"owner":"Claire","priorite":"P1","contributors":[]}],"subobjectives":[{"id":"1.1","parent":"1","title":"Ouvrir le canal Commandes Groupées et lancer les premières commandes Groopay","poids":70.0,"owner":"Tomek","priorite":"P1","contributors":[]},{"id":"1.2","parent":"1","title":"Se mettre au carré sur les market places et les activer","poids":30.0,"owner":"Fiona","priorite":"P1","contributors":[]},{"id":"2.1","parent":"2","title":"Fiabiliser la production des essences","poids":30.0,"owner":"Fiona","priorite":"P1","contributors":[]},{"id":"2.2","parent":"2","title":"Fiabiliser les dates de réalisation de production chez MP","poids":30.0,"owner":"Fiona","priorite":"P2","contributors":[]},{"id":"2.3","parent":"2","title":"Avancer avec la coallition des acteurs du vin et ReZip","poids":20.0,"owner":"Julie","priorite":"P2","contributors":[]},{"id":"2.4","parent":"2","title":"Poursuivre et fortifier notre collaboration avec l'ESAT","poids":10.0,"owner":"Julie","priorite":"P2","contributors":[]},{"id":"2.5","parent":"2","title":"Nettoyer les stocks chez Peguet","poids":10.0,"owner":"Julie","priorite":"P2","contributors":[]},{"id":"3.1","parent":"3","title":"Les travaux au loft : en finir une fois pour toutes !","poids":100.0,"owner":"Julie","priorite":"P2","contributors":[]},{"id":"4.1","parent":"4","title":"Se donner les moyens de réaliser la marge objectif en 2026","poids":33.3,"owner":"Fx","priorite":"P1","contributors":[]},{"id":"4.2","parent":"4","title":"Avancer dans notre plan d'étalement de dettes","poids":33.3,"owner":"Fx","priorite":"P1","contributors":[]},{"id":"4.3","parent":"4","title":"Sécuriser Oé en termes de trésorerie sur 2026-2027","poids":33.3,"owner":"Fx","priorite":"P1","contributors":[]},{"id":"5.1","parent":"5","title":"Donner une nouvelle impulsion au plan de régénération du DOCSP","poids":60.0,"owner":"Fx","priorite":"P2","contributors":[]},{"id":"5.2","parent":"5","title":"Retrapper le juridique de la FSDO","poids":30.0,"owner":"Fx","priorite":"P2","contributors":[]},{"id":"5.3","parent":"5","title":"Organiser les vendanges au Domaine","poids":10.0,"owner":"Fx","priorite":"P3","contributors":[]},{"id":"6.1","parent":"6","title":"Accélérer Episaveurs – Développer pipeline et sécuriser volumes","poids":20.0,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"6.2","parent":"6","title":"Sécuriser France Boissons – Pérenniser accords et promotions","poids":15.0,"owner":"Claire","priorite":"P1","contributors":[]},{"id":"6.3","parent":"6","title":"Optimiser potentiel Maison Richard – Développer ventes et présence","poids":15.0,"owner":"Tomek","priorite":"P1","contributors":[]},{"id":"6.4","parent":"6","title":"Pérenniser Pain Quotidien – Consolider déploiement international","poids":10.0,"owner":"Claire","priorite":"P1","contributors":[]},{"id":"6.5","parent":"6","title":"Traiter Grands Comptes directs à potentiel","poids":10.0,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"6.6","parent":"6","title":"Cibler distributeurs régionaux existants – Sécuriser les volumes et réactiver terrain","poids":10.0,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"6.7","parent":"6","title":"Traiter top clients CHR directs – Fidéliser et étendre gamme premium","poids":10.0,"owner":"Christelle","priorite":"P2","contributors":[]},{"id":"6.8","parent":"6","title":"Nous déployer en Cash & Carry","poids":10.0,"owner":"Christelle","priorite":"P2","contributors":[]},{"id":"7.1","parent":"7","title":"Carrefour – Déployer et animer les magasins clés","poids":15.0,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"7.2","parent":"7","title":"ITM, U, Monoprix – Assurer couverture régionale et promotion","poids":15.0,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"7.3","parent":"7","title":"Leclerc & Franprix – Développer les magasins VIP","poids":10.0,"owner":"Christelle","priorite":"P3","contributors":[]},{"id":"7.4","parent":"7","title":"Enseignes prioritaires – visibilité & MEA","poids":5.0,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"7.5","parent":"7","title":"Renforcer la bascule Reuse / Réemploi","poids":10.0,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"7.6","parent":"7","title":"GSS – Sécuriser et développer positions","poids":15.0,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"7.7","parent":"7","title":"Cavistes - Pousser les acteurs majeurs","poids":15.0,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"7.8","parent":"7","title":"Hard Discount - Focuser sur le leader","poids":5.0,"owner":"Tomek","priorite":"P3","contributors":[]},{"id":"7.9","parent":"7","title":"Marketplaces - Optimiser les ventes et destockage","poids":10.0,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"8.1","parent":"8","title":"Stratégie & alignement – Suivi feuille de route par canal (Retail, RHF, GC RHF)","poids":20.0,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"8.2","parent":"8","title":"Stratégie terrain sales tous canaux - Repenser l'organisation (agents/alternants/CDIs/mutualisation)","poids":20.0,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"8.3","parent":"8","title":"Road map Trade Marketing - Aligner et anticiper les temps forts S2 2026-2027","poids":15.0,"owner":"Christelle","priorite":"P3","contributors":[]},{"id":"8.4","parent":"8","title":"Optimisation discours commercial","poids":15.0,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"8.5","parent":"8","title":"KPI & pilotage – Fiabiliser tableaux de bord internes et reporting Hubspot","poids":15.0,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"8.6","parent":"8","title":"Collaboration support – Suivi actions partagées avec équipes support","poids":15.0,"owner":"Christelle","priorite":"P1","contributors":[]},{"id":"9.1","parent":"9","title":"Renforcer la prospection et la fidélisation B2B grâce à des contenus, outils et communications ciblées","poids":20.0,"owner":"Juliette","priorite":"P1","contributors":[]},{"id":"9.2","parent":"9","title":"B2B organiser les salons et animations 2026/2027 : WineParis et ReUse","poids":5.0,"owner":"Guillemette","priorite":"P1","contributors":[]},{"id":"9.3","parent":"9","title":"Assurer le succès des lancements produits B2B grâce à un plan de communication et des PLV adaptées","poids":20.0,"owner":"Juliette","priorite":"P2","contributors":[]},{"id":"9.4","parent":"9","title":"Déployer le plan de communication Printemps/Été pour assurer visibilité, cohérence et suivi des actions Brand & B2C","poids":25.0,"owner":"Guillemette","priorite":"P1","contributors":[]},{"id":"9.5","parent":"9","title":"Repenser et améliorer le site Oé pour offrir une expérience utilisateur fluide et engageante","poids":25.0,"owner":"Guillemette","priorite":"P1","contributors":[]},{"id":"9.6","parent":"9","title":"Réaliser l’inventaire complet des supports de communication et marketing Oé","poids":5.0,"owner":"Guillemette","priorite":"P3","contributors":[]},{"id":"10.1","parent":"10","title":"Valider, structurer et lancer le Campus Oé comme outil d’engagement et de formation de la communauté B2B","poids":20.0,"owner":"Juliette","priorite":"P1","contributors":[]},{"id":"10.2","parent":"10","title":"Développer et activer la communauté Oé en augmentant le recrutement et l’engagement via des communications, un programme de parrainage et des expériences dédiées","poids":15.0,"owner":"Guillemette","priorite":"P2","contributors":[]},{"id":"10.3","parent":"10","title":"Déployer une communication régulière pour soutenir la visibilité et l’engagement du Commando Monop’","poids":25.0,"owner":"Guillemette","priorite":"P1","contributors":[]},{"id":"10.4","parent":"10","title":"Créer et activer des opportunités commerciales via les commandes groupées auprès de 50 entreprises","poids":40.0,"owner":"Guillemette","priorite":"P1","contributors":[]},{"id":"11.1","parent":"11","title":"US : reprendre le développement commercial tout en boostant l’activité avec nos distributeurs existants","poids":12.0,"owner":"Claire","priorite":"P2","contributors":[]},{"id":"11.2","parent":"11","title":"Allemagne: valider notre choix de distributeur","poids":12.0,"owner":"Claire","priorite":"P1","contributors":[]},{"id":"11.3","parent":"11","title":"UK : déployer Oé sur le marché","poids":12.0,"owner":"Claire","priorite":"P1","contributors":[]},{"id":"11.4","parent":"11","title":"Alimenter en nouveaux clients la zone DK/DE/BE/UK/NL pour consolider (ou trouver) notre distribueur","poids":14.0,"owner":"Claire","priorite":"P1","contributors":[]},{"id":"11.5","parent":"11","title":"Danemark: reprise des échanges en vue de confirmer un distributeur","poids":8.0,"owner":"Claire","priorite":"P1","contributors":[]},{"id":"11.6","parent":"11","title":"Marchés monopolistiques","poids":8.0,"owner":"Claire","priorite":"P1","contributors":[]},{"id":"11.7","parent":"11","title":"Support / passation congé maternité","poids":7.0,"owner":"Claire","priorite":"P2","contributors":[]},{"id":"11.8","parent":"11","title":"Autres marchés","poids":7.0,"owner":"Claire","priorite":"P2","contributors":[]},{"id":"11.9","parent":"11","title":"Belgique : assurer la croissance des sell-out Oé en vue d'obtenir une nouvelle commande distributeur","poids":10.0,"owner":"Claire","priorite":"P2","contributors":[]},{"id":"11.10","parent":"11","title":"Finlande: anticiper la suite","poids":10.0,"owner":"Claire","priorite":"P2","contributors":[]}],"keyresults":[{"id":"1.1.1","parent":"1.1","title":"Mettre à jour toutes les infos","poids":10.0,"owner":"Juliette","priorite":"","stop":false,"contributors":["Fiona"],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":100,"taux_land":100},{"id":"1.1.2","parent":"1.1","title":"Nous poser en équipe et lister les cibles d'Ambassadeurs","poids":10.0,"owner":"Tomek","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"1.1.3","parent":"1.1","title":"Définir le bon fonctionnement, argumentaire, visuels, guide Groopay simplifié","poids":10.0,"owner":"Tomek","priorite":"","stop":false,"contributors":["Guillemette"],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":100,"taux_land":100},{"id":"1.1.4","parent":"1.1","title":"Valider ensemble le bon fontionnement commercial futur et l'équation économique liée","poids":10.0,"owner":"Tomek","priorite":"","stop":false,"contributors":["Fx"],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"1.1.5","parent":"1.1","title":"Contacter 30 \"Ambassadeurs\"","poids":20.0,"owner":"Tomek","priorite":"STOP","stop":true,"contributors":["Guillemette"],"val_depart":0.0,"val_actuel":5.0,"val_revise":5.0,"val_cible":30.0,"unite":"nb","taux":16.7,"taux_land":16.7},{"id":"1.1.6","parent":"1.1","title":"Générer d'ici fin juin 3 commandes groupées minimum","poids":30.0,"owner":"Tomek","priorite":"","stop":false,"contributors":["Guillemette"],"val_depart":0.0,"val_actuel":1.0,"val_revise":3.0,"val_cible":3.0,"unite":"nb","taux":33.3,"taux_land":100},{"id":"1.1.7","parent":"1.1","title":"Formaliser un retour d'expérience structuré après les premières ventes pour préparer la saison suivante.","poids":10.0,"owner":"Tomek","priorite":"","stop":false,"contributors":["Fx"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"1.2.1","parent":"1.2","title":"Cartographier et prioriser les marketplaces","poids":20.0,"owner":"Fiona","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":100,"taux_land":100},{"id":"1.2.2","parent":"1.2","title":"Analyse détaillée de 10 marketplaces (modèle économique, frais...)","poids":30.0,"owner":"Fiona","priorite":"","stop":false,"contributors":["Fx"],"val_depart":0.0,"val_actuel":3.0,"val_revise":10.0,"val_cible":10.0,"unite":"nb","taux":30.0,"taux_land":100},{"id":"1.2.3","parent":"1.2","title":"Réactiver ou lancer 5 marketplaces via un plan d'action","poids":30.0,"owner":"Fiona","priorite":"","stop":false,"contributors":["Fx"],"val_depart":0.0,"val_actuel":2.0,"val_revise":5.0,"val_cible":5.0,"unite":"nb","taux":40.0,"taux_land":100},{"id":"1.2.4","parent":"1.2","title":"Générer 5k € de chiffre d’affaires via les marketplaces activées","poids":20.0,"owner":"Fiona","priorite":"","stop":false,"contributors":["Julie"],"val_depart":0.0,"val_actuel":5000.0,"val_revise":5000.0,"val_cible":5000.0,"unite":"€","taux":100,"taux_land":100},{"id":"2.1.1","parent":"2.1","title":"S'assurer que la prod chez JDLO se passe bien","poids":30.0,"owner":"Fiona","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"2.1.2","parent":"2.1","title":"Sourcing des produits à risques (fleur, verveine etc.)","poids":20.0,"owner":"Fiona","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.7,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":70.0,"taux_land":100},{"id":"2.1.3","parent":"2.1","title":"Notionniser le process passage à l'échelle","poids":25.0,"owner":"Fiona","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.7,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":70.0,"taux_land":100},{"id":"2.1.4","parent":"2.1","title":"Lancer un proto d'essences en canettes","poids":25.0,"owner":"Fx","priorite":"","stop":false,"contributors":["Fiona"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"2.2.1","parent":"2.2","title":"Faire un point avec Cyril Péguet sur les retards","poids":40.0,"owner":"Fx","priorite":"","stop":false,"contributors":["Fiona","Julie"],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"2.2.2","parent":"2.2","title":"Valider un plan d'amélioration partagé avec MP","poids":40.0,"owner":"Fiona","priorite":"","stop":false,"contributors":["Fx","Julie"],"val_depart":0.0,"val_actuel":0.5,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":50.0,"taux_land":100},{"id":"2.2.3","parent":"2.2","title":"Positionner des jalons pour valider le suivi du plan","poids":20.0,"owner":"Fiona","priorite":"","stop":false,"contributors":["Fx","Julie"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"2.3.1","parent":"2.3","title":"Assister à la première réunion","poids":30.0,"owner":"Julie","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"2.3.2","parent":"2.3","title":"Définir les besoins communs","poids":20.0,"owner":"Julie","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"2.3.3","parent":"2.3","title":"Valider les premiers prototypes","poids":25.0,"owner":"Julie","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":0,"taux_land":100},{"id":"2.3.4","parent":"2.3","title":"Passer une première commande","poids":25.0,"owner":"Julie","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":0,"taux_land":100},{"id":"2.4.1","parent":"2.4","title":"Inventorier tous les stocks à déshabiller","poids":30.0,"owner":"Julie","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"2.4.2","parent":"2.4","title":"Mettre en place un plan priorités","poids":30.0,"owner":"Julie","priorite":"","stop":false,"contributors":["Fiona"],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":100,"taux_land":100},{"id":"2.4.3","parent":"2.4","title":"Suivre l'avancement des opérations","poids":20.0,"owner":"Julie","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"2.4.4","parent":"2.4","title":"Acter sur les bons process pour une bonne collaboration","poids":20.0,"owner":"Julie","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"2.5.1","parent":"2.5","title":"Inventorier les matières premières","poids":20.0,"owner":"Julie","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.3,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":30.0,"taux_land":100},{"id":"2.5.2","parent":"2.5","title":"Identifier les besoins de commandes","poids":40.0,"owner":"Julie","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.8,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":80.0,"taux_land":100},{"id":"2.5.3","parent":"2.5","title":"Se séparer des lots inutiles","poids":40.0,"owner":"Julie","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":0,"taux_land":100},{"id":"3.1.1","parent":"3.1","title":"Lister les travaux à faire","poids":20.0,"owner":"Julie","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"3.1.2","parent":"3.1","title":"Programmer une ou deux soirées d'actions","poids":30.0,"owner":"Julie","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":100,"taux_land":100},{"id":"3.1.3","parent":"3.1","title":"Aménager la terrasse (ombre, guêpe, amiante, plantes)","poids":30.0,"owner":"Julie","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"nb","taux":100,"taux_land":100},{"id":"3.1.4","parent":"3.1","title":"Faire nettoyer toutes les vitres","poids":20.0,"owner":"Julie","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":2.0,"val_cible":2.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"4.1.1","parent":"4.1","title":"Planifier les revues menusuelles de marge","poids":20.0,"owner":"Fx","priorite":"","stop":false,"contributors":["Christelle","Claire","Tomek"],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"4.1.2","parent":"4.1","title":"Réaliser les revues de marge par canal","poids":30.0,"owner":"Fx","priorite":"","stop":false,"contributors":["Christelle","Claire","Tomek"],"val_depart":0.0,"val_actuel":5.0,"val_revise":9.0,"val_cible":9.0,"unite":"nb","taux":55.6,"taux_land":100},{"id":"4.1.3","parent":"4.1","title":"Etablir les indicateurs de marge mensuelles","poids":20.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"4.1.4","parent":"4.1","title":"Mettre en place un nouveau rendu de reporting mensuel","poids":20.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":100,"taux_land":100},{"id":"4.1.5","parent":"4.1","title":"Mettrre en place une revue trimestrielle du budget","poids":10.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"4.2.1","parent":"4.2","title":"Faire un premier rendrez-vous avec BPI, La Nef et Credolending","poids":30.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"4.2.2","parent":"4.2","title":"Fixer nos objectifs de négociation avec chacun","poids":30.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"4.2.3","parent":"4.2","title":"Finaliser le report de nos échéances URSSAF","poids":30.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"4.2.4","parent":"4.2","title":"Définir le plan de paiement de WAF","poids":10.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"4.3.1","parent":"4.3","title":"Formaliser l'accord Ratchet avec le Board","poids":10.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"4.3.2","parent":"4.3","title":"Décaisser le compte de capital","poids":20.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"4.3.3","parent":"4.3","title":"Finaliser les ACC de Ponton & Co.","poids":10.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"4.3.4","parent":"4.3","title":"Sécuriser 300k€ supplémentaire dans la délégation","poids":40.0,"owner":"Tomek","priorite":"","stop":false,"contributors":["Fx"],"val_depart":0.0,"val_actuel":100.0,"val_revise":300.0,"val_cible":300.0,"unite":"€","taux":33.3,"taux_land":100},{"id":"4.3.5","parent":"4.3","title":"Partage en core team la vision du BP négo","poids":10.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"4.3.6","parent":"4.3","title":"Réaliser l'AGAOA 2025","poids":10.0,"owner":"Fx","priorite":"","stop":false,"contributors":["Tomek"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"5.1.1","parent":"5.1","title":"Faire le point sur les actions engagées en 2024 et 2025","poids":10.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"5.1.2","parent":"5.1","title":"Finaliser le plan d'action 2026 de régénération du Domaine","poids":30.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"5.1.3","parent":"5.1","title":"Partager le plan d'action 2026 de régénération du Domaine avec Elise et Christian","poids":20.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"5.1.4","parent":"5.1","title":"Engager les premières actions","poids":10.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"5.1.5","parent":"5.1","title":"Définir les process de suivi du plan d'action","poids":10.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"5.1.6","parent":"5.1","title":"Cueillir les calendulas et les faire sécher","poids":10.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"5.1.7","parent":"5.1","title":"Livrer les calendulas à Greentech ou être prêt","poids":10.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"5.2.1","parent":"5.2","title":"Finaliser le dossier d'agrément ESUS pour la FSDO","poids":50.0,"owner":"Fx","priorite":"STOP","stop":true,"contributors":["Fiona"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"5.2.2","parent":"5.2","title":"Faire l'AGO de la FSDO","poids":30.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"5.2.3","parent":"5.2","title":"Assainir les comptes courants de la FSDO","poids":20.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"5.3.1","parent":"5.3","title":"Définir le projet de vendanges","poids":40.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"5.3.2","parent":"5.3","title":"Gérer avec Christian l'organisation","poids":60.0,"owner":"Fx","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"6.1.1","parent":"6.1","title":"Déploiement plan vin 2026 : RDV national avec achats & direction commerciale","poids":20.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek"],"val_depart":0.0,"val_actuel":50.0,"val_revise":100.0,"val_cible":100.0,"unite":"%","taux":50.0,"taux_land":100},{"id":"6.1.2","parent":"6.1","title":"Finalisation VVF et relance Logis Hôtel, Dupont Restauration, Pro Achat prospection Belambra, Vacances bleues, Moma group, Babel Communauty, Trinity, Radisson Hôtels","poids":20.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":3.0,"val_revise":10.0,"val_cible":10.0,"unite":"nb","taux":30.0,"taux_land":100},{"id":"6.1.3","parent":"6.1","title":"RDV ciblés sur 3 succursales clés : IDF, Bretagne, AURA","poids":15.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Maxime"],"val_depart":0.0,"val_actuel":1.0,"val_revise":3.0,"val_cible":3.0,"unite":"nb","taux":33.3,"taux_land":100},{"id":"6.1.4","parent":"6.1","title":"Activer force de vente Episaveurs avec supports audio/vidéo","poids":15.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek","Guillemette"],"val_depart":0.0,"val_actuel":60.0,"val_revise":100.0,"val_cible":100.0,"unite":"%","taux":60.0,"taux_land":100},{"id":"6.1.5","parent":"6.1","title":"Pousser référencements & upsales : vin, sodas, minis, champagne, BIB","poids":15.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":60.0,"val_revise":100.0,"val_cible":100.0,"unite":"%","taux":60.0,"taux_land":100},{"id":"6.1.6","parent":"6.1","title":"Suivi test consigne Rhône-Alpes","poids":15.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek"],"val_depart":0.0,"val_actuel":0.1,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":10.0,"taux_land":100},{"id":"6.2.1","parent":"6.2","title":"Débloquer à minima un GC avec récurrence de volumes (CP, Intercontinental)","poids":40.0,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"nb","taux":100,"taux_land":100},{"id":"6.2.2","parent":"6.2","title":"Renouveler promotion nationale S2 2026 via EAZLE","poids":30.0,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"nb","taux":0,"taux_land":100},{"id":"6.2.3","parent":"6.2","title":"ACCOR: établir le plan promotionnel annuel avec 2 promotions pour l'année","poids":30.0,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":2.0,"val_cible":2.0,"unite":"nb","taux":50.0,"taux_land":100},{"id":"6.2.4","parent":"6.2","title":"ACCOR: obtenir 3 nouveaux établissements ACCOR direct ou indirect","poids":0.0,"owner":"Claire","priorite":"","stop":false,"contributors":["Maxime"],"val_depart":0.0,"val_actuel":3.0,"val_revise":3.0,"val_cible":3.0,"unite":"nb","taux":100,"taux_land":100},{"id":"6.2.5","parent":"6.2","title":"ACCOR: avoir pris contact avec tous les clients existants directs et indirects","poids":0.0,"owner":"Maxime","priorite":"","stop":false,"contributors":["Claire"],"val_depart":4.0,"val_actuel":14.0,"val_revise":31.0,"val_cible":31.0,"unite":"nb","taux":37.0,"taux_land":100},{"id":"6.3.1","parent":"6.3","title":"RDV S2 2026 : DG Grands Comptes & CHR","poids":25.0,"owner":"Tomek","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"nb","taux":0,"taux_land":100},{"id":"6.3.2","parent":"6.3","title":"RDV GC prioritaires : Groupe Bertrand, Sodexo, Areas, Elior","poids":25.0,"owner":"Tomek","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":2.0,"val_revise":4.0,"val_cible":4.0,"unite":"nb","taux":50.0,"taux_land":100},{"id":"6.3.3","parent":"6.3","title":"Référencements & upsales : sodas nationaux et catalogue promo vins","poids":25.0,"owner":"Tomek","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":2.0,"val_cible":2.0,"unite":"nb","taux":50.0,"taux_land":100},{"id":"6.3.4","parent":"6.3","title":"RDV responsable réseau Inter Caves","poids":25.0,"owner":"Tomek","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"nb","taux":0,"taux_land":100},{"id":"6.4.1","parent":"6.4","title":"Maintenir relation LPQ Belgique et s'informer des ouvertures","poids":100.0,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.3,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":30.0,"taux_land":100},{"id":"6.4.2","parent":"6.4","title":"Organiser une session photoshoot dans un établissement LPQ","poids":0.0,"owner":"Claire","priorite":"P3","stop":false,"contributors":["Guillemette"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"6.5.1","parent":"6.5","title":"Finaliser les discussions avec Horeca","poids":30.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.8,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"6.5.2","parent":"6.5","title":"Closer Flunch","poids":70.0,"owner":"Tomek","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.3,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"6.6.1","parent":"6.6","title":"RDV S2 2026 : Azade, Milliet, Native, Barnum, Mes Boissons, Murgier","poids":25.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Claire","Tomek","Maxime"],"val_depart":0.0,"val_actuel":1.0,"val_revise":6.0,"val_cible":6.0,"unite":"nb","taux":16.7,"taux_land":100},{"id":"6.6.2","parent":"6.6","title":"Maintenir référencements & gammes stratégiques","poids":25.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Claire","Tomek","Maxime"],"val_depart":0.0,"val_actuel":30.0,"val_revise":100.0,"val_cible":100.0,"unite":"%","taux":30.0,"taux_land":100},{"id":"6.6.3","parent":"6.6","title":"Recréer lien terrain : 1 tournée par distributeur","poids":15.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Claire","Tomek","Maxime"],"val_depart":0.0,"val_actuel":2.0,"val_revise":6.0,"val_cible":6.0,"unite":"nb","taux":33.3,"taux_land":100},{"id":"6.6.4","parent":"6.6","title":"Convertir 40 prospects finaux à fort volume","poids":35.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Claire","Tomek","Maxime"],"val_depart":0.0,"val_actuel":3.0,"val_revise":40.0,"val_cible":40.0,"unite":"nb","taux":7.5,"taux_land":100},{"id":"6.7.1","parent":"6.7","title":"Fidéliser 3 top clients existants et étendre vin/sodas/champagne (Continental Marseille, Lyon)","poids":70.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Claire","Tomek","Maxime"],"val_depart":0.0,"val_actuel":2.0,"val_revise":3.0,"val_cible":3.0,"unite":"nb","taux":66.7,"taux_land":100},{"id":"6.7.2","parent":"6.7","title":"Convertir 5 prospects CHR à fort potentiel + 3 premium champagne","poids":30.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Claire","Tomek","Maxime"],"val_depart":0.0,"val_actuel":3.0,"val_revise":5.0,"val_cible":5.0,"unite":"nb","taux":60.0,"taux_land":100},{"id":"6.8.1","parent":"6.8","title":"Métro : RDV construction S2 2026","poids":60.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"nb","taux":0,"taux_land":100},{"id":"6.8.2","parent":"6.8","title":"Déployer top 15 magasins et initier test réemploi","poids":40.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Maxime"],"val_depart":0.0,"val_actuel":0.0,"val_revise":15.0,"val_cible":15.0,"unite":"nb","taux":0,"taux_land":100},{"id":"7.1.1","parent":"7.1","title":"Finaliser projet Carrefour Restart","poids":25.0,"owner":"Tomek","priorite":"","stop":false,"contributors":["Fx"],"val_depart":0.0,"val_actuel":0.7,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":70.0,"taux_land":100},{"id":"7.1.2","parent":"7.1","title":"Déploiement : +30 magasins","poids":25.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":30.0,"val_cible":30.0,"unite":"nb","taux":0,"taux_land":100},{"id":"7.1.3","parent":"7.1","title":"RDV par gamme Vin & Essence","poids":25.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":2.0,"val_revise":2.0,"val_cible":2.0,"unite":"nb","taux":100,"taux_land":100},{"id":"7.1.4","parent":"7.1","title":"Animations Q2 : 30 magasins Reuse/Loop","poids":25.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":30.0,"val_revise":30.0,"val_cible":30.0,"unite":"nb","taux":100,"taux_land":100},{"id":"7.2.1","parent":"7.2","title":"Déploiement : +30 ITM, +5 U, +5 Monoprix (12 références)","poids":25.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":24.0,"val_revise":40.0,"val_cible":40.0,"unite":"nb","taux":60.0,"taux_land":100},{"id":"7.2.2","parent":"7.2","title":"Salons et gestion post salon commandes : ITM Ouest & Centre Est","poids":25.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":2.0,"val_revise":2.0,"val_cible":2.0,"unite":"nb","taux":100,"taux_land":100},{"id":"7.2.3","parent":"7.2","title":"RDV de référencement enseignes : U Ouest/IDF, Monoprix","poids":25.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":2.0,"val_revise":3.0,"val_cible":3.0,"unite":"nb","taux":66.7,"taux_land":100},{"id":"7.2.4","parent":"7.2","title":"Animations Q2 : 40 magasins Reuse/LCPR + zones réemploi","poids":15.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":40.0,"val_revise":40.0,"val_cible":40.0,"unite":"nb","taux":100,"taux_land":100},{"id":"7.2.5","parent":"7.2","title":"Promotions : construction plan promo S2 2026 Monoprix et ITM Centre Est","poids":10.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":2.0,"val_cible":2.0,"unite":"nb","taux":0,"taux_land":100},{"id":"7.3.1","parent":"7.3","title":"déploiement : +3 magasins VIP Leclerc","poids":35.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":3.0,"val_cible":3.0,"unite":"nb","taux":33.3,"taux_land":100},{"id":"7.3.2","parent":"7.3","title":"RDV Franprix : bilan canette vins","poids":35.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"nb","taux":100,"taux_land":100},{"id":"7.3.3","parent":"7.3","title":"Animations Q2 : 3 VIP Leclerc","poids":30.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":3.0,"val_cible":3.0,"unite":"nb","taux":33.3,"taux_land":100},{"id":"7.4.1","parent":"7.4","title":"Réussite temps forts : apéro, Coupe du Monde","poids":100.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":60.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":100,"taux_land":100},{"id":"7.5.1","parent":"7.5","title":"Pilotage Reuse et influence IDF, Centre Est","poids":40.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.7,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":70.0,"taux_land":100},{"id":"7.5.2","parent":"7.5","title":"Partenaires clés : Loop, GO Réemploi!, Petrel, Revera, Leko, Citéo","poids":30.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.6,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":60.0,"taux_land":100},{"id":"7.5.3","parent":"7.5","title":"Salon Reuse Exconomy Expo","poids":30.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"nb","taux":100,"taux_land":100},{"id":"7.6.1","parent":"7.6","title":"Naturalia : finaliser référencement vins/sodas + 10 animations","poids":40.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.9,"val_revise":100.0,"val_cible":100.0,"unite":"%","taux":0.9,"taux_land":100},{"id":"7.6.2","parent":"7.6","title":"La Vie Claire : poursuivre discussions vins","poids":30.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.4,"val_revise":1.0,"val_cible":1.0,"unite":"nb","taux":40.0,"taux_land":100},{"id":"7.6.3","parent":"7.6","title":"Grand Frais : transformer RDV sodas en référencement","poids":30.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.4,"val_revise":1.0,"val_cible":1.0,"unite":"nb","taux":40.0,"taux_land":100},{"id":"7.7.1","parent":"7.7","title":"V&B : poursuivre échanges","poids":50.0,"owner":"Tomek","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.8,"val_revise":1.0,"val_cible":1.0,"unite":"nb","taux":80.0,"taux_land":100},{"id":"7.7.2","parent":"7.7","title":"Nicolas : obtenir référencement soft vin test","poids":50.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.4,"val_revise":1.0,"val_cible":1.0,"unite":"nb","taux":40.0,"taux_land":100},{"id":"7.8.1","parent":"7.8","title":"Lidl : poursuivre échanges","poids":100.0,"owner":"Tomek","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.3,"val_revise":1.0,"val_cible":1.0,"unite":"nb","taux":30.0,"taux_land":100},{"id":"7.9.1","parent":"7.9","title":"Le Petit Ballon : closer box découverte réemploi","poids":70.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.4,"val_revise":1.0,"val_cible":1.0,"unite":"nb","taux":40.0,"taux_land":100},{"id":"7.9.2","parent":"7.9","title":"La Fourche : optimiser destockage","poids":20.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":100,"taux_land":100},{"id":"7.9.3","parent":"7.9","title":"Proposition Nous anti-gaspi : relancer opportunités","poids":10.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":100,"taux_land":100},{"id":"8.1.1","parent":"8.1","title":"Pousser l'activité Essences à 10% de notre activité sur le Q2 (vs 2% sur Q1)","poids":40.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek","Claire","Maxime"],"val_depart":0.0,"val_actuel":0.5,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":50.0,"taux_land":100},{"id":"8.1.2","parent":"8.1","title":"Caler et animer les réunions de suivi top cibles, point mensuel CA et trimestriel budget CA","poids":30.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek","Claire"],"val_depart":0.0,"val_actuel":0.6,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":60.0,"taux_land":100},{"id":"8.1.3","parent":"8.1","title":"Piloter l'évolution du CA et marge par canal/top cibles pour se rapprocher de l'équilibre","poids":30.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek","Claire","Fx"],"val_depart":0.0,"val_actuel":0.4,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":40.0,"taux_land":100},{"id":"8.2.1","parent":"8.2","title":"Rencontrer plusieurs partenaires potentiels et autres fournisseurs ayant déjà éprouvé des modèles terrains","poids":50.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek"],"val_depart":0.0,"val_actuel":0.2,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":20.0,"taux_land":100},{"id":"8.2.2","parent":"8.2","title":"Recruter les alternants RFH sales Paris et Aura","poids":50.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek"],"val_depart":0.0,"val_actuel":0.6,"val_revise":2.0,"val_cible":2.0,"unite":"nb","taux":30.0,"taux_land":100},{"id":"8.3.1","parent":"8.3","title":"Caler les communications sales sur le Q2","poids":50.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek","Guillemette","Juliette"],"val_depart":0.0,"val_actuel":1.0,"val_revise":3.0,"val_cible":3.0,"unite":"nb","taux":33.3,"taux_land":100},{"id":"8.3.2","parent":"8.3","title":"Co-construire avec le marketing les besoins pour le S2 2026","poids":50.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek","Guillemette","Juliette"],"val_depart":0.0,"val_actuel":3.0,"val_revise":6.0,"val_cible":6.0,"unite":"nb","taux":50.0,"taux_land":100},{"id":"8.4.1","parent":"8.4","title":"Actualiser les présentations commerciales 2026","poids":25.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek","Guillemette","Juliette"],"val_depart":0.0,"val_actuel":0.5,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":50.0,"taux_land":100},{"id":"8.4.2","parent":"8.4","title":"Exploiter outils commerciaux (méthodes de ventes, scripts) et former équipes","poids":25.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek","Guillemette","Juliette"],"val_depart":0.0,"val_actuel":0.4,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":40.0,"taux_land":100},{"id":"8.4.3","parent":"8.4","title":"Argumentaire “Juste Rémunération”","poids":25.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek","Fx"],"val_depart":0.0,"val_actuel":0.6,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":60.0,"taux_land":100},{"id":"8.4.4","parent":"8.4","title":"Suivi test étiquettes GMS pour optimiser sell-out","poids":25.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek","Fiona"],"val_depart":0.0,"val_actuel":0.4,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":40.0,"taux_land":100},{"id":"8.5.1","parent":"8.5","title":"Finaliser les dahsboard de suivi interne mensuel avec la finance","poids":50.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek","Fx"],"val_depart":0.0,"val_actuel":0.5,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":50.0,"taux_land":100},{"id":"8.5.2","parent":"8.5","title":"Améliorer le suivi des tâches et des transactions Hubspot","poids":50.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek","Claire","Maxime"],"val_depart":0.0,"val_actuel":0.5,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":50.0,"taux_land":100},{"id":"8.6.1","parent":"8.6","title":"Caler les routines avec la finance, prev, supply et le marketing pour anticiper les besoins","poids":50.0,"owner":"Christelle","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":100,"taux_land":100},{"id":"8.6.2","parent":"8.6","title":"Améliorer les prévisions sales France","poids":50.0,"owner":"Christelle","priorite":"","stop":false,"contributors":["Tomek","Claire"],"val_depart":0.0,"val_actuel":0.5,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":50.0,"taux_land":100},{"id":"9.1.1","parent":"9.1","title":"3 Newsletter ciblés B2B et 1 Newsletter Export","poids":30.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":3.0,"val_revise":4.0,"val_cible":4.0,"unite":"nb","taux":75.0,"taux_land":100},{"id":"9.1.2","parent":"9.1","title":"Assurer la visibilité LinkedIn : 12 publications (dont 1 post / mois avec un partenaire)","poids":30.0,"owner":"Juliette","priorite":"","stop":false,"contributors":["Guillemette"],"val_depart":0.0,"val_actuel":19.0,"val_revise":12.0,"val_cible":12.0,"unite":"nb","taux":100,"taux_land":100},{"id":"9.1.3","parent":"9.1","title":"Mettre à jour les présentations commerciales","poids":20.0,"owner":"Juliette","priorite":"","stop":false,"contributors":["Juliette","Guillemette"],"val_depart":0.0,"val_actuel":0.8,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":80.0,"taux_land":100},{"id":"9.1.4","parent":"9.1","title":"Créer 3 types de PLV efficaces : restaurateurs, traiteurs et GMS","poids":20.0,"owner":"Juliette","priorite":"","stop":false,"contributors":["Juliette"],"val_depart":0.0,"val_actuel":0.0,"val_revise":3.0,"val_cible":3.0,"unite":"nb","taux":0,"taux_land":100},{"id":"9.2.1","parent":"9.2","title":"Réserver le stand, m2 et emplacement dans le salon avec les vignerons engagés","poids":100.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"9.3.1","parent":"9.3","title":"Construire le plan de communication du Vin de Lyon et mettre en place de l’opérationnel","poids":40.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":["Juliette"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":0,"taux_land":100},{"id":"9.3.2","parent":"9.3","title":"Adapter les PLV aux nouvelles étiquettes GMS si lancement validé","poids":60.0,"owner":"Juliette","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":0,"taux_land":100},{"id":"9.4.1","parent":"9.4","title":"Créer le calendrier éditorial Printemps / Été","poids":15.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.9,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":90.0,"taux_land":100},{"id":"9.4.2","parent":"9.4","title":"Préparer les lancements (Suite Oé, Bureaux du coeur)","poids":5.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":["Juliette"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":0,"taux_land":100},{"id":"9.4.3","parent":"9.4","title":"Rédiger et publier 3 articles de blog","poids":10.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":["Guillemette"],"val_depart":0.0,"val_actuel":1.0,"val_revise":3.0,"val_cible":3.0,"unite":"nb","taux":33.3,"taux_land":100},{"id":"9.4.4","parent":"9.4","title":"Publier 6 vidéos partenaires Printemps / Été","poids":20.0,"owner":"Juliette","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":2.0,"val_revise":6.0,"val_cible":6.0,"unite":"nb","taux":33.3,"taux_land":100},{"id":"9.4.5","parent":"9.4","title":"Publier 12 post IG, 12 post LK, 3 NL btoc","poids":20.0,"owner":"Juliette","priorite":"","stop":false,"contributors":["Guillemette"],"val_depart":0.0,"val_actuel":31.0,"val_revise":27.0,"val_cible":27.0,"unite":"nb","taux":100,"taux_land":100},{"id":"9.4.6","parent":"9.4","title":"Faire un sprint “réels d’essai” : créer et publier 25 réels d'essai, évaluer les statistiques et stuatuer","poids":5.0,"owner":"Juliette","priorite":"","stop":false,"contributors":["Guillemette"],"val_depart":0.0,"val_actuel":100.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":100,"taux_land":100},{"id":"9.4.7","parent":"9.4","title":"Dynamiser la relation avec nos collaborateurs export (1 / saison) grâce à la création d’un dossier de presse et d’échanges de mails","poids":10.0,"owner":"Juliette","priorite":"","stop":false,"contributors":["Guillemette"],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"9.4.8","parent":"9.4","title":"Mettre à jour les signatures mails et l'animation du site 1 fois par mois","poids":5.0,"owner":"Juliette","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":2.0,"val_revise":3.0,"val_cible":3.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"9.4.9","parent":"9.4","title":"Créer 2 outils de reporting pour les KPIs (Newsletters et Réseaux Sociaux) & suivi budget","poids":10.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.3,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":30.0,"taux_land":100},{"id":"9.5.1","parent":"9.5","title":"Faire un diagnostic et un audit du site via IA","poids":15.0,"owner":"Juliette","priorite":"","stop":false,"contributors":["Guillemette"],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":100,"taux_land":100},{"id":"9.5.2","parent":"9.5","title":"Repenser la structure selon les reco de l’IA et de l’équipe marketing","poids":60.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":["Juliette"],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":100,"taux_land":100},{"id":"9.5.3","parent":"9.5","title":"Mettre en place les actions sur le site internet","poids":20.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":["Juliette"],"val_depart":0.0,"val_actuel":0.8,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":80.0,"taux_land":100},{"id":"9.5.4","parent":"9.5","title":"Création de nouveaux visuels","poids":5.0,"owner":"Juliette","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"nb","taux":100,"taux_land":100},{"id":"9.6.1","parent":"9.6","title":"Réaliser l’inventaire complet des supports de communication et marketing Oé","poids":100.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":["Julie"],"val_depart":0.0,"val_actuel":0.5,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":50.0,"taux_land":100},{"id":"10.1.1","parent":"10.1","title":"Tester la pertinence avant de lancer avec mail de préinscription","poids":20.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":["Juliette"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"10.1.2","parent":"10.1","title":"Challenger le squelette et l’enrichir","poids":20.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":["Juliette","Tomek"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":0,"taux_land":100},{"id":"10.1.3","parent":"10.1","title":"Créer du contenu et une section ressources (films, podcasts, livres)","poids":30.0,"owner":"Juliette","priorite":"","stop":false,"contributors":["Guillemette"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":0,"taux_land":100},{"id":"10.1.4","parent":"10.1","title":"Créer et mettre en ligne le module de formation (MOOC) pour les B2B et le \"Niveau 1\" de la communauté (vidéos par Ecofarms, partenaires, équipes & more)","poids":30.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":["Juliette"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":0,"taux_land":100},{"id":"10.2.1","parent":"10.2","title":"Intégrer la communauté dans toutes les communications avec pour objectif de recruter","poids":40.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":["Tomek"],"val_depart":0.0,"val_actuel":0.5,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":50.0,"taux_land":100},{"id":"10.2.2","parent":"10.2","title":"Lancer le système de parrainage pour accélérer l'acquisition et le business","poids":40.0,"owner":"Juliette","priorite":"","stop":false,"contributors":["Guillemette","Tomek"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":0,"taux_land":100},{"id":"10.2.3","parent":"10.2","title":"Concevoir et organiser 1 rencontre Oé à Paris réunissant la communauté (événement Matisse)","poids":10.0,"owner":"Juliette","priorite":"","stop":false,"contributors":["Guillemette","Tomek"],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"10.2.4","parent":"10.2","title":"Concevoir et organiser 1 rencontre Oé à Lyon réunissant la communauté (soirée d'équipe)","poids":10.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":["Juliette","Tomek"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"10.3.1","parent":"10.3","title":"Publier 3 posts IG et 6 stories, 3 post Linkedin et 1 NL","poids":80.0,"owner":"Juliette","priorite":"","stop":false,"contributors":["Guillemette"],"val_depart":0.0,"val_actuel":3.0,"val_revise":13.0,"val_cible":13.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"10.3.2","parent":"10.3","title":"Tenir la cadence avec la communauté : 1 relance/semaine","poids":20.0,"owner":"Guillemette","priorite":"P2","stop":false,"contributors":["Guillemette","Tomek"],"val_depart":0.0,"val_actuel":5.0,"val_revise":12.0,"val_cible":12.0,"unite":"nb","taux":41.7,"taux_land":100},{"id":"10.4.1","parent":"10.4","title":"Faire un atelier brainstorming d’équipe et chaque personne sort 5 entreprises","poids":20.0,"owner":"Juliette","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"10.4.2","parent":"10.4","title":"Contacter par mail 50 prospects identifiés par l’équipe et les rediriger vers un commercial pour suivi","poids":50.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":["Juliette"],"val_depart":0.0,"val_actuel":0.3,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":30.0,"taux_land":100},{"id":"10.4.3","parent":"10.4","title":"Créer un outil de suivis des commandes et relances commerciales","poids":30.0,"owner":"Guillemette","priorite":"","stop":false,"contributors":["Juliette"],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":100,"taux_land":100},{"id":"11.1.1","parent":"11.1","title":"Maintien des listings avec Savannah (GA) et planification d’une nouvelle commande de 3K€ minimum","poids":25.0,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":3000.0,"val_cible":3000.0,"unite":"€","taux":0,"taux_land":100},{"id":"11.1.2","parent":"11.1","title":"Anticiper la suite avec Communal Brands: avoir pris contact avec un embouteilleur loca","poids":25.0,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":90.0,"val_cible":90.0,"unite":"nb","taux":0,"taux_land":100},{"id":"11.1.3","parent":"11.1","title":"Mise en place d'un “challenge commercial” avec les équipes de Communal","poids":25.0,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":4.0,"val_revise":5.0,"val_cible":5.0,"unite":"nb","taux":80.0,"taux_land":100},{"id":"11.1.4","parent":"11.1","title":"Obtenir un échange avec un acheteur de Total Wines","poids":25.0,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":4000.0,"val_cible":4000.0,"unite":"€","taux":0,"taux_land":100},{"id":"11.2.1","parent":"11.2","title":"Analyser la période d'essai avec notre distributeur","poids":33.3,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":5.0,"val_cible":5.0,"unite":"nb","taux":0,"taux_land":100},{"id":"11.2.2","parent":"11.2","title":"Convenir d’une visite marché pour cette saison ou la saison prochaine","poids":33.3,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1000.0,"val_cible":1000.0,"unite":"€","taux":0,"taux_land":100},{"id":"11.2.3","parent":"11.2","title":"S’assurer d’avoir pris contact et mis en lien tous nos clients Allemand existants avec CSM ( La Belle France, Foodhub, Korks, Frachtgold, Tishdame, Weinpiraten)","poids":33.3,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":2.0,"val_cible":2.0,"unite":"nb","taux":0,"taux_land":100},{"id":"11.3.1","parent":"11.3","title":"Suivi des ventes et de la distribution avec CLF - avoir obtenu a minima une nouvelle commande d’ici la fin de la saison","poids":50.0,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":100.0,"taux_land":100.0},{"id":"11.3.2","parent":"11.3","title":"Définir le plan promotionnel de l’année avec CLF","poids":50.0,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"11.4.1","parent":"11.4","title":"Ouverture de 3 nouveaux clients directs ou indirects pour un total CA minimum de 1500€","poids":20.0,"owner":"Louis","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":3.0,"val_cible":3.0,"unite":"nb","taux":0,"taux_land":100},{"id":"11.4.2","parent":"11.4","title":"25 appels de prospection par semaine","poids":20.0,"owner":"Louis","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":93.0,"val_revise":325.0,"val_cible":325.0,"unite":"nb","taux":28.6,"taux_land":100},{"id":"11.4.3","parent":"11.4","title":"Obtenir 3 vidéos meetings de présentation de la marque auprès d'acheteurs","poids":20.0,"owner":"Louis","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":3.0,"val_cible":3.0,"unite":"nb","taux":33.3,"taux_land":100},{"id":"11.4.4","parent":"11.4","title":"Générer 4 dégustations avec envoi d’échantillons auprès de prospects","poids":20.0,"owner":"Louis","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":4.0,"val_cible":4.0,"unite":"nb","taux":25.0,"taux_land":100},{"id":"11.4.5","parent":"11.4","title":"Obtention d’un premier client NL avec une commande supérieure à 500€","poids":20.0,"owner":"Louis","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":500.0,"val_cible":500.0,"unite":"€","taux":0,"taux_land":100},{"id":"11.5.1","parent":"11.5","title":"Avoir recontacté tous les leads CHR générés par les précédentes campagnes (9) pour identifier si intérêt de dégustation","poids":50.0,"owner":"Louis","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":7.0,"val_revise":9.0,"val_cible":9.0,"unite":"nb","taux":77.8,"taux_land":100},{"id":"11.5.2","parent":"11.5","title":"Confirmer l’intérêt de Local Spirits et sinon trouver un distributeur CHR alternatif","poids":50.0,"owner":"Claire","priorite":"","stop":false,"contributors":["Louis"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":0,"taux_land":100},{"id":"11.6.1","parent":"11.6","title":"Automatiser avec l'aide de l'IA tous les fichiers d'appels d'offre afin de gagner en efficacité","poids":50.0,"owner":"Claire","priorite":"","stop":false,"contributors":["Louis","Fx"],"val_depart":0.0,"val_actuel":0.5,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":50.0,"taux_land":100},{"id":"11.6.2","parent":"11.6","title":"Trouver une alternative pour un nouvel importateur / agent pour la Suède et le Canada (LCBO) 0/2","poids":50.0,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":2.0,"val_cible":2.0,"unite":"nb","taux":50.0,"taux_land":100},{"id":"11.7.1","parent":"11.7","title":"Plan export 2026/2027 rédigé dans Notion","poids":33.3,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.4,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":40.0,"taux_land":100},{"id":"11.7.2","parent":"11.7","title":"Avoir réatribués les comptes clients à l'équipe avant fin Juin","poids":33.3,"owner":"Claire","priorite":"","stop":false,"contributors":["Tomek","Christelle"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":0,"taux_land":100},{"id":"11.7.3","parent":"11.7","title":"Trouver le/la personne qui pourra assurer le back-up durant mon absence","poids":33.3,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"11.8.1","parent":"11.8","title":"Obtention de 2 nouvelles commandes via les clients Monarq objectif 6K€","poids":50.0,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":2700.0,"val_revise":6000.0,"val_cible":6000.0,"unite":"€","taux":45.0,"taux_land":100},{"id":"11.8.2","parent":"11.8","title":"S’assurer la dégustation de nos vins par les acheteurs de Carrefour durant le APAS show","poids":50.0,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":0.2,"val_revise":1.0,"val_cible":1.0,"unite":"%","taux":20.0,"taux_land":100},{"id":"11.9.1","parent":"11.9","title":"Engendrer un échange en visio avec CRF et Delhaize en vue d’un référencement","poids":33.3,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":1.0,"val_revise":2.0,"val_cible":2.0,"unite":"nb","taux":50.0,"taux_land":100},{"id":"11.9.2","parent":"11.9","title":"Suivi des leads générés par la campagne growth ( Le temps des Cerises, Epicerie Cabane)","poids":33.3,"owner":"Claire","priorite":"","stop":false,"contributors":[],"val_depart":0.0,"val_actuel":2.0,"val_revise":2.0,"val_cible":2.0,"unite":"nb","taux":100,"taux_land":100},{"id":"11.9.3","parent":"11.9","title":"S’assurer d’avoir mis en lien tous nos clients Benelux avec Foodprint (Traiteur Michel, Le BonWagon)","poids":33.3,"owner":"Claire","priorite":"","stop":false,"contributors":["Louis"],"val_depart":1.0,"val_actuel":2.0,"val_revise":2.0,"val_cible":2.0,"unite":"nb","taux":100,"taux_land":100},{"id":"11.10.1","parent":"11.10","title":"Confirmer notre présence au salon CHR de septembre avec Brukett","poids":50.0,"owner":"Claire","priorite":"","stop":false,"contributors":["Tomek"],"val_depart":0.0,"val_actuel":0.0,"val_revise":1.0,"val_cible":1.0,"unite":"oui/non","taux":0.0,"taux_land":100.0},{"id":"11.10.2","parent":"11.10","title":"Avancer sur le projet des Essences avec validation de la dégustation et chiffrage","poids":50.0,"owner":"Claire","priorite":"","stop":false,"contributors":["Fx"],"val_depart":0.0,"val_actuel":0.0,"val_revise":100.0,"val_cible":100.0,"unite":"%","taux":0,"taux_land":100}],"people":["Christelle","Claire","Fiona","Fx","Guillemette","Julie","Juliette","Louis","Maxime","Tomek"]};

const SEASONS=[
  {key:"printemps_2026",label:"Printemps ☘️ 2026",start:"2026-04-01",end:"2026-06-30"},
  {key:"ete_2026",      label:"Été ☀️ 2026",      start:"2026-07-01",end:"2026-09-30"},
  {key:"automne_2026",  label:"Automne 🍂 2026",  start:"2026-10-01",end:"2026-12-31"},
  {key:"hiver_2027",    label:"Hiver ❄️ 2027",    start:"2027-01-01",end:"2027-03-31"},
  {key:"printemps_2027",label:"Printemps 🌸 2027",start:"2027-04-01",end:"2027-06-30"},
  {key:"ete_2027",      label:"Été 🌞 2027",      start:"2027-07-01",end:"2027-09-30"},
  {key:"automne_2027",  label:"Automne 🍁 2027",  start:"2027-10-01",end:"2027-12-31"},
];

const ADMIN_PWD="Okr-FxH-1971";
const OBJ_BG=["#dbeafe","#dcfce7","#fce7f3","#fef3c7","#ede9fe","#ffedd5","#e0f2fe","#f0fdf4","#fdf4ff","#fff7ed","#ecfdf5"];
const OBJ_TX=["#1e40af","#166534","#9d174d","#92400e","#5b21b6","#9a3412","#075985","#14532d","#701a75","#7c2d12","#064e3b"];
const P_BG=["#dbeafe","#dcfce7","#fce7f3","#fef3c7","#ede9fe","#ffedd5","#e0f2fe","#f0fdf4","#fdf4ff","#fff7ed","#ecfdf5","#e0f2fe"];
const P_TX=["#1e40af","#166534","#9d174d","#92400e","#5b21b6","#9a3412","#075985","#14532d","#701a75","#7c2d12","#064e3b","#075985"];
const INITIALS_MAP={Christelle:"Ch",Claire:"Cl",Fiona:"Fi",Fx:"Fx",Guillemette:"Gu",Julie:"Ju",Juliette:"Jt",Louis:"Lo",Maxime:"Ma",Tomek:"To"};

function ini(name){return INITIALS_MAP[name]||(name||"?").slice(0,2).toUpperCase()}
function pBg(name,people){const i=people.indexOf(name)%12;return P_BG[i<0?0:i]}
function pTx(name,people){const i=people.indexOf(name)%12;return P_TX[i<0?0:i]}
function progColor(v){return v>=80?"#2d6a4f":v>=50?"#b5680f":"#c0392b"}
function rnd(v){return Math.round(v*10)/10}

function getSeasonInfo(key){return SEASONS.find(s=>s.key===key)||SEASONS[0]}
function getSeasonProgress(key){
  const s=getSeasonInfo(key);
  const start=new Date(s.start),end=new Date(s.end),now=new Date();
  if(now<=start)return 0;
  if(now>=end)return 100;
  return Math.round((now-start)/(end-start)*100);
}
function makeFreshSeason(people){
  return {objectives:[],subobjectives:[],keyresults:[],people:[...people]};
}

function calcSobj(sobjId,krs){
  const a=krs.filter(k=>k.parent===sobjId&&k.poids>0);
  const tw=a.reduce((s,k)=>s+k.poids,0);
  if(!tw)return 0;
  return a.reduce((s,k)=>s+k.taux*k.poids,0)/tw;
}
function calcObj(objId,sobjs,krs){
  const ss=sobjs.filter(s=>s.parent===objId);
  const tw=ss.reduce((s,o)=>s+o.poids,0);
  if(!tw)return 0;
  return ss.reduce((s,o)=>s+calcSobj(o.id,krs)*o.poids,0)/tw;
}
function calcWeightedAvg(objectives,sobjs,krs){
  const totalETP=objectives.reduce((s,o)=>s+(o.etp||0),0);
  if(!totalETP)return 0;
  return objectives.reduce((s,o)=>s+calcObj(o.id,sobjs,krs)*(o.etp||0),0)/totalETP;
}
function calcTaux(dep,act,cib,u){
  if(u==="oui/non")return act>=1?100:0;
  const sp=cib-dep;
  if(!sp)return act>=cib?100:0;
  return Math.max(0,Math.min(100,(act-dep)/sp*100));
}

// Display value — % shown as integer percent
function fmtV(v,u){
  if(u==="oui/non")return v>=1?"ok":"0";
  if(u==="€")return v>=1000?(v/1000).toFixed(1)+"k€":v+"€";
  if(u==="%"){
    // stored as 0-100 range or 0-1 range — normalise to display as integer %
    if(v<=1&&v>0)return Math.round(v*100)+"%";
    return Math.round(v)+"%";
  }
  return v%1===0?String(v):v.toFixed(1);
}
// Raw value for editing — % fields shown as integer (e.g. 70 not 0.7)
function toEditVal(v,u){
  if(u==="%"){if(v<=1&&v>0)return Math.round(v*100);return Math.round(v);}
  return v;
}
// Convert edited value back to stored format
function fromEditVal(v,u){
  const n=parseFloat(v)||0;
  if(u==="%"){return n;}  // store as 0-100
  return n;
}

function Avatar({name,people,size=22}){
  const bg=pBg(name,people),tx=pTx(name,people);
  return <div title={name} style={{width:size,height:size,borderRadius:"50%",background:bg,color:tx,
    display:"inline-flex",alignItems:"center",justifyContent:"center",
    fontSize:size<20?7:8,fontWeight:600,flexShrink:0,border:"1.5px solid white"}}>{ini(name)}</div>;
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

function Modal({title,children,onClose,onSave,onDelete,saveLabel="Enregistrer"}){
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:"#fff",borderRadius:12,padding:24,width:"90%",maxWidth:540,maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box"}}>
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

function ObjModal({obj,isNew,people,onClose,onSave,onDelete,onLock,onUnlockRequest}){
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
      <span style={{fontSize:12,color:"#6b6560"}}>{locked?"Cet objectif est verrouillé. Seul l'admin peut déverrouiller.":"Verrouiller empêche toute modification (admin requis pour déverrouiller)."}</span>
      {locked
        ? <button onClick={onUnlockRequest} style={{fontSize:12,fontWeight:500,background:"#fef3c7",color:"#92400e",border:"1px solid #f59e0b",padding:"5px 12px",borderRadius:6,cursor:"pointer"}}>🔓 Déverrouiller</button>
        : <button onClick={onLock} style={{fontSize:12,fontWeight:500,background:"#f5f3ef",color:"#6b6560",border:"1px solid #e2ddd6",padding:"5px 12px",borderRadius:6,cursor:"pointer"}}>🔒 Verrouiller</button>}
    </div>}
  </Modal>;
}

function SobjModal({sobj,isNew,parentObjId,people,subobjectives,onClose,onSave,onDelete}){
  const [f,setF]=useState(sobj?{...sobj}:{title:"",owner:"",poids:0,priorite:"P1"});
  function upd(k,v){setF(p=>({...p,[k]:v}))}
  function save(){
    if(!f.title.trim())return;
    if(isNew){
      const siblings=subobjectives.filter(s=>s.parent===parentObjId);
      const totalW=siblings.reduce((s,x)=>s+x.poids,0);
      if(totalW>=100){alert(`La somme des poids des sous-objectifs atteint déjà ${Math.round(totalW)}%. Ajustez les poids existants avant d'en ajouter un nouveau.`);return;}
    }
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
  const [f,setF]=useState(kr?{...kr,
    _actuel: toEditVal(kr.val_actuel, kr.unite),
    _revise: kr.val_revise!==kr.val_cible ? toEditVal(kr.val_revise, kr.unite) : "",
  }:{title:"",owner:"",contributors:[],poids:0,unite:"%",val_depart:0,_actuel:0,_revise:"",val_cible:1,stop:false,priorite:""});
  function upd(k,v){setF(p=>({...p,[k]:v}))}
  function togC(p){setF(prev=>{const has=prev.contributors.includes(p);return{...prev,contributors:has?prev.contributors.filter(c=>c!==p):[...prev.contributors,p]}})}
  function save(){
    if(!f.title.trim())return;
    if(isNew){
      const siblings=keyresults.filter(k=>k.parent===sobjId);
      const totalW=siblings.reduce((s,x)=>s+x.poids,0)+(+f.poids);
      if(totalW>100){alert(`La somme des poids des KR dépasserait 100% (${Math.round(siblings.reduce((s,x)=>s+x.poids,0))}% + ${f.poids}% = ${Math.round(totalW)}%).`);return;}
    }
    const unite=f.unite;
    const dep=fromEditVal(f.val_depart, unite);
    const act=fromEditVal(f._actuel, unite);
    const cib=fromEditVal(f.val_cible, unite);
    const rev=f._revise===""?cib:fromEditVal(f._revise, unite);
    const taux=calcTaux(dep,act,cib,unite);
    const taux_land=calcTaux(dep,rev,cib,unite);
    onSave({...f,val_depart:dep,val_actuel:act,val_cible:cib,val_revise:rev,poids:+f.poids,taux:rnd(taux),taux_land:rnd(taux_land)});
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
      <input type="checkbox" checked={!!f.stop} onChange={e=>upd("stop",e.target.checked)} style={{accentColor:"#c0392b"}}/>Marquer STOP (KR abandonné)
    </label>
    {readonlyStruct&&<p style={{fontSize:11,color:"#b5680f",marginTop:8}}>⚠️ Objectif verrouillé — seules valeur actuelle, cible révisée et STOP sont modifiables.</p>}
    <p style={{fontSize:11,color:"#9e9890",fontStyle:"italic",marginTop:8}}>Avancement = (actuel − départ) ÷ (cible − départ) × 100</p>
  </Modal>;
}

function PeopleModal({people,objectives,subobjectives,keyresults,onClose,onSave}){
  const [list,setList]=useState([...people]);
  const [name,setName]=useState("");
  const [err,setErr]=useState("");
  function isUsed(p){
    if(objectives.some(o=>o.owner===p))return "propriétaire d'un objectif";
    if(subobjectives.some(s=>s.owner===p))return "propriétaire d'un sous-objectif";
    if(keyresults.some(k=>k.owner===p))return "propriétaire d'un KR";
    if(keyresults.some(k=>k.contributors.includes(p)))return "contributeur d'un KR";
    return null;
  }
  function add(){const n=name.trim();if(!n||list.includes(n))return;setList(p=>[...p,n]);setName("");setErr("")}
  function remove(p){
    const reason=isUsed(p);
    if(reason){setErr(`Impossible de supprimer ${p} : ${reason}.`);return;}
    setList(l=>l.filter(x=>x!==p));setErr("");
  }
  return <Modal title="Gérer les collaborateurs" onClose={onClose} onSave={()=>onSave(list)}>
    <p style={{fontSize:12,color:"#6b6560",marginBottom:14}}>La liste est rattachée à la saison active. Un collaborateur ne peut être supprimé que s'il n'est propriétaire ou contributeur d'aucun élément.</p>
    <div style={{display:"flex",gap:8,marginBottom:err?8:16}}>
      <input style={{...INP,flex:1}} value={name} onChange={e=>{setName(e.target.value);setErr("")}} placeholder="Prénom" onKeyDown={e=>e.key==="Enter"&&add()}/>
      <button onClick={add} style={{fontSize:13,fontWeight:500,background:"#2d6a4f",color:"#fff",padding:"7px 16px",borderRadius:6,border:"none",cursor:"pointer"}}>Ajouter</button>
    </div>
    {err&&<p style={{fontSize:12,color:"#c0392b",marginBottom:12}}>{err}</p>}
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {list.map(p=>{
        const used=isUsed(p);
        return <div key={p} style={{display:"flex",alignItems:"center",gap:6,background:"#f5f3ef",border:"1px solid #e2ddd6",borderRadius:20,padding:"4px 10px 4px 6px"}}>
          <div style={{width:24,height:24,borderRadius:"50%",background:pBg(p,list),color:pTx(p,list),display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:600}}>{ini(p)}</div>
          <span style={{fontSize:12}}>{p}</span>
          <button onClick={()=>remove(p)} title={used?`Utilisé comme ${used}`:"Supprimer"} style={{border:"none",background:"none",cursor:used?"not-allowed":"pointer",color:used?"#d1c9be":"#9e9890",fontSize:14,lineHeight:1,padding:0}}>×</button>
        </div>;
      })}
    </div>
  </Modal>;
}

function UnlockModal({objTitle,onClose,onUnlock}){
  const [pwd,setPwd]=useState("");
  const [err,setErr]=useState(false);
  function check(){if(pwd===ADMIN_PWD){onUnlock()}else{setErr(true);setPwd("")}}
  return <Modal title="Déverrouiller l'objectif" onClose={onClose} onSave={check} saveLabel="Déverrouiller">
    <p style={{fontSize:13,color:"#6b6560",marginBottom:4}}>Objectif : <strong>{objTitle}</strong></p>
    <p style={{fontSize:13,color:"#6b6560",marginBottom:16}}>Saisissez le mot de passe administrateur.</p>
    <Field label="Mot de passe">
      <input style={INP} type="password" value={pwd} onChange={e=>{setPwd(e.target.value);setErr(false)}} onKeyDown={e=>e.key==="Enter"&&check()} autoFocus/>
    </Field>
    {err&&<p style={{fontSize:12,color:"#c0392b",marginTop:-8}}>Mot de passe incorrect.</p>}
  </Modal>;
}

function SeasonBanner({seasonKey,avgProg,totalKR,doneKR}){
  const info=getSeasonInfo(seasonKey);
  const timeProg=getSeasonProgress(seasonKey);
  const start=new Date(info.start),end=new Date(info.end);
  const fmt=d=>d.toLocaleDateString("fr-FR",{day:"numeric",month:"short"});
  const col=progColor(avgProg);
  const krCol=progColor(doneKR/Math.max(totalKR,1)*100);
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

function SobjSection({sobj,sobjIndex,krs,people,objLocked,onEditKR,onAddKR,onEditSobj,collapsed,toggle}){
  const open=!collapsed[sobj.id];
  const prog=calcSobj(sobj.id,krs);
  const myKRs=krs.filter(k=>k.parent===sobj.id&&k.title);
  const sobjKRtotalW=myKRs.reduce((s,k)=>s+k.poids,0);
  const warnW=myKRs.length>0&&Math.round(sobjKRtotalW)!==100;
  const warnMsg=`Somme des poids des KR = ${Math.round(sobjKRtotalW)}% (doit être 100%)`;
  const cell={padding:"7px 8px",borderBottom:"1px solid #eae7e1",verticalAlign:"middle",fontSize:12};
  const mono={fontFamily:"monospace",fontSize:11};
  return <div style={{borderBottom:"1px solid #e2ddd6"}}>
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 16px 9px 28px"}}>
      <div onClick={()=>toggle(sobj.id)} style={{display:"flex",alignItems:"center",gap:8,flex:1,cursor:"pointer",userSelect:"none"}}>
        <div style={{flex:1,fontSize:13,fontWeight:500,color:"#1a1814"}}>
          <span style={{fontFamily:"monospace",fontSize:11,color:"#9e9890",marginRight:6}}>{sobj.id}</span>
          {sobj.title}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <span style={{fontSize:10,color:"#9e9890",border:"1px solid #e2ddd6",padding:"1px 7px",borderRadius:20,fontFamily:"monospace"}}>{sobj.poids}%</span>
        {sobj.owner&&<div style={{display:"flex",alignItems:"center",gap:3}}>
          <span style={{fontSize:10,color:"#9e9890"}}>Propriétaire :</span>
          <Avatar name={sobj.owner} people={people} size={18}/>
          <span style={{fontSize:11,color:"#6b6560"}}>{sobj.owner}</span>
        </div>}
        <SmallBar v={prog}/>
        {warnW&&<span style={{fontSize:10,color:"#b5680f",background:"#fef3c7",border:"1px solid #f59e0b",borderRadius:4,padding:"1px 5px",cursor:"default",whiteSpace:"nowrap"}} title={warnMsg}>⚠ {warnMsg}</span>}
        {!objLocked&&<button onClick={()=>onEditSobj(sobj)} style={{width:22,height:22,borderRadius:5,border:"none",background:"none",cursor:"pointer",color:"#9e9890",display:"flex",alignItems:"center",justifyContent:"center"}}>
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
            const p=kr.taux,col=progColor(p);
            const hasRevise=kr.val_revise!==kr.val_cible;
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
                {hasRevise
                  ?<><span style={{textDecoration:"line-through",color:"#9e9890",marginRight:5}}>{fmtV(kr.val_cible,kr.unite)}</span>
                     <span style={{color:kr.val_revise<kr.val_cible?"#b5680f":"#2d6a4f",fontWeight:600}}>{fmtV(kr.val_revise,kr.unite)}</span></>
                  :<span style={{color:"#9e9890"}}>{fmtV(kr.val_cible,kr.unite)}</span>}
              </td>
              <td style={cell}><div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:48,height:4,background:"#e2ddd6",borderRadius:2,overflow:"hidden"}}><div style={{width:`${Math.min(p,100)}%`,height:"100%",background:col,borderRadius:2}}/></div>
                <span style={{fontSize:11,fontWeight:600,color:col,fontFamily:"monospace",minWidth:26}}>{Math.round(p)}%</span>
              </div></td>
              <td style={cell}><button onClick={()=>onEditKR(kr)} style={{width:22,height:22,borderRadius:5,border:"none",background:"none",cursor:"pointer",color:"#9e9890",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button></td>
            </tr>;
          })}
          {!objLocked&&<tr><td colSpan={8} style={{padding:"5px 8px",borderBottom:"none"}}>
            <button onClick={()=>onAddKR(sobj.id)} style={{fontSize:11,color:"#9e9890",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4,padding:"3px 6px",borderRadius:4}}
              onMouseEnter={e=>{e.currentTarget.style.color="#2d6a4f";e.currentTarget.style.background="#d8f3dc"}}
              onMouseLeave={e=>{e.currentTarget.style.color="#9e9890";e.currentTarget.style.background="none"}}>+ Ajouter un KR</button>
          </td></tr>}
        </tbody>
      </table>
    </div>}
  </div>;
}

export default function App(){
  const [seasonKey,setSeasonKey]=useState("printemps_2026");
  const [allSeasons,setAllSeasons]=useState({"printemps_2026":{...JSON.parse(JSON.stringify(SPRING26))}});
  const [collObj,setCollObj]=useState({});
  const [collSobj,setCollSobj]=useState({});
  const [filterP,setFilterP]=useState("");
  const [modal,setModal]=useState(null);
  const [saved,setSaved]=useState(false);
  const [loaded,setLoaded]=useState(false);

  const season=allSeasons[seasonKey]||allSeasons["printemps_2026"];
  const {objectives,subobjectives,keyresults,people}=season;

  useEffect(()=>{
    (async()=>{
      try{
        const r=await window.storage.get("okr_oe_v7");
        if(r?.value){
          const d=JSON.parse(r.value);
          if(d.allSeasons)setAllSeasons(d.allSeasons);
          if(d.seasonKey)setSeasonKey(d.seasonKey);
          if(d.collObj)setCollObj(d.collObj);
          if(d.collSobj)setCollSobj(d.collSobj);
        }
      }catch(e){}
      setLoaded(true);
    })();
  },[]);

  const persist=useCallback(async(aS,sk,co,cs)=>{
    try{
      await window.storage.set("okr_oe_v7",JSON.stringify({allSeasons:aS,seasonKey:sk,collObj:co,collSobj:cs}));
      setSaved(true);setTimeout(()=>setSaved(false),1800);
    }catch(e){}
  },[]);

  function updateSeason(patch){
    const next={...allSeasons,[seasonKey]:{...season,...patch}};
    setAllSeasons(next);persist(next,seasonKey,collObj,collSobj);
  }
  function switchSeason(key){
    let next=allSeasons;
    if(!next[key]){next={...allSeasons,[key]:makeFreshSeason(people)};setAllSeasons(next);}
    setSeasonKey(key);setFilterP("");persist(next,key,collObj,collSobj);
  }
  function toggleObj(id){const co={...collObj,[id]:!collObj[id]};setCollObj(co);persist(allSeasons,seasonKey,co,collSobj)}
  function toggleSobj(id){const cs={...collSobj,[id]:!collSobj[id]};setCollSobj(cs);persist(allSeasons,seasonKey,collObj,cs)}

  function lockObj(id){
    updateSeason({objectives:objectives.map(o=>o.id===id?{...o,locked:true}:o)});
    setModal(null);
  }
  function unlockObj(id){
    updateSeason({objectives:objectives.map(o=>o.id===id?{...o,locked:false}:o)});
    setModal(null);
  }

  function handleObjSave(data){
    const{_id,_isNew,...obj}=data;
    let next;
    if(_isNew){const newId=String(objectives.length+1);next=[...objectives,{id:newId,...obj,contributors:[],locked:false}];}
    else{next=objectives.map(o=>o.id===_id?{...o,...obj}:o);}
    updateSeason({objectives:next});setModal(null);
  }
  function handleObjDel(id){
    if(!window.confirm("Supprimer cet objectif et tous ses sous-objectifs et KR ?"))return;
    const sobjIds=subobjectives.filter(s=>s.parent===id).map(s=>s.id);
    updateSeason({objectives:objectives.filter(o=>o.id!==id),subobjectives:subobjectives.filter(s=>s.parent!==id),keyresults:keyresults.filter(k=>!sobjIds.includes(k.parent))});
    setModal(null);
  }
  function handleSobjSave(data){
    const{_id,_isNew,_parentObjId,...sobj}=data;
    let next;
    if(_isNew){const siblings=subobjectives.filter(s=>s.parent===_parentObjId);const newId=`${_parentObjId}.${siblings.length+1}`;next=[...subobjectives,{id:newId,parent:_parentObjId,...sobj,contributors:[]}];}
    else{next=subobjectives.map(s=>s.id===_id?{...s,...sobj}:s);}
    updateSeason({subobjectives:next});setModal(null);
  }
  function handleSobjDel(id){
    if(!window.confirm("Supprimer ce sous-objectif et tous ses KR ?"))return;
    updateSeason({subobjectives:subobjectives.filter(s=>s.id!==id),keyresults:keyresults.filter(k=>k.parent!==id)});
    setModal(null);
  }
  function handleKRSave(data){
    const{_id,_sobjId,...kr}=data;
    let nextKRs;
    if(_id){nextKRs=keyresults.map(k=>k.id===_id?{...k,...kr}:k);}
    else{const sib=keyresults.filter(k=>k.parent===_sobjId);nextKRs=[...keyresults,{id:`${_sobjId}.${sib.length+1}`,parent:_sobjId,priorite:"",...kr}];}
    updateSeason({keyresults:nextKRs});setModal(null);
  }
  function handleKRDel(id){
    if(!window.confirm("Supprimer ce KR ?"))return;
    updateSeason({keyresults:keyresults.filter(k=>k.id!==id)});setModal(null);
  }
  function handlePeopleSave(list){updateSeason({people:list});setModal(null)}

  const allLocked=objectives.length>0&&objectives.every(o=>!!o.locked);
  const visObjs=filterP?objectives.filter(o=>{
    if(o.owner===filterP)return true;
    return subobjectives.filter(s=>s.parent===o.id).some(s=>s.owner===filterP||keyresults.filter(k=>k.parent===s.id).some(k=>k.owner===filterP||k.contributors.includes(filterP)));
  }):objectives;

  const totalKR=keyresults.length;
  const doneKR=keyresults.filter(k=>k.taux>=100).length;
  const avgProg=calcWeightedAvg(objectives,subobjectives,keyresults);

  if(!loaded)return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:200,color:"#9e9890",fontSize:13}}>Chargement…</div>;

  return <div style={{fontFamily:"system-ui,sans-serif",background:"#f5f3ef",minHeight:"100vh",color:"#1a1814"}}>
    <div style={{background:"rgba(245,243,239,.95)",borderBottom:"1px solid #e2ddd6",padding:"10px 20px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
      <span style={{fontSize:18,fontWeight:600,color:"#2d6a4f",letterSpacing:"-.3px"}}>Oé <span style={{fontWeight:300,color:"#6b6560"}}>OKR</span></span>
      <select value={seasonKey} onChange={e=>switchSeason(e.target.value)} style={{fontFamily:"inherit",fontSize:13,fontWeight:500,border:"1px solid #e2ddd6",background:"#fff",borderRadius:20,padding:"4px 14px",outline:"none",cursor:"pointer",color:"#1b4332"}}>
        {SEASONS.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
      </select>
      {allLocked&&<span title="Saison verrouillée" style={{fontSize:16,userSelect:"none"}}>🔒</span>}
      <div style={{flex:1}}/>
      {allLocked
        ?<div style={{fontSize:12,color:"#9e9890",border:"1px solid #e2ddd6",borderRadius:6,padding:"5px 12px",display:"flex",alignItems:"center",gap:5}}>🔒 Équipe ({people.length})</div>
        :<button onClick={()=>setModal({type:"people"})} style={{fontSize:12,color:"#6b6560",background:"none",border:"1px solid #e2ddd6",borderRadius:6,padding:"5px 12px",cursor:"pointer"}}>Équipe ({people.length})</button>
      }
      <select value={filterP} onChange={e=>setFilterP(e.target.value)} style={{fontFamily:"inherit",fontSize:12,border:"1px solid #e2ddd6",background:"#fff",borderRadius:6,padding:"5px 10px",outline:"none",cursor:"pointer"}}>
        <option value="">Toute l'équipe</option>
        {people.map(p=><option key={p}>{p}</option>)}
      </select>
    </div>

    <div style={{maxWidth:1100,margin:"0 auto",padding:"0 16px 60px"}}>
      <div style={{padding:"16px 0 4px"}}>
        <SeasonBanner seasonKey={seasonKey} avgProg={avgProg} totalKR={totalKR} doneKR={doneKR}/>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {visObjs.length===0&&<div style={{textAlign:"center",padding:32,color:"#9e9890",fontSize:13}}>Aucun objectif — cliquez sur + Objectif pour commencer.</div>}
        {visObjs.map((obj,idx)=>{
          const prog=calcObj(obj.id,subobjectives,keyresults);
          const open=!collObj[obj.id];
          const objLocked=!!obj.locked;
          const sobjs=subobjectives.filter(s=>s.parent===obj.id);
          const visSobjs=filterP?sobjs.filter(s=>s.owner===filterP||keyresults.filter(k=>k.parent===s.id).some(k=>k.owner===filterP||k.contributors.includes(filterP))):sobjs;
          const sobjTotalW=sobjs.reduce((s,o)=>s+o.poids,0);
          const warnSobj=sobjs.length>0&&Math.round(sobjTotalW)!==100;
          const warnSobjMsg=`Somme des poids sous-objectifs = ${Math.round(sobjTotalW)}% (doit être 100%)`;
          return <div key={obj.id} style={{background:"#fff",border:`1px solid ${objLocked?"#f59e0b":"#e2ddd6"}`,borderRadius:10,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,.07)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px",cursor:"pointer",userSelect:"none"}}
              onClick={()=>toggleObj(obj.id)}
              onMouseEnter={e=>e.currentTarget.style.background="#f5f3ef"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:28,height:28,borderRadius:8,background:OBJ_BG[idx%11],color:OBJ_TX[idx%11],display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,flexShrink:0}}>{obj.id}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:500}}>{obj.title}</div>
                {obj.owner&&<div style={{fontSize:11,color:"#6b6560",marginTop:2}}>Propriétaire : {obj.owner}</div>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                {obj.etp>0&&<span style={{fontSize:11,background:"#f5f3ef",border:"1px solid #e2ddd6",padding:"2px 8px",borderRadius:20,color:"#6b6560"}}>{obj.etp} ETP</span>}
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:80,height:5,background:"#e2ddd6",borderRadius:3,overflow:"hidden"}}>
                    <div style={{width:`${Math.min(prog,100)}%`,height:"100%",background:progColor(prog),borderRadius:3}}/>
                  </div>
                  <span style={{fontSize:12,fontWeight:600,color:progColor(prog),minWidth:32,textAlign:"right",fontFamily:"monospace"}}>{Math.round(prog)}%</span>
                </div>
                {warnSobj&&<span style={{fontSize:10,color:"#b5680f",background:"#fef3c7",border:"1px solid #f59e0b",borderRadius:4,padding:"1px 5px",cursor:"default",whiteSpace:"nowrap"}} title={warnSobjMsg}>⚠ {warnSobjMsg}</span>}
                <button onClick={e=>{e.stopPropagation();setModal({type:"obj",item:obj,isNew:false});}}
                  style={{width:24,height:24,borderRadius:5,border:"none",background:"none",cursor:"pointer",color:objLocked?"#f59e0b":"#9e9890",display:"flex",alignItems:"center",justifyContent:"center"}}
                  title={objLocked?"Objectif verrouillé":"Modifier l'objectif"}>
                  {objLocked
                    ? <span style={{fontSize:16}}>🔒</span>
                    : <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
                </button>
                <span style={{fontSize:11,color:"#9e9890",display:"inline-block",transform:open?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</span>
              </div>
            </div>
            {open&&<div style={{borderTop:"1px solid #e2ddd6"}}>
              {visSobjs.map((sobj,si)=><SobjSection key={sobj.id} sobj={sobj} sobjIndex={si} krs={keyresults} people={people} objLocked={objLocked}
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
        {!allLocked&&<button onClick={()=>setModal({type:"obj",item:null,isNew:true})}
          style={{fontSize:13,color:"#2d6a4f",background:"#d8f3dc",border:"1px dashed #2d6a4f",borderRadius:10,padding:"12px",textAlign:"center",cursor:"pointer",width:"100%"}}>
          + Ajouter un objectif
        </button>}
      </div>
    </div>

    {modal?.type==="obj"&&<ObjModal obj={modal.item} isNew={modal.isNew} people={people}
      onClose={()=>setModal(null)}
      onSave={d=>handleObjSave({...d,_id:modal.item?.id,_isNew:modal.isNew})}
      onDelete={()=>handleObjDel(modal.item.id)}
      onLock={()=>{lockObj(modal.item.id);}}
      onUnlockRequest={()=>setModal({type:"unlock",item:modal.item})}/>}
    {modal?.type==="sobj"&&<SobjModal sobj={modal.item} isNew={modal.isNew} parentObjId={modal.parentObjId}
      people={people} subobjectives={subobjectives}
      onClose={()=>setModal(null)}
      onSave={d=>handleSobjSave({...d,_id:modal.item?.id,_isNew:modal.isNew,_parentObjId:modal.parentObjId})}
      onDelete={()=>handleSobjDel(modal.item.id)}/>}
    {modal?.type==="kr"&&<KRModal kr={modal.item} sobjId={modal.sobjId} people={people}
      keyresults={keyresults} locked={modal.locked}
      onClose={()=>setModal(null)}
      onSave={d=>handleKRSave({...d,_id:modal.item?.id,_sobjId:modal.sobjId})}
      onDelete={()=>handleKRDel(modal.item.id)}/>}
    {modal?.type==="people"&&<PeopleModal people={people} objectives={objectives} subobjectives={subobjectives} keyresults={keyresults} onClose={()=>setModal(null)} onSave={handlePeopleSave}/>}
    {modal?.type==="unlock"&&<UnlockModal objTitle={modal.item?.title} onClose={()=>setModal(null)} onUnlock={()=>unlockObj(modal.item.id)}/>}

    {saved&&<div style={{position:"fixed",bottom:20,right:20,background:"#2d6a4f",color:"#fff",fontSize:12,fontWeight:500,padding:"8px 16px",borderRadius:20,boxShadow:"0 2px 8px rgba(0,0,0,.2)",zIndex:200,pointerEvents:"none"}}>✓ Sauvegardé</div>}
  </div>;
}
