'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, Save, ScrollText, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import EditalService from '@/services/editalService';
import { toast } from 'sonner';

export default function CreateEditalPage() {
    const router = useRouter();
    const { id: superAdminId } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ title: '', file: null as File | null });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.file) { toast.warning("Selecione o edital em PDF"); return; }
        setLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('file', formData.file);
            await EditalService.create(data);
            toast.success("Edital publicado com sucesso!");
            router.push(`/gerenciador/super-admin/${superAdminId}/dashboard/edital`);
        } catch (err) { toast.error("Erro ao publicar edital"); } finally { setLoading(false); }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()} className="rounded-2xl size-12 p-0"><ArrowLeft className="size-6 text-slate-400" /></Button>
                <div><h1 className="text-3xl font-black text-[#004587] tracking-tight uppercase">Publicar Novo Edital</h1><p className="text-slate-500 font-medium italic">Disponibilize as regras oficiais de novos cursos.</p></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100"><CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight"><ScrollText className="size-6 text-[#f58220]" />Dados do Edital</CardTitle></CardHeader>
                        <CardContent className="p-10 space-y-6">
                            <form id="edital-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título do Edital</label><Input required placeholder="Ex: Edital 001/2026 - Tecnologia" className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
                                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Arquivo Oficial (PDF)</label>
                                    <div className="group relative h-40 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center hover:border-[#004587]/30 transition-all cursor-pointer">
                                        <input type="file" accept=".pdf" onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <Upload className={`size-10 mb-2 ${formData.file ? 'text-emerald-500' : 'text-slate-300'}`} />
                                        <span className={`text-xs font-black uppercase tracking-widest ${formData.file ? 'text-emerald-600' : 'text-slate-400'}`}>{formData.file ? formData.file.name : "Clique para anexar o arquivo"}</span>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 p-10 flex justify-end border-t border-slate-100"><Button type="submit" form="edital-form" disabled={loading} className="rounded-2xl h-14 bg-[#004587] hover:bg-[#00386d] text-white px-10 font-black uppercase text-[12px] tracking-widest shadow-xl shadow-[#004587]/20">{loading ? <RefreshCcw className="size-5 animate-spin mr-2" /> : <Save className="size-5 mr-2" />}Publicar Edital</Button></CardFooter>
                    </Card>
                </div>
                <div className="lg:col-span-1"><div className="bg-[#004587] p-10 rounded-[40px] text-white shadow-xl shadow-[#004587]/20 relative overflow-hidden"><h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Transparência</h3><p className="text-white/60 text-sm leading-relaxed font-medium italic">Editais são documentos públicos e fundamentais para a lisura do Programa de Gratuidade.</p></div></div>
            </div>
        </div>
    );
}
