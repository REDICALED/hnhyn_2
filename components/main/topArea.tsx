
import { useBeforeArea } from "@/stores/beforeArea";
import { useNowArea } from "@/stores/nowArea"

export default function topArea() {
  const { nowArea, setNowArea } = useNowArea();
  const { beforeArea, setBeforeArea } = useBeforeArea();

  return (
    <div
    onClick={() => {
          setBeforeArea(nowArea);
          setNowArea("topArea");
        }}
          
    className={` 
    ${nowArea != 'middleArea' ? 'h-[31px] py-1 border-t-2' : 'h-[calc(45vh+1px)] border-b-2'}
    ${ (beforeArea === 'middleArea' && nowArea === 'bottomArea') ? 'slide-bottom-sm' : ''}
    ${ (beforeArea === 'middleArea' && nowArea === 'topArea') ? 'slide-top-sm' : ''}
    ${ (beforeArea === 'bottomArea' && nowArea === 'topArea') ? 'slide-top-lg' : ''}
    ${ (beforeArea === 'topArea' && nowArea === 'bottomArea') ? 'slide-bottom-lg' : ''}
    w-full  bg-[white] border-black transition-[height] duration-500 ease-in-out z-49 `}>
      <div className="h-full w-full flex justify-center items-center">PERSONAL</div>
    </div>
    );
}
