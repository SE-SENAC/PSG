'use client'

import { useEffect, useState } from "react";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { EllipsisVertical, Eye, Trash, Search, Plus, FileText, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import EditalService from "@/services/editalService";
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

export default function EditalPage() {
    const [editais, setEditais] = useState<any[]>([]);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;
    const router = useRouter();
    const { id: adminId } = useParams();

    const fetchEditais = async (searchOverride?: string) => {
        setLoading(true);
        try {
            const currentSearch = searchOverride !== undefined ? searchOverride : search;
            const response = await EditalService.findAll(currentPage, itemsPerPage, currentSearch);

            let editalList: any[] = [];
            if (response.items && Array.isArray(response.items)) {
                editalList = response.items;
            } else if (response.data && Array.isArray(response.data)) {
                editalList = response.data;
            } else if (Array.isArray(response)) {
                editalList = response;
            }

            setEditais(editalList);
            if (response.meta) {
                setTotalPages(response.meta.totalPages || 1);
            } else if (Array.isArray(response)) {
                setTotalPages(1);
            }
        } catch (e) {
            console.error("Erro ao carregar editais", e);
            toast.error("Falha ao carregar editais");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEditais();
    }, [currentPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) {
                fetchEditais();
            } else {
                setCurrentPage(1);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este edital?")) return;

        try {
            await EditalService.delete(id);
            toast.success("Edital excluído com sucesso");
            fetchEditais();
        } catch (e) {
            toast.error("Erro ao deletar edital");
            console.error(e);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Editais</h1>
                    <p className="text-slate-500">Gerencie os editais de convocação e processos seletivos.</p>
                </div>
                <Button 
                    onClick={() => router.push(`/gerenciador/admin/${adminId}/dashboard/edital/criar`)}
                    className="bg-[#f58220] hover:bg-[#e67318] text-slate-950 shadow-lg shadow-[#f58220]/20"
                >
                    <Plus className="mr-2 h-4 w-4" /> Novo Edital
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por título..."
                    className="pl-12 h-12 rounded-3xl"
                />
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[45%]">Título</TableHead>
                            <TableHead>Publicação</TableHead>
                            <TableHead>Documento</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                                    Carregando editais...
                                </TableCell>
                            </TableRow>
                        ) : editais.length > 0 ? (
                            editais.map((edital) => (
                                <TableRow key={edital.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 shrink-0">
                                                <FileText size={20} />
                                            </div>
                                            <span className="font-semibold text-slate-900">{edital.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <Calendar size={14} className="text-slate-400" />
                                            {edital.created_at ? new Date(edital.created_at).toLocaleDateString('pt-BR') : '---'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-medium bg-slate-50 text-slate-600 border-slate-200">
                                            {edital.file_path ? (edital.file_path.length > 50 ? 'documento.pdf' : edital.file_path.split('/').pop()) : 'Sem arquivo'}
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
                                                <DropdownMenuLabel>Opções</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => window.open(edital.file_path, '_blank')}>
                                                    <Eye className="mr-2 h-4 w-4" /> Visualizar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push(`/gerenciador/admin/${adminId}/dashboard/edital/atualizar/${edital.id}`)}>
                                                    <Plus className="mr-2 h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => handleDelete(edital.id)}>
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
                                    {search ? "Nenhum edital encontrado." : "Nenhum edital cadastrado."}
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

