'use client'

import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from "@/components/ui/pagination";
import ResultsServices from "@/services/resultsServices";
import { useEffect } from "react";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";

interface ResultadoInterface {
    codigo: string;
    titulo: string;
    data_atualizacao: Date | string;
    download: string;
}

interface MetaInterface {
    currentPage: number;
    itemCount: number;
    totalItems: number;
    totalPages: number;
}

export default function Resultados() {

    const [meta, setMeta] = useState<MetaInterface>();
    const [resultados, setResultados] = useState<ResultadoInterface[]>([]);
    const headers = ["Código", "Título", "Data de Atualização", "Download"]
    const [current_page, setCurrentPage] = useState<number>(1);

    const handleResults = async () => {
        try {
            let response = await ResultsServices.findAll(current_page);
            setResultados(response.items);
            setMeta(response.meta);
            console.log(response);
        } catch (e) {
            throw e;
        }
    }

    const motionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const MotionTableRow = motion.create(TableRow);

    useEffect(() => {
        handleResults()
    }, [current_page]);


    return (
        <div className="container mx-auto space-y-20 pl-10 sm:pl-20 mt-20 mb-10 h-[80vh]">
            <div className="flex justify-center">
                <div className="inline-block border-b-2 border-[#FF9200]">
                    <h1 className="text-2xl font-semibold">Resultados</h1>
                </div>
            </div>
            <Table className="h-[50vh]">
                <TableHeader>
                    <TableRow>
                        {headers.map((x, index) => <TableHead key={index} className="">{x}</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resultados?.length > 0 ? resultados?.map((x: any, index) =>

                        <MotionTableRow key={index} variants={motionVariants} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.1 * index }}>
                            
                                <TableCell>{x.code}</TableCell>
                                <TableCell>{x.title}</TableCell>
                                <TableCell>{x.updated_at}</TableCell>
                                <TableCell><Link href={`/${x.file_path}`} download={"resultado.pdf"}><Button className="cursor-pointer bg-[#FF9200] hover:bg-[#FF9200]/90 text-light"><Download /> Download</Button></Link></TableCell>

                            
                        </MotionTableRow>

                    )
                        :
                        <TableRow>
                            <TableCell className="h-24 text-center" colSpan={headers.length}>Não existem resultados</TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
            <Pagination className="mt-10">
                <PaginationContent>
                    {/* Botão Anterior */}
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (current_page > 1) setCurrentPage(prev => prev - 1);
                            }}
                        />
                    </PaginationItem>

                    {/* Lógica de Números (Exemplo simples: página atual) */}
                    {/* Se tiver o total de páginas da API, você pode fazer um map aqui */}
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                            {current_page}
                        </PaginationLink>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>

                    <PaginationItem onClick={() => setCurrentPage(meta?.totalPages)}>
                        <PaginationLink>
                            {meta?.totalPages}
                        </PaginationLink>
                    </PaginationItem>

                    {/* Botão Próximo */}
                    <PaginationItem>
                        <PaginationNext
                            className={`${current_page === meta?.totalPages ? 'opacity-[0.5] hover:bg-transparent cursor-default' : ''}`}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                // Idealmente aqui você verifica se há uma próxima página
                                current_page != meta?.totalPages && setCurrentPage(prev => prev + 1);
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}