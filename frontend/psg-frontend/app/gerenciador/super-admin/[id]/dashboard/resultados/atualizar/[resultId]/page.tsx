'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import ResultsServices from '@/services/resultsServices';
import { toast } from 'sonner';

export default function UpdateResultPage() {
    const router = useRouter();
    const params = useParams();
    const resultId = params.resultId as string;
    const adminId = params.id as string;

    const [result, setResult] = useState<any>(null);
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await ResultsServices.findById(resultId);
                const data = res.data || res;
                setResult(data);
                setTitle(data.title || '');
                setCode(data.code || '');
            } catch (err) {
                toast.error('Falha ao carregar resultado');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [resultId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error('Título é obrigatório');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('code', code);
            if (file) {
                formData.append('file', file);
            }

            await ResultsServices.update(resultId, formData);
            toast.success('Resultado atualizado com sucesso!');
            router.push(`/gerenciador/super-admin/${adminId}/dashboard/resultados`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Erro ao atualizar resultado');
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
        <div className="max-w-2xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    onClick={() => router.back()}
                    className="rounded-2xl hover:bg-slate-100 size-12 flex items-center justify-center p-0"
                >
                    <ArrowLeft className="size-6 text-slate-400" />
                </Button>
                <h1 className="text-3xl font-black text-[#004587] tracking-tight">Atualizar Resultado</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                        <CardTitle className="text-lg font-black text-[#004587] uppercase tracking-tight">
                            Informações
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-black text-slate-700 uppercase tracking-widest">Título *</Label>
                            <Input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Título do resultado"
                                className="h-12 rounded-full border-2 border-slate-200 px-6 text-base"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-black text-slate-700 uppercase tracking-widest">Código</Label>
                            <Input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Código do resultado"
                                className="h-12 rounded-full border-2 border-slate-200 px-6 text-base"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                        <CardTitle className="text-lg font-black text-[#004587] uppercase tracking-tight">
                            Arquivo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-black text-slate-700 uppercase tracking-widest">Documento PDF (Opcional)</Label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#f58220] file:text-white file:font-black hover:file:bg-[#e67318]"
                            />
                            {result?.file_path && !file && (
                                <p className="text-xs text-slate-500">Arquivo atual: {result.file_path.split('/').pop()}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4 pt-6">
                    <Button 
                        type="submit"
                        disabled={submitting}
                        className="flex-1 h-14 bg-[#f58220] hover:bg-[#e67318] text-slate-950 font-black rounded-2xl"
                    >
                        {submitting ? <Loader className="animate-spin mr-2 size-4" /> : null}
                        {submitting ? 'Atualizando...' : 'Atualizar Resultado'}
                    </Button>
                    <Button 
                        type="button"
                        onClick={() => router.back()}
                        variant="outline"
                        className="flex-1 h-14 border-2 border-slate-200 rounded-2xl font-black"
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}
