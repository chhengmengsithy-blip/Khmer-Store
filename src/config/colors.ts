export const colors = {
  background: "#0F1115",
  surface: "#181A20",
  elevated: "#1F222A",
  "soft-white": "#F5F5F2",
  muted: "#A1A1AA",
  border: "rgba(255,255,255,0.08)",
  "accent-gold": "#C6A769",
  "accent-silver": "#D6D3D1",
} as const;

export type ColorKey = keyof typeof colors;
