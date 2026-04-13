'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, 
    ShieldCheck, 
    Activity, 
    MousePointerClick, 
    TrendingUp, 
    ClipboardCheck, 
    Briefcase, 
    GraduationCap,
    DollarSign,
    RefreshCcw,
    ChevronRight,
    Search
} from 'lucide-react';
import SuperAdminServices from '@/services/superAdminServices';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SuperAdminDashboard() {
    const { id } = useParams();
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalCourses: 0,
        totalSubscriptions: 0,
        totalRevenue: 0,
        activeAdmins: 0
    });

    const [chartData, setChartData] = useState<any[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [stats, admins] = await Promise.all([
                SuperAdminServices.getStats(),
                SuperAdminServices.listAdmins()
            ]);

            // Get proper list of admins from paginated structure or array
            const adminsList = Array.isArray(admins) ? admins : (admins.items || admins.data || []);

            setMetrics({
                ...stats,
                activeAdmins: adminsList.filter((a: any) => a.isActive).length
            });

            // Mocking some chart data for demonstration if no historical data exists
            // Ideally, the backend would provide time-series data
            setChartData([
                { name: 'Jan', value: 400 },
                { name: 'Fev', value: 300 },
                { name: 'Mar', value: 600 },
                { name: 'Abr', value: 800 },
                { name: 'Mai', value: 500 },
                { name: 'Jun', value: stats.totalSubscriptions || 900 },
            ]);

        } catch (err) {
            console.error("Erro ao carregar métricas do Super Admin", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsMounted(true);
        fetchData();
    }, []);

    const statCards = [
        { 
            title: "Usuários Totais", 
            value: metrics.totalUsers, 
            change: "+12%", 
            icon: <Users className="text-blue-600" />, 
            color: "blue" 
        },
        { 
            title: "Alunos Matriculados", 
            value: metrics.totalStudents, 
            change: "+5%", 
            icon: <GraduationCap className="text-emerald-600" />, 
            color: "emerald" 
        },
        { 
            title: "Cursos Ofertados", 
            value: metrics.totalCourses, 
            change: "+2", 
            icon: <Briefcase className="text-indigo-600" />, 
            color: "indigo" 
        },
        { 
            title: "Pretensões", 
            value: metrics.totalSubscriptions, 
            change: "+18%", 
            icon: <ClipboardCheck className="text-violet-600" />, 
            color: "violet" 
        },
    ];

    if (!isMounted) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Executivo</h1>
                    <p className="text-slate-500 font-medium">Bem-vindo de volta, Super Administrador.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchData} 
                        disabled={loading}
                        className="rounded-full border-slate-200 hover:bg-slate-50 gap-2"
                    >
                        <RefreshCcw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </Button>
                    <Link href={`/gerenciador/super-admin/${id}/dashboard/admin/criar`}>
                        <Button size="sm" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white gap-2">
                             Novo Admin
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-${card.color}-50 group-hover:bg-${card.color}-100 transition-colors`}>
                                {card.icon}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${card.color}-50 text-${card.color}-600 underline-none`}>
                                {card.change}
                            </span>
                        </div>
                        <h3 className="text-slate-500 font-semibold text-sm uppercase tracking-wider">{card.title}</h3>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-black text-slate-900">{loading ? "..." : card.value}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Growth Chart */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Crescimento de Inscrições</h2>
                            <p className="text-slate-500 text-sm">Volume de solicitações nos últimos 6 meses</p>
                        </div>
                        <div className="flex bg-slate-50 p-1 rounded-xl">
                            <button className="px-4 py-2 text-xs font-bold rounded-lg bg-white shadow-sm text-slate-900 transition-all">Anual</button>
                            <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all">Mensal</button>
                        </div>
                    </div>
                    
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                                    dy={10} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '24px', 
                                        border: 'none', 
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' 
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#6366f1" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#colorValue)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Side Content / Recent Activity */}
                <div className="space-y-8">
                    <motion.div
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.5 }}
                         className="bg-slate-900 p-8 rounded-[40px] text-white overflow-hidden relative"
                    >
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold mb-2">Equipe Técnica</h2>
                            <p className="text-slate-400 text-sm mb-6">Administradores ativos que gerenciam o conteúdo hoje.</p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/10 rounded-3xl backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">L</div>
                                        <div>
                                            <p className="text-sm font-bold">Leon Trindade</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Online agora</p>
                                        </div>
                                    </div>
                                    <ShieldCheck className="text-blue-400 size-5" />
                                </div>
                                
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-3xl hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <div className="size-10 rounded-full bg-slate-700 flex items-center justify-center font-bold opacity-50 text-slate-500 italic">?</div>
                                        <div>
                                            <p className="text-sm font-bold italic">Outros Admins</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{metrics.activeAdmins} Ativos</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-slate-600 size-5 group-hover:text-white transition-colors" />
                                </div>
                            </div>

                            <Link href={`/gerenciador/super-admin/${id}/dashboard/admin`}>
                                <Button variant="link" className="text-blue-400 p-0 mt-6 h-auto font-bold flex items-center gap-1 group">
                                    Gerenciar todos os usuários <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>

                        {/* Decoration blobs */}
                        <div className="absolute -bottom-20 -right-20 size-60 rounded-full bg-blue-600/20 blur-[100px]" />
                    </motion.div>

                    <motion.div
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.6 }}
                         className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm"
                    >
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                             Estado do Sistema
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase mb-1">Cursos Ativos</p>
                                    <p className="text-2xl font-black text-slate-800">{metrics.totalCourses}</p>
                                </div>
                                <Activity className="text-emerald-500 animate-pulse" />
                            </div>
                            
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "75%" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/20" 
                                />
                            </div>

                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                O sistema está operando normalmente. Novos editais podem ser publicados a qualquer momento pelo painel de documentos.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

