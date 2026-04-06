'use client'

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Shield } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Dashboard(){

    const user = useSelector((state: RootState) => state.auth.user);

    if(!user){
        return (
            <div className="min-h-screen min-w-[75vw]  flex flex-col items-center justify-center text-white space-y-6 p-6 text-center">
                <div className="p-6 bg-red-950 border border-red-500 rounded-2xl">
                    <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Perfil não encontrado</h2>
                    <p className="text-gray-400 mt-2">Não foi possível carregar os dados deste usuário.</p>
                </div>
                <Link href="/" className="flex items-center gap-2 text-[#FF9200] hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Início
                </Link>
            </div>
        );

    }

    

    return(
        <div className="container mx-auto">
            <p>asd</p>
        </div>
    )
}