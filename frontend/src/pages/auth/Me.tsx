import { useEffect, useState } from "react";
import { api } from "../../api/axios";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

function Me() {
  const featchMe = async () => {
    const response = await api.get("/auth/getme");
    console.log(response.data.data);
    setUser(response.data.data);
  };

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    featchMe();
  }, []);
  return <div>{user?.name}</div>;
}

export default Me;
