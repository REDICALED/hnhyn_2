'use client'
  import TopArea from "@/components/main/topArea";
  import MiddleArea from "@/components/main/middleArea";
  import BottomArea from "@/components/main/bottomArea";
  import CommercialMain from "@/components/commercial/commercialMain";
  import { useNowArea } from "@/stores/nowArea"
  import { useBeforeArea } from "@/stores/beforeArea"
import PersonalMain from "@/components/personal/personalMain";

export default function Page() {
  const { nowArea, setNowArea } = useNowArea();
  const { beforeArea, setBeforeArea } = useBeforeArea();
  
  return (
    <div className={`fixed w-screen h-screen font-[600] text-[14px] overflow-hidden`}>
      <div className="relative flex flex-col justify-center min-h-screen ">
        
          <TopArea />

          <MiddleArea />

          <BottomArea />

      </div>
    
      <div className={`
        ${nowArea === 'bottomArea' ? 'top-0' : 'top-[100vh]'}
        absolute left-0 w-full h-screen transition-[top] duration-700 ease-in-out z-30`}>
        <CommercialMain />
      </div>

      <div className={`
        ${nowArea === 'topArea' ? 'top-0' : 'top-[-100vh]'}
        absolute left-0 w-full h-screen transition-[top] duration-700 ease-in-out z-30`}>
        <PersonalMain />
      </div>
    </div>
  )
}