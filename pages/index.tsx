import { Post, User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface PostWithLikes extends Post {
  _count: {
    likes: number;
  };
}

interface IPostData {
  posts: PostWithLikes[];
}

export default () => {
  const router = useRouter();

  /* User */
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useSWR<User>("/api/user/me");
  useEffect(() => {
    if (userError) {
      router.replace("/login");
    }
  }, [userError, router]);

  /* Posts */
  const { data: postData } = useSWR<IPostData>("/api/post");

  /* Logout */
  const onLogoutClicked = async () => {
    const request = await fetch("/api/user/logout", {
      method: "POST",
    });
    if (request.status === 200) {
      router.push("/login");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center bg-white py-4">
        <Link href="/">
          <span className="text-2xl">Shiba world</span>
        </Link>
        <span
          onClick={onLogoutClicked}
          className="absolute right-10 cursor-pointer"
        >
          Logout
        </span>
      </div>
      {userLoading ? (
        "Loading..."
      ) : (
        <>
          <div className="flex justify-center items-start max-w-lg my-10 mx-auto">
            {postData ? (
              <ul className="flex flex-col gap-4">
                {postData.posts.map((post) => (
                  <Link href={`/posts/${post.id}`}>
                    <li key={post.id} className="bg-white p-10 rounded-xl">
                      <h2 className="text-xl">{post.title}</h2>
                      {post.img ? <img src={post.img} className="" /> : null}
                      <button className="bg-slate-200 p-2 hover:bg-slate-300">
                        Like: {post._count.likes}
                      </button>
                    </li>
                  </Link>
                ))}
              </ul>
            ) : (
              "No posts yet."
            )}
          </div>
        </>
      )}
      <Link href="/write">
        <div className="size-12 bg-orange-500 fixed bottom-10 right-10 text-2xl text-white font-bold flex justify-center items-center rounded-full hover:bg-orange-600 cursor-pointer">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
        </div>
      </Link>
    </>
  );
};
