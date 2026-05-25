import React from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { api } from "../../api/axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigation = useNavigate();
  const { register, handleSubmit } = useForm();
  const onsubmit = async (data) => {
    const response = await api.post("/auth/forgetPassword", data);

    console.log(response.data.message);
    navigation("/resetPassword");
  };
  return (
    <div className=" min-h-screen flex justify-around items-center">
      <div className="text-5xl font-bold">
        <h1>Forgot Password</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-5">
          <Input placeholder="Enter email" {...register("email")} />

          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
