'use client'
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, GraduationCap, FileText, FileCheck, User, ChevronUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

const WebDock = () => {
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

    let mouseX = useMotionValue(Infinity);

    return (
        <div className="hidden lg:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] items-end px-4 py-3" ref={dockRef}>
            <motion.div
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                className="mx-auto flex h-[68px] items-end gap-3 rounded-[34px] bg-[#0f172a]/85 backdrop-blur-3xl px-3 py-2 border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
            >
                {items.map((item, idx) => (
                    <DockIcon
                        key={idx}
                        mouseX={mouseX}
                        item={item}
                        isActive={pathname === item.href}
                        isPsgOpen={isPsgOpen}
                        setIsPsgOpen={setIsPsgOpen}
                    />
                ))}
            </motion.div>
        </div>
    );
};

function DockIcon({ mouseX, item, isActive, isPsgOpen, setIsPsgOpen }: any) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val: any) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-110, 0, 110], [52, 90, 52]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 20 });

    const Icon = item.icon;

    const content = (
        <motion.div
            ref={ref}
            style={{ width }}
            className={`relative flex aspect-square items-center justify-center rounded-2xl transition-colors duration-300 group ${item.special
                ? 'bg-gradient-to-br from-[#f58220] to-[#e67300] text-white shadow-[0_12px_24px_rgba(245,130,32,0.4)] border-2 border-white/20'
                : isActive
                    ? 'bg-white/10 text-[#f58220]'
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/80'
                }`}
        >
            <Icon
                className={`${item.special ? 'size-7' : 'size-6'}`}
                strokeWidth={item.special || isActive ? 2.5 : 2}
            />

            {/* Tooltip */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#0f172a]/95 backdrop-blur-xl rounded-xl text-white text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-white/10 uppercase tracking-[0.2em] shadow-2xl scale-90 group-hover:scale-100">
                {item.label}
            </div>

            {/* Active Indicator */}
            {isActive && !item.special && (
                <motion.div
                    layoutId="activeWebIndicator"
                    className="absolute -bottom-1 w-1 h-1 bg-[#f58220] rounded-full shadow-[0_0_10px_#f58220]"
                />
            )}

            {/* Dropdown specific logic for PSG */}
            {item.isDropdown && (
                <>
                    <ChevronUp className={`size-3 absolute -top-1 right-1 transition-transform duration-400 ${isActive ? 'text-[#f58220]' : 'text-white/40'} ${isPsgOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
                    <AnimatePresence>
                        {isPsgOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.9, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: 15, scale: 0.9, filter: 'blur(10px)' }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="absolute bottom-[130%] left-1/2 -translate-x-1/2 mb-4 bg-[#004587]/90 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl p-2 w-[200px] flex flex-col gap-1.5 z-50 overflow-hidden ring-1 ring-white/10"
                            >
                                {item.subItems?.map((sub: any, sIdx: number) => (
                                    <Link
                                        key={sIdx}
                                        href={sub.href}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsPsgOpen(false);
                                        }}
                                        className="px-4 py-2.5 text-[11px] font-black text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all whitespace-nowrap text-center uppercase tracking-wider active:scale-95"
                                    >
                                        {sub.label}
                                    </Link>
                                ))}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#004587]/90 rotate-45 border-r border-b border-white/20"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </motion.div>
    );

    if (item.isDropdown) {
        return (
            <div className="cursor-pointer" onClick={() => setIsPsgOpen(!isPsgOpen)}>
                {content}
            </div>
        );
    }

    return (
        <Link href={item.href} onClick={() => setIsPsgOpen(false)} className="cursor-pointer">
            {content}
        </Link>
    );
}

export default WebDock;
