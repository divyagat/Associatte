import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ✅ Keep your existing fonts
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        jost: ["var(--font-jost)", "sans-serif"],
      },
      
      // ✅ Keep your existing colors + add blog brand colors
      colors: {
        primary: "#005E60",       // Green (Teal)
        secondary: "#8B0000",     // Red (Burgundy)
        accent: "#ECF1F8",        // Light background
        
        // ✅ Blog Brand Colors (Associatte)
        brand: {
          primary: "#005E60",     // Teal
          primaryDark: "#004a4b", // Dark Teal
          accent: "#F8C21C",      // Gold
          accentDark: "#e5b319",  // Dark Gold
          secondary: "#8B0000",   // Burgundy
          secondaryLight: "#a31d1d",
        },
        
        // ✅ Social Brand Colors
        social: {
          twitter: "#1DA1F2",
          facebook: "#1877F2",
          linkedin: "#0A66C2",
        },
      },
      
      // ✅ Keep existing border width + add more
      borderWidth: {
        "3": "3px",
        "5": "5px",
      },
      
      // ✅ Add custom animations
      animation: {
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "slide-in-right": "slideInRight 0.3s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
      },
      
      // ✅ Add custom keyframes
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      
      // ✅ Add custom box shadows
      boxShadow: {
        "glow": "0 0 20px rgba(0, 94, 96, 0.3)",
        "glow-lg": "0 0 40px rgba(248, 194, 28, 0.4)",
        "inner-lg": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      },
      
      // ✅ Add custom spacing for blog layout
      spacing: {
        "18": "4.5rem",
        "112": "28rem",
        "128": "32rem",
        "144": "36rem",
      },
      
      // ✅ Add custom border radius
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      
      // ✅ Add custom transition durations
      transitionDuration: {
        "400": "400ms",
        "500": "500ms",
        "700": "700ms",
      },
    },
  },
  // ✅ Add typography plugin for prose styling
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;