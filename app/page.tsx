'use client'
  import TopArea from "@/components/main/topArea";
  import MiddleArea from "@/components/main/middleArea";
  import BottomArea from "@/components/main/bottomArea";
  import CommercialMain from "@/components/commercial/commercialMain";
  import { useNowArea } from "@/stores/nowArea"
  import { useBeforeArea } from "@/stores/beforeArea"
import PersonalMain from "@/components/personal/personalMain";
import { useState } from "react";
import type { SelectedWork } from "@/components/commercial/commercialList";

export default function Page() {
  const { nowArea, setNowArea } = useNowArea();
  const { beforeArea, setBeforeArea } = useBeforeArea();
  const [activeWork, setActiveWork] = useState<SelectedWork | null>(null);
  const [logoHover, setLogoHover] = useState(false);


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
        
          <TopArea  />

          <MiddleArea />

          <BottomArea />

      </div>
    
      <div className={`
        ${nowArea === 'bottomArea' ? 'top-0' : 'top-[100svh]'}
        absolute left-0 w-full h-svh z-30`}>
        <CommercialMain activeWork={activeWork} setActiveWork={setActiveWork} />
      </div>

      <div className={`
        ${nowArea === 'topArea' ? 'top-0' : 'top-[-100svh]'}
        absolute left-0 w-full h-svh z-30`}>
        <PersonalMain activeWork={activeWork} setActiveWork={setActiveWork} />
      </div>

    </div>

    <button
      onClick={() => (window.location.href = '/')}
      className="fixed bottom-6 right-6 z-50 cursor-pointer"
    >
      <img src="/Logo_Main.svg" alt="Home" className="w-32" />
    </button>
    </>
  )
}