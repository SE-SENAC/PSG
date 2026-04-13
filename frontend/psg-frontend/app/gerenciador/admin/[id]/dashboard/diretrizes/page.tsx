'use client'

import { useEffect, useState } from "react";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { EllipsisVertical, Eye, Trash, Search, Plus, ClipboardList, Settings, FileText } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import DiretrizesService from "@/services/diretrizesService";
import { Badge } from "@/components/ui/badge";
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

export default function DiretrizesPage() {
    const [diretrizes, setDiretrizes] = useState<any[]>([]);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;
    const router = useRouter();
    const { id: adminId } = useParams();

    const fetchDiretrizes = async (searchOverride?: string) => {
        setLoading(true);
        try {
            const currentSearch = searchOverride !== undefined ? searchOverride : search;
            const response = await DiretrizesService.findAll(currentPage, itemsPerPage, currentSearch);

            let guidelines: any[] = [];
            if (response.items && Array.isArray(response.items)) {
                guidelines = response.items;
            } else if (response.data && Array.isArray(response.data)) {
                guidelines = response.data;
            } else if (Array.isArray(response)) {
                guidelines = response;
            }

            setDiretrizes(guidelines);
            if (response.meta) {
                setTotalPages(response.meta.totalPages || 1);
            } else if (Array.isArray(response)) {
                setTotalPages(1);
            }
        } catch (e) {
            console.error("Erro ao carregar diretrizes", e);
            toast.error("Falha ao carregar diretrizes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiretrizes();
    }, [currentPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) {
                fetchDiretrizes();
            } else {
                setCurrentPage(1);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir esta diretriz?")) return;

        try {
            await DiretrizesService.delete(id);
            toast.success("Diretriz excluída com sucesso");
            fetchDiretrizes();
        } catch (e) {
            toast.error("Erro ao deletar diretriz");
            console.error(e);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Diretrizes</h1>
                    <p className="text-slate-500">Configurações e normas gerais do Programa Senac de Gratuidade.</p>
                </div>
                <Button 
                    onClick={() => router.push(`/gerenciador/admin/${adminId}/dashboard/diretrizes/criar`)}
                    className="bg-[#f58220] hover:bg-[#e67318] text-slate-950 shadow-lg shadow-[#f58220]/20"
                >
                    <Plus className="mr-2 h-4 w-4" /> Nova Diretriz
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar diretrizes..."
                    className="pl-12 h-12 rounded-3xl"
                />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[30%]">Título</TableHead>
                            <TableHead className="w-[40%]">Arquivo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                                    Carregando diretrizes...
                                </TableCell>
                            </TableRow>
                        ) : diretrizes.length > 0 ? (
                            diretrizes.map((d) => (
                                <TableRow key={d.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-medium text-slate-900">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                                                <ClipboardList size={18} />
                                            </div>
                                            {d.title}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        <div className="flex items-center text-xs italic">
                                            <FileText size={14} className="mr-1 text-slate-400" />
                                            {d.file_path?.split('/').pop() || 'diretriz.pdf'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={d.active ? "default" : "secondary"}>
                                            {d.active ? 'Ativo' : 'Inativo'}
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
                                                <DropdownMenuItem onClick={() => router.push(`/gerenciador/admin/${adminId}/dashboard/diretrizes/ver/${d.id}`)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push(`/gerenciador/admin/${adminId}/dashboard/diretrizes/atualizar/${d.id}`)}>
                                                    <Settings className="mr-2 h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => handleDelete(d.id)}>
                                                    <Trash className="mr-2 h-4 w-4" /> Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                                    {search ? "Nenhuma diretriz encontrada." : "Nenhuma diretriz configurada."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

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
