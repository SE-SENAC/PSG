'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowLeft, Calendar, Download, ExternalLink } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import EditalService from "@/services/editalService";
import { Badge } from "@/components/ui/badge";

export default function VerEditalPage() {
    const router = useRouter();
    const { id: adminId, editalId } = useParams();
    const [edital, setEdital] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEdital = async () => {
            try {
                // editalId is from the URL
                const response = await EditalService.findById(Number(editalId));
                setEdital(response);
            } catch (e) {
                console.error("Erro ao buscar edital:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchEdital();
    }, [editalId]);

    if (loading) return <div className="p-8 text-center text-slate-500 text-lg">Carregando detalhes do edital...</div>;
    if (!edital) return <div className="p-8 text-center text-red-500 text-lg">Edital não encontrado.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Detalhes do Edital</h1>
                    <p className="text-slate-500">Visualize as informações e o documento oficial.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-slate-200 shadow-sm">
                    <CardHeader className="bg-slate-50/50">
                        <CardTitle className="text-xl text-slate-900">{edital.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-400 uppercase">Data de Publicação</p>
                                <div className="flex items-center gap-2 text-slate-700 font-medium">
                                    <Calendar size={16} className="text-primary" />
                                    {new Date(edital.created_at).toLocaleDateString('pt-BR')}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-400 uppercase">Status</p>
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-medium border-emerald-200">
                                    Publicado
                                </Badge>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <FileText size={16} className="text-primary" />
                                Documento PDF
                            </h4>
                            <div className="aspect-4/5 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-800 flex items-center justify-center relative group">
                                <iframe 
                                    src={edital.file_path} 
                                    className="w-full h-full"
                                    title="Visualização do PDF"
                                />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <Button variant="secondary" className="pointer-events-auto">
                                        <ExternalLink size={16} className="mr-2" />
                                        Abrir em tela cheia
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-wider text-slate-500">Ações Rápidas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full bg-primary" onClick={() => window.open(edital.file_path, '_blank')}>
                                <Download size={18} className="mr-2" /> Baixar PDF
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => router.push(`/gerenciador/admin/${adminId}/dashboard/edital/atualizar/${edital.id}`)}>
                                Editar Informações
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm bg-blue-50/30">
                        <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <p className="text-sm font-medium text-slate-900">ID do Documento</p>
                            <code className="text-[10px] bg-white px-2 py-1 rounded border border-blue-100 text-blue-800 break-all w-full">
                                {edital.id}
                            </code>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
