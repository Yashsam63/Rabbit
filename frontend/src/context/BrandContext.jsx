import { createContext, useContext, useEffect, useState } from "react";
import { brandConfig } from "../config/brand";

// Holds the live brand identity (name + colour) shared across the whole app.
// Defaults come from src/config/brand.js; the "Make it yours" widget can
// override them at runtime, and the choice is remembered via localStorage.
const STORAGE_KEY = "rabbit-brand";

const BrandContext = createContext(null);

export const useBrand = () => {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand must be used within a BrandProvider");
  return ctx;
};

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function BrandProvider({ children }) {
  const saved = loadSaved();
  const [name, setName] = useState(saved?.name || brandConfig.name);
  const [color, setColor] = useState(saved?.color || brandConfig.primaryColor);

  // expose the brand colour to Tailwind via the --brand-color CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty("--brand-color", color);
  }, [color]);

  // keep the browser tab title in sync with the brand name
  useEffect(() => {
    document.title = name || brandConfig.name;
  }, [name]);

  // persist the rebrand so it survives page reloads
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, color }));
    } catch {
      /* storage unavailable — ignore */
    }
  }, [name, color]);

  const reset = () => {
    setName(brandConfig.name);
    setColor(brandConfig.primaryColor);
  };

  const value = { name, setName, color, setColor, reset, config: brandConfig };
  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export default BrandProvider;
