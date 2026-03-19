'use client';

import { useNowArea } from "@/stores/nowArea"
import { useBeforeArea } from "@/stores/beforeArea";

export default function bottomArea(  ) {
  const { nowArea, setNowArea } = useNowArea();
  const { beforeArea, setBeforeArea } = useBeforeArea();
  
  return (
    <>
    { nowArea != 'middleArea' ? <div></div> : <div 
    onClick={() => {
          setBeforeArea(nowArea);
          setNowArea("bottomArea");
    }}
    className={`
    ${nowArea != 'middleArea' ? 'h-[31px] py-1 border-y -mt-[2px]' : 'h-[calc(45svh-1px)] max-md:border-0 border-t'}
      w-full border-black z-49
     cursor-pointer`}>
      <div className="h-full w-full flex justify-center items-center">Commercial</div>
    </div>}
    </>
    );
}
