'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Sun, Moon, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { logout } from "@/lib/store/auth/auth";
import { toggleTheme } from "@/lib/store/theme/theme";
import AuthServices from "@/services/authServices";
import { useRouter, usePathname } from "next/navigation";
import Link from 'next/link';
import DiretrizesService from "@/services/diretrizesService";

// Mock dos links e menus
const topLinks = [
  { label: 'Transparência', href: '#' },
  { label: 'Processo Seletivo', href: '#' },
  { label: 'RH (Trabalhe Conosco)', href: '#' },
  { label: 'Licitações', href: '#' },
  { label: 'PSG', href: '#' },
  { label: 'Portaria de Gratuidade', href: '#' }
];

const mainLinks = [
  { label: 'Início', href: '/' },
  {
    label: 'Sobre o PSG',
    subItems: [
      { label: 'Como funciona o PSG?', href: '#como-funciona' },
      { label: 'Regulamento', href: '#regulamento' },
      { label: 'Como se inscrever?', href: '#inscricao' },
      { label: 'Como é feito o cálculo?', href: '#calculo' }
    ]
  },
  { label: 'Cursos Disponíveis', href: '/cursos' },
  { label: 'Diretrizes', href: '/diretrizes'},
  { label: 'Resultados', href: '/resultados' },
  { label: 'Edital', href: '/edital' }
];

export default function Header() {
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const mode = useSelector((state: RootState) => state.theme.mode);
  const user: any = useSelector((state: RootState) => state.auth.user);
  const isAdmin = isAuth && (user?.role?.name === 'admin' || user?.role?.name === 'superadmin' || user?.role === 'admin' || user?.role === 'superadmin');

  const dispatch = useDispatch();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSubmenuMobile, setOpenSubmenuMobile] = useState<number | null>(null);
  const [openSubmenuDesktop, setOpenSubmenuDesktop] = useState<number | null>(null);
  const [latestDiretriz, setLatestDiretriz] = useState<any>(null);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchLatestDiretriz = async () => {
      try {
        const response = await DiretrizesService.findAll(1, 1);
        if (response.data && response.data.length > 0) {
          setLatestDiretriz(response.data[0]);
        }
      } catch (error) {
        console.error('Erro ao buscar última diretriz:', error);
      }
    };

    fetchLatestDiretriz();
  }, []);

  const getDynamicHref = (href: string) => {
    if (href.startsWith('#')) {
      return pathname === '/' ? href : `/${href}`;
    }
    return href;
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      try { await AuthServices.logout(token); } catch(e) {}
    }
    localStorage.removeItem("token");
    dispatch(logout());
    setIsMobileOpen(false);
    router.push("/autenticacao/login");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full flex flex-col">
        {/* Top Bar (Apenas Desktop) */}
        <div className="hidden lg:block h-[48px] bg-[#00386d] text-white border-b border-white/5">
          <div className="container mx-auto h-full flex justify-end items-center px-4 text-[13px]">
            <div className="flex gap-6 uppercase">
              {topLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="hover:text-[#f58220] transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Bar */}
        <div
          className={`
            h-[94px] w-full
            transition-all duration-300
            ${isScrolled ? 'bg-[#004587]/95 backdrop-blur-xl shadow-lg' : 'bg-[#004587]'}
          `}
        >
          <div className="container mx-auto h-full px-4 lg:px-[60px] flex items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <img
                src="https://fabianocage.com.br/senacse/wp-content/uploads/2026/02/logo-negativo-vertical.svg"
                alt="Senac"
                className={`h-12 transition-transform duration-300 ${isScrolled ? 'scale-95' : 'scale-100'}`}
              />
            </Link>

            {/* Área de Menus e Avatar */}
            <div className="flex items-center gap-6 flex-1 justify-end">
              
              {/* Menu Mobile Button (Oculto no Desktop) */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileOpen(true)}
                  className="flex items-center gap-2 text-white hover:text-[#f58220] transition focus:outline-none"
                >
                  <Menu className="size-7" />
                  <span className="hidden sm:block uppercase font-bold text-sm">
                    Menu
                  </span>
                </button>
              </div>

              {/* Menu Desktop (Visível apenas no Desktop) */}
              <nav className="hidden lg:flex items-center gap-6 relative">
                {mainLinks.map((link, idx) => {
                  if (link.adminOnly && !isAdmin) return null;

                  if (link.subItems) {
                    return (
                      <div
                        key={idx}
                        className="relative"
                        onMouseEnter={() => setOpenSubmenuDesktop(idx)}
                        onMouseLeave={() => setOpenSubmenuDesktop(null)}
                      >
                        <button className="flex items-center gap-1 bg-transparent text-white uppercase font-bold hover:text-[#f58220] transition-colors py-2">
                          {link.label}
                          <ChevronDown className="size-4" />
                        </button>

                        <AnimatePresence>
                          {openSubmenuDesktop === idx && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-full left-0 bg-[#004587] shadow-xl w-[250px] overflow-hidden rounded-b-md"
                            >
                              <ul className="flex flex-col">
                                  {link.subItems.map((sub, i) => (
                                    <li key={i}>
                                      <Link
                                        href={getDynamicHref(sub.href)}
                                        className="block px-4 py-3 text-white text-sm hover:bg-white/10 hover:text-[#f58220] transition-colors"
                                      >
                                        {sub.label}
                                      </Link>
                                    </li>
                                  ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={idx}
                      href={link.href}
                      className="uppercase font-bold text-white hover:text-[#f58220] transition-colors"
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Última Diretriz */}
              {latestDiretriz && (
                <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <FileText className="h-4 w-4 text-[#f58220]" />
                  <div className="flex flex-col">
                    <span className="text-xs text-white/70 uppercase font-semibold">Diretriz Atual</span>
                    <span className="text-sm text-white font-medium truncate max-w-[150px]" title={latestDiretriz.title}>
                      {latestDiretriz.title}
                    </span>
                  </div>
                  <a
                    href={latestDiretriz.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 bg-[#f58220] hover:bg-[#f58220]/80 rounded-md transition-colors"
                    title="Baixar Diretriz"
                  >
                    <Download className="h-4 w-4 text-white" />
                  </a>
                </div>
              )}

              {/* Avatar (Visível se Autenticado) */}
              {isAuth && user && isAdmin && (
                <button
                  onClick={() => router.push('/perfil/me')}
                  className="size-10 rounded-full bg-[#f58220] flex items-center justify-center text-white font-bold hover:brightness-110 transition shrink-0 shadow-md hover:shadow-[#f58220]/50"
                  title="Perfil"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'A'}
                </button>
              )}

              {/* Botão de Tema */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="size-10 rounded-full bg-[#00386d] border border-white/10 flex items-center justify-center text-white hover:text-[#f58220] transition-all hover:shadow-[0_0_15px_rgba(245,130,32,0.4)] shrink-0"
                title={mode === 'dark' ? 'Mudar para modo Claro' : 'Mudar para modo Escuro'}
              >
                {mode === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Drawer / Modal do Menu Mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Overlay para fechar ao clicar fora */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-[90] lg:hidden"
            />

            {/* Painel do Menu Mobile */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[320px] bg-[#004587] text-white z-[100] shadow-2xl flex flex-col lg:hidden"
            >
              <div className="p-6 flex justify-between items-center bg-[#00386d] shrink-0 border-b border-white/10">
                <img
                  src="https://fabianocage.com.br/senacse/wp-content/uploads/2026/02/logo-negativo-vertical.svg"
                  className="h-10"
                  alt="Senac"
                />
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="text-white hover:text-[#f58220] transition-colors focus:outline-none"
                >
                  <X className="size-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <nav className="p-6 flex flex-col gap-6">
                  {/* Theme Toggle Mobile */}
                  <button
                    onClick={() => {
                       dispatch(toggleTheme());
                       setIsMobileOpen(false);
                    }}
                    className="flex justify-between items-center w-full uppercase font-bold text-left hover:text-[#f58220] transition-colors hover:shadow-[0_0_15px_rgba(245,130,32,0.3)] p-2 rounded-md"
                  >
                    Mudar Tema
                    {mode === 'dark' ? <Sun className="size-5 text-[#f58220]" /> : <Moon className="size-5" />}
                  </button>

                  {/* Divisor */}
                  <div className="h-px w-full bg-white/20 my-1" />
                  {mainLinks.map((link, idx) => {
                    if (link.adminOnly && !isAdmin) return null;

                    if (link.subItems) {
                      return (
                        <div key={idx} className="flex flex-col">
                          <button
                            onClick={() =>
                              setOpenSubmenuMobile(openSubmenuMobile === idx ? null : idx)
                            }
                            className="flex justify-between items-center w-full uppercase font-bold text-left hover:text-[#f58220] transition-colors"
                          >
                            {link.label}
                            <ChevronDown
                              className={`size-5 transition-transform ${
                                openSubmenuMobile === idx ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {openSubmenuMobile === idx && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 mt-4 flex flex-col gap-4 border-l-2 border-white/20">
                                  {link.subItems.map((sub, i) => (
                                    <Link
                                      key={i}
                                      href={getDynamicHref(sub.href)}
                                      onClick={() => setIsMobileOpen(false)}
                                      className="text-sm text-white/80 hover:text-white transition-colors"
                                    >
                                      {sub.label}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={idx}
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className="uppercase font-bold hover:text-[#f58220] transition-colors"
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                  
                  {/* Última Diretriz Mobile */}
                  {latestDiretriz && (
                    <>
                      <div className="h-px w-full bg-white/20 my-2" />
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-[#f58220] mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white/70 uppercase font-semibold mb-1">Diretriz Atual</p>
                            <p className="text-sm text-white font-medium mb-2 line-clamp-2" title={latestDiretriz.title}>
                              {latestDiretriz.title}
                            </p>
                            <a
                              href={latestDiretriz.file_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsMobileOpen(false)}
                              className="inline-flex items-center gap-2 bg-[#f58220] hover:bg-[#f58220]/80 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
                            >
                              <Download className="h-3 w-3" />
                              Baixar PDF
                            </a>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Divisor */}
                  <div className="h-px w-full bg-white/20 my-2" />
                  
                  <button 
                    onClick={handleLogout}
                    className="text-left text-red-300 font-bold uppercase hover:text-red-400 transition-colors"
                  >
                    Terminar Sessão
                  </button>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}