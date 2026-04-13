'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import SubscriptionServices from '@/services/subscriptionServices';
import { toast } from 'sonner';

export default function CreateSubscriptionPage() {
    const router = useRouter();
    const params = useParams();
    const adminId = params.id as string;
    
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        course_id: '',
        student_id: '',
        subscription_date: new Date().toISOString().split('T')[0],
        status: 'pending'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.student_id.trim() || !formData.course_id.trim()) {
            toast.warning("Preencha todos os campos obrigatórios");
            return;
        }

        setLoading(true);
        try {
            await SubscriptionServices.create(formData.course_id, formData.student_id);
            toast.success("Inscrição criada com sucesso!");
            router.push(`/gerenciador/super-admin/${adminId}/dashboard/inscricoes`);
        } catch (err: any) {
            console.error(err);
            toast.error("Erro ao criar inscrição");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    onClick={() => router.back()}
                    className="rounded-2xl hover:bg-slate-100 size-12 flex items-center justify-center p-0"
                >
                    <ArrowLeft className="size-6 text-slate-400" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight">Nova Inscrição</h1>
                    <p className="text-slate-500 font-medium">Registre uma nova inscrição de aluno.</p>
                </div>
            </div>

            <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                        <Users className="size-6 text-[#f58220]" />
                        Dados da Inscrição
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                    <form id="subscription-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">ID do Aluno</label>
                                <Input 
                                    required
                                    placeholder="ID do aluno" 
                                    className="h-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10"
                                    value={formData.student_id}
                                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">ID do Curso</label>
                                <Input 
                                    required
                                    placeholder="ID do curso" 
                                    className="h-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10"
                                    value={formData.course_id}
                                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Data da Inscrição</label>
                                <input 
                                    type="date"
                                    required
                                    className="w-full h-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10 px-4"
                                    value={formData.subscription_date}
                                    onChange={(e) => setFormData({ ...formData, subscription_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</label>
                                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                    <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pendente</SelectItem>
                                        <SelectItem value="approved">Aprovado</SelectItem>
                                        <SelectItem value="rejected">Rejeitado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="bg-slate-50/30 p-10 border-t border-slate-100 flex gap-4">
                    <Button 
                        form="subscription-form"
                        type="submit"
                        disabled={loading}
                        className="flex-1 h-12 bg-[#f58220] hover:bg-[#e67318] text-slate-950 font-black rounded-2xl"
                    >
                        <Plus className="size-4 mr-2" />
                        {loading ? 'Criando...' : 'Criar Inscrição'}
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex-1 h-12 rounded-2xl border-2 border-slate-200"
                    >
                        Cancelar
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
