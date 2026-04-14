"use client";

import { useEffect, useState, use, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  CreditCard,
  Calendar,
  Wallet,
  Users,
  ChevronLeft,
  Send,
  ArrowLeft,
  GraduationCap,
  X,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  Search,
  Check,
  Lock,
  Cookie,
  CircleCheck
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from 'next/link';
import api from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { CookieConsent } from '@/components/CookieConsent';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  minAge: number;
}

export default function RegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isCookieOpen, setIsCookieOpen] = useState(false);
  const [hasReadPolicy, setHasReadPolicy] = useState(false);
  
  const [policies, setPolicies] = useState({
    privacy: { text: '', updatedAt: '' },
    cookie: { text: '', updatedAt: '' }
  });

  const SALARIO_MINIMO = 1412.00;
  const [isAgeErrorOpen, setIsAgeErrorOpen] = useState(false);
  const [isIncomeErrorOpen, setIsIncomeErrorOpen] = useState(false);
  const [rendaPerCapita, setRendaPerCapita] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    dataNascimento: '',
    rendaFamiliar: '',
    quantidadePessoas: '',
    ddi: '+55',
    ddd: '',
    celular: ''
  });

  const [ddis, setDdis] = useState<{ label: string, value: string, flag: string }[]>([]);
  const [ddds, setDdds] = useState<{ label: string, value: string }[]>([]);
  const [ddiOpen, setDdiOpen] = useState(false);
  const [dddOpen, setDddOpen] = useState(false);
  const[subscriptionConfirm,setSubscriptionConfirm] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/course/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDdis = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,flags');
        const data = await response.json();
        const formattedDdis = data
          .filter((country: any) => country.idd.root)
          .map((country: any) => ({
            label: `${country.name.common} (${country.idd.root}${country.idd.suffixes?.[0] || ''})`,
            value: `${country.idd.root}${country.idd.suffixes?.[0] || ''}`,
            flag: country.flags.svg
          }))
          .sort((a: any, b: any) => a.label.localeCompare(b.label));
        
        // Add Brazil to the top if found
        const brazil = formattedDdis.find((c: any) => c.value === '+55');
        const otherCountries = formattedDdis.filter((c: any) => c.value !== '+55');
        setDdis(brazil ? [brazil, ...otherCountries] : formattedDdis);
      } catch (error) {
        console.error('Error fetching DDIs:', error);
      }
    };

    const fetchDdds = () => {
      // List of Brazilian DDDs (simplified as IBGE doesn't have a direct list of "codes")
      const list = [
        '11', '12', '13', '14', '15', '16', '17', '18', '19',
        '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38',
        '41', '42', '43', '44', '45', '46', '47', '48', '49',
        '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69',
        '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89',
        '91', '92', '93', '94', '95', '96', '97', '98', '99'
      ].map(d => ({ label: `(${d})`, value: d }));
      setDdds(list);
    };

    const fetchPolicies = async () => {
      try {
        const response = await api.get('/configuration/policies');
        const data = response.data;
        setPolicies({
          privacy: data.privacy_policy,
          cookie: data.cookie_policy
        });

        // Check if Cookie Policy should be shown
        const lastCookieAccepted = localStorage.getItem('cookie_policy_accepted');
        if (!lastCookieAccepted || new Date(lastCookieAccepted) < new Date(data.cookie_policy.updatedAt)) {
          setIsCookieOpen(true);
        }
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };

    fetchCourse();
    fetchDdis();
    fetchDdds();
    fetchPolicies();
  }, [id]);

  useEffect(() => {
    const renda = parseFloat(formData.rendaFamiliar) || 0;
    const pessoas = parseInt(formData.quantidadePessoas) || 1;
    setRendaPerCapita(renda / (pessoas || 1));
  }, [formData.rendaFamiliar, formData.quantidadePessoas]);

  const applyCPFMask = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const validateCPF = (cpf: string) => {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleanCpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false;

    return true;
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleAcceptCookie = (categories: string[]) => {
    localStorage.setItem('cookie_policy_accepted', new Date().toISOString());
    localStorage.setItem('cookie_categories', JSON.stringify(categories));
    setIsCookieOpen(false);
  };

  const handleAcceptPrivacy = async () => {
    localStorage.setItem('privacy_policy_accepted', new Date().toISOString());
    setIsPolicyOpen(false);
    await handleConfirmRegistration();
  };

  const validateForm = () => {
    if (!formData.nome || !formData.email || !formData.cpf || !formData.dataNascimento || !formData.rendaFamiliar || !formData.quantidadePessoas || !formData.celular) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return false;
    }

    // CPF validation
    const cleanCpf = formData.cpf.replace(/\D/g, '');
    if (!validateCPF(cleanCpf)) {
      toast.error('CPF inválido - Verifique os dígitos informados');
      return false;
    }

    // Age validation
    const userAge = calculateAge(formData.dataNascimento);
    if (course && userAge < course.minAge) {
      setIsAgeErrorOpen(true);
      return false;
    }

    // Income validation
    if (rendaPerCapita > (SALARIO_MINIMO * 2)) {
      setIsIncomeErrorOpen(true);
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Only show privacy policy if not accepted or if a new version is available
    const lastAccepted = localStorage.getItem('privacy_policy_accepted');
    if (lastAccepted && policies.privacy.updatedAt && new Date(lastAccepted) >= new Date(policies.privacy.updatedAt)) {
      handleConfirmRegistration();
    } else {
      setIsPolicyOpen(true);
    }
  };

  const handleConfirmRegistration = async () => {
    setLoading(true);
    try {
      // Real backend integration
      const registrationData = {
        name: formData.nome,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ''),
        birth_date: formData.dataNascimento,
        family_income: parseFloat(formData.rendaFamiliar),
        number_parents_in_home: parseInt(formData.quantidadePessoas),
        full_phone: `${formData.ddi} ${formData.ddd ? `(${formData.ddd})` : ''} ${formData.celular}`,
        course_id: id
      };

      await api.post('/subscription/public', registrationData);

      setSubscriptionConfirm(true);
      toast.success('Inscrição enviada com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao processar sua inscrição. Tente novamente.';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // If user scrolls to 95% of the content
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setHasReadPolicy(true);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      setFormData(prev => ({ ...prev, [name]: applyCPFMask(value) }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <CookieConsent 
        isOpen={isCookieOpen} 
        onAccept={handleAcceptCookie} 
        policyText={policies.cookie.text} 
      />
      {/* Header Senac */}
      <div className="bg-white shadow-sm border-b mb-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4">
            <img
              src="https://fabianocage.com.br/senacse/wp-content/uploads/2026/02/logo-negativo-vertical.svg"
              alt="Senac"
              className="h-12 w-auto"
            />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900">Programa Senac de Gratuidade</h1>
              <p className="text-slate-600">Inscrição para Cursos Gratuitos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <Link href={`/cursos/${id}`} className="inline-flex items-center text-primary font-bold hover:underline mb-12 transition-all group text-sm uppercase tracking-widest">
          <ArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" size={18} />
          Voltar para o curso
        </Link>
        {subscriptionConfirm ? 
          <motion.div
           initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className='h-[30vh] flex justify-center items-center'>
                <div className='space-y-3'>
                  <p className='font-bold text-2xl uppercase'>Inscrição Confirmada</p>
                  <motion.div className='w-auto h-[6.5rem]'
                    initial={{rotateZ : "-0.25rad", y : 0}}
                    animate={{rotateZ: "0rad", y: 15 }}
                    exit={{rotateZ: "0rad", y: 0 }}
                    transition={{duration : 0.15, delay : 0.5}}
                  >
                    <CircleCheck className='w-full h-full text-green-500'/>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        
          :
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <Badge className="mb-4 px-4 py-1.5 bg-primary text-white border-none text-sm font-bold tracking-widest uppercase">
                Formulário de Inscrição
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-slate-900">
                {course?.title || 'Curso Selecionado'}
              </h1>
              <p className="text-muted-foreground font-medium text-lg">
                Preencha os dados abaixo para realizar sua inscrição no Programa Senac de Gratuidade.
              </p>
            </div>

            <Card className="p-8 border border-slate-200 bg-white shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Dados Pessoais */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">Dados Pessoais</h2>
                  
                  <div className="space-y-2">
                    <label htmlFor="nome" className="text-sm font-semibold uppercase tracking-widest text-slate-700">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <Input
                        id="nome"
                        name="nome"
                        placeholder="Digite seu nome completo"
                        className="pl-10 h-12 rounded-lg bg-slate-50 border-slate-300 focus:border-primary transition-all"
                        required
                        value={formData.nome}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="cpf" className="text-sm font-semibold uppercase tracking-widest text-slate-700">CPF</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <Input
                        id="cpf"
                        name="cpf"
                        placeholder="000.000.000-00"
                        className="pl-10 h-12 rounded-lg bg-slate-50 border-slate-300 focus:border-primary transition-all"
                        required
                        value={formData.cpf}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="dataNascimento" className="text-sm font-semibold uppercase tracking-widest text-slate-700">Data de Nascimento</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <Input
                        id="dataNascimento"
                        name="dataNascimento"
                        type="date"
                        className="pl-10 h-12 rounded-lg bg-slate-50 border-slate-300 focus:border-primary transition-all"
                        required
                        value={formData.dataNascimento}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                </div>

                {/* Dados de Contato */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">Dados de Contato</h2>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold uppercase tracking-widest text-slate-700">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="exemplo@email.com"
                        className="pl-10 h-12 rounded-lg bg-slate-50 border-slate-300 focus:border-primary transition-all"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-widest text-slate-700">Contato (DDI/DDD/Celular)</label>
                    <div className="flex gap-2">
                      <Popover open={ddiOpen} onOpenChange={setDdiOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={ddiOpen}
                            className="h-12 w-[100px] rounded-lg bg-slate-50 border-slate-300 justify-between px-3"
                          >
                            {formData.ddi}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0 rounded-lg border-slate-300" align="start">
                          <Command className="rounded-lg">
                            <CommandInput placeholder="Buscar país / DDI..." />
                            <CommandList className="max-h-[200px]">
                              <CommandEmpty>Nenhum DDI encontrado.</CommandEmpty>
                              <CommandGroup>
                                {ddis.map((item) => (
                                  <CommandItem
                                    key={item.label}
                                    value={item.label}
                                    onSelect={() => {
                                      setFormData(prev => ({ ...prev, ddi: item.value }));
                                      setDdiOpen(false);
                                    }}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        formData.ddi === item.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    <img src={item.flag} alt="" className="w-5 h-3 object-cover rounded" />
                                    <span className="truncate">{item.label}</span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <Popover open={dddOpen} onOpenChange={setDddOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={dddOpen}
                            className="h-12 w-[80px] rounded-lg bg-slate-50 border-slate-300 justify-between px-3"
                          >
                            {formData.ddd || 'DDD'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[120px] p-0 rounded-lg border-slate-300" align="start">
                          <Command className="rounded-lg">
                            <CommandInput placeholder="DDD" />
                            <CommandList>
                              <CommandEmpty>?</CommandEmpty>
                              <CommandGroup>
                                {ddds.map((item) => (
                                  <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={() => {
                                      setFormData(prev => ({ ...prev, ddd: item.value }));
                                      setDddOpen(false);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    {item.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <Input
                          name="celular"
                          placeholder="99999-9999"
                          className="pl-10 h-12 rounded-lg bg-slate-50 border-slate-300 focus:border-primary transition-all"
                          required
                          value={formData.celular}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            let masked = val;
                            if (val.length > 4) {
                              const split = val.length === 9 ? 5 : 4;
                              masked = `${val.slice(0, split)}-${val.slice(split, split + 4)}`;
                            }
                            setFormData(prev => ({ ...prev, celular: masked }));
                          }}
                          maxLength={10}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dados Socioeconômicos */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">Dados Socioeconômicos</h2>
                  
                  <div className="space-y-2">
                    <label htmlFor="rendaFamiliar" className="text-sm font-semibold uppercase tracking-widest text-slate-700">Renda Familiar Mensal</label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <Input
                        id="rendaFamiliar"
                        name="rendaFamiliar"
                        type="number"
                        placeholder="R$ 0,00"
                        className="pl-10 h-12 rounded-lg bg-slate-50 border-slate-300 focus:border-primary transition-all"
                        required
                        value={formData.rendaFamiliar}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="quantidadePessoas" className="text-sm font-semibold uppercase tracking-widest text-slate-700">Número de Pessoas na Residência</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <Input
                        id="quantidadePessoas"
                        name="quantidadePessoas"
                        type="number"
                        placeholder="Quantidade"
                        className="pl-10 h-12 rounded-lg bg-slate-50 border-slate-300 focus:border-primary transition-all"
                        required
                        value={formData.quantidadePessoas}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Renda Per Capita Display */}
                  <AnimatePresence>
                    {(formData.rendaFamiliar || formData.quantidadePessoas) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-primary/5 rounded-xl p-4 border border-primary/20 space-y-2"
                      >
                        <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                          <span className="flex items-center gap-2">
                            <Wallet size={14} className="text-primary" />
                            Renda Per Capita:
                          </span>
                          <span className={cn(
                            "text-lg font-bold",
                            rendaPerCapita > (SALARIO_MINIMO * 2) ? "text-red-500" : "text-primary"
                          )}>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rendaPerCapita)}
                          </span>
                        </div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                          Cálculo: Renda Familiar ÷ Pessoas {rendaPerCapita > (SALARIO_MINIMO * 2) ? "(Acima do limite PSG)" : "(Dentro do limite)"}
                        </p>
                        {rendaPerCapita > (SALARIO_MINIMO * 2) && (
                          <div className="flex items-center gap-2 text-red-600 text-xs font-semibold mt-1">
                            <X size={12} />
                            <span>Limite PSG: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(SALARIO_MINIMO * 2)}</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <Button type="submit" className="w-full h-14 bg-primary text-white font-bold text-lg rounded-lg shadow-lg hover:bg-primary/90 transition-all">
                    FINALIZAR INSCRIÇÃO
                    <Send className="ml-2" size={20} />
                  </Button>
                </div>

                <p className="text-sm text-center text-slate-600 font-medium">
                  Ao clicar em finalizar, você concorda com os termos do Programa Senac de Gratuidade.
                </p>
              </form>
            </Card>
          </motion.div>
        }
      </div>

      {/* MODAL DE POLÍTICA DE PRIVACIDADE */}
      <Dialog open={isPolicyOpen} onOpenChange={setIsPolicyOpen}>
        <DialogContent className="max-w-2xl sm:max-w-2xl rounded-lg p-0 overflow-hidden border border-slate-200 bg-white shadow-xl">
          <DialogHeader className="p-8 pb-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck size={24} />
              </div>
              <DialogTitle className="text-2xl font-bold tracking-tight uppercase text-slate-900">Política de Privacidade</DialogTitle>
            </div>
            <DialogDescription className="text-sm font-medium uppercase tracking-widest text-slate-600">
              Leia atentamente até o final para prosseguir
            </DialogDescription>
          </DialogHeader>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="p-8 max-h-[50vh] overflow-y-auto space-y-4 text-sm text-foreground/80 leading-relaxed custom-scrollbar"
          >
            <p className="font-bold text-foreground">Termos e Condições do Programa Senac de Gratuidade</p>
            <p>
              {policies.privacy.text || "Carregando política de privacidade..." }
            </p>
          </div>

          <DialogFooter className="p-8 pt-4 bg-slate-50 border-t border-slate-200 flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={() => setIsPolicyOpen(false)}
              className="h-12 rounded-lg font-semibold text-slate-700 border-slate-300 flex-1 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button
           
              onClick={handleAcceptPrivacy}
              className={`h-12 rounded-lg font-bold flex-1 transition-all ${hasReadPolicy
                  ? 'bg-primary text-white shadow-lg hover:bg-primary/90'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
            >
              {hasReadPolicy ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  Aceitar e Finalizar
                </span>
              ) : (
                'Role até o final'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL DE POLÍTICA DE COOKIES */}
      <CookieConsent 
        isOpen={isCookieOpen} 
        onAccept={handleAcceptCookie}
        policyText={policies.cookie.text}
      />

      {/* MODAL DE ERRO: IDADE INSUFICIENTE */}
      <Dialog open={isAgeErrorOpen} onOpenChange={setIsAgeErrorOpen}>
        <DialogContent className="max-w-md rounded-lg p-0 overflow-hidden border border-red-200 bg-white shadow-2xl">
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-600 animate-pulse">
              <X size={48} />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-slate-900">Idade Insuficiente</DialogTitle>
              <DialogDescription className="text-slate-600">
                Infelizmente você não possui a idade mínima necessária para este curso.
              </DialogDescription>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm">
              <p className="font-semibold text-slate-700">Requisito do Curso:</p>
              <p className="text-slate-900 text-lg font-bold">{course?.minAge} anos</p>
              <p className="font-semibold text-slate-700 mt-2">Sua Idade:</p>
              <p className="text-red-600 text-lg font-bold">{calculateAge(formData.dataNascimento)} anos</p>
            </div>
            <Button 
              onClick={() => setIsAgeErrorOpen(false)}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg"
            >
              OK, ENTENDI
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DE ERRO: RENDA ACIMA DO LIMITE */}
      <Dialog open={isIncomeErrorOpen} onOpenChange={setIsIncomeErrorOpen}>
        <DialogContent className="max-w-md rounded-lg p-0 overflow-hidden border border-orange-200 bg-white shadow-2xl">
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Wallet size={48} />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-slate-900">Renda Per Capita Excedida</DialogTitle>
              <DialogDescription className="text-slate-600">
                Sua renda per capita excede o limite permitido pelo Programa Senac de Gratuidade (PSG).
              </DialogDescription>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm">
              <p className="font-semibold text-slate-700">Sua Renda Per Capita:</p>
              <p className="text-red-600 text-lg font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rendaPerCapita)}
              </p>
              <p className="font-semibold text-slate-700 mt-2">Limite Permitido (2 Salários Mínimos):</p>
              <p className="text-slate-900 text-lg font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(SALARIO_MINIMO * 2)}
              </p>
            </div>
            <Button 
              onClick={() => setIsIncomeErrorOpen(false)}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg"
            >
              OK, ENTENDI
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
