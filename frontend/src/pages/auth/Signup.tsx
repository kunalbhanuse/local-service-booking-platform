import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useForm } from "react-hook-form";
import { api } from "../../api/axios";

interface signUpFormData {
  name: string;
  email: string;
  password: string;
}

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signUpFormData>();

  const onsubmit = async (data: signUpFormData) => {
    const responce = await api.post("/auth/signup", data);
    const result = responce.data.data;
    console.log(result);
  };
  return (
    <div className="min-h-screen flex justify-between p-1 ">
      <div className=" w-1/2  flex justify-center items-center">
        <div>
          <h1 className=" font-bold text-6xl">Welcome Back</h1>
          <p className="text-gray-800 ">SignUp to continue using the service</p>
        </div>
      </div>
      <div className=" w-1/2 flex flex-col  gap-4 justify-center items-center">
        <div className=" ">
          <h1 className=" font-bold text-3xl">SignUp</h1>
        </div>
        <div className="w-full max-w-md ">
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="flex flex-col gap-6 items-center"
          >
            <Input
              placeholder="Enter name "
              {...register("name", {
                required: true,
              })}
              className="h-12 px-4 bg"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
            <Input
              placeholder="Enter email "
              {...register("email", {
                required: true,
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className="h-12 px-4 bg"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
            <Input
              placeholder="Enter password "
              {...register("password", { required: true })}
              className="h-12"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
            <Button type="submit" className="w-1/2 h-12">
              Login
            </Button>
            <p className="text-gray-800 ">
              Don’t have an account? <Link to={"/Login"}>Login</Link>{" "}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
