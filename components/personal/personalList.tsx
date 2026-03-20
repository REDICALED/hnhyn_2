'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useManifest, type ManifestImage } from "@/stores/manifest";

export type SelectedWork = {
  slug: string;
  category: "portrait" | "non_portrait" | "main" | "extra";
  images: ManifestImage[];
  description?: string;
};

type FileItem = {
  src: string;
  fileName: string;
  slug: string;
  images: ManifestImage[];
};

function LazyMasonryImage({
  src,
  alt,
  ready,
  isActive,
}: {
  src: string;
  alt: string;
  ready: boolean;
  isActive: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="w-full"
      style={{ minHeight: "12rem", borderRadius: 1, overflow: "hidden" }}
    >
      {shouldLoad ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          draggable={false}
          onLoad={() => setLoaded(true)}
          className={`
            w-full h-auto block select-none cursor-pointer transition-opacity duration-100
            ${ready ? "" : "invert grayscale-100"}
            ${isActive ? "opacity-100" : ""}
            ${loaded ? "opacity-100" : "opacity-0"}
          `}
          style={{ borderRadius: 1 }}
        />
      ) : (
        <div
          className={`w-full ${ready ? "" : "invert grayscale-100"}`}
          style={{
            minHeight: "12rem",
            borderRadius: 1,
            backgroundColor: "#efefef",
          }}
        />
      )}
    </div>
  );
}

export default function PersonalMasonry({
  mainOpen,
  activeSrc,
  onSelect,
  category = "main",
}: {
  mainOpen: boolean;
  activeSrc: string | null;
  onSelect: (work: SelectedWork) => void;
  category?: "main" | "extra";
}) {
  const [ready, setReady] = useState(false);
  const manifest = useManifest((s) => s.manifest);
  const fetchManifest = useManifest((s) => s.fetchManifest);
  const [visibleCount, setVisibleCount] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mainOpen) {
      setReady(false);
      return;
    }

    const t = setTimeout(() => setReady(true), 700);
    return () => clearTimeout(t);
  }, [mainOpen]);

  useEffect(() => {
    fetchManifest();
  }, [fetchManifest]);

  useEffect(() => {
    setVisibleCount(12);
  }, [category, mainOpen]);

  const allFiles = useMemo<FileItem[]>(() => {
    if (!manifest) return [];

    return (manifest[category] || [])
      .reverse()
      .map((work) => {
        const titleImage = work.images.find((img) => img.type === "title");
        if (!titleImage) return null;

        return {
          src: titleImage.url,
          fileName: titleImage.key,
          slug: work.slug,
          images: work.images,
        };
      })
      .filter((item): item is FileItem => item !== null);
  }, [manifest, category]);

  const files = useMemo(() => {
    return allFiles.slice(0, visibleCount);
  }, [allFiles, visibleCount]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    if (files.length >= allFiles.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 8, allFiles.length));
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [files.length, allFiles.length]);

  return (
    <div className="w-full h-full overflow-y-auto overscroll-contain pt-[41px] px-[40px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="pb-[16px]">
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 0: 2, 768: 3, 1024: 4 }}
          gutterBreakPoints={{ 0: "2px", 768: "4px", 1024: "6px" }}
        >
          <Masonry style={{ justifyContent: "center" }}>
            {files.map(({ src, fileName, slug, images }) => {
              const isActive = activeSrc === src;

              return (
                <div
                  key={slug}
                  className="relative group cursor-pointer"
                  onClick={() => onSelect({ slug, category, images })}
                >
                  <LazyMasonryImage
                    src={src}
                    alt={fileName}
                    ready={ready}
                    isActive={isActive}
                    description: "설명 테스트",
                  />

                  <div
                    className="
                      absolute top-0 left-0 w-full h-full
                      flex items-center justify-center
                      opacity-0 group-hover:opacity-100
                      backdrop-invert backdrop-grayscale
                      text-white mix-blend-difference
                      [-webkit-text-stroke:0.2px_black]
                      pointer-events-none
                    "
                  >
                    <div className="px-2 text-center break-all">
                      {fileName}
                    </div>
                  </div>
                </div>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>

        {files.length < allFiles.length && (
          <div ref={loadMoreRef} className="h-[1px] w-full" />
        )}
      </div>
    </div>
  );
}
