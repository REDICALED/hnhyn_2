import { useState, useEffect } from "react";
import { useNowArea } from "@/stores/nowArea";
import { useBeforeArea } from "@/stores/beforeArea";

export default function CommercialMain() {
  const { nowArea } = useNowArea();
  const { beforeArea, setBeforeArea } = useBeforeArea();

  const [items, setItems] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
  if (!mounted) return;

  const run = () => {
    const files = [
      "/commercial/1.jpg",
      "/commercial/2.jpg",
      "/commercial/3.jpg",
      "/commercial/4.jpg",
      "/commercial/5.jpg",
      "/commercial/6.jpg",
      "/commercial/7.jpg",
    ];

    setItems(
      files
        .sort(() => Math.random() - 0.5)
        .map((src, i) => ({
          id: i,
          src,
          x: 0,
          y: 0,
          rot: Math.random() * 30 - 10,
        }))
    );
  };

  // bottom → top 일 때만 500ms 지연
  if (beforeArea === "bottomArea" && nowArea === "topArea") {
    const timer = setTimeout(run, 500);
    return () => clearTimeout(timer);
  }

  // 나머지는 즉시
  run();

}, [nowArea, mounted, beforeArea]);



  const onDrag = (id: number, dx: number, dy: number) => {
    setItems(prev =>
      prev.map(it =>
        it.id === id ? { ...it, x: it.x + dx, y: it.y + dy } : it
      )
    );
  };

  const bringFront = (id: number) => {
    setItems(prev => {
      const target = prev.find(it => it.id === id);
      const rest = prev.filter(it => it.id !== id);
      return [...rest, target];
    });
  };

  if (!mounted) return null;

  return (
    <div className="h-[100vh] w-full flex justify-center items-center relative">
      {items.map(it => (
        <Draggable
          key={it.id}
          item={it}
          onDrag={onDrag}
          bringFront={bringFront}
        />
      ))}
    </div>
  );
}

function Draggable({ item, onDrag, bringFront }: any) {
  const ref = useRef<HTMLImageElement>(null);
  const start = useRef<any>(null);

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

      const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
      const clientY = "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;

      onDrag(
        item.id,
        clientX - start.current.x,
        clientY - start.current.y
      );

      start.current = null;
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [item]);

  return (
    <img
      ref={ref}
      src={item.src}
      className="h-[50vh] absolute cursor-grab active:cursor-grabbing select-none touch-none"
      style={{
        transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rot}deg)`,
      }}
      onMouseDown={e => {
        start.current = { x: e.clientX, y: e.clientY };
        bringFront(item.id);
      }}
      onTouchStart={e => {
        start.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        bringFront(item.id);
      }}
      draggable={false}
    />
  );
}


