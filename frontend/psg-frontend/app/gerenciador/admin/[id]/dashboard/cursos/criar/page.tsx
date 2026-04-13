'use client'

import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    BookOpen, MapPin, Users, CalendarDays, Clock, GraduationCap,
    ImagePlus, ArrowLeft, Sparkles, CheckCircle2, Upload
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import CursosServices from "@/services/cursosServices";

const fadeUp = (i: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.08 * i, ease: [.22, 1, .36, 1] as [number, number, number, number] },
});

const sectionIcon = (Icon: React.ElementType) => (
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0">
        <Icon size={18} />
    </span>
);

interface CategoryItem {
    id: string;
    title: string;
}


function Field({ label, children, span = "col-span-6" }: { label: string; children: React.ReactNode; span?: string }) {
    return (
        <div className={`${span} space-y-1.5`}>
            <label className="text-sm font-medium text-muted-foreground tracking-wide">{label}</label>
            {children}
        </div>
    );
}


export default function CreateCoursePage() {
    const router = useRouter();
    const { id } = useParams();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [type, setType] = useState("LIVRE");
    const [availablePosition, setAvailablePosition] = useState("");
    const [address, setAddress] = useState("");
    const [municipality, setMunicipality] = useState("");
    const [minAge, setMinAge] = useState("");
    const [schooldays, setSchooldays] = useState("");
    const [workload, setWorkload] = useState("");
    const [minimumEducation, setMinimumEducation] = useState("");
    const [periodDay, setPeriodDay] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [classPeriodStart, setClassPeriodStart] = useState("");
    const [classPeriodEnd, setClassPeriodEnd] = useState("");
    const [subscriptionStart, setSubscriptionStart] = useState("");
    const [subscriptionEnd, setSubscriptionEnd] = useState("");
    const [courseStart, setCourseStart] = useState("");
    const [courseEnd, setCourseEnd] = useState("");
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        CursosServices.getAllCategories()
            .then((res: any) => {
                const data = Array.isArray(res) ? res : res?.data ?? [];
                setCategories(data);
            })
            .catch(() => { });
    }, []);

    const handleImageChange = (file: File | null) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setImgPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) handleImageChange(file);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const now = new Date().toISOString();
            await CursosServices.create({
                type,
                img_url: imgPreview ?? "",
                title,
                status_vacancy: 0,
                address,
                municipality,
                categoryId,
                targetAudience,
                minAge: Number(minAge),
                schooldays,
                workload: Number(workload),
                minimumEducation,
                description,
                code,
                availablePosition: Number(availablePosition),
                classPeriodStart: classPeriodStart || now,
                classPeriodEnd: classPeriodEnd || now,
                subscriptionStartDate: subscriptionStart || now,
                subscriptionEndDate: subscriptionEnd || now,
                courseStart: courseStart || now,
                courseEnd: courseEnd || now,
                createAt: now,
                updatedAt: now,
                period_day: periodDay === "MANHÃ" ? 0 : periodDay === "TARDE" ? 1 : 2,
            });
            setSubmitted(true);
            setTimeout(() => router.push(`/auth-manager/admin/${id}/dashboard/cursos`), 1800);
        } catch (err) {
            console.error("Erro ao criar curso:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center min-h-[60vh] gap-5"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.15 }}
                >
                    <CheckCircle2 size={72} className="text-emerald-500 drop-shadow-lg" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground">Curso criado com sucesso!</h2>
                <p className="text-muted-foreground">Redirecionando para a lista de cursos…</p>
            </motion.div>
        );
    }

    let section = 0;

    return (
        <div className="ml-[7.5vw] w-full max-w-[900px] pb-16 ">
    
            <motion.div {...fadeUp(section++)} className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="group inline-flex items-center justify-center w-10 h-10 rounded-xl
                               bg-muted/60 hover:bg-primary/10 text-muted-foreground hover:text-primary
                               transition-all duration-300 cursor-pointer"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Sparkles size={20} className="text-secondary" />
                        Criar Novo Curso
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Preencha as informações para publicar um novo curso</p>
                </div>
            </motion.div>

            <div className="space-y-6">
        
                <motion.div {...fadeUp(section++)}>
                    <Card className="overflow-hidden border-dashed border-2 border-border/80 shadow-none bg-card/50 hover:border-primary/30 transition-colors duration-500">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                {sectionIcon(ImagePlus)}
                                <div>
                                    <CardTitle className="text-base">Imagem do Curso</CardTitle>
                                    <CardDescription>Arraste ou clique para enviar (JPEG, PNG, WebP)</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed
                                            py-10 cursor-pointer transition-all duration-300
                                            ${isDragging
                                        ? "border-primary bg-primary/5 scale-[1.01]"
                                        : "border-border hover:border-primary/40 hover:bg-muted/30"
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                                />
                                {imgPreview ? (
                                    <motion.img
                                        initial={{ opacity: 0, scale: 0.92 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        src={imgPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg shadow-md"
                                    />
                                ) : (
                                    <>
                                        <Upload size={32} className="text-muted-foreground/50" />
                                        <span className="text-sm text-muted-foreground">
                                            Clique ou arraste a imagem aqui
                                        </span>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

        
                <motion.div {...fadeUp(section++)}>
                    <Card className="shadow-sm hover:shadow-md transition-shadow duration-500">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                {sectionIcon(BookOpen)}
                                <div>
                                    <CardTitle className="text-base">Informações Básicas</CardTitle>
                                    <CardDescription>Dados principais do curso</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-12 gap-x-5 gap-y-4">
                                <Field label="Título do Curso" span="col-span-12 sm:col-span-6">
                                    <Input placeholder="Ex: Desenvolvimento Web Full-Stack" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </Field>
                                <Field label="Código" span="col-span-6 sm:col-span-3">
                                    <Input placeholder="CRS-001" value={code} onChange={(e) => setCode(e.target.value)} />
                                </Field>
                                <Field label="Tipo" span="col-span-6 sm:col-span-3">
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Tipo" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LIVRE">Livre</SelectItem>
                                            <SelectItem value="TECNICO">Técnico</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field label="Categoria" span="col-span-12 sm:col-span-6">
                                    <Select value={categoryId} onValueChange={setCategoryId}>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                                            ))}
                                            {categories.length === 0 && (
                                                <SelectItem value="__none" disabled>Nenhuma categoria</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field label="Público-Alvo" span="col-span-12 sm:col-span-6">
                                    <Input placeholder="Ex: Jovens e Adultos" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} />
                                </Field>
                                <Field label="Descrição" span="col-span-12">
                                    <Textarea
                                        className="resize-none min-h-[100px]"
                                        placeholder="Descreva o objetivo e conteúdo do curso…"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Field>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

        
                <motion.div {...fadeUp(section++)}>
                    <Card className="shadow-sm hover:shadow-md transition-shadow duration-500">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                {sectionIcon(Users)}
                                <div>
                                    <CardTitle className="text-base">Vagas & Requisitos</CardTitle>
                                    <CardDescription>Defina a capacidade e pré-requisitos</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-12 gap-x-5 gap-y-4">
                                <Field label="Vagas Disponíveis" span="col-span-6 sm:col-span-4">
                                    <Input type="number" placeholder="30" value={availablePosition} onChange={(e) => setAvailablePosition(e.target.value)} />
                                </Field>
                                <Field label="Idade Mínima" span="col-span-6 sm:col-span-4">
                                    <Input type="number" placeholder="16" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
                                </Field>
                                <Field label="Escolaridade Mínima" span="col-span-12 sm:col-span-4">
                                    <Select value={minimumEducation} onValueChange={setMinimumEducation}>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Fundamental Incompleto">Fund. Incompleto</SelectItem>
                                            <SelectItem value="Fundamental Completo">Fund. Completo</SelectItem>
                                            <SelectItem value="Médio Incompleto">Médio Incompleto</SelectItem>
                                            <SelectItem value="Médio Completo">Médio Completo</SelectItem>
                                            <SelectItem value="Superior Incompleto">Superior Incompleto</SelectItem>
                                            <SelectItem value="Superior Completo">Superior Completo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

        
                <motion.div {...fadeUp(section++)}>
                    <Card className="shadow-sm hover:shadow-md transition-shadow duration-500">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                {sectionIcon(MapPin)}
                                <div>
                                    <CardTitle className="text-base">Localização</CardTitle>
                                    <CardDescription>Onde as aulas serão realizadas</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-12 gap-x-5 gap-y-4">
                                <Field label="Endereço" span="col-span-12 sm:col-span-8">
                                    <Input placeholder="Rua, número, bairro" value={address} onChange={(e) => setAddress(e.target.value)} />
                                </Field>
                                <Field label="Município" span="col-span-12 sm:col-span-4">
                                    <Input placeholder="Aracaju" value={municipality} onChange={(e) => setMunicipality(e.target.value)} />
                                </Field>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

        
                <motion.div {...fadeUp(section++)}>
                    <Card className="shadow-sm hover:shadow-md transition-shadow duration-500">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                {sectionIcon(Clock)}
                                <div>
                                    <CardTitle className="text-base">Horários & Rotina</CardTitle>
                                    <CardDescription>Carga-horária, turno e dias letivos</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-12 gap-x-5 gap-y-4">
                                <Field label="Carga Horária (horas)" span="col-span-6 sm:col-span-4">
                                    <Input type="number" placeholder="120" value={workload} onChange={(e) => setWorkload(e.target.value)} />
                                </Field>
                                <Field label="Período do Dia" span="col-span-6 sm:col-span-4">
                                    <Select value={periodDay} onValueChange={setPeriodDay}>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Turno" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MANHÃ">Manhã</SelectItem>
                                            <SelectItem value="TARDE">Tarde</SelectItem>
                                            <SelectItem value="NOITE">Noite</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field label="Dias da Semana" span="col-span-12 sm:col-span-4">
                                    <Input placeholder="Seg a Sex" value={schooldays} onChange={(e) => setSchooldays(e.target.value)} />
                                </Field>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

        
                <motion.div {...fadeUp(section++)}>
                    <Card className="shadow-sm hover:shadow-md transition-shadow duration-500">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                {sectionIcon(CalendarDays)}
                                <div>
                                    <CardTitle className="text-base">Calendário</CardTitle>
                                    <CardDescription>Período de inscrições, turma e aulas</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-5">
                        
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-2">Inscrições</p>
                                    <div className="grid grid-cols-12 gap-x-5 gap-y-4">
                                        <Field label="Início" span="col-span-6">
                                            <Input type="date" value={subscriptionStart} onChange={(e) => setSubscriptionStart(e.target.value)} />
                                        </Field>
                                        <Field label="Fim" span="col-span-6">
                                            <Input type="date" value={subscriptionEnd} onChange={(e) => setSubscriptionEnd(e.target.value)} />
                                        </Field>
                                    </div>
                                </div>
                        
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-2">Turma</p>
                                    <div className="grid grid-cols-12 gap-x-5 gap-y-4">
                                        <Field label="Início" span="col-span-6">
                                            <Input type="date" value={classPeriodStart} onChange={(e) => setClassPeriodStart(e.target.value)} />
                                        </Field>
                                        <Field label="Fim" span="col-span-6">
                                            <Input type="date" value={classPeriodEnd} onChange={(e) => setClassPeriodEnd(e.target.value)} />
                                        </Field>
                                    </div>
                                </div>
                        
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-2">Curso</p>
                                    <div className="grid grid-cols-12 gap-x-5 gap-y-4">
                                        <Field label="Início" span="col-span-6">
                                            <Input type="date" value={courseStart} onChange={(e) => setCourseStart(e.target.value)} />
                                        </Field>
                                        <Field label="Fim" span="col-span-6">
                                            <Input type="date" value={courseEnd} onChange={(e) => setCourseEnd(e.target.value)} />
                                        </Field>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

        
                <motion.div {...fadeUp(section++)} className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                        variant="outline"
                        className="flex-1 sm:flex-none cursor-pointer"
                        onClick={() => router.back()}
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="flex-1 gap-2 text-base font-semibold py-5 cursor-pointer
                                   bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary
                                   shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                        disabled={isSubmitting || !title}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="inline-block"
                                >
                                    ⏳
                                </motion.span>
                                Criando…
                            </span>
                        ) : (
                            <>
                                <GraduationCap size={18} />
                                Criar Curso
                            </>
                        )}
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}