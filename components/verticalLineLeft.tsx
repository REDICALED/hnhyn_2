'use client';


import { useNowArea } from "@/stores/nowArea"


export default function VerticalLineLeft() {
  const { nowArea, setNowArea } = useNowArea();

  return (
    <div className="z-[50] bg-[white] border-x fixed left-0 top-0 h-full w-[25px]">
      <div className="h-[48vh] mt-[10px] flex flex-col items-center justify-between">
        <div className="[writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 whitespace-nowrap font-[400] text-[14px] leading-none">
          DIRECTORY
        </div>
        <div className="[writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 whitespace-nowrap font-[400] text-[14px] leading-none">
          INFO
        </div>
        <div className="[writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 whitespace-nowrap font-[400] text-[14px] leading-none">
          DAILY
        </div>
      </div>


      <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 h-[40vh] flex items-end justify-center">
        <div className="[writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 whitespace-nowrap text-[14px] leading-none">
          /{nowArea === "topArea" ? "Personal" : nowArea === "middleArea" ? "" : "Commercial"}
        </div>
      </div>
    </div>
  );
}