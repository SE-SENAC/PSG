'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ResultsServices from '@/services/resultsServices';
import { toast } from 'sonner';

export default function UpdateResultPage() {
    const router = useRouter();
    const params = useParams();
    const resultadoId = params.resultadoId as string;
    const adminId = params.id as string;
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await ResultsServices.findById(resultadoId);
                setResult(res.data || res);
            } catch (err: any) {
                toast.error('Falha ao carregar resultado');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [resultadoId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const formData = new FormData();
            if (file) {
                formData.append('file', file);
            }
            formData.append('title', result.title || '');
            formData.append('code', result.code || '');
            
            await ResultsServices.update(resultadoId, formData);
            toast.success('Resultado atualizado com sucesso!');
            router.push(`/gerenciador/admin/${adminId}/dashboard/resultados`);
        } catch (err: any) {
            console.error(err);
            toast.error('Erro ao atualizar resultado');
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
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight">Editar Resultado</h1>
                    <p className="text-slate-500 font-medium">{result?.title}</p>
                </div>
            </div>

            <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                        <FileText className="size-6 text-[#f58220]" />
                        Arquivo de Resultado
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Carregar Novo PDF (opcional)
                            </label>
                            <input 
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-[#f58220]/10 file:text-[#f58220] hover:file:bg-[#f58220]/20"
                            />
                            {file && <p className="text-sm text-emerald-600">✓ {file.name}</p>}
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
