'use client'

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Autoplay from "embla-carousel-autoplay"
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi 
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const carouselItems = [
  {
    title: "Bem vindo(a) ao PSG",
    subtitle: "Transformando Vidas",
    description: "Conheça o programa de gratuidade do Senac e dê o primeiro passo para o seu futuro profissional.",
    buttonName: "Explorar Cursos",
    buttonRedirect: "/cursos",
    img: "https://psg.se.senac.br/img/banner-psg-layout.jpg"
  },
  {
    title: "Resultados",
    subtitle: "Acompanhe seu Desempenho",
    description: "Confira a lista de aprovados e os próximos passos para sua matrícula.",
    buttonName: "Ver Resultados",
    buttonRedirect: "/resultados",
    img: "https://psg.se.senac.br/img/resultados-slide.jpg"
  },
  {
    title: "Regulamento",
    subtitle: "Transparência e Regras",
    description: "Fique por dentro de todas as regras, normas e diretrizes que regem o nosso programa de bolsas.",
    buttonName: "Ler Regulamento",
    buttonRedirect: "/diretrizes",
    img: "https://psg.se.senac.br/img/regulamento-slide.jpg"
  }
]

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  
  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false })
  )

  React.useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden group/carousel">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full h-[70vh] md:h-[80vh]"
        opts={{
          loop: true,
          duration: 30,
        }}
      >
        <CarouselContent className="h-[70vh] md:h-[80vh] ml-0">
          {carouselItems.map((item, index) => (
            <CarouselItem key={index} className="relative h-[70vh] md:h-[80vh] pl-0">
              <div className="relative w-full h-full overflow-hidden">
                {/* Background Image with Ken Burns Effect */}
                <motion.div
                  initial={{ scale: 1.05 }}
                  animate={{ scale: current === index ? 1 : 1.05 }}
                  transition={{ duration: 10, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    priority={index === 0}
                    unoptimized
                    className="object-cover object-center z-0"
                  />
                  {/* No overlays to preserve image integrity since they already have text */}
                </motion.div>

                {/* Content Container - Only the action button, positioned discreetly */}
                <div className="relative h-full container mx-auto px-6 flex flex-col justify-end pb-12 md:pb-16 items-center">
                  <AnimatePresence mode="wait">
                    {current === index && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        className="mb-4"
                      >
                        <Button asChild size="sm" className="rounded-full px-6 py-5 font-bold group bg-primary/90 hover:bg-primary backdrop-blur-md transition-all duration-300 shadow-lg">
                          <Link href={item.buttonRedirect}>
                            {item.buttonName}
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows - Sides */}
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-primary hover:border-primary pointer-events-auto transition-all"
            onClick={() => api?.scrollPrev()}
          >
            <ArrowRight className="w-6 h-6 rotate-180" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-primary hover:border-primary pointer-events-auto transition-all"
            onClick={() => api?.scrollNext()}
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Bottom Bar: Indicators & Counter */}
        <div className="absolute bottom-0 left-0 w-full z-20 py-8 bg-linear-to-t from-black/20 to-transparent">
          <div className="container mx-auto px-6 flex items-center justify-between">
            <div className="flex gap-2">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-1 transition-all duration-500 rounded-full",
                    current === index 
                      ? "w-8 bg-primary" 
                      : "w-4 bg-white/20 hover:bg-white/40"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 text-white/50 font-mono text-[10px] tracking-widest">
              <span className="text-white font-bold">0{current + 1}</span>
              <div className="w-8 h-px bg-white/20" />
              <span>0{carouselItems.length}</span>
            </div>
          </div>
        </div>
      </Carousel>

      {/* Scroll Down Indicator - refined */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-px h-8 bg-linear-to-b from-primary/50 to-transparent" />
      </motion.div>

    </section>
  )
}
