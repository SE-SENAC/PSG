'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Key, 
    Search, 
    RefreshCcw,
    User,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    MoreVertical,
    ClipboardCheck
} from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SubscriptionServices from '@/services/subscriptionServices';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    const fetchSubscriptions = async (searchOverride?: string) => {
        setLoading(true);
        try {
            const currentSearch = searchOverride !== undefined ? searchOverride : searchTerm;
            const response = await SubscriptionServices.getAll(currentPage, itemsPerPage, currentSearch);
            let subscriptionsList = [];
            if (response.items && Array.isArray(response.items)) {
                subscriptionsList = response.items;
            } else if (response.data && Array.isArray(response.data)) {
                subscriptionsList = response.data;
            } else if (Array.isArray(response)) {
                subscriptionsList = response;
            }
            setSubscriptions(subscriptionsList);
            if (response.meta) {
                setTotalPages(response.meta.totalPages || 1);
            } else if (Array.isArray(response)) {
                setTotalPages(1);
            }
        } catch (err) {
            console.error('Erro ao carregar inscrições', err);
            toast.error('Falha ao carregar inscrições');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, [currentPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) fetchSubscriptions();
            else setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await SubscriptionServices.update(id, { status });
            toast.success(`Status atualizado para ${status}`);
            fetchSubscriptions();
        } catch (err) {
            toast.error('Erro ao atualizar status');
        }
    };

    const displaySubscriptions = subscriptions;

    const stats = {
        total: subscriptions.length,
        pending: subscriptions.filter(s => s.status === 'PENDENTE' || s.status === 'EM_ANALISE').length,
        confirmed: subscriptions.filter(s => s.status === 'CONFIRMADO').length,
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#002d5b] tracking-tight uppercase">Gestão de Inscrições</h1>
                    <p className="text-slate-500 font-medium italic">Monitore e valide as pretensões de matrícula dos candidatos.</p>
                </div>
                
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchSubscriptions} 
                    disabled={loading}
                    className="rounded-2xl border-slate-200 hover:bg-slate-50 gap-2 h-11 px-4 text-[#002d5b] font-bold"
                >
                    <RefreshCcw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                    Sincronizar Dados
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group">
                    <div className="size-12 rounded-2xl bg-[#004587]/5 flex items-center justify-center text-[#004587] mb-4 transition-all duration-300">
                        <Key className="size-6" />
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Inscrições Totais</p>
                    <p className="text-4xl font-black text-[#004587] mt-1">{stats.total}</p>
                </div>
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group">
                    <div className="size-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-4 transition-all duration-300">
                        <Clock className="size-6" />
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Aguardando Análise</p>
                    <p className="text-4xl font-black text-amber-500 mt-1">{stats.pending}</p>
                </div>
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group">
                    <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4 transition-all duration-300">
                        <CheckCircle2 className="size-6" />
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Matrículas Confirmadas</p>
                    <p className="text-4xl font-black text-emerald-500 mt-1">{stats.confirmed}</p>
                </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden min-h-[500px] transition-colors duration-500">
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <Input 
                            placeholder="Buscar por candidato ou curso..." 
                            className="pl-12 h-14 bg-white rounded-3xl border-none shadow-sm font-medium focus:ring-1 focus:ring-[#004587]/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b">Candidato</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b">Curso Pretendido</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b">Data Inscrição</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b">Status Atual</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right border-b">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center font-black text-slate-400 uppercase tracking-widest animate-pulse italic">Processando Matrículas...</td>
                                </tr>
                            ) : displaySubscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center font-black text-slate-400 uppercase tracking-widest italic">Nenhuma inscrição registrada</td>
                                </tr>
                            ) : displaySubscriptions.map((sub, idx) => (
                                <motion.tr 
                                    key={sub.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="hover:bg-slate-50 transition-all group border-l-4 border-l-transparent hover:border-l-[#f58220]"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-[15px] bg-slate-100 flex items-center justify-center text-slate-400 transition-all duration-300">
                                                <User className="size-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 leading-tight">{sub.user?.name || "N/A"}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{sub.user?.cpf || 'CPF NÃO INFORMADO'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-600 line-clamp-1">{sub.course?.title}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 italic">{sub.course?.municipality}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase">
                                            <Calendar className="size-3 text-slate-300" />
                                            {new Date(sub.created_at || sub.createdAt).toLocaleDateString('pt-BR')}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge className={`rounded-xl px-4 py-1.5 font-black text-[9px] uppercase tracking-[0.15em] border-none shadow-sm ${
                                            sub.status === 'CONFIRMADO' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' :
                                            sub.status === 'CANCELADO' ? 'bg-rose-50 text-rose-500 shadow-rose-500/10' :
                                            'bg-amber-50 text-amber-600 shadow-amber-500/10'
                                        }`}>
                                            {sub.status || 'PENDENTE'}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-[20px] transition-all size-11 hover:bg-slate-100 border-transparent hover:border-slate-200 border">
                                                    <MoreVertical className="size-5 text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-[28px] p-2 border-none shadow-2xl w-60 bg-white/95 backdrop-blur-xl">
                                                <DropdownMenuItem 
                                                    onClick={() => handleUpdateStatus(sub.id, 'CONFIRMADO')}
                                                    className="rounded-2xl flex items-center gap-3 p-4 cursor-pointer text-emerald-600 hover:bg-emerald-50 font-bold"
                                                >
                                                    <ClipboardCheck className="size-4" />
                                                    <span className="uppercase text-[10px] tracking-widest">Confirmar Matrícula</span>
                                                </DropdownMenuItem>
                                                
                                                <DropdownMenuItem 
                                                    onClick={() => handleUpdateStatus(sub.id, 'CANCELADO')}
                                                    className="rounded-2xl flex items-center gap-3 p-4 cursor-pointer text-rose-500 hover:bg-rose-50 font-bold"
                                                >
                                                    <XCircle className="size-4" />
                                                    <span className="uppercase text-[10px] tracking-widest">Cancelar Inscrição</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {(totalPages > 1 || true) && (
                    <div className="flex justify-center mt-8 pb-8">
                        <Pagination>
                            <PaginationContent className="bg-white p-2 rounded-3xl border border-slate-100 shadow-xl">
                                <PaginationItem>
                                    <PaginationPrevious 
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        className={cn(
                                            "cursor-pointer hover:bg-slate-50 rounded-2xl transition-all",
                                            currentPage === 1 && "pointer-events-none opacity-50"
                                        )}
                                    />
                                </PaginationItem>
                                {[...Array(totalPages)].map((_, idx) => {
                                    const page = idx + 1;
                                    if (
                                        page === 1 || 
                                        page === totalPages || 
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() => setCurrentPage(page)}
                                                    isActive={currentPage === page}
                                                    className={cn(
                                                        "cursor-pointer rounded-2xl transition-all font-bold",
                                                        currentPage === page 
                                                            ? "bg-[#004587] text-white hover:bg-[#004587]" 
                                                            : "hover:bg-slate-50 text-slate-600"
                                                    )}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    } else if (
                                        page === currentPage - 2 || 
                                        page === currentPage + 2
                                    ) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }
                                    return null;
                                })}
            
                                <PaginationItem>
                                    <PaginationNext 
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        className={cn(
                                            "cursor-pointer hover:bg-slate-50 rounded-2xl transition-all",
                                            currentPage === totalPages && "pointer-events-none opacity-50"
                                        )}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    );
}
