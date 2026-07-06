import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useBrand } from "../../context/BrandContext";

// Floating "Make it yours" widget — type a name / pick a colour and the whole
// storefront rebrands live. Mirrors the qweblo-website "Make it yours" feature.
const MakeItYours = () => {
  const { name, setName, color, setColor, reset } = useBrand();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[60] print:hidden">
      {open ? (
        <div className="w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-800">Make it yours</h4>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <IoMdClose className="h-5 w-5 text-gray-500 hover:text-gray-800" />
            </button>
          </div>

          <label className="mb-1 block text-xs text-gray-500">Brand name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your company…"
            maxLength={28}
            autoComplete="off"
            aria-label="Brand name"
            className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-400"
          />

          <label className="mb-1 block text-xs text-gray-500">Brand colour</label>
          <div className="mb-4 flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Brand colour"
              className="h-9 w-12 cursor-pointer rounded border border-gray-300 bg-white p-0.5"
            />
            <span className="text-sm uppercase text-gray-600">{color}</span>
          </div>

          <button
            onClick={reset}
            className="w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Reset to default
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-brand px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:opacity-90"
        >
          ✨ Make it yours
        </button>
      )}
    </div>
  );
};

export default MakeItYours;
