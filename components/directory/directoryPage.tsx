'use client';

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useManifest, type ManifestWork } from "@/stores/manifest";

type DirectorySection = {
  label: ":commercial" | ":personal";
  groups: DirectoryGroup[];
};

type DirectoryGroup = {
  label: string;
  works: ManifestWork[];
};

type PreviewImage = {
  id: string;
  url: string;
  name: string;
};

type StackedPreviewImage = PreviewImage & {
  x: number;
  y: number;
  rotate: number;
  z: number;
};

const DATE_LABEL = "2025.00.00";
const DIRECTORY_GRID =
  "grid grid-cols-[minmax(115px,0.9fr)_24px_minmax(150px,0.85fr)_24px_minmax(170px,1fr)_24px_minmax(170px,1.2fr)_24px_110px] gap-x-[18px] items-start";

function imageName(key: string) {
  return key.split("/").pop() || key;
}

function representativeImage(work: ManifestWork) {
  return (
    work.images.find((image) => image.type === "title")?.url ||
    work.coverUrl ||
    work.images[0]?.url ||
    null
  );
}

function DirectoryWork({
  work,
  active,
  onToggle,
  onPreviewWork,
}: {
  work: ManifestWork;
  active: boolean;
  onToggle: () => void;
  onPreviewWork: (preview: PreviewImage) => void;
}) {
  const images = [...work.images].sort((a, b) => a.order - b.order);
  const representativeUrl = representativeImage(work);

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`${DIRECTORY_GRID} w-full text-left cursor-pointer hover:underline`}
      >
        <span />
        <span />
        <span />
        <span>/</span>
        <span>{work.slug}</span>
        <span>/</span>
        <span />
        <span>/</span>
        <span>{DATE_LABEL}</span>
      </button>

      <div className={active ? "" : "hidden"}>
        {images.map((image) => {
          const name = imageName(image.key);

          return (
            <button
              key={image.key}
              type="button"
              onMouseEnter={() => {
                onPreviewWork({
                  id: work.slug,
                  url: representativeUrl || image.url,
                  name: work.slug,
                });
              }}
              className={`${DIRECTORY_GRID} w-full text-left cursor-pointer hover:underline`}
            >
              <span />
              <span />
              <span />
              <span />
              <span />
              <span>/</span>
              <span>{name}</span>
              <span>/</span>
              <span>{DATE_LABEL}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DirectoryGroupBlock({
  section,
  group,
  active,
  activeWork,
  onToggleGroup,
  onToggleWork,
  onPreviewWork,
}: {
  section: string;
  group: DirectoryGroup;
  active: boolean;
  activeWork: string | null;
  onToggleGroup: () => void;
  onToggleWork: (group: string, slug: string) => void;
  onPreviewWork: (preview: PreviewImage) => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggleGroup}
        className={`${DIRECTORY_GRID} w-full text-left cursor-pointer hover:underline`}
      >
        <span>{section}</span>
        <span>/</span>
        <span>{group.label}</span>
        <span>/</span>
        <span />
        <span>/</span>
        <span />
        <span>/</span>
        <span>{DATE_LABEL}</span>
      </button>

      <div className={active ? "mt-[38px]" : "hidden"}>
        {group.works.map((work) => (
          <DirectoryWork
            key={work.slug}
            work={work}
            active={activeWork === `${section}/${group.label}/${work.slug}`}
            onToggle={() => onToggleWork(group.label, work.slug)}
            onPreviewWork={onPreviewWork}
          />
        ))}
      </div>
    </div>
  );
}

function DirectoryHalf({
  section,
  activeGroup,
  activeWork,
  onToggleGroup,
  onToggleWork,
  onPreviewWork,
}: {
  section: DirectorySection;
  activeGroup: string | null;
  activeWork: string | null;
  onToggleGroup: (group: string) => void;
  onToggleWork: (group: string, slug: string) => void;
  onPreviewWork: (preview: PreviewImage) => void;
}) {
  return (
    <section className="overflow-hidden">
      <div className="h-full overflow-y-auto px-[8vw] py-[10px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="min-w-[960px]">
          {section.groups.map((group) => (
            <div
              key={`${section.label}-${group.label}`}
              className="mb-[44px]"
            >
              <DirectoryGroupBlock
                section={section.label}
                group={group}
                active={activeGroup === `${section.label}/${group.label}`}
                activeWork={activeWork}
                onToggleGroup={() => onToggleGroup(group.label)}
                onToggleWork={onToggleWork}
                onPreviewWork={onPreviewWork}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PREVIEW_PLACEMENTS = [
  { x: -46, y: -32, rotate: -18 },
  { x: 32, y: -26, rotate: 21 },
  { x: -24, y: 20, rotate: 13 },
  { x: 38, y: 26, rotate: -24 },
  { x: 0, y: 0, rotate: 7 },
];

function PreviewStack({ previews }: { previews: StackedPreviewImage[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center">
      <div className="relative h-[210px] w-[210px]">
        {previews.map((preview) => (
          <Image
            key={`${preview.id}-${preview.z}`}
            src={preview.url}
            alt={preview.name}
            width={210}
            height={270}
            className="absolute left-1/2 top-1/2 h-[170px] w-auto object-cover shadow-sm"
            style={{
              zIndex: preview.z,
              transform: `translate(calc(-50% + ${preview.x}px), calc(-50% + ${preview.y}px)) rotate(${preview.rotate}deg)`,
            }}
            unoptimized
          />
        ))}
      </div>
    </div>
  );
}

export default function DirectoryPage() {
  const manifest = useManifest((state) => state.manifest);
  const fetchManifest = useManifest((state) => state.fetchManifest);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [activeWork, setActiveWork] = useState<string | null>(null);
  const [previews, setPreviews] = useState<StackedPreviewImage[]>([]);

  useEffect(() => {
    fetchManifest();
  }, [fetchManifest]);

  const sections = useMemo<DirectorySection[]>(() => {
    return [
      {
        label: ":commercial",
        groups: [
          { label: "1portrait", works: manifest?.portrait ?? [] },
          { label: "2non_portrait", works: manifest?.non_portrait ?? [] },
        ],
      },
      {
        label: ":personal",
        groups: [
          { label: "1main", works: manifest?.main ?? [] },
          { label: "2extra", works: manifest?.extra ?? [] },
        ],
      },
    ];
  }, [manifest]);

  const toggleGroup = (section: string, group: string) => {
    const key = `${section}/${group}`;

    setActiveGroup((current) => (current === key ? null : key));
    setActiveWork(null);
  };

  const toggleWork = (section: string, group: string, slug: string) => {
    const key = `${section}/${group}/${slug}`;

    setActiveWork((current) => (current === key ? null : key));
  };

  const stackPreview = (preview: PreviewImage) => {
    setPreviews((current) => {
      const withoutSameWork = current.filter((item) => item.id !== preview.id);
      const z = Math.max(0, ...withoutSameWork.map((item) => item.z)) + 1;
      const placement = PREVIEW_PLACEMENTS[(z - 1) % PREVIEW_PLACEMENTS.length];
      const next = [
        ...withoutSameWork,
        {
          ...preview,
          ...placement,
          z,
        },
      ];

      return next.slice(-5);
    });
  };

  return (
    <main className="absolute inset-0 h-svh w-screen overflow-hidden bg-white text-[16px] font-[400]">
      <div className="absolute left-[25px] right-[25px] top-0 bottom-0 grid grid-rows-[1fr_auto_1fr]">
        <DirectoryHalf
          section={sections[0]}
          activeGroup={activeGroup}
          activeWork={activeWork}
          onToggleGroup={(group) => toggleGroup(sections[0].label, group)}
          onToggleWork={(group, slug) => toggleWork(sections[0].label, group, slug)}
          onPreviewWork={stackPreview}
        />
        <div className="h-px w-full bg-black" />
        <DirectoryHalf
          section={sections[1]}
          activeGroup={activeGroup}
          activeWork={activeWork}
          onToggleGroup={(group) => toggleGroup(sections[1].label, group)}
          onToggleWork={(group, slug) => toggleWork(sections[1].label, group, slug)}
          onPreviewWork={stackPreview}
        />
      </div>

      {previews.length > 0 && <PreviewStack previews={previews} />}

      <div className="fixed bottom-[18px] left-[54px] z-[60] flex items-center gap-[16px]">
        <span className="h-[10px] w-[10px] rounded-full bg-red-600" />
        <span>En / kr</span>
      </div>

      <div className="fixed top-[16px] right-[54px] z-[60] flex items-center gap-[18px]">
        <span className="h-[10px] w-[10px] rounded-full bg-red-600" />
        <span>On / Off</span>
      </div>

      <Link href="/" className="fixed bottom-6 right-16 z-[60]">
        <Image
          src="/Logo_Main.svg"
          alt="HANHYEON"
          width={120}
          height={120}
          className="w-32"
          draggable={false}
        />
      </Link>
    </main>
  );
}
