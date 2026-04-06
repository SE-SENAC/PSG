'use client'

import { useRouter } from "next/router";
import AuthServices from "@/services/authServices";
import { useEffect,useState } from "react";

export default function Auth({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

 const router = useRouter();
 const [isAuthenticated,setIsAuthenticated] = useState<Boolean>(false);

    const handleAuth = async () => {
    if (localStorage?.getItem("token") != null) {
     
      let token = localStorage?.getItem("token");
      let auth = await AuthServices.isAuthenticated(token!);
      setIsAuthenticated(auth);
    }
  }


  useEffect(() => {;
   handleAuth();
  }, []);

   if(isAuthenticated){
    return (
        {children}
    )
   }else{
    return (
        <div></div>
    );
   }
}