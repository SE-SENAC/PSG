'use client'

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthServices from "@/services/authServices";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, CircleAlert, Lock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { login } from "@/lib/store/auth/auth";

export default function SuperAdminLogin() {
    const dispatch = useDispatch();
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);

    const verifyForm = () => {
        let errors: Record<string, string> = {}
        if (!email) errors.email = "Email é obrigatório";
        if (!password) errors.password = "Senha é obrigatória";
        setError(errors);
        return Object.keys(errors).length === 0;
    }

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (verifyForm()) {
            setLoading(true);
            try {
                let auth = await AuthServices.loginSuperAdmin({ email, password });
                dispatch(login({ user: auth.userExists, token: auth.token }));
                router.push(`/gerenciador/super-admin/${auth.userExists.id}/dashboard`);
            } catch (e: any) {
                setError({ general: e.response?.data?.message || "Credenciais inválidas" });
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        setEmail("");
        setPassword("");
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 1, y: 0 }}
        >
            <div className="min-h-screen flex justify-center items-center bg-background p-4">
                <div className="relative shadow-lg rounded-md p-8 sm:p-12 space-y-4 w-full max-w-md bg-card border border-border">
                    <div className="flex justify-center mb-16">
                        <div className="absolute -translate-y-20 sm:-translate-y-24 rounded-full bg-gradient-to-l from-red-600 to-red-600/80 p-8 sm:p-9 shadow-red-600 shadow-sm border-4 border-background">
                            <ShieldCheck className="text-white size-10 sm:size-12" />
                        </div>
                    </div>
                    
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl text-foreground uppercase font-bold tracking-tight">Super Administrador</h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Acesso Restrito</p>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${error?.email ? 'text-red-600' : 'text-foreground/70'}`}>Email</label>
                                <Input 
                                    className={`h-11 ${error?.email ? 'border-red-600 focus-visible:ring-red-600' : 'focus-visible:ring-red-600'}`} 
                                    placeholder="admin@senac.br" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {error?.email && <div className="mt-1 text-red-600 flex items-center gap-1"><CircleAlert className="size-4" /> <p className="text-xs">{error?.email}</p></div>}
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className={`text-sm font-medium ${error?.password ? 'text-red-600' : 'text-foreground/70'}`}>Senha</label>
                                </div>
                                <Input 
                                    className={`h-11 ${error?.password ? 'border-red-600 focus-visible:ring-red-600' : 'focus-visible:ring-red-600'}`} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Digite sua senha" 
                                    type="password"
                                    value={password}
                                />
                                {error?.password && <div className="flex mt-1 text-red-600 items-center gap-1"><CircleAlert className="size-4" /><p className="text-xs">{error?.password}</p></div>}
                            </div>
                        </div>
                        <Link href="/gerenciador/super-admin/recuperar-senha" title="Recuperar Senha">
                            <span className="text-xs text-red-600 hover:underline font-semibold">Esqueceu a senha?</span>
                        </Link>
                        {error.general && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-600"
                            >
                                <CircleAlert className="size-4 shrink-0" />
                                <p className="text-xs font-bold">{error.general}</p>
                            </motion.div>
                        )}

                        <Button 
                            type="submit"
                            disabled={loading} 
                            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer transition-colors"
                        >
                            {loading ? "Autenticando..." : "Entrar"}
                        </Button>
                    </form>

                    <div className="pt-4 text-center">
                        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline">
                            Voltar ao Portal Público
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}