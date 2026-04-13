'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Users, Loader, Mail, Phone, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SubscriptionServices from '@/services/subscriptionServices';
import { toast } from 'sonner';

export default function ViewSubscriptionPage() {
    const router = useRouter();
    const params = useParams();
    const inscricaoId = params.inscricaoId as string;
    const [subscription, setSubscription] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await SubscriptionServices.get(inscricaoId);
                setSubscription(res.data || res);
            } catch (err) {
                toast.error('Falha ao carregar inscrição');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [inscricaoId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader className="size-8 animate-spin text-[#f58220]" />
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">Inscrição não encontrada</p>
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
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight">Inscrição</h1>
                    <p className="text-slate-500 font-medium">{subscription.student?.name || 'Candidato'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Informações do Candidato */}
                    <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                                <Users className="size-6 text-[#f58220]" />
                                Dados do Candidato
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-4">
                            {subscription.student && (
                                <>
                                    <div className="space-y-2">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome Completo</p>
                                        <p className="text-slate-900 font-semibold">{subscription.student.name}</p>
                                    </div>
                                    {subscription.student.email && (
                                        <div className="space-y-2">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Mail className="size-4" />Email
                                            </p>
                                            <p className="text-slate-700">{subscription.student.email}</p>
                                        </div>
                                    )}
                                    {subscription.student.phone && (
                                        <div className="space-y-2">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Phone className="size-4" />Telefone
                                            </p>
                                            <p className="text-slate-700">{subscription.student.phone}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Informações do Curso */}
                    {subscription.course && (
                        <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                            <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                                <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                                    <Book className="size-6 text-[#f58220]" />
                                    Curso Inscrito
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-10 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome do Curso</p>
                                    <p className="text-slate-900 font-semibold">{subscription.course.title}</p>
                                </div>
                                {subscription.subscription_date && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Data de Inscrição</p>
                                        <p className="text-slate-700">{new Date(subscription.subscription_date).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                )}
                                {subscription.status && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</p>
                                        <Badge className={subscription.status === 'approved' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                                            {subscription.status === 'approved' ? 'Aprovado' : 'Pendente'}
                                        </Badge>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden sticky top-6">
                        <CardHeader className="bg-linear-to-br from-[#004587] to-[#003450] p-10 text-white">
                            <CardTitle className="text-lg font-black uppercase tracking-tight">Ações</CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-4">
                            <Button 
                                variant="outline" 
                                className="w-full rounded-2xl border-2 border-[#004587] text-[#004587] hover:bg-[#004587] hover:text-white font-black h-12"
                                onClick={() => router.push(`/gerenciador/super-admin/${params.id}/dashboard/inscricoes/atualizar/${inscricaoId}`)}
                            >
                                Editar
                            </Button>
                            <Button 
                                variant="destructive"
                                className="w-full rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black h-12"
                            >
                                Excluir
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
