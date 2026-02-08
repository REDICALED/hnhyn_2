import { useNowArea } from "@/stores/nowArea"

export default function CommercialMain() {
  const { nowArea, setNowArea } = useNowArea();
  
  return (
    <div className={` h-[10vh] w-full bg-[none]`}>
        <img className="h-[50vh]" src="/commercial/1.jpg" alt="1"/>  
    </div>
    );
}
