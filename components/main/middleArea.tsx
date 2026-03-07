import { useNowArea } from "@/stores/nowArea"

export default function middleArea() {
  const { nowArea, setNowArea } = useNowArea();
  
  return (
    <div className={`${ nowArea === 'middleArea' ? '' : 'hidden'} max-md:hidden h-[10svh] w-full bg-[none] z-49 `}>
      <div className="flex h-full  w-full justify-center items-center ">
        <div className="flex h-auto ">
            <div className="w-1/6 relative">
              <div className="absolute top-[0] right-[0] mr-[-20px]"> B.1998 </div>
            </div>

            <div className=" w-2/3 break-all pl-[50px]">
              I work on photography based in Seoul. They try to recognize the surrounding beings that make things happen, but they don't see well. Change the conditions to explore new possibilities. Sometimes these interests touch visual and photography, sometimes they touch the numerous directions that you have experienced, such as narrative and fashion.
            </div>     

            <div className="w-1/6 relative">
              <div className="absolute bottom-[0] right-[0] pr-[40px] flex"> 
              <a href="https://www.instagram.com/hanhyeon_/" className="no-underline text-inherit">Instagram</a>
              <a href="https://www.instagram.com/hanhyeon_/" className="no-underline text-inherit pl-[20px]">E-MAIL</a>
              </div>
            </div>
        </div>
      </div>
    </div>
    );
}
