'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SubscriptionServices from "@/services/subscriptionServices";
import { Card, CardHeader, CardTitle, CardContent, CardAction, CardFooter } from "@/components/ui/card";
import { Clock, Edit, Trash2, ArrowLeft,CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchCourseById } from "@/lib/store/courses/courses";

interface course_details {
    address: string;
    availablePosition: number;
    classPeriodEnd: string;
    classPeriodStart: string;
    code: string;
    courseEnd: string;
    courseStart: string;
    description: string;
    id: string;
    isActive: boolean;
    minAge: number;
    minimumEducation: string;
    schooldays: string;
    status_vacancy: number;
    subscriptionEndDate: string;
    subscriptionStartDate: string;
    targetAudience: string;
    title: string;
    workload: number;
    img_url: string;
    period_day: number;
}

export default function CourseDetails() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    
    const { selectedCourse: courseDetails, loading } = useSelector((state: RootState) => state.courses);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const user = useSelector((state: RootState) => state.auth.user);

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState<Partial<course_details>>({});

    const [subscription,setSubscription] = useState<boolean>(false);
    const [maskedMail,setMaskedMail] = useState<string>("");

    const handleCourseDetails = async (courseId: string) => {
        dispatch(fetchCourseById(courseId));
    };

    const handleConfirm = async () => {
        try {
            await SubscriptionServices.create(courseDetails.id, String(user?.id));
            setSubscription(true);
            // handleCourseDetails(Number(id));
            // setIsEditDialogOpen(false);
        } catch(e) {
            console.error("Error confirming course:", e);
            alert("Erro ao confirmar curso.");
        }
    }

    useEffect(() => {
        if (id) {
            handleCourseDetails(String(id));
        }
    }, [id]);

    const handleDate = (date: string | undefined) => {
        if (!date) return "N/A";
        return date.split("T")[0];
    };

    // const handleDelete = async () => {
    //     if (confirm("Tem certeza que deseja excluir este curso?")) {
    //         try {
    //             await CursosServices.delete(Number(id));
    //             router.push("/cursos");
    //         } catch (e) {
    //             console.error("Error deleting course:", e);
    //             alert("Erro ao excluir curso.");
    //         }
    //     }
    // };

    // const handleUpdate = async () => {
    //     try {
    //         await CursosServices.update(Number(id), editForm);
    //         setIsEditDialogOpen(false);
    //         handleCourseDetails(Number(id));
    //         alert("Curso atualizado com sucesso!");
    //     } catch (e) {
    //         console.error("Error updating course:", e);
    //         alert("Erro ao atualizar curso.");
    //     }
    // };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    }

    if (!courseDetails) {
        return <div className="flex flex-col justify-center items-center h-screen gap-4">
            <p>Curso não encontrado.</p>
            <Button onClick={() => router.push("/cursos")}>Voltar para cursos</Button>
        </div>;
    }



    return (
        <div className="sm:h-[135vh] bg-background">

            <img className="w-full h-60 object-cover" src={courseDetails.img_url || "https://picsum.photos/100/50"} alt={courseDetails.title} />

            <div className="container mx-auto px-4 mt-20">
                <div className="flex justify-start mb-4 gap-2">
                    {/* <Button variant="outline" className="bg-white" onClick={() => router.push("/cursos")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button> */}
                    {/* <Button variant="outline" className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50" onClick={() => setIsEditDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Editar
                    </Button>
                    <Button variant="outline" className="bg-white text-red-600 border-red-600 hover:bg-red-50" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </Button> */}
                </div>
                <div className="w-full flex justify-center">
                    <Card className=" -translate-y-50  max-w-4xl shadow-xl  border-t-8 border-[#FF9200] sm:pl-25 sm:pr-25 sm:pb-15 sm:pt-10">
                        <CardHeader className="">
                            <div className="flex justify-between items-start">
                                <div className="">
                                    <div className="flex items-center">
                                       <Button variant="link" className=" flex gap-1 p-1 rounded-lg opacity-[0.8] border border-white/20">
                                            <Link className="text-muted-foreground hover:text-foreground" href={"http://localhost:3000/"}>
                                                Início 
                                            </Link>
                                        </Button>
                                        /
                                        <Button variant="link" className="flex gap-1 p-1 rounded-l border opacity-[0.8] border-white/20">
                                            <Link className="text-muted-foreground hover:text-foreground" href={"http://localhost:3000/cursos"}>
                                                Cursos
                                            </Link>
                                        </Button>
                                    </div>
                                        <CardTitle className="text-2xl sm:text-4xl font-extrabold text-foreground mb-2">
                                            {courseDetails.title}
                                        </CardTitle>
                                        
                                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                            <Clock className="h-5 w-5 text-[#FF9200]" />
                                            <span>Carga horária: {courseDetails.workload} horas</span>
                                </div>
                            </div>
                </div>
                        </CardHeader>

                        <CardContent className="space-y-12">
                            <section>
                                <h3 className="text-xl font-bold text-foreground/80 mb-4 border-b-2 border-[#FF9200]/20 pb-2">Sobre o curso</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                                    {courseDetails.description}
                                </p>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { title: "Código", value: courseDetails.code },
                                    { title: "Endereço", value: courseDetails.address },
                                    { title: "Vagas Disponíveis", value: courseDetails.availablePosition },
                                    { title: "Público Alvo", value: courseDetails.targetAudience },
                                    { title: "Idade Mínima", value: `${courseDetails.minAge} anos` },
                                    { title: "Educação Mínima", value: courseDetails.minimumEducation },
                                ].map((item, idx) => (
                                    <Card key={idx} className="text-center bg-card hover:border-[#FF9200]/30 transition-all border-l-4 border-l-[#FF9200]/50 shadow-sm border border-border">
                                        <CardHeader className="py-3">
                                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                                {item.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="py-2">
                                            <p className="font-bold text-foreground">{item.value}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="bg-card border border-border shadow-sm overflow-hidden">
                                    <div className="bg-[#FF9200]/5 px-6 py-3 border-b border-border">
                                        <h3 className="font-bold text-foreground/80 uppercase text-sm tracking-wide">Período de Inscrição</h3>
                                    </div>
                                    <CardContent className="flex justify-around py-6 text-center">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Início</p>
                                            <p className="text-lg font-bold text-foreground">{handleDate(courseDetails.subscriptionStartDate)}</p>
                                        </div>
                                        <div className="w-px bg-border"></div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Fim</p>
                                            <p className="text-lg font-bold text-foreground">{handleDate(courseDetails.subscriptionEndDate)}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-card border border-border shadow-sm overflow-hidden">
                                    <div className="bg-[#FF9200]/5 px-6 py-3 border-b border-border">
                                        <h3 className="font-bold text-foreground/80 uppercase text-sm tracking-wide">Período das Aulas</h3>
                                    </div>
                                    <CardContent className="flex justify-around py-6 text-center">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Início</p>
                                            <p className="text-lg font-bold text-foreground">{handleDate(courseDetails.classPeriodStart)}</p>
                                        </div>
                                        <div className="w-px bg-border"></div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Fim</p>
                                            <p className="text-lg font-bold text-foreground">{handleDate(courseDetails.classPeriodEnd)}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                           { isAuthenticated ? 
                            <div className="bg-secondary/5 rounded-xl p-8 border border-secondary/10 text-center">
                                <Button onClick={()=>setIsEditDialogOpen(true)} className="w-full sm:w-auto px-12 py-7 text-lg font-bold bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20 transition-all hover:-translate-y-1">
                                    Inscreva-se Agora
                                </Button>
                            </div> : 
                             <div className="bg-secondary/5 rounded-xl p-8 border border-secondary/10 text-center">
                                <Button onClick={() => router.push("/auth/login")} className="w-full sm:w-auto px-12 py-7 text-lg font-bold bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20 transition-all hover:-translate-y-1">
                                    Realizar Login
                                </Button>
                            </div>
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className=" max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{subscription ? "Inscrição Confirmada" : "Confirmar Inscrição"}</DialogTitle>
                    </DialogHeader>
                    {subscription ? 
                    <div className="space-y-4">
                        <div className="flex justify-center rounded-full">
                            <div className="rounded-full bg-green-100 p-3">
                                <CheckCircle className="text-green-600 w-auto h-[2.5rem]"/>
                            </div>
                        </div>
                        <div>
                            <p>Inscição realizada em <span className="font-bold">{courseDetails.title}</span> </p>
                            <p>{courseDetails.description}</p>
                            <p className="mt-2 font-bold">Verifique a sua caixa de email {user?.email} para acompanhar o andamento da inscrição.</p>
                        </div>
                    </div>

                    :
                        <div>
                            <p>Você deseja confirmar a sua inscrição no curso <span className="font-bold">{courseDetails.title}</span> ? </p>
                            <p>{courseDetails.description}</p>
                        </div>
                    }
                    {!subscription && 
                        <DialogFooter className="inline space-y-2">
                            <Button className="container cursor-pointer" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
                            <Button className="container cursor-pointer bg-[#FF9200]" onClick={handleConfirm}>Confirmar</Button>
                        </DialogFooter>
                    }
                </DialogContent>
            </Dialog>
        </div>
    );
}