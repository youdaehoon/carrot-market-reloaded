import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";

import {
  revalidatePath,
  unstable_cache as nextCache,
  revalidateTag,
} from "next/cache";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import LikeButton from "@/components/like-button";
import PostComment from "@/components/post-comment";
import { Prisma } from "@prisma/client";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: { select: { username: true, avatar: true } },
        _count: {
          select: {
            Comments: true,
            Likes: true,
          },
        },
      },
    });

    return post;
  } catch (error) {
    return null;
  }
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number) {
  //   const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: { id: { postId, userId } },
  });

  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return { likeCount, isLiked: Boolean(isLiked) };
}

const getCachedLikeStatus = async (postId: number) => {
  const session = await getSession();
  const cachedOperation = nextCache(getLikeStatus, ["post-like-status"], {
    tags: [`like-status-${postId}`],
  });
  console.log("likeStatus hit!");
  return cachedOperation(postId, session.id!);
};

async function getComments(postId: number) {
  try {
    const comments = await db.comment.findMany({
      where: { postId },
      select: {
        created_at:true,
        id:true,
        payload:true,
        user: {
          select: {
            avatar: true,
            username: true,
          },
        },
      },
    });

    return comments;
  } catch (error) {
    return [];
  }
}

export type InitialComments = Prisma.PromiseReturnType<typeof getComments>;

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const post = await getCachedPost(id);
  if (!post) return notFound();

  const comments = await getComments(id);

  const { isLiked, likeCount } = await getCachedLikeStatus(id);

  return (
    <div>
      <div className="p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Image
            width={28}
            height={28}
            className="size-7 rounded-full"
            src={post.user.avatar || "/cofee.jpg"}
            alt={post.user.username}
          />
          <div>
            <span className="text-sm font-semibold">{post.user.username}</span>
            <div className="text-xs">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
            </div>
          </div>
        </div>
        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="mb-5">{post.description}</p>
        <div className="flex flex-col gap-5 items-start">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <EyeIcon className="size-5" />
            <span>조회 {post.views}</span>
          </div>

          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
        </div>
      </div>

      <PostComment initialComments={comments} postId={id}/>
    </div>
  );
}
