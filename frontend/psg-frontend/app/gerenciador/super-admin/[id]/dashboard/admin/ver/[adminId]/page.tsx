'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Users, Loader, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function ViewAdminPage() {
    const router = useRouter();
    const params = useParams();
    const adminId = params.adminId as string;
    const [admin, setAdmin] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                // TODO: Implement getAdminById from AdminServices
                // For now, showing a placeholder
                setAdmin({
                    id: adminId,
                    name: 'Admin User',
                    email: 'admin@example.com',
                    role: 'ROLE.ADMIN',
                    status: 'active'
                });
            } catch (err) {
                toast.error('Falha ao carregar administrador');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [adminId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader className="size-8 animate-spin text-[#f58220]" />
            </div>
        );
    }

    if (!admin) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">Administrador não encontrado</p>
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
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight">{admin.name}</h1>
                    <p className="text-slate-500 font-medium">Administrador</p>
                </div>
            </div>

            <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                        <Shield className="size-6 text-[#f58220]" />
                        Detalhes do Administrador
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-6">
                    <div className="space-y-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome</p>
                        <p className="text-slate-900 font-semibold text-lg">{admin.name}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Email</p>
                        <p className="text-slate-700">{admin.email}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Função</p>
                        <Badge className="bg-[#004587]/10 text-[#004587]">
                            {admin.role}
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</p>
                        <Badge className={admin.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}>
                            {admin.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4">
                <Button 
                    variant="outline"
                    className="flex-1 rounded-2xl border-2 border-[#004587] text-[#004587] hover:bg-[#004587] hover:text-white font-black h-12"
                    onClick={() => router.push(`/gerenciador/super-admin/${params.id}/dashboard/admin/atualizar/${adminId}`)}
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
