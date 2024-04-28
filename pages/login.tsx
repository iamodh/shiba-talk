import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface IForm {
  name: string;
  email: string;
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
      const request = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (request.status === 200) {
        router.push("/");
      }
      if (request.status === 404) {
        alert("User not found with this email.");
      }
      if (request.status !== 405) {
        router.push("/login");
      }
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center max-w-lg m-auto h-screen">
      <form
        className="bg-white w-full p-10 rounded-xl flex flex-col gap-2"
        onSubmit={handleSubmit(onValid)}
      >
        <h1 className="font-semibold text-xl mb-6">Login</h1>
        <div>
          <input
            className="w-full"
            placeholder="email"
            type="email"
            {...register("email", { required: "Write your email please." })}
          />
          <span className="text-red-500">{errors?.email?.message}</span>
        </div>
        <button className="mt-6 bg-slate-200 p-2 hover:bg-slate-300">
          Log in
        </button>
        <Link href="/create-account">
          <span className="hover:underline">No account yet? Sign in.</span>
        </Link>
      </form>
    </div>
  );
};
