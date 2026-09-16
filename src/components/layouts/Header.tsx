import React from "react";

export function Header() {
  return (
    <aside
      aria-label="Promotional Announcement"
      className="bg-gradient-to-r from-primary-100/90 via-primary-50/80 to-primary-100/90 text-primary-950 border-b border-primary-200/60 text-xs py-2 px-4 text-center font-medium tracking-wide"
    >
      <div className="container mx-auto flex items-center justify-center gap-2">
        <span className="font-semibold text-primary-700">✨ Special Offer:</span>
        <span>Free nationwide delivery on orders over $50</span>
      </div>
    </aside>
  );
}
