'use client';

import { memo, useEffect, useRef, useState } from 'react';

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

function DraggableImage({ item, onDrag, className = '' }: Props) {
  const pointerIdRef = useRef<number | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const baseRef = useRef<{ x: number; y: number }>({ x: item.x, y: item.y });

  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: item.x, y: item.y });

  useEffect(() => {
    if (dragging) return;
    setPos({ x: item.x, y: item.y });
    baseRef.current = { x: item.x, y: item.y };
  }, [item.x, item.y]);

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e: PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId) return;
      if (!startRef.current) return;

      e.preventDefault();

      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;

      setPos({
        x: baseRef.current.x + dx,
        y: baseRef.current.y + dy,
      });
    };

    const handleUp = (e: PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId) return;
      if (!startRef.current) return;

      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;

      const nextX = baseRef.current.x + dx;
      const nextY = baseRef.current.y + dy;

      setPos({ x: nextX, y: nextY });
      baseRef.current = { x: nextX, y: nextY };

      pointerIdRef.current = null;
      startRef.current = null;
      setDragging(false);

      onDrag(item.id, dx, dy);
    };

    const handleCancel = (e: PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId) return;

      setPos({ x: baseRef.current.x, y: baseRef.current.y });

      pointerIdRef.current = null;
      startRef.current = null;
      setDragging(false);
    };

    window.addEventListener('pointermove', handleMove, { passive: false });
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleCancel);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleCancel);
    };
  }, [dragging, item.id, onDrag]);

  return (
    <div
      className={`
        absolute left-0 top-0
        select-none touch-none
        cursor-grab active:cursor-grabbing
        ${dragging ? 'ring-1 ring-white' : 'hover:ring-1 hover:ring-white'}
        ${className}
      `}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${item.rot}deg) scale(${item.scale})`,
        transformOrigin: 'center center',
        willChange: 'transform',
        zIndex: dragging ? 999 : undefined,
      }}
      onPointerDown={(e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        e.preventDefault();

        pointerIdRef.current = e.pointerId;
        startRef.current = { x: e.clientX, y: e.clientY };
        baseRef.current = { x: pos.x, y: pos.y };

        setDragging(true);
      }}
    >
      <img
        src={item.src}
        alt=""
        draggable={false}
        className="block w-full h-auto pointer-events-none select-none"
      />
    </div>
  );
}

export default memo(DraggableImage);
export type { DraggableItem };