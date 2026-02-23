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
    const t = window.setTimeout(() => setPe(false), 200); // sheet 1s랑 동일
    return () => window.clearTimeout(t);
  }, [open]);


  useEffect(() => {
  if (!open) {
    const t = setTimeout(() => {
      window.scrollTo({ top: window.scrollY });
      document.body.focus();
    }, 700); // sheet 1초 끝나고
    return () => clearTimeout(t);
  }
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
      <div className="absolute inset-0" />

      {/* sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          absolute left-0 right-0 bottom-0 bg-white
          transform-gpu will-change-transform
          transition-transform duration-[700ms] [transition-timing-function:cubic-bezier(0.230,1.000,0.320,1.000)]
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ height: "calc(100svh - 31px)" }}
      >
        {/* content: sheet는 같이 올라가고, 내용은 끝부분에 붙는 느낌 */}
        <div
          className={`
            h-full overflow-y-auto transform-gpu
            transition-[transform,opacity] duration-[180ms] ease-out
            ${open
              ? "opacity-100 translate-y-0 delay-[700ms]"
              : "opacity-0 translate-y-2 delay-0"
            }
          `}
        >
          <div className="h-[10vh] flex items-center justify-between px-4 ">
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