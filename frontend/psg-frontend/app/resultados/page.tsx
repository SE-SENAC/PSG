'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Search, 
  Calendar,
  CheckCircle2,
  X,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import ResultsServices from "@/services/resultsServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ResultadoInterface {
    id: string;
    code: string;
    title: string;
    updated_at: string;
    file_path: string;
}

interface MetaInterface {
    currentPage: number;
    itemCount: number;
    totalItems: number;
    totalPages: number;
}

export default function ResultadosPage() {
    const [resultados, setResultados] = useState<ResultadoInterface[]>([]);
    const [meta, setMeta] = useState<MetaInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await ResultsServices.findAll(currentPage);
            setResultados(response.items);
            setMeta(response.meta);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [currentPage]);

    const filteredResults = resultados.filter(res => 
        res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500 pb-24 font-sans">
            {/* ── HERO SECTION ── */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                {/* Background layers */}
                <div className="absolute inset-0 z-0">
                    {/* Light mode */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:hidden" />
                    <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#f29100]/8 blur-[120px] rounded-full dark:hidden" />
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:hidden" />
                    
                    {/* Dark mode */}
                    <div className="hidden dark:block absolute inset-0 bg-[#0a0a0a]" />
                    <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#004587]/15 via-transparent to-transparent" />
                    <div className="hidden dark:block absolute top-[-15%] right-[-5%] w-[500px] h-[500px] bg-[#f29100]/8 blur-[140px] rounded-full" />
                    <div className="hidden dark:block absolute bottom-[-5%] left-[-10%] w-[400px] h-[400px] bg-[#004587]/12 blur-[120px] rounded-full" />
                    <div className="hidden dark:block absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                </div>

                <div className="container relative z-10 mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 mb-8 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f29100] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f29100]" />
                            </span>
                            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#004587] dark:text-slate-300">
                                Transparência Senac
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
                            Resultados{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004587] to-[#0070d6] dark:from-[#5ba3e6] dark:to-[#88c5f7]">
                                Oficiais
                            </span>
                        </h1>
                        
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                            Acompanhe as listas de classificação, convocações e resultados finais dos editais do Programa Senac de Gratuidade.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── CONTEÚDO PRINCIPAL ── */}
            <main className="container mx-auto px-6 -mt-6 relative z-20">
                {/* Barra de busca */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="max-w-4xl mx-auto mb-14"
                >
                    <div className="bg-white dark:bg-white/[0.04] shadow-xl shadow-slate-200/40 dark:shadow-black/20 border border-slate-200/80 dark:border-white/10 p-2 rounded-2xl flex items-center gap-2 backdrop-blur-xl">
                        <div className="flex-1 relative flex items-center">
                            <Search className="absolute left-5 text-slate-400 dark:text-slate-500" size={20} />
                            <Input 
                                placeholder="Pesquisar por código ou título..."
                                className="h-13 bg-transparent border-none pl-14 text-base focus-visible:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <Button className="h-12 px-7 rounded-xl bg-[#f29100] hover:bg-[#d68000] text-white font-bold tracking-wide transition-all shadow-lg shadow-[#f29100]/20 hidden sm:flex items-center gap-2">
                            <Search size={16} />
                            BUSCAR
                        </Button>
                    </div>
                </motion.div>

                {/* Grid de Resultados */}
                <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="h-28 bg-slate-100/60 dark:bg-white/[0.03] animate-pulse rounded-2xl border border-slate-200/50 dark:border-white/5" />
                        ))
                    ) : filteredResults.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            {filteredResults.map((res, index) => (
                                <motion.div
                                    key={res.id}
                                    layout
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                                    className="group"
                                >
                                    <div className="bg-white dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/8 hover:border-[#004587]/25 dark:hover:border-white/15 p-5 md:p-6 rounded-2xl transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 dark:shadow-none dark:hover:shadow-none group-hover:-translate-y-0.5">
                                        
                                        <div className="flex items-center gap-5 flex-1 w-full min-w-0">
                                            {/* Ícone */}
                                            <div className="w-13 h-13 md:w-14 md:h-14 rounded-xl bg-blue-50 dark:bg-[#004587]/10 flex items-center justify-center text-[#004587] dark:text-[#5ba3e6] group-hover:bg-[#004587] group-hover:text-white dark:group-hover:bg-[#004587] dark:group-hover:text-white transition-all duration-300 shrink-0">
                                                <CheckCircle2 size={24} strokeWidth={2.5} />
                                            </div>

                                            <div className="space-y-1.5 flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2.5">
                                                    <span className="text-[11px] font-black bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest border border-slate-200/50 dark:border-white/5">
                                                        {res.code}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                                                        <Calendar size={13} />
                                                        {new Date(res.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#004587] dark:group-hover:text-[#5ba3e6] transition-colors truncate">
                                                    {res.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t border-slate-100 dark:border-white/5 md:border-none mt-1 md:mt-0 shrink-0">
                                            <a href={`/${res.file_path}`} download className="flex-1 md:flex-none">
                                                <Button className="w-full md:w-auto h-11 px-5 rounded-xl bg-[#004587] hover:bg-[#003566] dark:bg-[#004587] dark:hover:bg-[#003a75] text-white font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md">
                                                    <Download size={16} />
                                                    <span className="text-sm">Baixar</span>
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200/50 dark:border-white/5"
                        >
                            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                                <FileText className="text-slate-300 dark:text-slate-600" size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Sem resultados</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm">
                                Nenhum documento correspondente à sua busca foi encontrado.
                            </p>
                            <Button 
                                variant="outline" 
                                onClick={() => setSearchTerm('')}
                                className="mt-6 rounded-xl border-slate-200 dark:border-white/10 dark:text-white text-sm font-semibold"
                            >
                                Limpar Busca
                            </Button>
                        </motion.div>
                    )}
                </div>

                {/* ── PAGINAÇÃO ── */}
                {meta && meta.totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-14 flex flex-col items-center gap-3"
                    >
                        <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase">
                            Página {currentPage} de {meta.totalPages} · {meta.totalItems} documentos
                        </p>
                        <div className="flex items-center gap-2 bg-white dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/10 p-1.5 rounded-xl shadow-sm">
                            <button
                                onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                                disabled={currentPage === 1}
                                className={cn(
                                    "h-9 w-9 rounded-lg flex items-center justify-center transition-all font-bold text-sm",
                                    currentPage === 1
                                        ? "opacity-30 cursor-not-allowed text-slate-400"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                                )}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {(() => {
                                const total = meta.totalPages || 1;
                                let start = Math.max(1, currentPage - 1);
                                let end = Math.min(total, start + 2);
                                if (end - start < 2) start = Math.max(1, end - 2);
                                
                                return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={cn(
                                            "h-9 w-9 rounded-lg flex items-center justify-center transition-all font-bold text-sm",
                                            currentPage === page 
                                                ? 'bg-[#004587] text-white shadow-md shadow-[#004587]/25' 
                                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                        )}
                                    >
                                        {page}
                                    </button>
                                ));
                            })()}

                            <button
                                onClick={() => currentPage < meta.totalPages && setCurrentPage(prev => prev + 1)}
                                disabled={currentPage === meta.totalPages}
                                className={cn(
                                    "h-9 w-9 rounded-lg flex items-center justify-center transition-all font-bold text-sm",
                                    currentPage === meta.totalPages
                                        ? "opacity-30 cursor-not-allowed text-slate-400"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                                )}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}