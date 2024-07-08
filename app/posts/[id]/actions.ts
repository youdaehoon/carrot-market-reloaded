"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";

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
