"use server";
import ModalCloseButton from "@/components/modal-close-button";
import db from "@/lib/db";
import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import { PhotoIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isNumeric } from "validator";

async function getProductDetail(id: string) {
  // paraller
  const product = await db.product.findUnique({
    where: { id: +id },
    select: {
      title: true,
      created_at: true,
      price: true,
      description: true,
      photo: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });

  return product;
}

export default async function Modal({ params }: { params: { id: string } }) {
  console.log(params.id);
  console.log("add");

  if (params.id === "add") {

    return window.history.forward()
  }
  if (isNaN(Number(params.id))) {
    return notFound();
  }

  const product = await getProductDetail(params.id);
  if (!product) notFound();

  return (
    <div className="absolute w-full  z-50 h-full bg-black left-0 top-0 flex justify-center items-center bg-opacity-60">
      <ModalCloseButton />
      <div className="relative max-w-screen-sm w-full ">
        <div className="relative aspect-square bg-neutral-700 h-1/2 overflow-hidden rounded-md flex items-center justify-center text-neutral-200 ">
          {product.photo ? (
            <Image src={product.photo} alt={product.title} fill></Image>
          ) : (
            <PhotoIcon className="h-28" />
          )}
        </div>
        <div className="flex justify-between my-4">
          <div className="flex item-center gap-2">
            <div className="relative size-8 rounded-full overflow-hidden text-neutral-300">
              {product?.user.avatar ? (
                <Image
                  src={product.user.avatar}
                  alt={product.user.username}
                  fill
                />
              ) : (
                <UserIcon className="size-8" />
              )}
            </div>
            <span className="flex items-center">{product.user.username}</span>
          </div>
          <span>{formatToTimeAgo(product.created_at.toString())}</span>
        </div>
        <h1 className=" text-2xl font-bold mb-2">{product.title}</h1>
        <span>{product.description}</span>
        <div className="fixed bottom-0 max-w-screen-sm w-full flex justify-between  p-5 pb-10 bg-neutral-800  items-center">
          <span> {formatToWon(product.price)}원</span>
          <Link
            className="bg-orange-500 text-white px-5 py-2.5 rounded-md font-semibold"
            href={``}
          >
            채팅하기
          </Link>{" "}
        </div>
      </div>
    </div>
  );
}
