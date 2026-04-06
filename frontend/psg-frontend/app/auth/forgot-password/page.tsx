'use client'

import { useState } from "react";
import AuthServices from "@/services/authServices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPassword(){

    const [email,setEmail] = useState<string>("");
    const [error,setError] = useState<any>("");

    const handleForgotPassword = async()=>{
        try{
            let response = await AuthServices.forgetPassword({email});
            return response.data
        }catch(e){
            console.log(e);
            // setError(e);
            throw e;
        }
    }


    return(
        <div className="h-[90vh] flex justify-center items-center">
            <div className="space-y-4 shadow-lg p-6 rounded bg-card border border-border">
                <p className="font-bold">Digite o seu email para recuperar a senha</p>
                <p className="text-sm text-muted-foreground">Um link será enviado para o seu email</p>
                <label className={`text-sm ${error.email && 'text-red-600'}`}>Email</label>
                {error && <p>{error}</p>}
                <Input placeholder="seuemail@email.com" className={`${error && 'border-red-600'}`} value={email} onChange={(e) => setEmail(e.target.value)}/>
                <Button onClick={handleForgotPassword} className="cursor-pointer container bg-[#FF9200] hover:bg-[#FF9200]/80 transition-all duration-200">Enviar</Button>
            </div>
        </div>
    )
}