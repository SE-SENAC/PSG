'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Search,
    RefreshCcw,
    User,
    Clock,
    Globe,
    Terminal,
    MousePointer2,
    ShieldCheck,
    AlertCircle,
    ChevronDown,
    Filter
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
import LogActivityService from '@/services/logActivityService';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X } from 'lucide-react';

export default function ActivityLogPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const [selectedMethod, setSelectedMethod] = useState<string>("all");
    const [selectedPeriod, setSelectedPeriod] = useState<string>("all");

    const fetchLogs = async (searchOverride?: string) => {
        setLoading(true);
        try {
            const filters: any = {};
            const currentSearch = searchOverride !== undefined ? searchOverride : searchTerm;
            if (currentSearch) filters.search = currentSearch;
            if (selectedMethod !== "all") filters.method = selectedMethod;
            if (selectedPeriod !== "all") filters.period = selectedPeriod;

            const data = await LogActivityService.getAll(currentPage, itemsPerPage, filters);
            // Handle various response formats (items, data, or direct array)
            let logsList = [];
            if (data.items && Array.isArray(data.items)) {
                logsList = data.items;
            } else if (data.data && Array.isArray(data.data)) {
                logsList = data.data;
            } else if (Array.isArray(data)) {
                logsList = data;
            }
            
            setLogs(logsList);

            if (data.meta) {
                setTotalPages(data.meta.totalPages || 1);
            } else if (Array.isArray(data)) {
                setTotalPages(1);
            }
        } catch (err) {
            console.error("Erro ao carregar logs", err);
            toast.error("Falha ao carregar logs de atividade");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [currentPage, selectedMethod, selectedPeriod]);

    // Only search after typing stops
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) fetchLogs();
            else setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Logs are now filtered server-side
    const displayLogs = logs;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Logs de Atividade</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Rastreamento em tempo real de todas as ações no sistema.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchLogs}
                        disabled={loading}
                        className="rounded-2xl border-slate-200 dark:border-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 gap-2 h-11 px-4"
                    >
                        <RefreshCcw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                        Sincronizar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Metrics */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[32px] text-white overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Ações Registradas</h3>
                            <p className="text-4xl font-black">{logs.length}</p>
                            <p className="text-slate-500 text-xs mt-2 font-bold uppercase underline decoration-red-500 underline-offset-4">Eventos Totais</p>
                        </div>
                        <Activity className="absolute -bottom-6 -right-6 size-32 text-white/5" />
                    </div>

                        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Filtros Avançados</h3>
                                {(selectedMethod !== "all" || selectedPeriod !== "all") && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => {
                                            setSelectedMethod("all");
                                            setSelectedPeriod("all");
                                        }}
                                        className="h-7 px-2 text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg gap-1"
                                    >
                                        <X className="size-3" /> Limpar
                                    </Button>
                                )}
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Método HTTP</label>
                                    <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                                        <SelectTrigger className="rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 font-bold text-slate-600 dark:text-slate-300">
                                            <SelectValue placeholder="Todos os métodos" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-2xl dark:bg-slate-800 dark:text-white">
                                            <SelectItem value="all" className="rounded-xl font-bold">Todos</SelectItem>
                                            <SelectItem value="GET" className="rounded-xl font-bold text-emerald-600">GET</SelectItem>
                                            <SelectItem value="POST" className="rounded-xl font-bold text-blue-600">POST</SelectItem>
                                            <SelectItem value="PUT" className="rounded-xl font-bold text-amber-600">PUT</SelectItem>
                                            <SelectItem value="PATCH" className="rounded-xl font-bold text-indigo-600">PATCH</SelectItem>
                                            <SelectItem value="DELETE" className="rounded-xl font-bold text-rose-600">DELETE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Período de Tempo</label>
                                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                        <SelectTrigger className="rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 font-bold text-slate-600 dark:text-slate-300">
                                            <SelectValue placeholder="Qualquer data" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-2xl dark:bg-slate-800 dark:text-white">
                                            <SelectItem value="all" className="rounded-xl font-bold">Qualquer data</SelectItem>
                                            <SelectItem value="24h" className="rounded-xl font-bold">Últimas 24 horas</SelectItem>
                                            <SelectItem value="7d" className="rounded-xl font-bold">Últimos 7 dias</SelectItem>
                                            <SelectItem value="30d" className="rounded-xl font-bold">Últimos 30 dias</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-50 dark:border-slate-800 space-y-2">
                                <Button variant="ghost" className="w-full justify-start rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 gap-3">
                                    <ShieldCheck className="size-4 text-emerald-500" /> Segurança
                                </Button>
                                <Button variant="ghost" className="w-full justify-start rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 gap-3">
                                    <MousePointer2 className="size-4 text-blue-500" /> Interações
                                </Button>
                            </div>
                        </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <Input
                            placeholder="Pesquisar em logs (ação, usuário, e-mail)..."
                            className="pl-12 h-14 bg-white dark:bg-slate-800/50 rounded-3xl border-slate-200 dark:border-slate-800 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-8 top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

                        {loading ? (
                            <div className="p-20 text-center font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">
                                Rastreando atividades recentes...
                            </div>
                        ) : displayLogs.length === 0 ? (
                            <div className="p-20 text-center font-black text-slate-400 uppercase tracking-[0.2em]">
                                Nenhum log registrado com esses critérios.
                            </div>
                        ) : displayLogs.map((log, idx) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="relative md:pl-20 group"
                            >
                                {/* Dot on timeline */}
                                <div className="absolute left-7 top-1/2 -translate-y-1/2 size-3.5 rounded-full border-4 border-slate-50 dark:border-slate-900 bg-[#004587] z-10 hidden md:block group-hover:bg-[#f58220] group-hover:scale-125 transition-all duration-300 shadow-md"></div>

                                <div className="bg-white dark:bg-slate-800/40 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center border border-slate-100 dark:border-slate-800 shrink-0">
                                                <Terminal className="size-6 text-slate-400 group-hover:text-red-600 transition-colors" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                                                        {log.activity || 'Ação desconhecida'}
                                                    </p>
                                                    {log.page && (
                                                        <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-200 border-none rounded-lg px-2 py-0 text-[10px] font-black uppercase tracking-tighter">
                                                            {log.page}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
                                                    <span className="flex items-center gap-1.5"><User className="size-3" /> {log.user?.name || log.userId || 'Sistema'}</span>
                                                    <span className="flex items-center gap-1.5"><Clock className="size-3" /> {new Date(log.created_at || log.timestamp).toLocaleString('pt-BR')}</span>
                                                    <span className="flex items-center gap-1.5 underline underline-offset-4 decoration-slate-200 dark:decoration-slate-800"><Globe className="size-3" /> {log.ip || 'Local'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Badge variant="outline" className="rounded-xl px-3 py-1 bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase text-[9px] tracking-widest shrink-0">
                                            {log.method || 'GET'}
                                        </Badge>
                                    </div>
                                    
                                    {log.details && (
                                        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                                            <pre className="text-[10px] text-slate-500 dark:text-slate-400 font-mono overflow-x-auto">
                                                {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {(totalPages > 1 || true) && (
                        <div className="flex justify-center mt-8 pl-0 md:pl-20">
                            <Pagination>
                                <PaginationContent className="bg-white dark:bg-slate-800 p-2 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            className={cn(
                                                "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition-all dark:text-white",
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
                                                                : "hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
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
                                                    <PaginationEllipsis className="dark:text-slate-600" />
                                                </PaginationItem>
                                            );
                                        }
                                        return null;
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            className={cn(
                                                "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition-all dark:text-white",
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
