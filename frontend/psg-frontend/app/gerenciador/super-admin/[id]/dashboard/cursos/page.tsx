'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, 
    Plus, 
    Search, 
    MoreVertical, 
    Edit, 
    Trash2, 
    RefreshCcw,
    Users,
    GraduationCap,
    Eye,
    ChevronRight,
    MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CursosServices from '@/services/cursosServices';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function CoursesControlPage() {
    const { id: superAdminId } = useParams();
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    const fetchCourses = async (searchOverride?: string) => {
        setLoading(true);
        try {
            const currentSearch = searchOverride !== undefined ? searchOverride : searchTerm;
            const data = await CursosServices.filteredCourses({ 
                page: currentPage, 
                limit: itemsPerPage,
                search: currentSearch
            });
            // Handle various response formats (items, data, or direct array)
            let coursesList = [];
            if (data.items && Array.isArray(data.items)) {
                coursesList = data.items;
            } else if (data.data && Array.isArray(data.data)) {
                coursesList = data.data;
            } else if (Array.isArray(data)) {
                coursesList = data;
            }
            
            setCourses(coursesList);
            
            if (data.meta) {
                setTotalPages(data.meta.totalPages || 1);
            } else if (Array.isArray(data)) {
                setTotalPages(1);
            }
        } catch (err) {
            console.error("Erro ao carregar cursos", err);
            toast.error("Falha ao carregar lista de cursos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [currentPage]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) fetchCourses();
            else setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleDelete = async (courseId: string) => {
        if (!confirm("Tem certeza que deseja excluir este curso permanentemente?")) return;
        try {
            await CursosServices.delete(courseId);
            toast.success("Curso removido com sucesso");
            fetchCourses();
        } catch (err) {
            toast.error("Erro ao excluir curso");
        }
    };

    // Courses are now filtered server-side
    const displayCourses = courses;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#004587] dark:text-white tracking-tight uppercase">Catálogo Global de Cursos</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Gestão master de toda a oferta acadêmica do programa.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fetchCourses()} 
                        disabled={loading}
                        className="rounded-2xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 gap-2 h-11 px-4 text-[#004587] dark:text-white font-bold"
                    >
                        <RefreshCcw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                        Sincronizar
                    </Button>
                    <Button 
                        onClick={() => router.push(`/gerenciador/super-admin/${superAdminId}/dashboard/cursos/criar`)}
                        className="rounded-2xl bg-[#004587] hover:bg-[#00386d] text-white gap-2 h-11 px-6 font-bold shadow-lg shadow-[#004587]/20 transition-all hover:scale-105"
                    >
                        <Plus className="size-5" />
                        Adicionar Curso
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden min-h-[600px] transition-colors duration-500">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30 dark:bg-slate-900/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <Input 
                            placeholder="Buscar por nome, código ou cidade..." 
                            className="pl-12 h-14 bg-white dark:bg-slate-800 rounded-3xl border-none shadow-sm font-medium focus:ring-1 focus:ring-[#004587]/20 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Badge className="bg-[#004587]/5 dark:bg-[#f58220]/10 text-[#004587] dark:text-[#f58220] border-none px-6 py-2.5 rounded-2xl font-black uppercase text-[10px] tracking-widest italic">
                        {displayCourses.length} Títulos Disponíveis
                    </Badge>
                </div>
 
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white dark:bg-slate-900">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b dark:border-slate-800">Curso e Identificação</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b dark:border-slate-800">Área/Município</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b dark:border-slate-800">Oferta</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b dark:border-slate-800">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right border-b dark:border-slate-800">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center font-black text-slate-400 uppercase tracking-widest animate-pulse italic">Indexando Catálogo...</td>
                                </tr>
                            ) : displayCourses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center font-black text-slate-400 uppercase tracking-widest italic">Nenhum curso registrado no catálogo</td>
                                </tr>
                            ) : displayCourses.map((course, idx) => (
                                <motion.tr 
                                    key={course.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all group border-l-4 border-l-transparent hover:border-l-[#f58220]"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-14 rounded-[22px] bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center font-black shrink-0 border border-slate-100 dark:border-slate-700 group-hover:bg-[#004587] group-hover:text-white transition-all duration-300">
                                                <BookOpen className="size-7" />
                                            </div>
                                            <div className="flex flex-col max-w-[300px]">
                                                <span className="font-bold text-slate-900 dark:text-white leading-tight text-base group-hover:text-[#004587] dark:group-hover:text-[#f58220] transition-colors truncate">{course.title}</span>
                                                <span className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-widest italic">ID: {course.code || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="size-3.5 text-slate-300 dark:text-slate-600" />
                                                <span className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-tight">{course.category?.title || 'Acadêmico'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <MapPin className="size-3.5 text-[#f58220]" />
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter italic">{course.municipality || 'Sede'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-700 dark:text-slate-200 text-lg leading-none">{course.availablePosition || 0}</span>
                                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Vagas</span>
                                            </div>
                                            <Separator orientation="vertical" className="h-6 bg-slate-100 dark:bg-slate-800" />
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-700 dark:text-slate-200 text-lg leading-none">{course.workload || 0}</span>
                                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Horas</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge className={`rounded-xl px-4 py-1.5 font-black text-[9px] uppercase tracking-[0.15em] border-none shadow-sm ${
                                            course.status_vacancy === 1 
                                            ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' 
                                            : 'bg-rose-50 text-rose-500 shadow-rose-500/10'
                                        }`}>
                                            {course.status_vacancy === 1 ? 'Vagas Abertas' : 'Inscrições Encerradas'}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-[20px] transition-all size-11 hover:bg-white dark:hover:bg-slate-800 border-transparent hover:border-slate-100 dark:hover:border-slate-700 border">
                                                    <MoreVertical className="size-5 text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-[28px] p-2 border-none shadow-2xl w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                                                <DropdownMenuItem 
                                                    onClick={() => router.push(`/gerenciador/super-admin/${superAdminId}/dashboard/cursos/atualizar/${course.id}`)}
                                                    className="rounded-2xl flex items-center gap-3 p-4 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800"
                                                >
                                                    <Edit className="size-4 text-slate-400 group-hover:text-[#004587] dark:group-hover:text-[#f58220] transition-colors" />
                                                    <span className="font-bold text-slate-700 dark:text-slate-300">Editar Título</span>
                                                </DropdownMenuItem>
                                                
                                                <DropdownMenuItem className="rounded-2xl flex items-center gap-3 p-4 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800">
                                                    <Eye className="size-4 text-slate-400 group-hover:text-[#004587] dark:group-hover:text-[#f58220] transition-colors" />
                                                    <span className="font-bold text-slate-700 dark:text-slate-300">Ver Miniatura Site</span>
                                                </DropdownMenuItem>
                                                
                                                <div className="h-px bg-slate-50 dark:bg-slate-800 my-2 mx-2" />
                                                
                                                <DropdownMenuItem 
                                                    onClick={() => handleDelete(course.id)}
                                                    className="rounded-2xl flex items-center gap-3 p-4 cursor-pointer text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-500/10 transition-all font-black"
                                                >
                                                    <Trash2 className="size-4" />
                                                    <span className="uppercase text-[10px] tracking-widest">Remover do Catálogo</span>
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

function Separator({ orientation, className }: { orientation: string, className?: string }) {
    return <div className={cn(orientation === 'vertical' ? 'w-px' : 'h-px', className)} />
}