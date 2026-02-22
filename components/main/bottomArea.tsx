'use client';

import { useNowArea } from "@/stores/nowArea"
import { useBeforeArea } from "@/stores/beforeArea";

export default function bottomArea( {activeSrc, setActiveSrc }: { activeSrc: string | null; setActiveSrc: (src: string | null) => void } ) {
  const { nowArea, setNowArea } = useNowArea();
  const { beforeArea, setBeforeArea } = useBeforeArea();
  
  return (
    <div 
    onClick={() => {
      if(nowArea === "bottomArea") return;
          setBeforeArea(nowArea);
          setNowArea("bottomArea");
        }}
    className={`
    ${nowArea != 'middleArea' ? 'h-[31px] py-1 border-y-2' : 'h-[calc(45svh-1px)] max-md:border-0 border-t-2'}
    ${ (beforeArea === 'middleArea' && nowArea === 'bottomArea') ? 'slide-bottom-sm' : ''}
    ${ (beforeArea === 'middleArea' && nowArea === 'topArea') ? 'slide-top-sm' : ''}
    ${ (beforeArea === 'bottomArea' && nowArea === 'topArea') ? 'slide-top-lg' : ''}
    ${ (beforeArea === 'topArea' && nowArea === 'bottomArea') ? 'slide-bottom-lg ' : ''}

     bg-[white] w-full border-black transition-[height] duration-500 ease-in-out z-49
     cursor-pointer`}>
      <div className="h-full w-full flex justify-center items-center">COMMERCIAL</div>
    </div>
    );
}
