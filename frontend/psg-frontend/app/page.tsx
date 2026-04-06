'use client'

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay"

export default function Home() {

  const sections = [
    {
      title: "Como funciona o PSG?",
      imgLink: "https://psg.se.senac.br/img/como-funciona.jpg",
      description: "Firmado em 22 de julho de 2008 entre o Ministério da Educação, o Ministério do Trabalho, o Ministério da Fazenda, a Confederação Nacional do Comércio de Bens, Serviços e Turismo – CNC e o Senac, e ratificado pelo Decreto nº 6.633, de 5 de novembro de 2008 , o Programa Senac de Gratuidade – PSG tem por objetivo garantir o acesso à educação profissional de qualidade para pessoas cuja renda familiar mensal per capita não ultrapasse dois salários mínimos. Pelo acordo celebrado, o Senac investe, desde 2014, 66,67% de sua Receita Líquida de Contribuição nesse importante programa de educação inclusiva."
    },
    {
      title: "Regulamento",
      imgLink: "https://psg.se.senac.br/img/regulamento-img.jpg",
      description: "Conheça as formas de divulgação, inscrição e matrícula no PSG, tipos da oferta de educação profissional, metodologia do cálculo do gasto médio aluno/hora-aula, contabilização da gratuidade, regras para elaboração do plano de aplicação e retificativo, formas de registro dos dados da produção e indicadores utilizados no processo de avaliação das pesquisas.Clique no botão abaixo para ler mais sobre as diretrizes.",
      redirectButtonName: "Diretrizes",
      redirectButton: "https://psg.se.senac.br/diretrizes"
    },
    {
      title: "Como faço para me inscrever?",
      imgLink: "https://psg.se.senac.br/img/como-se-inscrever.jpg",
      description: "O ingresso nos cursos do PSG se dá por ordem de inscrição do candidato. Portanto acompanhe a divulgação dos cursos e programações do Senac de seu estado e conheça a oferta de vagas gratuitas em unidades mais próximas. Para realizar a sua inscrição você deve estar atento a documentação necessária, segundo o curso escolhido.Fique atento! A não apresentação de quaisquer dos documentos exigidos, importará no cancelamento da inscrição.Clique no botão abaixo para conhecer nossos cursos!",
      redirectButtonName: "Cursos Disponíveis",
      redirectButton: "https://psg.se.senac.br/cursos"
    },
    {
      title: "Como é feito o cálculo?",
      imgLink: "https://www.se.senac.br/psg/wp-content/uploads/2023/08/psg-ver4-715x1024.jpg",
      subtext: [
        {
          subtitle: "Gasto Total Líquido por tipo de ensino e curso",
          text: "O gasto total líquido é o somatório das despesas correntes executadas no período (deduzidas os encargos regulamentares, como a retenção da Secretaria da Receita Federal e a contribuição ao sistema confederativo do Comércio, responsável pela administração superior do Senac) e as despesas de capital, ou seja, investimentos feitos no mesmo período."
        },
        {
          subtitle: "Carga Horária Efetiva por tipo de ensino e curso",
          text: "Chamamos de Carga Horária Efetiva(CHE) a quantidade de horas-aulas ministradas por aluno nos tipos de ensino e curso. Apenas no caso do tipo de curso Aprendizagem Profissional (qualificação ou habilitação técnica), para fins de cálculo da CHE, são consideradas as horas gastas na formação educacional mais 100 horas da prática profissional na empresa. Quando a prática ocorrer em ambientes laboratoriais sob a responsabilidade do Senac deverá considerar, para fins de cálculo, a carga horária total do curso, isto é, carga horária no Senac e na empresa."
        },
        {
          subtitle: "Atualização da Oferta",
          text: "Para fins de planejamento da Oferta, o compromisso financeiro com a gratuidade é convertido em carga horária, dado o valor do GMAHA por tipo de ensino e tipo de curso. A previsão da oferta se dá em dois momentos: Plano de Aplicação e Retificativo Plano de Aplicação. Além disso, os Departamentos Regionais ofertantes realizam, mensalmente, o acompanhamento das horas-aulas e executadas no âmbito do Programa Senac de Gratuidade, permitindo o acompanhamento da oferta e o cumprimento do compromisso financeiro de investir 66,67% da Receita de Contribuição Social Líquida, mais 100% das subvenções aplicadas pelos Departamentos Regionais."
        }
      ],
    }
  ];


  const cItems = [{ title: "Bem vindo(a) ao PSG", buttonName: "Cursos", buttonRedirect: "https://psg.se.senac.br/cursos", description: "Conheça o programa de gratuidade do Senac", img: "https://psg.se.senac.br/img/banner-psg-layout.jpg" }, { title: "Resultados", buttonName: "Resultados", buttonRedirect: "https://psg.se.senac.br/resultados", img: "https://psg.se.senac.br/img/resultados-slide.jpg" }, { title: "Regulamento", buttonName: "Regulamento", buttonRedirect: "", img: "https://psg.se.senac.br/img/regulamento-slide.jpg" }];

  // const [api,setApi] = useState<CarouselApi>();

  // useEffect(()=>{

  //   if(!api) return

  //   const timer = setTimeout(()=>{
  //     api.scrollNext(false);
  //   },1000)

  // },[setApi,api]);


  return (
    <div className="mb-10">
      <div className="font-sans">
        <Carousel plugins={[Autoplay({ delay: 5000 }),]} className="h-full hover:brightness-75 transition-all duration-700 ease">
          <CarouselContent className="bg-gray-900">
            {cItems.map((item, key) => (
              <CarouselItem className="relative" key={key}>
                <img
                  className="min-h-[92vh] w-full object-cover object-center"
                  alt="IMG"
                  src={item.img}
                />

                <div className="absolute top-3/4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white w-full max-w-md px-4">

                  <h2 className="text-3xl font-bold drop-shadow-lg text-center">
                    {item.title}
                  </h2>

                  {item.description && (
                    <p className="text-lg drop-shadow-md text-center">
                      {item.description}
                    </p>
                  )}

                  <a
                    href={item.buttonRedirect}
                    className="mt-2 bg-[#FF9200] px-6 py-2 rounded text-sm font-bold uppercase transition-transform hover:scale-105"
                  >
                    {item.buttonName}
                  </a>

                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </div>
      <div className="container mx-auto space-y-20 mt-10 px-4">
        {sections.map((s, key) => (
          <section
            id={s.title}
            key={key}
            className="flex flex-col md:flex-row items-start gap-10 min-h-[400px]"
          >
            <div className={`w-full md:w-1/3 ${key % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
              <img
                className="rounded-md w-full shadow-lg object-cover"
                src={s.imgLink}
                alt={s.title}
              />
            </div>

            <div className={`w-full md:w-2/3 ${key % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
              <h2 className="font-bold text-3xl border-b-4 border-[#FF9200] inline-block pb-2 mb-6">
                {s.title}
              </h2>

              {s.description && (
                <p className="text-muted-foreground leading-relaxed text-lg">{s.description}</p>
              )}

              <div className="space-y-6">
                {s.subtext?.map((item, index) => (
                  <div key={index} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="font-bold text-xl text-primary mb-2">
                      {item.subtitle}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
              {
                s?.redirectButtonName &&
                <Link href={s.redirectButton}><Button className="bg-[#FF9200] hover:bg-[#FF9200]/80 cursor-pointer mt-4 p-5 text-md">{s.redirectButtonName}</Button></Link>
              }
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
