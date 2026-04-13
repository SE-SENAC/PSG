'use client'

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthServices from "@/services/authServices";
import Link from "next/link";
import { Mail, CircleAlert, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RecuperarSenha() {
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const handleRecover = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email) {
            setError("Email é obrigatório");
            return;
        }

        setLoading(true);
        try {
            await AuthServices.forgetPassword({ email });
            setSuccess(true);
        } catch (e: any) {
            setError(e.response?.data?.message || "Ocorreu um erro ao processar sua solicitação.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Decorative backgrounds */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
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
                                <Mail className="size-10 text-primary" />
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
                                        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Recuperar Senha</h1>
                                        <p className="text-muted-foreground">
                                            Insira seu e-mail para receber um link de redefinição de senha.
                                        </p>
                                    </div>

                                    <form onSubmit={handleRecover} className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-semibold text-foreground ml-1">
                                                E-mail institucional
                                            </label>
                                            <div className="relative group">
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="seuemail@senac.br"
                                                    className={`h-12 pl-4 rounded-xl transition-all duration-300 ${error ? 'border-red-500' : 'focus:ring-2 focus:ring-primary/20'}`}
                                                />
                                            </div>
                                            {error && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-center gap-2 mt-2 text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                                                >
                                                    <CircleAlert className="size-4 shrink-0" />
                                                    <p className="text-xs font-medium">{error}</p>
                                                </motion.div>
                                            )}
                                        </div>

                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="w-full h-12 bg-[#f58220] hover:bg-[#f58220]/90 text-white font-bold rounded-xl shadow-lg shadow-[#f58220]/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Enviando...</span>
                                                </div>
                                            ) : (
                                                "Enviar link de recuperação"
                                            )}
                                        </Button>
                                    </form>

                                    <div className="text-center pt-2">
                                        <Link 
                                            href="/gerenciador/super-admin/login" 
                                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                                        >
                                            <ArrowLeft className="size-4" />
                                            Voltar para o login
                                        </Link>
                                    </div>
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
                                            <CheckCircle2 className="size-12 text-green-500 anim-check" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-foreground">E-mail enviado!</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Enviamos as instruções para redefinição de senha para <strong>{email}</strong>. 
                                            Verifique sua caixa de entrada e spam.
                                        </p>
                                    </div>
                                    <div className="pt-4">
                                        <Button 
                                            asChild
                                            className="w-full h-12 bg-primary hover:bg-primary/90 rounded-xl"
                                        >
                                            <Link href="/gerenciador/super-admin/login">
                                                Voltar ao início
                                            </Link>
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Não recebeu o e-mail? <button onClick={() => setSuccess(false)} className="underline hover:text-primary font-medium">Tentar novamente</button>
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer credit */}
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
                .anim-check {
                    animation: check 0.5s cubic-bezier(0.12, 0, 0.39, 0) forwards;
                }
                @keyframes check {
                    0% { transform: scale(0.5); opacity: 0 }
                    100% { transform: scale(1); opacity: 1 }
                }
            `}</style>
        </div>
    );
}
