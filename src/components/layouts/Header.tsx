import React from "react";

export function Header() {
  return (
    <aside
      aria-label="Promotional Announcement"
      className="bg-neutral-900 text-neutral-100 text-xs py-2 px-4 text-center font-medium tracking-wide"
    >
      <div className="container mx-auto flex items-center justify-center gap-2">
        <span>✨ Welcome to RevoFashion — Free shipping nationwide on orders over Rp 500,000</span>
      </div>
    </aside>
  );
}
