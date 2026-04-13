'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Clock, Users, BookOpen, FileText, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CursosServices from '@/services/cursosServices';
import { toast } from 'sonner';

export default function ViewCoursePage() {
    const router = useRouter();
    const params = useParams();
    const cursoId = params.cursoId as string;
    const [course, setCourse] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await CursosServices.findById(cursoId);
                setCourse(res.data || res);
            } catch (err) {
                toast.error('Falha ao carregar curso');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [cursoId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader className="size-8 animate-spin text-[#f58220]" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">Curso não encontrado</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    onClick={() => router.back()}
                    className="rounded-2xl hover:bg-slate-100 size-12 flex items-center justify-center p-0"
                >
                    <ArrowLeft className="size-6 text-slate-400" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight">{course.title}</h1>
                    <p className="text-slate-500 font-medium">Código: {course.code}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Descrição */}
                    <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                                <BookOpen className="size-6 text-[#f58220]" />
                                Sobre o Curso
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10">
                            <p className="text-slate-700 leading-relaxed">{course.description}</p>
                        </CardContent>
                    </Card>

                    {/* Detalhes */}
                    <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                            <CardTitle className="text-lg font-black text-[#004587] uppercase tracking-tight">
                                Informações Detalhadas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Categoria</p>
                                    <p className="text-slate-900 font-semibold">{course.category?.title || 'Geral'}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Modalidade</p>
                                    <p className="text-slate-900 font-semibold">{course.type}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Idade Mínima</p>
                                    <p className="text-slate-900 font-semibold">{course.minAge} anos</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Escolaridade Mínima</p>
                                    <p className="text-slate-900 font-semibold">{course.minimumEducation}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Localização */}
                    <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                                <MapPin className="size-6 text-[#f58220]" />
                                Localização
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-4">
                            <p className="text-slate-700"><strong>Cidade:</strong> {course.municipality}</p>
                            <p className="text-slate-700"><strong>Endereço:</strong> {course.address}</p>
                        </CardContent>
                    </Card>

                    {/* Cronograma */}
                    {course.schedule && (
                        <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                            <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                                <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                                    <Clock className="size-6 text-[#f58220]" />
                                    Cronograma
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-10">
                                <p className="text-slate-700">{course.schedule}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden sticky top-6">
                        <CardHeader className="bg-linear-to-br from-[#004587] to-[#003450] p-10 text-white">
                            <CardTitle className="text-lg font-black uppercase tracking-tight">Ações</CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-4">
                            <Button 
                                variant="outline" 
                                className="w-full rounded-2xl border-2 border-[#004587] text-[#004587] hover:bg-[#004587] hover:text-white font-black h-12"
                                onClick={() => router.push(`/gerenciador/admin/${params.id}/dashboard/cursos/atualizar/${cursoId}`)}
                            >
                                Editar Curso
                            </Button>
                            <Button 
                                variant="destructive"
                                className="w-full rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black h-12"
                            >
                                Excluir
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
