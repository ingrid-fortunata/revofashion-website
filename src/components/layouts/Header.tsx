import React from "react";

export function Header() {
  return (
    <aside
      aria-label="Promotional Announcement"
      className="bg-gradient-to-r from-rose-100/90 via-pink-100/80 to-rose-100/90 text-rose-950 border-b border-rose-200/60 text-xs py-2 px-4 text-center font-medium tracking-wide"
    >
      <div className="container mx-auto flex items-center justify-center gap-2">
        <span className="font-semibold text-rose-700">✨ Special Offer:</span>
        <span>Free nationwide delivery on orders over Rp 500,000</span>
      </div>
    </aside>
  );
}
