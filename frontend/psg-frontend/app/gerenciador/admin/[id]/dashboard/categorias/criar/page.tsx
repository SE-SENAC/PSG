'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus, Save, RefreshCcw, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import CategoryServices from '@/services/categoryServices';
import { toast } from 'sonner';

export default function CreateCategoryPage() {
    const router = useRouter();
    const { id: adminId } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        active: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            toast.warning("Preencha o título da categoria");
            return;
        }

        setLoading(true);
        try {
            await CategoryServices.create(formData);
            toast.success("Categoria criada com sucesso!");
            router.push(`/gerenciador/admin/${adminId}/dashboard/categorias`);
        } catch (err: any) {
            console.error(err);
            toast.error("Erro ao criar categoria");
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
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight">Nova Categoria</h1>
                    <p className="text-slate-500 font-medium italic">Crie uma nova categoria de cursos.</p>
                </div>
            </div>

            <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                        <BookOpen className="size-6 text-[#f58220]" />
                        Informações da Categoria
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-6">
                    <form id="category-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título da Categoria</label>
                            <Input 
                                required
                                placeholder="Ex: Saúde e Bem-estar" 
                                className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10 font-bold text-slate-700"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
                            <Textarea 
                                placeholder="Descreva esta categoria de cursos..." 
                                className="min-h-[120px] rounded-3xl bg-slate-50 border-none font-medium text-slate-700 p-6 focus:ring-2 focus:ring-[#f58220]/10"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="bg-slate-50/50 p-10 flex justify-end border-t border-slate-100">
                    <Button 
                        type="submit" 
                        form="category-form"
                        disabled={loading}
                        className="rounded-2xl h-14 bg-[#f58220] hover:bg-[#e67318] text-slate-950 px-10 font-black uppercase text-[12px] tracking-widest shadow-xl shadow-[#f58220]/20"
                    >
                        {loading ? <RefreshCcw className="size-5 animate-spin mr-2" /> : <Save className="size-5 mr-2" />}
                        Criar Categoria
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
