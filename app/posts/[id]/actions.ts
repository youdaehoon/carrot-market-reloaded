"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export async function likePost(postId: number) {
  await new Promise((r) => setTimeout(r, 10000));
  console.log("like");
  const session = await getSession();
  console.log({ postId, userId: session.id! });
  try {
    await db.like.create({
      data: { postId, userId: session.id! },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (error) {
    console.error(error);
  }
}

export async function dislikePost(postId: number) {
  await new Promise((r) => setTimeout(r, 10000));

  const session = await getSession();

  try {
    await db.like.delete({
      where: {
        id: { postId, userId: session.id! },
      },
    });

    revalidateTag(`like-status-${postId}`);
  } catch (error) {}
}


const payloadSchema=z.string({required_error:"required"})

export async function createComment(_:any, formData: FormData) {
  await new Promise((r) => setTimeout(r, 10000));

  const payload = formData.get("comment");

  const result= await payloadSchema.spa(payload)
  if (!result.success) {
    return result.error.flatten();
  } else{

    const session = await getSession();
    try {
      await db.comment.create({
        data: { payload:result.data, postId:+formData.get("postId")!, userId: session.id! },
      });
    } catch (error) {}
  }

  }

  

export async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) return user;
  }
  return null;
}
