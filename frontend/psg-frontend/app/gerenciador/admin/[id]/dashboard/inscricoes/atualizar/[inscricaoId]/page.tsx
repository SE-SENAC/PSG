'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SubscriptionServices from '@/services/subscriptionServices';
import { toast } from 'sonner';

export default function UpdateSubscriptionPage() {
    const router = useRouter();
    const params = useParams();
    const inscricaoId = params.inscricaoId as string;
    const adminId = params.id as string;
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [subscription, setSubscription] = useState<any>(null);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const res = await SubscriptionServices.get(inscricaoId);
                setSubscription(res.data || res);
            } catch (err: any) {
                toast.error('Falha ao carregar inscrição');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscription();
    }, [inscricaoId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            await SubscriptionServices.update(inscricaoId, {
                status: subscription.status,
                subscription_date: subscription.subscription_date
            });
            toast.success('Inscrição atualizada com sucesso!');
            router.push(`/gerenciador/admin/${adminId}/dashboard/inscricoes`);
        } catch (err: any) {
            console.error(err);
            toast.error('Erro ao atualizar inscrição');
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
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight">Editar Inscrição</h1>
                    <p className="text-slate-500 font-medium">{subscription?.student?.name}</p>
                </div>
            </div>

            <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                        <Users className="size-6 text-[#f58220]" />
                        Status da Inscrição
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</label>
                            <Select value={subscription?.status || 'pending'} onValueChange={(value) => setSubscription({...subscription, status: value})}>
                                <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pendente</SelectItem>
                                    <SelectItem value="approved">Aprovado</SelectItem>
                                    <SelectItem value="rejected">Rejeitado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Data da Inscrição</label>
                            <input 
                                type="date"
                                value={subscription?.subscription_date ? new Date(subscription.subscription_date).toISOString().split('T')[0] : ''}
                                onChange={(e) => setSubscription({...subscription, subscription_date: e.target.value})}
                                className="w-full h-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#f58220]/10 px-4"
                            />
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
