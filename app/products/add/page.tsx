"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { uploadProduct } from "./actions";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductType, productSchema } from "./schema";

interface AllowedFileTypes {
  [type: string]: boolean;
}
const allowedFileTypes: AllowedFileTypes = {
  "image/png": true,
  "image/jpeg": true,
  "image/gif": true,
};

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [imgFile, setImgFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors,isValid },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;
    const file = files[0];

    if (!allowedFileTypes[file.type]) alert("only png/jpeg/gif");
    if (file.size / 1024 / 1024 > 4) alert("more than 4MB is not allowed");

    const url = URL.createObjectURL(file);
    setPreview(url);
    setImgFile(file);
    setValue("photo",`${file.name}`)
  };
  const onSubmit = handleSubmit(async (data: ProductType) => {
    console.log("onsubmit", preview);

    if (!imgFile) return;
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price + "");
    formData.append("description", data.description);
    formData.append("photo", imgFile);
    console.log("here");
    return await uploadProduct(formData);
  });

  const onValid = async () => {
    console.log("onvalid");
    await onSubmit();
  };
  return (
    <div>
    
      <form action={onValid} className="flex flex-col gap-5 p-5">
        {isValid?"true":"false"}
        {JSON.stringify(errors)}
        <label
          htmlFor="photo"
          className="border-neutral-300 border-2 aspect-square flex items-center justify-center flex-col
           text-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" ? (
            <>
              {" "}
              <PhotoIcon className="w-28" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {errors.photo?.message}
              </div>
            </>
          ) : null}
        </label>

        <input
          onChange={onImageChange}
          className="hidden"
          type="file"
          id="photo"
          name="photo"
        ></input>
        <Input
          type="text"
          required
          placeholder="제목"
          errors={[errors.title?.message ?? ""]}
          {...register("title")}
        />
        <Input
          type="number"
          required
          placeholder="가격"
          errors={[errors.price?.message ?? ""]}
          {...register("price")}
        />
        <Input
          type="text"
          required
          placeholder="자세한 설명"
          errors={[errors.description?.message ?? ""]}
          {...register("description")}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
