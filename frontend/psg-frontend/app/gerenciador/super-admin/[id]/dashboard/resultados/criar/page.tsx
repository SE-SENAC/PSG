'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, Save, LineChart, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import ResultsServices from '@/services/resultsServices';
import { toast } from 'sonner';

export default function CreateResultPage() {
    const router = useRouter();
    const { id: superAdminId } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ title: '', file: null as File | null });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.file) { toast.warning("Anexe o documento de resultados"); return; }
        setLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('file', formData.file);
            await ResultsServices.create(data);
            toast.success("Resultado publicado com sucesso!");
            router.push(`/gerenciador/super-admin/${superAdminId}/dashboard/resultados`);
        } catch (err) { toast.error("Erro ao publicar resultado"); } finally { setLoading(false); }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()} className="rounded-2xl size-12 p-0"><ArrowLeft className="size-6 text-slate-400" /></Button>
                <div><h1 className="text-3xl font-black text-[#004587] tracking-tight uppercase">Divulgar Resultados</h1><p className="text-slate-500 font-medium italic">Publique as listas de selecionados e classificações finais.</p></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100"><CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight"><LineChart className="size-6 text-emerald-500" />Lista de Selecionados</CardTitle></CardHeader>
                        <CardContent className="p-10 space-y-6">
                            <form id="results-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição do Resultado</label><Input required placeholder="Ex: Resultado Final - Edital 001/2026" className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
                                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Documento (PDF/Excel)</label>
                                    <div className="group relative h-40 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center hover:border-emerald-500/30 transition-all cursor-pointer">
                                        <input type="file" onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <Upload className={`size-10 mb-2 ${formData.file ? 'text-emerald-500' : 'text-slate-300'}`} />
                                        <span className={`text-xs font-black uppercase tracking-widest ${formData.file ? 'text-emerald-600' : 'text-slate-400'}`}>{formData.file ? formData.file.name : "Clique para anexar os resultados"}</span>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 p-10 flex justify-end border-t border-slate-100"><Button type="submit" form="results-form" disabled={loading} className="rounded-2xl h-14 bg-emerald-600 hover:bg-emerald-700 text-white px-10 font-black uppercase text-[12px] tracking-widest shadow-xl shadow-emerald-600/20">{loading ? <RefreshCcw className="size-5 animate-spin mr-2" /> : <Save className="size-5 mr-2" />}Divulgar Resultados</Button></CardFooter>
                    </Card>
                </div>
                <div className="lg:col-span-1"><div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-xl relative overflow-hidden"><h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Divulgação</h3><p className="text-slate-400 text-sm leading-relaxed font-medium italic">A publicação dos resultados encerra o ciclo do edital e formaliza as convocações para matrícula.</p></div></div>
            </div>
        </div>
    );
}
