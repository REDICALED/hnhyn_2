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
  const [start, setStart] = useState<any>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!start) return;
      onDrag(item.id, e.clientX - start.x, e.clientY - start.y);
      setStart({ x: e.clientX, y: e.clientY });
    };

    const up = () => setStart(null);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [start]);

  return (
    <img
      src={item.src}
      className="h-[50vh] absolute cursor-grab active:cursor-grabbing select-none"
      style={{
        transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rot}deg)`,
      }}
      onMouseDown={e => {
        setStart({ x: e.clientX, y: e.clientY });
        bringFront(item.id);
      }}
      draggable={false}
    />
  );
}
