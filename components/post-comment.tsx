"use client";

import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Input from "./input";
import { useOptimistic, useRef } from "react";
import { InitialComments } from "@/app/posts/[id]/page";
import { createComment, getUser } from "@/app/posts/[id]/actions";
import { useFormState } from "react-dom";

interface PostCommentProps {
  initialComments: InitialComments;
  postId: number;
}

export default function PostComment({
  initialComments,
  postId,
}: PostCommentProps) {
  const [state, reducerFn] = useOptimistic(
    initialComments,
    (prevState, payload: InitialComments) => {
      return [...prevState, ...payload];
    }
  );
  const ref=useRef<HTMLFormElement>(null)
  const interceptAction = async (_: any, formData: FormData) => {
    const user = await getUser();
if(formData&&formData.get("comment")){
    if( formData.get("comment")?.toString()==="") return
    reducerFn([
        {
          created_at: new Date(),
          payload: formData.get("comment")?.toString()!,
          user: { avatar: user!.avatar, username: user!.username },
          id: 9999,
        },
      ]);
      if(ref.current)  ref.current.reset()
}
   

    formData.append("postId",postId+"")
    await createComment(_,formData);
  };


  const [_, dispatch] = useFormState(interceptAction, null);

  return (
    <>
      <div className="border-neutral-700 border-t-2  p-5">
        <div className="text-lg font-semibold"> 댓글 {state.length}</div>
        <div className="mt-4 flex  flex-col gap-4 pb-16">
          {state.map((comment) => (
            <div key={comment.id}>
              <div className="flex items-center gap-2 mb-2">
                <Image
                  width={28}
                  height={28}
                  className="size-7 rounded-full"
                  src={comment.user.avatar || "/cofee.jpg"}
                  alt={comment.user.username}
                />
                <div>
                  <span className="text-sm font-semibold">
                    {comment.user.username}
                  </span>
                  <div className="text-xs">
                    <span>
                      {formatToTimeAgo(comment.created_at.toString())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="ml-7 pl-2 font-medium text-lg">
                <span>{comment.payload}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form action={dispatch} ref={ref} >
        <div className="fixed bottom-0 w-full mx-auth max-w-screen-md grid grid-cols-5 gap-2 border-neutral-600 border-t px-5 py-3  *:text-white bg-neutral-800">
          <div className="col-span-4">
            <Input name="comment" placeholder="댓글을 입력해주세요"></Input>
          </div>
          <button>확인 </button>
        </div>
      </form>
    </>
  );
}
