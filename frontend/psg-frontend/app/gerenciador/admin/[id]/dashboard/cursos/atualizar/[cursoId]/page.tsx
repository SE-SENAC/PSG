'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Save, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import CursosServices from '@/services/cursosServices';
import { toast } from 'sonner';

export default function UpdateCoursePage() {
    const router = useRouter();
    const params = useParams();
    const cursoId = params.cursoId as string;
    const adminId = params.id as string;
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await CursosServices.findById(cursoId);
                setFormData(res.data || res);
            } catch (err: any) {
                toast.error('Falha ao carregar curso');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [cursoId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title?.trim()) {
            toast.warning('Preencha o título do curso');
            return;
        }

        setSubmitting(true);
        try {
            await CursosServices.update(cursoId, formData);
            toast.success('Curso atualizado com sucesso!');
            router.push(`/gerenciador/admin/${adminId}/dashboard/cursos`);
        } catch (err: any) {
            console.error(err);
            toast.error('Erro ao atualizar curso');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader className="size-8 animate-spin text-[#f58220]" />
            </div>
        );
    }

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
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight">Editar Curso</h1>
                    <p className="text-slate-500 font-medium">{formData.title}</p>
                </div>
            </div>

            <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                        <BookOpen className="size-6 text-[#f58220]" />
                        Informações do Curso
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Título</label>
                                <Input 
                                    value={formData.title || ''} 
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="h-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Código</label>
                                <Input 
                                    value={formData.code || ''} 
                                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                                    className="h-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Descrição</label>
                            <Textarea 
                                value={formData.description || ''} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="min-h-24 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tipo/Modalidade</label>
                                <Input 
                                    value={formData.type || ''} 
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    className="h-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Municipalidade</label>
                                <Input 
                                    value={formData.municipality || ''} 
                                    onChange={(e) => setFormData({...formData, municipality: e.target.value})}
                                    className="h-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Endereço</label>
                            <Input 
                                value={formData.address || ''} 
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                className="h-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10"
                            />
                        </div>

                        <div className="flex gap-4 pt-6">
                            <Button 
                                type="submit" 
                                disabled={submitting}
                                className="flex-1 h-12 bg-[#f58220] hover:bg-[#e67318] text-slate-950 font-black rounded-2xl"
                            >
                                <Save className="size-4 mr-2" />
                                {submitting ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex-1 h-12 rounded-2xl border-2 border-slate-200"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
