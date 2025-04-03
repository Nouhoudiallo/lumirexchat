"use client";
// utils/greeting.ts

// Définition des types pour les moments de la journée
type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Fonction pour déterminer le moment de la journée
function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours(); // Récupère l'heure actuelle (0-23)

  if (hour >= 5 && hour < 12) {
    return 'morning'; // Matin : 5h - 11h59
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon'; // Après-midi : 12h - 16h59
  } else if (hour >= 17 && hour < 22) {
    return 'evening'; // Soirée : 17h - 21h59
  } else {
    return 'night'; // Nuit : 22h - 4h59
  }
}

// Fonction pour générer un message en fonction du moment
function getGreeting(): string {
  const timeOfDay = getTimeOfDay();

  switch (timeOfDay) {
    case 'morning':
      return 'Bonjour ! Prêt pour une belle journée ?';
    case 'afternoon':
      return 'Bon après-midi ! Comment vas-tu ?';
    case 'evening':
      return 'Bonsoir ! Une soirée tranquille en vue ?';
    case 'night':
      return 'Bonne nuit ! Fais de beaux rêves !';
    default:
      return 'Salut !'; // Cas improbable, juste pour TypeScript
  }
}

export default getGreeting;