// components/commercial/CommercialMain.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { useNowArea } from "@/stores/nowArea";
import { useBeforeArea } from "@/stores/beforeArea";
import DraggableImage, { type DraggableItem } from "@/components/utils/draggable";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import SheetOverlay from "@/components/utils/SheetOverlay";
import ModeButton from "@/components/ui/modeButton";

const PortraitMasonry = dynamic(() => import("@/components/commercial/commercialList"), {
  ssr: false,
});
const FILES = [
  "/commercial/1.jpg",
  "/commercial/2.jpg",
  "/commercial/3.jpg",
  "/commercial/4.jpg",
  "/commercial/5.jpg",
  "/commercial/6.jpg",
  "/commercial/7.jpg",
];

export default function CommercialMain( {activeSrc, setActiveSrc }: { activeSrc: string | null; setActiveSrc: (src: string | null) => void } ) {
  const { nowArea } = useNowArea();
  const { beforeArea } = useBeforeArea();

  const [items, setItems] = useState<DraggableItem[]>([]);
  const [portraitOpen, setPortraitOpen] = useState(false);
  const openAfterEnterRef = useRef(false);
  const [portraitMode, setPortraitMode] = useState("");

  useEffect(() => {
    setItems(
      FILES.map((src, i) => ({
        id: i,
        src,
        x: 0,
        y: 0,
        rot: Math.random() * 45 - 10,
      }))
    );
  }, []);

  const resetPositions = useCallback(() => {
    setItems((prev) => {
      const shuffled = [...prev].sort(() => Math.random() - 0.5);
      return shuffled.map((it) => ({
        ...it,
        x: 0,
        y: 0,
        rot: Math.random() * 45 - 10,
      }));
    });
  }, []);

  useEffect(() => {
    // 페이지 전환으로 CommercialMain이 들어올 때(원하시면 여기 타이밍에 맞춰 열리도록)
    // bottom -> top 이동 케이스는 기존 로직 유지
    if (beforeArea === "bottomArea" && nowArea === "topArea") {
      const t = setTimeout(resetPositions, 500);
      return () => clearTimeout(t);
    }
    resetPositions();
  }, [nowArea, beforeArea, resetPositions]);

  const onDrag = useCallback((id: number, dx: number, dy: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, x: it.x + dx, y: it.y + dy } : it))
    );
  }, []);

  const openPortrait = () => {
    // CommercialMain이 이미 떠 있는 상태라면 바로 열림
    // 만약 nowArea 전환 직후에 누를 수 있다면, 아래 플래그로 딜레이 오픈도 가능
    if (nowArea === "bottomArea") {
      setPortraitOpen(true);
      return;
    }
    openAfterEnterRef.current = true;
  };

  // CommercialMain이 화면에 올라온 뒤에 자동 오픈(필요 없으면 이 useEffect 삭제)
  useEffect(() => {
    if (nowArea === "bottomArea" && openAfterEnterRef.current) {
      openAfterEnterRef.current = false;
      setPortraitOpen(true);
    }
  }, [nowArea]);

  return (
    <div className={` h-svh w-full flex justify-center items-center relative overflow-hidden transition-opacity duration-300`}>
<div className="absolute top-0 left-0 z-[47] w-full bg-white pt-[10px] pb-[20px]">
  {/* 가운데 고정 */}
  <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-[5vw]">
    <button
      onClick={() => {
        setPortraitMode("portrait");
        openPortrait();
      }}
      className="cursor-pointer pl-[40px]"
    >
      PORTRAIT
    </button>

    <button
      onClick={() => {
        setPortraitMode("portrait");
        setPortraitOpen(false);
      }}
      className="cursor-pointer"
    >
      NON_PORTRAIT
    </button>
  </div>

  {/* 오른쪽 고정 */}
      <ModeButton />
</div>

      {/* draggable 이미지들 */}
      <div
      
      style={{
    opacity: portraitMode !== "" ? 0 : 1,
    transition: "opacity 400ms ease",
    willChange: "opacity",
    pointerEvents: portraitMode !== "" ? "none" : "auto",
  }}>
        {  items.map((it) => (
          <DraggableImage
            key={it.id}
            item={it}
            onDrag={onDrag}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[32vw] md:w-[20vw]
          transition-[filter] duration-300
          
        `}

          />
        ))}
      </div>

      {/* masonry 패널: 아래 -> 위 */}
      <div
        className={`
          absolute left-0 bottom-0 w-full h-svh z-40
          transition-transform duration-700 ease-in-out
          ${portraitOpen ? "translate-y-0" : "translate-y-full pointer-events-none"}
        `}
      >
        <PortraitMasonry
      portraitOpen={portraitOpen}
      activeSrc={activeSrc}
      onSelect={(src) => setActiveSrc(src)}
    />
      </div>
      <SheetOverlay
    open={activeSrc !== null}
    onClose={() => setActiveSrc(null)}
  >
    {activeSrc && (
      <div className="flex justify-center items-center py-6">
        <img
          src={activeSrc}
          style={{ height: "50vh" }}
          className="w-auto object-contain"
          draggable={false}
        />
      </div>
    )}

    <div className="px-4 pb-10">
    </div>
</SheetOverlay>
    </div>
  );
}
