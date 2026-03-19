import { useNowArea } from "@/stores/nowArea"

export default function middleArea() {
  const { nowArea, setNowArea } = useNowArea();
  
  return (
    <div className={`${ nowArea === 'middleArea' ? '' : 'hidden'} max-md:hidden h-[10svh] w-full z-49 mix-blend-difference [-webkit-text-stroke:0.3px_black] text-white font-[300]`}>
      <div className="flex h-full  w-full justify-center items-center  ">
        <div className="flex h-auto ">
            <div className="w-1/6 relative">
              <div className="absolute top-[0] right-[0] mr-[-20px]"> B.1998 </div>
            </div>

            <div className=" w-2/3 break-all pl-[50px] ">
              Based in Seoul, I use photography to explore how seemingly solid identities erode and shift. I try to capture this through a sense of materiality, focusing on physical textures and the way light—whether soft, harsh, or shifting in direction—redefines what we see. By centering my work on the body, narrative, 'wearing' (the act of putting on clothes or even other beings), and 'merging' (the blurring of boundaries between self and other), I aim to create without being tied down by genre.
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
