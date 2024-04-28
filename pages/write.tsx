import { Post } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface IForm {
  title: string;
  img: string;
}

interface IData {
  newPost: Post;
}

export default () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>();
  const [loading, setLoading] = useState(false);
  const onValid = async (data: IForm) => {
    if (!loading) {
      setLoading(true);
      const request = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          router.push(`/posts/${data.newPost.id}`);
        });
    }
  };
  return (
    <>
      <div className="flex justify-center items-center bg-white py-4">
        <Link href="/">
          <span className="text-2xl">Shiba world</span>
        </Link>
      </div>
      <div className="flex justify-center items-center max-w-lg m-auto h-screen">
        <form
          className="bg-white w-full p-10 rounded-xl flex flex-col gap-2"
          onSubmit={handleSubmit(onValid)}
        >
          <h1 className="font-semibold text-xl mb-6">Write new post</h1>
          <div>
            <input
              className="w-full"
              placeholder="Title"
              type="text"
              {...register("title", { required: "Write title please." })}
            />
            <span className="text-red-500">{errors?.title?.message}</span>
          </div>
          <div>
            <input
              className="w-full"
              placeholder="Image url"
              type="text"
              {...register("img")}
            />
          </div>
          <button className="mt-6 bg-slate-200 p-2 hover:bg-slate-300">
            Post
          </button>
        </form>
      </div>
    </>
  );
};
