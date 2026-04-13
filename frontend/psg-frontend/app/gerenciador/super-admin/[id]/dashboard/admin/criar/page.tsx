'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
    UserPlus, 
    ArrowLeft, 
    Save, 
    Mail, 
    Lock, 
    User,
    ShieldCheck,
    AlertCircle,
    RefreshCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import SuperAdminServices from '@/services/superAdminServices';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function CreateAdminPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error("As senhas não coincidem!");
            return;
        }

        if (formData.password.length < 6) {
            toast.warning("A senha deve ter pelo menos 6 caracteres");
            return;
        }

        setLoading(true);
        try {
            await SuperAdminServices.createAdmin({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            toast.success("Novo Administrador criado com sucesso!");
            router.push(`/gerenciador/super-admin/${id}/dashboard/admin`);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Erro ao criar administrador");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    onClick={() => router.back()}
                    className="rounded-2xl hover:bg-slate-100 size-12 flex items-center justify-center p-0"
                >
                    <ArrowLeft className="size-6 text-slate-400" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight">Novo Administrador</h1>
                    <p className="text-slate-500 font-medium italic">Cadastre um novo gestor para o programa PSG.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                                <UserPlus className="size-6 text-[#f58220]" />
                                Dados de Identificação
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <form id="admin-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
                                            <Input 
                                                required
                                                placeholder="Digite o nome completo do gestor" 
                                                className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#004587]/10 font-bold text-slate-700"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Institucional</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
                                            <Input 
                                                required
                                                type="email"
                                                placeholder="exemplo@senac.br" 
                                                className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#004587]/10 font-bold text-slate-700"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha de Acesso</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
                                                <Input 
                                                    required
                                                    type="password"
                                                    placeholder="••••••••" 
                                                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#004587]/10 font-bold text-slate-700"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar Senha</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
                                                <Input 
                                                    required
                                                    type="password"
                                                    placeholder="••••••••" 
                                                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#004587]/10 font-bold text-slate-700"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 p-10 flex justify-between items-center border-t border-slate-100">
                            <p className="text-xs text-slate-400 font-bold max-w-[200px] leading-relaxed italic">
                                * O novo administrador terá acesso imediato às ferramentas de gestão após o cadastro.
                            </p>
                            <Button 
                                type="submit" 
                                form="admin-form"
                                disabled={loading}
                                className="rounded-2xl h-14 bg-[#004587] hover:bg-[#00386d] text-white px-10 font-black uppercase text-[12px] tracking-widest shadow-xl shadow-[#004587]/20 transition-all hover:scale-105 active:scale-95"
                            >
                                {loading ? <RefreshCcw className="size-5 animate-spin mr-2" /> : <Save className="size-5 mr-2" />}
                                Finalizar Cadastro
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#004587] p-10 rounded-[40px] text-white shadow-2xl shadow-[#004587]/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <ShieldCheck className="size-12 text-[#f58220] mb-6" />
                            <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Nível de Acesso</h3>
                            <p className="text-white/60 text-sm leading-relaxed font-medium">
                                Por padrão, novos administradores possuem permissões para gerenciar cursos, alunos e editais. 
                                <br/><br/>
                                Para privilégios de Super Admin, as permissões devem ser alteradas manualmente no banco de dados por segurança.
                            </p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 size-40 bg-white/5 rounded-full blur-3xl"></div>
                    </div>

                    <div className="bg-amber-50 p-8 rounded-[40px] border border-amber-100 flex gap-4">
                        <AlertCircle className="size-8 text-amber-500 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-amber-900 text-sm uppercase tracking-tight mb-1">Segurança de Senha</h4>
                            <p className="text-amber-800/70 text-xs leading-relaxed font-medium">
                                Recomende aos novos gestores que utilizem senhas fortes com números e símbolos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
