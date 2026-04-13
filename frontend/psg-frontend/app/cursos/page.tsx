'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  LayoutGrid,
  MapPin,
  X,
  Sun,
  Moon,
  Coffee,
  CalendarDays
} from 'lucide-react';
import api from '@/lib/api';
import CursosServices from '@/services/cursosServices';
import CursoCard from '@/components/curso_card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Course {
  id: string;
  title: string;
  code: string;
  availablePosition: number;
  minimumEducation: string;
  img_url: string;
  address: string;
  period_day: string;
  category?: {
    title: string;
  };
  type: 'LIVRE' | 'TECNICO';
}

interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedCity, setSelectedCity] = useState<string>('Todos');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Todos');
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const itemsPerPage = 9;

  // Debounce para a barra de pesquisa (500ms) para evitar excesso de requisições ao backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Volta para a primeira página ao pesquisar
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Carrega todas as categorias uma única vez para popular os filtros da barra lateral
  useEffect(() => {
    CursosServices.getAllCategories()
      .then(res => {
        const cats = res?.items || [];
        setCategoriesList(cats);
      })
      .catch(() => { });
  }, []);

  // Busca principal de dados — disparada por qualquer mudança em filtros ou página
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const isFiltering = debouncedSearch || selectedPeriod !== 'Todos' || selectedCity !== 'Todos' || selectedCategory !== 'Todos' || selectedType !== 'Todos' || selectedStatus !== 'Todos';
        const url = isFiltering ? '/course/filter' : '/course';
        const params: Record<string, any> = { page: currentPage, limit: itemsPerPage };

        if (debouncedSearch) params.search = debouncedSearch;
        if (selectedPeriod !== 'Todos') params.period_day = selectedPeriod;
        if (selectedCity !== 'Todos') params.municipality = selectedCity;
        if (selectedType !== 'Todos') params.type = selectedType;

        if (selectedCategory !== 'Todos') {
          const catObj = categoriesList.find(c => c.title === selectedCategory);
          if (catObj) params.categoryId = catObj.id;
        }

        if (selectedStatus !== 'Todos') {
          const statusMap: Record<string, number> = { 'Ativos': 0, 'Inativos': 1, 'Futuros': 2, 'Prorrogados': 3 };
          params.status = statusMap[selectedStatus];
        }

        const response = await api.get(url, { params });
        const items: Course[] = response.data?.items || (Array.isArray(response.data) ? response.data : []);

        setCourses(items);
        setMeta(response.data?.meta || null);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage, debouncedSearch, selectedPeriod, selectedCategory, selectedCity, selectedType, selectedStatus, categoriesList]);

  const handleCategoryChange = (cat: string) => { setSelectedCategory(cat); setCurrentPage(1); setIsSidebarOpen(false); };
  const handleCityChange = (city: string) => { setSelectedCity(city); setCurrentPage(1); };
  const handlePeriodChange = (p: string) => { setSelectedPeriod(p); setCurrentPage(1); };
  const handleTypeChange = (t: string) => { setSelectedType(t); setCurrentPage(1); };
  const handleStatusChange = (s: string) => { setSelectedStatus(s); setCurrentPage(1); };
  const handleReset = () => {
    setSelectedCategory('Todos'); setSelectedCity('Todos');
    setSelectedPeriod('Todos'); setSelectedType('Todos');
    setSelectedStatus('Todos');
    setSearchTerm(''); setDebouncedSearch('');
    setCurrentPage(1);
  };
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['Todos', ...categoriesList.map(c => c.title)];
  const cities = ['Todos', 'Aracaju', 'Itabaiana', 'Lagarto', 'Tobias Barreto', 'Propriá', 'N. S. Glória'];
  const periods = ['Todos', 'MANHÃ', 'TARDE', 'NOITE'];
  const types = ['Todos', 'LIVRE', 'TECNICO'];
  const statuses = ['Todos', 'Ativos', 'Inativos', 'Futuros', 'Prorrogados'];
  const hasActiveFilters = selectedCategory !== 'Todos' || selectedCity !== 'Todos' || selectedPeriod !== 'Todos' || selectedType !== 'Todos' || selectedStatus !== 'Todos' || searchTerm !== '';

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">

      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── BARRA LATERAL (SIDEBAR) ── */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-[72px] left-0 h-full lg:h-[calc(100vh-72px)] 
        w-80 bg-card border-r border-border z-[70] lg:z-30
        transition-transform duration-500 ease-in-out
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-8 gap-8 overflow-y-auto">

          {/* Cabeçalho da lateral */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black italic tracking-tighter flex items-center gap-2">
              <Filter className="text-primary" size={22} />
              FILTROS
            </h2>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X size={22} />
            </Button>
          </div>

          {/* Indicador de filtros ativos */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20"
            >
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Filtros ativos</span>
              <button onClick={handleReset} className="text-[10px] font-black text-destructive hover:underline uppercase">
                Limpar
              </button>
            </motion.div>
          )}

          {/* ── CATEGORIAS ── */}
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Área de Estudo</p>
            <div className="flex flex-col gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 border ${selectedCategory === cat
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                    : 'bg-transparent border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ── MUNICÍPIO ── */}
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 flex items-center gap-2">
              <MapPin size={12} /> Município
            </p>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={e => handleCityChange(e.target.value)}
                className="w-full h-12 pl-4 pr-10 rounded-xl bg-muted/40 border border-border text-sm font-bold focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* ── PERÍODO DO DIA ── */}
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Período do Dia</p>
            <div className="grid grid-cols-2 gap-2">
              {periods.map(p => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border text-[10px] font-black transition-all duration-200 ${selectedPeriod === p
                    ? 'bg-secondary border-secondary text-white shadow-md shadow-secondary/20 scale-[1.03]'
                    : 'bg-muted/20 border-border text-muted-foreground hover:border-secondary/50 hover:bg-muted/50'
                    }`}
                >
                  {p === 'Todos' && <CalendarDays size={20} />}
                  {p === 'MANHÃ' && <Sun size={20} />}
                  {p === 'TARDE' && <Coffee size={20} />}
                  {p === 'NOITE' && <Moon size={20} />}
                  {p === 'Todos' ? 'Todos' : p.charAt(0) + p.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* ── TIPO DE CURSO ── */}
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Tipo de Curso</p>
            <div className="flex flex-col gap-1.5">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 border ${selectedType === t
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                    : 'bg-transparent border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  {t === 'Todos' ? 'Todos os Tipos' : t === 'LIVRE' ? 'Curso Livre' : 'Curso Técnico'}
                </button>
              ))}
            </div>
          </div>

          {/* ── STATUS DO CURSO ── */}
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Status do Curso</p>
            <div className="flex flex-col gap-1.5">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 border ${selectedStatus === s
                    ? 'bg-secondary border-secondary text-white shadow-md shadow-secondary/20'
                    : 'bg-transparent border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Botão de resetar */}
          <div className="mt-auto pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full h-11 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
              Resetar todos os filtros
            </Button>
          </div>
        </div>
      </aside>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Barra de pesquisa superior */}
        <header className="sticky top-[72px] z-40 bg-background/90 backdrop-blur-2xl border-b border-border py-5 px-4 lg:px-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Mobile filter toggle */}
              <Button
                variant="outline"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden shrink-0 h-12 w-12 rounded-2xl p-0"
              >
                <Filter size={20} />
              </Button>

              {/* Input de pesquisa */}
              <div className="relative flex-1 max-w-xl group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <Input
                  placeholder="Pesquisar por nome ou código..."
                  className="h-12 sm:w-320 md:w-150 w-full pl-12 bg-muted/20 border-border rounded-2xl focus:ring-primary/30 focus:border-primary transition-all text-sm font-medium"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Contador de resultados */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="text-[9px] font-black tracking-[0.3em] text-primary uppercase">Total</p>
                <p className="text-lg font-black italic tracking-tighter leading-none">
                  {meta?.totalItems ?? courses.length} cursos
                </p>
              </div>
              <LayoutGrid size={24} className="text-primary/30" />
            </div>
          </div>
        </header>

        {/* Grade de cursos */}
        <main className="flex-1 p-6 lg:p-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[480px] bg-muted/30 animate-pulse rounded-[36px] border border-border" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-center">
              <div className="w-24 h-24 bg-muted/40 rounded-[32px] flex items-center justify-center mb-6 border border-dashed border-border">
                <Search className="text-muted-foreground/30" size={40} />
              </div>
              <h3 className="text-3xl font-black italic tracking-tighter mb-3">Nenhum resultado</h3>
              <p className="text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed">
                Não encontramos cursos para os filtros selecionados. Tente redefinir os critérios de busca.
              </p>
              <Button
                onClick={handleReset}
                className="h-12 px-8 rounded-full font-bold text-sm"
              >
                Limpar todos os filtros
              </Button>
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {courses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 24 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: index * 0.04 }}
                    >
                      <CursoCard
                        id={course.id}
                        title={course.title}
                        codigo={course.code}
                        vagas_ofertadas={course.availablePosition}
                        escolaridade_minima={course.minimumEducation}
                        img_url={course.img_url}
                        periodo={course.period_day}
                        local={course.address?.split(',')?.[0]}
                        categoria={course.category?.title}
                        type={course.type}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* ── PAGINAÇÃO PREMIUM ── */}
              {meta && meta.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-16 flex flex-col items-center gap-4"
                >
                  <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground/40 uppercase">
                    Página {currentPage} de {meta.totalPages} · {meta.totalItems} cursos
                  </p>

                  <div className="flex items-center gap-3">
                    {/* Anterior */}
                    <motion.button
                      whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
                      whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
                      onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`h-12 px-6 rounded-2xl border font-black text-xs tracking-widest uppercase transition-all duration-300 ${currentPage === 1
                        ? 'opacity-30 cursor-not-allowed border-border bg-muted/20 text-muted-foreground'
                        : 'border-border bg-card hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-lg hover:shadow-primary/20'
                        }`}
                    >
                      ← Anterior
                    </motion.button>

                    {/* Números das páginas */}
                    <div className="flex items-center gap-1.5 bg-muted/30 p-1.5 rounded-2xl border border-border/50">
                      {Array.from({ length: meta.totalPages }).map((_, i) => {
                        const page = i + 1;
                        const isActive = currentPage === page;
                        const show = isActive || Math.abs(currentPage - page) <= 1 || page === 1 || page === meta.totalPages;
                        const isEllipsis = !show && (page === currentPage - 2 || page === currentPage + 2);
                        if (isEllipsis) return <span key={i} className="w-6 text-center text-muted-foreground/30 font-black">·</span>;
                        if (!show) return null;
                        return (
                          <motion.button
                            key={i}
                            whileHover={{ scale: isActive ? 1 : 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => goToPage(page)}
                            className={`relative flex items-center justify-center rounded-xl font-black text-sm transition-all duration-300 ${isActive ? 'w-12 h-10 bg-primary text-white shadow-lg shadow-primary/30' : 'w-10 h-10 text-muted-foreground hover:text-foreground hover:bg-muted'
                              }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activePage"
                                className="absolute inset-0 bg-primary rounded-xl -z-10"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                              />
                            )}
                            {page}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Próxima */}
                    <motion.button
                      whileHover={{ scale: currentPage < meta.totalPages ? 1.05 : 1 }}
                      whileTap={{ scale: currentPage < meta.totalPages ? 0.95 : 1 }}
                      onClick={() => currentPage < meta.totalPages && goToPage(currentPage + 1)}
                      disabled={currentPage === meta.totalPages}
                      className={`h-12 px-6 rounded-2xl border font-black text-xs tracking-widest uppercase transition-all duration-300 ${currentPage === meta.totalPages
                        ? 'opacity-30 cursor-not-allowed border-border bg-muted/20 text-muted-foreground'
                        : 'border-border bg-card hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-lg hover:shadow-primary/20'
                        }`}
                    >
                      Próxima →
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}