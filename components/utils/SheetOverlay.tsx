'use client';

import React, { useEffect, useState } from "react";

export default function SheetOverlay({
  open,
  onClose,
  header,
  children,
}: {
  open: boolean;
  onClose: () => void;
  header?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [pe, setPe] = useState(open);

  useEffect(() => {
    if (open) {
      setPe(true);
      return;
    }
    const t = window.setTimeout(() => setPe(false), 1000);
    return () => window.clearTimeout(t);
  }, [open]);

  return (
    <div
      className={`
        absolute inset-0 z-[47]
        ${pe ? "pointer-events-auto" : "pointer-events-none"}
      `}
      onClick={onClose}
    >
      {/* dim */}
      <div className="absolute inset-0 " />

      {/* sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute left-0 right-0 bottom-0 bg-white"
        style={{
          height: "calc(100svh - 31px)",
          transform: open ? "translateY(0%)" : "translateY(100%)",
          transition: "transform 1s cubic-bezier(0.230, 1.000, 0.320, 1.000)",
          willChange: "transform",
        }}
      >
        <div className="h-full overflow-y-auto">
          <div className="h-[56px] flex items-center justify-between px-4 border-b">
            <div>{header}</div>
            <button onClick={onClose} className="px-2 mr-[50px] py-1 border">
              BACK
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}