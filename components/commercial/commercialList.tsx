// components/personal/PortraitMasonry.tsx
'use client';

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const PORTRAIT_FILES = Array.from({ length: 13 }, (_, i) => `/commercial/portrait/${i + 1}.jpg`);

export default function PortraitMasonry() {
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
            {PORTRAIT_FILES.map((src) => (
              <img
                key={src}
                src={src}
                loading="lazy"
                draggable={false}
                className="w-full h-auto block select-none"
                style={{ borderRadius: 1 }}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </div>
  );
}
