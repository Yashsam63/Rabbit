import { createContext, useContext, useEffect, useState } from "react";
import { brandConfig } from "../config/brand";

// Lets the storefront be re-branded when it is embedded as a live preview on
// qweblo's "Work" section. The brand name arrives from OUTSIDE — never from a
// control on this page:
//   1. `?brand=<name>` query param  → initial paint (e.g. /?brand=yash)
//   2. postMessage from the host page: { type: "murzban:brand", name }
//      → live, no reload (qweblo broadcasts this as you type)
// With neither, it falls back to the default in config/brand.js ("Rabbit").
const DEFAULT_BRAND = brandConfig.name;

const BrandContext = createContext({ name: DEFAULT_BRAND });

export const useBrand = () => useContext(BrandContext);

export function BrandProvider({ children }) {
  const [name, setName] = useState(DEFAULT_BRAND);

  useEffect(() => {
    // 1) initial paint — read ?brand= from the URL
    try {
      const q = new URLSearchParams(window.location.search).get("brand");
      if (q && q.trim()) setName(q.trim());
    } catch {
      /* ignore malformed URL */
    }

    // 2) live updates — host page (qweblo) broadcasts the typed name.
    //    Same message type Murzban uses, so one broadcast rebrands every demo.
    const onMessage = (e) => {
      const data = e.data;
      if (data && typeof data === "object" && data.type === "murzban:brand") {
        const next = typeof data.name === "string" ? data.name.trim() : "";
        setName(next || DEFAULT_BRAND);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // keep the browser tab title in sync with the brand
  useEffect(() => {
    document.title = name || DEFAULT_BRAND;
  }, [name]);

  return <BrandContext.Provider value={{ name }}>{children}</BrandContext.Provider>;
}

export default BrandProvider;
