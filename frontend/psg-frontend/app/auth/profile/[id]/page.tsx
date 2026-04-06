'use client'

import { useEffect, useState } from "react";
import AuthServices from "@/services/authServices";
import { useParams } from "next/navigation";
import { ProfileInterfaceStudent } from "@/models/profile.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    User, Mail, Phone, MapPin, Briefcase, GraduationCap,
    Heart, Calculator, Calendar, UserRound, Home, BookOpen,
    Shield, ArrowLeft
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

export default function Profile() {
    const [profile, setProfile] = useState<ProfileInterfaceStudent>();
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const user = useSelector((state: RootState) => state.auth.user);

    async function handleProfile() {
        try {
            setLoading(true);
            let response;
            if (params.id === 'me') {
                response = await AuthServices.getMe();
            } else {
                response = await AuthServices.profile(String(params.id));
            }
            setProfile(response);
            console.log("Profile Data:", response);
        } catch (e) {
            console.error("Error fetching profile:", e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleProfile();
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
                <div className="container max-w-5xl space-y-8 animate-pulse">
                    <div className="flex items-center gap-6">
                        <Skeleton className="h-24 w-24 rounded-full bg-gray-800" />
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-64 bg-gray-800" />
                            <Skeleton className="h-5 w-48 bg-gray-800" />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 space-y-6">
                            <Skeleton className="h-80 w-full rounded-2xl bg-gray-800" />
                        </div>
                        <div className="md:col-span-8 space-y-6">
                            <Skeleton className="h-80 w-full rounded-2xl bg-gray-800" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
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

    const userData = [
        { icon: <Mail className="w-4 h-4" />, label: "Email", value: profile?.email },
        { icon: <UserRound className="w-4 h-4" />, label: "CPF", value: profile?.student?.cpf || 'N/A' },
        { icon: <Heart className="w-4 h-4" />, label: "Gênero", value: profile?.student?.gender === 'MALE' ? 'Masculino' : profile?.student?.gender === 'FEMALE' ? 'Feminino' : profile?.student?.gender || 'N/A' },
        { icon: <Calendar className="w-4 h-4" />, label: "Nascimento", value: profile?.student?.birth_date ? new Date(profile.student.birth_date).toLocaleDateString('pt-BR') : 'N/A' },
    ];

    const address = profile?.addresses?.[0] || null;
    const phone = profile?.phones?.[0] || null;

    const studentInfo = [
        { icon: <GraduationCap className="w-4 h-4" />, label: "Escolaridade", value: profile?.student?.educationLevel || (profile?.student as any)?.education_level || 'N/A' },
        { icon: <BookOpen className="w-4 h-4" />, label: "Instituição", value: profile?.student?.institution || 'N/A' },
        { icon: <Briefcase className="w-4 h-4" />, label: "Ocupação", value: profile?.student?.job_status || 'N/A' },
        { icon: <User className="w-4 h-4" />, label: "Filiação Maternal", value: profile?.student?.mother_name || 'N/A' },
        { icon: <User className="w-4 h-4" />, label: "Filiação Paternal", value: profile?.student?.father_name || 'N/A' },
        { icon: <Home className="w-4 h-4" />, label: "Local Estudo Seg.", value: profile?.student?.where_study_secondary_school || 'N/A' },
    ];

    return (
        <div className="min-h-screen min-w-[75vw] text-white selection:bg-[#FF9200]/30 overflow-x-hidden pt-2 pb-4 my-10 rounded-md">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#FF9200]/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-[#FF9200]/3 blur-[100px] rounded-full"></div>
            </div>

            <div className="container mx-auto p-4 md:p-8 max-w-6xl relative z-10 animate-in fade-in duration-700 mt-10">

                {/* Header Section */}
                <div className=" bg-[#001A33] shadow relative mb-12 flex flex-col md:flex-row items-center md:items-end gap-8  p-8 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-[#FF9200] to-[#FFB75E] rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                        <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-[#1A1A1A] shadow-2xl relative">
                            <AvatarImage src="" alt={profile?.name} />
                            <AvatarFallback className="bg-[#1A1A1A] text-white text-5xl font-bold">
                                {profile?.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-[#1A1A1A] rounded-full"></div>
                    </div>

                    <div className="text-center md:text-left space-y-3 flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9200]/10 border border-[#FF9200]/20 text-[#FF9200] text-xs font-bold uppercase tracking-wider mb-2">
                            Perfil Verificado
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-sm">
                            {profile?.name}
                        </h1>
                        <p className="text-white flex items-center justify-center md:justify-start gap-3 text-lg">
                            <Mail className="w-5 h-5 text-[#FF9200]" />
                            <span className="font-medium">{profile?.email}</span>
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-12 gap-x-8 gap-y-12">

                    {/* Basic Info Column */}
                    <div className="md:col-span-4 space-y-8">
                        <Card className="bg-[#001A33] p-10  border-white/5 overflow-hidden rounded-[2rem]">
                            <CardHeader className="bg-gradient-to-b from-white/5 to-transparent pb-4">
                                <CardTitle className="text-xl text-white flex items-center gap-3">
                                    <div className="p-2 bg-[#FF9200]/10 rounded-xl">
                                        <Shield className="w-5 h-5 text-[#FF9200]" />
                                    </div>
                                    Dados Gerais
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                {userData.map((item, idx) => (
                                    <div key={idx} className="group flex flex-col space-y-2 transition-transform duration-300 hover:translate-x-1">
                                        <div className="text-gray-500 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                            {item.icon} {item.label}
                                        </div>
                                        <p className=" text-white text-base font-semibold pl-6 border-l-2 border-transparent group-hover:border-[#FF9200] transition-colors">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className=" bg-[#001A33] p-10 border-white/5 backdrop-blur-md overflow-hidden rounded-[2rem]">
                            <CardHeader className="bg-gradient-to-b from-white/5 to-transparent">
                                <CardTitle className="text-xl flex items-center gap-3 text-white">
                                    <div className="p-2 bg-[#FF9200]/10 rounded-xl">
                                        <Phone className="w-5 h-5 text-[#FF9200]" />
                                    </div>
                                    Contato
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="bg-[#FF9200] p-3 rounded-xl shadow-lg shadow-[#FF9200]/20">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Telefone Principal</p>
                                        <p className="text-lg font-bold text-white tracking-wide">
                                            {phone ? `+${phone.ddi || '55'} (${phone.ddd}) ${phone.number}` : 'Não informado'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Academic & Socio Info Column */}
                    <div className="md:col-span-8 space-y-8">
                        <Card className="bg-[#001A33] p-10 border-white/5 overflow-hidden rounded-[2rem] h-full">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl flex items-center gap-3 text-white font-bold">
                                    <div className="p-2 bg-[#FF9200]/10 rounded-xl">
                                        <GraduationCap className="w-6 h-6 text-[#FF9200]" />
                                    </div>
                                    Acadêmico e Socioeconômico
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
                                    {studentInfo.map((item, idx) => (
                                        <div key={idx} className="group space-y-2 transition-all duration-300 ">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                {item.icon} {item.label}
                                            </div>
                                            <p className="text-white text-lg font-bold pl-6 border-l-2 border-white/10 group-hover:border-[#FF9200] group-hover:bg-[#FF9200]/5 transition-all py-1 rounded-r-lg">
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}

                                    <div className="group space-y-2 lg:col-span-1">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            <Heart className="w-4 h-4 text-[#FF9200]" /> PCD
                                        </div>
                                        <div className={`ml-6 p-3 rounded-2xl border text-white ${profile?.student?.is_pcd === 'YES' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-gray-800/50 border-white/5'}`}>
                                            <p className=" font-bold text-lg">
                                                {profile?.student?.is_pcd === 'YES' ? "Sim" : "Não"}
                                                {profile?.student?.is_pcd === 'YES' && <span className="text-[#FF9200] ml-2 text-base font-medium">({profile?.student?.pcd_type})</span>}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="group space-y-2 lg:col-span-1">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            <Calculator className="w-4 h-4 text-[#FF9200]" /> Renda Familiar
                                        </div>
                                        <div className="ml-6 flex items-baseline gap-2">
                                            <span className="text-[#FF9200] font-black text-2xl">R$</span>
                                            <p className="font-black text-[#FF9200] text-3xl tracking-tighter">
                                                {profile?.student?.family_income?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Full Width Address Section */}
                    <div className="md:col-span-12">
                        <Card className="bg-[#001A33] text-white p-10 border-white/5 backdrop-blur-md overflow-hidden rounded-[2rem] shadow-2xl relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9200]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>

                            <CardHeader className="relative z-10 border-b border-white/5">
                                <CardTitle className="text-white text-2xl flex items-center gap-4 font-black">
                                    <div className="p-3 bg-[#FF9200] rounded-2xl shadow-xl shadow-[#FF9200]/20">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    Localização Residencial
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-10 pb-10 relative z-10">
                                <div className="grid md:grid-cols-4 gap-12">
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Logradouro</label>
                                            <p className="text-3xl font-black text-white hover:text-[#FF9200] transition-colors">
                                                {address ? `${address.street}, ${address.residence_number}` : 'Endereço não informado'}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Bairro</label>
                                                <p className="text-lg font-bold text-white">{address?.neighborhood || 'N/A'}</p>
                                            </div>
                                            {address?.complement && (
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Complemento</label>
                                                    <p className="text-lg font-bold text-white">{address.complement}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 grid grid-cols-2 gap-12">
                                        <div className="space-y-1 p-6 bg-white/5 rounded-[2rem] border border-white/5 flex flex-col justify-center items-center text-center">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Cidade / UF</label>
                                            <p className="text-xl font-black text-white">{address?.city || 'N/A'}</p>
                                            <p className="text-4xl font-black text-[#FF9200] mt-1">{address?.state || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1 p-6 bg-white/5 rounded-[2rem] border border-white/5 flex flex-col justify-center items-center text-center border-b-[#FF9200] border-b-4">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Código Postal</label>
                                            <p className="text-2xl font-black text-white tracking-widest">{address?.zipCode || (address as any)?.zip_code || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    )
}
