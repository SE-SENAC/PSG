'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, FileText, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import EditalService from '@/services/editalService';
import { toast } from 'sonner';

export default function ViewEditalPage() {
    const router = useRouter();
    const params = useParams();
    const editalId = params.editalId as string;
    const [edital, setEdital] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await EditalService.findById(editalId);
                setEdital(res.data || res);
            } catch (err) {
                toast.error('Falha ao carregar edital');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [editalId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader className="size-8 animate-spin text-[#f58220]" />
            </div>
        );
    }

    if (!edital) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">Edital não encontrado</p>
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
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight">{edital.title}</h1>
                    <p className="text-slate-500 font-medium">Edital</p>
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
                    {edital.file_path && (
                        <div className="pt-6">
                            <Button 
                                onClick={() => window.open(edital.file_path, '_blank')}
                                className="w-full h-14 bg-[#f58220] hover:bg-[#e67318] text-slate-950 font-black rounded-2xl"
                            >
                                <FileText className="mr-2 size-5" />
                                Visualizar Edital
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex gap-4">
                <Button 
                    variant="outline"
                    className="flex-1 rounded-2xl border-2 border-[#004587] text-[#004587] hover:bg-[#004587] hover:text-white font-black h-12"
                    onClick={() => router.push(`/gerenciador/super-admin/${params.id}/dashboard/edital/atualizar/${editalId}`)}
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
