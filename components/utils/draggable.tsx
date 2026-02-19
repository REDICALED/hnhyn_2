// components/DraggableImage.tsx
'use client';

import { memo, useEffect, useRef, useState } from "react";

type DraggableItem = {
  id: number;
  src: string;
  x: number;
  y: number;
  rot: number;
};

type Props = {
  item: DraggableItem;
  onDrag: (id: number, dx: number, dy: number) => void;
  className?: string;
};

function DraggableImage({ item, onDrag, className = "" }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
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
      if (!start.current) return;

      setPressed(false);

      const clientX =
        "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
      const clientY =
        "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;

      onDrag(item.id, clientX - start.current.x, clientY - start.current.y);
      start.current = null;
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move as any);
      window.removeEventListener("touchend", up);
    };
  }, [item.id, item.x, item.y, item.rot, onDrag]);

  return (
    <img
      ref={ref}
      src={item.src}
      loading="eager"
      draggable={false}
      className={`
        transition-[filter] duration-300
        ${pressed ? "invert" : "hover:invert"}
        cursor-grab active:cursor-grabbing
        select-none touch-none
        ${className}
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
        start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        ref.current?.parentElement?.appendChild(ref.current);
      }}
    />
  );
}

export default memo(DraggableImage);
export type { DraggableItem };
