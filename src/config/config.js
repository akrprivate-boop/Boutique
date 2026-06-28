/**
 * Central Configuration File
 * 
 * Change the boutique name here and it updates across the entire website.
 * Change auth credentials here for hardcoded login.
 * 
 * To switch to Supabase Auth later, replace authService.js logic
 * and remove the auth block below.
 */

const config = {
  /* ───── Boutique Identity ───── */
  boutiqueName: "Royal Threads",
  tagline: "Where Elegance Meets Style",

  /* ───── Theme ───── */
  theme: {
    primaryColor: "#B76E79",       // Rose gold
    secondaryColor: "#C9A96E",     // Gold
    backgroundColor: "#FDF8F5",    // Warm cream
  },

  /* ───── Hardcoded Auth (Phase 1) ───── */
  auth: {
    username: "admin",
    password: "123456",
  },

  /* ───── Currency ───── */
  currency: {
    symbol: "₹",
    locale: "en-IN",
  },
};

export default config;
