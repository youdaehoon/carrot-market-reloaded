"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function ModalCloseButton() {
    const router=useRouter()
    const onCloseClick=()=>{
      router.back()
    }
    return <button className="absolute right-5 top-5 text-neutral-200">
    <XMarkIcon onClick={onCloseClick} className="size-10" />
  </button>
}
