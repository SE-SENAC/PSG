'use client'

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap, ArrowUpRight, MapPin, Clock, Sparkles, BookOpen,
  Monitor, Stethoscope, ChefHat, Scissors, Briefcase,
  Hammer, Leaf, Palette, ShoppingBag, Car, Headphones, Wrench,
  Award, ShieldCheck, Zap, Star
} from "lucide-react";

// ─── TEMAS DE CATEGORIAS ──────────────────────────────────────────────────────────
// Cada categoria possui: cor de destaque, gradiente, ícone, cor de sobreposição (scrim), cor do rótulo
type CategoryTheme = {
  gradient: string;           // Tailwind gradient classes for the accent bar + glow
  accentColor: string;        // Tailwind text color for titles, icons
  accentBg: string;           // Tailwind bg for meta chips on hover
  hoverBorder: string;        // Tailwind border color on hover
  hoverShadow: string;        // Inline CSS shadow string
  scrim: string;              // Tailwind gradient for image overlay
  badgeBg: string;            // Tailwind bg for vagas badge
  icon: React.FC<{ size?: number; className?: string }>;
  label: string;
};

const categoryThemes: Record<string, CategoryTheme> = {
  // ── TECNOLOGIA / INFORMÁTICA
  "Tecnologia da Informação": {
    gradient:    'from-sky-500 via-blue-600 to-indigo-700',
    accentColor: 'text-sky-500 dark:text-sky-400',
    accentBg:    'group-hover:bg-sky-500/10',
    hoverBorder: 'group-hover:border-sky-500/50',
    hoverShadow: '0 24px 64px rgba(14,165,233,0.18)',
    scrim:       'from-slate-950 via-blue-950/50 to-transparent',
    badgeBg:     'bg-sky-600/80',
    icon:        Monitor,
    label:       'TI & Digital',
  },
  "Informática": {
    gradient:    'from-blue-500 via-indigo-600 to-violet-700',
    accentColor: 'text-blue-500',
    accentBg:    'group-hover:bg-blue-500/10',
    hoverBorder: 'group-hover:border-blue-500/50',
    hoverShadow: '0 24px 64px rgba(99,102,241,0.18)',
    scrim:       'from-slate-950 via-indigo-950/50 to-transparent',
    badgeBg:     'bg-indigo-600/80',
    icon:        Monitor,
    label:       'Informática',
  },
  // ── SAÚDE
  "Saúde": {
    gradient:    'from-emerald-500 via-teal-500 to-cyan-600',
    accentColor: 'text-emerald-500',
    accentBg:    'group-hover:bg-emerald-500/10',
    hoverBorder: 'group-hover:border-emerald-400/50',
    hoverShadow: '0 24px 64px rgba(16,185,129,0.18)',
    scrim:       'from-slate-950 via-emerald-950/50 to-transparent',
    badgeBg:     'bg-emerald-600/80',
    icon:        Stethoscope,
    label:       'Saúde',
  },
  // ── GASTRONOMIA
  "Gastronomia": {
    gradient:    'from-amber-400 via-orange-500 to-red-600',
    accentColor: 'text-amber-500',
    accentBg:    'group-hover:bg-amber-500/10',
    hoverBorder: 'group-hover:border-amber-400/50',
    hoverShadow: '0 24px 64px rgba(245,158,11,0.18)',
    scrim:       'from-stone-950 via-orange-950/50 to-transparent',
    badgeBg:     'bg-orange-600/80',
    icon:        ChefHat,
    label:       'Gastronomia',
  },
  // ── MODA / BELEZA
  "Beleza": {
    gradient:    'from-pink-500 via-rose-500 to-fuchsia-600',
    accentColor: 'text-pink-500',
    accentBg:    'group-hover:bg-pink-500/10',
    hoverBorder: 'group-hover:border-pink-400/50',
    hoverShadow: '0 24px 64px rgba(236,72,153,0.18)',
    scrim:       'from-slate-950 via-pink-950/50 to-transparent',
    badgeBg:     'bg-fuchsia-600/80',
    icon:        Scissors,
    label:       'Beleza',
  },
  "Moda": {
    gradient:    'from-violet-500 via-purple-600 to-fuchsia-700',
    accentColor: 'text-violet-500',
    accentBg:    'group-hover:bg-violet-500/10',
    hoverBorder: 'group-hover:border-violet-400/50',
    hoverShadow: '0 24px 64px rgba(139,92,246,0.18)',
    scrim:       'from-slate-950 via-violet-950/50 to-transparent',
    badgeBg:     'bg-violet-600/80',
    icon:        Palette,
    label:       'Moda',
  },
  // ── GESTÃO / NEGÓCIOS
  "Gestão": {
    gradient:    'from-[#F7941D] via-orange-600 to-amber-700',
    accentColor: 'text-secondary',
    accentBg:    'group-hover:bg-secondary/10',
    hoverBorder: 'group-hover:border-secondary/50',
    hoverShadow: '0 24px 64px rgba(247,148,29,0.18)',
    scrim:       'from-stone-950 via-orange-950/50 to-transparent',
    badgeBg:     'bg-orange-500/80',
    icon:        Briefcase,
    label:       'Gestão',
  },
  "Negócios": {
    gradient:    'from-orange-500 via-amber-500 to-yellow-600',
    accentColor: 'text-amber-500',
    accentBg:    'group-hover:bg-amber-500/10',
    hoverBorder: 'group-hover:border-amber-400/50',
    hoverShadow: '0 24px 64px rgba(245,158,11,0.18)',
    scrim:       'from-stone-950 via-amber-950/50 to-transparent',
    badgeBg:     'bg-amber-600/80',
    icon:        ShoppingBag,
    label:       'Negócios',
  },
  // ── INDÚSTRIA / TÉCNICO
  "Indústria": {
    gradient:    'from-slate-500 via-zinc-600 to-gray-700',
    accentColor: 'text-zinc-400',
    accentBg:    'group-hover:bg-zinc-500/10',
    hoverBorder: 'group-hover:border-zinc-500/50',
    hoverShadow: '0 24px 64px rgba(113,113,122,0.2)',
    scrim:       'from-zinc-950 via-slate-950/70 to-transparent',
    badgeBg:     'bg-zinc-600/80',
    icon:        Hammer,
    label:       'Indústria',
  },
  // ── MEIO AMBIENTE
  "Meio Ambiente": {
    gradient:    'from-green-600 via-lime-600 to-teal-700',
    accentColor: 'text-green-500',
    accentBg:    'group-hover:bg-green-500/10',
    hoverBorder: 'group-hover:border-green-400/50',
    hoverShadow: '0 24px 64px rgba(34,197,94,0.18)',
    scrim:       'from-green-950 via-lime-950/40 to-transparent',
    badgeBg:     'bg-green-600/80',
    icon:        Leaf,
    label:       'Meio Ambiente',
  },
  // ── DEFAULT (Senac Blue)
  // ── PADRÃO (Azul Senac)
  default: {
    gradient:    'from-[#004A8E] via-blue-700 to-indigo-800',
    accentColor: 'text-primary',
    accentBg:    'group-hover:bg-primary/10',
    hoverBorder: 'group-hover:border-primary/50',
    hoverShadow: '0 24px 64px rgba(0,74,142,0.16)',
    scrim:       'from-slate-950 via-blue-950/40 to-transparent',
    badgeBg:     'bg-primary/80',
    icon:        BookOpen,
    label:       'Formação',
  },
};

function getTheme(category?: string): CategoryTheme {
  // Se não houver categoria, retorna o tema padrão
  if (!category) return categoryThemes.default;
  
  // Tenta encontrar o tema exato
  if (categoryThemes[category]) return categoryThemes[category];

  // Tenta por inclusão parcial de texto
  const key = Object.keys(categoryThemes).find(k =>
    category.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(category.toLowerCase())
  );
  return key ? categoryThemes[key] : categoryThemes.default;
}

// ─── CORES DE PERÍODO ─────────────────────────────────────────────────────────────
const periodColors: Record<string, string> = {
  'MANHÃ': 'from-amber-400 to-orange-500',
  'TARDE': 'from-orange-500 to-red-500',
  'NOITE': 'from-indigo-500 to-purple-700',
};

// ─── PROPRIEDADES (PROPS) ────────────────────────────────────────────────────────────
interface CursoCardProps {
  id: string;
  title: string;
  codigo: string;
  vagas_ofertadas: number;
  escolaridade_minima: string;
  img_url?: string;
  periodo?: string;
  local?: string;
  categoria?: string;
  type?: 'LIVRE' | 'TECNICO';
}

// ─── COMPONENTE ────────────────────────────────────────────────────────────────
export default function CursoCard({
  id, title, codigo, vagas_ofertadas, escolaridade_minima,
  img_url, periodo, local, categoria, type = 'LIVRE'
}: CursoCardProps) {
  const theme = getTheme(categoria);
  const CategoryIcon = theme.icon;
  const periodGrad = periodColors[periodo ?? ''] ?? 'from-primary to-blue-500';

  return (
    <Link href={`/cursos/${id}`} className="block h-full">
      <motion.article
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 340, damping: 26 }}
        className="relative h-full rounded-[36px] overflow-hidden cursor-pointer group"
        style={{ '--hover-shadow': theme.hoverShadow } as React.CSSProperties}
      >
        {/* Anel de brilho externo (cor da categoria) */}
        <div className={`
          absolute -inset-0.5 rounded-[37px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10
          bg-gradient-to-br ${theme.gradient}
        `} />

        {/* ── PREMIUM BORDER FOR TECHNICAL COURSES ── */}
        {type === 'TECNICO' && (
          <div className="absolute inset-0 p-[2px] rounded-[36px] bg-gradient-to-br from-white/20 via-primary/40 to-white/20 -z-10 overflow-hidden">
             <motion.div 
               animate={{ 
                 rotate: [0, 360],
                 opacity: [0.3, 0.6, 0.3]
               }}
               transition={{ 
                 duration: 10, 
                 repeat: Infinity, 
                 ease: "linear" 
               }}
               className={`absolute -inset-[100%] bg-gradient-to-tr ${theme.gradient} opacity-40 blur-[40px] z-0`} 
             />
          </div>
        )}

        {/* Corpo do Cartão */}
        <div
          className={`
            relative h-full bg-card rounded-[36px] overflow-hidden border flex flex-col
            ${type === 'TECNICO' ? 'border-primary/20 bg-background/40 backdrop-blur-xl' : 'border-border/50 bg-card'}
            group-hover:border-transparent transition-all duration-500
            shadow-[0_4px_20px_rgba(0,0,0,0.06)]
          `}
          style={{ boxShadow: undefined }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = theme.hoverShadow)}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)')}
        >

          {/* ── BARRA DE DESTAQUE SUPERIOR (cor da categoria) ── */}
          <div className={`h-1 w-full bg-gradient-to-r ${theme.gradient} shrink-0`} />

          {/* ── SEÇÃO DA IMAGEM ── */}
          <div className="relative h-48 overflow-hidden shrink-0">
            <img
              src={img_url || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop"}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.08]"
            />
            {/* Gradiente de sombreamento (matizado pela categoria) */}
            <div className={`absolute inset-0 bg-gradient-to-t ${theme.scrim} opacity-70 group-hover:opacity-85 transition-opacity duration-500`} />

            {/* ── BADGES DA LINHA SUPERIOR ── */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
              {/* Badge da categoria */}
              <span className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest text-white uppercase
                bg-gradient-to-r ${theme.gradient} shadow-lg backdrop-blur-sm
              `}>
                <CategoryIcon size={10} />
                {theme.label}
              </span>

              {/* ── COURSE TYPE BADGE ── */}
              <span className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest text-white uppercase shadow-lg backdrop-blur-md border border-white/20
                ${type === 'TECNICO' 
                  ? 'bg-gradient-to-r from-primary via-indigo-600 to-primary animate-gradient-x' 
                  : 'bg-zinc-800/80'
                }
              `}>
                {type === 'TECNICO' ? <Award size={10} /> : <Zap size={10} />}
                Curso {type === 'TECNICO' ? 'Técnico' : 'Livre'}
              </span>
            </div>

            {/* Badge de período – canto inferior esquerdo */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              {periodo && (
                <span className={`
                  flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black tracking-widest text-white uppercase
                  bg-gradient-to-r ${periodGrad} shadow-md
                `}>
                  <Clock size={9} />
                  {typeof periodo === 'string' ? periodo.charAt(0).toUpperCase() + periodo.slice(1).toLowerCase() : periodo}
                </span>
              )}
              <span className={`
                flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black tracking-widest text-white uppercase
                ${theme.badgeBg} backdrop-blur-md border border-white/10 shadow-lg
              `}>
                <Sparkles size={9} />
                {vagas_ofertadas} vagas
              </span>
            </div>
          </div>

          {/* ── SEÇÃO DE CONTEÚDO ── */}
          <div className="flex flex-col gap-4 px-6 pt-5 pb-6 flex-1">

            {/* Código + separador */}
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black tracking-[0.25em] uppercase ${theme.accentColor} opacity-70`}>
                Cód. {codigo}
              </span>
              <span className="flex-1 h-px bg-border/60" />
              <CategoryIcon size={12} className={`${theme.accentColor} opacity-40`} />
            </div>

            {/* Título */}
            <div className="relative">
              <h3 className={`font-black text-xl leading-snug tracking-tight text-foreground line-clamp-2 transition-colors duration-500 group-hover:${theme.accentColor.replace('text-', 'text-')}`}>
                {title}
              </h3>
              {type === 'TECNICO' && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Formação Profissional Premium</span>
                </div>
              )}
            </div>

            {/* ── CHIPS DE METADADOS ── */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className={`bg-muted/50 rounded-2xl px-3.5 py-3 flex flex-col gap-1 transition-colors duration-500 ${theme.accentBg}`}>
                <span className="text-[8.5px] font-black text-muted-foreground/50 uppercase tracking-widest">Escolaridade</span>
                <div className="flex items-center gap-1.5">
                  <GraduationCap size={12} className={`${theme.accentColor} shrink-0`} />
                  <span className="text-[11px] font-bold text-foreground/80 truncate">{escolaridade_minima}</span>
                </div>
              </div>
              <div className={`bg-muted/50 rounded-2xl px-3.5 py-3 flex flex-col gap-1 transition-colors duration-500 ${theme.accentBg}`}>
                <span className="text-[8.5px] font-black text-muted-foreground/50 uppercase tracking-widest">Local</span>
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className={`${theme.accentColor} shrink-0`} />
                  <span className="text-[11px] font-bold text-foreground/80 truncate">{local || 'Senac SE'}</span>
                </div>
              </div>
            </div>

            {/* ── LINHA DE CHAMADA (CTA) ── */}
            <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/40">
              <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest">
                Senac Sergipe
              </span>
              <motion.div
                className={`flex items-center gap-2 font-black text-[11px] uppercase tracking-wider ${theme.accentColor}`}
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Ver detalhes
                <span className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500
                  bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-100 text-white scale-75 group-hover:scale-100
                `}>
                  <ArrowUpRight size={14} />
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}