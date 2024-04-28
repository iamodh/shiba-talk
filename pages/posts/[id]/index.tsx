import { Post, User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import useSWR from "swr";

interface PostWithUser extends Post {
  user: User;
  _count: {
    likes: number;
  };
}

interface IPostData {
  post: PostWithUser;
}

export default () => {
  const router = useRouter();
  /* get post */
  const { data, isLoading, mutate } = useSWR<IPostData>(
    `/api/post/${router.query.id}`
  );

  /* like */
  const [loading, setLoading] = useState(false);
  const onLikeClicked = async () => {
    if (!loading) {
      setLoading(true);
      const request = await fetch(`/api/post/${router.query.id}/like`, {
        method: "POST",
      });
      setLoading(false);
    }
    mutate();
  };
  return (
    <>
      <div className="flex justify-center items-center bg-white py-4">
        <Link href="/">
          <span className="text-2xl">Shiba world</span>
        </Link>
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        <div className="flex justify-center items-start max-w-lg my-10 mx-auto">
          <div key={data?.post.id} className="bg-white p-10 rounded-xl">
            <h2 className="text-xl">{data?.post.title}</h2>
            {data?.post.img ? <img src={data?.post.img} className="" /> : null}
            <button
              onClick={onLikeClicked}
              className="bg-slate-200 p-2 hover:bg-slate-300"
            >
              Like: {data?.post._count.likes}
            </button>
            <hr className="my-4" />
            <p>Posted by {data?.post.user.name}</p>
            <p>{data?.post.createdAt.toLocaleString()}</p>
          </div>
        </div>
      )}
    </>
  );
};
