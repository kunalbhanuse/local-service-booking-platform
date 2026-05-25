import React, { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { api } from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";

interface forgetFormDataFormData {
  email: string;
}
function ForgotPassword() {
  const navigation = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgetFormDataFormData>();

  const onsubmit = async (data: forgetFormDataFormData) => {
    try {
      const response = await api.post("/auth/forgetPassword", data);
      console.log(response.data.message);
      navigation("/resetPassword");
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      // console.log(error?.response);
      setErrorMsg(message);
    }
  };

  return (
    <div className=" min-h-screen flex justify-around items-center">
      <div>
        <h1 className=" font-bold text-6xl">Enter the Email</h1>
        <p className="text-gray-800 "> to continue using the service</p>
      </div>
      <div className="w-full max-w-md flex flex-col gap-3">
        <div className="flex justify-center  ">
          <h1 className=" font-bold text-3xl  ">Forget Password</h1>
        </div>
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-5">
          <Input
            className="h-12 "
            placeholder="Enter email"
            {...register("email", { required: "email is Required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <Button type="submit">Submit</Button>
        </form>
        <p className="text-gray-800 ">
          Remember your password? <Link to={"/Login"}>Login</Link>{" "}
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
