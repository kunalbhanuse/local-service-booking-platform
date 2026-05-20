import React from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { api } from "../../api/axios";

function ForgotPassword() {
  const { register, handleSubmit } = useForm();
  const onsubmit = async () => {
    const response = await api.post("/auth/forgetPassword");
    console.log(response.data.message);
  };
  return (
    <div>
      <div>
        <h1>ForgotPassword</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit(onsubmit)}>
          <Input placeholder="Enter email" />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
