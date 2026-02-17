'use client';

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useNowArea } from "@/stores/nowArea";
import { useBeforeArea } from "@/stores/beforeArea";

const FILES = [
  "/commercial/1.jpg",
  "/commercial/2.jpg",
  "/commercial/3.jpg",
  "/commercial/4.jpg",
  "/commercial/5.jpg",
  "/commercial/6.jpg",
  "/commercial/7.jpg",
];

export default function CommercialMain() {
  const { nowArea } = useNowArea();
  const { beforeArea } = useBeforeArea();

  const [items, setItems] = useState<any[]>([]);

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


  // 영역 변경 시 위치만 초기화 (src 유지)
  useEffect(() => {
    if (beforeArea === "bottomArea" && nowArea === "topArea") {
      const t = setTimeout(resetPositions, 500);
      return () => clearTimeout(t);
    }
    resetPositions();
  }, [nowArea, beforeArea]);

  const resetPositions = () => {
    setItems(prev =>
      prev.map(it => ({
        ...it,
        x: 0,
        y: 0,
        rot: Math.random() * 45 - 10,
      }))
    );
  };

  const onDrag = useCallback((id: number, dx: number, dy: number) => {
    setItems(prev =>
      prev.map(it =>
        it.id === id ? { ...it, x: it.x + dx, y: it.y + dy } : it
      )
    );
  }, []);

  return (
    <div className="h-svh w-full flex justify-center items-center relative">
      <div className={`absolute top-[0] z-[47] `}>
        <span>2024</span>
        &nbsp;
        <span>2025</span>
        &nbsp;
        <span>2026</span>
        &nbsp;
      </div>
      {items.map(it => (
        <Draggable key={it.id} item={it} onDrag={onDrag} />
      ))}
    </div>
  );
}

const Draggable = memo(function Draggable({ item, onDrag }: any) {
  const ref = useRef<HTMLImageElement>(null);
  const start = useRef<any>(null);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent | TouchEvent) => {
      if (!start.current || !ref.current) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const dx = clientX - start.current.x;
      const dy = clientY - start.current.y;

      ref.current.style.transform =
        `translate(${item.x + dx}px, ${item.y + dy}px) rotate(${item.rot}deg)`;
    };

    const up = (e: MouseEvent | TouchEvent) => {
      setPressed(false);
      if (!start.current) return;

      const clientX =
        "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
      const clientY =
        "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;

      onDrag(item.id, clientX - start.current.x, clientY - start.current.y);
      start.current = null;
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [item, onDrag]);

  return (
    <img
      ref={ref}
      src={item.src}
      loading="eager"
      draggable={false}
      className={`
        transition-[filter] duration-300
        ${pressed ? "invert" : "hover:invert"}
        w-[32vw] md:w-[20vw] absolute
        cursor-grab active:cursor-grabbing
        select-none touch-none
      `}
      style={{
        transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rot}deg)`,
        willChange: "transform",
      }}
      onMouseDown={e => {
        e.preventDefault();
        setPressed(true);
        start.current = { x: e.clientX, y: e.clientY };
        ref.current?.parentElement?.appendChild(ref.current);
      }}
      onTouchStart={e => {
        setPressed(true);
        start.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        ref.current?.parentElement?.appendChild(ref.current);
      }}
    />
  );
});
