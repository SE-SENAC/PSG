'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Tags, 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    RefreshCcw,
    LayoutGrid,
    X,
    Save
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
import CategoryServices from '@/services/categoryServices';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [formData, setFormData] = useState({ title: '' });
    const [saving, setSaving] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await CategoryServices.getAll(currentPage, itemsPerPage);
            // Handle various response formats (items, data, or direct array)
            let categoryList = [];
            if (response.items && Array.isArray(response.items)) {
                categoryList = response.items;
            } else if (response.data && Array.isArray(response.data)) {
                categoryList = response.data;
            } else if (Array.isArray(response)) {
                categoryList = response;
            }
            
            setCategories(categoryList);
            
            if (response.meta) {
                setTotalPages(response.meta.totalPages || 1);
            } else if (Array.isArray(response)) {
                setTotalPages(1);
            }
        } catch (err) {
            console.error("Erro ao carregar categorias", err);
            toast.error("Falha ao carregar categorias");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [currentPage]);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta categoria? Isso pode afetar os cursos vinculados.")) return;
        try {
            await CategoryServices.delete(id);
            toast.success("Categoria excluída com sucesso");
            fetchCategories();
        } catch (err) {
            toast.error("Erro ao excluir categoria");
        }
    };

    const handleOpenModal = (mode: 'create' | 'edit', category?: any) => {
        setModalMode(mode);
        if (mode === 'edit' && category) {
            setEditingCategory(category);
            setFormData({ title: category.title });
        } else {
            setEditingCategory(null);
            setFormData({ title: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            toast.warning("O título da categoria é obrigatório");
            return;
        }

        setSaving(true);
        try {
            if (modalMode === 'create') {
                await CategoryServices.create(formData);
                toast.success("Categoria criada com sucesso!");
            } else {
                await CategoryServices.update(editingCategory.id, formData);
                toast.success("Categoria atualizada com sucesso!");
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (err) {
            toast.error("Erro ao salvar categoria");
        } finally {
            setSaving(false);
        }
    };

    const filteredCategories = categories.filter(cat => 
        cat.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Categorias de Cursos</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Organize o catálogo de cursos por áreas de atuação.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchCategories} 
                        disabled={loading}
                        className="rounded-2xl border-slate-200 dark:border-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 gap-2 h-11 px-4"
                    >
                        <RefreshCcw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </Button>
                    <Button 
                        onClick={() => handleOpenModal('create')}
                        className="rounded-2xl bg-[#004587] hover:bg-[#00386d] text-white gap-2 h-11 px-6 font-bold shadow-lg shadow-[#004587]/20"
                    >
                        <Plus className="size-5" />
                        Nova Categoria
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="size-12 rounded-2xl bg-[#004587]/5 dark:bg-[#004587]/20 flex items-center justify-center text-[#004587] dark:text-blue-400 mb-6 group-hover:bg-[#004587] group-hover:text-white transition-all duration-500">
                            <LayoutGrid className="size-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Total de Áreas</h3>
                        <p className="text-4xl font-black text-[#004587] dark:text-[#f58220] mt-2">{categories.length}</p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs mt-4 font-bold uppercase tracking-widest">Categorias Ativas</p>
                    </div>

                    <div className="bg-[#f58220] p-8 rounded-[32px] text-white shadow-xl shadow-[#f58220]/20">
                        <h3 className="text-lg font-bold mb-2">Dica Master</h3>
                        <p className="text-white/80 text-sm leading-relaxed font-medium">
                            Mantenha as categorias atualizadas conforme os eixos tecnológicos para facilitar a busca dos alunos.
                        </p>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <Input 
                            placeholder="Buscar categoria..." 
                            className="pl-12 h-14 bg-white dark:bg-slate-900 rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm focus:ring-1 focus:ring-[#004587]/20 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <RefreshCcw className="size-12 text-slate-200 animate-spin" />
                                <p className="font-bold text-slate-400 uppercase tracking-widest">Carregando categorias...</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {filteredCategories.length === 0 ? (
                                    <div className="py-20 text-center font-bold text-slate-400 uppercase tracking-widest">
                                        Nenhuma categoria encontrada.
                                    </div>
                                ) : filteredCategories.map((cat, idx) => (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-6 flex items-center justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-l-4 border-l-transparent hover:border-l-[#f58220]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold group-hover:bg-[#004587]/5 dark:group-hover:bg-[#004587]/20 group-hover:text-[#004587] dark:group-hover:text-blue-400 transition-colors border border-slate-100 dark:border-slate-800">
                                                <Tags className="size-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-[#004587] dark:group-hover:text-[#f58220] transition-colors">{cat.title}</h4>
                                                <p className="text-[10px] text-slate-300 dark:text-slate-600 font-black uppercase tracking-widest mt-0.5">ID: {cat.id?.slice(0,18)}...</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button 
                                                onClick={() => handleOpenModal('edit', cat)}
                                                variant="ghost" 
                                                size="icon" 
                                                className="rounded-xl hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-400 hover:text-[#004587] dark:hover:text-[#f58220]"
                                            >
                                                <Edit className="size-4" />
                                            </Button>
                                            <Button 
                                                onClick={() => handleDelete(cat.id)}
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

  
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8 border-none overflow-hidden dark:bg-slate-900">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-[#004587] dark:text-[#f58220] uppercase tracking-tight">
                            {modalMode === 'create' ? 'Nova Categoria' : 'Editar Categoria'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 font-medium">
                            Defina o nome da categoria para organizar os cursos.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título da Categoria</label>
                            <Input 
                                placeholder="Ex: Informática, Gastronomia..." 
                                className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#004587]/10 font-bold text-slate-700 dark:text-white"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button 
                            variant="ghost" 
                            onClick={() => setIsModalOpen(false)}
                            className="rounded-2xl h-12 font-bold text-slate-400 hover:text-slate-600 uppercase text-[10px] tracking-widest"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            disabled={saving}
                            onClick={handleSave}
                            className="rounded-2xl h-12 font-black bg-[#004587] hover:bg-[#00386d] text-white px-8 uppercase text-[10px] tracking-widest shadow-lg shadow-[#004587]/20"
                        >
                            {saving ? <RefreshCcw className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                            {modalMode === 'create' ? 'Adicionar Categoria' : 'Salvar Alterações'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
