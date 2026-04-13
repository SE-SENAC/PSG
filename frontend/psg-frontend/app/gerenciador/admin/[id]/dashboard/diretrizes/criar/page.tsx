'use client'

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardList, ArrowLeft, Upload, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import DiretrizesService from "@/services/diretrizesService";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";

export default function CriarDiretrizPage() {
    const router = useRouter();
    const { id: adminId } = useParams();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [displayFileName, setDisplayFileName] = useState<string>("");
    const [active, setActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                setError("Por favor, selecione um arquivo PDF.");
                return;
            }
            
            // Gerar nome com data
            const today = new Date();
            const dateString = today.toLocaleDateString('pt-BR').replace(/\//g, '-');
            const fileNameWithoutExtension = selectedFile.name.replace('.pdf', '');
            const newFileName = `${fileNameWithoutExtension}_${dateString}.pdf`;
            
            setFile(selectedFile);
            setDisplayFileName(newFileName);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !file) {
            setError("Por favor, preencha o título e selecione um arquivo.");
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
                file_path: base64File,
                active: active
            };

            await DiretrizesService.create(payload);
            
            setSuccess(true);
            setTimeout(() => {
                router.push(`/gerenciador/admin/${adminId}/dashboard/diretrizes`);
            }, 2000);
        } catch (err: any) {
            console.error("Erro ao criar diretriz:", err);
            setError(err.friendlyMessage || "Erro ao salvar diretriz. Tente novamente.");
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
                <h2 className="text-2xl font-bold text-slate-900">Diretriz criada com sucesso!</h2>
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
                    <h1 className="text-3xl font-bold text-slate-900">Nova Diretriz</h1>
                    <p className="text-slate-500">Faça o upload do documento de diretrizes e normas.</p>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ClipboardList size={20} className="text-purple-600" />
                        Informações da Diretriz
                    </CardTitle>
                    <CardDescription>Preencha os detalhes e anexe o arquivo PDF oficial.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Título da Diretriz</label>
                            <Input 
                                placeholder="Ex: Diretrizes PSG 2024 - Normas de Concessão" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-slate-50/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Documento (PDF)</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                                    ${file ? 'border-purple-200 bg-purple-50/30' : 'border-slate-200 hover:border-purple-400 hover:bg-slate-50'}
                                `}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                />
                                {file ? (
                                    <>
                                        <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                            <FileText size={24} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-slate-900">{displayFileName}</p>
                                            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                            setDisplayFileName("");
                                        }} className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                                            Remover Arquivo
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                                            <Upload size={24} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-slate-900">Clique para fazer upload</p>
                                            <p className="text-xs text-slate-500">Apenas arquivos PDF são aceitos</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium text-slate-900">Diretriz Ativa</label>
                                <p className="text-xs text-slate-500">Se desativado, o documento não será exibido para os alunos.</p>
                            </div>
                            <Switch 
                                checked={active}
                                onCheckedChange={setActive}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <Button variant="outline" type="button" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} className="px-8 bg-purple-600 hover:bg-purple-700">
                                {loading ? "Salvando..." : "Criar Diretriz"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

