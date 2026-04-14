'use client'

import {
    Sidebar,
    SidebarProvider,
    SidebarTrigger,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarInset,
    SidebarGroup,
    SidebarGroupLabel
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    FileText,
    ActivitySquare,
    User,
    LogOut,
    Settings,
    Key,
    Activity,
    Tags,
    ShieldAlert,
    BarChart3,
    Sun,
    Moon,
    UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { logout } from "@/lib/store/auth/auth";
import { setTheme } from "@/lib/store/theme/theme";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function Layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    const { id } = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const userEmail = useSelector((state: RootState) => state.auth.user?.email);
    const userName = useSelector((state: RootState) => state.auth.user?.name);
    const themeMode = useSelector((state: RootState) => state.theme.mode);

    const sidebar_elems = [
        { nome: "Dashboard", href: `/gerenciador/admin/${id}/dashboard`, icon: LayoutDashboard },
        { nome: "Cursos", href: `/gerenciador/admin/${id}/dashboard/cursos`, icon: BookOpen },
        { nome: "Categorias", href: `/gerenciador/admin/${id}/dashboard/categorias`, icon: Tags },
        { nome: "Inscrições", href: `/gerenciador/admin/${id}/dashboard/inscricoes`, icon: Key },
        { nome: "Diretrizes", href: `/gerenciador/admin/${id}/dashboard/diretrizes`, icon: ClipboardList },
        { nome: "Edital", href: `/gerenciador/admin/${id}/dashboard/edital`, icon: FileText },
        { nome: "Resultados", href: `/gerenciador/admin/${id}/dashboard/resultados`, icon: ActivitySquare },
        { nome: "Políticas e Regras", href: `/gerenciador/admin/${id}/dashboard/politicas`, icon: ShieldAlert },
    ];

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        router.push("/gerenciador/admin/login");
    };
 
    return (
        <TooltipProvider delayDuration={0}>
            <SidebarProvider defaultOpen={true}>
                <div className="flex min-h-screen w-full bg-slate-100 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-white overflow-hidden transition-colors duration-500">
                    <Sidebar collapsible="icon" className="border-r border-slate-200 shadow-xl bg-[#002d5b] text-white transition-colors duration-500">
                        <SidebarHeader className={`h-24 flex items-start justify-center group-data-[collapsible=icon]:px-0 px-6 border-b border-[#004587] bg-[#00386d]`}>
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f58220] p-2 shadow-[#f58220]/20">
                                    <UserCircle className="text-white size-7" />
                                </div>
                                <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
                                    <span className="font-black text-xs leading-none uppercase tracking-tight text-slate-200">SGA Administrador</span>
                                    <span className="text-[10px] text-[#f58220] uppercase font-black tracking-widest mt-1.5">Admin PSG</span>
                                </div>
                            </div>
                        </SidebarHeader>

                        <SidebarContent className='bg-[#002d5b] border-none custom-scrollbar'>
                            <SidebarGroup>
                                <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden px-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4 mt-6">Painel Administrativo</SidebarGroupLabel>
                                <SidebarMenu className={`px-0 space-y-1.5 font-medium`}>
                                    {sidebar_elems.map((item) => {
                                        const isDashboard = item.href === `/gerenciador/admin/${id}/dashboard`;
                                        const isActive = isDashboard
                                            ? pathname === item.href
                                            : pathname.startsWith(item.href);
                                        const Icon = item.icon;

                                        return (
                                            <SidebarMenuItem key={item.href}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={isActive}
                                                    tooltip={item.nome}
                                                    className={cn(
                                                        "h-12 transition-all duration-300 rounded-2xl px-4",
                                                        isActive
                                                            ? "bg-[#f58220] text-slate-950 shadow-lg shadow-[#f58220]/20 hover:bg-[#e67318]"
                                                            : "text-slate-300 hover:bg-slate-900 hover:text-white"
                                                    )}
                                                >
                                                    <Link href={item.href} className="flex items-center gap-4">
                                                        <Icon className={cn("size-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                                                        <span className="font-bold text-sm tracking-tight">{item.nome}</span>
                                                        {isActive && (
                                                            <motion.div
                                                                layoutId="active-indicator-admin"
                                                                className="ml-auto h-2 w-2 rounded-full bg-emerald-300 group-data-[collapsible=icon]:hidden shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                                                            />
                                                        )}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroup>
                        </SidebarContent>

                        <SidebarFooter className="group-data-[collapsible=icon]:p-1 border-t border-slate-800 bg-[#00386d]">
                            <div className="flex items-center gap-4">
                                <div className="group-data-[collapsible=icon]:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                    <User className="text-emerald-300" size={20} />
                                </div>
                                <div className="flex flex-col flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                                    <span className="text-xs font-black text-white truncate tracking-tight">{userName || "Administrador"}</span>
                                    <span className="text-[10px] text-slate-400 truncate font-bold uppercase tracking-tighter italic">{userEmail || "admin@psg.com"}</span>
                                </div>
                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    size="icon"
                                    className="size-10 text-slate-300 hover:text-emerald-300 hover:bg-emerald-300/10 rounded-2xl"
                                >
                                    <LogOut size={18} />
                                </Button>
                            </div>
                        </SidebarFooter>
                    </Sidebar>

                    <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-slate-100 dark:bg-slate-950 transition-colors duration-500">
                        <header className="flex h-24 items-center px-10 bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 justify-between backdrop-blur-xl transition-colors duration-500">
                            <div className="flex items-center gap-8">
                                <SidebarTrigger className="text-slate-400 hover:text-emerald-500 hover:bg-slate-100 rounded-2xl p-3 transition-all" />
                                <Separator orientation="vertical" className="h-10 bg-slate-200 mr-2" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-2">Portal PSG Admin</span>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">
                                        {sidebar_elems.find(e => {
                                            const isDashboard = e.href === `/gerenciador/admin/${id}/dashboard`;
                                            return isDashboard ? pathname === e.href : pathname.startsWith(e.href);
                                        })?.nome || "Painel Administrativo"}
                                    </h2>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="hidden xl:flex items-center px-5 py-2.5 rounded-2xl bg-[#f58220]/10 border border-[#f58220]/15">
                                    <BarChart3 className="size-4 text-[#f58220] mr-3" />
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Controle Operacional</span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-2xl text-slate-400 hover:text-[#f58220] hover:bg-slate-100 transition-all size-12 border border-transparent hover:border-slate-200 shadow-sm relative overflow-hidden group">
                                            <Settings className="size-6 group-hover:rotate-90 transition-transform duration-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-72 rounded-[32px] p-4 border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                                        <DropdownMenuLabel className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Configurações</span>
                                                <span className="text-[10px] text-slate-400 font-medium">Manage your admin workspace</span>
                                            </div>
                                        </DropdownMenuLabel>

                                        <DropdownMenuSeparator className="bg-slate-50 my-2 mx-2" />

                                        <div className="p-2 space-y-1">
                                            <DropdownMenuItem
                                                onClick={() => dispatch(setTheme('light'))}
                                                className={cn(
                                                    "rounded-2xl flex items-center justify-between p-4 cursor-pointer transition-all",
                                                    themeMode === 'light' ? "bg-emerald-500/10 text-emerald-700" : "hover:bg-slate-50 text-slate-600"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Sun className={cn("size-5", themeMode === 'light' ? "text-emerald-500" : "text-slate-400")} />
                                                    <span className="font-bold">Modo Claro</span>
                                                </div>
                                                {themeMode === 'light' && <div className="size-1.5 rounded-full bg-emerald-600" />}
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() => dispatch(setTheme('dark'))}
                                                className={cn(
                                                    "rounded-2xl flex items-center justify-between p-4 cursor-pointer transition-all",
                                                    themeMode === 'dark' ? "bg-slate-900 text-white shadow-xl" : "hover:bg-slate-50 text-slate-600"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Moon className={cn("size-5", themeMode === 'dark' ? "text-emerald-500" : "text-slate-400")} />
                                                    <span className="font-bold">Modo Escuro</span>
                                                </div>
                                                {themeMode === 'dark' && <div className="size-1.5 rounded-full bg-white shadow-[0_0_5px_white]" />}
                                            </DropdownMenuItem>
                                        </div>

                                        <DropdownMenuSeparator className="bg-slate-50 my-2 mx-2" />

                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="rounded-2xl flex items-center gap-3 p-4 cursor-pointer text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
                                        >
                                            <LogOut className="size-5" />
                                            <span className="font-black uppercase text-[10px] tracking-widest">Sair</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </header>

                        <main className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="p-10 md:p-14 lg:p-16 max-w-[1600px] mx-auto w-full">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={pathname}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {children}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    )
}
