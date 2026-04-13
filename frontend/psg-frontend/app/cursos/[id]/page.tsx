'use client';

import { useEffect, useState, use, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Clock, 
  Users, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle2, 
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  Briefcase,
  Activity,
  HelpCircle,
  ChevronDown,
  X
} from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface Category {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
  code: string;
  availablePosition: number;
  minimumEducation: string;
  img_url: string;
  description: string;
  workload: number;
  minAge: number;
  address: string;
  schooldays: string;
  targetAudience: string;
  courseStart: string;
  courseEnd: string;
  category?: Category;
}

const themeConfigs: Record<string, { primary: string, secondary: string, icon: any }> = {
  'Tecnologia da Informação': { primary: 'from-blue-600', secondary: 'to-cyan-400', icon: Zap },
  'Informática': { primary: 'from-blue-600', secondary: 'to-cyan-400', icon: Zap },
  'Gestão': { primary: 'from-orange-600', secondary: 'to-yellow-400', icon: Briefcase },
  'Saúde': { primary: 'from-emerald-600', secondary: 'to-teal-400', icon: Activity },
  'default': { primary: 'from-primary', secondary: 'to-secondary', icon: GraduationCap }
};

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { scrollY } = useScroll();

  const faqs = [
    {
      q: 'Quem pode se inscrever nos cursos do PSG?',
      a: 'O Programa Senac de Gratuidade (PSG) é destinado a pessoas de baixa renda, com renda familiar mensal per capita de até 2 salários mínimos, que estão matriculadas em cursos de educação básica da rede pública ou que tenham cursado todo o ensino médio na rede pública.'
    },
    {
      q: 'Como funciona o processo seletivo?',
      a: 'Após a inscrição, os candidatos passam por uma análise socioeconômica. Os selecionados são chamados para apresentação de documentos e confirmação da matrícula. O processo é totalmente gratuito.'
    },
    {
      q: 'Quais documentos são necessários para a matrícula?',
      a: 'são necessários: RG, CPF, comprovante de residência recente, comprovante de escolaridade (histórico escolar), comprovante de renda familiar e, se menor de 18 anos, documentação do responsável legal.'
    },
    {
      q: 'O certificado Senac é reconhecido no mercado?',
      a: 'Sim! O Senac é uma das instituições de ensino profissional mais reconhecidas do Brasil. Nosso certificado é aceito por empresas de todo o país e garante diferencial competitivo no currículo.'
    },
    {
      q: 'Posso me inscrever em mais de um curso?',
      a: 'O aluno pode se candidatar a mais de um curso, porém, somente poderá estar matriculado em um curso PSG por vez. Após a conclusão ou desligamento de um curso, é possível se inscrever em outro.'
    },
    {
      q: 'O que acontece se eu faltar às aulas?',
      a: 'A frequência mínima exigida é de 75%. Faltas não justificadas que ultrapassem esse limite podem resultar no desligamento do aluno e a vaga será redirecionada para outro candidato na lista de espera.'
    },
  ];
  
  const headerOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const headerY = useTransform(scrollY, [0, 400], [0, 100]);

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
    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground p-4 text-center">
      <h1 className="text-3xl font-bold mb-6 uppercase tracking-tight">Curso não encontrado</h1>
      <Link href="/cursos"><Button variant="outline" className="rounded-full px-8">Explorar Catálogo</Button></Link>
    </div>
  );

  const theme = themeConfigs[course.category?.title || 'default'] || themeConfigs['default'];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Cabeçalho Hero Imersivo */}
      <section className="relative h-[65vh] min-h-[500px] flex items-end pb-16 overflow-hidden">
        <motion.div 
          style={{ opacity: headerOpacity, y: headerY }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={course.img_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop"}
            className="w-full h-full object-cover"
            alt={course.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/cursos" className="inline-flex items-center text-primary font-bold hover:underline mb-8 transition-all group text-sm uppercase tracking-widest">
            <ChevronLeft className="mr-1 transition-transform group-hover:-translate-x-1" size={18} />
            Voltar
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <Badge className={`mb-6 px-4 py-1.5 bg-gradient-to-r ${theme.primary} ${theme.secondary} text-white border-none text-[10px] font-black tracking-widest uppercase shadow-lg`}>
              {course.category?.title || 'Cursos Livres'}
            </Badge>
            <h1 className="text-4xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
              {course.title}
            </h1>
            <div className="flex flex-wrap gap-8 items-center text-muted-foreground font-bold text-sm uppercase tracking-wider">
               <div className="flex items-center gap-2">
                 <Clock size={18} className="text-primary" />
                 <span>{course.workload}h Duração</span>
               </div>
               <div className="flex items-center gap-2">
                 <Users size={18} className="text-secondary" />
                 <span>{course.availablePosition} Vagas</span>
               </div>
               <div className="flex items-center gap-2">
                 <ShieldCheck size={18} className="text-emerald-500" />
                 <span>Inscrição Gratuita</span>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seções de Conteúdo Principal */}
      <main className="container mx-auto px-4 py-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Coluna Principal */}
          <div className="lg:col-span-8 space-y-20">
            {/* Seção de Descrição */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                <h2 className="text-xs font-black tracking-[0.3em] uppercase opacity-50">Sobre o Curso</h2>
              </div>

              {course.description ? (
                <div className="relative pl-6 border-l-2 border-primary/30">
                  {/* Aspas de abertura */}
                  <span className="absolute -top-2 -left-3 text-5xl font-black text-primary/20 leading-none select-none">"</span>
                  <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground/80">
                    {course.description}
                  </p>
                </div>
              ) : (
                <div className="relative pl-6 border-l-2 border-muted">
                  <p className="text-lg md:text-xl font-medium leading-relaxed text-muted-foreground italic">
                    Descrição não disponível para este curso. Entre em contato com a unidade Senac para mais informações.
                  </p>
                </div>
              )}
            </section>

            {/* Grade de Funcionalidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-muted/40 border border-border rounded-[32px] hover:bg-muted/60 transition-colors">
                <Users size={28} className="text-primary mb-6" />
                <h3 className="text-lg font-bold mb-3">Para Quem é?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {course.targetAudience || "Desenvolvido para profissionais que desejam atualizar conhecimentos ou iniciantes que buscam uma base sólida na área."}
                </p>
              </div>

              <div className="p-8 bg-muted/40 border border-border rounded-[32px] hover:bg-muted/60 transition-colors">
                <Award size={28} className="text-secondary mb-6" />
                <h3 className="text-lg font-bold mb-3">Certificação Senac</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Conclua com o selo de qualidade Senac, reconhecido nacionalmente pela excelência no ensino profissional.
                </p>
              </div>
            </div>

            {/* Seção de Requisitos */}
            <section className="p-10 bg-primary/5 dark:bg-primary/[0.03] rounded-[40px] border border-primary/10">
              <h3 className="text-2xl font-black mb-10 italic uppercase border-b border-primary/20 pb-4">Requisitos de Ingresso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-40 mb-1">Idade Mínima</p>
                    <p className="text-lg font-bold leading-none">{course.minAge} Anos</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-40 mb-1">Escolaridade</p>
                    <p className="text-lg font-bold leading-none">{course.minimumEducation}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Lateral de Chamada para Ação (CTA) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-6">
            <Card className="p-8 border-border bg-card rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />
              
              <h3 className="text-3xl font-black mb-10 italic tracking-tighter uppercase">Fazer Inscrição</h3>

              <div className="space-y-8 mb-10">
                <div className="flex gap-4 items-start">
                   <Calendar className="text-primary mt-1" size={20} />
                   <div>
                     <p className="text-[10px] font-bold uppercase opacity-40 tracking-widest">Cronograma das Aulas</p>
                     <p className="text-sm font-bold mt-1">
                       {new Date(course.courseStart).toLocaleDateString('pt-BR')} até {new Date(course.courseEnd).toLocaleDateString('pt-BR')}
                     </p>
                   </div>
                </div>

                <div className="flex gap-4 items-start">
                   <Clock className="text-primary mt-1" size={20} />
                   <div>
                     <p className="text-[10px] font-bold uppercase opacity-40 tracking-widest">Horário e Frequência</p>
                     <p className="text-sm font-bold mt-1 leading-snug">{course.schooldays}</p>
                   </div>
                </div>

                <div className="flex gap-4 items-start">
                   <MapPin className="text-primary mt-1" size={20} />
                   <div>
                     <p className="text-[10px] font-bold uppercase opacity-40 tracking-widest">Onde Estudar?</p>
                     <p className="text-sm font-bold mt-1 leading-snug">{course.address}</p>
                   </div>
                </div>
              </div>

              <Button className="w-full h-16 bg-primary text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.03] active:scale-[0.97] group">
                INSCREVER-SE
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
              </Button>
              
              <p className="mt-6 text-center text-[10px] font-bold opacity-30 uppercase tracking-widest">
                Processo Seletivo Gratuito (PSG)
              </p>
            </Card>

            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                onClick={() => setIsFaqOpen(true)}
                className="h-14 rounded-2xl font-bold text-xs uppercase tracking-widest border-border hover:bg-primary/5 hover:border-primary/40 hover:text-primary transition-all flex items-center gap-2"
              >
                <HelpCircle size={16} />
                Dúvidas Frequentes
              </Button>
            </div>

            {/* ── MODAL DE FAQ (DÚVIDAS FREQUENTES) ── */}
            <AnimatePresence>
              {isFaqOpen && (
                <>
                  {/* Fundo escurecido (Backdrop) */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsFaqOpen(false)}
                    className="fixed inset-0 bg-background/80 backdrop-blur-md z-[80]"
                  />

                  {/* Painel do Modal */}
                  <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[640px] max-h-[80vh] overflow-y-auto bg-card border border-border rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.3)] z-[90] p-8"
                  >
                    {/* Cabeçalho */}
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <HelpCircle size={20} className="text-primary" />
                          <h3 className="text-xl font-black italic tracking-tighter">DÚVIDAS FREQUENTES</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">Tudo o que você precisa saber sobre o PSG e as inscrições.</p>
                      </div>
                      <button
                        onClick={() => setIsFaqOpen(false)}
                        className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors shrink-0 ml-4"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Itens do Acordeão (FAQ) */}
                    <div className="space-y-3">
                      {faqs.map((faq, i) => (
                        <div
                          key={i}
                          className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                            openFaq === i ? 'border-primary/30 bg-primary/[0.03]' : 'border-border hover:border-border/80'
                          }`}
                        >
                          <button
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                          >
                            <span className={`text-sm font-bold leading-snug transition-colors ${
                              openFaq === i ? 'text-primary' : 'text-foreground'
                            }`}>
                              {faq.q}
                            </span>
                            <motion.div
                              animate={{ rotate: openFaq === i ? 180 : 0 }}
                              transition={{ duration: 0.25 }}
                              className="shrink-0"
                            >
                              <ChevronDown size={18} className={openFaq === i ? 'text-primary' : 'text-muted-foreground'} />
                            </motion.div>
                          </button>

                          <AnimatePresence initial={false}>
                            {openFaq === i && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                              >
                                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                                  {faq.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-border text-center">
                      <p className="text-xs text-muted-foreground">Ainda tem dúvidas? Entre em contato com a unidade Senac.</p>
                      <a href="tel:08007270700" className="inline-block mt-2 text-sm font-black text-primary hover:underline">
                        0800 727 0700 (gratuito)
                      </a>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </main>
    </div>
  );
}