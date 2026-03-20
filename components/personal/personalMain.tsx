'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { useNowArea } from "@/stores/nowArea";
import { useBeforeArea } from "@/stores/beforeArea";
import DraggableImage, { type DraggableItem } from "@/components/utils/draggable";
import dynamic from "next/dynamic";
import SheetOverlay from "@/components/utils/SheetOverlay";
import ModeButton from "@/components/ui/modeButton";
import type { SelectedWork } from "@/components/personal/personalList";

type PersonalListProps = {
  mainOpen: boolean;
  activeSrc: string | null;
  onSelect: (work: SelectedWork) => void;
  category?: "main" | "extra";
};

const MainMasonry = dynamic<PersonalListProps>(
  () => import("@/components/personal/personalList"),
  { ssr: false }
);

const FILES = [
  "/personal/1.jpg",
  "/personal/2.jpg",
  "/personal/3.jpg",
  "/personal/4.jpg",
  "/personal/5.jpg",
  "/personal/6.jpg",
  "/personal/7.jpg",
  "/personal/8.jpg",
  "/personal/9.jpg",
  "/personal/10.jpg",
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
  const match = slug.match(/^(\d{2})_?(.+)?$/);

  const year = match ? `20${match[1]}` : "";
  const name = match && match[2]
    ? match[2].replace(/_/g, "").toUpperCase()
    : "";

  return {
    route: `: PERSONAL / ${work.category.toUpperCase()} / ${year}_${name}`,
    title: `${name}, ${year}`,
    description: "",
  };
}

export default function PersonalMain({
  activeWork,
  setActiveWork,
}: {
  activeWork: SelectedWork | null;
  setActiveWork: (work: SelectedWork | null) => void;
}) {
  const { nowArea } = useNowArea();
  const { beforeArea } = useBeforeArea();

  const [items, setItems] = useState<DraggableItem[]>([]);
  const [mainOpen, setMainOpen] = useState(false);
  const openAfterEnterRef = useRef(false);
  const [mainMode, setMainMode] = useState<"main" | "extra" | "">("");

  useEffect(() => {
    setItems(
      FILES.map((src, i) => ({
        id: i,
        src,
        x: 0,
        y: 0,
        rot: Math.random() * 160 - 80,
        scale: Math.random() * 0.4 + 0.8,
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
        rot: Math.random() * 160 - 80,
        scale: Math.random() * 0.4 + 0.8,
      }));
    });
  }, []);

  useEffect(() => {
    if (beforeArea === "topArea" && nowArea === "bottomArea") {
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

  const openMain = (mode: "main" | "extra") => {
    setMainMode(mode);

    if (nowArea === "topArea") {
      setMainOpen(true);
      return;
    }

    openAfterEnterRef.current = true;
  };

  useEffect(() => {
    if (nowArea === "topArea" && openAfterEnterRef.current) {
      openAfterEnterRef.current = false;
      setMainOpen(true);
    }
  }, [nowArea]);

  const activeTitleSrc =
    activeWork?.images.find((img) => img.type === "title")?.url || null;

  const { route, title, description } = getWorkMeta(activeWork);

  return (
    <div className="h-svh w-full flex justify-center items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 z-[9999] bg-white w-full pt-[10px] pb-[31px]">
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-[5vw]">
          <button
            onClick={() => openMain("main")}
            className="cursor-pointer pl-[40px]"
          >
            main
          </button>

          <button
            onClick={() => openMain("extra")}
            className="cursor-pointer"
          >
            extra
          </button>
        </div>

        <ModeButton />
      </div>

      <div
        style={{
          opacity: mainMode !== "" ? 0 : 1,
          transition: "",
          willChange: "",
          pointerEvents: mainMode !== "" ? "none" : "auto",
        }}
      >
        {items.map((it) => (
          <DraggableImage
            key={it.id}
            item={it}
            onDrag={onDrag}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[32vw] md:w-[25vw]"
          />
        ))}
      </div>

      <div
        className={`
          absolute left-0 bottom-0 w-full h-svh z-40
          ${mainOpen ? "translate-y-0" : "translate-y-full pointer-events-none"}
        `}
      >
        <MainMasonry
          mainOpen={mainOpen}
          activeSrc={activeTitleSrc}
          onSelect={(work) => setActiveWork(work)}
          category={mainMode === "extra" ? "extra" : "main"}
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
