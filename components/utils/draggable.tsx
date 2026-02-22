'use client';

import { memo, useEffect, useRef, useState } from "react";

type DraggableItem = { id: number; src: string; x: number; y: number; rot: number; };

type Props = {
  item: DraggableItem;
  onDrag: (id: number, dx: number, dy: number) => void;
  className?: string;
};

function DraggableImage({ item, onDrag, className = "" }: Props) {
  const ref = useRef<HTMLImageElement>(null);

  const start = useRef<{ x: number; y: number } | null>(null);
  const base = useRef<{ x: number; y: number }>({ x: item.x, y: item.y }); // 드래그 시작 시 기준
  const live = useRef<{ x: number; y: number }>({ x: item.x, y: item.y }); // 드래그 중 실시간 좌표

  const [pressed, setPressed] = useState(false);

  // 외부에서 item.x/y가 바뀌면 live도 동기화
  useEffect(() => {
    if (!pressed) {
      live.current = { x: item.x, y: item.y };
      base.current = { x: item.x, y: item.y };
    }
  }, [item.x, item.y, pressed]);

  const applyTransform = (x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `translate(${x}px, ${y}px) rotate(${item.rot}deg)`;
  };

  return (
    <img
      ref={ref}
      src={item.src}
      loading="eager"
      draggable={false}
      className={`
      transition-[filter] duration-300
      ${pressed
        ? "invert hue-rotate-180"
        : "hover:invert hover:hue-rotate-180"}
      cursor-grab active:cursor-grabbing
      select-none touch-none
      ${className}
    `}
      style={{
        transform: `translate(${live.current.x}px, ${live.current.y}px) rotate(${item.rot}deg)`,
        willChange: "transform",
      }}
      onPointerDown={(e) => {
        const el = ref.current;
        if (!el) return;

        e.preventDefault();
        setPressed(true);

        // 포인터 캡쳐: 손가락/마우스가 밖으로 나가도 계속 이벤트 받음
        el.setPointerCapture(e.pointerId);

        start.current = { x: e.clientX, y: e.clientY };
        base.current = { x: live.current.x, y: live.current.y };

        el.parentElement?.appendChild(el);
      }}
      onPointerMove={(e) => {
        if (!start.current) return;

        e.preventDefault();

        const dx = e.clientX - start.current.x;
        const dy = e.clientY - start.current.y;

        const x = base.current.x + dx;
        const y = base.current.y + dy;

        live.current = { x, y };
        applyTransform(x, y);
      }}
      onPointerUp={(e) => {
        const el = ref.current;
        if (!start.current || !el) return;

        e.preventDefault();
        setPressed(false);

        const dx = e.clientX - start.current.x;
        const dy = e.clientY - start.current.y;

        start.current = null;

        // 최종 반영은 기존대로 onDrag에서 부모 상태 업데이트
        onDrag(item.id, dx, dy);
      }}
      onPointerCancel={() => {
        start.current = null;
        setPressed(false);
      }}
    />
  );
}

export default memo(DraggableImage);
export type { DraggableItem };