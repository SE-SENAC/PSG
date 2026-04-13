'use client'

import { useState, useEffect, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthServices from "@/services/authServices";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CircleAlert, CheckCircle2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function RedefinirSenhaContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        if (!token) {
            setError("Token de recuperação ausente ou inválido.");
        }
    }, [token]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError("Token inválido.");
            return;
        }

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);
        try {
            await AuthServices.resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => {
                router.push("/gerenciador/admin/login");
            }, 3000);
        } catch (e: any) {
            setError(e.response?.data?.message || "Erro ao redefinir senha. O link pode ter expirado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Decorative backgrounds */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="bg-card border border-border/50 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm">
                    <div className="h-2 bg-gradient-to-r from-[#004587] via-[#f58220] to-[#004587]" />
                    
                    <div className="p-8 sm:p-12">
                        <div className="flex justify-center mb-8">
                            <div className="bg-primary/10 p-4 rounded-2xl">
                                <ShieldCheck className="size-10 text-primary" />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {!success ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center space-y-2">
                                        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Nova Senha</h1>
                                        <p className="text-muted-foreground">
                                            Crie uma nova senha forte para sua conta.
                                        </p>
                                    </div>

                                    <form onSubmit={handleReset} className="space-y-4 pt-4">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-foreground ml-1">
                                                    Nova Senha
                                                </label>
                                                <div className="relative group">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder="••••••••"
                                                        className="h-12 pr-12 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
                                                    />
                                                    <button 
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-foreground ml-1">
                                                    Confirmar Nova Senha
                                                </label>
                                                <div className="relative group">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        placeholder="••••••••"
                                                        className="h-12 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {error && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20"
                                            >
                                                <CircleAlert className="size-4 shrink-0" />
                                                <p className="text-xs font-semibold">{error}</p>
                                            </motion.div>
                                        )}

                                        <Button 
                                            type="submit" 
                                            disabled={loading || !!error && !token}
                                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Processando...</span>
                                                </div>
                                            ) : (
                                                "Redefinir Senha"
                                            )}
                                        </Button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-6 py-4"
                                >
                                    <div className="flex justify-center">
                                        <div className="bg-green-500/10 p-5 rounded-full border border-green-500/20">
                                            <CheckCircle2 className="size-12 text-green-500" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-foreground">Sucesso!</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Sua senha foi redefinida com sucesso. <br /> Redirecionando para o login...
                                        </p>
                                    </div>
                                    <div className="pt-4">
                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 3 }}
                                                className="h-full bg-green-500"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-muted-foreground/60 uppercase tracking-widest font-bold">
                    PSG &copy; 2026 - Senac Sergipe
                </div>
            </motion.div>

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) }
                    50% { transform: translateY(-20px) }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default function RedefinirSenha() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-foreground uppercase tracking-widest font-bold animate-pulse">Carregando...</div>}>
            <RedefinirSenhaContent />
        </Suspense>
    )
}
