import { create } from "zustand";

export type ManifestImage = {
  key: string;
  url: string;
  type: "title" | "image";
  order: number;
};

export type ManifestWork = {
  slug: string;
  cover: string | null;
  coverUrl: string | null;
  images: ManifestImage[];
  description?: string;
};

export type Manifest = {
  main: ManifestWork[];
  extra: ManifestWork[];
  portrait: ManifestWork[];
  non_portrait: ManifestWork[];
};

type ManifestState = {
  manifest: Manifest | null;
  loading: boolean;
  loaded: boolean;
  fetchManifest: () => Promise<void>;
};

export const useManifest = create<ManifestState>((set, get) => ({
  manifest: null,
  loading: false,
  loaded: false,

  fetchManifest: async () => {
    const { loaded, loading } = get();
    if (loaded || loading) return;

    set({ loading: true });

    try {
      const res = await fetch("https://cdnhnhyn.aggingkobe.com/manifest.json", {
        cache: "force-cache",
      });

      if (!res.ok) {
        throw new Error("manifest fetch failed");
      }

      const data = await res.json();

      set({
        manifest: data,
        loaded: true,
        loading: false,
      });
    } catch (e) {
      console.error(e);
      set({ loading: false });
    }
  },
}));