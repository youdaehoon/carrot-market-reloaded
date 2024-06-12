"use client";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default  function Modal({ params }: { params: { id: string } }) {
  const router=useRouter()
  const onCloseClick=()=>{
    router.back()
  }
  return (
    <div className="absolute w-full  z-50 h-full bg-black left-0 top-0 flex justify-center items-center bg-opacity-60">
      <button className="absolute right-5 top-5 text-neutral-200">
        <XMarkIcon onClick={onCloseClick} className="size-10" />
      </button>
      <div className="max-w-screen-sm w-full">
        <div className="aspect-square bg-neutral-700 rounded-md flex items-center justify-center text-neutral-200">
          <PhotoIcon className="h-28" />
        </div>
      </div>
    </div>
  );
}
