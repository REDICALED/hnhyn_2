// components/personal/PortraitMasonry.tsx
'use client';

import { use, useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { motion } from "framer-motion";

const PORTRAIT_FILES = Array.from({ length: 13 }, (_, i) => `/commercial/portrait/${i + 1}.jpg`);

export default function PortraitMasonry({
  portraitOpen,
  activeSrc,
  onSelect,
}: {
  portraitOpen: boolean;
  activeSrc: string | null;
  onSelect: (src: string) => void;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!portraitOpen) {
    setReady(false);
    return;
  }

  const t = setTimeout(() => {
    setReady(true);
  }, 700);

  }, [portraitOpen]);

  return (
<div className="w-full h-full overflow-y-auto overscroll-contain pt-[24px] px-[40px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="pb-[16px] pt-[10px] ">
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            0: 2,
            768: 3,
            1024: 4,
          }}
          gutterBreakPoints={{0: "2px", 768: "4px", 1024: "6px"}}
        >
          <Masonry style={{ justifyContent: "center" }}>

            {PORTRAIT_FILES.map((src, id) => {
              const fileName = src;
              const isActive = activeSrc === src;
              return (
                <div
                  key={src}
                  className="relative group cursor-pointer"
                  onClick={() => onSelect(src)}
                >
                  <img
                    src={src}
                    loading="lazy"
                    draggable={false}
                    className={`
                      w-full h-auto block select-none cursor-pointer
                      transition-[filter] duration-700
                      ${ready ? "" : "invert grayscale-100"}
                    `}
                    style={{ borderRadius: 1 }}
                  />

                  <div
                  className="
                      absolute inset-0 flex items-center justify-center
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-300
                      backdrop-invert backdrop-grayscale
                      text-white mix-blend-difference
                    "
                >
                    {fileName}
                  </div>
                </div>
              );
            })}

          </Masonry>
        </ResponsiveMasonry>
      </div>
    </div>
  );
}
