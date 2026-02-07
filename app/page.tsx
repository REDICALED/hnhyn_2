'use client'
  import TopArea from "@/components/main/topArea";
  import MiddleArea from "@/components/main/middleArea";
  import BottomArea from "@/components/main/bottomArea";
  import { useNowArea } from "@/stores/nowArea"
  import { useBeforeArea } from "@/stores/beforeArea"

export default function Page() {
  const { nowArea, setNowArea } = useNowArea();
  const { beforeArea, setBeforeArea } = useBeforeArea();
  
  return (
    <div className="w-screen h-screen font-[600] text-[14px] ">
      <div className="flex flex-col justify-center min-h-screen">
        
          <TopArea />
        
        <div id="middleArea" onClick={() => {
          setBeforeArea(nowArea);
          setNowArea("middleArea");
        }}>
          <MiddleArea />
        </div>


          <BottomArea />

      </div>
    
    </div>
  )
}