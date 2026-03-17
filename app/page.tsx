'use client'
  import TopArea from "@/components/main/topArea";
  import MiddleArea from "@/components/main/middleArea";
  import BottomArea from "@/components/main/bottomArea";
  import CommercialMain from "@/components/commercial/commercialMain";
  import { useNowArea } from "@/stores/nowArea"
  import { useBeforeArea } from "@/stores/beforeArea"
import PersonalMain from "@/components/personal/personalMain";
import { useState } from "react";

export default function Page() {
  const { nowArea, setNowArea } = useNowArea();
  const { beforeArea, setBeforeArea } = useBeforeArea();
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const [logoHover, setLogoHover] = useState(false);


  return (
    

    <>
    <div className={`absolute w-screen h-svh font-[400] text-[16px] overflow-hidden z-[10] bg-white`}>

      <div className=" absolute inset-0 flex items-center justify-center  z-[0]">
        <img
          src={logoHover ? "/Logo_Sub.svg" : "/Logo_Main.svg"}
          alt="logo"
          className="w-[20vw] pointer-events-auto"
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center  ">
        <div
          className="w-[20vw] aspect-square pointer-events-auto z-[9999]"
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
        />
      </div>
      
      <div className="relative flex flex-col justify-center min-h-svh ">
        
          <TopArea activeSrc={activeSrc} setActiveSrc={setActiveSrc} />

          <MiddleArea />

          <BottomArea activeSrc={activeSrc} setActiveSrc={setActiveSrc} />

      </div>
    
      <div className={`
        ${nowArea === 'bottomArea' ? 'top-0' : 'top-[100svh]'}
        absolute left-0 w-full h-svh z-30`}>
        <CommercialMain activeSrc={activeSrc} setActiveSrc={setActiveSrc} />
      </div>

      <div className={`
        ${nowArea === 'topArea' ? 'top-0' : 'top-[-100svh]'}
        absolute left-0 w-full h-svh z-30`}>
        <PersonalMain />
      </div>

    </div>


    </>
  )
}