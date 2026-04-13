'use client'

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ActivitySquare, ArrowLeft, Upload, CheckCircle2, AlertCircle, FileText, Hash } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import ResultsServices from "@/services/resultsServices";
import { motion } from "framer-motion";

export default function CriarResultadoPage() {
    const router = useRouter();
    const { id: adminId } = useParams();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState("");
    const [code, setCode] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !code || !file) {
            setError("Por favor, preencha todos os campos e selecione um arquivo.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const reader = new FileReader();
            const base64File = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const payload = {
                title,
                code,
                file_path: base64File
            };

            await ResultsServices.create(payload);
            
            setSuccess(true);
            setTimeout(() => {
                router.push(`/gerenciador/admin/${adminId}/dashboard/resultados`);
            }, 2000);
        } catch (err: any) {
            console.error("Erro ao criar resultado:", err);
            setError(err.friendlyMessage || "Erro ao salvar resultado. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                    <CheckCircle2 size={64} className="text-emerald-500" />
                </motion.div>
                <h2 className="text-2xl font-bold text-slate-900">Resultado publicado com sucesso!</h2>
                <p className="text-slate-500">Redirecionando para a listagem...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Novo Resultado</h1>
                    <p className="text-slate-500">Publique o resultado de um processo seletivo.</p>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ActivitySquare size={20} className="text-orange-500" />
                        Dados do Resultado
                    </CardTitle>
                    <CardDescription>Defina o cargo/curso, código de referência e anexe o arquivo.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    Título do Resultado
                                </label>
                                <Input 
                                    placeholder="Ex: Resultado Final - Curso de informática" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-slate-50/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    Código
                                </label>
                                <Input 
                                    placeholder="Ex: RES-2024-01" 
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="bg-slate-50/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Arquivo de Resultado</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                                    ${file ? 'border-orange-200 bg-orange-50/30' : 'border-slate-200 hover:border-orange-200 hover:bg-slate-50'}
                                `}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                {file ? (
                                    <>
                                        <div className="h-12 w-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                            <FileText size={24} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-slate-900">{file.name}</p>
                                            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }} className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                                            Remover
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                                            <Upload size={24} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-slate-900">Anexe o arquivo de resultado</p>
                                            <p className="text-xs text-slate-500">PDF, Excel ou Imagem</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" type="button" onClick={() => router.back()}>
                                Descartar
                            </Button>
                            <Button type="submit" disabled={loading} className="px-8 bg-orange-600 hover:bg-orange-700">
                                {loading ? "Publicando..." : "Publicar Resultado"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
