import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

async function getPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          Comments: true,
          Likes: true,
        },
      },
    },
  });

  console.log(posts);
  return posts;
}

export const metadata = {
  title: "동네생활",
};

export default async function Life() {
  const posts = await getPosts();
  return (
    <div className="p-5 flex flex-col">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="pb-5 mb-5 border-b border-neutral-500 flex flex-col gap-2 text-neutral-400 last:pb-0 last:border-b-0"
        >
          <h2 className="text-white text-lg font-semibold">{post.title}</h2>
          <p>{post.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4 items-center">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
              <span>.</span>
              <span>조회 {post.views}</span>
            </div>
            <div className="flex gap-4 items-center *:flex *:gap-2 *:items-center">
              <span>
                <HandThumbUpIcon className="size-4"></HandThumbUpIcon>
                {post._count.Likes}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className="size-4"></ChatBubbleBottomCenterIcon>
                {post._count.Comments}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
