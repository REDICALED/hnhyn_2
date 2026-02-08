'use client'
  import TopArea from "@/components/main/topArea";
  import MiddleArea from "@/components/main/middleArea";
  import BottomArea from "@/components/main/bottomArea";
  import CommercialMain from "@/components/commercial/commercialMain";
  import { useNowArea } from "@/stores/nowArea"
  import { useBeforeArea } from "@/stores/beforeArea"

export default function Page() {
  const { nowArea, setNowArea } = useNowArea();
  const { beforeArea, setBeforeArea } = useBeforeArea();
  
  return (
    <div className={`fixed w-screen h-screen font-[600] text-[14px] overflow-y-hidden`}>
      <div className="flex flex-col justify-center min-h-screen">
        
          <TopArea />

          <MiddleArea />

          <BottomArea />

      </div>
    
      <div className={`
        ${ (beforeArea === 'middleArea' && nowArea === 'bottomArea') ? 'top-[0]' : 'top-[100vh]'}
        ${ (beforeArea === 'middleArea' && nowArea === 'topArea') ? '' : ''}
        ${ (beforeArea === 'bottomArea' && nowArea === 'topArea') ? '' : ''}
        ${ (beforeArea === 'topArea' && nowArea === 'bottomArea') ? '' : ''}
        absolute left-0 w-full h-screen transition-[top] duration-700 ease-in-out`}>
        <CommercialMain />
      </div>

    </div>
  )
}