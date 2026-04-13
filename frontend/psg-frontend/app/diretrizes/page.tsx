'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import DiretrizesService from "@/services/diretrizesService";
import { useRouter } from "next/navigation";

export default function DiretrizesPage() {
  const router = useRouter();
  const [latestDiretriz, setLatestDiretriz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestDiretriz = async () => {
      try {
        const response = await DiretrizesService.findAll(1, 10);
        console.log(response);
        if (response && response.items.length > 0) {
          
          setLatestDiretriz(response.items[0]);
        }
      } catch (error) {
        console.error('Erro ao buscar última diretriz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestDiretriz();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Diretrizes</h1>
              <p className="text-slate-600">Normas e regulamentos do Programa Senac de Gratuidade</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {latestDiretriz ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Featured Latest Diretriz */}
            <Card className="mb-8 border-2 border-primary/20 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/80  text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8" />
                    <div>
                      <CardTitle className="text-2xl">Última Diretriz Atualizada</CardTitle>
                      <p className="text-primary-foreground/90 mt-1">
                        Documento oficial mais recente do programa
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    ATIVO
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {latestDiretriz.title}
                    </h2>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        Atualizado em {latestDiretriz?.created_at}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <p className="text-slate-700 leading-relaxed">
                      Este documento contém todas as normas, regras e procedimentos atualizados
                      do Programa Senac de Gratuidade (PSG). É fundamental que todos os interessados
                      estejam familiarizados com seu conteúdo.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      asChild
                      size="lg"
                      className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                    >
                      <a
                        href={latestDiretriz?.file_path}
                        target="_blank"
                        download
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <Download className="h-5 w-5" />
                        Baixar PDF Completo
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900">
                      Importante
                    </h3>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                      As diretrizes do PSG são atualizadas periodicamente. Mantenha-se informado
                      sobre as últimas mudanças e sempre consulte a versão mais recente antes
                      de qualquer procedimento relacionado ao programa.
                    </p>
                    <div className="flex justify-center gap-4 mt-6">
                      <Link href="/cursos">
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                          Ver Cursos Disponíveis
                        </Button>
                      </Link>
                      <Link href="/resultados">
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                          Ver Resultados
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Nenhuma diretriz encontrada
            </h2>
            <p className="text-slate-600 mb-6">
              No momento não há diretrizes disponíveis para visualização.
            </p>
            <Button asChild>
              <Link href="/">Voltar ao Início</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}