'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function UpdateAdminPage() {
    const router = useRouter();
    const params = useParams();
    const adminId = params.adminId as string;
    const superAdminId = params.id as string;

    const [admin, setAdmin] = useState<any>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                // TODO: Implement getAdminById from AdminServices
                setAdmin({
                    id: adminId,
                    name: 'Admin User',
                    email: 'admin@example.com'
                });
                setName('Admin User');
                setEmail('admin@example.com');
            } catch (err) {
                toast.error('Falha ao carregar administrador');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [adminId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            toast.error('Nome e email são obrigatórios');
            return;
        }

        setSubmitting(true);
        try {
            // TODO: Implement AdminServices.update()
            toast.success('Administrador atualizado com sucesso!');
            router.push(`/gerenciador/super-admin/${superAdminId}/dashboard/admin`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Erro ao atualizar administrador');
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
                <h1 className="text-3xl font-black text-[#004587] tracking-tight">Atualizar Administrador</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                        <CardTitle className="text-lg font-black text-[#004587] uppercase tracking-tight">
                            Informações Pessoais
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-black text-slate-700 uppercase tracking-widest">Nome *</Label>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nome completo"
                                className="h-12 rounded-full border-2 border-slate-200 px-6 text-base"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-black text-slate-700 uppercase tracking-widest">Email *</Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                className="h-12 rounded-full border-2 border-slate-200 px-6 text-base"
                            />
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
                        {submitting ? 'Atualizando...' : 'Atualizar'}
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
