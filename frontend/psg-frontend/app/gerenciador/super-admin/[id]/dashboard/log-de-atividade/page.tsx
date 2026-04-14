'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
    Filter,
    Calendar
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
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [calendarDate, setCalendarDate] = useState(new Date());

    const monthNames = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
    ];

    const yearOptions = Array.from({ length: 75 }, (_, index) => 2026 + index);

    const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const isSameDay = (a: Date | null, b: Date | null) => !!a && !!b && normalizeDate(a).getTime() === normalizeDate(b).getTime();

    const setCalendarMonth = (month: number) => setCalendarDate(prev => new Date(prev.getFullYear(), month, 1));
    const setCalendarYear = (year: number) => setCalendarDate(prev => new Date(year, prev.getMonth(), 1));

    const buildCalendarDays = (base: Date) => {
        const monthStart = normalizeDate(new Date(base.getFullYear(), base.getMonth(), 1));
        const start = normalizeDate(new Date(monthStart));
        start.setDate(start.getDate() - start.getDay());
        return Array.from({ length: 42 }, (_, index) => {
            const day = new Date(start);
            day.setDate(start.getDate() + index);
            return day;
        });
    };

    const calendarDays = buildCalendarDays(calendarDate);

    const selectCalendarDay = (day: Date) => {
        const normalized = normalizeDate(day);
        setSelectedPeriod('all');

        if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
            setSelectedRange({ start: normalized, end: null });
            return;
        }

        if (selectedRange.start && !selectedRange.end) {
            const startTime = selectedRange.start.getTime();
            const selectedTime = normalized.getTime();

            if (selectedTime < startTime) {
                setSelectedRange({ start: normalized, end: null });
            } else if (selectedTime === startTime) {
                setSelectedRange({ start: normalized, end: null });
            } else {
                setSelectedRange({ start: selectedRange.start, end: normalized });
            }
        }
    };

    const isDayInRange = (day: Date) => {
        if (!selectedRange.start || !selectedRange.end) return false;
        const normalized = normalizeDate(day).getTime();
        return normalized >= selectedRange.start.getTime() && normalized <= selectedRange.end.getTime();
    };

    useEffect(() => {
        if (selectedRange.start) {
            setStartDate(formatDate(selectedRange.start));
        } else {
            setStartDate("");
        }
        if (selectedRange.end) {
            setEndDate(formatDate(selectedRange.end));
        } else {
            setEndDate("");
        }
    }, [selectedRange]);

    const fetchLogs = async (searchOverride?: string) => {
        setLoading(true);
        try {
            const filters: any = {};
            const currentSearch = searchOverride !== undefined ? searchOverride : searchTerm;
            if (currentSearch) filters.search = currentSearch;
            if (selectedMethod !== "all") filters.method = selectedMethod;
            if (selectedPeriod !== "all" && !startDate && !endDate) filters.period = selectedPeriod;
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;

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
    }, [currentPage, selectedMethod, selectedPeriod, startDate, endDate]);

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
                        onClick={() => fetchLogs()}
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

                    <div className="bg-white dark:bg-slate-800/60 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Filter className="size-4 text-slate-500" />
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Filtros de atividade</h3>
                            </div>
                            {(selectedMethod !== "all" || selectedPeriod !== "all" || startDate || endDate) && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => {
                                        setSelectedMethod("all");
                                        setSelectedPeriod("all");
                                        setStartDate("");
                                        setEndDate("");
                                    }}
                                    className="h-8 px-3 text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl gap-1"
                                >
                                    <X className="size-3" /> Limpar
                                </Button>
                            )}
                        </div>

                        <div className="grid gap-4">
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
                                <Select 
                                    value={selectedPeriod} 
                                    onValueChange={(val) => {
                                        setSelectedPeriod(val);
                                        if (val !== 'all') {
                                            setStartDate("");
                                            setEndDate("");
                                        }
                                    }}
                                >
                                    <SelectTrigger className="rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 font-bold text-slate-600 dark:text-slate-300">
                                        <SelectValue placeholder="Qualquer data" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl dark:bg-slate-800 dark:text-white">
                                        <SelectItem value="all" className="rounded-xl font-bold">Qualquer data</SelectItem>
                                        <SelectItem value="today" className="rounded-xl font-bold">Hoje</SelectItem>
                                        <SelectItem value="7d" className="rounded-xl font-bold">Últimos 7 dias</SelectItem>
                                        <SelectItem value="30d" className="rounded-xl font-bold">Últimos 30 dias</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                        <Calendar className="size-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Intervalo personalizado</span>
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-400">Clique em duas datas</span>
                                </div>

                                <div className="grid gap-3">
                                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Início</p>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{selectedRange.start ? formatDate(selectedRange.start) : 'Ainda não definido'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Fim</p>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{selectedRange.end ? formatDate(selectedRange.end) : 'Ainda não definido'}</p>
                                        </div>
                                    </div>

                                    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Select value={calendarDate.getMonth().toString()} onValueChange={(value) => setCalendarMonth(parseInt(value, 10))}>
                                                    <SelectTrigger className="w-44 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 font-bold text-slate-600 dark:text-slate-300">
                                                        <SelectValue placeholder="Mês" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-none shadow-2xl dark:bg-slate-800 dark:text-white">
                                                        {monthNames.map((monthName, index) => (
                                                            <SelectItem key={monthName} value={index.toString()} className="rounded-xl font-bold">
                                                                {monthName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Select value={calendarDate.getFullYear().toString()} onValueChange={(value) => setCalendarYear(parseInt(value, 10))}>
                                                    <SelectTrigger className="w-28 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 font-bold text-slate-600 dark:text-slate-300">
                                                        <SelectValue placeholder="Ano" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-none shadow-2xl dark:bg-slate-800 dark:text-white">
                                                        {yearOptions.map((year) => (
                                                            <SelectItem key={year} value={year.toString()} className="rounded-xl font-bold">
                                                                {year}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                                                    className="rounded-full border-slate-200 dark:border-slate-700 px-3 py-2"
                                                >
                                                    ‹
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                                                    className="rounded-full border-slate-200 dark:border-slate-700 px-3 py-2"
                                                >
                                                    ›
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-7 gap-1 text-[11px] uppercase tracking-widest text-slate-400 mb-2">
                                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((weekday) => (
                                                <div key={weekday} className="text-center font-bold">{weekday}</div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-7 gap-1">
                                            {calendarDays.map((day) => {
                                                const isCurrentMonth = day.getMonth() === calendarDate.getMonth();
                                                const isStart = selectedRange.start && isSameDay(day, selectedRange.start);
                                                const isEnd = selectedRange.end && isSameDay(day, selectedRange.end);
                                                const inRange = isDayInRange(day);

                                                return (
                                                    <button
                                                        key={day.toISOString()}
                                                        type="button"
                                                        onClick={() => selectCalendarDay(day)}
                                                        disabled={!isCurrentMonth}
                                                        className={cn(
                                                            'h-10 w-10 rounded-full transition-colors',
                                                            !isCurrentMonth && 'text-slate-400 dark:text-slate-600',
                                                            isCurrentMonth && 'text-slate-700 dark:text-slate-100',
                                                            isStart && 'bg-blue-600 text-white',
                                                            isEnd && 'bg-blue-600 text-white',
                                                            inRange && !isStart && !isEnd && 'bg-blue-100 text-slate-900 dark:bg-slate-800 dark:text-white',
                                                            isCurrentMonth && !isStart && !isEnd && !inRange && 'hover:bg-slate-100 dark:hover:bg-slate-900'
                                                        )}
                                                    >
                                                        {day.getDate()}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button 
                                variant="secondary"
                                className="w-full rounded-2xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-[#f58220] dark:text-slate-900 dark:hover:bg-[#d76c14]"
                                onClick={() => fetchLogs()}
                                disabled={loading || !selectedRange.start}
                            >
                                Aplicar filtros
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
                                                    {(log.page_route || log.page) && (
                                                        <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-200 border-none rounded-lg px-2 py-0 text-[10px] font-black uppercase tracking-tighter">
                                                            {log.page_route || log.page}
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
