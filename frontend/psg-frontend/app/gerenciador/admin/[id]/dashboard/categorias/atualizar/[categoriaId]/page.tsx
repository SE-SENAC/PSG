'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import CategoryServices from '@/services/categoryServices';
import { toast } from 'sonner';

export default function UpdateCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categoriaId = params.categoriaId as string;
    const adminId = params.id as string;
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<any>({ active: true });

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await CategoryServices.getById(categoriaId);
                setFormData(res.data || res);
            } catch (err: any) {
                toast.error('Falha ao carregar categoria');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [categoriaId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title?.trim()) {
            toast.warning('Preencha o título da categoria');
            return;
        }

        setSubmitting(true);
        try {
            await CategoryServices.update(categoriaId, formData);
            toast.success('Categoria atualizada com sucesso!');
            router.push(`/gerenciador/admin/${adminId}/dashboard/categorias`);
        } catch (err: any) {
            console.error(err);
            toast.error('Erro ao atualizar categoria');
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
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight">Editar Categoria</h1>
                    <p className="text-slate-500 font-medium">{formData.title}</p>
                </div>
            </div>

            <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                        <Tag className="size-6 text-[#f58220]" />
                        Informações da Categoria
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Título</label>
                            <Input 
                                value={formData.title || ''} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="h-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Descrição</label>
                            <Textarea 
                                value={formData.description || ''} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="min-h-24 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10"
                            />
                        </div>

                        <div className="flex items-center gap-3 py-2">
                            <Checkbox 
                                id="active" 
                                checked={formData.active || false}
                                onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                            />
                            <label htmlFor="active" className="text-sm font-semibold text-slate-700 cursor-pointer">
                                Categoria Ativa
                            </label>
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
