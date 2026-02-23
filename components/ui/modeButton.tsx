export default function modeButton() {
  return (
    <button className="absolute right-[40px] cursor-pointer flex items-center gap-4">
      <span
        aria-hidden
        className="inline-block w-[8px] h-[8px] rounded-full bg-red-500"
      />
      EN / KR
    </button>
  );
}