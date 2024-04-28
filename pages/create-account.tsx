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
      const request = await fetch("/api/user/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (request.status === 200) {
        alert("Account already exists. Please log in.");
      }
      if (request.status === 201) {
        alert("Account created. Please log in.");
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
        <h1 className="font-semibold text-xl mb-6">Create Account</h1>
        <div>
          <input
            className="w-full"
            placeholder="name"
            type="text"
            {...register("name", { required: "Write your name please." })}
          />
          <span className="text-red-500">{errors?.name?.message}</span>
        </div>
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
          Create Account
        </button>
      </form>
    </div>
  );
};
