'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import CursosServices from '@/services/cursosServices';
import CategoryServices from '@/services/categoryServices';
import AddressServices from '@/services/addressServices';
import { toast } from 'sonner';

export default function UpdateCoursePage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.courseId as string;
    const adminId = params.id as string;

    const [course, setCourse] = useState<any>(null);
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [municipality, setMunicipality] = useState('');
    const [address, setAddress] = useState('');
    const [minAge, setMinAge] = useState('');
    const [minimumEducation, setMinimumEducation] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [municipalities, setMunicipalities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Fetch course and related data
    useEffect(() => {
        const fetch = async () => {
            try {
                const courseRes = await CursosServices.findById(courseId);
                const courseData = courseRes.data || courseRes;
                setCourse(courseData);
                setTitle(courseData.title);
                setCode(courseData.code);
                setDescription(courseData.description);
                setType(courseData.type);
                setMunicipality(courseData.municipality);
                setAddress(courseData.address || '');
                setMinAge(courseData.minAge?.toString() || '');
                setMinimumEducation(courseData.minimumEducation || '');
                setCategoryId(courseData.category?.id || '');

                // Fetch categories
                const categoriesRes = await CategoryServices.getAll();
                setCategories(Array.isArray(categoriesRes) ? categoriesRes : categoriesRes.data || []);

                // Fetch municipalities
                const addressesRes = await AddressServices.getAll();
                const uniqueMunicipalities = [...new Set(
                    (Array.isArray(addressesRes) ? addressesRes : addressesRes.data || []).map((a: any) => a.municipality)
                )];
                setMunicipalities(uniqueMunicipalities);
            } catch (err) {
                toast.error('Falha ao carregar dados');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [courseId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !code.trim()) {
            toast.error('Título e código são obrigatórios');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('code', code);
            formData.append('description', description);
            formData.append('type', type);
            formData.append('municipality', municipality);
            formData.append('address', address);
            if (minAge) formData.append('minAge', minAge);
            if (minimumEducation) formData.append('minimumEducation', minimumEducation);
            if (categoryId) formData.append('categoryId', categoryId);

            await CursosServices.update(courseId, formData);
            toast.success('Curso atualizado com sucesso!');
            router.push(`/gerenciador/super-admin/${adminId}/dashboard/cursos`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Erro ao atualizar curso');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader className="size-8 animate-spin text-[#f58220]" />
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
                <h1 className="text-3xl font-black text-[#004587] tracking-tight">Atualizar Curso</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações Básicas */}
                <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                        <CardTitle className="text-lg font-black text-[#004587] uppercase tracking-tight">
                            Informações Básicas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-black text-slate-700 uppercase tracking-widest">Título *</Label>
                            <Input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Nome do curso"
                                className="h-12 rounded-full border-2 border-slate-200 px-6 text-base"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-black text-slate-700 uppercase tracking-widest">Código *</Label>
                            <Input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Código único"
                                className="h-12 rounded-full border-2 border-slate-200 px-6 text-base"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-black text-slate-700 uppercase tracking-widest">Descrição</Label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Descrição do curso"
                                className="min-h-[120px] rounded-3xl border-2 border-slate-200 p-6 text-base"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-black text-slate-700 uppercase tracking-widest">Categoria</Label>
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger className="h-12 rounded-full border-2 border-slate-200">
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Informações Educacionais */}
                <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                        <CardTitle className="text-lg font-black text-[#004587] uppercase tracking-tight">
                            Requisitos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-black text-slate-700 uppercase tracking-widest">Idade Mínima</Label>
                                <Input
                                    type="number"
                                    value={minAge}
                                    onChange={(e) => setMinAge(e.target.value)}
                                    placeholder="Ex: 18"
                                    className="h-12 rounded-full border-2 border-slate-200 px-6 text-base"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-black text-slate-700 uppercase tracking-widest">Escolaridade Mínima</Label>
                                <Input
                                    type="text"
                                    value={minimumEducation}
                                    onChange={(e) => setMinimumEducation(e.target.value)}
                                    placeholder="Ex: Ensino Médio"
                                    className="h-12 rounded-full border-2 border-slate-200 px-6 text-base"
                                />
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
                    <CardContent className="p-10 space-y-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-black text-slate-700 uppercase tracking-widest">Modalidade</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="h-12 rounded-full border-2 border-slate-200">
                                    <SelectValue placeholder="Selecione a modalidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Presencial">Presencial</SelectItem>
                                    <SelectItem value="Híbrida">Híbrida</SelectItem>
                                    <SelectItem value="EAD">EAD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-black text-slate-700 uppercase tracking-widest">Município</Label>
                            <Select value={municipality} onValueChange={setMunicipality}>
                                <SelectTrigger className="h-12 rounded-full border-2 border-slate-200">
                                    <SelectValue placeholder="Selecione um município" />
                                </SelectTrigger>
                                <SelectContent>
                                    {municipalities.map((mun) => (
                                        <SelectItem key={mun} value={mun}>
                                            {mun}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-black text-slate-700 uppercase tracking-widest">Endereço</Label>
                            <Input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Rua, número, complemento"
                                className="h-12 rounded-full border-2 border-slate-200 px-6 text-base"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4 pt-6">
                    <Button 
                        type="submit"
                        disabled={submitting}
                        className="flex-1 h-14 bg-[#f58220] hover:bg-[#e67318] text-slate-950 font-black rounded-2xl"
                    >
                        {submitting ? <Loader className="animate-spin mr-2 size-4" /> : null}
                        {submitting ? 'Atualizando...' : 'Atualizar Curso'}
                    </Button>
                    <Button 
                        type="button"
                        onClick={() => router.back()}
                        variant="outline"
                        className="flex-1 h-14 border-2 border-slate-200 rounded-2xl font-black"
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}
