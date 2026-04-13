'use client'

import { useEffect, useState } from "react";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import CourseInterface from "@/models/course.interface";
import { EllipsisVertical, Eye, Trash, Search, Plus, BookOpen, GraduationCap, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import CursosServices from "@/services/cursosServices";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function CoursesPage() {
    const [courses, setCourses] = useState<CourseInterface[]>([]);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;
    const router = useRouter();
    const { id: adminId } = useParams();

    const fetchCourses = async (searchOverride?: string) => {
        setLoading(true);
        try {
            const currentSearch = searchOverride !== undefined ? searchOverride : search;
            const response = await CursosServices.filteredCourses({
                page: currentPage,
                limit: itemsPerPage,
                search: currentSearch,
            });

            let courseList: any[] = [];
            if (response.items && Array.isArray(response.items)) {
                courseList = response.items;
            } else if (response.data && Array.isArray(response.data)) {
                courseList = response.data;
            } else if (Array.isArray(response)) {
                courseList = response;
            }

            setCourses(courseList);
            if (response.meta) {
                setTotalPages(response.meta.totalPages || 1);
            } else if (Array.isArray(response)) {
                setTotalPages(1);
            }
        } catch (e) {
            console.error("Erro ao carregar cursos", e);
            toast.error("Falha ao carregar cursos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [currentPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) {
                fetchCourses();
            } else {
                setCurrentPage(1);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (id: string) => {
        if (!confirm("Deseja realmente excluir este curso?")) return;

        try {
            await CursosServices.delete(id);
            toast.success("Curso excluído com sucesso");
            fetchCourses();
        } catch (e) {
            toast.error("Erro ao excluir curso");
            console.error(e);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cursos</h1>
                    <p className="text-slate-500">Gerencie o catálogo de cursos disponíveis para inscrição.</p>
                </div>
                <Button 
                    onClick={() => router.push(`/gerenciador/admin/${adminId}/dashboard/cursos/criar`)}
                    className="bg-[#f58220] hover:bg-[#e67318] text-slate-950 shadow-lg shadow-[#f58220]/20"
                >
                    <Plus className="mr-2 h-4 w-4" /> Novo Curso
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por título ou categoria..."
                    className="pl-12 h-12 rounded-3xl"
                />
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[40%]">Curso</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Vagas</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                    Carregando cursos...
                                </TableCell>
                            </TableRow>
                        ) : courses.length > 0 ? (
                            courses.map((course) => (
                                <TableRow key={course.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                                                <BookOpen size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900">{course.title}</span>
                                                <span className="text-xs text-slate-500 uppercase font-medium">{course.code}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <GraduationCap size={14} className="text-slate-400" />
                                            <span className="text-sm text-slate-600">{course.category?.title || 'Geral'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="text-slate-400" />
                                            <span className="text-sm font-medium">{course.availablePosition}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={course.status_vacancy === 1 ? "default" : "secondary"}
                                            className={course.status_vacancy === 1 ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80" : ""}
                                        >
                                            {course.status_vacancy === 1 ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                                                    <EllipsisVertical size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Opções do Curso</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => router.push(`/gerenciador/admin/${adminId}/dashboard/cursos/ver/${course.id}`)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push(`/gerenciador/admin/${adminId}/dashboard/cursos/atualizar/${course.id}`)}>
                                                    <Plus className="mr-2 h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => handleDelete(course.id)}>
                                                    <Trash className="mr-2 h-4 w-4" /> Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                    Nenhum curso encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <div className="flex justify-center mt-6">
                <Pagination>
                    <PaginationContent className="bg-white p-2 rounded-3xl border border-slate-200 shadow-lg">
                        <PaginationItem>
                            <PaginationPrevious 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                className={"cursor-pointer hover:bg-slate-50 rounded-2xl transition-all" + (currentPage === 1 ? " pointer-events-none opacity-50" : "")}
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
                                            className={"cursor-pointer rounded-2xl transition-all font-bold" + (currentPage === page ? " bg-[#004587] text-white hover:bg-[#004587]" : " hover:bg-slate-50 text-slate-600")}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            }

                            if (page === currentPage - 2 || page === currentPage + 2) {
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
                                className={"cursor-pointer hover:bg-slate-50 rounded-2xl transition-all" + (currentPage === totalPages ? " pointer-events-none opacity-50" : "")}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
