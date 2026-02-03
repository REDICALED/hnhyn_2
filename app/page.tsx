'use client'
  import TopArea from "@/components/main/topArea";
  import MiddleArea from "@/components/main/middleArea";
  import BottomArea from "@/components/main/bottomArea";

export default function Page() {

  return (
    <div className="w-screen h-screen font-[500] text-[14px] ">
      <div className="">
        <TopArea />
        <MiddleArea />
        <BottomArea />
      </div>
    
    </div>
  )
}