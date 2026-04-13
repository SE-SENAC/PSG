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
    ChevronRight,
    Settings,
    Users,
    Key,
    Activity,
    Tags,
    ShieldAlert,
    BarChart3,
    Crown,
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
        { nome: "Dashboard", href: `/gerenciador/super-admin/${id}/dashboard`, icon: LayoutDashboard },
        { nome: "Gestão Admins", href: `/gerenciador/super-admin/${id}/dashboard/admin`, icon: ShieldAlert },
        { nome: "Cursos", href: `/gerenciador/super-admin/${id}/dashboard/cursos`, icon: BookOpen },
        { nome: "Categorias", href: `/gerenciador/super-admin/${id}/dashboard/categorias`, icon: Tags },
        { nome: "Inscrições", href: `/gerenciador/super-admin/${id}/dashboard/inscricoes`, icon: Key },
        { nome: "Diretrizes", href: `/gerenciador/super-admin/${id}/dashboard/diretrizes`, icon: ClipboardList },
        { nome: "Edital", href: `/gerenciador/super-admin/${id}/dashboard/edital`, icon: FileText },
        { nome: "Resultados", href: `/gerenciador/super-admin/${id}/dashboard/resultados`, icon: ActivitySquare },
        { nome: "Logs de Atividade", href: `/gerenciador/super-admin/${id}/dashboard/log-de-atividade`, icon: Activity },
    ];

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        router.push("/gerenciador/super-admin/login");
    };

    return (
        <TooltipProvider delayDuration={0}>
            <SidebarProvider defaultOpen={true}>
                <div className="flex min-h-screen w-full bg-[#f8fafc] dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-white overflow-hidden transition-colors duration-500">
                    <Sidebar collapsible="icon" className="border-r border-slate-200 dark:border-slate-800 shadow-2xl bg-[#004587] text-white border-none transition-colors duration-500">
                        <SidebarHeader className="h-24 flex items-start justify-center px-6 border-b border-white/10 bg-[#00386d]">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-xl">
                                    <img 
                                        src="https://fabianocage.com.br/senacse/wp-content/uploads/2026/02/logo-pos-vertical.svg" 
                                        alt="Senac Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
                                    <span className="font-black text-xs leading-none text-white tracking-tight uppercase">Senac Sergipe</span>
                                    <span className="text-[10px] text-[#f58220] uppercase font-black tracking-widest mt-1.5 flex items-center gap-1">
                                        <Crown className="size-2.5" />
                                        Super Admin
                                    </span>
                                </div>
                            </div>
                        </SidebarHeader>

                        <SidebarContent className="bg-[#004587] border-none custom-scrollbar">
                            <SidebarGroup>
                                <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden px-6 text-white/30 font-black text-[10px] uppercase tracking-[0.2em] mb-4 mt-6">Administração Master</SidebarGroupLabel>
                                <SidebarMenu className="px-3 space-y-1.5 font-medium">
                                    {sidebar_elems.map((item) => {
                                        const isDashboard = item.href === `/gerenciador/super-admin/${id}/dashboard`;
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
                                                            ? "bg-[#f58220] text-white shadow-lg shadow-[#f58220]/20 hover:bg-[#e67710] hover:text-white"
                                                            : "text-white/70 hover:bg-white/10 hover:text-white"
                                                    )}
                                                >
                                                    <Link href={item.href} className="flex items-center gap-4">
                                                        <Icon className={cn("size-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                                                        <span className="font-bold text-sm tracking-tight">{item.nome}</span>
                                                        {isActive && (
                                                            <motion.div 
                                                                layoutId="active-indicator-super"
                                                                className="ml-auto h-2 w-2 rounded-full bg-white group-data-[collapsible=icon]:hidden shadow-[0_0_10px_white]"
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

                        <SidebarFooter className="p-6 border-t border-white/10 bg-[#00386d]">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 border border-white/10 shadow-inner">
                                    <User size={20} className="text-[#f58220]" />
                                </div>
                                <div className="flex flex-col flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                                    <span className="text-xs font-black text-white truncate tracking-tight">{userName || "Super User"}</span>
                                    <span className="text-[10px] text-white/40 truncate font-bold uppercase tracking-tighter italic">{userEmail || "master@senac.br"}</span>
                                </div>
                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    size="icon"
                                    className="size-10 text-white/40 hover:text-[#f58220] hover:bg-[#f58220]/10 transition-all group-data-[collapsible=icon]:hidden rounded-2xl"
                                >
                                    <LogOut size={18} />
                                </Button>
                            </div>
                        </SidebarFooter>
                    </Sidebar>

                    <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-500">
                        <header className="flex h-24 items-center px-10 bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 justify-between backdrop-blur-xl transition-colors duration-500">
                            <div className="flex items-center gap-8">
                                <SidebarTrigger className="text-slate-400 hover:text-[#004587] hover:bg-slate-100 rounded-2xl p-3 transition-all" />
                                <Separator orientation="vertical" className="h-10 bg-slate-200 mr-2" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-[#f58220] uppercase tracking-widest leading-none mb-2 underline decoration-[#f58220]/30 decoration-2 underline-offset-4">Portal PSG Master</span>
                                    <h2 className="text-xl font-black text-[#004587] dark:text-white tracking-tight leading-none uppercase">
                                        {sidebar_elems.find(e => {
                                            const isDashboard = e.href === `/gerenciador/super-admin/${id}/dashboard`;
                                            return isDashboard ? pathname === e.href : pathname.startsWith(e.href);
                                        })?.nome || "Painel de Controle"}
                                    </h2>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="hidden xl:flex items-center px-5 py-2.5 rounded-2xl bg-[#004587]/5 dark:bg-[#f58220]/5 border border-[#004587]/10 dark:border-[#f58220]/10">
                                    <BarChart3 className="size-4 text-[#f58220] mr-3" />
                                    <span className="text-[10px] font-black text-[#004587] dark:text-[#f58220] uppercase tracking-widest">Monitoramento Regional 2026</span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-2xl text-slate-400 hover:text-[#004587] hover:bg-slate-100 transition-all size-12 border border-transparent hover:border-slate-200 shadow-sm relative overflow-hidden group">
                                            <Settings className="size-6 group-hover:rotate-90 transition-transform duration-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-72 rounded-[32px] p-4 border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                                        <DropdownMenuLabel className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Configurações do Sistema</span>
                                                <span className="text-[10px] text-slate-400 font-medium">Personalize sua experiência administrativa</span>
                                            </div>
                                        </DropdownMenuLabel>
                                        
                                        <DropdownMenuSeparator className="bg-slate-50 my-2 mx-2" />
                                        
                                        <div className="p-2 space-y-1">
                                            <DropdownMenuItem 
                                                onClick={() => dispatch(setTheme('light'))}
                                                className={cn(
                                                    "rounded-2xl flex items-center justify-between p-4 cursor-pointer transition-all",
                                                    themeMode === 'light' ? "bg-[#004587]/5 text-[#004587]" : "hover:bg-slate-50 text-slate-600"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Sun className={cn("size-5", themeMode === 'light' ? "text-[#f58220]" : "text-slate-400")} />
                                                    <span className="font-bold">Modo Claro</span>
                                                </div>
                                                {themeMode === 'light' && <div className="size-1.5 rounded-full bg-[#004587]" />}
                                            </DropdownMenuItem>
                                            
                                            <DropdownMenuItem 
                                                onClick={() => dispatch(setTheme('dark'))}
                                                className={cn(
                                                    "rounded-2xl flex items-center justify-between p-4 cursor-pointer transition-all",
                                                    themeMode === 'dark' ? "bg-slate-900 text-white shadow-xl" : "hover:bg-slate-50 text-slate-600"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Moon className={cn("size-5", themeMode === 'dark' ? "text-[#f58220]" : "text-slate-400")} />
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
                                            <span className="font-black uppercase text-[10px] tracking-widest">Sair da Sessão</span>
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
