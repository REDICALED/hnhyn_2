'use client';

import { memo, useEffect, useRef, useState } from "react";

type DraggableItem = {
  id: number;
  src: string;
  x: number;
  y: number;
  rot: number;
  scale: number;
};

type Props = {
  item: DraggableItem;
  onDrag: (id: number, dx: number, dy: number) => void;
  className?: string;
};

function DraggableImage({ item, onDrag, className = "" }: Props) {
  const ref = useRef<HTMLImageElement>(null);

  const startRef = useRef<{ x: number; y: number } | null>(null);
  const baseRef = useRef<{ x: number; y: number }>({ x: item.x, y: item.y });
  const liveRef = useRef<{ x: number; y: number }>({ x: item.x, y: item.y });
  const pointerIdRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const [pressed, setPressed] = useState(false);

  const paint = (x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      `translate3d(${x}px, ${y}px, 0) rotate(${item.rot}deg) scale(${item.scale})`;
  };

  const schedulePaint = (x: number, y: number) => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      paint(x, y);
      rafRef.current = null;
    });
  };

  useEffect(() => {
    if (!pressed) {
      liveRef.current = { x: item.x, y: item.y };
      baseRef.current = { x: item.x, y: item.y };
      paint(item.x, item.y);
    }
  }, [item.x, item.y, item.rot, item.scale, pressed]);

  useEffect(() => {
    if (!pressed) return;

    const handleMove = (e: PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId) return;
      if (!startRef.current) return;

      e.preventDefault();

      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;

      const nextX = baseRef.current.x + dx;
      const nextY = baseRef.current.y + dy;

      liveRef.current = { x: nextX, y: nextY };
      schedulePaint(nextX, nextY);
    };

    const finishDrag = (e: PointerEvent, cancelled: boolean) => {
      if (pointerIdRef.current !== e.pointerId) return;

      const start = startRef.current;
      if (!start) return;

      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;

      const el = ref.current;
      if (el && el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }

      if (cancelled) {
        liveRef.current = { ...baseRef.current };
        schedulePaint(baseRef.current.x, baseRef.current.y);
      } else {
        const finalX = baseRef.current.x + dx;
        const finalY = baseRef.current.y + dy;
        liveRef.current = { x: finalX, y: finalY };
        schedulePaint(finalX, finalY);
        onDrag(item.id, dx, dy);
      }

      startRef.current = null;
      pointerIdRef.current = null;
      setPressed(false);
    };

    const handleUp = (e: PointerEvent) => {
      finishDrag(e, false);
    };

    const handleCancel = (e: PointerEvent) => {
      finishDrag(e, true);
    };

    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleCancel);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleCancel);
    };
  }, [pressed, item.id, onDrag]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <img
      ref={ref}
      src={item.src}
      loading="eager"
      draggable={false}
      className={`
        ${pressed
          ? "invert hue-rotate-180 ring-1 ring-white"
          : "hover:invert hover:hue-rotate-180 hover:ring-1 hover:ring-white"}
        cursor-grab active:cursor-grabbing
        select-none touch-none
        ${className}
      `}
      style={{
        transform: `translate3d(${liveRef.current.x}px, ${liveRef.current.y}px, 0) rotate(${item.rot}deg) scale(${item.scale})`,
        willChange: "transform",
        zIndex: pressed ? 999 : 1,
      }}
      onPointerDown={(e) => {
        const el = ref.current;
        if (!el) return;

        e.preventDefault();

        pointerIdRef.current = e.pointerId;
        startRef.current = { x: e.clientX, y: e.clientY };
        baseRef.current = { x: liveRef.current.x, y: liveRef.current.y };

        el.setPointerCapture(e.pointerId);
        setPressed(true);
      }}
    />
  );
}

export default memo(DraggableImage);
export type { DraggableItem };