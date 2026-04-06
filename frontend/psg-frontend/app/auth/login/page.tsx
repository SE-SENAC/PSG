'use client'

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthServices from "@/services/authServices";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, CircleAlert } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { login } from "@/lib/store/auth/auth";

export default function Login() {
    const dispatch = useDispatch();


    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<any>();
    const [loading,setLoading] = useState<boolean>(false);

    const router = useRouter();

    const verifyForm = () => {

        let errors: Record<string, string> = {}

        if (!email) {
            errors.email = "Email é obrigatório";
        } if (!password) {
            errors.password = "Senha é obrigatório";
        }

        setError(errors);
        return Object.entries(errors).length === 0;
    }

    const handleLogin = async () => {
        if (verifyForm()) {
            setLoading(true);
            try {
                let auth = await AuthServices.login({ email, password });
                dispatch(login({ user: auth.userExists, token: auth.token }));
                router.push(`/auth/profile/${auth.userExists.id}`);
            } catch (e) {
                throw e;
            }finally{
                setLoading(false);
            }
        } else {

        }
    }

    useEffect(() => {
        setEmail("");
        setPassword("");
    },[]);


    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 1, y: 0 }}
        >
            <div className="h-[95vh] flex justify-center items-center">
                <div className="shadow-lg rounded-md p-12 space-y-4 sm:w-1/4 bg-card border border-border">
                    <div className="flex justify-center mb-20">
                        {/* <img className="ml-20" width={"250px"} src={"https://www.se.senac.br/wp-content/uploads/2023/11/marca-senac-sergipe-topo-marca-nova.png"}></img> */}
                        <div className="absolute -translate-y-25 rounded-full bg-gradient-to-l from-[#FF9200] to-[#FF9200]/80 p-9 shadow-[#FF9200] shadow-sm">
                            <User className="text-white size-10" />
                        </div>
                    </div>
                    <h1 className="text-3xl text-foreground text-start uppercase font-bold">Entrar</h1>
                    {/* {error && <div className=" text-red-600">{error}</div>} */}
                    <div className="mt-10 space-y-4">
                        {loading ? <div>Carregando...</div>: 
                        <div className = "mt-10 space-y-4">
                            <div className="">
                                <label className={`text-sm ${error?.email && 'text-red-600'}`}>Email</label>
                                <Input className={`${error?.email && 'border-red-600'}`} placeholder="seuemail@email.com" onChange={(e) => setEmail(e.target.value)}></Input>
                                {error?.email && <div className="mt-2 text-red-600 flex items-center gap-1"><CircleAlert className="size-5" /> <p className="text-sm">{error?.email}</p></div>}
                            </div>
                            <div>
                                <label className={`text-sm ${error?.password && 'text-red-600'}`}>Senha</label>
                                <Input className={`${error?.password && 'border-red-600'}`} onChange={(e) => setPassword(e.target.value)} placeholder="Digite sua senha" type="password" />
                                {error?.password && <div className="flex mt-2 text-red-600 items-center gap-1"><CircleAlert className="size-5" /><p className="text-sm">{error?.password}</p></div>}
                            </div>
                            <div>
                                <Link href={"/auth/forgot-password"}><p className="text-xs text-end underline">Recuperar a senha</p></Link>
                            </div>
                            </div>
                        }
                    </div>
                    <Button onClick={() => handleLogin()} className="container bg-[#FF9200] hover:bg-[#FF9200]/90 cursor-pointer">Entrar</Button>
                    <div>
                        <Link href={"/auth/register"}><p className="text-xs text-end underline">Não tem uma conta? Registre-se</p></Link>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}