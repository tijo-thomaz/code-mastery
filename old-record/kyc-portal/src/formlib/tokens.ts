export const tokens = {
  primitive: {
    emerald400: "#34d399", emerald600: "#059669",
    slate900: "#0f172a", slate800: "#1e293b", slate700: "#334155",
    slate600: "#475569", slate400: "#94a3b8", slate200: "#e2e8f0",
    white: "#ffffff", red400: "#f87171", amber400: "#fbbf24", blue400: "#60a5fa",
  },
};

export const theme: Record<string, string> = {
  "color-bg-app": tokens.primitive.slate900,
  "color-bg-card": tokens.primitive.slate800,
  "color-bg-input": tokens.primitive.slate700,
  "color-border": tokens.primitive.slate600,
  "color-brand": tokens.primitive.emerald400,
  "color-brand-dark": tokens.primitive.emerald600,
  "color-text-primary": tokens.primitive.white,
  "color-text-muted": tokens.primitive.slate400,
  "color-text-label": tokens.primitive.slate200,
  "color-error": tokens.primitive.red400,
  "color-warning": tokens.primitive.amber400,
  "color-info": tokens.primitive.blue400,
  "space-xs": "4px", "space-sm": "8px", "space-md": "16px",
  "space-lg": "24px", "space-xl": "32px", "space-2xl": "48px",
  "radius-sm": "6px", "radius-md": "10px", "radius-lg": "16px",
  "font-display": "'Syne', sans-serif",
  "font-body": "'DM Sans', sans-serif",
};

export const cssVars = (vars: Record<string, string>): string =>
  Object.entries(vars).reduce((acc, [k, v]) => acc + `--${k}:${v};`, "");
