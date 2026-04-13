'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Home, BookOpen, GraduationCap, FileText, FileCheck, ChevronUp, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const MobileDock = () => {
    const pathname = usePathname();
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const user: any = useSelector((state: RootState) => state.auth.user);
    const isAdmin = isAuth && (user?.role?.name === 'admin' || user?.role?.name === 'superadmin' || user?.role === 'admin' || user?.role === 'superadmin');

    const [isPsgOpen, setIsPsgOpen] = useState(false);
    const dockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
                setIsPsgOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const items = [
        { label: 'Início', icon: Home, href: '/' },
        { 
            label: 'PSG', 
            icon: GraduationCap, 
            isDropdown: true,
            subItems: [
                { label: 'Como funciona', href: pathname !== "/" ? '/#como-funciona' : '#como-funciona' },
                { label: 'Regulamento', href: pathname !== "/" ? '/#regulamento' : '#regulamento' },
                { label: 'Inscrição', href: pathname !== "/" ? '/#inscricao' : '#inscricao' },
                { label: 'Cálculo', href: pathname !== "/" ? '/#calculo' : '#calculo' },
            ]
        },
        { label: 'Cursos', icon: BookOpen, href: '/cursos', special: true },
        { label: 'Editais', icon: FileText, href: '/edital' },
        { label: 'Resultados', icon: FileCheck, href: '/resultados' },
        ...(isAdmin ? [{ label: 'Perfil', icon: User, href: '/perfil/me' }] : []),
    ];

    return (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-[440px]" ref={dockRef}>
            {/* Main Dock Container */}
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="bg-[#0f172a]/80 backdrop-blur-2xl border border-white/20 rounded-[32px] p-2 flex justify-between items-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] relative"
            >
                {items.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.isDropdown && isPsgOpen);
                    
                    if (item.special) {
                        return (
                            <Link key={idx} href={item.href!} onClick={() => setIsPsgOpen(false)} className="flex-1 flex flex-col items-center group relative z-10 w-[20%]">
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-gradient-to-br from-[#f58220] to-[#e67300] p-4 rounded-full -mt-12 shadow-[0_12px_24px_rgba(245,130,32,0.5)] border-[5px] border-[#0f172a] transform transition-all duration-300 ring-2 ring-[#f58220]/20"
                                >
                                    <Icon className="size-6 text-white" strokeWidth={2.5} />
                                </motion.div>
                                <span className="text-[10px] font-black mt-1.5 text-white uppercase tracking-widest drop-shadow-sm">
                                    {item.label}
                                </span>
                                {pathname === item.href && (
                                    <motion.div 
                                        layoutId="activeIndicator"
                                        className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    }

                    if (item.isDropdown) {
                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center justify-center relative w-[20%]">
                                <AnimatePresence>
                                    {isPsgOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.9, filter: 'blur(10px)' }}
                                            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                                            exit={{ opacity: 0, y: 15, scale: 0.9, filter: 'blur(10px)' }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            className="absolute bottom-[130%] left-1/2 -translate-x-1/2 mb-4 bg-[#004587]/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-2 w-[180px] flex flex-col gap-1.5 origin-bottom z-50 overflow-hidden ring-1 ring-white/10"
                                        >
                                            {item.subItems?.map((sub, sIdx) => (
                                                <Link 
                                                    key={sIdx} 
                                                    href={sub.href} 
                                                    onClick={() => setIsPsgOpen(false)}
                                                    className="px-4 py-2.5 text-[11px] font-black text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all whitespace-nowrap text-center active:scale-95 uppercase tracking-wider"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#004587]/90 rotate-45 border-r border-b border-white/20"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button 
                                    onClick={() => setIsPsgOpen(!isPsgOpen)}
                                    className="flex flex-col items-center gap-1 group w-full py-1.5 h-full relative"
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activePill"
                                            className="absolute inset-x-1 inset-y-0.5 bg-white/5 rounded-2xl -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <div className="relative">
                                        <Icon 
                                            className={`size-5.5 transition-all duration-400 ${isActive ? 'text-[#f58220] drop-shadow-[0_0_8px_rgba(245,130,32,0.5)]' : 'text-white/40 group-hover:text-white/80'}`} 
                                            strokeWidth={isActive ? 2.5 : 2} 
                                        />
                                        <ChevronUp className={`size-3 absolute -top-1 -right-2.5 transition-transform duration-400 ${isActive ? 'text-[#f58220]' : 'text-white/40'} ${isPsgOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-tight transition-all duration-400 ${isActive ? 'text-[#f58220]' : 'text-white/25 group-hover:text-white/60'}`}>
                                        {item.label}
                                    </span>
                                </button>
                            </div>
                        );
                    }

                    return (
                        <Link key={idx} href={item.href!} onClick={() => setIsPsgOpen(false)} className="flex-1 flex flex-col items-center gap-1 group py-1.5 w-[20%] relative">
                            {isActive && (
                                <motion.div 
                                    layoutId="activePill"
                                    className="absolute inset-x-1 inset-y-0.5 bg-white/5 rounded-2xl -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon 
                                className={`size-5.5 transition-all duration-400 ${isActive ? 'text-[#f58220] drop-shadow-[0_0_8px_rgba(245,130,32,0.5)]' : 'text-white/40 group-hover:text-white/80'}`} 
                                strokeWidth={isActive ? 2.5 : 2} 
                            />
                            <span className={`text-[9px] font-black uppercase tracking-tight transition-all duration-400 ${isActive ? 'text-[#f58220]' : 'text-white/25 group-hover:text-white/60'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default MobileDock;
