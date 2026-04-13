'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, FileText, Calendar, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ResultsServices from '@/services/resultsServices';
import { toast } from 'sonner';

export default function ViewResultPage() {
    const router = useRouter();
    const params = useParams();
    const resultadoId = params.resultadoId as string;
    const [result, setResult] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await ResultsServices.findById(resultadoId);
                setResult(res.data || res);
            } catch (err) {
                toast.error('Falha ao carregar resultado');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [resultadoId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader className="size-8 animate-spin text-[#f58220]" />
            </div>
        );
    }

    if (!result) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">Resultado não encontrado</p>
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
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight">{result.title}</h1>
                    <p className="text-slate-500 font-medium">Resultado - {result.code}</p>
                </div>
            </div>

            <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                        <FileText className="size-6 text-[#f58220]" />
                        Informações
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-6">
                    <div className="space-y-2 flex items-start gap-2">
                        <Calendar className="size-4 text-slate-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Data de Publicação</p>
                            <p className="text-slate-700">{result.created_at ? new Date(result.created_at).toLocaleDateString('pt-BR') : '---'}</p>
                        </div>
                    </div>

                    {result.file_path && (
                        <div className="pt-6 border-t border-slate-200">
                            <Button 
                                onClick={() => window.open(result.file_path, '_blank')}
                                className="w-full h-14 bg-[#f58220] hover:bg-[#e67318] text-slate-950 font-black rounded-2xl"
                            >
                                <FileText className="mr-2 size-5" />
                                Visualizar Documento
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex gap-4 pt-6">
                <Button 
                    onClick={() => router.push(`/gerenciador/admin/${params.id}/dashboard/resultados/atualizar/${resultadoId}`)}
                    variant="outline"
                    className="flex-1 rounded-2xl border-2 border-[#004587] text-[#004587] hover:bg-[#004587] hover:text-white font-black h-12"
                >
                    Editar
                </Button>
                <Button 
                    variant="destructive"
                    className="flex-1 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black h-12"
                >
                    Excluir
                </Button>
            </div>
        </div>
    );
}
