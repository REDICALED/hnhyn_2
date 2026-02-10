import { useNowArea } from "@/stores/nowArea"

export default function PersonalMain() {
  const { nowArea, setNowArea } = useNowArea();
  
  return (
    <div className={`z-[48] h-svh w-full bg-[none] flex justify-center items-center`}>
        <img className="h-[50svh]" src="/commercial/2.jpg" alt="1"/>  
    </div>
    );
}
