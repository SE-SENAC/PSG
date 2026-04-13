'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ClipboardList, 
    Plus, 
    Search, 
    FileText, 
    Download, 
    Trash2, 
    RefreshCcw,
    Calendar,
    Eye,
    ExternalLink
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
import DiretrizesService from '@/services/diretrizesService';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';

export default function GuidelinesPage() {
    const { id: adminId } = useParams();
    const router = useRouter();
    const [guidelines, setGuidelines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;

    const fetchGuidelines = async (searchOverride?: string) => {
        setLoading(true);
        try {
            const currentSearch = searchOverride !== undefined ? searchOverride : searchTerm;
            const data = await DiretrizesService.findAll(currentPage, itemsPerPage, currentSearch);
            // Handle various response formats (items, data, or direct array)
            let guidelinesList = [];
            if (data.items && Array.isArray(data.items)) {
                guidelinesList = data.items;
            } else if (data.data && Array.isArray(data.data)) {
                guidelinesList = data.data;
            } else if (Array.isArray(data)) {
                guidelinesList = data;
            }
            
            setGuidelines(guidelinesList);
            
            if (data.meta) {
                setTotalPages(data.meta.totalPages || 1);
            } else if (Array.isArray(data)) {
                setTotalPages(1);
            }
        } catch (err) {
            console.error("Erro ao carregar diretrizes", err);
            toast.error("Falha ao carregar diretrizes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuidelines();
    }, [currentPage]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) fetchGuidelines();
            else setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta diretriz?")) return;
        try {
            await DiretrizesService.delete(id);
            toast.success("Diretriz excluída com sucesso");
            fetchGuidelines();
        } catch (err) {
            toast.error("Erro ao excluir diretriz");
        }
    };

    // Guidelines are now filtered server-side
    const displayGuidelines = guidelines;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Diretrizes e Regras</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Documentos que regem as normas do Programa de Gratuidade.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchGuidelines} 
                        disabled={loading}
                        className="rounded-2xl border-slate-200 dark:border-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 gap-2 h-11 px-4"
                    >
                        <RefreshCcw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </Button>
                    <Button 
                        onClick={() => router.push(`/gerenciador/super-admin/${adminId}/dashboard/diretrizes/criar`)}
                        className="rounded-2xl bg-slate-900 dark:bg-[#f58220] hover:bg-slate-800 dark:hover:bg-[#e47210] text-white gap-2 h-11 px-6 font-bold shadow-lg"
                    >
                        <Plus className="size-5" />
                        Nova Diretriz
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
                        <div className="size-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                            <ClipboardList className="size-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Documentos Públicos</h3>
                        <p className="text-4xl font-black text-amber-600 dark:text-[#f58220] mt-2">{guidelines.length}</p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs mt-4 font-bold uppercase tracking-widest">Ativos no Portal</p>
                    </div>

                    <div className="bg-amber-100 dark:bg-amber-500/10 p-8 rounded-[32px] border border-amber-200 dark:border-amber-900/50 shadow-inner">
                        <h3 className="text-sm font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest mb-4">Atenção</h3>
                        <p className="text-amber-800 dark:text-amber-300 text-sm font-medium leading-relaxed opacity-80">
                            Certifique-se de que os PDFs enviados estejam acessíveis para leitores de tela e em boa qualidade.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <Input 
                            placeholder="Pesquisar diretrizes..." 
                            className="pl-12 h-14 bg-white dark:bg-slate-900 rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px] transition-colors duration-500">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <RefreshCcw className="size-12 text-slate-200 animate-spin" />
                                <p className="font-bold text-slate-400 uppercase tracking-widest">Carregando documentos...</p>
                            </div>
                        ) : displayGuidelines.length === 0 ? (
                            <div className="py-20 text-center font-bold text-slate-400 uppercase tracking-widest">
                                Nenhuma diretriz encontrada.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {displayGuidelines.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-6 flex items-center justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all border-l-4 border-l-transparent hover:border-l-amber-500"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold group-hover:bg-amber-50 dark:group-hover:bg-amber-500/10 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors shrink-0">
                                                <FileText className="size-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-[250px] md:max-w-md group-hover:text-[#f58220] transition-colors">{item.title}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">
                                                    <span className="flex items-center gap-1"><Calendar className="size-3" /> {new Date(item.created_at || item.updatedAt).toLocaleDateString('pt-BR')}</span>
                                                    <Badge className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-none font-black text-[8px]">PDF</Badge>
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
                                                                ? "bg-slate-900 dark:bg-[#f58220] text-white hover:bg-slate-900 dark:hover:bg-[#f58220] hover:text-white" 
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
