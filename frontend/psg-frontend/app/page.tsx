'use client'

import Image from "next/image";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay"
import { motion } from "framer-motion";
import { ArrowRight, Info, CheckCircle, GraduationCap, Map, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};



const sections = [
  {
    id: "como-funciona",
    title: "Como funciona o PSG?",
    icon: Info,
    imgLink: "https://psg.se.senac.br/img/como-funciona.jpg",
    description: "Firmado em 22 de julho de 2008 entre o Ministério da Educação, o Ministério do Trabalho, o Ministério da Fazenda, a Confederação Nacional do Comércio de Bens, Serviços e Turismo – CNC e o Senac, e ratificado pelo Decreto nº 6.633, de 5 de novembro de 2008 , o Programa Senac de Gratuidade – PSG tem por objetivo garantir o acesso à educação profissional de qualidade para pessoas cuja renda familiar mensal per capita não ultrapasse dois salários mínimos. Pelo acordo celebrado, o Senac investe, desde 2014, 66,67% de sua Receita Líquida de Contribuição nesse importante programa de educação inclusiva."
  },
  {
    id: "regulamento",
    title: "Regulamento",
    icon: FileText,
    imgLink: "https://psg.se.senac.br/img/regulamento-img.jpg",
    description: "Conheça as formas de divulgação, inscrição e matrícula no PSG, tipos da oferta de educação profissional, metodologia do cálculo do gasto médio aluno/hora-aula, contabilização da gratuidade, regras para elaboração do plano de aplicação e retificativo, formas de registro dos dados da produção e indicadores utilizados no processo de avaliação das pesquisas.",
  },
  {
    id: "inscricao",
    title: "Como faço para me inscrever?",
    icon: GraduationCap,
    imgLink: "https://psg.se.senac.br/img/como-se-inscrever.jpg",
    description: "O ingresso nos cursos do PSG se dá por ordem de inscrição do candidato. Portanto acompanhe a divulgação dos cursos e programações do Senac de seu estado e conheça a oferta de vagas gratuitas em unidades mais próximas. Para realizar a sua inscrição você deve estar atento a documentação necessária, segundo o curso escolhido. Fique atento! A não apresentação de quaisquer dos documentos exigidos, importará no cancelamento da inscrição.",
    redirectButtonName: "Ver Cursos Disponíveis",
    redirectButton: "/cursos"
  },
  {
    id: "calculo",
    title: "Como é feito o cálculo?",
    icon: Map,
    imgLink: "https://www.se.senac.br/psg/wp-content/uploads/2023/08/psg-ver4-715x1024.jpg",
    subtext: [
      {
        subtitle: "Gasto Total Líquido por tipo de ensino e curso",
        text: "O gasto total líquido é o somatório das despesas correntes executadas no período (deduzidas os encargos regulamentares, como a retenção da Secretaria da Receita Federal e a contribuição ao sistema confederativo do Comércio, responsável pela administração superior do Senac) e as despesas de capital, ou seja, investimentos feitos no mesmo período."
      },
      {
        subtitle: "Carga Horária Efetiva por tipo de ensino e curso",
        text: "Chamamos de Carga Horária Efetiva (CHE) a quantidade de horas-aulas ministradas por aluno nos tipos de ensino e curso. Apenas no caso do tipo de curso Aprendizagem Profissional (qualificação ou habilitação técnica), para fins de cálculo da CHE, são consideradas as horas gastas na formação educacional mais 100 horas da prática profissional na empresa."
      },
      {
        subtitle: "Atualização da Oferta",
        text: "Para fins de planejamento da Oferta, o compromisso financeiro com a gratuidade é convertido em carga horária, dado o valor do GMAHA por tipo de ensino e tipo de curso. A previsão da oferta se dá em dois momentos: Plano de Aplicação e Retificativo Plano de Aplicação."
      }
    ],
  }
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden" ref={containerRef}>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[100vh] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl animate-float z-0" style={{ animationDelay: "2s" }} />
      </div>

      <HeroCarousel />

      {/* Main Content Sections */}
      <main className="container mx-auto px-4 py-24 space-y-32">
        {sections.map((s, index) => {
          const isReversed = index % 2 !== 0;
          return (
            <section
              id={s.id}
              key={s.id}
              className="relative"
            >
              <div className={cn(
                "flex flex-col gap-12 lg:gap-20 items-center justify-between",
                isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
              )}>

                {/* Image Side */}
                <motion.div
                  initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mt-18 w-full lg:w-[50%] relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl card-elevated aspect-[2/3] md:aspect-[3/4] lg:aspect-[4/5] w-full max-w-2xl mx-auto">
                    <Image
                      className="object-cover object-center w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                      src={s.imgLink}
                      alt={s.title}
                      fill
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                      <s.icon className="w-12 h-12 text-white opacity-80" />
                    </div>
                  </div>
                </motion.div>

                {/* Text Side */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="w-full lg:w-[40%] space-y-8"
                >
                  <motion.div variants={fadeIn} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary uppercase text-xs font-bold tracking-wider">
                    <s.icon className="w-4 h-4" />
                    <span>Informação</span>
                  </motion.div>

                  <motion.h2 variants={fadeIn} className="font-extrabold text-4xl md:text-5xl leading-tight text-foreground">
                    {s.title}
                    <div className="h-1.5 w-20 bg-secondary mt-6 rounded-full" />
                  </motion.h2>

                  {s.description && (
                    <motion.p variants={fadeIn} className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                      {s.description}
                    </motion.p>
                  )}

                  {s.subtext && (
                    <div className="space-y-6 pt-4">
                      {s.subtext.map((item, idx) => (
                        <motion.div
                          key={idx}
                          variants={fadeIn}
                          className="flex gap-4 items-start p-4 rounded-xl hover:bg-muted/50 transition-colors duration-300"
                        >
                          <div className="mt-1 flex-shrink-0 text-secondary">
                            <CheckCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-[1.3rem] text-foreground mb-2">
                              {item.subtitle}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {item.text}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {s.redirectButtonName && (
                    <motion.div variants={fadeIn} className="pt-6">
                      <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 py-6 group gap-2 shadow-lg">
                        <Link href={s.redirectButton!}>
                          {s.redirectButtonName}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </motion.div>
                  )}
                </motion.div>

              </div>
            </section>
          )
        })}
      </main>

    </div>
  );
}
