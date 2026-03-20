'use client';

import { memo, useEffect, useRef, useState } from "react";

export type DraggableItem = {
  id: number;
  src: string;
  x: number;
  y: number;
  rot: number;
  scale: number;
  z: number;
};

type Props = {
  item: DraggableItem;
  onMoveEnd: (id: number, nextX: number, nextY: number) => void;
  onBringToFront: (id: number) => void;
  className?: string;
};

type DragInfo = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

function DraggableImage({
  item,
  onMoveEnd,
  onBringToFront,
  className = "",
}: Props) {
  const [pos, setPos] = useState({ x: item.x, y: item.y });
  const [dragging, setDragging] = useState(false);

  const posRef = useRef({ x: item.x, y: item.y });
  const dragRef = useRef<DragInfo | null>(null);

  useEffect(() => {
    if (dragRef.current) return;

    const next = { x: item.x, y: item.y };
    posRef.current = next;
    setPos(next);
  }, [item.x, item.y]);

  const setLivePos = (next: { x: number; y: number }) => {
    posRef.current = next;
    setPos(next);
  };

  const getNextPos = (clientX: number, clientY: number) => {
    const drag = dragRef.current;
    if (!drag) return posRef.current;

    return {
      x: drag.originX + (clientX - drag.startX),
      y: drag.originY + (clientY - drag.startY),
    };
  };

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        zIndex: item.z,
        willChange: dragging ? "transform" : undefined,
      }}
    >
      <img
        src={item.src}
        alt=""
        draggable={false}
        className={`
          absolute left-0 top-0 block
          select-none touch-none
          cursor-grab active:cursor-grabbing
          ${
            dragging
              ? "invert hue-rotate-180 outline outline-1 outline-white"
              : "hover:invert hover:hue-rotate-180 hover:outline hover:outline-1 hover:outline-white"
          }
          ${className}
        `}
        style={{
          transform: `translate(-50%, -50%) rotate(${item.rot}deg) scale(${item.scale})`,
          transformOrigin: "center center",
          touchAction: "none",
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;

          e.preventDefault();
          onBringToFront(item.id);

          dragRef.current = {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            originX: posRef.current.x,
            originY: posRef.current.y,
          };

          setDragging(true);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const drag = dragRef.current;
          if (!drag || drag.pointerId !== e.pointerId) return;

          e.preventDefault();
          setLivePos(getNextPos(e.clientX, e.clientY));
        }}
        onPointerUp={(e) => {
          const drag = dragRef.current;
          if (!drag || drag.pointerId !== e.pointerId) return;

          e.preventDefault();

          const next = getNextPos(e.clientX, e.clientY);
          setLivePos(next);

          dragRef.current = null;
          setDragging(false);
          onMoveEnd(item.id, next.x, next.y);

          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        }}
        onPointerCancel={(e) => {
          const drag = dragRef.current;
          if (!drag || drag.pointerId !== e.pointerId) return;

          const rollback = { x: item.x, y: item.y };
          posRef.current = rollback;
          setPos(rollback);

          dragRef.current = null;
          setDragging(false);

          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        }}
        onLostPointerCapture={() => {
          if (!dragRef.current) return;

          const next = posRef.current;
          dragRef.current = null;
          setDragging(false);
          onMoveEnd(item.id, next.x, next.y);
        }}
      />
    </div>
  );
}

export default memo(DraggableImage);
