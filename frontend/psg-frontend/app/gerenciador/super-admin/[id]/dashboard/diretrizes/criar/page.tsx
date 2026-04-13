'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
    ArrowLeft, 
    Upload, 
    Save, 
    FileText,
    RefreshCcw,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import DiretrizesService from '@/services/diretrizesService';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

export default function CreateGuidelinePage() {
    const router = useRouter();
    const { id: superAdminId } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        file: null as File | null
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.file) {
            toast.warning("Selecione um arquivo PDF");
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('file', formData.file);

            await DiretrizesService.create(data);
            toast.success("Diretriz publicada com sucesso!");
            router.push(`/gerenciador/super-admin/${superAdminId}/dashboard/diretrizes`);
        } catch (err: any) {
            console.error(err);
            toast.error("Erro ao publicar diretriz");
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
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight">Publicar Diretriz</h1>
                    <p className="text-slate-500 font-medium italic">Adicione normas e regulamentos ao portal PSG.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                                <FileText className="size-6 text-[#f58220]" />
                                Detalhes do Documento
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <form id="guideline-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título Amigável</label>
                                    <Input 
                                        required
                                        placeholder="Ex: Regulamento Geral 2026" 
                                        className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#004587]/10 font-bold text-slate-700"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Arquivo PDF</label>
                                    <div className="group relative">
                                        <div className="absolute inset-0 bg-slate-50 outline-dashed outline-2 outline-slate-200 rounded-2xl transition-all group-hover:outline-[#004587]/30" />
                                        <input 
                                            type="file" 
                                            accept=".pdf"
                                            onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                                            className="relative z-10 w-full opacity-0 h-32 cursor-pointer"
                                        />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <Upload className={cn("size-8 mb-2 transition-colors", formData.file ? "text-emerald-500" : "text-slate-300")} />
                                            <span className={cn("text-xs font-bold uppercase tracking-widest", formData.file ? "text-emerald-600" : "text-slate-400")}>
                                                {formData.file ? formData.file.name : "Clique ou arraste o PDF aqui"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 p-10 flex justify-end border-t border-slate-100">
                            <Button 
                                type="submit" 
                                form="guideline-form"
                                disabled={loading}
                                className="rounded-2xl h-14 bg-[#004587] hover:bg-[#00386d] text-white px-10 font-black uppercase text-[12px] tracking-widest shadow-xl shadow-[#004587]/20"
                            >
                                {loading ? <RefreshCcw className="size-5 animate-spin mr-2" /> : <Save className="size-5 mr-2" />}
                                Publicar Documento
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#004587] p-8 rounded-[40px] text-white shadow-xl shadow-[#004587]/20">
                        <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Observações</h3>
                        <p className="text-white/60 text-sm leading-relaxed font-medium italic">
                            Certifique-se de que o PDF não possui senha e que o conteúdo está atualizado. O título será exibido exatamente como digitado para os alunos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
