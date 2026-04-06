'use client'

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { User, Phone, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { Mail, House } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddressServices } from "@/services/addressServices";
import AuthServices from "@/services/authServices";

const ddiList = [
    { value: "55", label: "Brasil (+55)" },
    { value: "1", label: "Estados Unidos/Canadá (+1)" },
    { value: "351", label: "Portugal (+351)" },
    { value: "54", label: "Argentina (+54)" },
    { value: "56", label: "Chile (+56)" },
    { value: "57", label: "Colômbia (+57)" },
    { value: "58", label: "Venezuela (+58)" },
    { value: "598", label: "Uruguai (+598)" },
    { value: "595", label: "Paraguai (+595)" },
    { value: "591", label: "Bolívia (+591)" },
    { value: "51", label: "Peru (+51)" },
    { value: "593", label: "Equador (+593)" },
    { value: "52", label: "México (+52)" },
    { value: "34", label: "Espanha (+34)" },
    { value: "44", label: "Reino Unido (+44)" },
    { value: "49", label: "Alemanha (+49)" },
    { value: "33", label: "França (+33)" },
    { value: "39", label: "Itália (+39)" },
    { value: "81", label: "Japão (+81)" },
    { value: "86", label: "China (+86)" }
];

const dddList = [
    { value: "11", label: "11 - São Paulo/SP" },
    { value: "12", label: "12 - São José dos Campos/SP" },
    { value: "13", label: "13 - Santos/SP" },
    { value: "14", label: "14 - Bauru/SP" },
    { value: "15", label: "15 - Sorocaba/SP" },
    { value: "16", label: "16 - Ribeirão Preto/SP" },
    { value: "17", label: "17 - São José do R. P./SP" },
    { value: "18", label: "18 - Presidente Prudente/SP" },
    { value: "19", label: "19 - Campinas/SP" },
    { value: "21", label: "21 - Rio de Janeiro/RJ" },
    { value: "22", label: "22 - Campos dos Goytacazes/RJ" },
    { value: "24", label: "24 - Volta Redonda/RJ" },
    { value: "27", label: "27 - Vitória/ES" },
    { value: "28", label: "28 - Cachoeiro de Itapemirim/ES" },
    { value: "31", label: "31 - Belo Horizonte/MG" },
    { value: "32", label: "32 - Juiz de Fora/MG" },
    { value: "33", label: "33 - Governador Valadares/MG" },
    { value: "34", label: "34 - Uberlândia/MG" },
    { value: "35", label: "35 - Poços de Caldas/MG" },
    { value: "37", label: "37 - Divinópolis/MG" },
    { value: "38", label: "38 - Montes Claros/MG" },
    { value: "41", label: "41 - Curitiba/PR" },
    { value: "42", label: "42 - Ponta Grossa/PR" },
    { value: "43", label: "43 - Londrina/PR" },
    { value: "44", label: "44 - Maringá/PR" },
    { value: "45", label: "45 - Foz do Iguaçu/PR" },
    { value: "46", label: "46 - Francisco Beltrão/PR" },
    { value: "47", label: "47 - Joinville/SC" },
    { value: "48", label: "48 - Florianópolis/SC" },
    { value: "49", label: "49 - Chapecó/SC" },
    { value: "51", label: "51 - Porto Alegre/RS" },
    { value: "53", label: "53 - Pelotas/RS" },
    { value: "54", label: "54 - Caxias do Sul/RS" },
    { value: "55", label: "55 - Santa Maria/RS" },
    { value: "61", label: "61 - Brasília/DF" },
    { value: "62", label: "62 - Goiânia/GO" },
    { value: "63", label: "63 - Palmas/TO" },
    { value: "64", label: "64 - Rio Verde/GO" },
    { value: "65", label: "65 - Cuiabá/MT" },
    { value: "66", label: "66 - Rondonópolis/MT" },
    { value: "67", label: "67 - Campo Grande/MS" },
    { value: "68", label: "68 - Rio Branco/AC" },
    { value: "69", label: "69 - Porto Velho/RO" },
    { value: "71", label: "71 - Salvador/BA" },
    { value: "73", label: "73 - Ilhéus/BA" },
    { value: "74", label: "74 - Juazeiro/BA" },
    { value: "75", label: "75 - Feira de Santana/BA" },
    { value: "77", label: "77 - Barreiras/BA" },
    { value: "79", label: "79 - Aracaju/SE" },
    { value: "81", label: "81 - Recife/PE" },
    { value: "82", label: "82 - Maceió/AL" },
    { value: "83", label: "83 - João Pessoa/PB" },
    { value: "84", label: "84 - Natal/RN" },
    { value: "85", label: "85 - Fortaleza/CE" },
    { value: "86", label: "86 - Teresina/PI" },
    { value: "87", label: "87 - Petrolina/PE" },
    { value: "88", label: "88 - Juazeiro do Norte/CE" },
    { value: "89", label: "89 - Picos/PI" },
    { value: "91", label: "91 - Belém/PA" },
    { value: "92", label: "92 - Manaus/AM" },
    { value: "93", label: "93 - Santarém/PA" },
    { value: "94", label: "94 - Marabá/PA" },
    { value: "95", label: "95 - Boa Vista/RR" },
    { value: "96", label: "96 - Macapá/AP" },
    { value: "97", label: "97 - Coari/AM" },
    { value: "98", label: "98 - São Luís/MA" },
    { value: "99", label: "99 - Imperatriz/MA" }
];
enum Gender {
    MASCULINO = "MASCULINO",
    FEMININO = "FEMININO",
    OUTRO = "OUTRO"
}

enum PCD_TYPE {
    VISUAL = "VISUAL",
    AUDITORY = "AUDITORY",
    PHYSICAL = "PHYSICAL",
    MENTAL = "MENTAL",
    DEAFNESS = "DEAFNESS",
    OTHER = "OTHER"
}

enum EDUCATION_LEVEL {
    Education_Level_1 = 'Fundamental Incompleto',
    Education_Level_2 = 'Fundamental Completo',
    Education_Level_3 = 'Médio Incompleto',
    Education_Level_4 = 'Médio Completo',
    Education_Level_5 = 'Superior Incompleto',
    Education_Level_6 = 'Superior Completo',
    OUTRO = 'Outro',
}

interface RegisterInterface {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    cpf: string;
    birth_date: string;
    gender: Gender;
    is_pcd: string;
    pcd_type: PCD_TYPE;
    personal_income: number;
    family_income: number;
    mothers_name: string;
    fathers_name: string;
    number_parents_in_home: number;
    educationLevel: EDUCATION_LEVEL;
    institution: string;
    course: string;
    job_status: string;
    where_study_secondary_school: string;
    addresses: {
        zipCode: string;
        residence_number: string;
        street: string;
        complement: string;
        neighborhood: string;
        city: string;
        state: string;
        country: string;
    }
    phones: {
        number: string;
        type: boolean;
        ddd: string;
        ddi: string;
    }
}

export default function Register() {

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [errors, setErrors] = useState<any>({});
    const [serverError, setServerError] = useState<string | null>(null);

    const [personalData, setPersonalData] = useState<RegisterInterface>(
        {
            name: "",
            email: "",
            password: "",
            cpf: "",
            confirm_password: '',
            birth_date: "",
            gender: Gender.MASCULINO,
            is_pcd: '',
            pcd_type: '',
            personal_income: 0,
            family_income: 0,
            mothers_name: "",
            fathers_name: "",
            number_parents_in_home: 0,
            educationLevel: EDUCATION_LEVEL.Education_Level_1,
            institution: "",
            course: "",
            job_status: "",
            where_study_secondary_school: "",
            addresses: {
                zipCode: "",
                residence_number: "",
                street: "",
                complement: "",
                neighborhood: "",
                city: "",
                state: "",
                country: ""
            },
            phones: {
                number: '',
                type: false,
                ddd: '',
                ddi: '',
            }
        }
    );



    const handleInput = (field: string, value: any) => {
        if (field === "personal_income") {
            let r = value.replace(/\D/g, "");
            return setPersonalData((prev) => ({ ...prev, [field]: r }));
        } else if (field === "number_parents_in_home") {
            let r = value.replace(/\D/g, "");
            return setPersonalData((prev) => ({ ...prev, [field]: r }));
        } else if (field === "is_pcd" && personalData.pcd_type != "") {
            return setPersonalData((prev) => ({ ...prev, ["pcd_type"]: "" }))
        } else {
            return setPersonalData((prev) => ({ ...prev, [field]: value }));
        }
    }

    const handleInputPhone = (field: string, value: any) => {
        setPersonalData((prev) => ({
            ...prev,
            phones: {
                ...prev.phones,
                [field]: value
            }
        }));
    }
    const handleInputAddress = async (field: string, value: any) => {
        if (field === "zipCode") {
            let r = value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
            setPersonalData((prev) => ({
                ...prev, addresses: {
                    ...prev.addresses,
                    [field]: r
                }
            }));
            if (r.length === 9) {
                const cleanCep = r.replace("-", "");
                try {
                    const addressServices = new AddressServices();
                    const details = await addressServices.getAddressByZipCode(cleanCep);
                    if (details && !details.erro) {
                        setPersonalData(prev => ({
                            ...prev,
                            addresses: {
                                ...prev.addresses,
                                street: details.logradouro || prev.addresses.street,
                                neighborhood: details.bairro || prev.addresses.neighborhood,
                                city: details.localidade || prev.addresses.city,
                                state: details.uf || prev.addresses.state,
                                country: "Brasil"
                            }
                        }));
                    }
                } catch (e) {
                    console.error("Erro ao buscar CEP", e);
                }
            }
            return;
        } else if (field === "residence_number") {
            let r = value.replace(/\D/g, "");
            return setPersonalData((prev) => ({
                ...prev, addresses: {
                    ...prev.addresses,
                    [field]: r
                }
            }));
        }

        return setPersonalData((prev => ({
            ...prev, addresses: {
                ...prev.addresses,
                [field]: value
            }
        })));

    }

    const maskedCPF = (cpf: string) => {
        let masked_cpf = cpf.replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})/, "$1-$2")
            .replace(/(-\d{2})\d+?$/, "$1");
        handleInput("cpf", masked_cpf);
    }

    const percentage_progress = 25;
    const [mounted, setMounted] = useState<boolean>(false);
    const [ddiListDynamic, setDdiListDynamic] = useState<{ value: string, label: string }[]>(ddiList);

    useEffect(() => {
        const fetchDdis = async () => {
            try {
                const res = await fetch("https://restcountries.com/v3.1/all?fields=name,idd,translations");
                const data = await res.json();
                let countries = data.map((c: any) => {
                    const root = c.idd?.root || "";
                    const suffix = c.idd?.suffixes?.[0] || "";
                    const code = `${root}${suffix}`.replace(/[^0-9]/g, '');
                    return {
                        name: c.translations?.por?.common || c.name?.common,
                        code: code
                    };
                }).filter((c: any) => c.code !== "");

                countries.sort((a: any, b: any) => a.name.localeCompare(b.name));

                const formatted = countries.map((c: any) => ({
                    value: c.code,
                    label: `${c.name} (${c.code})`
                }));
                const uniqueFormatted = Array.from(new Map(formatted.map((item: any) => [item.label, item])).values()) as { value: string, label: string }[];

                const brasil = uniqueFormatted.find((c) => c.value === "55" && c.label.includes("Brasil"));
                const others = uniqueFormatted.filter((c) => c !== brasil);
                if (brasil) {
                    setDdiListDynamic([brasil, ...others]);
                } else {
                    setDdiListDynamic(uniqueFormatted);
                }
            } catch (e) {
                console.error("Erro ao buscar DDIs: ", e);
            }
        };
        fetchDdis();

        const timer = setTimeout(() => {
            setMounted(true);
        }, 150);

        return () => clearTimeout(timer);
    }, [])


    const animateProgress = (novo: number) => {
        while ((currentStep + 1) / 3 != novo) {
            let interval = setInterval((prev) => prev + 1, 20);
            return () => clearInterval(interval);
        }
    }

    const totalSteps = 4;

    const steps = [
        { title: "Dados Pessoais", icon: <User className="w-5 h-5" /> },
        { title: "Endereço", icon: <House className="w-5 h-5" /> },
        { title: "Contato", icon: <Phone className="w-5 h-5" /> },
        { title: "Acesso", icon: <Lock className="w-5 h-5" /> }
    ];

    const verifyStep = () => {
        let formErrors: Record<string, any> = {}

        if (currentStep === 0) {
            if (!personalData.name) formErrors.name = "Nome é obrigatório";
            if (!personalData.birth_date) formErrors.birth_date = "Data de nascimento é obrigatória";
            if (!personalData.cpf) formErrors.cpf = "CPF é obrigatório";
            if (!personalData.gender) formErrors.gender = "Gênero é obrigatório";
            if (!personalData.is_pcd) formErrors.is_pcd = "PCD é obrigatório";
            if (personalData.is_pcd === "true" && personalData.pcd_type === "") {
                formErrors.pcd_type = "Tipo de PCD é obrigatório";
            }
            if (!personalData.personal_income && personalData.personal_income !== 0) formErrors.personal_income = "Renda pessoal é obrigatória";
            if (!personalData.family_income && personalData.family_income !== 0) formErrors.family_income = "Renda familiar é obrigatória";
            if (!personalData.fathers_name) formErrors.fathers_name = "Nome do pai é obrigatório";
            if (!personalData.mothers_name) formErrors.mothers_name = "Nome da mãe é obrigatório";
            if (!personalData.number_parents_in_home && personalData.number_parents_in_home !== 0) formErrors.number_parents_in_home = "Campo obrigatório";
            if (!personalData.educationLevel) formErrors.educationLevel = "Nível de escolaridade é obrigatório";
            if (!personalData.institution) formErrors.institution = "Instituição é obrigatória";
            if (!personalData.course) formErrors.course = "Curso é obrigatório";
            if (!personalData.job_status) formErrors.job_status = "Status de emprego é obrigatório";
            if (!personalData.where_study_secondary_school) formErrors.where_study_secondary_school = "Local de estudo é obrigatório";
        } else if (currentStep === 1) {
            const addressErrors: any = {};
            if (!personalData.addresses.zipCode) addressErrors.zipCode = "CEP é obrigatório";
            if (!personalData.addresses.residence_number) addressErrors.residence_number = "Número é obrigatório";
            if (!personalData.addresses.street) addressErrors.street = "Rua é obrigatória";
            if (!personalData.addresses.neighborhood) addressErrors.neighborhood = "Bairro é obrigatório";
            if (!personalData.addresses.city) addressErrors.city = "Cidade é obrigatória";
            if (!personalData.addresses.state) addressErrors.state = "Estado é obrigatório";
            if (!personalData.addresses.country) addressErrors.country = "País é obrigatório";
            if (Object.keys(addressErrors).length > 0) formErrors.addresses = addressErrors;
        } else if (currentStep === 2) {
            const phoneErrors: any = {};
            if (!personalData.phones.ddi) phoneErrors.ddi = "DDI é obrigatório";
            if (!personalData.phones.ddd) phoneErrors.ddd = "DDD é obrigatório";
            if (!personalData.phones.number) phoneErrors.number = "Número é obrigatório";
            if (Object.keys(phoneErrors).length > 0) formErrors.phones = phoneErrors;
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    }

    const verifyStepOld = () => {

        let formErrors: Record<string, any> = {}

        if (currentStep === 0) {
            if (!personalData.name) {
                formErrors.name = "Nome é obrigatório";
            }
            if (!personalData.birth_date) {
                formErrors.birth_date = "Data de nascimento é obrigatória";
            } if (!personalData.cpf) {
                formErrors.cpf = "CPF é obrigatório";
            } if (!personalData.gender) {
                formErrors.gender = "Gênero é obrigatório";
            } if (!personalData.is_pcd) {
                formErrors.is_pcd = "PCD é obrigatório";
            } if (personalData.is_pcd && !personalData.pcd_type) {
                formErrors.pcd_type = "Tipo de PCD é obrigatório";
            } if (!personalData.personal_income) {
                formErrors.personal_income = "Renda pessoal é obrigatória";
            } if (!personalData.family_income) {
                formErrors.family_income = "Renda familiar é obrigatória";
            } if (!personalData.fathers_name) {
                formErrors.fathers_name = "Nome dos pai é obrigatório";

            } if (!personalData.mothers_name) {
                formErrors.mothers_name = "Nome da mãe é obrigatório";
            }
            if (!personalData.number_parents_in_home) {
                formErrors.number_parents_in_home = "Número de pais em casa é obrigatório";
            }
            if (!personalData.educationLevel) {
                formErrors.educationLevel = "Nível de escolaridade é obrigatório";
            } if (!personalData.institution) {
                formErrors.institution = "Instituição é obrigatória";
            } if (!personalData.course) {
                formErrors.course = "Curso é obrigatório";
            } if (!personalData.job_status) {
                formErrors.job_status = "Status de emprego é obrigatório";
            } if (!personalData.where_study_secondary_school) {
                formErrors.where_study_secondary_school = "Local de estudo é obrigatório";
            }
        } else if (currentStep === 1) {
            formErrors.addresses = {};
            if (!personalData?.addresses?.zipCode) formErrors.addresses.zipCode = "CEP é obrigatório";
            if (!personalData.addresses.residence_number) formErrors.addresses.residence_number = "Número é obrigatório";
            if (!personalData.addresses.street) formErrors.addresses.street = "Rua é obrigatório";
            if (!personalData.addresses.neighborhood) formErrors.addresses.neighborhood = "Bairro é obrigatório";
            if (!personalData.addresses.state) formErrors.addresses.state = "Estado é obrigatório";
            if (!personalData.addresses.country) formErrors.addresses.country = "País é obrigatório";
            if (!personalData.addresses.city) formErrors.addresses.city = "Cidade é obrigatório";
        } else if (currentStep === 2) {
            formErrors.phones = {};
            if (!personalData.phones.ddd) formErrors.phones.ddd = "DDD é obrigatório";
            if (!personalData.phones.number) formErrors.phones.number = "Número é obrigatório";
        }

        setErrors(formErrors);
        return Object.entries(formErrors).length === 0
    }

    const handleNextStep = () => {
        setServerError(null);
        if (verifyStep()) {
            if (currentStep !== 3) {
                setCurrentStep(prev => prev + 1);
            } else {
                const { confirm_password, mothers_name, fathers_name, ...rest } = personalData;
                const payload = {
                    ...rest,
                    gender: personalData.gender,
                    mother_name: mothers_name,
                    father_name: fathers_name,
                    is_pcd: personalData.is_pcd === "true" ? "YES" : "NO",
                    birth_date: personalData.birth_date,
                    personal_income: Number(personalData.personal_income),
                    family_income: Number(personalData.family_income),
                    number_parents_in_home: Number(personalData.number_parents_in_home)
                };

                AuthServices.register(payload).then(res => {
                    console.log("Registrado com sucesso", res);
                    window.location.href = "/auth/login";
                }).catch(err => {
                    console.error("Erro no registro", err);
                    setServerError(err?.response?.data?.message || "Erro inesperado ao realizar cadastro.");
                    if (err?.response?.data?.error) {
                        setServerError(`${err.response.data.message}: ${Array.isArray(err.response.data.error) ? err.response.data.error.join(', ') : err.response.data.error}`);
                    }
                });
            }
        }
    }

    // const forms = [{key : 0, inputs : ["Nome","Email","CPF"]},{key : 1, inputs : []}]

    const inputs = [
        { label: "Nome", refer: "name", type: "string" },
        { label: "CPF", refer: "cpf", type: "string" },
        { label: "DATA DE NASCIMENTO", refer: "birth_date", type: "date" },
        { label: "Gênero", refer: "gender", type: "select", values: ["Masculino", "Feminino"] },
        { label: "PCD", referer: "pcd", type: "select", values: ["SIM", "NÃO"] },
        { label: "Renda Pessoal", refer: "personal_income", type: "text" },
        { label: "Renda " }
    ]

    return (
        <div className="min-h-screen py-8 flex justify-center items-center bg-background p-4">
            <Card className={`w-full max-w-3xl shadow-xl border-none transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <CardHeader className="p-4 md:p-8 pb-0">
                    {/* Status Bar Refinada */}
                    <div className="w-full space-y-4 p-4 md:p-6 bg-card rounded-xl border border-border shadow-sm">
                        {serverError && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300 mb-4">
                                <p className="text-xs text-red-600 font-bold flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {serverError}
                                </p>
                            </div>
                        )}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {steps.map((step, index) => {
                                const isActive = currentStep === index;
                                const isCompleted = currentStep > index;
                                return (
                                    <div key={index} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${isActive ? 'bg-[#FF9200] text-white shadow-md' : isCompleted ? 'bg-primary/10 text-[#00438A]' : 'bg-muted text-muted-foreground/60 opacity-60'}`}>
                                        <span className="text-sm">{isCompleted ? '✓' : step.icon}</span>
                                        <span className={`text-[11px] font-bold uppercase tracking-tight ${isActive ? 'block' : 'hidden lg:block'}`}>
                                            {step.title}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="relative pt-2">
                            <div className="flex items-center justify-between mb-1 px-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Progresso</span>
                                <span className="text-[10px] font-bold text-[#00438A]">{Math.round((1 + currentStep) * percentage_progress)}%</span>
                            </div>
                            <Progress className="h-1.5 transition-all duration-700" value={(1 + currentStep) * percentage_progress} />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4 md:p-8">
                    {/* ETAPA 0: INFORMAÇÕES PESSOAIS (TODOS OS CAMPOS) */}
                    {currentStep === 0 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className={`text-xs font-bold uppercase ${errors?.name ? 'text-red-500' : 'text-muted-foreground'}`}>Nome</label>
                                    <Input value={personalData?.name} onChange={(e) => handleInput("name", e.target.value)} className="bg-muted/50" />
                                    {errors?.name && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className={`text-xs font-bold uppercase ${errors?.cpf ? 'text-red-500' : 'text-muted-foreground'}`}>CPF</label>
                                    <Input value={personalData?.cpf} onChange={(e) => maskedCPF(e.target.value)} className="bg-muted/50" />
                                    {errors?.cpf && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Data de Nascimento</label>
                                    <Input type="date" value={personalData?.birth_date} onChange={(e) => handleInput("birth_date", e.target.value)} className="bg-muted/50" />
                                    {errors?.birth_date && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Gênero</label>
                                    <Select value={personalData?.gender} onValueChange={(e) => handleInput("gender", e)}>
                                        <SelectTrigger className="bg-muted/50 w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MASCULINO">Masculino</SelectItem>
                                            <SelectItem value="FEMININO">Feminino</SelectItem>
                                            <SelectItem value="OUTRO">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors?.gender && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">PCD</label>
                                    <Select value={personalData?.is_pcd} onValueChange={(e) => handleInput("is_pcd", e)}>
                                        <SelectTrigger className="bg-muted/50 w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Sim</SelectItem>
                                            <SelectItem value="false">Não</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.is_pcd && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}

                                </div>
                                <div className="space-y-1 animate-in zoom-in-95">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Tipo de Deficiência</label>
                                    <Select disabled={personalData?.is_pcd !== "true"} value={personalData?.pcd_type} onValueChange={(e) => handleInput("pcd_type", e)}>
                                        <SelectTrigger className="bg-muted/50 w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PHYSICAL">Física</SelectItem>
                                            <SelectItem value="VISUAL">Visual</SelectItem>
                                            <SelectItem value="AUDITORY">Auditiva</SelectItem>
                                            <SelectItem value="MENTAL">Mental/Intelectual</SelectItem>
                                            <SelectItem value="DEAFNESS">Surdez</SelectItem>
                                            <SelectItem value="MULTIPLE">Múltipla</SelectItem>
                                            <SelectItem value="OTHER">Outra</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.pcd_type && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Renda Pessoal</label>
                                    <Input value={personalData?.personal_income} onChange={(e) => handleInput("personal_income", e.target.value)} className="bg-muted/50" />
                                    {errors?.personal_income && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Renda Familiar</label>
                                    <Input value={personalData?.family_income} onChange={(e) => handleInput("family_income", e.target.value)} className="bg-muted/50" />
                                    {errors?.family_income && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Nome do Pai</label>
                                    <Input value={personalData?.fathers_name} onChange={(e) => handleInput("fathers_name", e.target.value)} className="bg-muted/50" />
                                    {errors?.fathers_name && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Nome da Mãe</label>
                                    <Input value={personalData?.mothers_name} onChange={(e) => handleInput("mothers_name", e.target.value)} className="bg-muted/50" />
                                    {errors?.mothers_name && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Pessoas em Casa</label>
                                    <Input value={personalData?.number_parents_in_home} onChange={(e) => handleInput("number_parents_in_home", e.target.value)} className="bg-muted/50" />
                                    {errors?.number_parents_in_home && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Escolaridade</label>
                                    <Select value={personalData?.educationLevel} onValueChange={(e) => handleInput("educationLevel", e)}>
                                        <SelectTrigger className="bg-muted/50 w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={EDUCATION_LEVEL.Education_Level_1}>Fundamental Incompleto</SelectItem>
                                            <SelectItem value={EDUCATION_LEVEL.Education_Level_2}>Fundamental Completo</SelectItem>
                                            <SelectItem value={EDUCATION_LEVEL.Education_Level_3}>Médio Incompleto</SelectItem>
                                            <SelectItem value={EDUCATION_LEVEL.Education_Level_4}>Médio Completo</SelectItem>
                                            <SelectItem value={EDUCATION_LEVEL.Education_Level_5}>Superior Incompleto</SelectItem>
                                            <SelectItem value={EDUCATION_LEVEL.Education_Level_6}>Superior Completo</SelectItem>
                                            <SelectItem value={EDUCATION_LEVEL.OUTRO}>Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors?.educationLevel && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Instituição</label>
                                    <Input value={personalData?.institution} onChange={(e) => handleInput("institution", e.target.value)} className="bg-muted/50" />
                                    {errors?.institution && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Curso</label>
                                    <Input value={personalData?.course} onChange={(e) => handleInput("course", e.target.value)} className="bg-muted/50" />
                                    {errors?.course && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Status Emprego</label>
                                    <Select value={personalData?.job_status} onValueChange={(e) => handleInput("job_status", e)}>
                                        <SelectTrigger className="bg-muted/50 w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="employed">Empregado</SelectItem>
                                            <SelectItem value="unemployed">Desempregado</SelectItem>
                                            <SelectItem value="student">Estudante</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors?.job_status && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Onde cursou o E.M.</label>
                                    <Input value={personalData?.where_study_secondary_school} onChange={(e) => handleInput("where_study_secondary_school", e.target.value)} className="bg-muted/50" />
                                    {errors?.where_study_secondary_school && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                            </div>

                            <Button onClick={handleNextStep} className=" cursor-pointer w-full h-12 font-bold text-white bg-gradient-to-r from-[#FF9200] to-[#ffb700] hover:shadow-lg transition-all active:scale-[0.98]">
                                Próximo Passo
                            </Button>
                        </div>
                    )}

                    {/* ETAPA 1: ENDEREÇO */}
                    {currentStep === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">CEP</label>
                                    <Input maxLength={9} value={personalData.addresses.zipCode} onChange={(e) => handleInputAddress("zipCode", e.target.value)} className="bg-muted/50" />
                                    {errors?.addresses?.zipCode && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Número</label>
                                    <Input value={personalData.addresses.residence_number} onChange={(e) => handleInputAddress("residence_number", e.target.value)} className="bg-muted/50" />
                                    {errors?.addresses?.residence_number && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Rua</label>
                                    <Input value={personalData.addresses.street} onChange={(e) => handleInputAddress("street", e.target.value)} className="bg-muted/50" />
                                    {errors?.addresses?.street && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Complemento</label>
                                    <Input value={personalData.addresses.complement} onChange={(e) => handleInputAddress("complement", e.target.value)} className="bg-muted/50" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b pb-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Bairro</label>
                                    <Input value={personalData.addresses.neighborhood} onChange={(e) => handleInputAddress("neighborhood", e.target.value)} className="bg-muted/50" />
                                    {errors?.addresses?.neighborhood && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Cidade</label>
                                    <Input value={personalData.addresses.city} onChange={(e) => handleInputAddress("city", e.target.value)} className="bg-muted/50" />
                                    {errors?.addresses?.city && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Obrigatório</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Estado</label>
                                    <Input value={personalData.addresses.state} onChange={(e) => handleInputAddress("state", e.target.value)} className="bg-muted/50" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">País</label>
                                    <Input value={personalData.addresses.country} onChange={(e) => handleInputAddress("country", e.target.value)} className="bg-muted/50" />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-3">
                                <Button variant="outline" className=" cursor-pointer flex-1 font-bold border-border" onClick={() => setCurrentStep(prev => prev - 1)}>Voltar</Button>
                                <Button onClick={handleNextStep} className=" cursor-pointer flex-1 h-11 font-bold text-white bg-[#00438A] hover:bg-[#00356d]">Próximo Passo</Button>
                            </div>
                        </div>
                    )}

                    {/* ETAPAS 2 e 3 (CONTATO E ACESSO) */}
                    {(currentStep === 2 || currentStep === 3) && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            {currentStep === 2 ? (
                                <>
                                    <div className="space-y-1">
                                        <label className={`text-xs font-bold uppercase ${errors?.phones?.ddi ? 'text-red-500' : 'text-muted-foreground'}`}>DDI</label>
                                        <Select value={personalData?.phones.ddi || ""} onValueChange={(e) => handleInputPhone("ddi", e)}>
                                            <SelectTrigger className="bg-muted/50 w-full"><SelectValue placeholder="Selecione o DDI" /></SelectTrigger>
                                            <SelectContent>
                                                {ddiListDynamic.map(ddi => (
                                                    <SelectItem key={ddi.label} value={ddi.value}>{ddi.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className={`text-xs font-bold uppercase ${errors?.phones?.ddd ? 'text-red-500' : 'text-muted-foreground'}`}>DDD</label>
                                        {personalData?.phones.ddi === "55" || !personalData?.phones.ddi ? (
                                            <Select value={personalData?.phones.ddd || ""} onValueChange={(e) => handleInputPhone("ddd", e)}>
                                                <SelectTrigger className="bg-muted/50 w-full"><SelectValue placeholder="Selecione o DDD" /></SelectTrigger>
                                                <SelectContent>
                                                    {dddList.map(ddd => (
                                                        <SelectItem key={ddd.value} value={ddd.value}>{ddd.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Input value={personalData?.phones.ddd || ""} onChange={(e) => handleInputPhone("ddd", e.target.value.replace(/\D/g, '').substring(0, 4))} className="bg-muted/50" placeholder="Cód. Área" />
                                        )}
                                    </div>
                                    <div className="space-y-1 border-b pb-6">
                                        <label className={`text-xs font-bold uppercase ${errors?.phones?.number ? 'text-red-500' : 'text-muted-foreground'}`}>Número</label>
                                        <Input value={personalData?.phones.number} onChange={(e) => {
                                            let v = e.target.value.replace(/\D/g, "");
                                            v = v.substring(0, 9);
                                            if (v.length > 5) {
                                                v = v.replace(/^(\d{5})(\d{1,4}).*/, "$1-$2");
                                            } else if (v.length > 4 && v.length <= 5) {
                                                v = v.replace(/^(\d{4})(\d{1}).*/, "$1-$2");
                                            }
                                            handleInputPhone("number", v);
                                        }} className="bg-muted/50" placeholder="XXXXX-XXXX" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">E-mail</label>
                                        <Input value={personalData?.email} onChange={(e) => handleInput("email", e.target.value)} className="bg-muted/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Senha</label>
                                        <Input type="password" value={personalData?.password} onChange={(e) => handleInput("password", e.target.value)} className="bg-muted/50" />
                                    </div>
                                    <div className="space-y-1 border-b pb-6">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Confirmar Senha</label>
                                        <Input type="password" value={personalData?.confirm_password} onChange={(e) => handleInput("confirm_password", e.target.value)} className="bg-muted/50" />
                                    </div>
                                </>
                            )}
                            <div className="flex flex-col md:flex-row gap-3">
                                <Button variant="outline" className=" cursor-pointer flex-1 font-bold border-border" onClick={() => setCurrentStep(prev => prev - 1)}>Voltar</Button>
                                <Button onClick={handleNextStep} className=" cursor-pointer flex-1 h-11 font-bold text-white bg-gradient-to-r from-[#FF9200] to-[#ffb700]">{currentStep === 3 ? 'Finalizar' : 'Próximo'}</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
