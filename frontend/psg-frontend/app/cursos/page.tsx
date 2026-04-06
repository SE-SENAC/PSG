'use client'

import CursoCard from "@/components/curso_card";
import CursosServices from "@/services/cursosServices";
import { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search } from "lucide-react";
import { Pagination, PaginationContent, PaginationPrevious, PaginationItem, PaginationLink, PaginationEllipsis, PaginationNext } from "@/components/ui/pagination";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import MetaInterface from "@/models/meta.interface";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchCourses, fetchCategories } from "@/lib/store/courses/courses";

export default function Cursos() {
    const dispatch = useDispatch<AppDispatch>();
    const { items: courses, categories, meta, loading } = useSelector((state: RootState) => state.courses);

    const [searchTitle, setSearchTitle] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("0"); // Default to ATIVA

    const [current_page, setCurrentPage] = useState<number>(1);
    const items_per_page = 6;

    const handleFilter = async () => {
        const params: any = {
            page: current_page,
            limit: items_per_page
        };

        if (selectedPeriod !== "all") params.period_day = parseInt(selectedPeriod);
        if (selectedCategory !== "all") params.categoryId = parseInt(selectedCategory);
        if (selectedStatus !== "all") params.status = parseInt(selectedStatus);
        if (searchTitle.trim()) params.title = searchTitle;

        dispatch(fetchCourses(params));
    };

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const [debouncedSearch, setDebouncedSearch] = useState(searchTitle);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTitle);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTitle]);

    useEffect(() => {
        handleFilter();
    }, [current_page, selectedCategory, selectedPeriod, selectedStatus, debouncedSearch]);

    return (
        <div className="container mx-auto space-y-20 pl-10 sm:pl-20 mt-20 mb-10 ">
            <div className="sm:flex gap-15 space-y-10">
                <div className={`border border-border bg-card p-10 rounded-md shadow-lg mr-10 sm:mr-2 sm:h-1/2 sm:w-1/4 space-y-8`}>
                    <div className="space-y-2">
                        <p className="font-bold">Título do curso</p>
                        <InputGroup>
                            <InputGroupInput
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                className="pr-10 text-sm"
                                placeholder="Buscar por título do curso..."
                            />
                            <InputGroupAddon align="inline-end">
                                <Search onClick={() => handleFilter()} className="text-muted-foreground size-[1.05rem] cursor-pointer hover:text-foreground" />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    <div className="space-y-2">
                        <p className="font-bold">Qual a sua área de interesse?</p>
                        <Select value={selectedCategory} onValueChange={(val) => {
                            setSelectedCategory(val);
                            setCurrentPage(1);
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecionar área" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectGroup>
                                    <SelectItem value="all">Todas as áreas</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.title}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <p className="font-bold">Para qual período?</p>
                        <Select value={selectedPeriod} onValueChange={(val) => {
                            setSelectedPeriod(val);
                            setCurrentPage(1);
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecionar período" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectGroup>
                                    <SelectItem value="all">Todos os períodos</SelectItem>
                                    <SelectItem value="0">Manhã</SelectItem>
                                    <SelectItem value="1">Tarde</SelectItem>
                                    <SelectItem value="2">Noite</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <p className="font-bold">Status das vagas</p>
                        <Select value={selectedStatus} onValueChange={(val) => {
                            setSelectedStatus(val);
                            setCurrentPage(1);
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecionar status" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectGroup>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="0">Ativo</SelectItem>
                                    <SelectItem value="2">Próximos</SelectItem>
                                    <SelectItem value="1">Encerrados</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={() => handleFilter()} className="container gap-2 bg-[#FF9200] hover:bg-[#FF9200]/80 cursor-pointer">
                        <Search size={18} />
                        Filtrar
                    </Button>
                </div>

                <div className="sm:w-3/4">
                    <h1 className="font-bold text-3xl border-b-4 inline-block pb-2 mb-6 border-[#FF9200]">
                        {selectedStatus === "0" ? "Cursos Disponíveis" :
                            selectedStatus === "1" ? "Cursos Encerrados" :
                                selectedStatus === "2" ? "Próximos Cursos" : "Todos os Cursos"}
                    </h1>

                    {courses?.length > 0 && !loading ? (
                        <div className="sm:grid grid-cols-12 gap-5 space-y-10 sm:space-y-0">
                            {courses.map((c: any, index: number) => (
                                <div key={c.id} className="col-span-4">
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 * index }}   >
                                        <CursoCard
                                            id={c?.id}
                                            title={c?.title}
                                            codigo={c?.code}
                                            vagas_ofertadas={c?.status_vacancy}
                                            escolaridade_minima={c?.minimumEducation}
                                        />
                                    </motion.div>
                                </div>

                            ))}
                        </div>
                    ) : loading ? (
                        <div className="sm:grid grid-cols-12 gap-10 space-y-10 sm:space-y-0">
                            {[1, 2, 3, 4, 5, 6].map((index) => (
                                <div className="col-span-4" key={index}>
                                    <Card className="sm:w-full">
                                        <CardHeader>
                                            <Skeleton className="aspect-video w-full animate-pulse" />
                                        </CardHeader>
                                        <CardContent>
                                            <CardTitle className="font-bold text-lg"><Skeleton className="w-full h-6 animate-pulse" /></CardTitle>
                                            <Skeleton className="h-4 w-2/3 mt-2 animate-pulse"></Skeleton>
                                            <Skeleton className="h-4 w-1/2 mt-2 animate-pulse"></Skeleton>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground h-[63vh]">
                            <AlertCircle /> <p>Não existem cursos disponíveis para os filtros selecionados.</p>
                        </div>
                    )}

                    <Pagination className="mt-10">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (current_page > 1) setCurrentPage(prev => prev - 1);
                                    }}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive>
                                    {current_page}
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    className={`${current_page === meta?.totalPages ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage(prev => prev < meta?.totalPages ? prev + 1 : prev);
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}