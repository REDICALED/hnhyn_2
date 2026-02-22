
import { useBeforeArea } from "@/stores/beforeArea";
import { useNowArea } from "@/stores/nowArea"

export default function topArea( {activeSrc, setActiveSrc }: { activeSrc: string | null; setActiveSrc: (src: string | null) => void } ) {
  const { nowArea, setNowArea } = useNowArea();
  const { beforeArea, setBeforeArea } = useBeforeArea();

  return (
    <div
    onClick={() => {
      if(nowArea === "topArea") return;
          setBeforeArea(nowArea);
          setNowArea("topArea");
        }}
          
    className={` 
    ${nowArea != 'middleArea' ? 'h-[31px] py-1 border-y-2' : 'h-[calc(45svh+1px)] border-b-2'}
    ${ ( !activeSrc && beforeArea === 'middleArea' && nowArea === 'bottomArea') ? 'slide-bottom-sm' : ''}
    ${ ( !activeSrc && beforeArea === 'middleArea' && nowArea === 'topArea') ? 'slide-top-sm' : ''}
    ${ ( !activeSrc && beforeArea === 'bottomArea' && nowArea === 'topArea') ? 'slide-top-lg' : ''}
    ${ ( !activeSrc && beforeArea === 'topArea' && nowArea === 'bottomArea') ? 'slide-bottom-lg' : ''}
    ${activeSrc ? 'slide-top-lg' : 'translate-y-0'}

    w-full  bg-[white] border-black transition-[height] duration-500 ease-in-out z-49
    cursor-pointer `}>
      <div className="h-full w-full flex justify-center items-center">PERSONAL</div>
    </div>
    );
}
