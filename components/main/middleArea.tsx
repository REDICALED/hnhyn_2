import { useNowArea } from "@/stores/nowArea"

export default function middleArea() {
  const { nowArea, setNowArea } = useNowArea();
  
  return (
    <div className={`${ nowArea === 'middleArea' ? '' : 'hidden'} max-md:hidden h-[10dvh] w-full bg-[none] z-49 `}>
      <div className="flex h-full  w-full justify-center items-center ">
        <div className="flex h-auto ">
            <div className="w-1/6 relative">
              <div className="absolute top-[0] right-[0] mr-[-20px]"> B.1998 </div>
            </div>

            <div className=" w-2/3 break-all pl-[50px]">
              I WORK ON PHOTOGRAPHY BASED IN SEOUL. THEY TRY TO RECOGNIZE THE SURROUNDING BEINGS THAT MAKE THINGS HAPPEN, BUT THEY DON'T SEE WELL
              CHANGE THE CONDITIONS TO EXPLORE NEW POSSIBILITIES.SOMETIMES THESE INTERESTS TOUCH VISUAL AND PHOTOGRAPHY SOMETIMES IT TOUCHES THE
              NUMEROUS DIRECTIONS THAT YOU HAVE EXPERIENCED, SUCH AS NARRATIVE AND FASHION.
            </div>     

            <div className="w-1/6 relative">
              <div className="absolute bottom-[0] right-[0] pr-[40px] flex"> 
              <a href="https://www.instagram.com/hanhyeon_/" className="no-underline text-inherit">INSTAGRAM</a>
              <a href="https://www.instagram.com/hanhyeon_/" className="no-underline text-inherit pl-[20px]">E-MAIL</a>
              </div>
            </div>
        </div>
      </div>
    </div>
    );
}
