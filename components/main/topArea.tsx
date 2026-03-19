'use client';

import { useBeforeArea } from "@/stores/beforeArea";
import { useNowArea } from "@/stores/nowArea"

export default function topArea() {
  const { nowArea, setNowArea } = useNowArea();
  const { beforeArea, setBeforeArea } = useBeforeArea();

  return (
    <>
    { nowArea != 'middleArea' ? <div></div> : <div
    onClick={() => {
          setBeforeArea(nowArea);
          setNowArea("topArea");
        }}     
    className={` 
    ${nowArea != 'middleArea' ? 'h-[31px] py-1 border-y' : 'h-[calc(45svh+1px)] border-b'}
    w-full   border-black  z-49
    cursor-pointer `}
    >
      <div className="h-full w-full flex justify-center items-center">Personal</div>
    </div>}
    </>
    );
}
