export const CATEGORIES = [
    "Elektronika",
    "Narzędzia",
    "Samochody",
    "Rowery",
    "Foto/Video",
    "Camping",
    "Muzyka",
    "Sporty wodne",
    "Odzież",
    "Gry",
    "Przyczepy",
    "Maszyny budowlane",
    "Fitness",
    "Inne",
] as const

export type Category = (typeof CATEGORIES)[number]
