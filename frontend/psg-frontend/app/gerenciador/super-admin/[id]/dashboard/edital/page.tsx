'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, 
    Plus, 
    Search, 
    Download, 
    Trash2, 
    RefreshCcw,
    Calendar,
    Eye,
    ExternalLink,
    ScrollText
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
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EditalService from '@/services/editalService';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';

export default function NoticesPage() {
    const { id: adminId } = useParams();
    const router = useRouter();
    const [notices, setNotices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;

    const fetchNotices = async (searchOverride?: string) => {
        setLoading(true);
        try {
            const currentSearch = searchOverride !== undefined ? searchOverride : searchTerm;
            const data = await EditalService.findAll(currentPage, itemsPerPage, currentSearch);
            // Handle various response formats (items, data, or direct array)
            let noticesList = [];
            if (data.items && Array.isArray(data.items)) {
                noticesList = data.items;
            } else if (data.data && Array.isArray(data.data)) {
                noticesList = data.data;
            } else if (Array.isArray(data)) {
                noticesList = data;
            }
            
            setNotices(noticesList);
            
            if (data.meta) {
                setTotalPages(data.meta.totalPages || 1);
            } else if (Array.isArray(data)) {
                setTotalPages(1);
            }
        } catch (err) {
            console.error("Erro ao carregar editais", err);
            toast.error("Falha ao carregar editais");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, [currentPage]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) fetchNotices();
            else setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este edital?")) return;
        try {
            await EditalService.delete(id);
            toast.success("Edital excluído com sucesso");
            fetchNotices();
        } catch (err) {
            toast.error("Erro ao excluir edital");
        }
    };

    // Notices are now filtered server-side
    const displayNotices = notices;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Editais Publicados</h1>
                    <p className="text-slate-500 font-medium">Documentos oficiais de abertura e regulação dos cursos.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fetchNotices()} 
                        disabled={loading}
                        className="rounded-2xl border-slate-200 hover:bg-slate-50 gap-2 h-11 px-4"
                    >
                        <RefreshCcw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </Button>
                    <Button 
                        onClick={() => router.push(`/gerenciador/super-admin/${adminId}/dashboard/edital/criar`)}
                        className="rounded-2xl bg-slate-900 dark:bg-[#f58220] hover:bg-slate-800 dark:hover:bg-[#e47210] text-white gap-2 h-11 px-6 font-bold shadow-lg"
                    >
                        <Plus className="size-5" />
                        Publicar Edital
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
                        <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                            <ScrollText className="size-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Editais Vigentes</h3>
                        <p className="text-4xl font-black text-blue-600 dark:text-[#f58220] mt-2">{notices.length}</p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs mt-4 font-bold uppercase tracking-widest">Documentos Online</p>
                    </div>

                    <div className="bg-blue-600 p-8 rounded-[32px] text-white shadow-xl shadow-blue-200">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-4">Gerenciamento</h3>
                        <p className="text-blue-100 text-sm font-medium leading-relaxed">
                            Mantenha o histórico de editais organizado para facilitar a transparência do processo seletivo.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <Input 
                            placeholder="Pesquisar por título do edital..." 
                            className="pl-12 h-14 bg-white dark:bg-slate-900 rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm font-medium dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px] transition-colors duration-500">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <RefreshCcw className="size-12 text-slate-200 animate-spin" />
                                <p className="font-bold text-slate-400 uppercase tracking-widest">Sincronizando editais...</p>
                            </div>
                        ) : displayNotices.length === 0 ? (
                            <div className="py-20 text-center font-bold text-slate-400 uppercase tracking-widest">
                                Nenhum edital publicado até o momento.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {displayNotices.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-6 flex items-center justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all border-l-4 border-l-transparent hover:border-l-blue-600"
                                    >
                                        <div className="flex items-center gap-4 text-balance">
                                            <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0">
                                                <FileText className="size-6" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-[250px] md:max-w-md group-hover:text-blue-600 dark:group-hover:text-[#f58220] transition-colors">{item.title}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">
                                                    <span className="flex items-center gap-1"><Calendar className="size-3" /> {new Date(item.created_at || item.updatedAt).toLocaleDateString('pt-BR')}</span>
                                                    <Badge className="rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none font-black text-[8px]">OFICIAL</Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <a href={item.file_path} target="_blank" rel="noopener noreferrer">
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 text-slate-400 hover:text-blue-500 dark:hover:text-[#f58220] transition-all shadow-sm">
                                                    <ExternalLink className="size-4" />
                                                </Button>
                                            </a>
                                            <Button 
                                                onClick={() => handleDelete(item.id)}
                                                variant="ghost" 
                                                size="icon" 
                                                className="rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                    {(totalPages > 1 || true) && (
                        <div className="flex justify-center mt-6">
                            <Pagination>
                                <PaginationContent className="bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-lg">
                                    <PaginationItem>
                                        <PaginationPrevious 
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            className={cn(
                                                "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all dark:text-white",
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
                                                "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all dark:text-white",
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
        </div>
    );
}