"use client"

import { FooterColumn } from "./FooterColumn"
import { SocialIcon } from "./SocialIcon"
import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="bg-blue-900 text-white px-8 py-12">

      {/* GRID */}
      <div className="grid md:grid-cols-5 gap-10">

        {/* INSTITUCIONAL */}
        <FooterColumn
          title="Institucional"
          links={[
            { label: "Sobre o Senac", href: "#" },
            { label: "Unidades", href: "#" },
            { label: "Notícias", href: "#" },
            { label: "Processo Seletivo", href: "#" },
            { label: "Eventos", href: "#" },
            { label: "Aluguel de Espaços", href: "#" },
            { label: "Segurança Alimentar", href: "#" },
          ]}
        />

        {/* EDUCACIONAL */}
        <FooterColumn
          title="Educacional"
          links={[
            { label: "Aprendizagem", href: "#" },
            { label: "Cursos Livres", href: "#" },
            { label: "Cursos Técnicos", href: "#" },
            { label: "PSG", href: "#" },
            { label: "Rede de Talentos", href: "#" },
            { label: "Portal do Aluno", href: "#" },
          ]}
        />

        {/* CENTRO */}
        <div className="flex flex-col items-center text-center">
          <img
            src="/logo.svg"
            alt="Senac"
            className="w-40 mb-4"
          />

          <p className="text-sm text-white/80 max-w-xs">
            Educar para o trabalho, de forma inovadora e inclusiva, em atividades do comércio de bens, serviços e turismo.
          </p>

          {/* REDES SOCIAIS */}
          <div className="flex gap-4 mt-4">

            {/* YOUTUBE */}
            <SocialIcon href="https://www.youtube.com/@senacse" label="YouTube">
              <svg viewBox="0 0 576 512" className="w-5 h-5 fill-white">
                <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
              </svg>
            </SocialIcon>

            {/* INSTAGRAM */}
            <SocialIcon href="https://www.instagram.com/senacse/" label="Instagram">
              <svg viewBox="0 0 448 512" className="w-5 h-5 fill-white">
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z"/>
              </svg>
            </SocialIcon>

            {/* LINKEDIN */}
            <SocialIcon href="https://www.linkedin.com/in/senac-sergipe-112888251/" label="LinkedIn">
              <svg viewBox="0 0 448 512" className="w-5 h-5 fill-white">
                <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
              </svg>
            </SocialIcon>

          </div>
        </div>

        {/* LINKS ÚTEIS */}
        <FooterColumn
          title="Links Úteis"
          links={[
            { label: "Transparência", href: "#" },
            { label: "Licitações & Editais", href: "#" },
            { label: "Intranet", href: "#" },
            { label: "Contrato do Aluno", href: "#" },
            { label: "Políticas de Privacidade", href: "#" },
          ]}
        />

        {/* SUPORTE */}
        <FooterColumn
          title="Suporte"
          links={[
            { label: "Dúvidas Frequentes", href: "#" },
            { label: "Protocolar Pedidos", href: "#" },
            { label: "Envio de NF", href: "#" },
            { label: "LGPD", href: "#" },
          ]}
        />

      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-xs text-white/60 mt-10">
        Serviço Nacional de Aprendizagem Comercial – Departamento Regional de Sergipe. (c) 2018 | Política de Privacidade
      </div>
    </footer>
  )
}