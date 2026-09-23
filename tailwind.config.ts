import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Cinzel", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Premiere palette — mirrors the custom properties in index.css.
           The brand red is exposed as `carpet` rather than `red` so the
           default Tailwind red-* scale (used by the toast) stays intact. */
        gold: "hsl(var(--gold))",
        "gold-light": "hsl(var(--gold-light))",
        "gold-dark": "hsl(var(--gold-dark))",
        carpet: "hsl(var(--red))",
        "carpet-bright": "hsl(var(--red-bright))",
        "carpet-dark": "hsl(var(--red-dark))",
        crimson: "hsl(var(--crimson))",
        velvet: "hsl(var(--velvet))",
        onyx: "hsl(var(--black))",
        charcoal: "hsl(var(--charcoal))",
        ivory: "hsl(var(--ivory))",
        silver: "hsl(var(--silver))",
        burgundy: "hsl(var(--burgundy))",
        cream: "hsl(var(--cream))",
        sepia: "hsl(var(--sepia))",
        parchment: "hsl(var(--parchment))",
        ink: "hsl(var(--ink))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        premiere: "var(--shadow-premiere)",
        card: "var(--shadow-card)",
        red: "var(--shadow-red)",
        gold: "var(--shadow-gold)",
        /* Legacy aliases kept so existing `shadow-vintage` / `shadow-elegant`
           usages resolve to the new premiere shadows. */
        vintage: "var(--shadow-premiere)",
        elegant: "var(--shadow-gold)",
      },
      backgroundImage: {
        "gradient-premiere": "var(--gradient-premiere)",
        "gradient-red": "var(--gradient-red)",
        "gradient-velvet": "var(--gradient-velvet)",
        "gradient-gold": "var(--gradient-gold)",
        "gradient-spotlight": "var(--gradient-spotlight)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
