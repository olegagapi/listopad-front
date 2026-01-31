import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      "euclid-circular-a": ["Euclid Circular A"],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        xl: "0",
      },
    },
    colors: {
      current: "currentColor",
      transparent: "transparent",
      white: "#FFFFFF",

      // === WARM BACKGROUNDS (subtle warmth) ===
      champagne: {
        DEFAULT: "#FAFAF8",    // Very subtle warm white - main page bg
        50: "#FEFEFD",         // Barely off-white - cards
        100: "#FAFAF8",        // Same as default
        200: "#F7F6F3",        // Subtle warm - product image bg
        300: "#F0EFEB",        // Section dividers
        400: "#E8E6E2",        // Borders, subtle lines
      },

      // === PRIMARY ACCENT (CTAs) ===
      malachite: {
        DEFAULT: "#0BDA51",
        dark: "#09B844",
        muted: "#E6FCF0",
      },

      // === SOFT ACCENT ===
      lavender: {
        DEFAULT: "#D8E4FF",
        dark: "#B5C8F5",
        light: "#E8EEFF",
        muted: "#F2F5FF",
      },

      // === WISHLIST ACCENT ===
      lipstick: {
        DEFAULT: "#C41E3A",
        dark: "#A01830",
      },

      // === PRIMARY TEXT ===
      onyx: {
        DEFAULT: "#00120B",
        soft: "#1A2920",
      },

      // === SECONDARY TEXT / NEUTRAL ===
      slate: {
        DEFAULT: "#6B818C",
        light: "#8A9BA5",
        dark: "#4A5C64",
      },

      // === SECONDARY ACCENT (hover, borders) ===
      darkslate: {
        DEFAULT: "#35605A",
        light: "#4A7A72",
        dark: "#2A4D48",
        muted: "#E8EFED",
      },

      // === LEGACY COLORS (keeping for backward compatibility during transition) ===
      body: "#6B818C", // maps to slate
      meta: {
        DEFAULT: "#FAFAF8", // maps to champagne
        2: "#4A5C64",
        3: "#6B818C",
        4: "#8A9BA5",
        5: "#E8E6E2",
      },
      dark: {
        DEFAULT: "#00120B", // maps to onyx
        2: "#1A2920",
        3: "#6B818C", // maps to slate
        4: "#8A9BA5",
        5: "#E8E6E2",
      },
      gray: {
        DEFAULT: "#F7F6F3", // maps to champagne-200
        1: "#FAFAF8", // maps to champagne
        2: "#F7F6F3",
        3: "#E8E6E2", // maps to champagne-400
        4: "#E8E6E2",
        5: "#8A9BA5",
        6: "#6B818C",
        7: "#4A5C64",
      },
      blue: {
        DEFAULT: "#0BDA51", // maps to malachite (primary CTA)
        dark: "#09B844",
        light: "#0BDA51",
        "light-2": "#0BDA51",
        "light-3": "#0BDA51",
        "light-4": "#E6FCF0",
        "light-5": "#E6FCF0",
      },
      red: {
        DEFAULT: "#E53935",
        dark: "#C62828",
        light: "#EF5350",
        "light-2": "#E57373",
        "light-3": "#EF9A9A",
        "light-4": "#FFCDD2",
        "light-5": "#FFEBEE",
        "light-6": "#FFF5F5",
      },
      green: {
        DEFAULT: "#0BDA51", // maps to malachite
        dark: "#09B844",
        light: "#0BDA51",
        "light-2": "#0BDA51",
        "light-3": "#0BDA51",
        "light-4": "#E6FCF0",
        "light-5": "#E6FCF0",
        "light-6": "#E6FCF0",
      },
      yellow: {
        DEFAULT: "#FFA726",
        dark: "#FB8C00",
        "dark-2": "#EF6C00",
        light: "#FFCC80",
        "light-1": "#FFE0B2",
        "light-2": "#FFF3E0",
        "light-4": "#FFFAF5",
      },
      teal: {
        DEFAULT: "#35605A", // maps to darkslate
        dark: "#2A4D48",
      },
      orange: {
        DEFAULT: "#FFA726",
        dark: "#FB8C00",
      },

      // === SEMANTIC ===
      success: "#0BDA51",
      error: "#E53935",
      warning: "#FFA726",
    },
    extend: {
      screens: {
        xsm: "375px",
        lsm: "425px",
        "3xl": "2000px",
      },
      fontSize: {
        "2xs": ["10px", "17px"],
        "heading-1": ["60px", "72px"],
        "heading-2": ["48px", "64px"],
        "heading-3": ["40px", "48px"],
        "heading-4": ["30px", "38px"],
        "heading-5": ["28px", "40px"],
        "heading-6": ["24px", "30px"],
        "custom-xl": ["20px", "24px"],
        "custom-lg": ["18px", "24px"],
        "custom-sm": ["14px", "22px"],
        "custom-xs": ["12px", "20px"],
        "custom-2xl": ["24px", "34px"],
        "custom-4xl": ["36px", "48px"],
        "custom-1": ["22px", "30px"],
        "custom-2": ["32px", "38px"],
        "custom-3": ["35px", "45px"],
      },
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        7.5: "1.875rem",
        8.5: "2.125rem",
        9.5: "2.375rem",
        10.5: "2.625rem",
        11: "2.75rem",
        11.5: "2.875rem",
        12.5: "3.125rem",
        13: "3.25rem",
        13.5: "3.375rem",
        14: "3.5rem",
        14.5: "3.625rem",
        15: "3.75rem",
        15.5: "3.875rem",
        16: "4rem",
        16.5: "4.125rem",
        17: "4.25rem",
        17.5: "4.375rem",
        18: "4.5rem",
        18.5: "4.625rem",
        19: "4.75rem",
        19.5: "4.875rem",
        21: "5.25rem",
        21.5: "5.375rem",
        22: "5.5rem",
        22.5: "5.625rem",
        24.5: "6.125rem",
        25: "6.25rem",
        25.5: "6.375rem",
        26: "6.5rem",
        27: "6.75rem",
        27.5: "6.875rem",
        29: "7.25rem",
        29.5: "7.375rem",
        30: "7.5rem",
        31: "7.75rem",
        31.5: "7.875rem",
        32.5: "8.125rem",
        33: "8.25rem",
        34: "8.5rem",
        34.5: "8.625rem",
        35: "8.75rem",
        36.5: "9.125rem",
        37: "9.25rem",
        37.5: "9.375rem",
        39: "9.75rem",
        39.5: "9.875rem",
        40: "10rem",
        42.5: "10.625rem",
        45: "11.25rem",
        46: "11.5rem",
        47.5: "11.875rem",
        49: "12.25rem",
        50: "12.5rem",
        51: "12.75rem",
        51.5: "12.875rem",
        52: "13rem",
        52.5: "13.125rem",
        54: "13.5rem",
        54.5: "13.625rem",
        55: "13.75rem",
        55.5: "13.875rem",
        57.5: "14.375rem",
        59: "14.75rem",
        60: "15rem",
        62.5: "15.625rem",
        65: "16.25rem",
        67: "16.75rem",
        67.5: "16.875rem",
        70: "17.5rem",
        72.5: "18.125rem",
        75: "18.75rem",
        90: "22.5rem",
        92.5: "23.125rem",
        94: "23.5rem",
        100: "25rem",
        110: "27.5rem",
        115: "28.75rem",
        122.5: "30.625rem",
        125: "31.25rem",
        127.5: "31.875rem",
        132.5: "33.125rem",
        142.5: "35.625rem",
        150: "37.5rem",
        166.5: "41.625rem",
        171.5: "42.875rem",
        180: "45rem",
        187.5: "46.875rem",
        192.5: "48.125rem",
        203: "50.75rem",
        230: "57.5rem",
      },
      maxWidth: {
        30: "7.5rem",
        40: "10rem",
        50: "12.5rem",
      },
      zIndex: {
        999999: "999999",
        99999: "99999",
        9999: "9999",
        999: "999",
        99: "99",
        1: "1",
      },
      boxShadow: {
        1: "0px 1px 2px 0px rgba(166, 175, 195, 0.25)",
        2: "0px 6px 24px 0px rgba(235, 238, 251, 0.40), 0px 2px 4px 0px rgba(148, 163, 184, 0.05)",
        3: "0px 2px 16px 0px rgba(13, 10, 44, 0.12)",
        testimonial:
          "0px 0px 4px 0px rgba(148, 163, 184, 0.10), 0px 6px 12px 0px rgba(224, 227, 238, 0.45)",
        breadcrumb: "0px 1px 0px 0px #E8E6E2, 0px -1px 0px 0px #E8E6E2",
        range:
          "0px 0px 1px 0px rgba(33, 37, 41, 0.08), 0px 2px 2px 0px rgba(33, 37, 41, 0.06)",
        filter: "0px 1px 0px 0px #E8E6E2",
        list: "1px 0px 0px 0px #E8E6E2",
        input: "inset 0 0 0 2px #D8E4FF",
      },
    },
  },
  plugins: [],
};
export default config;
