'use client'

import { useEffect, useState } from "react";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { EllipsisVertical, Eye, Trash, Search, Plus, ActivitySquare, FileText, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import ResultsServices from "@/services/resultsServices";
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

export default function ResultadosPage() {
    const [resultados, setResultados] = useState<any[]>([]);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;
    const router = useRouter();
    const { id: adminId } = useParams();

    const fetchResultados = async (searchOverride?: string) => {
        setLoading(true);
        try {
            const currentSearch = searchOverride !== undefined ? searchOverride : search;
            const response = await ResultsServices.findAll(currentPage, itemsPerPage, currentSearch);

            let resultsList: any[] = [];
            if (response.items && Array.isArray(response.items)) {
                resultsList = response.items;
            } else if (response.data && Array.isArray(response.data)) {
                resultsList = response.data;
            } else if (Array.isArray(response)) {
                resultsList = response;
            }

            setResultados(resultsList);
            if (response.meta) {
                setTotalPages(response.meta.totalPages || 1);
            } else if (Array.isArray(response)) {
                setTotalPages(1);
            }
        } catch (e) {
            console.error("Erro ao carregar resultados", e);
            toast.error("Falha ao carregar resultados");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResultados();
    }, [currentPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) {
                fetchResultados();
            } else {
                setCurrentPage(1);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este resultado?")) return;

        try {
            await ResultsServices.delete(id);
            toast.success("Resultado excluído com sucesso");
            fetchResultados();
        } catch (e) {
            toast.error("Erro ao excluir resultado");
            console.error(e);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Resultados</h1>
                    <p className="text-slate-500">Acompanhe e gerencie os resultados dos processos seletivos.</p>
                </div>
                <Button 
                    onClick={() => router.push(`/gerenciador/admin/${adminId}/dashboard/resultados/criar`)}
                    className="bg-[#f58220] hover:bg-[#e67318] text-slate-950 shadow-lg shadow-[#f58220]/20"
                >
                    <Plus className="mr-2 h-4 w-4" /> Novo Resultado
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por título ou código..."
                    className="pl-12 h-12 rounded-3xl"
                />
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[15%]">Código</TableHead>
                            <TableHead className="w-[35%]">Título</TableHead>
                            <TableHead>Publicação</TableHead>
                            <TableHead>Documento</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                    Carregando resultados...
                                </TableCell>
                            </TableRow>
                        ) : resultados.length > 0 ? (
                            resultados.map((res) => (
                                <TableRow key={res.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <Badge variant="secondary" className="font-mono bg-slate-100 text-slate-700 hover:bg-slate-200">
                                            {res.code}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                                                <ActivitySquare size={20} />
                                            </div>
                                            <span className="font-semibold text-slate-900">{res.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <Calendar size={14} className="text-slate-400" />
                                            {res.created_at ? new Date(res.created_at).toLocaleDateString('pt-BR') : '---'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-medium bg-slate-50 text-slate-600 border-slate-200">
                                            {res.file_path ? (res.file_path.length > 50 ? 'resultado.pdf' : res.file_path.split('/').pop()) : 'Sem arquivo'}
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
                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => window.open(res.file_path, '_blank')}>
                                                    <Eye className="mr-2 h-4 w-4" /> Visualizar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push(`/gerenciador/admin/${adminId}/dashboard/resultados/atualizar/${res.id}`)}>
                                                    <Plus className="mr-2 h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => handleDelete(res.id)}>
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
                                    {search ? "Nenhum resultado encontrado." : "Nenhum resultado cadastrado."}
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

