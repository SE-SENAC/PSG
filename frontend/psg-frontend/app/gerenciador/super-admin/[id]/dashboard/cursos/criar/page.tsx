'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
    BookOpen, 
    ArrowLeft, 
    Save, 
    RefreshCcw,
    LayoutGrid,
    MapPin,
    Clock,
    Users,
    Type,
    ClipboardList,
    Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CursosServices from '@/services/cursosServices';
import { toast } from 'sonner';

export default function CreateCoursePage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState<any>({
        title: '',
        code: '',
        categoryId: '',
        description: '',
        address: '',
        municipality: '',
        availablePosition: 0,
        workload: 0,
        minAge: 16,
        targetAudience: '',
        schooldays: '',
        minimumEducation: '',
        type: 'Gratuito',
        status_vacancy: 1,
        img_url: '',
        classPeriodStart: '',
        classPeriodEnd: '',
        subscriptionStartDate: '',
        subscriptionEndDate: '',
        courseStart: '',
        courseEnd: '',
        period_day: 1
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await CursosServices.getAllCategories();
                setCategories(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error(err);
                toast.error("Erro ao carregar categorias");
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await CursosServices.create(formData);
            toast.success("Curso criado com sucesso no catálogo!");
            router.push(`/gerenciador/super-admin/${id}/dashboard/cursos`);
        } catch (err: any) {
            console.error(err);
            toast.error("Falha ao criar curso. Verifique os campos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-20">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    onClick={() => router.back()}
                    className="rounded-2xl hover:bg-slate-100 size-12 flex items-center justify-center p-0"
                >
                    <ArrowLeft className="size-6 text-slate-400" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight">Novo Curso</h1>
                    <p className="text-slate-500 font-medium italic">Expanda a oferta acadêmica cadastrando um novo título.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Informações Básicas */}
                    <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                                <BookOpen className="size-6 text-[#f58220]" />
                                Informações Principais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título do Curso</label>
                                    <Input 
                                        required
                                        placeholder="Ex: Técnico em Enfermagem" 
                                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 focus:ring-2 focus:ring-[#004587]/10"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código Identificador</label>
                                    <Input 
                                        required
                                        placeholder="Ex: PSG-2026-001" 
                                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 focus:ring-2 focus:ring-[#004587]/10"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria/Área</label>
                                    <Select 
                                        value={formData.categoryId} 
                                        onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700">
                                            <SelectValue placeholder="Selecione uma área" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            {categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Modalidade</label>
                                    <Select 
                                        value={formData.type} 
                                        onValueChange={(val) => setFormData({ ...formData, type: val })}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            <SelectItem value="Gratuito">Gratuito (PSG)</SelectItem>
                                            <SelectItem value="Pago">Pago/Comercial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição do Curso</label>
                                <Textarea 
                                    placeholder="Descreva os objetivos, perfil do egresso e conteúdos..." 
                                    className="min-h-[150px] rounded-3xl bg-slate-50 border-none font-medium text-slate-700 p-6 focus:ring-2 focus:ring-[#004587]/10"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Requisitos e Logística */}
                    <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-3 text-lg font-black text-[#004587] uppercase tracking-tight">
                                <ClipboardList className="size-6 text-[#f58220]" />
                                Requisitos e Detalhes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Idade Mínima</label>
                                    <Input 
                                        type="number" 
                                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                                        value={formData.minAge}
                                        onChange={(e) => setFormData({ ...formData, minAge: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vagas Disponíveis</label>
                                    <Input 
                                        type="number" 
                                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                                        value={formData.availablePosition}
                                        onChange={(e) => setFormData({ ...formData, availablePosition: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Carga Horária (Horas)</label>
                                    <Input 
                                        type="number" 
                                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                                        value={formData.workload}
                                        onChange={(e) => setFormData({ ...formData, workload: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Escolaridade Mínima</label>
                                    <Input 
                                        placeholder="Ex: Ensino Médio Completo" 
                                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                                        value={formData.minimumEducation}
                                        onChange={(e) => setFormData({ ...formData, minimumEducation: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dias de Aula</label>
                                    <Input 
                                        placeholder="Ex: Segunda a Sexta" 
                                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                                        value={formData.schooldays}
                                        onChange={(e) => setFormData({ ...formData, schooldays: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Público Alvo</label>
                                    <Input 
                                        placeholder="Ex: Desempregados, Jovens..." 
                                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                                        value={formData.targetAudience}
                                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    {/* Localização */}
                    <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-3 text-sm font-black text-[#004587] uppercase tracking-tight">
                                <MapPin className="size-5 text-[#f58220]" />
                                Localização
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cidade/Município</label>
                                <Input 
                                    placeholder="Aracaju, Itabaiana..." 
                                    className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                                    value={formData.municipality}
                                    onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Endereço da Unidade</label>
                                <Input 
                                    placeholder="Rua, Bairro, Nº..." 
                                    className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Datas Importantes */}
                    <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-3 text-sm font-black text-[#004587] uppercase tracking-tight">
                                <Clock className="size-5 text-[#f58220]" />
                                Cronograma
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Início das Inscrições</label>
                                <Input 
                                    type="date" 
                                    className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                                    value={formData.subscriptionStartDate}
                                    onChange={(e) => setFormData({ ...formData, subscriptionStartDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Início das Aulas</label>
                                <Input 
                                    type="date" 
                                    className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                                    value={formData.courseStart}
                                    onChange={(e) => setFormData({ ...formData, courseStart: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Button 
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-[30px] h-20 bg-[#004587] hover:bg-[#00386d] text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#004587]/20 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        {loading ? <RefreshCcw className="size-6 animate-spin mr-3" /> : <Save className="size-6 mr-3" />}
                        Publicar Curso
                    </Button>
                </div>
            </form>
        </div>
    );
}
