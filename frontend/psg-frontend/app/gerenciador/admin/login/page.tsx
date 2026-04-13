'use client'

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthServices from "@/services/authServices";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCircle, CircleAlert, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { login } from "@/lib/store/auth/auth";

export default function Login() {
    const dispatch = useDispatch();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const verifyForm = () => {
        let errors: Record<string, string> = {};
        if (!email) errors.email = "Email é obrigatório";
        if (!password) errors.password = "Senha é obrigatória";
        setError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = async () => {
        if (!verifyForm()) return;

        setLoading(true);
        try {
            const auth = await AuthServices.loginAdmin({ email, password });
            dispatch(login({ user: auth.userExists, token: auth.token }));

            if (auth.userExists.role === 'superadmin') {
                router.push(`/gerenciador/super-admin/${auth.userExists.id}/dashboard`);
            } else {
                router.push(`/gerenciador/admin/${auth.userExists.id}/dashboard`);
            }
        } catch (e: any) {
            setError({ general: e.response?.data?.message || 'Credenciais inválidas' });
        } finally {
            setLoading(false);
        }
    };

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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002d5b] via-[#00386d] to-[#0d4f8b] px-4 py-10">
                <div className="relative w-full max-w-xl rounded-[32px] border border-[#f58220]/20 bg-white/90 p-10 shadow-2xl shadow-[#0b3050]/30 backdrop-blur-xl">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f58220] p-6 shadow-[#f58220]/40">
                        <UserCircle className="text-white size-12" />
                    </div>

                    <div className="mt-12 text-center">
                        <h1 className="text-3xl font-black text-[#002d5b] uppercase tracking-tight">Painel Administrativo PSG</h1>
                        <p className="mt-2 text-sm text-slate-600">Acesso exclusivo para administradores do PSG.</p>
                    </div>

                    <div className="mt-10 space-y-6">
                        <div className="grid gap-5">
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${error?.email ? 'text-rose-400' : 'text-slate-300'}`}>Email</label>
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seuemail@empresa.com"
                                    className={`h-12 ${error?.email ? 'border-rose-500 focus-visible:ring-rose-500' : 'focus-visible:ring-emerald-500'}`}
                                />
                                {error?.email && (
                                    <div className="mt-2 flex items-center gap-2 text-rose-400 text-sm">
                                        <CircleAlert className="size-4" />
                                        <span>{error.email}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className={`text-sm font-medium ${error?.password ? 'text-rose-400' : 'text-slate-300'}`}>Senha</label>
                                </div>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Digite sua senha"
                                    className={`h-12 ${error?.password ? 'border-rose-500 focus-visible:ring-rose-500' : 'focus-visible:ring-emerald-500'}`}
                                />
                                {error?.password && (
                                    <div className="mt-2 flex items-center gap-2 text-rose-400 text-sm">
                                        <CircleAlert className="size-4" />
                                        <span>{error.password}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/gerenciador/admin/recuperar-senha" className="text-xs font-semibold text-[#004587] hover:text-[#002d5b]">
                                Recuperar senha
                            </Link>
                        </div>

                        {error?.general && (
                            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-500">
                                {error.general}
                            </div>
                        )}

                        <Button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full rounded-2xl bg-[#004587] px-5 py-3 text-base font-bold text-white transition hover:bg-[#00386d] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Autenticando...' : 'Entrar'}
                        </Button>
                    </div>

                    <div className="mt-8 text-center text-xs text-slate-500">
                        <p>Entrar no portal administrativo do PSG com segurança e credenciais válidas.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
