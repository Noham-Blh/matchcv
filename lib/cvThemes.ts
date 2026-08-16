export interface CvTheme {
  id: string;
  label: string;
  /** Couleur utilisée pour les titres de section et les accents. */
  accent: string;
  /** Version plus douce, utilisée pour les fonds (bandeau du CV moderne, etc.). */
  accentSoft: string;
}

export const CV_THEMES: CvTheme[] = [
  { id: "cobalt", label: "Cobalt", accent: "#2E3FB0", accentSoft: "#E4E7FA" },
  { id: "ink", label: "Noir intense", accent: "#12141C", accentSoft: "#E7E7E9" },
  { id: "emerald", label: "Émeraude", accent: "#0F7B5C", accentSoft: "#DCF3EA" },
  { id: "burgundy", label: "Bordeaux", accent: "#8A2846", accentSoft: "#F5DEE5" },
  { id: "slate", label: "Ardoise", accent: "#3E4C63", accentSoft: "#E2E6EC" },
  { id: "amber", label: "Ambre", accent: "#B5680B", accentSoft: "#FBE9D2" },
];

export function getCvTheme(id: string | null | undefined): CvTheme {
  return CV_THEMES.find((t) => t.id === id) || CV_THEMES[0];
}
