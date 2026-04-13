'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Search, 
  Calendar,
  ArrowRight,
  BookOpenCheck,
  FileCheck2,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import EditalService from "@/services/editalService";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface EditalInterface {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
    file_path: string;
}

interface MetaInterface {
    currentPage: number;
    itemCount: number;
    totalItems: number;
    totalPages: number;
}

export default function EditalPage() {
    const [editais, setEditais] = useState<EditalInterface[]>([]);
    const [meta, setMeta] = useState<MetaInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchEditais = async () => {
        setLoading(true);
        try {
            const response = await EditalService.findAll(currentPage);
            setEditais(response.items);
            setMeta(response.meta);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEditais();
    }, [currentPage]);

    const filteredEditais = editais.filter(ed => 
        ed.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500 pb-24 font-sans">
            {/* ── HERO SECTION ── */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                {/* Background layers */}
                <div className="absolute inset-0 z-0">
                    {/* Light mode */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 dark:hidden" />
                    <div className="absolute -top-40 -left-20 w-[500px] h-[500px] bg-[#004587]/5 blur-[120px] rounded-full dark:hidden" />
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:hidden" />
                    
                    {/* Dark mode */}
                    <div className="hidden dark:block absolute inset-0 bg-[#0a0a0a]" />
                    <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#004587]/15 via-transparent to-transparent" />
                    <div className="hidden dark:block absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-[#f29100]/8 blur-[140px] rounded-full" />
                    <div className="hidden dark:block absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-[#004587]/12 blur-[120px] rounded-full" />
                    <div className="hidden dark:block absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                </div>

                <div className="container relative z-10 mx-auto px-6 text-center lg:text-left flex flex-col md:flex-row items-center gap-10">
                    <motion.div
                        className="flex-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 mb-8 mx-auto lg:mx-0 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-[#f29100]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#004587] dark:text-slate-300">
                                Normas & Regulamentos
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
                            Editais do <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004587] to-[#0070d6] dark:from-[#5ba3e6] dark:to-[#88c5f7]">
                                Senac PSG
                            </span>
                        </h1>
                        
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg md:text-xl leading-relaxed mx-auto lg:mx-0">
                            Acesse todos os regulamentos vigentes e passados referentes às ofertas de qualificação profissional gratuitas.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                        className="hidden lg:block relative"
                    >
                        <div className="w-56 h-56 bg-gradient-to-br from-[#004587]/8 to-transparent dark:from-[#5ba3e6]/8 rounded-[2.5rem] border border-slate-200/40 dark:border-white/5 flex items-center justify-center backdrop-blur-sm -rotate-6">
                             <BookOpenCheck size={72} className="text-[#004587] dark:text-[#5ba3e6] opacity-70" strokeWidth={1} />
                        </div>
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
                                placeholder="Busque por um edital ou ano específico..."
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
                        <Button className="h-12 px-7 rounded-xl bg-[#004587] hover:bg-[#003566] dark:bg-[#004587] dark:hover:bg-[#003a75] text-white font-bold tracking-wide transition-all shadow-lg shadow-[#004587]/15 hidden sm:flex items-center gap-2">
                            <Search size={16} />
                            LOCALIZAR
                        </Button>
                    </div>
                </motion.div>

                {/* Grid de Editais (Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="h-56 bg-slate-100/60 dark:bg-white/[0.03] animate-pulse rounded-2xl border border-slate-200/50 dark:border-white/5" />
                        ))
                    ) : filteredEditais.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            {filteredEditais.map((ed, index) => (
                                <motion.div
                                    key={ed.id}
                                    layout
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                                    className="group h-full"
                                >
                                    <div className="h-full bg-white dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/8 hover:border-[#004587]/25 dark:hover:border-[#5ba3e6]/30 p-6 rounded-2xl transition-all duration-300 flex flex-col shadow-sm hover:shadow-lg hover:shadow-slate-200/50 dark:shadow-none dark:hover:shadow-none relative group-hover:-translate-y-1">
                                        
                                        <div className="flex justify-between items-start mb-5">
                                            <div className="flex flex-col">
                                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/8 px-2.5 py-1 rounded-full mb-1 w-fit border border-slate-200/50 dark:border-white/5">
                                                    <Calendar size={11} className="text-[#004587] dark:text-slate-400" />
                                                    {new Date(ed.created_at).getFullYear()}
                                                </span>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#004587]/10 flex items-center justify-center group-hover:bg-[#f29100]/10 transition-colors duration-300">
                                                <FileCheck2 size={18} className="text-[#004587] dark:text-[#5ba3e6] group-hover:text-[#f29100] transition-colors duration-300" />
                                            </div>
                                        </div>

                                        <div className="flex-1 mb-5">
                                            <h3 className="text-lg leading-snug font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#004587] dark:group-hover:text-[#5ba3e6] transition-colors line-clamp-3">
                                                {ed.title}
                                            </h3>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mb-5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                                            <span>Atualizado: {new Date(ed.updated_at).toLocaleDateString('pt-BR')}</span>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
                                            <a href={`/${ed.file_path}`} download className="block">
                                                <Button variant="ghost" className="w-full justify-between h-11 bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-[#004587] dark:text-slate-300 hover:text-[#004587] dark:hover:text-white font-bold rounded-xl transition-all p-4 group/btn">
                                                    <span className="flex items-center gap-2 text-sm">
                                                        <Download size={16} />
                                                        Acessar Documento
                                                    </span>
                                                    <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all text-[#f29100]" />
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
                            className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200/50 dark:border-white/5"
                        >
                            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                                <Search className="text-slate-300 dark:text-slate-600" size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Sem Resultados</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm">
                                Não há documentos listados para o termo informado.
                            </p>
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
                            Página {currentPage} de {meta.totalPages} · {meta.totalItems} editais
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