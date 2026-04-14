'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Plus, 
    Search, 
    MoreVertical, 
    Edit, 
    Trash2, 
    ShieldCheck, 
    ShieldAlert, 
    RefreshCcw,
    UserCircle,
    Power
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SuperAdminServices from '@/services/superAdminServices';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

export default function AdminControlPage() {
    const { id: superAdminId } = useParams();
    const router = useRouter();
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    const fetchAdmins = async (searchOverride?: string) => {
        setLoading(true);
        try {
            const currentSearch = searchOverride !== undefined ? searchOverride : searchTerm;
            const data = await SuperAdminServices.listAdmins(currentPage, itemsPerPage, currentSearch);
            // Handle various response formats (items, data, or direct array)
            let adminList = [];
            if (data.items && Array.isArray(data.items)) {
                adminList = data.items;
            } else if (data.data && Array.isArray(data.data)) {
                adminList = data.data;
            } else if (Array.isArray(data)) {
                adminList = data;
            }
            
            setAdmins(adminList);
            
            if (data.meta) {
                setTotalPages(data.meta.totalPages || 1);
            } else if (Array.isArray(data)) {
                setTotalPages(1);
            }
        } catch (err) {
            console.error("Erro ao carregar administradores", err);
            toast.error("Falha ao carregar lista de administradores");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, [currentPage]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) fetchAdmins();
            else setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const toggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await SuperAdminServices.toggleAdminStatus(userId, !currentStatus);
            toast.success(`Administrador ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`);
            fetchAdmins();
        } catch (err) {
            toast.error("Erro ao alterar status");
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Tem certeza que deseja EXCLUIR permanentemente este administrador? Esta ação não pode ser desfeita.")) return;
        try {
            await SuperAdminServices.deleteAdmin(userId);
            toast.success("Administrador excluído com sucesso");
            fetchAdmins();
        } catch (err) {
            toast.error("Erro ao excluir administrador");
        }
    };

    // Admins are now filtered server-side
    const displayAdmins = admins;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#004587] dark:text-white tracking-tight uppercase">Controle de Administradores</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Gerencie os acessos e permissões da equipe administrativa.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fetchAdmins()} 
                        disabled={loading}
                        className="rounded-2xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 gap-2 h-11 px-4 text-[#004587] dark:text-white font-bold"
                    >
                        <RefreshCcw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                        Sincronizar
                    </Button>
                    <Button 
                        onClick={() => router.push(`/gerenciador/super-admin/${superAdminId}/dashboard/admin/criar`)}
                        className="rounded-2xl bg-[#004587] hover:bg-[#00386d] text-white gap-2 h-11 px-6 font-bold shadow-lg shadow-[#004587]/20 transition-all hover:scale-105"
                    >
                        <Plus className="size-5" />
                        Novo Administrador
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden min-h-[600px] transition-colors duration-500">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30 dark:bg-slate-900/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <Input 
                            placeholder="Pesquisar por nome ou e-mail..." 
                            className="pl-12 h-14 bg-white dark:bg-slate-800 rounded-3xl border-none shadow-sm font-medium focus:ring-2 focus:ring-[#004587]/10 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white dark:bg-slate-900">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b dark:border-slate-800">Usuário Administrativo</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b dark:border-slate-800">Nível</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b dark:border-slate-800">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right border-b dark:border-slate-800">Ações de Gestão</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center font-black text-slate-400 uppercase tracking-widest animate-pulse italic">Autenticando lista...</td>
                                </tr>
                            ) : displayAdmins.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center font-black text-slate-400 uppercase tracking-widest italic">Nenhum administrador encontrado</td>
                                </tr>
                            ) : displayAdmins.map((admin, idx) => (
                                <motion.tr 
                                    key={admin.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-[20px] bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center font-black shrink-0 border border-slate-100 dark:border-slate-700 group-hover:bg-[#004587] group-hover:text-white transition-all duration-300">
                                                <UserCircle className="size-7" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white leading-tight text-base group-hover:text-[#004587] dark:group-hover:text-[#f58220] transition-colors">{admin.name || "Sem Nome"}</span>
                                                <span className="text-xs text-slate-400 font-medium lowercase italic tracking-tight italic">{admin.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className={`size-4 ${admin.role?.name === 'superadmin' ? 'text-[#f58220]' : 'text-[#004587]'}`} />
                                            <span className="font-black text-[11px] text-slate-600 uppercase tracking-widest">{admin.role?.name || 'admin'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge className={`rounded-full px-4 py-1.5 font-black text-[9px] uppercase tracking-[0.15em] border-none shadow-sm ${
                                            admin.isActive 
                                            ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' 
                                            : 'bg-rose-50 text-rose-500 shadow-rose-500/10'
                                        }`}>
                                            {admin.isActive ? 'Ativo' : 'Bloqueado'}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all size-11">
                                                    <MoreVertical className="size-5 text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-[28px] p-3 border-none shadow-2xl w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                                                <DropdownMenuItem 
                                                    onClick={() => router.push(`/gerenciador/super-admin/${superAdminId}/dashboard/admin/atualizar/${admin.id}`)}
                                                    className="rounded-2xl flex items-center gap-3 p-4 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800"
                                                >
                                                    <Edit className="size-4 text-slate-400 group-hover:text-[#004587] dark:group-hover:text-[#f58220] transition-colors" />
                                                    <span className="font-bold text-slate-700 dark:text-slate-300">Editar Perfil</span>
                                                </DropdownMenuItem>
                                                
                                                <DropdownMenuItem 
                                                    onClick={() => toggleStatus(admin.id, admin.isActive)}
                                                    className={cn(
                                                        "rounded-2xl flex items-center gap-3 p-4 cursor-pointer group transition-all",
                                                        admin.isActive ? "text-rose-500 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"
                                                    )}
                                                >
                                                    <Power className="size-4" />
                                                    <span className="font-bold uppercase text-[10px] tracking-widest">{admin.isActive ? 'Desativar Acesso' : 'Ativar Acesso'}</span>
                                                </DropdownMenuItem>
                                                
                                                <div className="h-px bg-slate-50 my-2 mx-2" />
                                                
                                                <DropdownMenuItem 
                                                    onClick={() => handleDelete(admin.id)}
                                                    className="rounded-2xl flex items-center gap-3 p-4 cursor-pointer text-rose-600 hover:bg-rose-100 transition-all font-black"
                                                >
                                                    <Trash2 className="size-4" />
                                                    <span className="uppercase text-[10px] tracking-widest">Excluir Registro</span>
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
                <div className="flex justify-center mt-8">
                    <Pagination>
                        <PaginationContent className="bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
                            <PaginationItem>
                                <PaginationPrevious 
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    className={cn(
                                        "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all",
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
                                                        ? "bg-[#004587] dark:bg-[#f58220] text-white hover:bg-[#004587] dark:hover:bg-[#f58220] hover:text-white" 
                                                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
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
                                        "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all",
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
