'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { useNowArea } from "@/stores/nowArea";
import { useBeforeArea } from "@/stores/beforeArea";
import DraggableImage, { type DraggableItem } from "@/components/utils/draggable";
import dynamic from "next/dynamic";
import SheetOverlay from "@/components/utils/SheetOverlay";
import ModeButton from "@/components/ui/modeButton";
import type { SelectedWork } from "@/components/commercial/commercialList";

type CommercialListProps = {
  portraitOpen: boolean;
  activeSrc: string | null;
  onSelect: (work: SelectedWork) => void;
  category?: "portrait" | "non_portrait";
};

const PortraitMasonry = dynamic<CommercialListProps>(
  () => import("@/components/commercial/commercialList"),
  { ssr: false }
);

const FILES = [
  "/commercial/1.jpg",
  "/commercial/2.jpg",
  "/commercial/3.jpg",
  "/commercial/4.jpg",
  "/commercial/5.jpg",
  "/commercial/6.jpg",
  "/commercial/7.jpg",
  "/commercial/8.jpg",
  "/commercial/9.jpg",
  "/commercial/10.jpg",
];

function getWorkMeta(work: SelectedWork | null) {
  if (!work) {
    return {
      route: "",
      title: "",
      description: "",
    };
  }

  const slug = work.slug.toLowerCase();

  // 25_tony / 25tony 둘 다 대응
  const match = slug.match(/^(\d{2})_?(.+)?$/);

  const year = match ? `20${match[1]}` : "";
  const name = match && match[2]
    ? match[2].replace(/_/g, "").toUpperCase()
    : "";

  return {
    route: `: COMMERCIAL / ${work.category.toUpperCase()} / ${year}_${name}`,
    title: `${name}, ${year}`,
    description: "",
  };
}

export default function CommercialMain({
  activeWork,
  setActiveWork,
}: {
  activeWork: SelectedWork | null;
  setActiveWork: (work: SelectedWork | null) => void;
}) {
  const { nowArea } = useNowArea();
  const { beforeArea } = useBeforeArea();

  const [items, setItems] = useState<DraggableItem[]>([]);
  const [portraitOpen, setPortraitOpen] = useState(false);
  const openAfterEnterRef = useRef(false);
  const [portraitMode, setPortraitMode] = useState<"portrait" | "non_portrait" | "">("");

  useEffect(() => {
  setItems(
    FILES.map((src, i) => ({
      id: i,
      src,
      x: 0,
      y: 0,
      rot: Math.random() * 160 - 80,
      scale: Math.random() * 0.4 + 0.8,
      z: i + 1,
    }))
  );
}, []);

  const resetPositions = useCallback(() => {
  setItems((prev) => {
    const shuffled = [...prev].sort(() => Math.random() - 0.5);

    return shuffled.map((it, index) => ({
      ...it,
      x: 0,
      y: 0,
      rot: Math.random() * 160 - 80,
      scale: Math.random() * 0.4 + 0.8,
      z: index + 1,
    }));
  });
}, []);

  useEffect(() => {
    if (beforeArea === "bottomArea" && nowArea === "topArea") {
      const t = setTimeout(resetPositions, 500);
      return () => clearTimeout(t);
    }
    resetPositions();
  }, [nowArea, beforeArea, resetPositions]);

  const bringToFront = useCallback((id: number) => {
  setItems((prev) => {
    const maxZ = Math.max(0, ...prev.map((it) => it.z));
    return prev.map((it) =>
      it.id === id ? { ...it, z: maxZ + 1 } : it
    );
  });
}, []);

const onMoveEnd = useCallback((id: number, nextX: number, nextY: number) => {
  setItems((prev) =>
    prev.map((it) =>
      it.id === id ? { ...it, x: nextX, y: nextY } : it
    )
  );
}, []);

  const openPortrait = (mode: "portrait" | "non_portrait") => {
    setPortraitMode(mode);

    if (nowArea === "bottomArea") {
      setPortraitOpen(true);
      return;
    }

    openAfterEnterRef.current = true;
  };

  useEffect(() => {
    if (nowArea === "bottomArea" && openAfterEnterRef.current) {
      openAfterEnterRef.current = false;
      setPortraitOpen(true);
    }
  }, [nowArea]);

  const activeTitleSrc =
    activeWork?.images.find((img) => img.type === "title")?.url || null;
    const { route, title, description } = getWorkMeta(activeWork);

  return (
    <div className="h-svh w-full flex justify-center items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 z-[9999] bg-white w-full pt-[10px] pb-[31px] ">
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-[5vw]">
          <button
            onClick={() => openPortrait("portrait")}
            className="cursor-pointer pl-[40px]"
          >
            Portrait
          </button>

          <button
            onClick={() => openPortrait("non_portrait")}
            className="cursor-pointer"
          >
            Non_Portrait
          </button>
        </div>

        <ModeButton />
      </div>

      <div
        style={{
          opacity: portraitMode !== "" ? 0 : 1,
          transition: "",
          willChange: "",
          pointerEvents: portraitMode !== "" ? "none" : "auto",
        }}
      >
        {items.map((it) => (
          <DraggableImage
            key={it.id}
            item={it}
            onDrag={onDrag}
            className=" w-[32vw] md:w-[25vw]"
          />
        ))}
      </div>

      <div
        className={`
          absolute left-0 bottom-0 w-full h-svh z-40
          ${portraitOpen ? "translate-y-0" : "translate-y-full pointer-events-none"}
        `}
      >
        <PortraitMasonry
          portraitOpen={portraitOpen}
          activeSrc={activeTitleSrc}
          onSelect={(work) => setActiveWork(work)}
          category={portraitMode === "non_portrait" ? "non_portrait" : "portrait"}
        />
      </div>

      <SheetOverlay
        open={activeWork !== null}
        onClose={() => setActiveWork(null)}
        route={route}
        title={title}
        description={description}
      >
        {activeWork && (
          <div className="flex flex-col gap-[6px] py-6">
            {[...activeWork.images]
              .sort((a, b) => a.order - b.order)
              .map((img) => (
                <div key={img.key} className="flex justify-center items-center">
                  <img
                    src={img.url}
                    style={{
                      maxWidth: "80vw",
                      maxHeight: "70vh",
                    }}
                    className="h-auto object-contain"
                    draggable={false}
                  />
                </div>
              ))}
          </div>
        )}

        <div className="px-4 pb-10" />
      </SheetOverlay>
    </div>
  );
}
