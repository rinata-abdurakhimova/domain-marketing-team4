// Dopamine-blue analytics palette.
// Blue tones are used for ordinary categorical/sequential structure.
// Green/red/gray are reserved exclusively for performance status.

export const BLUE = {
  electric: "#2563eb",
  cobalt: "#1e3a8a",
  sky: "#38bdf8",
  indigo: "#4338ca",
  ice: "#93c5fd",
  deep: "#1e40af",
  slate: "#0f172a",
} as const;

// Fixed-order categorical ramp for ordinary (non-status) dimensions.
export const CATEGORICAL_BLUES = [
  "#1d4ed8", // electric blue
  "#38bdf8", // sky blue
  "#1e3a8a", // cobalt
  "#7dd3fc", // light blue accent
  "#4338ca", // indigo
  "#0ea5e9", // cyan-blue
  "#312e81", // deep indigo
  "#bae6fd", // pale blue
];

export const STATUS = {
  effective: "#16a34a",
  effectiveSoft: "#dcfce7",
  ineffective: "#dc2626",
  ineffectiveSoft: "#fee2e2",
  missing: "#9ca3af",
  missingSoft: "#f3f4f6",
} as const;

export function categoricalColor(index: number): string {
  return CATEGORICAL_BLUES[index % CATEGORICAL_BLUES.length];
}

export function statusColor(isEffective: boolean): string {
  return isEffective ? STATUS.effective : STATUS.ineffective;
}
