'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, UserPlus, Save, RefreshCcw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SubscriptionServices from '@/services/subscriptionServices';
import CursosServices from '@/services/cursosServices';
import { toast } from 'sonner';

export default function CreateSubscriptionPage() {
    const router = useRouter();
    const { id: adminId } = useParams();
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        studentId: '',
        courseId: '',
        enrollment_date: new Date().toISOString().split('T')[0],
        status: 'PENDENTE'
    });

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await CursosServices.getAll(1, 100);
                setCourses(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error(err);
            }
        };
        fetch();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.studentId || !formData.courseId) {
            toast.warning("Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            await SubscriptionServices.create(formData);
            toast.success("Inscrição criada com sucesso!");
            router.push(`/gerenciador/admin/${adminId}/dashboard/inscricoes`);
        } catch (err: any) {
            console.error(err);
            toast.error("Erro ao criar inscrição");
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
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight">Nova Inscrição</h1>
                    <p className="text-slate-500 font-medium italic">Crie uma nova inscrição en um curso.</p>
                </div>
            </div>

            <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                        <UserPlus className="size-6 text-[#f58220]" />
                        Dados da Inscrição
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-6">
                    <form id="subscription-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID do Aluno</label>
                            <Input 
                                required
                                placeholder="ID único do aluno" 
                                className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10 font-bold text-slate-700"
                                value={formData.studentId}
                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Curso</label>
                            <Select 
                                value={formData.courseId} 
                                onValueChange={(val) => setFormData({ ...formData, courseId: val })}
                            >
                                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700">
                                    <SelectValue placeholder="Selecione um curso" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    {courses.map(course => (
                                        <SelectItem key={course.id} value={course.id}>
                                            {course.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data de Inscrição</label>
                            <Input 
                                type="date"
                                className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10 font-bold text-slate-700"
                                value={formData.enrollment_date}
                                onChange={(e) => setFormData({ ...formData, enrollment_date: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                            <Select 
                                value={formData.status} 
                                onValueChange={(val) => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                                    <SelectItem value="APROVADA">Aprovada</SelectItem>
                                    <SelectItem value="RECUSADA">Recusada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="bg-slate-50/50 p-10 flex justify-end border-t border-slate-100">
                    <Button 
                        type="submit" 
                        form="subscription-form"
                        disabled={loading}
                        className="rounded-2xl h-14 bg-[#f58220] hover:bg-[#e67318] text-slate-950 px-10 font-black uppercase text-[12px] tracking-widest shadow-xl shadow-[#f58220]/20"
                    >
                        {loading ? <RefreshCcw className="size-5 animate-spin mr-2" /> : <Save className="size-5 mr-2" />}
                        Criar Inscrição
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
