'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CursoCardProps {
    id: number;
    title: string;
    codigo: string;
    vagas_ofertadas: number;
    escolaridade_minima: string
}

export default function CursoCard({ id, title, codigo, vagas_ofertadas, escolaridade_minima }: CursoCardProps) {
    return (
        <Card className="hover:shadow-lg w-3/4 sm:w-full transition-shadow duration-700 ease border border-border">
            <img className="aspect-video object-cover" src="https://psg.se.senac.br/img/uploads/upload_69b1de3d42937_Assistente_de_Pessoal.png" />
            <CardHeader>
                <CardTitle className="font-bold text-lg">{title}</CardTitle>
            </CardHeader>
            <CardDescription className="ml-4 space-y-1">
                <p>Código do curso: {codigo}</p>
                <p>Vagas ofertadas: {vagas_ofertadas}</p>
                <p>Escolaridade mínima: {escolaridade_minima}</p>
            </CardDescription>
            <CardFooter>
                <Link href={`cursos/detalhes-curso/${id}`}><Button className="cursor-pointer bg-secondary hover:bg-secondary/90 transition-colors" >Saiba mais</Button></Link>
            </CardFooter>
        </Card>
    )
}