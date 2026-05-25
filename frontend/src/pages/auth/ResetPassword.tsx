import { useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useForm } from "react-hook-form";
import { api } from "../../api/axios";

interface passwordForm {
  password: string;
  confirmPassword: string;
}

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<passwordForm>();

  const password = watch("password");
  const onsubmit = async (data: passwordForm) => {
    await api.post("/auth/resetPassword", { token, password: data.password });
    console.log(data);
  };
  return (
    <div className="min-h-screen flex justify-between ">
      <div className=" w-1/2  flex justify-center items-center">
        <div>
          <h1 className=" font-bold text-6xl">Enter The Password</h1>
          <p className="text-gray-800 "> to continue using the service</p>
        </div>
      </div>
      <div className="w-1/2  flex flex-col gap-3 justify-center items-center">
        <h1>Reset Password</h1>
        <div className="  w-md">
          <form
            className="flex flex-col items-center gap-6"
            onSubmit={handleSubmit(onsubmit)}
          >
            <Input
              {...register("password", { required: "Password id required" })}
              className="h-12"
              type="password"
              placeholder="Enter the password "
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
            <Input
              {...register("confirmPassword", {
                required: "Confirm Password is required ",
                validate: (value) =>
                  value === password || "password do not match",
              })}
              className="h-12 mb-2"
              type="password"
              placeholder="Confirm the password "
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
            <Button className=" h-12 w-1/2" type="submit">
              Sumbit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
