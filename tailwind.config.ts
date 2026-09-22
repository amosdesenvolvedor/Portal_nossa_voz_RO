import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        surface: {
          DEFAULT: "var(--color-surface)",
          secondary: "var(--color-surface-secondary)",
        },
        text: {
          DEFAULT: "var(--color-text-primary)",
          muted: "var(--color-text-muted)",
          disabled: "var(--color-text-disabled)",
          inverse: "var(--color-text-inverse)",
        },
        border: {
          DEFAULT: "var(--color-border-default)",
          strong: "var(--color-border-strong)",
        },
        brand: {
          primary: "var(--color-brand-primary)",
          secondary: "var(--color-brand-secondary)",
          accent: "var(--color-brand-accent)",
          accentLight: "var(--color-brand-accent-light)",
        },
        semantic: {
          success: "var(--color-semantic-success)",
          info: "var(--color-semantic-info)",
          warning: "var(--color-semantic-warning)",
          danger: "var(--color-semantic-danger)",
        },
        overlay: "var(--color-overlay)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        card: "var(--radius-card)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
      },
      maxWidth: {
        container: "var(--container-max)",
        reading: "var(--reading-max)",
      },
      spacing: {
        gutter: "var(--gutter)",
        "gutter-lg": "var(--gutter-lg)",
      },
      fontSize: {
        display: ["var(--font-size-display)", { lineHeight: "var(--line-height-tight)" }],
        h1: ["var(--font-size-h1)", { lineHeight: "var(--line-height-tight)" }],
        h2: ["var(--font-size-h2)", { lineHeight: "var(--line-height-tight)" }],
        h3: ["var(--font-size-h3)", { lineHeight: "var(--line-height-snug)" }],
        h4: ["var(--font-size-h4)", { lineHeight: "var(--line-height-snug)" }],
        "body-lg": ["var(--font-size-body-lg)", { lineHeight: "var(--line-height-body)" }],
        body: ["var(--font-size-body)", { lineHeight: "var(--line-height-body)" }],
        "body-sm": ["var(--font-size-body-sm)", { lineHeight: "var(--line-height-body)" }],
        caption: ["var(--font-size-caption)", { lineHeight: "var(--line-height-body)" }],
      },
      ringColor: {
        DEFAULT: "var(--color-focus-ring)",
      },
      ringOffsetColor: {
        DEFAULT: "var(--color-focus-offset)",
      },
      transitionDuration: {
        fast: "140ms",
        base: "220ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0, 1)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 500ms var(--ease-standard) both",
      },
    },
  },
  plugins: [],
};

export default config;