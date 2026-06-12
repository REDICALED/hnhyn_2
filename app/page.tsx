'use client'
  import TopArea from "@/components/main/topArea";
  import MiddleArea from "@/components/main/middleArea";
  import BottomArea from "@/components/main/bottomArea";
  import CommercialMain from "@/components/commercial/commercialMain";
import { useNowArea } from "@/stores/nowArea"
import { useBeforeArea } from "@/stores/beforeArea"
import PersonalMain from "@/components/personal/personalMain";
import { useCallback, useEffect, useState } from "react";
import type { SelectedWork } from "@/components/commercial/commercialList";
import { useManifest } from "@/stores/manifest";

type RouteSection = "personal" | "commercial" | null;
type RouteCategory = "portrait" | "non_portrait" | "main" | "extra" | null;

type RouteState = {
  section: RouteSection;
  category: RouteCategory;
  work: string | null;
};

function readRouteState(): RouteState {
  if (typeof window === "undefined") {
    return { section: null, category: null, work: null };
  }

  const params = new URLSearchParams(window.location.search);
  const section = params.get("section");
  const category = params.get("category");

  return {
    section: section === "personal" || section === "commercial" ? section : null,
    category:
      category === "portrait" ||
      category === "non_portrait" ||
      category === "main" ||
      category === "extra"
        ? category
        : null,
    work: params.get("work"),
  };
}

function routeUrl(route: RouteState) {
  const params = new URLSearchParams();

  if (route.section) params.set("section", route.section);
  if (route.category) params.set("category", route.category);
  if (route.work) params.set("work", route.work);

  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export default function Page() {
  const { nowArea, setNowArea } = useNowArea();
  const { beforeArea, setBeforeArea } = useBeforeArea();
  const manifest = useManifest((state) => state.manifest);
  const fetchManifest = useManifest((state) => state.fetchManifest);
  const [activeWork, setActiveWork] = useState<SelectedWork | null>(null);
  const [routeState, setRouteState] = useState<RouteState>({
    section: null,
    category: null,
    work: null,
  });
  const [logoHover, setLogoHover] = useState(false);

  useEffect(() => {
    fetchManifest();
  }, [fetchManifest]);

  useEffect(() => {
    const syncRoute = () => setRouteState(readRouteState());

    syncRoute();
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  useEffect(() => {
    const targetArea =
      routeState.section === "personal"
        ? "topArea"
        : routeState.section === "commercial"
          ? "bottomArea"
          : "middleArea";

    if (nowArea !== targetArea) {
      setBeforeArea(nowArea);
      setNowArea(targetArea);
    }
  }, [nowArea, routeState.section, setBeforeArea, setNowArea]);

  useEffect(() => {
    if (!routeState.category || !routeState.work || !manifest) {
      setActiveWork(null);
      return;
    }

    const works = manifest[routeState.category] || [];
    const work = works.find((item) => item.slug === routeState.work);

    if (!work) {
      setActiveWork(null);
      return;
    }

    setActiveWork({
      slug: work.slug,
      category: routeState.category,
      images: work.images,
      description: work.description,
    });
  }, [manifest, routeState.category, routeState.work]);

  const navigateRoute = useCallback((nextRoute: RouteState, replace = false) => {
    const nextUrl = routeUrl(nextRoute);

    if (replace) {
      window.history.replaceState(null, "", nextUrl);
    } else {
      window.history.pushState(null, "", nextUrl);
    }

    setRouteState(nextRoute);
  }, []);

  const commercialCategory =
    routeState.section === "commercial" &&
    (routeState.category === "portrait" || routeState.category === "non_portrait")
      ? routeState.category
      : null;

  const personalCategory =
    routeState.section === "personal" &&
    (routeState.category === "main" || routeState.category === "extra")
      ? routeState.category
      : null;

  return (
    

    <>
    <div className={`absolute w-screen h-svh font-[400] text-[16px] overflow-hidden z-[10] bg-white`}>

      {nowArea != 'middleArea' ? null : <div className=" absolute inset-0 flex items-center justify-center  z-[0]">
        <img
          src={logoHover ? "/Logo_Sub.svg" : "/Logo_Main.svg"}
          alt="logo"
          className="w-[20vw] pointer-events-auto"
        />
      </div>
        }

      { nowArea != 'middleArea'  ? null : <div className="absolute inset-0 flex items-center justify-center  ">
        <div
          className="w-[20vw] aspect-square pointer-events-auto z-[9999]"
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
        />
      </div>}
      
      <div className="relative flex flex-col justify-center min-h-svh ">
        
          <TopArea onOpen={() => navigateRoute({ section: "personal", category: null, work: null })} />

          <MiddleArea />

          <BottomArea onOpen={() => navigateRoute({ section: "commercial", category: null, work: null })} />

      </div>
    
      <div className={`
        ${nowArea === 'bottomArea' ? 'top-0' : 'top-[100svh]'}
        absolute left-0 w-full h-svh z-30`}>
        <CommercialMain
          activeWork={activeWork}
          setActiveWork={setActiveWork}
          activeCategory={commercialCategory}
          onOpenCategory={(category) =>
            navigateRoute({ section: "commercial", category, work: null })
          }
          onSelectWork={(work) =>
            navigateRoute({ section: "commercial", category: work.category, work: work.slug })
          }
          onCloseWork={() =>
            navigateRoute({ section: "commercial", category: commercialCategory, work: null }, true)
          }
        />
      </div>

      <div className={`
        ${nowArea === 'topArea' ? 'top-0' : 'top-[-100svh]'}
        absolute left-0 w-full h-svh z-30`}>
        <PersonalMain
          activeWork={activeWork}
          setActiveWork={setActiveWork}
          activeCategory={personalCategory}
          onOpenCategory={(category) =>
            navigateRoute({ section: "personal", category, work: null })
          }
          onSelectWork={(work) =>
            navigateRoute({ section: "personal", category: work.category, work: work.slug })
          }
          onCloseWork={() =>
            navigateRoute({ section: "personal", category: personalCategory, work: null }, true)
          }
        />
      </div>

    </div>

    <button
      onClick={() => (window.location.href = '/')}
      className="fixed bottom-6 right-16 z-50 cursor-pointer"
    >
      <img src="/Logo_Main.svg" alt="Home" className="w-32" />
    </button>
    </>
  )
}
